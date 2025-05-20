#!/usr/bin/env node

/**
 * API-Routen Migrations-Skript
 * 
 * Dieses Skript migriert API-Routen von /app/api nach /src/app/api 
 * und konvertiert JavaScript-Dateien zu TypeScript mit standardisierter
 * Fehlerbehandlung und Caching.
 * 
 * Verwendung: node migrate-api-routes.js [--dry-run] [--verbose]
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const { execSync } = require('child_process');

// Pfade
const SOURCE_DIR = path.join(process.cwd(), 'app', 'api');
const TARGET_DIR = path.join(process.cwd(), 'src', 'app', 'api');

// Optionen
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// Hilf-Funktionen
const migratedRoutes = [];
const skippedRoutes = [];
const errorRoutes = [];

/**
 * Liest eine Datei ein und versucht, sie zu TypeScript zu konvertieren
 * @param {string} sourcePath - Pfad zur Quelldatei
 * @param {string} targetPath - Pfad zur Zieldatei
 */
function migrateApiRoute(sourcePath, targetPath) {
  try {
    // Zielverzeichnis erstellen, falls es nicht existiert
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      if (!DRY_RUN) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      console.log(chalk.gray(`Verzeichnis erstellt: ${targetDir}`));
    }

    // Prüfen, ob die Zieldatei bereits existiert
    if (fs.existsSync(targetPath)) {
      console.log(chalk.yellow(`⚠️ Zieldatei existiert bereits: ${targetPath}`));
      
      // Vergleiche die Dateien
      const sourceContent = fs.readFileSync(sourcePath, 'utf8');
      const targetContent = fs.readFileSync(targetPath, 'utf8');
      
      if (sourceContent === targetContent) {
        console.log(chalk.gray(`   Dateien sind identisch, wird übersprungen.`));
        skippedRoutes.push({ source: sourcePath, target: targetPath, reason: 'Dateien identisch' });
        return;
      }
      
      // Wenn nicht im Dry-Run-Modus, frage nach, ob überschrieben werden soll
      if (!DRY_RUN) {
        try {
          const answer = execSync(`read -p "Zieldatei überschreiben? (y/n) " reply; echo $reply`, 
            { shell: '/bin/bash', encoding: 'utf8' }).trim();
          
          if (answer.toLowerCase() !== 'y') {
            console.log(chalk.gray(`   Migration abgebrochen.`));
            skippedRoutes.push({ source: sourcePath, target: targetPath, reason: 'Überschreiben abgelehnt' });
            return;
          }
        } catch (error) {
          // Bei Fehler (nicht-interaktive Umgebung), überschreibe nicht
          console.log(chalk.gray(`   Nicht-interaktiv, Überschreiben standardmäßig abgelehnt.`));
          skippedRoutes.push({ source: sourcePath, target: targetPath, reason: 'Nicht-interaktives Terminal' });
          return;
        }
      }
    }

    // Dateiinhalt lesen
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // Standard-Konvertierungen durchführen
    let newContent = convertToTypeScript(content, sourcePath);
    
    // Import-Pfade korrigieren
    newContent = updateImportPaths(newContent);
    
    // Wenn nicht im Dry-Run-Modus, schreibe die Datei
    if (!DRY_RUN) {
      fs.writeFileSync(targetPath, newContent);
    }
    
    console.log(chalk.green(`✅ Migriert: ${sourcePath} -> ${targetPath}`));
    migratedRoutes.push({ source: sourcePath, target: targetPath });
    
    if (VERBOSE) {
      console.log(chalk.gray(`   Inhalt nach Migration:\n${'-'.repeat(40)}\n${newContent}\n${'-'.repeat(40)}`));
    }
  } catch (error) {
    console.error(chalk.red(`❌ Fehler bei der Migration von ${sourcePath}: ${error.message}`));
    if (VERBOSE) {
      console.error(error.stack);
    }
    errorRoutes.push({ source: sourcePath, error: error.message });
  }
}

/**
 * Konvertiert JavaScript zu TypeScript mit standardisierten Fehlerbehandlungen
 * @param {string} content - Inhalt der Quelldatei
 * @param {string} filePath - Pfad der Quelldatei
 * @returns {string} Konvertierter Inhalt
 */
function convertToTypeScript(content, filePath) {
  const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
  
  if (isTypeScript) {
    // Bereits TypeScript, nur Anpassungen vornehmen
    return content;
  }
  
  // JavaScript zu TypeScript konvertieren
  let newContent = content;
  
  // Module-System Importe zu ESM konvertieren
  newContent = newContent.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g, 'import $1 from \'$2\';');
  
  // NextRequest und NextResponse importieren, wenn sie fehlen
  if (!newContent.includes('NextRequest') && (newContent.includes('req') || newContent.includes('request'))) {
    newContent = `import { NextRequest } from 'next/server';\n${newContent}`;
  }
  
  if (!newContent.includes('NextResponse') && 
     (newContent.includes('res') || newContent.includes('response') || 
      newContent.includes('return {') || newContent.includes('return new'))) {
    if (newContent.includes('import') && !newContent.includes('next/server')) {
      newContent = newContent.replace(/import.*?from ['"]next\/server['"];?/, 
        'import { NextRequest, NextResponse } from \'next/server\';');
    } else if (!newContent.includes('import { NextRequest } from')) {
      newContent = `import { NextResponse } from 'next/server';\n${newContent}`;
    } else {
      newContent = newContent.replace(/import { NextRequest } from ['"]next\/server['"];?/, 
        'import { NextRequest, NextResponse } from \'next/server\';');
    }
  }
  
  // Standardisiere Route-Handler mit Try-Catch
  if (newContent.includes('export async function') && !newContent.includes('try {')) {
    // Handler finden und mit Try-Catch umschließen
    newContent = newContent.replace(
      /(export\s+async\s+function\s+\w+\s*\([^)]*\)\s*{)([^}]*)}/gms,
      function(match, declaration, body) {
        // Füge Try-Catch hinzu
        return `${declaration}\n  try {\n${body}\n  } catch (error) {\n    return handleApiError(error, {\n      endpoint: '${getApiEndpoint(filePath)}',\n      method: 'GET', // Oder anpassen basierend auf dem Funktionsnamen\n    });\n  }\n}`;
      }
    );
    
    // Füge Import für handleApiError hinzu
    if (!newContent.includes('handleApiError')) {
      newContent = `import { handleApiError } from '../src/lib/api-utils';\n${newContent}`;
    }
  }
  
  // Typinformationen hinzufügen
  if (newContent.includes('export async function GET')) {
    newContent = newContent.replace(
      /export\s+async\s+function\s+GET\s*\(([^)]*)\)/g,
      'export async function GET($1: NextRequest)'
    );
  }
  
  if (newContent.includes('export async function POST')) {
    newContent = newContent.replace(
      /export\s+async\s+function\s+POST\s*\(([^)]*)\)/g,
      'export async function POST($1: NextRequest)'
    );
  }
  
  // Cache-Kontrolle hinzufügen, wenn es fehlt
  if (newContent.includes('export async function GET') && !newContent.includes('Cache-Control')) {
    newContent = newContent.replace(
      /(return.*?)(\n\s*})/,
      `$1\n    // Add cache control headers\n    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');$2`
    );
  }
  
  return newContent;
}

/**
 * Aktualisiert Import-Pfade für die neue Verzeichnisstruktur
 * @param {string} content - Dateiinhalt
 * @returns {string} Aktualisierter Inhalt
 */
function updateImportPaths(content) {
  let newContent = content;
  
  // Relative Imports zu absoluten Imports mit @/ Präfix konvertieren
  newContent = newContent.replace(/from\s+['"]\.\.\/\.\.\/([^'"]+)['"]/g, 'from \'@/$1\'');
  newContent = newContent.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, 'from \'@/$1\'');
  
  // Pfade anpassen
  newContent = newContent.replace(/from\s+['"]@\/lib\/([^'"]+)['"]/g, 'from \'@/lib/$1\'');
  newContent = newContent.replace(/from\s+['"]@\/src\/([^'"]+)['"]/g, 'from \'@/$1\'');
  
  // Führe Direktus-spezifische Anpassungen durch
  if (newContent.includes('directus')) {
    newContent = newContent.replace(/from\s+['"]@\/lib\/directus-client['"]/g, 'from \'@/lib/directus\'');
  }
  
  return newContent;
}

/**
 * Extrahiert den API-Endpunktpfad aus dem Dateipfad
 * @param {string} filePath - Dateipfad
 * @returns {string} API-Endpunkt
 */
function getApiEndpoint(filePath) {
  // /app/api/foo/bar/route.js -> /api/foo/bar
  return '/api' + filePath.split('/api')[1].split('/route')[0];
}

/**
 * Findet alle API-Routen im Quellverzeichnis
 * @returns {Promise<string[]>} Liste der API-Routenpfade
 */
async function findApiRoutes() {
  return new Promise((resolve, reject) => {
    glob(`${SOURCE_DIR}/**/route.{js,ts}`, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * Gibt einen Migrationsbericht aus
 */
function printMigrationReport() {
  console.log(chalk.blue('\n📊 MIGRATIONS-BERICHT'));
  console.log(chalk.gray('════════════════════════════════════════════'));
  console.log(`${chalk.green('✅')} Erfolgreich migriert: ${chalk.bold(migratedRoutes.length)}`);
  console.log(`${chalk.yellow('⚠️')} Übersprungen: ${chalk.bold(skippedRoutes.length)}`);
  console.log(`${chalk.red('❌')} Fehler: ${chalk.bold(errorRoutes.length)}`);
  console.log(chalk.gray('════════════════════════════════════════════'));
  
  if (migratedRoutes.length > 0) {
    console.log(chalk.green('\n✅ Erfolgreich migrierte Routen:'));
    migratedRoutes.forEach(({ source, target }) => {
      console.log(`  ${source} -> ${target}`);
    });
  }
  
  if (skippedRoutes.length > 0) {
    console.log(chalk.yellow('\n⚠️ Übersprungene Routen:'));
    skippedRoutes.forEach(({ source, target, reason }) => {
      console.log(`  ${source} -> ${target} (${reason})`);
    });
  }
  
  if (errorRoutes.length > 0) {
    console.log(chalk.red('\n❌ Fehlerhafte Routen:'));
    errorRoutes.forEach(({ source, error }) => {
      console.log(`  ${source}: ${error}`);
    });
  }
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log(chalk.blue(`\n🚀 Starte API-Routen Migration von ${SOURCE_DIR} nach ${TARGET_DIR}`));
  
  if (DRY_RUN) {
    console.log(chalk.yellow('⚠️ DRY-RUN Modus: Es werden keine Dateien geschrieben'));
  }
  
  try {
    // Finde alle API-Routen
    const apiRoutes = await findApiRoutes();
    console.log(chalk.blue(`\n🔍 ${apiRoutes.length} API-Routen gefunden`));
    
    // Migriere jede Route
    for (const sourcePath of apiRoutes) {
      const relativePath = path.relative(SOURCE_DIR, sourcePath);
      
      // Zielpfad bestimmen (mit .ts Erweiterung für JavaScript-Dateien)
      const extension = path.extname(sourcePath);
      const newExtension = extension === '.js' ? '.ts' : extension;
      const targetPath = path.join(TARGET_DIR, relativePath.replace(extension, newExtension));
      
      // Route migrieren
      await migrateApiRoute(sourcePath, targetPath);
    }
    
    // Migrationsbericht ausgeben
    printMigrationReport();
    
    console.log(chalk.green('\n✅ API-Routen Migration abgeschlossen'));
  } catch (error) {
    console.error(chalk.red(`\n❌ Fehler bei der Migration: ${error.message}`));
    if (VERBOSE) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Skript ausführen
main();