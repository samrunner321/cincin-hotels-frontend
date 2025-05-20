#!/usr/bin/env node
/**
 * TypeScript-Konvertierungstool
 * 
 * Dieses Tool konvertiert React-Komponenten von JavaScript zu TypeScript.
 * Es unterstützt:
 * - Konvertierung von .js/.jsx zu .ts/.tsx
 * - Erstellung von TypeScript-Interfaces aus PropTypes
 * - Generierung von Typdefinitionen für Hooks und State
 * - TypeScript-Migrationen für funktionale und Klassenkomponenten
 * 
 * Verwendung:
 * node scripts/convertToTypeScript.js [Dateipfad] [Optionen]
 * 
 * Optionen:
 *   --dir               - Konvertiert alle Komponenten in einem Verzeichnis
 *   --dry-run           - Zeigt Änderungen an, ohne sie zu speichern
 *   --force             - Überschreibt existierende TypeScript-Dateien
 *   --stdout            - Gibt den konvertierten Code auf der Konsole aus
 *   --preserve-comments - Behält alle Kommentare bei
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const { default: template } = require('@babel/template');
const chalk = require('chalk');

// Abhängigkeit vom Komponenten-Analyse-Tool
const analyzer = require('./analyzeComponent');

// Konfiguration für den Parser
const PARSER_OPTIONS = {
  sourceType: 'module',
  plugins: [
    'jsx',
    'typescript',
    'classProperties',
    'decorators-legacy',
    'objectRestSpread',
    'optionalChaining',
    'nullishCoalescingOperator',
  ],
};

// Konvertierungsoptionen
const DEFAULT_OPTIONS = {
  directory: false,
  dryRun: false,
  force: false,
  stdout: false,
  preserveComments: true,
};

/**
 * Hauptfunktion zur Konvertierung einer Datei
 */
function convertToTypeScript(filePath, options = {}) {
  const resolvedOptions = { ...DEFAULT_OPTIONS, ...options };
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Dateiendung überprüfen und Zieldatei bestimmen
  const fileExt = path.extname(filePath);
  const baseName = path.basename(filePath, fileExt);
  const dirName = path.dirname(filePath);
  let targetExt;
  
  if (fileExt === '.js') {
    targetExt = '.ts';
  } else if (fileExt === '.jsx') {
    targetExt = '.tsx';
  } else if (fileExt === '.ts' || fileExt === '.tsx') {
    console.log(chalk.yellow(`Warnung: ${filePath} ist bereits eine TypeScript-Datei.`));
    return null;
  } else {
    console.error(chalk.red(`Fehler: Unbekannte Dateiendung ${fileExt}`));
    return null;
  }
  
  const targetPath = path.join(dirName, baseName + targetExt);
  
  // Prüfen, ob die Zieldatei bereits existiert
  if (fs.existsSync(targetPath) && !resolvedOptions.force) {
    console.error(chalk.red(`Fehler: Zieldatei ${targetPath} existiert bereits. Verwende --force, um zu überschreiben.`));
    return null;
  }
  
  try {
    // Komponente analysieren
    const analysis = analyzer.analyzeComponent(filePath);
    
    // AST erstellen und konvertieren
    const ast = parse(fileContent, PARSER_OPTIONS);
    
    // Konvertiere PropTypes zu TypeScript-Interfaces
    convertPropTypes(ast, analysis);
    
    // Füge TypeScript-Annotationen für useState-Hooks hinzu
    addStateTypeAnnotations(ast, analysis);
    
    // Füge TypeScript-Annotationen für useEffect-Hooks hinzu
    addEffectTypeAnnotations(ast, analysis);
    
    // Füge Typen für Funktionsparameter hinzu
    addFunctionParameterTypes(ast, analysis);
    
    // Generiere Code aus dem modifizierten AST
    const output = generate(ast, { 
      retainLines: true,
      comments: resolvedOptions.preserveComments,
    });
    
    // Ergebnis zurückgeben
    return {
      original: fileContent,
      converted: output.code,
      originalPath: filePath,
      targetPath,
    };
  } catch (error) {
    console.error(chalk.red(`Fehler bei der Konvertierung von ${filePath}:`), error);
    return null;
  }
}

/**
 * Konvertiere PropTypes zu TypeScript-Interfaces
 */
function convertPropTypes(ast, analysis) {
  // Sammle Informationen über PropTypes
  const propTypesMeta = {
    componentName: analysis.componentName,
    propTypes: {},
    defaultProps: {},
    needsExport: false,
  };
  
  // Finde PropTypes und defaultProps
  traverse(ast, {
    AssignmentExpression(path) {
      if (t.isMemberExpression(path.node.left) && 
          path.node.left.property && 
          t.isIdentifier(path.node.left.property, { name: 'propTypes' })) {
        
        const componentName = path.node.left.object.name;
        if (componentName === analysis.componentName && 
            t.isObjectExpression(path.node.right)) {
          
          // Sammle PropTypes
          path.node.right.properties.forEach(prop => {
            if (t.isObjectProperty(prop) && prop.key) {
              const propName = prop.key.name;
              const propTypeInfo = extractPropTypeInfo(prop.value);
              propTypesMeta.propTypes[propName] = propTypeInfo;
            }
          });
          
          // Markiere zur Entfernung
          path.addComment('leading', ' @ts-ignore - PropTypes werden zu TypeScript-Interface konvertiert');
          propTypesMeta.needsExport = true;
        }
      }
      
      // defaultProps
      if (t.isMemberExpression(path.node.left) && 
          path.node.left.property && 
          t.isIdentifier(path.node.left.property, { name: 'defaultProps' })) {
        
        const componentName = path.node.left.object.name;
        if (componentName === analysis.componentName && 
            t.isObjectExpression(path.node.right)) {
          
          // Sammle defaultProps
          path.node.right.properties.forEach(prop => {
            if (t.isObjectProperty(prop) && prop.key) {
              const propName = prop.key.name;
              const defaultValue = prop.value;
              propTypesMeta.defaultProps[propName] = true;
            }
          });
          
          // Markiere zur Entfernung
          path.addComment('leading', ' @ts-ignore - defaultProps werden zu optionalen Props konvertiert');
        }
      }
    },
  });
  
  // Erstelle TypeScript-Interface für Props
  if (Object.keys(propTypesMeta.propTypes).length > 0) {
    const interfaceAST = createPropsInterface(propTypesMeta);
    
    // Füge das Interface zum AST hinzu
    let insertPosition = null;
    
    // Finde die beste Position zum Einfügen (vor der Komponente)
    traverse(ast, {
      Program(path) {
        // Füge nach den Imports, aber vor dem ersten Element ein
        const imports = path.node.body.filter(node => t.isImportDeclaration(node));
        if (imports.length > 0) {
          insertPosition = path.get('body')[imports.length];
        } else {
          insertPosition = path.get('body')[0];
        }
      },
    }, null, true); // Früh abbrechen, sobald wir die Position gefunden haben
    
    if (insertPosition) {
      insertPosition.insertBefore(interfaceAST);
    }
  }
}

/**
 * Erstelle ein TypeScript-Interface für Props
 */
function createPropsInterface(meta) {
  const interfaceName = `${meta.componentName}Props`;
  const properties = [];
  
  // Erstelle Properties für das Interface
  Object.entries(meta.propTypes).forEach(([propName, typeInfo]) => {
    const isOptional = meta.defaultProps[propName] || !typeInfo.isRequired;
    
    let tsType = typeInfo.tsType || 'any';
    
    // Erstelle Property
    const property = t.tsPropertySignature(
      t.identifier(propName),
      t.tsTypeAnnotation(
        parseTypeAnnotation(tsType)
      )
    );
    
    // Optional markieren
    property.optional = isOptional;
    
    // Kommentar hinzufügen, wenn spezielle PropTypes verwendet werden
    if (typeInfo.original && !typeInfo.original.match(/^(string|number|bool|func|object|array)$/)) {
      property.leadingComments = [{
        type: 'CommentBlock',
        value: ` Original PropType: ${typeInfo.original} `
      }];
    }
    
    properties.push(property);
  });
  
  // Interface erstellen
  const interfaceDeclaration = t.tsInterfaceDeclaration(
    t.identifier(interfaceName),
    null, // Interface-Erweiterung (keine)
    [],   // Interface-Mixins (keine)
    t.tsInterfaceBody(properties)
  );
  
  // Export hinzufügen, wenn nötig
  if (meta.needsExport) {
    return t.exportNamedDeclaration(interfaceDeclaration, []);
  }
  
  return interfaceDeclaration;
}

/**
 * Parse einen TypeScript-Typ zu einem AST-Knoten
 */
function parseTypeAnnotation(typeStr) {
  // Einfache Typen
  switch (typeStr) {
    case 'string': return t.tsStringKeyword();
    case 'number': return t.tsNumberKeyword();
    case 'boolean': return t.tsBooleanKeyword();
    case 'any': return t.tsAnyKeyword();
    case 'void': return t.tsVoidKeyword();
    case 'never': return t.tsNeverKeyword();
    case 'object': return t.tsObjectKeyword();
    case 'unknown': return t.tsUnknownKeyword();
    case 'null': return t.tsNullKeyword();
    case 'undefined': return t.tsUndefinedKeyword();
  }
  
  // Function
  if (typeStr === 'function' || typeStr === 'func') {
    return t.tsFunctionType(
      null, // Type parameters
      [],   // Parameters
      t.tsTypeAnnotation(t.tsAnyKeyword())
    );
  }
  
  // Array
  if (typeStr === 'array') {
    return t.tsArrayType(t.tsAnyKeyword());
  }
  
  // Array mit spezifischem Typ
  const arrayMatch = typeStr.match(/^(\w+)\[\]$/);
  if (arrayMatch) {
    return t.tsArrayType(parseTypeAnnotation(arrayMatch[1]));
  }
  
  // Union-Typen
  if (typeStr.includes('|')) {
    const types = typeStr.split('|').map(t => parseTypeAnnotation(t.trim()));
    return t.tsUnionType(types);
  }
  
  // Für komplexere Typen wie oneOf, oneOfType, etc.
  if (typeStr.startsWith('oneOf(') || typeStr.startsWith('oneOfType(')) {
    return t.tsAnyKeyword(); // Vereinfachung für dieses Beispiel
  }
  
  // Standardmäßig Typverweis (ReactNode, HTMLElement, etc.)
  return t.tsTypeReference(t.identifier(typeStr));
}

/**
 * Extrahiere Informationen aus PropTypes (ähnlich wie in analyzeComponent.js)
 */
function extractPropTypeInfo(node) {
  let originalType = 'any';
  let tsType = 'any';
  let isRequired = false;
  
  // PropTypes.string.isRequired oder PropTypes.string
  if (t.isMemberExpression(node)) {
    if (t.isIdentifier(node.property, { name: 'isRequired' })) {
      isRequired = true;
      node = node.object; // Gehe zum eigentlichen Typ
    }
    
    if (t.isMemberExpression(node)) {
      // PropTypes.X
      if (t.isIdentifier(node.object) && 
          (node.object.name === 'PropTypes' || node.object.name === 'ReactPropTypes')) {
        if (t.isIdentifier(node.property)) {
          originalType = node.property.name;
          
          // Konvertiere PropTypes-Typen zu TypeScript-Typen
          switch (originalType) {
            case 'string': tsType = 'string'; break;
            case 'number': tsType = 'number'; break;
            case 'bool': tsType = 'boolean'; break;
            case 'func': tsType = 'Function'; break;
            case 'object': tsType = 'object'; break;
            case 'array': tsType = 'any[]'; break;
            case 'symbol': tsType = 'symbol'; break;
            case 'node': tsType = 'React.ReactNode'; break;
            case 'element': tsType = 'React.ReactElement'; break;
            case 'elementType': tsType = 'React.ElementType'; break;
            case 'any': tsType = 'any'; break;
            default: tsType = 'any'; break;
          }
        }
      }
    }
  }
  
  // PropTypes.oneOf([...])
  if (t.isCallExpression(node) && 
      t.isMemberExpression(node.callee) &&
      t.isIdentifier(node.callee.property)) {
    const method = node.callee.property.name;
    originalType = `${node.callee.object.property ? node.callee.object.property.name : 'PropTypes'}.${method}`;
    
    if (method === 'oneOf' && node.arguments.length > 0) {
      if (t.isArrayExpression(node.arguments[0])) {
        const values = node.arguments[0].elements
          .map(extractLiteralValue)
          .filter(Boolean);
        
        // Für string literals
        if (values.length > 0 && typeof values[0] === 'string') {
          tsType = values.map(v => `'${v.replace(/["']/g, '')}'`).join(' | ');
        } 
        // Für numerische literals
        else if (values.length > 0 && typeof values[0] === 'number') {
          tsType = values.join(' | ');
        }
        // Fallback
        else {
          tsType = 'any';
        }
      }
    } else if (method === 'oneOfType' && node.arguments.length > 0) {
      if (t.isArrayExpression(node.arguments[0])) {
        // Vereinfacht zu any
        tsType = 'any';
      }
    } else if (method === 'arrayOf' && node.arguments.length > 0) {
      const itemType = extractPropTypeInfo(node.arguments[0]).tsType;
      tsType = `${itemType}[]`;
    } else if (method === 'objectOf' && node.arguments.length > 0) {
      const valueType = extractPropTypeInfo(node.arguments[0]).tsType;
      tsType = `Record<string, ${valueType}>`;
    } else if (method === 'shape' && node.arguments.length > 0) {
      if (t.isObjectExpression(node.arguments[0])) {
        tsType = 'any'; // Vereinfacht
      }
    }
  }
  
  return { original: originalType, tsType, isRequired };
}

/**
 * Extrahiere den Wert eines Literals
 */
function extractLiteralValue(node) {
  if (!node) return null;
  
  if (t.isStringLiteral(node)) {
    return node.value;
  } else if (t.isNumericLiteral(node)) {
    return node.value;
  } else if (t.isBooleanLiteral(node)) {
    return node.value;
  } else if (t.isNullLiteral(node)) {
    return null;
  } else if (t.isIdentifier(node)) {
    if (node.name === 'undefined') {
      return undefined;
    }
  }
  
  return null;
}

/**
 * Füge TypeScript-Annotationen für useState-Hooks hinzu
 */
function addStateTypeAnnotations(ast, analysis) {
  if (!analysis.state || analysis.state.length === 0) {
    return;
  }
  
  traverse(ast, {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: 'useState' })) {
        // Finde den zugehörigen State im analysis-Objekt
        let stateName = null;
        const parentVarDecl = path.findParent(p => p.isVariableDeclarator());
        if (parentVarDecl && t.isArrayPattern(parentVarDecl.node.id)) {
          const stateVar = parentVarDecl.node.id.elements[0];
          if (stateVar && t.isIdentifier(stateVar)) {
            stateName = stateVar.name;
          }
        }
        
        if (stateName) {
          const stateInfo = analysis.state.find(s => s.name === stateName);
          if (stateInfo) {
            let typeAnnotation;
            
            // Bestimme Typ basierend auf stateInfo
            switch (stateInfo.type) {
              case 'string': typeAnnotation = t.tsStringKeyword(); break;
              case 'number': typeAnnotation = t.tsNumberKeyword(); break;
              case 'boolean': typeAnnotation = t.tsBooleanKeyword(); break;
              case 'object': typeAnnotation = t.tsObjectKeyword(); break;
              case 'array': typeAnnotation = t.tsArrayType(t.tsAnyKeyword()); break;
              default: typeAnnotation = t.tsAnyKeyword(); break;
            }
            
            // Typ-Parameter für useState hinzufügen
            path.node.typeParameters = t.tsTypeParameterInstantiation([
              t.tsTypeAnnotation(typeAnnotation).typeAnnotation
            ]);
          }
        }
      }
    }
  });
}

/**
 * Füge TypeScript-Annotationen für useEffect-Hooks hinzu (nötig für Dependency-Arrays)
 */
function addEffectTypeAnnotations(ast, analysis) {
  // Aktuell keine Änderungen notwendig, könnte aber genutzt werden,
  // um void-Rückgabetypen für Cleanup-Funktionen hinzuzufügen
}

/**
 * Füge Typen für Funktionsparameter hinzu
 */
function addFunctionParameterTypes(ast, analysis) {
  // Prüfe, ob wir ein Props-Interface haben
  const hasPropsInterface = Object.keys(analysis.props).length > 0;
  const interfaceName = `${analysis.componentName}Props`;
  
  traverse(ast, {
    // Funktionale Komponenten
    FunctionDeclaration(path) {
      // Nur für die Komponente (nicht für Hilfsfunktionen)
      if (path.node.id && path.node.id.name === analysis.componentName) {
        if (hasPropsInterface && path.node.params.length > 0) {
          // Füge Typisierung für Props hinzu
          const param = path.node.params[0];
          
          if (t.isObjectPattern(param)) {
            // Destructuring von Props
            path.node.params[0] = t.objectPattern(param.properties);
            
            // Typ für destrukturiertes Objekt hinzufügen
            path.node.params[0].typeAnnotation = t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(interfaceName))
            );
          } else if (t.isIdentifier(param)) {
            // Props als ganzes Objekt
            path.node.params[0].typeAnnotation = t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(interfaceName))
            );
          }
        }
        
        // Rückgabetyp für die Komponente hinzufügen
        path.node.returnType = t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier('React.ReactElement')
          )
        );
      }
    },
    
    // Arrow Functions
    ArrowFunctionExpression(path) {
      // Prüfe, ob dies die Hauptkomponente ist (über Variablendeklaration)
      const varDecl = path.findParent(p => p.isVariableDeclarator());
      if (varDecl && varDecl.node.id && 
          t.isIdentifier(varDecl.node.id, { name: analysis.componentName })) {
        
        if (hasPropsInterface && path.node.params.length > 0) {
          // Füge Typisierung für Props hinzu
          const param = path.node.params[0];
          
          if (t.isObjectPattern(param)) {
            // Destructuring von Props
            path.node.params[0] = t.objectPattern(param.properties);
            
            // Typ für destrukturiertes Objekt hinzufügen
            path.node.params[0].typeAnnotation = t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(interfaceName))
            );
          } else if (t.isIdentifier(param)) {
            // Props als ganzes Objekt
            path.node.params[0].typeAnnotation = t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(interfaceName))
            );
          }
        }
        
        // Rückgabetyp für die Komponente hinzufügen
        path.node.returnType = t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier('React.ReactElement')
          )
        );
      }
    }
  });
}

/**
 * Konvertiere ein Verzeichnis
 */
function convertDirectory(dirPath, options = {}) {
  const jsFiles = walkDirectorySync(dirPath, file => 
    (file.endsWith('.js') || file.endsWith('.jsx')) && 
    !file.includes('node_modules') && 
    !file.includes('.git')
  );
  
  const results = {
    total: jsFiles.length,
    converted: 0,
    skipped: 0,
    failed: 0,
    files: []
  };
  
  jsFiles.forEach(file => {
    try {
      const result = convertToTypeScript(file, options);
      
      if (result) {
        results.converted++;
        results.files.push({
          original: file,
          target: result.targetPath,
          status: 'converted'
        });
        
        // Speichere die konvertierte Datei, wenn es kein Dry-Run ist
        if (!options.dryRun) {
          fs.writeFileSync(result.targetPath, result.converted);
        }
      } else {
        results.skipped++;
        results.files.push({
          original: file,
          status: 'skipped'
        });
      }
    } catch (error) {
      results.failed++;
      results.files.push({
        original: file,
        status: 'failed',
        error: error.message
      });
      console.error(chalk.red(`Fehler bei der Konvertierung von ${file}:`), error);
    }
  });
  
  return results;
}

/**
 * Gehe durch ein Verzeichnis rekursiv
 */
function walkDirectorySync(dir, filter = () => true) {
  const files = [];
  
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      files.push(...walkDirectorySync(filePath, filter));
    } else if (filter(filePath)) {
      files.push(filePath);
    }
  });
  
  return files;
}

/**
 * Hauptfunktion
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Verwendung: node scripts/convertToTypeScript.js [Dateipfad] [Optionen]');
    console.log('Optionen:');
    console.log('  --dir               - Konvertiert alle Komponenten in einem Verzeichnis');
    console.log('  --dry-run           - Zeigt Änderungen an, ohne sie zu speichern');
    console.log('  --force             - Überschreibt existierende TypeScript-Dateien');
    console.log('  --stdout            - Gibt den konvertierten Code auf der Konsole aus');
    console.log('  --preserve-comments - Behält alle Kommentare bei');
    return;
  }
  
  const options = { ...DEFAULT_OPTIONS };
  let target = null;
  
  // Argumente parsen
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const option = arg.slice(2);
      if (option === 'dir') {
        options.directory = true;
      } else if (option === 'dry-run') {
        options.dryRun = true;
      } else if (option === 'force') {
        options.force = true;
      } else if (option === 'stdout') {
        options.stdout = true;
      } else if (option === 'preserve-comments') {
        options.preserveComments = true;
      }
    } else if (!target) {
      target = arg;
    }
  });
  
  if (!target) {
    console.error(chalk.red('Fehler: Kein Ziel angegeben.'));
    process.exit(1);
  }
  
  try {
    if (options.directory) {
      // Konvertiere ein Verzeichnis
      const results = convertDirectory(target, options);
      
      console.log(chalk.bold(`\n${results.converted} von ${results.total} Dateien konvertiert`));
      if (results.skipped > 0) {
        console.log(chalk.yellow(`${results.skipped} Dateien übersprungen`));
      }
      if (results.failed > 0) {
        console.log(chalk.red(`${results.failed} Dateien fehlgeschlagen`));
      }
      
      if (options.dryRun) {
        console.log(chalk.cyan('\nDry-Run: Keine Dateien wurden geändert.'));
      } else {
        console.log(chalk.green('\nKonvertierung abgeschlossen.'));
      }
    } else {
      // Konvertiere eine einzelne Datei
      const result = convertToTypeScript(target, options);
      
      if (result) {
        if (options.stdout) {
          console.log(result.converted);
        } else if (options.dryRun) {
          console.log(chalk.cyan(`Konvertiert zu: ${result.targetPath} (Dry-Run)`));
          console.log(chalk.cyan('Keine Dateien wurden geändert.'));
        } else {
          fs.writeFileSync(result.targetPath, result.converted);
          console.log(chalk.green(`Erfolgreich konvertiert zu: ${result.targetPath}`));
        }
      }
    }
  } catch (error) {
    console.error(chalk.red('Fehler bei der Konvertierung:'), error);
    process.exit(1);
  }
}

// Wenn direkt ausgeführt
if (require.main === module) {
  main();
} else {
  // Als Modul exportieren
  module.exports = {
    convertToTypeScript,
    convertDirectory,
  };
}