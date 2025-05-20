/**
 * TypeScript-Konvertierungs-Tool (convertToTypeScript.js)
 * 
 * Dieses Tool konvertiert React JavaScript-Komponenten (JSX) zu TypeScript (TSX).
 * Es führt intelligente Typerkennung für Props durch, erstellt passende Interface-Definitionen
 * und behandelt Event-Handler und Refs korrekt.
 * 
 * Nutzung: node convertToTypeScript.js <Pfad-zur-JSX-Komponente> [Ausgabepfad]
 */

const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const chalk = require('chalk');

// Importiere das Analyse-Tool
const { analyzeComponent } = require('./analyzeComponent');

/**
 * Konvertiert eine JSX-Komponente zu TSX
 * @param {string} filePath - Pfad zur JSX-Quelldatei
 * @param {string} outputPath - Pfad zur TSX-Zieldatei (optional)
 * @returns {Object} Ergebnis der Konvertierung
 */
function convertToTypeScript(filePath, outputPath = null) {
  // Prüfe, ob die Quelldatei existiert
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`Fehler: Datei nicht gefunden: ${filePath}`));
    process.exit(1);
  }

  // Bestimme Dateinamen und Pfade
  const fileExtension = path.extname(filePath);
  const fileName = path.basename(filePath, fileExtension);
  const isAlreadyTypeScript = fileExtension === '.tsx' || fileExtension === '.ts';
  
  if (isAlreadyTypeScript) {
    console.warn(chalk.yellow(`Warnung: Die Datei ${filePath} ist bereits eine TypeScript-Datei.`));
    return { 
      success: false, 
      message: 'Datei ist bereits TypeScript',
      sourcePath: filePath,
      targetPath: null,
      content: null 
    };
  }

  // Analysiere die Komponente mit dem Analyse-Tool
  console.log(chalk.blue(`\n📊 Analysiere Komponente: ${chalk.bold(fileName)}`));
  const analysis = analyzeComponent(filePath);
  
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

  // Füge TypeScript-Erweiterungen hinzu
  const tsCode = addTypeScriptExtensions(code, analysis);
  
  // Bestimme den Ausgabepfad
  if (!outputPath) {
    const dir = path.dirname(filePath);
    const newExtension = fileExtension === '.jsx' ? '.tsx' : '.ts';
    outputPath = path.join(dir, `${fileName}${newExtension}`);
  }
  
  // Schreibe die Ausgabedatei
  fs.writeFileSync(outputPath, tsCode);
  
  return {
    success: true,
    message: 'Konvertierung erfolgreich',
    sourcePath: filePath,
    targetPath: outputPath,
    content: tsCode
  };
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
  if (analysis.props.definitions.length > 0) {
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
  if (analysis.props.definitions.length > 0) {
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
        if (prop.type.includes(propType)) {
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
  if (analysis.props.usages.length > 0) {
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
  const needsReactTypes = analysis.hooks.length > 0 || 
                        analysis.props.usages.length > 0 || 
                        analysis.eventHandlers.length > 0;
  
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
 * Führt die Konvertierung durch und gibt das Ergebnis aus
 * @param {string} filePath - Pfad zur JSX-Quelldatei
 * @param {string} outputPath - Pfad zur TSX-Zieldatei (optional)
 */
function runConversion(filePath, outputPath = null) {
  console.log(chalk.blue(`\n✨ Konvertiere zu TypeScript: ${chalk.bold(path.basename(filePath))}`));
  console.log(chalk.gray(`Quelldatei: ${filePath}`));
  
  if (outputPath) {
    console.log(chalk.gray(`Zieldatei: ${outputPath}`));
  }
  
  const startTime = Date.now();
  const result = convertToTypeScript(filePath, outputPath);
  const duration = Date.now() - startTime;
  
  if (result.success) {
    console.log(chalk.green(`\n✓ Konvertierung abgeschlossen in ${duration}ms`));
    console.log(chalk.gray(`Ausgabe gespeichert in: ${result.targetPath}`));
  } else {
    console.log(chalk.yellow(`\n⚠ ${result.message}`));
  }
  
  return result;
}

// Hauptfunktion, wenn das Skript direkt ausgeführt wird
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error(chalk.red('Fehler: Bitte geben Sie den Pfad zur JSX-Komponente an.'));
    console.log(`Verwendung: ${chalk.cyan('node convertToTypeScript.js <Pfad-zur-JSX-Komponente> [Ausgabepfad]')}`);
    process.exit(1);
  }
  
  const filePath = path.resolve(args[0]);
  const outputPath = args[1] ? path.resolve(args[1]) : null;
  
  runConversion(filePath, outputPath);
}

module.exports = {
  convertToTypeScript,
  runConversion
};