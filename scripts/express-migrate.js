#!/usr/bin/env node

/**
 * EXPRESS MIGRATION TOOL
 * 
 * Schnelles Migrations-Tool für die Massenkonvertierung von React-Komponenten
 * von /components nach /src/components mit minimaler TypeScript-Konvertierung.
 *
 * Priorisiert Geschwindigkeit über Perfektion und Funktionalität über Typsicherheit.
 * 
 * Nutzung: node express-migrate.js [--options]
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { execSync, spawn } = require('child_process');
const os = require('os');

// Konfiguration
const SOURCE_DIR = path.join(process.cwd(), 'components');
const TARGET_DIR = path.join(process.cwd(), 'src', 'components');
const MAX_WORKERS = Math.max(1, os.cpus().length - 1);
const LOG_FILE = path.join(process.cwd(), 'express-migration.log');
const PROGRESS_FILE = path.join(process.cwd(), 'migration-progress.json');

// Kommandozeilen-Argumente
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');
const SKIP_ERRORS = args.includes('--skip-errors');
const FORCE = args.includes('--force');
const IGNORE_TS_ERRORS = args.includes('--ignore-ts-errors');
const BATCH_SIZE = args.includes('--batch-size') 
  ? parseInt(args[args.indexOf('--batch-size') + 1], 10) 
  : 10;

// Globale Status-Variablen
let startTime = Date.now();
let migratedCount = 0;
let errorCount = 0;
let skippedCount = 0;
let totalComponents = 0;

// Stream-Logger für große Ausgaben
const logger = fs.createWriteStream(LOG_FILE, { flags: 'w' });
function log(message) {
  logger.write(message + '\n');
  if (VERBOSE) {
    console.log(message);
  }
}

/**
 * Aufspüren aller Komponentendateien
 */
function findAllComponents() {
  try {
    const files = glob.sync('components/**/*.{jsx,js}', {
      ignore: ['**/node_modules/**', '**/*.test.*', '**/*.spec.*', '**/__tests__/**']
    });
    return files.filter(file => 
      !file.includes('.test.') && 
      !file.includes('.spec.') && 
      !file.includes('__tests__') &&
      !file.includes('.stories.')
    );
  } catch (err) {
    console.error('Fehler beim Suchen der Komponenten:', err);
    return [];
  }
}

/**
 * Express-Konvertierung einer einzelnen Komponente zu TypeScript
 */
function expressConvertToTypeScript(content, sourceFilePath) {
  // Dateiendung überprüfen für korrekte Zieldatei
  const extension = path.extname(sourceFilePath);
  const isJSX = extension === '.jsx' || content.includes('React') || content.includes('</') || content.includes('/>');
  const newExtension = isJSX ? '.tsx' : '.ts';
  
  // TypeScript schnelle Konvertierung
  let tsContent = content;
  
  // 1. React-Import hinzufügen, falls nicht vorhanden
  if (isJSX && !tsContent.includes('import React')) {
    tsContent = "import React from 'react';\n" + tsContent;
  }
  
  // 2. FC<any> für Komponenten hinzufügen
  if (isJSX) {
    // Funktionskomponente identifizieren
    const functionComponentRegex = /function\s+([A-Z][a-zA-Z0-9_]*)\s*\(\s*(?:props|{[^}]*})\s*\)/g;
    tsContent = tsContent.replace(functionComponentRegex, (match, componentName) => {
      return `const ${componentName}: React.FC<any> = (props) =>`; 
    });
    
    // Arrow-Funktionen identifizieren
    const arrowComponentRegex = /const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*\(\s*(?:props|{[^}]*})\s*\)\s*=>/g;
    tsContent = tsContent.replace(arrowComponentRegex, (match, componentName) => {
      return `const ${componentName}: React.FC<any> = (props) =>`;
    });
    
    // Export default Funktionen
    const exportDefaultFuncRegex = /export\s+default\s+function\s+([A-Z][a-zA-Z0-9_]*)\s*\(\s*(?:props|{[^}]*})\s*\)/g;
    tsContent = tsContent.replace(exportDefaultFuncRegex, (match, componentName) => {
      return `const ${componentName}: React.FC<any> = (props) => {\n  // @ts-ignore\n`;
    });
  }
  
  // 3. Event Handler mit any typisieren
  tsContent = tsContent.replace(/function\s+handle([A-Z][a-zA-Z0-9_]*)\s*\(\s*([a-zA-Z0-9_]*)\s*\)/g, 
                                'function handle$1($2: any)');
  tsContent = tsContent.replace(/const\s+handle([A-Z][a-zA-Z0-9_]*)\s*=\s*\(\s*([a-zA-Z0-9_]*)\s*\)\s*=>/g, 
                                'const handle$1 = ($2: any) =>');
  
  // 4. setState und useRef mit any typisieren
  tsContent = tsContent.replace(/useState\(/g, 'useState<any>(');
  tsContent = tsContent.replace(/useRef\(/g, 'useRef<any>(');
  
  // 5. Export anpassen, wenn durch FC Umbenennung verändert
  if (tsContent.includes('const ') && tsContent.includes(': React.FC<any>') && 
      !tsContent.includes('export default') && tsContent.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*:/)) {
    const componentNameMatch = tsContent.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*:/);
    if (componentNameMatch && componentNameMatch[1]) {
      tsContent = tsContent + `\n\nexport default ${componentNameMatch[1]};\n`;
    }
  }
  
  // 6. TS-Ignore für potentiell problematische Stellen
  if (tsContent.includes('?.') || tsContent.includes('??')) {
    tsContent = tsContent.replace(/(\s*)(.*\?\.)/, '$1// @ts-ignore\n$1$2');
    tsContent = tsContent.replace(/(\s*)(.*\?\?)/, '$1// @ts-ignore\n$1$2');
  }
  
  // 7. Import-Pfade standardisieren
  tsContent = standardizeImportPaths(tsContent, sourceFilePath);
  
  return {
    content: tsContent,
    extension: newExtension
  };
}

/**
 * Standardisierung von Import-Pfaden
 */
function standardizeImportPaths(content, sourcePath) {
  let updatedContent = content;
  
  // Relativen Komponenten-Import zu @/components konvertieren
  updatedContent = updatedContent.replace(/from\s+['"]\.\.\/components\/([^'"]+)['"]/g, "from '@/components/$1'");
  updatedContent = updatedContent.replace(/from\s+['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g, "from '@/components/$1'");
  
  // Andere relative Imports zu absoluten @/ Imports konvertieren
  updatedContent = updatedContent.replace(/from\s+['"]\.\.\/\.\.\/([^'"]+)['"]/g, "from '@/$1'");
  updatedContent = updatedContent.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, (match, importPath) => {
    // Nicht @/ hinzufügen, wenn es bereits eine Node-Modul-Import ist
    if (importPath.startsWith('./') || 
        importPath.startsWith('../') ||
        importPath.includes('/')) {
      return `from '@/${importPath}'`;
    }
    return match;
  });
  
  // Direkten /components Import zu @/components konvertieren
  updatedContent = updatedContent.replace(/from\s+['"]\/components\/([^'"]+)['"]/g, "from '@/components/$1'");
  
  // Imports von gleicher Ebene beibehalten
  updatedContent = updatedContent.replace(/from\s+['"]\.\/(.*)['"]/g, "from './$1'");
  
  return updatedContent;
}

/**
 * Komponente migrieren - Hauptfunktion
 */
async function migrateComponent(sourcePath) {
  try {
    // Zielpfad bestimmen
    const relativeSourcePath = path.relative(SOURCE_DIR, sourcePath);
    const targetDir = path.join(TARGET_DIR, path.dirname(relativeSourcePath));
    
    // Datei lesen
    const content = fs.readFileSync(sourcePath, 'utf-8');
    
    // Zu TypeScript konvertieren
    const { content: tsContent, extension } = expressConvertToTypeScript(content, sourcePath);
    
    // Zieldateiname bestimmen
    const sourceFileName = path.basename(sourcePath);
    const targetFileName = sourceFileName.replace(/\.(jsx?|tsx?)$/, '') + extension;
    const targetPath = path.join(targetDir, targetFileName);
    
    // Zielverzeichnis erstellen, falls nicht vorhanden
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Datei schreiben, wenn nicht im Dry-Run-Modus
    if (!DRY_RUN) {
      fs.writeFileSync(targetPath, tsContent);
    }
    
    return {
      success: true,
      sourcePath,
      targetPath,
      message: `Erfolgreich migriert: ${path.basename(sourcePath)} -> ${path.basename(targetPath)}`
    };
  } catch (error) {
    return {
      success: false,
      sourcePath,
      error: error.message
    };
  }
}

/**
 * Worker-Thread-Code für parallel Ausführung
 */
if (!isMainThread) {
  const { sourcePaths } = workerData;
  
  (async () => {
    const results = [];
    
    for (const sourcePath of sourcePaths) {
      try {
        const result = await migrateComponent(sourcePath);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          sourcePath,
          error: error.message
        });
      }
    }
    
    parentPort.postMessage(results);
  })();
}

/**
 * Batch von Komponenten migrieren
 */
async function migrateBatch(sourcePaths) {
  return new Promise((resolve) => {
    const worker = new Worker(__filename, {
      workerData: { sourcePaths }
    });
    
    worker.on('message', (results) => {
      resolve(results);
    });
    
    worker.on('error', (error) => {
      console.error(`Worker-Fehler: ${error.message}`);
      resolve(sourcePaths.map(sourcePath => ({
        success: false,
        sourcePath,
        error: `Worker-Fehler: ${error.message}`
      })));
    });
  });
}

/**
 * Fortschritt speichern
 */
function saveProgress(components, results) {
  const progress = {
    startTime,
    currentTime: Date.now(),
    duration: (Date.now() - startTime) / 1000,
    totalComponents,
    migratedCount,
    errorCount,
    skippedCount,
    percentComplete: Math.round((migratedCount / totalComponents) * 100),
    recentResults: results.slice(0, 5),
    errors: results.filter(r => !r.success).slice(0, 10).map(r => ({
      file: path.basename(r.sourcePath),
      error: r.error
    }))
  };
  
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  
  // Konsolenausgabe
  const minutes = Math.floor(progress.duration / 60);
  const seconds = Math.floor(progress.duration % 60);
  console.log(`\n=== FORTSCHRITT: ${progress.percentComplete}% ===`);
  console.log(`Migriert: ${migratedCount}/${totalComponents} | Fehler: ${errorCount} | Übersprungen: ${skippedCount}`);
  console.log(`Zeit: ${minutes}m ${seconds}s | Geschwindigkeit: ${Math.round(migratedCount / (progress.duration / 60))} Komponenten/min`);
  console.log('=====================================');
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log('\n🚀 EXPRESS-MIGRATION GESTARTET');
  console.log('Maximale Geschwindigkeit, minimale Typisierung\n');
  
  if (DRY_RUN) {
    console.log('⚠️ DRY-RUN MODUS: Keine tatsächlichen Änderungen werden vorgenommen');
  }
  
  try {
    // Zielverzeichnis erstellen, falls nicht vorhanden
    if (!fs.existsSync(TARGET_DIR)) {
      fs.mkdirSync(TARGET_DIR, { recursive: true });
    }
    
    // Alle Komponenten finden
    console.log('🔍 Suche alle Komponenten...');
    const allComponents = findAllComponents();
    totalComponents = allComponents.length;
    console.log(`Gefunden: ${totalComponents} Komponenten\n`);
    
    // Komponenten in Batches verarbeiten
    const batchCount = Math.ceil(allComponents.length / BATCH_SIZE);
    
    for (let i = 0; i < batchCount; i++) {
      const batchComponents = allComponents.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
      console.log(`Verarbeite Batch ${i + 1}/${batchCount} (${batchComponents.length} Komponenten)...`);
      
      // Mehrere Batches parallel verarbeiten mit Worker-Threads
      const workerCount = Math.min(MAX_WORKERS, Math.ceil(batchComponents.length / 3));
      const componentsPerWorker = Math.ceil(batchComponents.length / workerCount);
      const workerPromises = [];
      
      for (let j = 0; j < workerCount; j++) {
        const workerComponents = batchComponents.slice(j * componentsPerWorker, (j + 1) * componentsPerWorker);
        if (workerComponents.length > 0) {
          workerPromises.push(migrateBatch(workerComponents));
        }
      }
      
      // Auf Abschluss aller Worker warten
      const batchResults = await Promise.all(workerPromises);
      const flatResults = batchResults.flat();
      
      // Ergebnisse verarbeiten
      flatResults.forEach(result => {
        if (result.success) {
          log(result.message || `Erfolgreich: ${result.sourcePath}`);
          migratedCount++;
        } else {
          log(`FEHLER: ${result.sourcePath} - ${result.error}`);
          errorCount++;
        }
      });
      
      // Fortschritt speichern
      saveProgress(allComponents, flatResults);
      
      // Speicher freigeben
      if (global.gc) global.gc();
    }
    
    // Abschlussbericht
    const duration = (Date.now() - startTime) / 1000;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    
    console.log('\n✅ EXPRESS-MIGRATION ABGESCHLOSSEN');
    console.log('=====================================');
    console.log(`Gesamtzeit: ${minutes}m ${seconds}s`);
    console.log(`Erfolgreich migrierte Komponenten: ${migratedCount}/${totalComponents} (${Math.round((migratedCount / totalComponents) * 100)}%)`);
    console.log(`Fehlgeschlagene Komponenten: ${errorCount}`);
    console.log(`Übersprungene Komponenten: ${skippedCount}`);
    console.log(`Durchschnittliche Geschwindigkeit: ${Math.round(migratedCount / (duration / 60))} Komponenten pro Minute`);
    console.log('=====================================');
    
    if (errorCount > 0) {
      console.log('\n⚠️ Es gab einige Fehler während der Migration.');
      console.log(`Details wurden in die Datei ${LOG_FILE} geschrieben.`);
      console.log('\nUm kritische Fehler zu beheben, führen Sie aus:');
      console.log('node scripts/fix-critical-errors.js');
    }
    
    // Build-Test empfehlen
    console.log('\nFühren Sie nun einen Build-Test durch:');
    console.log('npm run build');
    
  } catch (error) {
    console.error(`\n❌ Fehler während der Express-Migration: ${error.message}`);
    if (VERBOSE) {
      console.error(error);
    }
    process.exit(1);
  } finally {
    // Logger schließen
    logger.end();
  }
}

// Programm ausführen
main().catch(err => {
  console.error('Unbehandelter Fehler:', err);
  process.exit(1);
});