/**
 * Komponenten-Analyse-Tool (analyzeComponent.js)
 * 
 * Dieses Tool analysiert React-Komponenten und liefert detaillierte Informationen über ihre Struktur,
 * darunter Props, Hooks, Importpfade und externe Abhängigkeiten.
 * 
 * Nutzung: node analyzeComponent.js <Pfad-zur-Komponente>
 */

const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

/**
 * Analysiert eine React-Komponente und extrahiert wichtige Informationen
 * @param {string} filePath - Pfad zur Komponentendatei
 * @returns {Object} Analyseergebnisse
 */
function analyzeComponent(filePath) {
  // Prüfen, ob die Datei existiert
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`Fehler: Datei nicht gefunden: ${filePath}`));
    process.exit(1);
  }

  // Dateiinhalt lesen
  const content = fs.readFileSync(filePath, 'utf8');
  const fileExtension = path.extname(filePath);
  const isTypeScript = fileExtension === '.tsx' || fileExtension === '.ts';

  // AST (Abstract Syntax Tree) erstellen
  const ast = babelParser.parse(content, {
    sourceType: 'module',
    plugins: [
      'jsx',
      isTypeScript && 'typescript',
      'classProperties',
      'objectRestSpread',
    ].filter(Boolean),
  });

  // Initialisiere das Analyseergebnis
  const analysis = {
    componentName: path.basename(filePath, fileExtension),
    isTypeScript,
    imports: [],
    exports: [],
    props: {
      definitions: [],
      usages: []
    },
    hooks: [],
    stateVariables: [],
    externalDependencies: [],
    eventHandlers: [],
    conditionalRendering: [],
    renderMethods: [],
    complexityScore: 0
  };

  // AST traversieren
  traverse(ast, {
    // Importanweisungen analysieren
    ImportDeclaration(path) {
      const importSource = path.node.source.value;
      const importSpecifiers = path.node.specifiers.map(specifier => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          return { type: 'default', name: specifier.local.name };
        } else if (specifier.type === 'ImportSpecifier') {
          return { 
            type: 'named', 
            name: specifier.local.name,
            importedName: specifier.imported ? specifier.imported.name : specifier.local.name
          };
        } else if (specifier.type === 'ImportNamespaceSpecifier') {
          return { type: 'namespace', name: specifier.local.name };
        }
        return { type: 'unknown', name: 'unknown' };
      });

      // Externe Abhängigkeiten (von node_modules) identifizieren
      if (!importSource.startsWith('.') && !importSource.startsWith('/') && !importSource.startsWith('@/')) {
        analysis.externalDependencies.push(importSource);
      }

      analysis.imports.push({
        source: importSource,
        specifiers: importSpecifiers
      });
    },

    // Exportanweisungen analysieren
    ExportDefaultDeclaration(path) {
      let name = 'Anonymous';
      if (path.node.declaration.type === 'Identifier') {
        name = path.node.declaration.name;
      } else if (path.node.declaration.type === 'FunctionDeclaration' && path.node.declaration.id) {
        name = path.node.declaration.id.name;
      }
      analysis.exports.push({ type: 'default', name });
    },

    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        if (path.node.declaration.type === 'FunctionDeclaration') {
          analysis.exports.push({ type: 'named', name: path.node.declaration.id.name });
        } else if (path.node.declaration.type === 'VariableDeclaration') {
          path.node.declaration.declarations.forEach(declaration => {
            analysis.exports.push({ type: 'named', name: declaration.id.name });
          });
        }
      } else if (path.node.specifiers) {
        path.node.specifiers.forEach(specifier => {
          analysis.exports.push({ 
            type: 'named', 
            name: specifier.exported.name,
            exportedName: specifier.local.name
          });
        });
      }
    },

    // Props-Definitionen analysieren (in TypeScript-Dateien)
    TSInterfaceDeclaration(path) {
      if (path.node.id.name.includes('Props')) {
        const propsInterface = {
          name: path.node.id.name,
          properties: []
        };

        path.node.body.body.forEach(property => {
          if (property.type === 'TSPropertySignature') {
            let propName = property.key.name || property.key.value;
            let typeAnnotation = 'unknown';
            let isOptional = property.optional || false;

            if (property.typeAnnotation) {
              typeAnnotation = content.slice(
                property.typeAnnotation.start,
                property.typeAnnotation.end
              ).replace(/^:\s*/, '');
            }

            propsInterface.properties.push({
              name: propName,
              type: typeAnnotation,
              isOptional
            });
          }
        });

        analysis.props.definitions.push(propsInterface);
      }
    },

    // PropTypes Definitionen analysieren (in JavaScript-Dateien)
    AssignmentExpression(path) {
      if (
        path.node.left.type === 'MemberExpression' &&
        path.node.left.property.name === 'propTypes' &&
        path.node.right.type === 'ObjectExpression'
      ) {
        const componentName = path.node.left.object.name;
        const propsDef = {
          name: `${componentName}PropTypes`,
          properties: []
        };

        path.node.right.properties.forEach(prop => {
          if (prop.type === 'ObjectProperty') {
            const propName = prop.key.name || prop.key.value;
            let propType = '';

            if (prop.value.type === 'MemberExpression') {
              propType = `PropTypes.${prop.value.property.name}`;
            } else if (prop.value.type === 'CallExpression') {
              propType = `PropTypes.${prop.value.callee.property.name}()`;
            }

            propsDef.properties.push({
              name: propName,
              type: propType,
              isOptional: !propType.includes('.isRequired')
            });
          }
        });

        analysis.props.definitions.push(propsDef);
      }
    },

    // React Hooks erkennen
    CallExpression(path) {
      if (
        path.node.callee.type === 'Identifier' &&
        path.node.callee.name.startsWith('use')
      ) {
        // Hooks-Aufruf gefunden
        const hookName = path.node.callee.name;
        const args = path.node.arguments.map(arg => {
          if (arg.type === 'Identifier') {
            return arg.name;
          } else if (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression') {
            return 'function';
          } else {
            return arg.type;
          }
        });

        if (hookName === 'useState') {
          // Bei useState den Zustandsnamen extrahieren
          const parent = path.parent;
          if (parent.type === 'VariableDeclarator' && parent.id.type === 'ArrayPattern') {
            const stateName = parent.id.elements[0]?.name;
            if (stateName) {
              analysis.stateVariables.push({
                name: stateName,
                setter: parent.id.elements[1]?.name,
                initialValue: path.node.arguments[0] ? path.node.arguments[0].type : 'unknown'
              });
            }
          }
        }

        analysis.hooks.push({
          name: hookName,
          arguments: args
        });
      }
    },

    // Event-Handler erkennen
    FunctionDeclaration(path) {
      const name = path.node.id?.name || 'anonymous';
      if (name.startsWith('handle') || name.includes('Handler') || name.includes('handle')) {
        analysis.eventHandlers.push({
          name,
          parameters: path.node.params.map(param => {
            if (param.type === 'Identifier') {
              return param.name;
            }
            return 'complex parameter';
          })
        });
      }
    },

    ArrowFunctionExpression(path) {
      const parent = path.parent;
      if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
        const name = parent.id.name;
        if (name.startsWith('handle') || name.includes('Handler') || name.includes('handle')) {
          analysis.eventHandlers.push({
            name,
            parameters: path.node.params.map(param => {
              if (param.type === 'Identifier') {
                return param.name;
              }
              return 'complex parameter';
            })
          });
        }
      }
    },

    // Props-Verwendung analysieren
    MemberExpression(path) {
      if (path.node.object.type === 'Identifier' && path.node.object.name === 'props') {
        const propName = path.node.property.name;
        if (propName) {
          // Prüfen, ob dieser Prop bereits erfasst wurde
          if (!analysis.props.usages.some(p => p.name === propName)) {
            analysis.props.usages.push({
              name: propName,
              locations: [path.node.loc.start.line]
            });
          } else {
            // Wenn schon erfasst, Position hinzufügen
            const prop = analysis.props.usages.find(p => p.name === propName);
            if (!prop.locations.includes(path.node.loc.start.line)) {
              prop.locations.push(path.node.loc.start.line);
            }
          }
        }
      }
    },

    // Conditional Rendering erkennen
    ConditionalExpression(path) {
      analysis.conditionalRendering.push({
        type: 'ternary',
        location: path.node.loc.start.line
      });
    },

    LogicalExpression(path) {
      if (path.node.operator === '&&') {
        analysis.conditionalRendering.push({
          type: 'logical-and',
          location: path.node.loc.start.line
        });
      }
    },

    // JSX-Components erkennen und analysieren
    JSXElement(path) {
      const elementName = path.node.openingElement.name;
      let name;
      
      if (elementName.type === 'JSXIdentifier') {
        name = elementName.name;
      } else if (elementName.type === 'JSXMemberExpression') {
        name = `${elementName.object.name}.${elementName.property.name}`;
      }

      // Komponenten mit Großbuchstaben beginnen
      if (name && name[0] === name[0].toUpperCase()) {
        // Props-Verwendung in JSX erfassen
        path.node.openingElement.attributes.forEach(attr => {
          if (attr.type === 'JSXAttribute') {
            const attrName = attr.name.name;
            // Direkte Props-Verwendung in JSX
            if (!analysis.props.usages.some(p => p.name === attrName)) {
              analysis.props.usages.push({
                name: attrName,
                locations: [attr.loc.start.line],
                inJSX: true
              });
            } else {
              const prop = analysis.props.usages.find(p => p.name === attrName);
              if (!prop.locations.includes(attr.loc.start.line)) {
                prop.locations.push(attr.loc.start.line);
              }
              prop.inJSX = true;
            }
          }
        });
      }
    },

    // Destructuring von Props erkennen
    VariableDeclarator(path) {
      if (
        path.node.init &&
        path.node.init.type === 'Identifier' &&
        path.node.init.name === 'props' &&
        path.node.id.type === 'ObjectPattern'
      ) {
        path.node.id.properties.forEach(prop => {
          if (prop.type === 'ObjectProperty' || prop.type === 'RestElement') {
            const propName = prop.key?.name || (prop.argument?.name === 'props' ? 'rest' : null);
            if (propName) {
              if (!analysis.props.usages.some(p => p.name === propName)) {
                analysis.props.usages.push({
                  name: propName,
                  locations: [path.node.loc.start.line],
                  isDestructured: true
                });
              } else {
                const existingProp = analysis.props.usages.find(p => p.name === propName);
                if (!existingProp.locations.includes(path.node.loc.start.line)) {
                  existingProp.locations.push(path.node.loc.start.line);
                }
                existingProp.isDestructured = true;
              }
            }
          }
        });
      }
    }
  });

  // Komplexitätsbewertung
  analysis.complexityScore = calculateComplexity(analysis);

  return analysis;
}

/**
 * Berechnet einen einfachen Komplexitätswert für die Komponente
 * @param {Object} analysis - Analyseergebnis
 * @returns {number} Komplexitätswert
 */
function calculateComplexity(analysis) {
  let score = 0;
  
  // Faktoren für die Komplexitätsbewertung
  score += analysis.imports.length * 0.5;
  score += analysis.props.usages.length * 1;
  score += analysis.hooks.length * 2;
  score += analysis.stateVariables.length * 2;
  score += analysis.eventHandlers.length * 1.5;
  score += analysis.conditionalRendering.length * 2;
  
  return Math.round(score);
}

/**
 * Führt die Komponenten-Analyse durch und gibt das Ergebnis aus
 * @param {string} filePath - Pfad zur zu analysierenden Datei
 */
function runAnalysis(filePath) {
  console.log(chalk.blue(`\n✨ Analysiere Komponente: ${chalk.bold(path.basename(filePath))}`));
  console.log(chalk.gray(`Pfad: ${filePath}`));
  
  const startTime = Date.now();
  const analysis = analyzeComponent(filePath);
  const duration = Date.now() - startTime;

  // Ausgabe formatieren
  printAnalysisResults(analysis, duration);
  
  // Ergebnisse in JSON-Datei speichern
  const outputPath = path.join(
    path.dirname(filePath),
    `${analysis.componentName}.analysis.json`
  );
  
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log(chalk.green(`\n✓ Analyse gespeichert in: ${outputPath}`));

  return analysis;
}

/**
 * Formatierte Ausgabe der Analyseergebnisse
 * @param {Object} analysis - Analyseergebnis
 * @param {number} duration - Dauer der Analyse in ms
 */
function printAnalysisResults(analysis, duration) {
  console.log(chalk.yellow('\n📊 ANALYSE-ERGEBNISSE:'));
  console.log(chalk.gray('════════════════════════════════════════════'));
  
  // Allgemeine Informationen
  console.log(chalk.cyan('▸ Allgemein:'));
  console.log(`  Komponente: ${chalk.bold(analysis.componentName)}`);
  console.log(`  Typ: ${analysis.isTypeScript ? 'TypeScript' : 'JavaScript'}`);
  console.log(`  Komplexität: ${chalk.bold(analysis.complexityScore)} ${getComplexityRating(analysis.complexityScore)}`);
  
  // Imports
  console.log(chalk.cyan('\n▸ Imports:'));
  if (analysis.imports.length > 0) {
    analysis.imports.forEach(imp => {
      const specifierStr = imp.specifiers.map(s => {
        if (s.type === 'default') return chalk.bold(s.name);
        if (s.type === 'named') return s.name;
        if (s.type === 'namespace') return `* as ${s.name}`;
        return s.name;
      }).join(', ');

      console.log(`  ${chalk.bold(specifierStr)} ${chalk.dim('from')} '${imp.source}'`);
    });
  } else {
    console.log(chalk.gray('  Keine Imports gefunden'));
  }

  // Externe Abhängigkeiten
  console.log(chalk.cyan('\n▸ Externe Abhängigkeiten:'));
  if (analysis.externalDependencies.length > 0) {
    const uniqueDeps = [...new Set(analysis.externalDependencies)];
    uniqueDeps.forEach(dep => {
      console.log(`  - ${dep}`);
    });
  } else {
    console.log(chalk.gray('  Keine externen Abhängigkeiten gefunden'));
  }

  // Props
  console.log(chalk.cyan('\n▸ Props:'));
  
  // Props Definitionen
  if (analysis.props.definitions.length > 0) {
    console.log(chalk.bold('  Definitionen:'));
    analysis.props.definitions.forEach(def => {
      console.log(`  - ${chalk.bold(def.name)}`);
      def.properties.forEach(prop => {
        console.log(`    • ${prop.name}${prop.isOptional ? '?' : ''}: ${chalk.italic(prop.type)}`);
      });
    });
  } else {
    console.log('  ' + chalk.gray('Keine Props-Definitionen gefunden'));
  }

  // Props Verwendung
  if (analysis.props.usages.length > 0) {
    console.log(chalk.bold('\n  Verwendung:'));
    analysis.props.usages.forEach(prop => {
      const locations = prop.locations.length > 3 
        ? `${prop.locations.slice(0, 3).join(', ')}... (${prop.locations.length} Stellen)` 
        : prop.locations.join(', ');
      
      let details = [];
      if (prop.isDestructured) details.push('destructured');
      if (prop.inJSX) details.push('in JSX');
      
      const detailsStr = details.length > 0 ? chalk.gray(` (${details.join(', ')})`) : '';
      
      console.log(`  - ${chalk.bold(prop.name)}${detailsStr}: Zeilen ${locations}`);
    });
  } else {
    console.log('  ' + chalk.gray('Keine Props-Verwendung gefunden'));
  }

  // Hooks
  console.log(chalk.cyan('\n▸ React Hooks:'));
  if (analysis.hooks.length > 0) {
    const hookCounts = analysis.hooks.reduce((acc, hook) => {
      acc[hook.name] = (acc[hook.name] || 0) + 1;
      return acc;
    }, {});

    Object.entries(hookCounts).forEach(([hookName, count]) => {
      console.log(`  - ${chalk.bold(hookName)}: ${count}x`);
    });

    // State-Variablen
    if (analysis.stateVariables.length > 0) {
      console.log(chalk.bold('\n  State-Variablen:'));
      analysis.stateVariables.forEach(state => {
        console.log(`  - ${chalk.bold(state.name)} (setter: ${chalk.italic(state.setter || 'unbekannt')})`);
      });
    }
  } else {
    console.log(chalk.gray('  Keine Hooks gefunden'));
  }

  // Event-Handler
  console.log(chalk.cyan('\n▸ Event-Handler:'));
  if (analysis.eventHandlers.length > 0) {
    analysis.eventHandlers.forEach(handler => {
      const params = handler.parameters.join(', ');
      console.log(`  - ${chalk.bold(handler.name)}(${params})`);
    });
  } else {
    console.log(chalk.gray('  Keine Event-Handler gefunden'));
  }

  // Conditional Rendering
  console.log(chalk.cyan('\n▸ Conditional Rendering:'));
  if (analysis.conditionalRendering.length > 0) {
    const types = analysis.conditionalRendering.reduce((acc, cr) => {
      acc[cr.type] = (acc[cr.type] || 0) + 1;
      return acc;
    }, {});

    Object.entries(types).forEach(([type, count]) => {
      const typeReadable = type === 'ternary' ? 'Ternär-Operator (? :)' : 
                          type === 'logical-and' ? 'Logisches UND (&&)' : type;
      console.log(`  - ${typeReadable}: ${count}x`);
    });
  } else {
    console.log(chalk.gray('  Keine bedingten Renderingstrukturen gefunden'));
  }

  // Exports
  console.log(chalk.cyan('\n▸ Exports:'));
  if (analysis.exports.length > 0) {
    analysis.exports.forEach(exp => {
      if (exp.type === 'default') {
        console.log(`  - ${chalk.bold('default')}: ${exp.name}`);
      } else {
        console.log(`  - ${exp.name}${exp.exportedName && exp.exportedName !== exp.name ? ` (als ${exp.exportedName})` : ''}`);
      }
    });
  } else {
    console.log(chalk.gray('  Keine Exports gefunden'));
  }

  console.log(chalk.gray('\n════════════════════════════════════════════'));
  console.log(chalk.green(`✓ Analyse abgeschlossen in ${duration}ms`));
}

/**
 * Gibt eine textuelle Bewertung der Komplexität zurück
 * @param {number} score - Komplexitätswert
 * @returns {string} Bewertung
 */
function getComplexityRating(score) {
  if (score < 10) return chalk.green('(Einfach)');
  if (score < 20) return chalk.yellow('(Mittel)');
  if (score < 30) return chalk.yellow('(Komplex)');
  return chalk.red('(Sehr komplex)');
}

// Hauptfunktion, wenn das Skript direkt ausgeführt wird
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error(chalk.red('Fehler: Bitte geben Sie den Pfad zur Komponente an.'));
    console.log(`Verwendung: ${chalk.cyan('node analyzeComponent.js <Pfad-zur-Komponente>')}`);
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  runAnalysis(filePath);
}

module.exports = {
  analyzeComponent,
  runAnalysis
};