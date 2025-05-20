#!/usr/bin/env node

/**
 * Komponenten-Analyse-Tool
 * 
 * Dieses Skript analysiert React-Komponenten und identifiziert:
 * - Importabhängigkeiten
 * - Verwendete React Hooks
 * - Props-Struktur
 * - Verwendete Styles
 * - Interne Komponenten
 */

const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;

/**
 * Analysiert eine React-Komponente
 * @param {string} filePath - Pfad zur Komponentendatei
 * @returns {Object} Analyseergebnis
 */
function analyzeComponent(filePath) {
  // Stellen Sie sicher, dass die Datei existiert
  if (!fs.existsSync(filePath)) {
    console.error(`Datei nicht gefunden: ${filePath}`);
    process.exit(1);
  }

  // Dateiinhalt lesen
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const fileExtension = path.extname(filePath);
  const isTypeScript = fileExtension === '.tsx' || fileExtension === '.ts';

  // AST generieren
  const ast = babel.parse(fileContent, {
    sourceType: 'module',
    plugins: [
      'jsx',
      isTypeScript && 'typescript',
      'classProperties',
      'objectRestSpread',
    ].filter(Boolean),
  });

  // Analyseergebnis initialisieren
  const result = {
    imports: [],
    hooks: [],
    props: [],
    styles: [],
    internalComponents: [],
    exportType: 'unknown',
    isClientComponent: false,
  };

  // Überprüfen, ob es sich um eine Client-Komponente handelt
  if (fileContent.includes("'use client'") || fileContent.includes('"use client"')) {
    result.isClientComponent = true;
  }

  // AST traversieren
  traverse(ast, {
    // Importe identifizieren
    ImportDeclaration(nodePath) {
      const importSource = nodePath.node.source.value;
      const specifiers = nodePath.node.specifiers.map(specifier => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          return {
            type: 'default',
            name: specifier.local.name,
          };
        } else if (specifier.type === 'ImportSpecifier') {
          return {
            type: 'named',
            name: specifier.local.name,
            imported: specifier.imported ? specifier.imported.name : specifier.local.name,
          };
        } else {
          return {
            type: 'namespace',
            name: specifier.local.name,
          };
        }
      });

      result.imports.push({
        source: importSource,
        specifiers,
      });

      // React Hooks erkennen
      if (importSource === 'react') {
        const hooksSpecifiers = specifiers.filter(s => 
          s.type === 'named' && s.imported && s.imported.startsWith('use')
        );
        
        if (hooksSpecifiers.length > 0) {
          result.hooks.push(...hooksSpecifiers.map(s => s.imported));
        }
      }
    },

    // Props-Struktur analysieren aus function declarations
    FunctionDeclaration(nodePath) {
      if (nodePath.node.params.length > 0) {
        const firstParam = nodePath.node.params[0];
        if (firstParam.type === 'ObjectPattern') {
          const props = firstParam.properties.map(prop => {
            if (prop.type === 'ObjectProperty') {
              return prop.key.name;
            } else if (prop.type === 'RestElement') {
              return `...${prop.argument.name}`;
            }
            return null;
          }).filter(Boolean);
          
          result.props.push(...props);
        }
      }
    },

    // Props-Struktur aus Arrow-Functions analysieren
    ArrowFunctionExpression(nodePath) {
      if (nodePath.parent.type === 'VariableDeclarator' && nodePath.node.params.length > 0) {
        const firstParam = nodePath.node.params[0];
        if (firstParam.type === 'ObjectPattern') {
          const props = firstParam.properties.map(prop => {
            if (prop.type === 'ObjectProperty') {
              return prop.key.name;
            } else if (prop.type === 'RestElement') {
              return `...${prop.argument.name}`;
            }
            return null;
          }).filter(Boolean);
          
          result.props.push(...props);
        }
      }
    },

    // Export-Typ ermitteln
    ExportDefaultDeclaration(nodePath) {
      result.exportType = 'default';
      if (nodePath.node.declaration.type === 'Identifier') {
        result.exportName = nodePath.node.declaration.name;
      } else if (nodePath.node.declaration.type === 'FunctionDeclaration' && nodePath.node.declaration.id) {
        result.exportName = nodePath.node.declaration.id.name;
      }
    },

    ExportNamedDeclaration(nodePath) {
      if (!result.namedExports) {
        result.namedExports = [];
      }

      if (nodePath.node.declaration) {
        if (nodePath.node.declaration.type === 'VariableDeclaration') {
          nodePath.node.declaration.declarations.forEach(declaration => {
            result.namedExports.push(declaration.id.name);
          });
        } else if (nodePath.node.declaration.type === 'FunctionDeclaration') {
          result.namedExports.push(nodePath.node.declaration.id.name);
        } else if (nodePath.node.declaration.type === 'ClassDeclaration') {
          result.namedExports.push(nodePath.node.declaration.id.name);
        } else if (nodePath.node.declaration.type === 'TSInterfaceDeclaration' && isTypeScript) {
          result.namedExports.push(nodePath.node.declaration.id.name);
        } else if (nodePath.node.declaration.type === 'TSTypeAliasDeclaration' && isTypeScript) {
          result.namedExports.push(nodePath.node.declaration.id.name);
        }
      }
    },

    // JSX-Elemente identifizieren
    JSXOpeningElement(nodePath) {
      const elementName = nodePath.node.name.name;

      // Nur Komponenten (Großbuchstaben am Anfang) berücksichtigen
      if (elementName && elementName[0] === elementName[0].toUpperCase() && !result.internalComponents.includes(elementName)) {
        result.internalComponents.push(elementName);
      }
    },

    // CSS-Module und Styles erkennen
    CallExpression(nodePath) {
      if (nodePath.node.callee && nodePath.node.callee.name === 'require') {
        const args = nodePath.node.arguments;
        if (args.length === 1 && args[0].type === 'StringLiteral') {
          const importPath = args[0].value;
          if (importPath.endsWith('.css') || importPath.endsWith('.scss') || importPath.endsWith('.module.css')) {
            result.styles.push(importPath);
          }
        }
      }
    },

    // TypeScript Interface- und Typ-Definitionen erkennen
    TSInterfaceDeclaration(nodePath) {
      if (!result.interfaces) {
        result.interfaces = [];
      }
      result.interfaces.push(nodePath.node.id.name);
    },

    TSTypeAliasDeclaration(nodePath) {
      if (!result.types) {
        result.types = [];
      }
      result.types.push(nodePath.node.id.name);
    }
  });

  return result;
}

/**
 * Analysiert eine Komponente und gibt das Ergebnis als formatiertes JSON aus
 */
function analyzeAndPrint(filePath) {
  const result = analyzeComponent(filePath);
  
  // Komponenten-Details ausgeben
  console.log('\n=== Komponenten-Analyse ===');
  console.log(`\nDatei: ${filePath}`);
  console.log(`Client Component: ${result.isClientComponent ? 'Ja' : 'Nein'}`);
  console.log(`Export-Typ: ${result.exportType}`);
  
  if (result.exportName) {
    console.log(`Export-Name: ${result.exportName}`);
  }
  
  if (result.namedExports && result.namedExports.length > 0) {
    console.log('\nExportierte Namen:');
    result.namedExports.forEach(name => console.log(`  - ${name}`));
  }
  
  console.log('\nImporte:');
  result.imports.forEach(imp => {
    console.log(`  - ${imp.source}`);
    imp.specifiers.forEach(spec => {
      if (spec.type === 'default') {
        console.log(`    * default as ${spec.name}`);
      } else if (spec.type === 'named') {
        console.log(`    * ${spec.imported} as ${spec.name}`);
      } else {
        console.log(`    * * as ${spec.name}`);
      }
    });
  });
  
  if (result.hooks.length > 0) {
    console.log('\nVerwendete React Hooks:');
    result.hooks.forEach(hook => console.log(`  - ${hook}`));
  }
  
  if (result.props.length > 0) {
    console.log('\nProps:');
    result.props.forEach(prop => console.log(`  - ${prop}`));
  }
  
  if (result.internalComponents.length > 0) {
    console.log('\nVerwendete Komponenten:');
    result.internalComponents.forEach(comp => console.log(`  - ${comp}`));
  }
  
  if (result.styles.length > 0) {
    console.log('\nCSS-Module und Styles:');
    result.styles.forEach(style => console.log(`  - ${style}`));
  }
  
  if (result.interfaces && result.interfaces.length > 0) {
    console.log('\nTypeScript Interfaces:');
    result.interfaces.forEach(intf => console.log(`  - ${intf}`));
  }
  
  if (result.types && result.types.length > 0) {
    console.log('\nTypeScript Types:');
    result.types.forEach(type => console.log(`  - ${type}`));
  }
  
  console.log('\n=== Ende der Analyse ===\n');
}

// Direkter Aufruf von der Kommandozeile
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Bitte geben Sie einen Dateipfad an.');
    console.log('Verwendung: node analyze-component.js <dateipfad>');
    process.exit(1);
  }
  
  analyzeAndPrint(filePath);
}

module.exports = { analyzeComponent, analyzeAndPrint };
