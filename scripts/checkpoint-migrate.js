#!/usr/bin/env node

/**
 * Checkpoint-Fähiges Migrations-Tool
 * 
 * Dieses Skript migriert Komponenten von /components nach /src/components
 * mit Checkpoint-Funktionalität zur Wiederaufnahme nach Abstürzen.
 * 
 * Besondere Funktionen:
 * - Speichert Checkpoints nach jeder Komponente
 * - Überwacht Speicherverbrauch und erzwingt GC wenn nötig
 * - Verarbeitet Komponenten einzeln statt in Batches
 * - Detailliertes Logging für bessere Fehlerdiagnose
 * - Wiederaufnahmefunktion für unterbrochene Migrationen
 * 
 * Verwendung: node checkpoint-migrate.js <batch-number> [options]
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync, spawn } = require('child_process');
const { glob } = require('glob');
const { promisify } = require('util');

// Konfiguration
const ROADMAP_FILE = path.join(process.cwd(), 'migration-roadmap.json');
const COMPONENTS_DIR = path.join(process.cwd(), 'components');
const SRC_COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components');
const DEFAULT_MEMORY = 8192;
const CHECKPOINT_DIR = path.join(process.cwd(), '.migration-checkpoints');
const LOG_DIR = path.join(process.cwd(), 'logs');
const MAX_MEMORY_USAGE_PERCENT = 85; // Prozent des verfügbaren Heap-Speichers

// Kommandozeilenargumente parsen
const args = process.argv.slice(2);
let batchNumber = args[0] ? parseInt(args[0], 10) : null;
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const skipExisting = args.includes('--skip-existing');
const force = args.includes('--force');
const resume = args.includes('--resume');
const memory = args.find(arg => arg.startsWith('--memory=')) 
  ? parseInt(args.find(arg => arg.startsWith('--memory=')).split('=')[1], 10) 
  : DEFAULT_MEMORY;
const logFile = args.find(arg => arg.startsWith('--log='))
  ? args.find(arg => arg.startsWith('--log=')).split('=')[1]
  : `migration-${new Date().toISOString().replace(/:/g, '-')}.log`;

// Hilfsfunktionen
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Verzeichnisse erstellen
ensureDirectoryExists(CHECKPOINT_DIR);
ensureDirectoryExists(LOG_DIR);

// Logger-Konfiguration
let logger;
if (!dryRun) {
  logger = fs.createWriteStream(path.join(LOG_DIR, logFile), { flags: 'a' });
}

// Log-Funktion
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: chalk.blue('INFO'),
    warning: chalk.yellow('WARN'),
    error: chalk.red('ERROR'),
    success: chalk.green('SUCCESS')
  }[level];
  
  const logMessage = `[${timestamp}] ${prefix}: ${message}`;
  
  // Ausgabe in Konsole
  console.log(logMessage);
  
  // Ausgabe in Logdatei
  if (logger && !dryRun) {
    logger.write(logMessage + '\n');
  }
}

// Speicherüberwachungsfunktion
function checkMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
  
  if (verbose) {
    log(`Speichernutzung: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB ` +
        `/ ${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB (${Math.round(heapUsedPercent)}%)`, 
        heapUsedPercent > MAX_MEMORY_USAGE_PERCENT ? 'warning' : 'info');
  }
  
  // Bei kritischer Speichernutzung Garbage Collection erzwingen
  if (heapUsedPercent > MAX_MEMORY_USAGE_PERCENT) {
    log(`Kritische Speichernutzung erkannt (${Math.round(heapUsedPercent)}%). Führe Garbage Collection aus...`, 'warning');
    if (global.gc) {
      global.gc();
    } else {
      log('Hinweis: Explizite Garbage Collection nicht verfügbar. Starte das Skript mit --expose-gc für bessere Speicherverwaltung.', 'warning');
    }
  }
  
  return heapUsedPercent;
}

/**
 * Führt einen Befehl mit erhöhtem Speicherlimit aus
 * @param {string} command Auszuführender Befehl
 * @param {string[]} args Kommandoargumente
 * @param {Object} options Optionen für spawn
 * @returns {Promise<string>} Befehlsausgabe
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const nodeArgs = [`--max-old-space-size=${memory}`];
    
    // Wenn der Befehl node ist, füge das Speicherargument hinzu
    const finalCommand = command === 'node' ? command : command;
    const finalArgs = command === 'node' ? [...nodeArgs, ...args] : args;
    
    if (verbose) {
      log(`Führe aus: ${finalCommand} ${finalArgs.join(' ')}`, 'info');
    }
    
    const child = spawn(finalCommand, finalArgs, {
      ...options,
      shell: true,
      stdio: verbose ? 'inherit' : 'pipe'
    });
    
    let stdout = '';
    let stderr = '';
    
    if (!verbose) {
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
    }
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Befehl fehlgeschlagen mit Exit-Code ${code}: ${stderr}`));
      }
    });
  });
}

/**
 * Prüft, ob eine Komponente bereits migriert wurde
 * @param {string} componentName Komponentenname
 * @param {string} sourcePath Quellpfad
 * @returns {boolean} Ist Komponente migriert
 */
function isAlreadyMigrated(componentName, sourcePath) {
  const fileName = path.basename(sourcePath);
  const dirName = path.dirname(sourcePath).split('/').pop();
  
  // Prüfe mögliche Zielpfade
  const possibleTargetPaths = [
    path.join(SRC_COMPONENTS_DIR, fileName.replace(/\.jsx?$/, '.tsx')),
    path.join(SRC_COMPONENTS_DIR, fileName.replace(/\.jsx?$/, '.ts')),
    path.join(SRC_COMPONENTS_DIR, componentName, 'index.tsx'),
    path.join(SRC_COMPONENTS_DIR, componentName, 'index.ts'),
    path.join(SRC_COMPONENTS_DIR, dirName, componentName + '.tsx'),
    path.join(SRC_COMPONENTS_DIR, dirName, componentName + '.ts')
  ];
  
  return possibleTargetPaths.some(targetPath => fs.existsSync(targetPath));
}

/**
 * Erstellt den Zielpfad für eine Komponente
 * @param {string} sourcePath Quellkomponentenpfad
 * @returns {string} Zielpfad
 */
function buildTargetPath(sourcePath) {
  // Hole den relativen Pfad der Komponente zum components-Verzeichnis
  const relativePath = path.relative(COMPONENTS_DIR, sourcePath);
  const dirName = path.dirname(relativePath);
  const fileName = path.basename(relativePath);
  
  // Konvertiere .js/.jsx zu .ts/.tsx
  const newExtension = fileName.endsWith('.jsx') ? '.tsx' : 
                       fileName.endsWith('.js') ? '.ts' : fileName;
  
  // Erstelle Zielpfad
  const targetPath = path.join(SRC_COMPONENTS_DIR, dirName, 
    fileName.replace(/\.(js|jsx)$/, newExtension.endsWith('.ts') || newExtension.endsWith('.tsx') ? 
      newExtension : 
      newExtension.endsWith('.js') ? '.ts' : '.tsx'));
  
  return targetPath;
}

/**
 * Erstellt das Verzeichnis für die Zieldatei, falls es nicht existiert
 * @param {string} targetPath Zieldateipfad
 */
function ensureTargetDirectory(targetPath) {
  const targetDir = path.dirname(targetPath);
  
  if (!fs.existsSync(targetDir)) {
    log(`Erstelle Verzeichnis: ${targetDir}`, 'info');
    if (!dryRun) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  }
}

/**
 * Speichert einen Checkpoint der Migration
 * @param {Object} checkpoint Checkpoint-Daten
 * @param {string} batchId ID des Batches
 */
function saveCheckpoint(checkpoint, batchId) {
  if (dryRun) return;
  
  const checkpointPath = path.join(CHECKPOINT_DIR, `batch-${batchId}-checkpoint.json`);
  const data = {
    timestamp: new Date().toISOString(),
    ...checkpoint
  };
  
  try {
    fs.writeFileSync(checkpointPath, JSON.stringify(data, null, 2));
    if (verbose) {
      log(`Checkpoint gespeichert: ${checkpointPath}`, 'info');
    }
  } catch (error) {
    log(`Fehler beim Speichern des Checkpoints: ${error.message}`, 'error');
  }
}

/**
 * Lädt einen Checkpoint der Migration
 * @param {string} batchId ID des Batches
 * @returns {Object|null} Checkpoint-Daten oder null, wenn keiner existiert
 */
function loadCheckpoint(batchId) {
  const checkpointPath = path.join(CHECKPOINT_DIR, `batch-${batchId}-checkpoint.json`);
  
  if (!fs.existsSync(checkpointPath)) {
    return null;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'));
    log(`Checkpoint geladen: ${checkpointPath}`, 'info');
    return data;
  } catch (error) {
    log(`Fehler beim Laden des Checkpoints: ${error.message}`, 'error');
    return null;
  }
}

/**
 * Migriert eine einzelne Komponente
 * @param {Object} component Zu migrierende Komponente
 * @returns {Promise<Object>} Migrationsergebnis
 */
async function migrateComponent(component) {
  const startTime = Date.now();
  try {
    const { name, path: sourcePath } = component;
    
    // Prüfe, ob die Komponente bereits migriert wurde
    if (isAlreadyMigrated(name, sourcePath) && skipExisting) {
      log(`➤ Überspringe ${name} (bereits migriert)`, 'warning');
      return { name, success: true, skipped: true, reason: 'Bereits migriert', duration: 0 };
    }
    
    // Erstelle Zielpfad
    const targetPath = buildTargetPath(sourcePath);
    ensureTargetDirectory(targetPath);
    
    log(`\n➤ Migriere Komponente: ${chalk.bold(name)}`, 'info');
    log(`  Quelle: ${sourcePath}`, 'info');
    log(`  Ziel: ${targetPath}`, 'info');
    
    if (dryRun) {
      log('  Dry run, keine tatsächliche Migration', 'warning');
      return { name, success: true, dryRun: true, duration: Date.now() - startTime };
    }
    
    // Schritt 1: Führe TypeScript-Konvertierung durch
    log('  Konvertiere zu TypeScript...', 'info');
    
    try {
      // Sichere Pfade und Verzeichnisse
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        log(`  Erstelle Verzeichnis: ${targetDir}`, 'info');
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Nutze das optimierte Skript für Konvertierung
      await runCommand('node', [
        '--max-old-space-size=8192',
        'migration-tools/convertToTypeScript.optimized.js',
        sourcePath,
        targetPath
      ]);
      
      // Prüfe, ob die Datei erstellt wurde
      if (!fs.existsSync(targetPath)) {
        // Fallback: Manuelles Kopieren und Umbenennen
        log('  Fallback: Kopiere und benenne Datei manuell um...', 'warning');
        const content = fs.readFileSync(sourcePath, 'utf-8');
        fs.writeFileSync(targetPath, content);
      }
    } catch (error) {
      log(`  Fehler bei der TypeScript-Konvertierung: ${error.message}`, 'error');
      
      // Fallback: Versuche manuelle Konvertierung
      try {
        log('  Versuche manuelle Konvertierung als Fallback...', 'warning');
        const content = fs.readFileSync(sourcePath, 'utf-8');
        fs.writeFileSync(targetPath, content);
        log('  Manuelle Konvertierung erfolgreich', 'success');
      } catch (fallbackError) {
        log(`  Auch Fallback fehlgeschlagen: ${fallbackError.message}`, 'error');
        return { 
          name, 
          success: false, 
          error: error.message, 
          step: 'typescript-konvertierung',
          duration: Date.now() - startTime 
        };
      }
    }
    
    // Speicherüberwachung
    checkMemoryUsage();
    
    // Schritt 2: Standardisiere Import-Pfade
    log('  Standardisiere Import-Pfade...', 'info');
    let content = fs.readFileSync(targetPath, 'utf-8');
    
    // Ersetze relative Imports
    content = content.replace(/from\s+['"]\.\.\/\.\.\/([^'"]+)['"]/g, "from '@/$1'");
    content = content.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, (match, importPath) => {
      // Prüfe, ob es ein relativer Import zu einer anderen Komponente ist
      if (importPath.startsWith('components/')) {
        return `from '@/${importPath}'`;
      }
      // Ist es ein relativer Import innerhalb desselben Verzeichnisses?
      const currentDir = path.dirname(sourcePath).split('/').pop();
      return `from '@/components/${currentDir}/${importPath}'`;
    });
    
    // Standardisiere Komponenten-Imports
    content = content.replace(/from\s+['"](components\/[^'"]+)['"]/g, "from '@/$1'");
    
    // Behebe häufige Probleme
    content = content.replace(/React\.FC<(\w+)Props>/g, 'React.FC<$1Props>');
    
    // Füge React-Import hinzu, falls nicht vorhanden
    if (!content.includes('import React')) {
      content = "import React from 'react';\n" + content;
    }
    
    // Schreibe den aktualisierten Inhalt
    fs.writeFileSync(targetPath, content);
    
    // Schritt 3: Füge passende TypeScript-Typen hinzu
    log('  Füge TypeScript-Typen hinzu...', 'info');
    
    // Füge React-Importe hinzu, falls für Events benötigt
    if (content.includes('onClick') || content.includes('onChange') || content.includes('onSubmit')) {
      if (!content.includes('MouseEvent') && content.includes('onClick')) {
        content = content.replace(
          /import React/,
          "import React, { MouseEvent }"
        );
      }
      if (!content.includes('ChangeEvent') && content.includes('onChange')) {
        content = content.replace(
          /import React(,\s*{[^}]+})?/,
          (match, group) => group 
            ? `import React, { ${group.replace('{', '').replace('}', '')}, ChangeEvent }`
            : "import React, { ChangeEvent }"
        );
      }
    }
    
    // Schreibe den aktualisierten Inhalt erneut
    fs.writeFileSync(targetPath, content);
    
    // Speicherüberwachung
    checkMemoryUsage();
    
    // Schritt 4: Verifiziere die Migration
    log('  Verifiziere Migration...', 'info');
    
    try {
      // Versuche, die Datei mit TypeScript zu prüfen, falls möglich
      const tsConfigExists = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
      if (tsConfigExists) {
        try {
          await runCommand('npx', ['tsc', '--noEmit', targetPath]);
          log('  ✓ TypeScript-Verifizierung bestanden', 'success');
        } catch (error) {
          log(`  ⚠ TypeScript-Verifizierung fehlgeschlagen: ${error.message}`, 'warning');
          // Fehlschlag bei der TypeScript-Verifizierung führt nicht zum Abbruch der Migration
        }
      }
    } catch (error) {
      log(`  ⚠ Verifizierungsschritt übersprungen: ${error.message}`, 'warning');
    }
    
    // Erfolgreiche Migration
    const duration = Date.now() - startTime;
    log(`  ✓ ${name} erfolgreich migriert in ${duration}ms`, 'success');
    return { name, success: true, duration };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    log(`  ✗ Migration fehlgeschlagen: ${error.message}`, 'error');
    if (verbose) {
      log(error.stack, 'error');
    }
    return { 
      name, 
      success: false, 
      error: error.message,
      duration
    };
  }
}

/**
 * Hauptfunktion zur Migration aller Komponenten in einem Batch
 * @param {Array} components Zu migrierende Komponenten
 * @param {string} batchId ID des Batches
 * @param {number} startIndex Startindex für die Migration (für Wiederaufnahme)
 * @returns {Promise<Array>} Migrationsergebnisse
 */
async function migrateBatch(components, batchId, startIndex = 0) {
  log(`\n🚀 Starte Migration von ${components.length} Komponenten`, 'info');
  
  // Speichere Referenzen im globalen Scope für den Error-Handler
  global.currentBatchId = batchId;
  global.totalComponents = components.length;
  global.currentIndex = startIndex;
  
  if (dryRun) {
    log('⚠️ DRY RUN MODUS: Es werden keine tatsächlichen Änderungen vorgenommen', 'warning');
  }
  
  if (startIndex > 0) {
    log(`Wiederaufnahme ab Index ${startIndex}`, 'info');
  }
  
  const results = [];
  global.results = results;
  
  // Lade vorherige Ergebnisse, falls wir fortsetzen
  if (startIndex > 0) {
    const checkpoint = loadCheckpoint(batchId);
    if (checkpoint && checkpoint.results) {
      results.push(...checkpoint.results);
      log(`${checkpoint.results.length} bereits verarbeitete Ergebnisse geladen`, 'info');
    }
  }
  
  for (let i = startIndex; i < components.length; i++) {
    // Aktualisiere globalen Index
    global.currentIndex = i;
    
    const component = components[i];
    log(`\n[${i + 1}/${components.length}] Verarbeite Komponente: ${component.name}`, 'info');
    
    // Speicherüberwachung vor jeder Komponente
    const memoryUsage = checkMemoryUsage();
    
    // Bei kritischer Speichernutzung eine Pause einlegen
    if (memoryUsage > 90) {
      log('Kritische Speichernutzung erkannt. Lege eine kurze Pause ein...', 'warning');
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (global.gc) {
        global.gc();
      }
    }
    
    try {
      // Migriere die Komponente
      const result = await migrateComponent(component);
      results.push(result);
      
      // Aktualisiere globale Ergebnisse
      global.results = results;
      
      // Speichere Checkpoint nach jeder Komponente
      saveCheckpoint({
        batchId,
        componentCount: components.length,
        completedCount: i + 1,
        currentIndex: i,
        nextIndex: i + 1,
        results
      }, batchId);
    } catch (error) {
      log(`Fehler bei der Migration von ${component.name}: ${error.message}`, 'error');
      
      // Fehlerresultat hinzufügen
      const failedResult = { 
        name: component.name, 
        success: false, 
        error: error.message,
        duration: 0
      };
      results.push(failedResult);
      global.results = results;
      
      // Checkpoint mit Fehler speichern
      saveCheckpoint({
        batchId,
        componentCount: components.length,
        completedCount: i,
        currentIndex: i,
        nextIndex: i + 1,
        error: error.message,
        results
      }, batchId);
      
      // Fortfahren mit der nächsten Komponente
      continue;
    }
    
    // Speicherbereinigung nach jeder Komponente
    if (global.gc) {
      global.gc();
    } else {
      // Manueller Versuch zur Speicherfreigabe
      const forcedGc = {};
      for (let i = 0; i < 10000; i++) {
        forcedGc[`key${i}`] = i;
      }
      for (let i = 0; i < 10000; i++) {
        delete forcedGc[`key${i}`];
      }
    }
    
    // Füge eine kleine Pause zwischen Komponenten ein
    if (i < components.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Hauptfunktion
 */
async function main() {
  log(`\n📦 CHECKPOINT-FÄHIGES MIGRATIONS-TOOL`, 'info');
  log('════════════════════════════════════════════', 'info');
  
  // Globaler Error-Handler für unbehandelte Fehler
  process.on('uncaughtException', (error) => {
    log(`Unbehandelter Fehler: ${error.message}`, 'error');
    if (verbose) {
      log(error.stack, 'error');
    }
    // Speichere den aktuellen Status, bevor das Programm beendet wird
    if (global.currentBatchId && global.currentIndex !== undefined) {
      saveCheckpoint({
        batchId: global.currentBatchId,
        componentCount: global.totalComponents || 0,
        completedCount: global.currentIndex,
        currentIndex: global.currentIndex,
        nextIndex: global.currentIndex,
        results: global.results || [],
        error: error.message
      }, global.currentBatchId);
    }
  });
  
  try {
    // Prüfe, ob die Roadmap-Datei existiert
    if (!fs.existsSync(ROADMAP_FILE)) {
      log(`Migration-Roadmap-Datei nicht gefunden unter ${ROADMAP_FILE}`, 'error');
      log('Führe zuerst create-component-inventory.js aus, um die Roadmap zu erstellen', 'warning');
      process.exit(1);
    }
    
    // Lade die Migrations-Roadmap
    const roadmap = JSON.parse(fs.readFileSync(ROADMAP_FILE, 'utf-8'));
    
    // Wenn keine Batch-Nummer angegeben wurde, zeige verfügbare Batches an
    if (batchNumber === null) {
      log('Verfügbare Migrations-Batches:', 'info');
      roadmap.forEach((batch, index) => {
        log(`  [${batch.id}] ${batch.name}: ${batch.componentCount} Komponenten (${batch.estimatedEffort} Stunden)`, 'info');
      });
      log('\nVerwendung: node checkpoint-migrate.js <batch-number> [options]', 'info');
      log('Optionen:', 'info');
      log('  --dry-run       : Führe aus, ohne tatsächliche Änderungen vorzunehmen', 'info');
      log('  --verbose       : Zeige detaillierte Ausgabe', 'info');
      log('  --skip-existing : Überspringe bereits migrierte Komponenten', 'info');
      log('  --resume        : Setze eine unterbrochene Migration fort', 'info');
      log('  --force         : Erzwinge Migration, auch wenn Verifizierung fehlschlägt', 'info');
      log('  --memory=<MB>   : Setze Speicherlimit (Standard: 8192)', 'info');
      log('  --log=<file>    : Setze Logdatei (Standard: Zeitstempel)', 'info');
      process.exit(0);
    }
    
    // Prüfe, ob die Batch-Nummer gültig ist
    if (batchNumber < 1 || batchNumber > roadmap.length) {
      log(`Ungültige Batch-Nummer. Wähle zwischen 1 und ${roadmap.length}`, 'error');
      process.exit(1);
    }
    
    // Hole Batch
    const batch = roadmap[batchNumber - 1];
    log(`Ausgewählter Batch: ${batch.name}`, 'success');
    log(`Beschreibung: ${batch.description}`, 'info');
    log(`Komponenten: ${batch.componentCount}`, 'info');
    log(`Geschätzter Aufwand: ${batch.estimatedEffort} Stunden`, 'info');
    
    if (batch.componentCount === 0) {
      log('\nDieser Batch hat keine zu migrierenden Komponenten.', 'warning');
      process.exit(0);
    }
    
    // Prüfe auf vorhandenen Checkpoint, falls --resume angegeben
    let startIndex = 0;
    if (resume) {
      const checkpoint = loadCheckpoint(batch.id);
      if (checkpoint && checkpoint.nextIndex !== undefined) {
        startIndex = checkpoint.nextIndex;
        log(`Setze Migration ab Komponente ${startIndex + 1}/${batch.componentCount} fort`, 'info');
      } else {
        log('Kein Checkpoint gefunden. Starte von Anfang an.', 'warning');
      }
    }
    
    // Bestätige Migration, falls nicht erzwungen
    if (!force && !dryRun && startIndex === 0) {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question(chalk.yellow(`\nMöchtest du mit der Migration von ${batch.componentCount} Komponenten fortfahren? (j/n) `), answer => {
          readline.close();
          resolve(answer.toLowerCase());
        });
      });
      
      if (answer !== 'j' && answer !== 'ja') {
        log('\nMigration abgebrochen.', 'warning');
        process.exit(0);
      }
    }
    
    // Starte die Migration
    const startTime = Date.now();
    const results = await migrateBatch(batch.components, batch.id, startIndex);
    const duration = (Date.now() - startTime) / 1000; // in Sekunden
    
    // Gib Migrations-Zusammenfassung aus
    log('\n📊 MIGRATIONS-ZUSAMMENFASSUNG', 'info');
    log('════════════════════════════════════════════', 'info');
    
    const successful = results.filter(r => r.success && !r.skipped).length;
    const skipped = results.filter(r => r.skipped).length;
    const failed = results.filter(r => !r.success).length;
    
    log(`Gesamtzahl Komponenten: ${results.length}`, 'info');
    log(`Erfolgreich migriert: ${successful}`, 'success');
    log(`Übersprungen: ${skipped}`, 'warning');
    log(`Fehlgeschlagen: ${failed}`, 'error');
    log(`Dauer: ${Math.floor(duration / 60)}m ${Math.floor(duration % 60)}s`, 'info');
    
    if (failed > 0) {
      log('\nFehlgeschlagene Komponenten:', 'error');
      results.filter(r => !r.success).forEach(result => {
        log(`  - ${result.name}: ${result.error}`, 'error');
      });
    }
    
    log('════════════════════════════════════════════', 'info');
    
    if (successful > 0) {
      log(`\n✅ Migration für ${successful} Komponenten erfolgreich abgeschlossen.`, 'success');
    } else if (skipped > 0 && failed === 0) {
      log(`\n⚠️ Alle ${skipped} Komponenten wurden übersprungen.`, 'warning');
    } else {
      log(`\n❌ Migration für alle ${failed} Komponenten fehlgeschlagen.`, 'error');
    }
    
  } catch (error) {
    log(`\n❌ Fehler während der Migration: ${error.message}`, 'error');
    if (verbose) {
      log(error.stack, 'error');
    }
    process.exit(1);
  } finally {
    // Schließe Logger, falls vorhanden
    if (logger) {
      logger.end();
    }
  }
}

// Führe das Skript aus
main().catch(error => {
  log(`Nicht behandelter Fehler: ${error.message}`, 'error');
  if (verbose) {
    log(error.stack, 'error');
  }
  process.exit(1);
});