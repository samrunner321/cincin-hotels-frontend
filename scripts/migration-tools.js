#!/usr/bin/env node

/**
 * Migration Tools Wrapper Script
 * 
 * Dieses Skript dient als Wrapper für die Migrationstools mit erhöhter Speicherzuweisung
 * und vereinfachter Bedienung. Es behandelt Speicherprobleme, indem es den Node.js-Prozess
 * mit mehr Arbeitsspeicher startet und bietet eine einheitliche Schnittstelle für alle Tools.
 * 
 * Verwendung:
 *   node migration-tools.js analyze <pattern> [options]
 *   node migration-tools.js convert <pattern> [options]
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// Konfiguration
const DEFAULT_MEMORY = 8192; // 8GB
const MAX_MEMORY = 16384;    // 16GB
const TOOLS_DIR = path.join(__dirname, '..', 'migration-tools');

// Pfade zu den optimierten Tools
const ANALYZE_TOOL = path.join(TOOLS_DIR, 'analyzeComponent.optimized.js');
const CONVERT_TOOL = path.join(TOOLS_DIR, 'convertToTypeScript.optimized.js');

// Hilfetext anzeigen
function showHelp() {
  console.log(chalk.blue(`
🛠️  Migration Tools Wrapper Script 🛠️

Dieses Skript führt die optimierten Migrations-Tools mit erhöhtem Speicherlimit aus.

Verwendung:
  ${chalk.yellow('node migration-tools.js analyze <path-or-pattern> [options]')} - Komponenten analysieren
  ${chalk.yellow('node migration-tools.js convert <path-or-pattern> [options]')} - Zu TypeScript konvertieren
  ${chalk.yellow('node migration-tools.js info')}                               - Systeminformationen anzeigen
  ${chalk.yellow('node migration-tools.js clean-cache')}                        - Cache-Dateien bereinigen

Optionen:
  --memory=<MB>              Speicherlimit in MB (Standard: ${DEFAULT_MEMORY}, Max: ${MAX_MEMORY})
  --batch-size=<number>      Anzahl der Dateien pro Batch (Standard: 10)
  --concurrency=<number>     Anzahl paralleler Worker (Standard: CPU-Kerne - 1)
  --output-dir=<path>        Ausgabeverzeichnis
  --include-dir=<dir>        Nur in bestimmten Verzeichnissen suchen
  --checkpoint               Checkpoints für inkrementelle Verarbeitung aktivieren
  --dry-run                  Keine Änderungen vornehmen, nur simulieren
  --summary                  Zusammenfassung erstellen
  --verbose                  Ausführliche Ausgabe
  --trace-gc                 Garbage Collection verfolgen (für Debugging)
  
Beispiele:
  ${chalk.green('node migration-tools.js analyze components/hotel-detail/')}
  ${chalk.green('node migration-tools.js analyze "components/**/*.jsx" --batch-size=20 --memory=12288')}
  ${chalk.green('node migration-tools.js convert src/components/hotels/HotelCard.jsx')}
  ${chalk.green('node migration-tools.js convert "components/**/*.jsx" --output-dir=src/components --checkpoint')}
  `));
}

// Systeminfo anzeigen
function showSystemInfo() {
  const os = require('os');
  const v8 = require('v8');
  
  console.log(chalk.blue('\n📊 SYSTEM INFORMATION'));
  console.log(chalk.gray('════════════════════════════════════════════'));
  console.log(`Betriebssystem:     ${os.type()} ${os.release()} (${os.platform()}) ${os.arch()}`);
  console.log(`CPU:                ${os.cpus()[0].model}`);
  console.log(`CPU Kerne:          ${os.cpus().length}`);
  console.log(`Gesamt RAM:         ${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`);
  console.log(`Freier RAM:         ${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`);
  console.log(`Node.js Version:    ${process.version}`);
  console.log(`V8 Version:         ${process.versions.v8}`);
  console.log(`V8 Heap Limit:      ${Math.round(v8.getHeapStatistics().heap_size_limit / (1024 * 1024))} MB`);
  console.log(`Migration Tools:    ${fs.existsSync(ANALYZE_TOOL) && fs.existsSync(CONVERT_TOOL) ? 'Installiert' : 'Nicht gefunden'}`);
  console.log(chalk.gray('════════════════════════════════════════════'));
}

// Cache-Dateien bereinigen
function cleanCache() {
  console.log(chalk.blue('\n🧹 BEREINIGE CACHE-DATEIEN'));
  
  const patterns = [
    '**/*.analysis.json',
    'component-analysis-summary.json',
    'typescript-conversion-summary.json',
    'conversion-checkpoint.json'
  ];
  
  let deleted = 0;
  
  patterns.forEach(pattern => {
    try {
      const files = execSync(`find . -name "${pattern}" -type f`, { encoding: 'utf8' }).split('\n').filter(Boolean);
      
      if (files.length > 0) {
        console.log(chalk.yellow(`\nGefunden: ${files.length} ${pattern}-Dateien`));
        
        // Bestätigungsdialog
        const answer = process.argv.includes('--force') ? 'y' : 
          execSync(`read -p "Möchten Sie diese Dateien löschen? (y/n) " reply; echo $reply`, 
            { shell: '/bin/bash', encoding: 'utf8' }).trim();
        
        if (answer.toLowerCase() === 'y') {
          files.forEach(file => {
            fs.unlinkSync(file);
            console.log(`  - Gelöscht: ${file}`);
            deleted++;
          });
        } else {
          console.log(chalk.gray(`  Übersprungen: ${files.length} Dateien`));
        }
      }
    } catch (error) {
      console.error(chalk.red(`Fehler beim Suchen nach ${pattern}-Dateien: ${error.message}`));
    }
  });
  
  console.log(chalk.green(`\n✅ Bereinigung abgeschlossen: ${deleted} Dateien gelöscht`));
}

// Führt eines der Migrations-Tools mit erhöhtem Speicherlimit aus
function runTool(toolName, args, options = {}) {
  const memory = options.memory || DEFAULT_MEMORY;
  const nodeArgs = [`--max-old-space-size=${memory}`];
  
  if (options.traceGc) {
    nodeArgs.push('--trace-gc');
  }
  
  // Tool-Pfad bestimmen
  let toolPath;
  if (toolName === 'analyze') {
    toolPath = ANALYZE_TOOL;
  } else if (toolName === 'convert') {
    toolPath = CONVERT_TOOL;
  } else {
    console.error(chalk.red(`Unbekanntes Tool: ${toolName}`));
    process.exit(1);
  }
  
  // Prüfen, ob das Tool existiert
  if (!fs.existsSync(toolPath)) {
    console.error(chalk.red(`Tool nicht gefunden: ${toolPath}`));
    console.error(chalk.yellow('Stellen Sie sicher, dass die optimierten Tools im Verzeichnis migration-tools/ vorhanden sind.'));
    process.exit(1);
  }
  
  console.log(chalk.blue(`\n🚀 Starte ${toolName.toUpperCase()} Tool mit ${memory} MB Speicherlimit\n`));
  
  // Führe das Tool aus als separaten Prozess und leite Ausgabe weiter
  const child = spawn('node', [...nodeArgs, toolPath, ...args], {
    stdio: 'inherit'
  });
  
  child.on('error', (error) => {
    console.error(chalk.red(`Fehler beim Ausführen des Tools: ${error.message}`));
    process.exit(1);
  });
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(chalk.red(`Tool beendet mit Exit-Code ${code}`));
      process.exit(code);
    }
  });
}

// Hauptfunktion
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }
  
  const command = args[0];
  
  // Befehle verarbeiten
  switch (command) {
    case 'info':
      showSystemInfo();
      break;
      
    case 'clean-cache':
      cleanCache();
      break;
      
    case 'analyze':
    case 'convert':
      // Prüfe, ob genügend Argumente vorhanden sind
      if (args.length < 2) {
        console.error(chalk.red(`Fehler: Bitte geben Sie ein Muster oder einen Pfad nach '${command}' an.`));
        console.log(chalk.yellow(`Beispiel: node migration-tools.js ${command} "components/**/*.jsx"`));
        process.exit(1);
      }
      
      // Argumente für das Tool vorbereiten
      const toolArgs = args.slice(1);
      const options = {};
      
      // Prozessiere spezielle Optionen
      toolArgs.forEach((arg, index) => {
        if (arg.startsWith('--memory=')) {
          const memory = parseInt(arg.split('=')[1], 10);
          options.memory = Math.min(memory, MAX_MEMORY);
          toolArgs[index] = ''; // Entferne dieses Argument, da es vom Wrapper verarbeitet wird
        } else if (arg === '--trace-gc') {
          options.traceGc = true;
          toolArgs[index] = ''; // Entferne dieses Argument, da es vom Wrapper verarbeitet wird
        } else if (arg === '--checkpoint') {
          // Ersetze --checkpoint durch den vollständigen Checkpoint-Pfad
          const checkpointName = command === 'analyze' ? 'analysis-checkpoint.json' : 'conversion-checkpoint.json';
          toolArgs[index] = `--checkpoint-path=${checkpointName}`;
        }
      });
      
      // Entferne leere Argumente
      const cleanedArgs = toolArgs.filter(Boolean);
      
      // Prüfen, ob Pattern mit Anführungszeichen übergeben wurde
      if (cleanedArgs[0] && !cleanedArgs[0].startsWith('--') && !fs.existsSync(cleanedArgs[0])) {
        // Wenn das Muster kein Dateipfad ist und kein -- hat, konvertiere es zu einem --pattern Argument
        cleanedArgs[0] = `--pattern=${cleanedArgs[0]}`;
      }
      
      // Führe das Tool aus
      runTool(command, cleanedArgs, options);
      break;
      
    default:
      console.error(chalk.red(`Unbekannter Befehl: ${command}`));
      showHelp();
      process.exit(1);
  }
}

// Start des Programms
main();