#!/usr/bin/env node

/**
 * Import-Pfad-Aktualisierungswerkzeug
 * 
 * Dieses Skript aktualisiert Import-Pfade in allen Dateien eines Projekts.
 * Es unterstützt das Ersetzen von alten Pfaden durch neue Pfade basierend auf
 * definierten Mustern oder spezifischen Komponenten.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Aktualisiert Import-Pfade in einer Datei basierend auf Ersetzungsregeln
 * @param {string} filePath - Pfad zur Datei
 * @param {Array<{from: string|RegExp, to: string}>} replacements - Ersetzungsregeln
 * @returns {Object} Ergebnis mit Anzahl der Änderungen
 */
function updateImportsInFile(filePath, replacements) {
  // Dateiinhalt lesen
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return { file: filePath, changes: 0, error: `Fehler beim Lesen der Datei: ${error.message}` };
  }

  let updatedContent = content;
  let totalChanges = 0;

  // Jede Ersetzungsregel anwenden
  replacements.forEach(({ from, to }) => {
    // RegExp oder String
    const regex = from instanceof RegExp ? from : new RegExp(from, 'g');
    const originalContent = updatedContent;
    updatedContent = updatedContent.replace(regex, to);
    
    // Änderungen zählen
    const changes = (originalContent.match(regex) || []).length;
    totalChanges += changes;
  });

  // Nur schreiben, wenn Änderungen vorhanden sind
  if (totalChanges > 0) {
    try {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      return { file: filePath, changes: totalChanges };
    } catch (error) {
      return { file: filePath, changes: 0, error: `Fehler beim Schreiben der Datei: ${error.message}` };
    }
  }

  return { file: filePath, changes: 0 };
}

/**
 * Findet alle Dateien, die einen bestimmten Import-Pfad enthalten
 * @param {string} importPath - Zu suchender Import-Pfad
 * @param {string} searchPattern - Glob-Muster für zu durchsuchende Dateien
 * @returns {Array<string>} Liste der Dateipfade
 */
function findFilesWithImport(importPath, searchPattern = '**/*.{js,jsx,ts,tsx}') {
  const files = glob.sync(searchPattern, { ignore: ['node_modules/**', 'build/**', 'dist/**', '.next/**'] });
  const matchingFiles = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const importRegex = new RegExp(`from\\s+['"].*${importPath}['"]`, 'g');
      if (importRegex.test(content)) {
        matchingFiles.push(file);
      }
    } catch (error) {
      console.error(`Fehler beim Lesen der Datei ${file}:`, error.message);
    }
  }

  return matchingFiles;
}

/**
 * Aktualisiert Import-Pfade in allen gefundenen Dateien
 * @param {string} fromPath - Ursprünglicher Import-Pfad
 * @param {string} toPath - Neuer Import-Pfad
 * @param {string} searchPattern - Glob-Muster für zu durchsuchende Dateien
 * @returns {Object} Ergebnis mit aktualisierten Dateien und Änderungen
 */
function updateAllImports(fromPath, toPath, searchPattern = '**/*.{js,jsx,ts,tsx}') {
  // Alle Dateien mit dem gesuchten Import finden
  const filesToUpdate = findFilesWithImport(fromPath, searchPattern);
  
  console.log(`Gefundene Dateien mit Import '${fromPath}': ${filesToUpdate.length}`);
  
  // Ersetzungsregeln für relative und absolute Imports
  const replacements = [
    // Absolute Imports (mit quotation marks)
    { from: new RegExp(`from\\s+(['"]).*(${fromPath})['"](;?)`, 'g'), to: `from $1${toPath}$1$3` },
    // Import-Anweisungen
    { from: new RegExp(`import\\s+([^;]+)\\s+from\\s+(['"]).*(${fromPath})['"](;?)`, 'g'), to: `import $1 from $2${toPath}$2$4` },
    // Import-Type-Anweisungen (TypeScript)
    { from: new RegExp(`import\\s+type\\s+([^;]+)\\s+from\\s+(['"]).*(${fromPath})['"](;?)`, 'g'), to: `import type $1 from $2${toPath}$2$4` },
    // Require-Anweisungen
    { from: new RegExp(`require\\((['"]).*(${fromPath})['"](;?)\\)`, 'g'), to: `require($1${toPath}$1$3)` },
  ];
  
  // Änderungen in allen Dateien durchführen
  const results = filesToUpdate.map(file => updateImportsInFile(file, replacements));
  
  // Zusammenfassung erstellen
  const updatedFiles = results.filter(r => r.changes > 0).map(r => r.file);
  const totalChanges = results.reduce((sum, r) => sum + r.changes, 0);
  const errors = results.filter(r => r.error).map(r => ({ file: r.file, error: r.error }));
  
  return {
    totalFiles: filesToUpdate.length,
    updatedFiles,
    totalChanges,
    errors,
  };
}

/**
 * Definiert Ersetzungsregeln für die Konsolidierung der Importe
 * @returns {Array<{from: string|RegExp, to: string}>} Liste der Ersetzungsregeln
 */
function getConsolidationRules() {
  return [
    // @/ durch @/ ersetzen
    { from: /@\/src\//g, to: '@/' },
    
    // Komponenten-Importe anpassen
    { from: /from\s+['"]\.\.\/components\//g, to: 'from \'@components/' },
    { from: /from\s+['"]\.\.\/\.\.\/components\//g, to: 'from \'@components/' },
    { from: /from\s+['"]\.\.\/\.\.\/\.\.\/components\//g, to: 'from \'@components/' },
    
    // Lib-Importe anpassen
    { from: /from\s+['"]\.\.\/lib\//g, to: 'from \'@lib/' },
    { from: /from\s+['"]\.\.\/\.\.\/lib\//g, to: 'from \'@lib/' },
    { from: /from\s+['"]\.\.\/\.\.\/\.\.\/lib\//g, to: 'from \'@lib/' },
    
    // Utils-Importe anpassen
    { from: /from\s+['"]\.\.\/utils\//g, to: 'from \'@/utils/' },
    { from: /from\s+['"]\.\.\/\.\.\/utils\//g, to: 'from \'@/utils/' },
    { from: /from\s+['"]\.\.\/\.\.\/\.\.\/utils\//g, to: 'from \'@/utils/' },
    
    // Types-Importe anpassen
    { from: /from\s+['"]\.\.\/types\//g, to: 'from \'@types/' },
    { from: /from\s+['"]\.\.\/\.\.\/types\//g, to: 'from \'@types/' },
    { from: /from\s+['"]\.\.\/\.\.\/\.\.\/types\//g, to: 'from \'@types/' },
    
    // Hooks-Importe anpassen
    { from: /from\s+['"]\.\.\/hooks\//g, to: 'from \'@hooks/' },
    { from: /from\s+['"]\.\.\/\.\.\/hooks\//g, to: 'from \'@hooks/' },
    { from: /from\s+['"]\.\.\/\.\.\/\.\.\/hooks\//g, to: 'from \'@hooks/' },
  ];
}

/**
 * Aktualisiert alle Import-Pfade in einem Projekt basierend auf Konsolidierungsregeln
 * @param {string} searchPattern - Glob-Muster für zu durchsuchende Dateien
 * @returns {Object} Ergebnis mit aktualisierten Dateien und Änderungen
 */
function consolidateAllImports(searchPattern = 'src/**/*.{js,jsx,ts,tsx}') {
  const files = glob.sync(searchPattern, { ignore: ['node_modules/**', 'build/**', 'dist/**', '.next/**'] });
  const replacements = getConsolidationRules();
  
  console.log(`Gefundene Dateien zur Konsolidierung: ${files.length}`);
  
  // Änderungen in allen Dateien durchführen
  const results = files.map(file => updateImportsInFile(file, replacements));
  
  // Zusammenfassung erstellen
  const updatedFiles = results.filter(r => r.changes > 0).map(r => r.file);
  const totalChanges = results.reduce((sum, r) => sum + r.changes, 0);
  const errors = results.filter(r => r.error).map(r => ({ file: r.file, error: r.error }));
  
  return {
    totalFiles: files.length,
    updatedFiles,
    totalChanges,
    errors,
  };
}

/**
 * Aktualisiert Import-Pfade in einem Projekt und gibt das Ergebnis aus
 */
function updateAndPrint(fromPath, toPath, searchPattern) {
  console.log(`\n=== Import-Pfad-Aktualisierung ===`);
  console.log(`Von: ${fromPath}`);
  console.log(`Nach: ${toPath}`);
  console.log(`Suchpattern: ${searchPattern || '**/*.{js,jsx,ts,tsx}'}`);
  
  const result = updateAllImports(fromPath, toPath, searchPattern);
  
  console.log(`\nErgebnis:`);
  console.log(`- Durchsuchte Dateien: ${result.totalFiles}`);
  console.log(`- Aktualisierte Dateien: ${result.updatedFiles.length}`);
  console.log(`- Gesamtzahl der Änderungen: ${result.totalChanges}`);
  
  if (result.updatedFiles.length > 0) {
    console.log(`\nAktualisierte Dateien:`);
    result.updatedFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  if (result.errors.length > 0) {
    console.log(`\nFehler:`);
    result.errors.forEach(error => console.log(`  - ${error.file}: ${error.error}`));
  }
  
  console.log('\n=== Ende der Aktualisierung ===\n');
}

/**
 * Führt die Konsolidierung aller Import-Pfade durch und gibt das Ergebnis aus
 */
function consolidateAndPrint(searchPattern) {
  console.log(`\n=== Import-Pfad-Konsolidierung ===`);
  console.log(`Suchpattern: ${searchPattern || 'src/**/*.{js,jsx,ts,tsx}'}`);
  
  const result = consolidateAllImports(searchPattern);
  
  console.log(`\nErgebnis:`);
  console.log(`- Durchsuchte Dateien: ${result.totalFiles}`);
  console.log(`- Aktualisierte Dateien: ${result.updatedFiles.length}`);
  console.log(`- Gesamtzahl der Änderungen: ${result.totalChanges}`);
  
  if (result.updatedFiles.length > 0) {
    console.log(`\nAktualisierte Dateien:`);
    result.updatedFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  if (result.errors.length > 0) {
    console.log(`\nFehler:`);
    result.errors.forEach(error => console.log(`  - ${error.file}: ${error.error}`));
  }
  
  console.log('\n=== Ende der Konsolidierung ===\n');
}

// Direkter Aufruf von der Kommandozeile
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'update') {
    const fromPath = process.argv[3];
    const toPath = process.argv[4];
    const searchPattern = process.argv[5];
    
    if (!fromPath || !toPath) {
      console.error('Bitte geben Sie Quell- und Zielpfade an.');
      console.log('Verwendung: node update-imports.js update <von-pfad> <nach-pfad> [glob-pattern]');
      process.exit(1);
    }
    
    updateAndPrint(fromPath, toPath, searchPattern);
  } else if (command === 'consolidate') {
    const searchPattern = process.argv[3];
    consolidateAndPrint(searchPattern);
  } else {
    console.error('Ungültiger Befehl. Verwenden Sie "update" oder "consolidate".');
    console.log('Verwendung:');
    console.log('  node update-imports.js update <von-pfad> <nach-pfad> [glob-pattern]');
    console.log('  node update-imports.js consolidate [glob-pattern]');
    process.exit(1);
  }
}

module.exports = {
  updateImportsInFile,
  findFilesWithImport,
  updateAllImports,
  consolidateAllImports,
  updateAndPrint,
  consolidateAndPrint,
  getConsolidationRules
};
