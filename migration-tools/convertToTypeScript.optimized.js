/**
 * TypeScript-Konvertierungs-Tool (convertToTypeScript.optimized.js)
 * 
 * Optimierte Version mit inkrementeller Verarbeitung und besserer Speicherverwaltung
 * 
 * Dieses Tool konvertiert React JavaScript-Komponenten (JSX) zu TypeScript (TSX).
 * Es führt intelligente Typerkennung für Props durch, erstellt passende Interface-Definitionen
 * und behandelt Event-Handler und Refs korrekt.
 * 
 * Nutzung: node convertToTypeScript.optimized.js <Pfad-zur-JSX-Komponente> [Ausgabepfad] [--batch]
 */

const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const chalk = require('chalk');
const glob = require('glob');
const { promisify } = require('util');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');

// Promisify glob für async/await
const globPromise = promisify(glob.glob || glob);

// Importiere das Analyse-Tool (optimierte Version)
const { analyzeComponent } = require('./analyzeComponent.optimized');

// Speicherüberwachungsfunktion
function logMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  console.log(chalk.gray('\nMemory Usage:'));
  console.log(chalk.gray(`RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)} MB`));
  console.log(chalk.gray(`Heap Total: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`));
  console.log(chalk.gray(`Heap Used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`));
  console.log(chalk.gray(`External: ${Math.round(memoryUsage.external / 1024 / 1024)} MB`));
}

/**
 * Konvertiert eine JSX-Komponente zu TSX
 * @param {string} filePath - Pfad zur JSX-Quelldatei
 * @param {string} outputPath - Pfad zur TSX-Zieldatei (optional)
 * @param {Object} options - Zusätzliche Optionen für die Konvertierung
 * @returns {Object} Ergebnis der Konvertierung
 */
function convertToTypeScript(filePath, outputPath = null, options = {}) {
  // Optimierte Verarbeitung mit Fokus auf Speichereffizienz
  try {
    // Prüfe, ob die Quelldatei existiert
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: `Fehler: Datei nicht gefunden: ${filePath}`,
        sourcePath: filePath,
        targetPath: null,
        content: null
      };
    }

    // Bestimme Dateinamen und Pfade
    const fileExtension = path.extname(filePath);
    const fileName = path.basename(filePath, fileExtension);
    const isAlreadyTypeScript = fileExtension === '.tsx' || fileExtension === '.ts';
    
    if (isAlreadyTypeScript) {
      return { 
        success: false, 
        message: 'Datei ist bereits TypeScript',
        sourcePath: filePath,
        targetPath: null,
        content: null 
      };
    }

    // Analysiere die Komponente (wenn keine Analyse übergeben wurde)
    const analysis = options.analysis || analyzeComponent(filePath);
    
    // Lese den Quellcode
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    
    // Parse den Code zu einem AST
    const ast = babelParser.parse(sourceCode, {
      sourceType: 'module',
      plugins: ['jsx', 'classProperties', 'objectRestSpread'],
    });

    // Änderungen am AST vornehmen zur Konvertierung zu TypeScript
    transformToTypeScript(ast, analysis);
    
    // Generiere den neuen TypeScript-Code
    const { code } = generate(ast, {
      retainLines: true,
      comments: true,
    });

    // Freigeben des AST nach Generierung für bessere Speichernutzung
    // @ts-ignore
    ast = null;

    // Füge TypeScript-Erweiterungen hinzu
    const tsCode = addTypeScriptExtensions(code, analysis);
    
    // Bestimme den Ausgabepfad
    if (!outputPath) {
      const dir = path.dirname(filePath);
      const newExtension = fileExtension === '.jsx' ? '.tsx' : '.ts';
      outputPath = path.join(dir, `${fileName}${newExtension}`);
    }
    
    // Schreibe die Ausgabedatei wenn nicht --dry-run
    if (!options.dryRun) {
      // Erstelle den Ausgabepfad, wenn er nicht existiert
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, tsCode);
    }
    
    return {
      success: true,
      message: 'Konvertierung erfolgreich',
      sourcePath: filePath,
      targetPath: outputPath,
      content: options.returnContent ? tsCode : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Fehler bei der Konvertierung: ${error.message}`,
      stack: error.stack,
      sourcePath: filePath,
      targetPath: outputPath,
      content: null
    };
  }
}

/**
 * Transformiert den AST von JavaScript zu TypeScript
 * @param {Object} ast - Der AST der Komponente
 * @param {Object} analysis - Die Analyse-Ergebnisse der Komponente
 */
function transformToTypeScript(ast, analysis) {
  const componentName = analysis.componentName;
  let hasPropsInterface = false;
  
  // Sammle alle gefundenen Props für die Interface-Erstellung
  const propsFromUsage = analysis.props.usages.map(prop => prop.name);
  
  // Wandle PropTypes zu TypeScript-Interface um
  if (analysis.props.definitions && analysis.props.definitions.length > 0) {
    hasPropsInterface = true;
  }
  
  // Traverse the AST and apply transformations
  traverse(ast, {
    // Entferne PropTypes Definitionen
    AssignmentExpression(path) {
      if (
        path.node.left.type === 'MemberExpression' &&
        path.node.left.property.name === 'propTypes'
      ) {
        path.remove();
      }
    },
    
    // Funktionskomponenten-Deklarationen mit Props-Typ versehen
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.name === componentName) {
        // Finde den Props-Parameter
        const propsParam = path.node.params[0];
        if (propsParam) {
          // Ersetze durch typisierten Parameter
          const propsType = hasPropsInterface 
            ? t.tsTypeAnnotation(t.tsTypeReference(t.identifier(`${componentName}Props`))) 
            : t.tsTypeAnnotation(t.tsAnyKeyword());
          
          propsParam.typeAnnotation = propsType;
        }
      }
    },
    
    // Arrow-Function Komponenten mit Props-Typ versehen
    VariableDeclarator(path) {
      if (
        path.node.id.name === componentName &&
        path.node.init &&
        (path.node.init.type === 'ArrowFunctionExpression' || path.node.init.type === 'FunctionExpression')
      ) {
        const fn = path.node.init;
        // Finde den Props-Parameter
        const propsParam = fn.params[0];
        if (propsParam) {
          // Ersetze durch typisierten Parameter
          const propsType = hasPropsInterface 
            ? t.tsTypeAnnotation(t.tsTypeReference(t.identifier(`${componentName}Props`))) 
            : t.tsTypeAnnotation(t.tsAnyKeyword());
          
          propsParam.typeAnnotation = propsType;
        }
        
        // Füge Rückgabetyp hinzu (React.FC wird später hinzugefügt)
        if (!fn.returnType) {
          fn.returnType = t.tsTypeAnnotation(
            t.tsTypeReference(
              t.identifier('JSX.Element')
            )
          );
        }
      }
    },
    
    // Event-Handler mit Typen versehen
    FunctionExpression(path) {
      const parentNode = path.parent;
      // Wenn es sich um einen Event-Handler handelt
      if (
        parentNode && 
        parentNode.type === 'VariableDeclarator' && 
        parentNode.id.name && 
        (parentNode.id.name.startsWith('handle') || parentNode.id.name.includes('Handler'))
      ) {
        // Parameter mit Typen versehen
        path.node.params.forEach(param => {
          if (param.type === 'Identifier' && !param.typeAnnotation) {
            const eventTypes = inferEventType(parentNode.id.name);
            param.typeAnnotation = t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(eventTypes))
            );
          }
        });
      }
    },
    
    ArrowFunctionExpression(path) {
      const parentNode = path.parent;
      // Wenn es sich um einen Event-Handler handelt
      if (
        parentNode && 
        parentNode.type === 'VariableDeclarator' && 
        parentNode.id.name && 
        (parentNode.id.name.startsWith('handle') || parentNode.id.name.includes('Handler'))
      ) {
        // Parameter mit Typen versehen
        path.node.params.forEach(param => {
          if (param.type === 'Identifier' && !param.typeAnnotation) {
            const eventTypes = inferEventType(parentNode.id.name);
            param.typeAnnotation = t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(eventTypes))
            );
          }
        });
      }
    },
    
    // useState und useRef mit Typen versehen
    CallExpression(path) {
      if (
        path.node.callee.type === 'Identifier' &&
        path.node.callee.name === 'useState' &&
        path.parent.type === 'VariableDeclarator' &&
        path.parent.id.type === 'ArrayPattern'
      ) {
        // Typinformation für useState hinzufügen
        const stateType = inferStateType(path.node.arguments[0], path.parent.id.elements[0].name);
        
        // TypeScript Generics hinzufügen
        path.node.typeParameters = t.tsTypeParameterInstantiation([
          t.tsTypeReference(t.identifier(stateType))
        ]);
      }
      
      if (
        path.node.callee.type === 'Identifier' &&
        path.node.callee.name === 'useRef' &&
        path.node.arguments.length <= 1
      ) {
        // Einfacher Typ für useRef basierend auf dem Variablennamen
        const varName = path.parent.type === 'VariableDeclarator' ? path.parent.id.name : '';
        const refType = inferRefType(varName);
        
        // TypeScript Generics hinzufügen
        path.node.typeParameters = t.tsTypeParameterInstantiation([
          t.tsTypeReference(t.identifier(refType))
        ]);
      }
    }
  });
}

/**
 * Erstellt ein TypeScript-Interface für die Props basierend auf der Analyse
 * @param {Object} analysis - Die Analyse-Ergebnisse
 * @returns {string} Interface-Definition
 */
function generatePropsInterface(analysis) {
  const componentName = analysis.componentName;
  
  // Verwende existierende PropTypes-Definition falls vorhanden
  if (analysis.props.definitions && analysis.props.definitions.length > 0) {
    const propsDef = analysis.props.definitions[0];
    let interface = `interface ${componentName}Props {\n`;
    
    propsDef.properties.forEach(prop => {
      const typeMapping = {
        'PropTypes.string': 'string',
        'PropTypes.number': 'number',
        'PropTypes.bool': 'boolean',
        'PropTypes.func': '() => void',
        'PropTypes.array': 'any[]',
        'PropTypes.object': 'Record<string, any>',
        'PropTypes.node': 'React.ReactNode',
        'PropTypes.element': 'React.ReactElement',
        'PropTypes.elementType': 'React.ElementType',
        'PropTypes.instanceOf()': 'any',
        'PropTypes.oneOf()': 'any',
        'PropTypes.oneOfType()': 'any',
        'PropTypes.arrayOf()': 'any[]',
        'PropTypes.objectOf()': 'Record<string, any>',
        'PropTypes.shape()': 'any',
        'PropTypes.exact()': 'any'
      };
      
      let tsType = 'any';
      
      // Versuche, den Typ aus PropTypes abzuleiten
      for (const [propType, tsTypeEquivalent] of Object.entries(typeMapping)) {
        if (prop.type && prop.type.includes(propType)) {
          tsType = tsTypeEquivalent;
          break;
        }
      }
      
      interface += `  ${prop.name}${prop.isOptional ? '?' : ''}: ${tsType};\n`;
    });
    
    interface += '}';
    return interface;
  }
  
  // Erstelle ein einfaches Interface aus der Props-Verwendung
  if (analysis.props.usages && analysis.props.usages.length > 0) {
    let interface = `interface ${componentName}Props {\n`;
    
    // Sammle eindeutige Props
    const uniqueProps = Array.from(new Set(analysis.props.usages.map(p => p.name)));
    
    uniqueProps.forEach(propName => {
      // Versuche, einen vernünftigen Typ zu inferieren
      const inferredType = inferPropType(propName);
      interface += `  ${propName}?: ${inferredType};\n`;
    });
    
    interface += '}';
    return interface;
  }
  
  // Leeres Interface als Fallback
  return `interface ${componentName}Props {}\n`;
}

/**
 * Fügt TypeScript-spezifische Ergänzungen zum konvertierten Code hinzu
 * @param {string} code - Der generierte Code
 * @param {Object} analysis - Die Analyse-Ergebnisse
 * @returns {string} Der erweiterte TypeScript-Code
 */
function addTypeScriptExtensions(code, analysis) {
  const componentName = analysis.componentName;
  let imports = '';
  let interfaces = '';
  let tsCode = code;
  
  // React-Importe
  if (!code.includes('import React') && !code.includes('import * as React')) {
    imports += "import React from 'react';\n";
  }
  
  // Füge TypeScript-Importe hinzu, wenn sie benötigt werden
  const needsReactTypes = analysis.hooks && analysis.hooks.length > 0 || 
                        (analysis.props.usages && analysis.props.usages.length > 0) || 
                        (analysis.eventHandlers && analysis.eventHandlers.length > 0);
  
  if (needsReactTypes) {
    // Prüfe, ob React bereits importiert ist
    if (code.includes('import React from')) {
      // Erweitere React import
      tsCode = tsCode.replace(
        /import React from ['"]react['"];?/,
        "import React, { FC, ChangeEvent, MouseEvent, FormEvent } from 'react';"
      );
    } else if (code.includes('import * as React from')) {
      // React mit Namespace importiert, keine Änderung nötig
    } else {
      // Füge React-Importe hinzu
      imports += "import { FC, ChangeEvent, MouseEvent, FormEvent } from 'react';\n";
    }
  }
  
  // Props Interface hinzufügen
  interfaces += generatePropsInterface(analysis) + '\n\n';
  
  // Fügt die Type-Definitionen oben im Code hinzu
  tsCode = imports + tsCode;
  
  // Finde die passende Stelle zum Einfügen der Interfaces
  // Typischerweise nach den Imports aber vor dem Komponenten-Code
  const importEnd = findImportEnd(tsCode);
  if (importEnd !== -1) {
    tsCode = tsCode.substring(0, importEnd) + '\n' + interfaces + tsCode.substring(importEnd);
  } else {
    // Fallback: füge Interfaces am Anfang hinzu
    tsCode = interfaces + tsCode;
  }
  
  // Ersetze einfache Funktionskomponente durch React.FC
  tsCode = replaceFunctionComponentWithFC(tsCode, componentName);
  
  return tsCode;
}

/**
 * Findet die Position, an der die Importe enden
 * @param {string} code - Der zu untersuchende Code
 * @returns {number} Die Position am Ende der Importe
 */
function findImportEnd(code) {
  const lines = code.split('\n');
  let lastImportLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportLine = i;
    } else if (lastImportLine !== -1 && lines[i].trim() !== '') {
      // Wir haben die erste nicht-leere Zeile nach den Imports gefunden
      return lines.slice(0, lastImportLine + 1).join('\n').length + 1;
    }
  }
  
  return lastImportLine !== -1 ? lines.slice(0, lastImportLine + 1).join('\n').length + 1 : -1;
}

/**
 * Ersetzt die Funktionskomponente durch eine Komponente mit React.FC
 * @param {string} code - Der Quellcode
 * @param {string} componentName - Der Name der Komponente
 * @returns {string} Der aktualisierte Code
 */
function replaceFunctionComponentWithFC(code, componentName) {
  // Funktion als "function Component(props) {...}"
  const functionPattern = new RegExp(`function\\s+${componentName}\\s*\\(\\s*props\\s*\\)\\s*{`, 'g');
  
  // Arrow-Funktion als "const Component = (props) => {...}"
  const arrowPattern = new RegExp(`const\\s+${componentName}\\s*=\\s*\\(\\s*props\\s*\\)\\s*=>\\s*{`, 'g');
  
  // Ersetzen von Funktionsdeklarationen
  let updatedCode = code.replace(functionPattern, `const ${componentName}: FC<${componentName}Props> = (props) => {`);
  
  // Ersetzen von Arrow-Funktionen
  updatedCode = updatedCode.replace(arrowPattern, `const ${componentName}: FC<${componentName}Props> = (props) => {`);
  
  return updatedCode;
}

/**
 * Leitet den Typ für ein Props-Feld aus dem Namen ab
 * @param {string} propName - Der Name des Props
 * @returns {string} Der abgeleitete TypeScript-Typ
 */
function inferPropType(propName) {
  // Typinferenz basierend auf gängigen Namenskonventionen
  if (propName.startsWith('on') && propName.length > 2 && propName[2] === propName[2].toUpperCase()) {
    return '(event: any) => void';
  }
  
  if (propName.includes('Ref')) {
    return 'React.RefObject<any>';
  }
  
  if (['active', 'disabled', 'visible', 'open', 'checked', 'selected', 'loading'].includes(propName)) {
    return 'boolean';
  }
  
  if (['count', 'index', 'size', 'min', 'max', 'length', 'width', 'height'].includes(propName)) {
    return 'number';
  }
  
  if (['style', 'options', 'data', 'config'].includes(propName)) {
    return 'Record<string, any>';
  }
  
  if (['children', 'content', 'label'].includes(propName)) {
    return 'React.ReactNode';
  }
  
  if (['className', 'id', 'name', 'title', 'description', 'placeholder', 'href', 'src', 'alt'].includes(propName)) {
    return 'string';
  }
  
  if (propName.endsWith('s') && !['status', 'props', 'this', 'canvas'].includes(propName)) {
    return 'any[]';
  }
  
  // Fallback
  return 'any';
}

/**
 * Leitet den Typ für einen Event-Handler aus dem Namen ab
 * @param {string} handlerName - Der Name des Event-Handlers
 * @returns {string} Der abgeleitete TypeScript-Typ
 */
function inferEventType(handlerName) {
  const lowerName = handlerName.toLowerCase();
  
  if (lowerName.includes('change') || lowerName.includes('input')) {
    return 'React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>';
  }
  
  if (lowerName.includes('click') || lowerName.includes('press')) {
    return 'React.MouseEvent<HTMLElement, MouseEvent>';
  }
  
  if (lowerName.includes('submit')) {
    return 'React.FormEvent<HTMLFormElement>';
  }
  
  if (lowerName.includes('key')) {
    return 'React.KeyboardEvent<HTMLElement>';
  }
  
  if (lowerName.includes('focus') || lowerName.includes('blur')) {
    return 'React.FocusEvent<HTMLElement>';
  }
  
  if (lowerName.includes('drag')) {
    return 'React.DragEvent<HTMLElement>';
  }
  
  // Fallback
  return 'React.SyntheticEvent';
}

/**
 * Leitet den Typ für eine useState-Variable aus dem Namen ab
 * @param {Object} initialValue - Der initiale Wert des States
 * @param {string} stateName - Der Name der State-Variable
 * @returns {string} Der abgeleitete TypeScript-Typ
 */
function inferStateType(initialValue, stateName) {
  if (!initialValue) {
    // Wenn kein Initialwert vorhanden ist, versuche aus dem Variablennamen abzuleiten
    return inferPropType(stateName);
  }
  
  // Versuche, den Typ aus dem Initialwert abzuleiten
  if (initialValue.type === 'BooleanLiteral') {
    return 'boolean';
  }
  
  if (initialValue.type === 'NumericLiteral') {
    return 'number';
  }
  
  if (initialValue.type === 'StringLiteral') {
    return 'string';
  }
  
  if (initialValue.type === 'ArrayExpression') {
    return 'any[]';
  }
  
  if (initialValue.type === 'ObjectExpression') {
    return 'Record<string, any>';
  }
  
  if (initialValue.type === 'NullLiteral') {
    return 'null | any';
  }
  
  // Spezialfall: Initialwert ist undefined oder null
  if (
    initialValue.type === 'Identifier' && 
    (initialValue.name === 'undefined' || initialValue.name === 'null')
  ) {
    return stateName.endsWith('s') ? 'any[] | null' : 'any | null';
  }
  
  // Fallback: aus dem Variablennamen ableiten
  return inferPropType(stateName);
}

/**
 * Leitet den Typ für eine useRef-Variable aus dem Namen ab
 * @param {string} refName - Der Name der Ref-Variable
 * @returns {string} Der abgeleitete TypeScript-Typ
 */
function inferRefType(refName) {
  const lowerName = refName.toLowerCase();
  
  if (lowerName.includes('input')) {
    return 'HTMLInputElement';
  }
  
  if (lowerName.includes('button')) {
    return 'HTMLButtonElement';
  }
  
  if (lowerName.includes('form')) {
    return 'HTMLFormElement';
  }
  
  if (lowerName.includes('div')) {
    return 'HTMLDivElement';
  }
  
  if (lowerName.includes('span')) {
    return 'HTMLSpanElement';
  }
  
  if (lowerName.includes('img') || lowerName.includes('image')) {
    return 'HTMLImageElement';
  }
  
  if (lowerName.includes('video')) {
    return 'HTMLVideoElement';
  }
  
  if (lowerName.includes('audio')) {
    return 'HTMLAudioElement';
  }
  
  if (lowerName.includes('canvas')) {
    return 'HTMLCanvasElement';
  }
  
  if (lowerName.includes('text')) {
    return 'HTMLInputElement';
  }
  
  if (lowerName.includes('select')) {
    return 'HTMLSelectElement';
  }
  
  if (lowerName.includes('textarea')) {
    return 'HTMLTextAreaElement';
  }
  
  // Fallback
  return 'HTMLElement';
}

/**
 * Findet alle JSX-Komponenten in einem Verzeichnis basierend auf Glob-Mustern
 * @param {string} pattern - Glob-Muster für die zu konvertierenden Dateien
 * @param {Object} options - Zusätzliche Optionen
 * @returns {Promise<string[]>} - Array von Dateipfaden
 */
async function findJsxFiles(pattern, options = {}) {
  try {
    const files = await globPromise(pattern, {
      ignore: options.ignore || ['**/node_modules/**', '**/dist/**', '**/build/**'],
      absolute: true,
      ...options
    });
    return files;
  } catch (error) {
    console.error(chalk.red(`Fehler beim Suchen von Dateien: ${error.message}`));
    return [];
  }
}

/**
 * Batch-Verarbeitung von Dateien mit Multi-Threading
 * @param {string[]} files - Liste der zu konvertierenden Dateien
 * @param {Object} options - Optionen für die Konvertierung
 * @returns {Promise<Object[]>} - Array von Konvertierungsergebnissen
 */
async function processBatch(files, options = {}) {
  const batchSize = options.batchSize || 10;
  const concurrency = options.concurrency || Math.max(1, os.cpus().length - 1);
  const totalFiles = files.length;
  let processedFiles = 0;
  const results = [];

  console.log(chalk.blue(`\n🚀 Starte Batch-Konvertierung von ${totalFiles} Dateien mit ${concurrency} Worker-Threads und Batch-Größe ${batchSize}\n`));
  
  // Fortschrittsanzeige
  const progressInterval = setInterval(() => {
    const percent = Math.round((processedFiles / totalFiles) * 100);
    process.stdout.write(`\r${chalk.yellow(`⏳ Fortschritt: ${processedFiles}/${totalFiles} (${percent}%)`)}${' '.repeat(20)}`);
    
    // Speicherverbrauch überwachen
    logMemoryUsage();
  }, 3000);

  // Checkpoint-Funktion für inkrementelle Verarbeitung
  const saveCheckpoint = async (processedResults) => {
    if (options.checkpointPath) {
      const checkpoint = {
        timestamp: new Date().toISOString(),
        processed: processedFiles,
        total: totalFiles,
        results: processedResults.map(r => ({
          sourcePath: r.sourcePath,
          targetPath: r.targetPath,
          success: r.success
        }))
      };
      
      fs.writeFileSync(options.checkpointPath, JSON.stringify(checkpoint, null, 2));
      console.log(chalk.gray(`\nCheckpoint gespeichert: ${processedFiles}/${totalFiles} verarbeitet`));
    }
  };

  // Dateien in Batches verarbeiten
  for (let i = 0; i < totalFiles; i += batchSize) {
    const batchFiles = files.slice(i, i + batchSize);
    console.log(chalk.cyan(`\n📦 Verarbeite Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(totalFiles/batchSize)} (${batchFiles.length} Dateien)`));
    
    // Verarbeitung mit Worker Threads
    const workerPromises = [];
    for (let j = 0; j < batchFiles.length; j += Math.ceil(batchFiles.length / concurrency)) {
      const workerBatch = batchFiles.slice(j, j + Math.ceil(batchFiles.length / concurrency));
      workerPromises.push(
        new Promise((resolve) => {
          const worker = new Worker(__filename, {
            workerData: { 
              files: workerBatch,
              options: { 
                ...options, 
                verbose: false,
                returnContent: false
              }
            }
          });
          
          worker.on('message', (data) => {
            processedFiles += data.length;
            results.push(...data);
            resolve(data);
          });
          
          worker.on('error', (err) => {
            console.error(chalk.red(`Worker-Fehler: ${err.message}`));
            resolve([]);
          });
          
          worker.on('exit', (code) => {
            if (code !== 0) {
              console.error(chalk.red(`Worker mit Exit-Code ${code} beendet`));
            }
          });
        })
      );
    }

    // Warten auf Abschluss aller Worker im aktuellen Batch
    const batchResults = await Promise.all(workerPromises);
    
    // Speichern eines Checkpoints nach jedem Batch
    await saveCheckpoint(results);
    
    // Speicher freigeben nach jedem Batch
    global.gc && global.gc();
  }

  clearInterval(progressInterval);
  console.log(chalk.green(`\n✅ Konvertierung abgeschlossen: ${totalFiles} Dateien verarbeitet\n`));
  
  return results;
}

/**
 * Worker Thread Implementierung
 */
if (!isMainThread) {
  const { files, options } = workerData;
  const results = [];

  for (const file of files) {
    try {
      // Analyse durchführen (einmal pro Datei)
      const analysis = analyzeComponent(file);
      
      // Konvertierung durchführen
      const result = convertToTypeScript(file, null, {
        ...options,
        analysis, // Wiederverwendung der Analyse für bessere Effizienz
        dryRun: options.dryRun
      });
      
      // Minimales Ergebnis für bessere Memory-Effizienz
      results.push({
        sourcePath: file,
        targetPath: result.targetPath,
        success: result.success,
        message: result.message || result.error
      });
    } catch (error) {
      results.push({
        sourcePath: file,
        error: error.message,
        success: false
      });
    }
    
    // Explizit aufräumen
    if (global.gc) {
      global.gc();
    }
  }

  // Ergebnisse zurück an den Hauptthread senden
  parentPort.postMessage(results);
  process.exit(0);
}

/**
 * Führt die Konvertierung durch und gibt das Ergebnis aus
 * @param {string} filePath - Pfad zur JSX-Quelldatei
 * @param {string} outputPath - Pfad zur TSX-Zieldatei (optional)
 * @param {Object} options - Zusätzliche Optionen
 */
function runConversion(filePath, outputPath = null, options = {}) {
  console.log(chalk.blue(`\n✨ Konvertiere zu TypeScript: ${chalk.bold(path.basename(filePath))}`));
  console.log(chalk.gray(`Quelldatei: ${filePath}`));
  
  if (outputPath) {
    console.log(chalk.gray(`Zieldatei: ${outputPath}`));
  }
  
  const startTime = Date.now();
  const result = convertToTypeScript(filePath, outputPath, options);
  const duration = Date.now() - startTime;
  
  if (result.success) {
    console.log(chalk.green(`\n✓ Konvertierung abgeschlossen in ${duration}ms`));
    console.log(chalk.gray(`Ausgabe gespeichert in: ${result.targetPath}`));
  } else {
    console.log(chalk.yellow(`\n⚠ ${result.message || result.error}`));
  }
  
  return result;
}

/**
 * Konvertiert mehrere JSX-Komponenten zu TSX basierend auf einem Pattern
 * @param {string} pattern - Glob-Muster für die zu konvertierenden Dateien
 * @param {Object} options - Optionen für die Konvertierung
 */
async function convertComponents(pattern, options = {}) {
  const startTime = Date.now();
  console.log(chalk.blue(`\n🔍 Suche nach JSX-Komponenten mit Muster: ${chalk.bold(pattern)}`));
  
  // Dateien finden
  const files = await findJsxFiles(pattern, {
    ignore: options.ignore,
    cwd: options.cwd || process.cwd()
  });
  
  if (files.length === 0) {
    console.log(chalk.yellow('Keine JSX-Dateien gefunden, die dem Muster entsprechen.'));
    return [];
  }
  
  console.log(chalk.green(`\n✓ ${files.length} JSX-Dateien gefunden.`));
  
  // Batch-Verarbeitung starten
  const results = await processBatch(files, options);
  
  // Zusammenfassung erstellen
  const duration = Date.now() - startTime;
  console.log(chalk.yellow('\n📝 ZUSAMMENFASSUNG:'));
  console.log(chalk.gray('════════════════════════════════════════════'));
  console.log(`Verarbeitete Dateien: ${chalk.bold(files.length)}`);
  console.log(`Erfolgreiche Konvertierungen: ${chalk.bold(results.filter(r => r.success).length)}`);
  console.log(`Fehler: ${chalk.bold(results.filter(r => !r.success).length)}`);
  console.log(`Gesamtzeit: ${chalk.bold(duration)} ms`);
  console.log(chalk.gray('════════════════════════════════════════════'));
  
  // Speicherüberwachung
  logMemoryUsage();
  
  // Ergebnisse optional in eine Zusammenfassungsdatei schreiben
  if (options.summary) {
    const summaryPath = options.summaryPath || 'typescript-conversion-summary.json';
    fs.writeFileSync(summaryPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      pattern,
      totalFiles: files.length,
      duration,
      results: results.map(r => ({
        sourcePath: r.sourcePath,
        targetPath: r.targetPath,
        success: r.success
      }))
    }, null, 2));
    console.log(chalk.green(`\n✓ Zusammenfassung gespeichert in: ${summaryPath}`));
  }
  
  return results;
}

// Exportiere Funktionen
module.exports = {
  convertToTypeScript,
  runConversion,
  convertComponents,
  findJsxFiles
};

// Hauptfunktion, wenn das Skript direkt ausgeführt wird
if (require.main === module && isMainThread) {
  // Kommandozeilenargumente verarbeiten
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error(chalk.red('Fehler: Bitte geben Sie mindestens ein Argument an.'));
    console.log(`Verwendung: 
    ${chalk.cyan('node convertToTypeScript.optimized.js <Pfad-zur-JSX-Komponente> [Ausgabepfad]')} - Konvertiere eine einzelne Komponente
    ${chalk.cyan('node convertToTypeScript.optimized.js --pattern="components/**/*.jsx"')} - Konvertiere alle passenden Komponenten
    
    Optionen:
    --pattern=<glob>            Glob-Muster für Dateien
    --batch-size=<number>       Größe der Batches (Standard: 10)
    --concurrency=<number>      Anzahl paralleler Worker (Standard: CPU-Kerne - 1)
    --output-dir=<path>         Ausgabeverzeichnis für konvertierte Dateien
    --checkpoint-path=<path>    Pfad für die Checkpoint-Datei für inkrementelle Konvertierung
    --summary                   Zusammenfassung erstellen
    --summary-path=<path>       Pfad für die Zusammenfassungsdatei
    --dry-run                   Keine Dateien schreiben, nur Simulation
    --include-dir=<dir>         Nur in bestimmten Verzeichnissen suchen
    --ignore=<pattern>          Glob-Muster für zu ignorierende Dateien
    --verbose                   Ausführliche Ausgabe
    `);
    process.exit(1);
  }
  
  // Prüfen, ob ein einzelner Dateipfad oder ein Pattern angegeben wurde
  if (!args[0].startsWith('--')) {
    // Einzelne Komponente konvertieren
    const filePath = path.resolve(args[0]);
    const outputPath = args[1] ? path.resolve(args[1]) : null;
    
    // Optionen aus weiteren Argumenten extrahieren
    const options = {};
    for (let i = 2; i < args.length; i++) {
      if (args[i] === '--dry-run') {
        options.dryRun = true;
      } else if (args[i] === '--verbose') {
        options.verbose = true;
      }
    }
    
    runConversion(filePath, outputPath, options);
  } else {
    // Parse command line arguments
    const options = {};
    let pattern = '**/*.jsx'; // Default pattern
    
    args.forEach(arg => {
      if (arg.startsWith('--pattern=')) {
        pattern = arg.substring(10);
      } else if (arg.startsWith('--batch-size=')) {
        options.batchSize = parseInt(arg.substring(13), 10);
      } else if (arg.startsWith('--concurrency=')) {
        options.concurrency = parseInt(arg.substring(14), 10);
      } else if (arg.startsWith('--output-dir=')) {
        options.outputDir = arg.substring(13);
      } else if (arg.startsWith('--checkpoint-path=')) {
        options.checkpointPath = arg.substring(18);
      } else if (arg === '--summary') {
        options.summary = true;
      } else if (arg.startsWith('--summary-path=')) {
        options.summaryPath = arg.substring(15);
        options.summary = true;
      } else if (arg === '--dry-run') {
        options.dryRun = true;
      } else if (arg.startsWith('--include-dir=')) {
        const includeDir = arg.substring(14);
        pattern = path.join(includeDir, pattern);
      } else if (arg.startsWith('--ignore=')) {
        options.ignore = arg.substring(9).split(',');
      } else if (arg === '--verbose') {
        options.verbose = true;
      } else if (arg === '--help') {
        console.log(`Verwendung: 
        ${chalk.cyan('node convertToTypeScript.optimized.js <Pfad-zur-JSX-Komponente> [Ausgabepfad]')} - Konvertiere eine einzelne Komponente
        ${chalk.cyan('node convertToTypeScript.optimized.js --pattern="components/**/*.jsx"')} - Konvertiere alle passenden Komponenten
        
        Optionen:
        --pattern=<glob>            Glob-Muster für Dateien
        --batch-size=<number>       Größe der Batches (Standard: 10)
        --concurrency=<number>      Anzahl paralleler Worker (Standard: CPU-Kerne - 1)
        --output-dir=<path>         Ausgabeverzeichnis für konvertierte Dateien
        --checkpoint-path=<path>    Pfad für die Checkpoint-Datei für inkrementelle Konvertierung
        --summary                   Zusammenfassung erstellen
        --summary-path=<path>       Pfad für die Zusammenfassungsdatei
        --dry-run                   Keine Dateien schreiben, nur Simulation
        --include-dir=<dir>         Nur in bestimmten Verzeichnissen suchen
        --ignore=<pattern>          Glob-Muster für zu ignorierende Dateien
        --verbose                   Ausführliche Ausgabe
        `);
        process.exit(0);
      }
    });
    
    // Batch-Konvertierung starten
    convertComponents(pattern, options).catch(err => {
      console.error(chalk.red(`Fehler bei der Batch-Verarbeitung: ${err.message}`));
      process.exit(1);
    });
  }
}