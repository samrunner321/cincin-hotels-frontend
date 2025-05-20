/**
 * Komponenten-Analyse-Tool
 * 
 * Dieses Tool analysiert React-Komponenten und liefert detaillierte Informationen über:
 * - Komponententyp (Funktional, Klasse, etc.)
 * - Props und deren Typen
 * - Verwendete Hooks
 * - State-Management
 * - Abhängigkeiten zu anderen Komponenten
 * - JSDoc-Kommentare und Typdefinitionen
 * - Komplexitätsbewertung für Migration zu TypeScript
 * 
 * Verwendung:
 * node scripts/analyzeComponent.js [Dateipfad] [Optionen]
 * 
 * Optionen:
 * --export=json|yaml  - Exportiert die Analyse als JSON oder YAML
 * --dir               - Analysiert alle Komponenten in einem Verzeichnis
 * --group             - Gruppiert Komponenten nach Migrations-Komplexität
 * --patterns          - Analysiert und listet verwendete Code-Patterns
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const chalk = require('chalk');
const yaml = require('js-yaml');

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

// Komplexitätsstufen
const COMPLEXITY_LEVELS = {
  LOW: 'Niedrig',
  MEDIUM: 'Mittel',
  HIGH: 'Hoch',
  VERY_HIGH: 'Sehr hoch',
};

// Komplexitätsindikatoren und ihre Gewichte
const COMPLEXITY_INDICATORS = {
  PROP_COUNT: { threshold: [3, 6, 10], weight: 1 },
  OPTIONAL_PROPS: { threshold: [2, 5, 8], weight: 0.7 },
  COMPLEX_PROPS: { threshold: [1, 3, 5], weight: 1.5 }, // Objekte, Arrays, Funktionen
  CHILDREN_USAGE: { threshold: [0, 1, 2], weight: 0.5 },
  STATE_COUNT: { threshold: [2, 4, 7], weight: 1 },
  EFFECT_COUNT: { threshold: [1, 3, 5], weight: 1.2 },
  CALLBACK_COUNT: { threshold: [2, 5, 8], weight: 1 },
  REF_COUNT: { threshold: [1, 3, 5], weight: 0.8 },
  COMPLEX_LOGIC: { threshold: [2, 5, 8], weight: 1.5 }, // Bedingte Renderings, Schleifen
  EXTERNAL_DEPS: { threshold: [3, 7, 12], weight: 1.3 }, // Externe Abhängigkeiten
  CLASS_COMPONENT: { value: 2, weight: 1.5 }, // Klassenkomponenten sind komplexer
  HOC_USAGE: { value: 2, weight: 1.8 }, // Higher Order Components
};

/**
 * Hauptanalysefunktion
 */
function analyzeComponent(filePath, options = {}) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const ast = parse(content, PARSER_OPTIONS);
    
    const analysis = {
      filePath,
      fileName: path.basename(filePath),
      componentName: getComponentName(ast, filePath),
      componentType: 'Unknown',
      props: [],
      state: [],
      hooks: [],
      complexityScore: 0,
      complexityLevel: COMPLEXITY_LEVELS.LOW,
      dependencies: [],
      jsdoc: [],
      patterns: [],
      exports: [],
    };
    
    // Durchführen der verschiedenen Analysen
    analyzeDependencies(ast, analysis);
    analyzeComponentType(ast, analysis);
    analyzeProps(ast, analysis);
    analyzeHooks(ast, analysis);
    analyzeState(ast, analysis);
    analyzeJSDoc(ast, analysis);
    analyzePatterns(ast, analysis);
    analyzeExports(ast, analysis);
    calculateComplexity(analysis);
    
    return analysis;
  } catch (error) {
    console.error(chalk.red(`Fehler bei der Analyse von ${filePath}:`), error);
    throw error;
  }
}

/**
 * Extrahiere den Komponentennamen aus dem AST oder Dateipfad
 */
function getComponentName(ast, filePath) {
  let componentName = null;
  
  // Suche nach Defaultexport einer Komponente
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      
      if (t.isIdentifier(declaration)) {
        componentName = declaration.name;
      } else if (t.isFunctionDeclaration(declaration) && declaration.id) {
        componentName = declaration.id.name;
      } else if (t.isClassDeclaration(declaration) && declaration.id) {
        componentName = declaration.id.name;
      }
    },
  });
  
  // Falls kein Name gefunden wurde, verwende den Dateinamen
  if (!componentName) {
    componentName = path.basename(filePath, path.extname(filePath));
  }
  
  return componentName;
}

/**
 * Analysiere den Typ der Komponente (Funktional, Klasse, etc.)
 */
function analyzeComponentType(ast, analysis) {
  let isClassComponent = false;
  let isFunctionalComponent = false;
  let isHOC = false;
  let isHook = false;
  let isContext = false;
  
  traverse(ast, {
    // Erkenne Klassenkomponenten
    ClassDeclaration(path) {
      const superClass = path.node.superClass;
      if (superClass && 
          (t.isIdentifier(superClass, { name: 'Component' }) || 
           t.isIdentifier(superClass, { name: 'PureComponent' }) ||
           (t.isMemberExpression(superClass) && 
            t.isIdentifier(superClass.object, { name: 'React' }) && 
            (t.isIdentifier(superClass.property, { name: 'Component' }) || 
             t.isIdentifier(superClass.property, { name: 'PureComponent' }))))) {
        isClassComponent = true;
      }
    },
    
    // Erkenne funktionale Komponenten (mit JSX-Return)
    FunctionDeclaration(path) {
      if (returnsJSX(path)) {
        isFunctionalComponent = true;
      }
    },
    
    ArrowFunctionExpression(path) {
      if (returnsJSX(path)) {
        isFunctionalComponent = true;
      }
    },
    
    // Erkenne createContext
    CallExpression(path) {
      if (t.isMemberExpression(path.node.callee) && 
          t.isIdentifier(path.node.callee.object, { name: 'React' }) && 
          t.isIdentifier(path.node.callee.property, { name: 'createContext' })) {
        isContext = true;
      } else if (t.isIdentifier(path.node.callee, { name: 'createContext' })) {
        isContext = true;
      }
      
      // Erkenne HOCs
      if (path.node.arguments.length > 0 && 
          path.node.arguments.some(arg => 
            (t.isIdentifier(arg) || 
             t.isArrowFunctionExpression(arg) || 
             t.isFunctionExpression(arg)) && 
            returnsComponent(path))) {
        isHOC = true;
      }
    },
    
    // Erkenne useX-namige Exportfunktionen als Hooks
    ExportNamedDeclaration(path) {
      const declaration = path.node.declaration;
      if (declaration && 
          (t.isFunctionDeclaration(declaration) || 
           t.isVariableDeclaration(declaration))) {
        if (t.isFunctionDeclaration(declaration) && 
            declaration.id && 
            declaration.id.name.startsWith('use')) {
          isHook = true;
        } else if (t.isVariableDeclaration(declaration)) {
          declaration.declarations.forEach(decl => {
            if (decl.id && 
                t.isIdentifier(decl.id) && 
                decl.id.name.startsWith('use') && 
                (t.isArrowFunctionExpression(decl.init) || 
                 t.isFunctionExpression(decl.init))) {
              isHook = true;
            }
          });
        }
      }
    }
  });
  
  // Setze den ermittelten Komponententyp
  if (isClassComponent) {
    analysis.componentType = 'Klassenkomponente';
    analysis.patterns.push('Klassenkomponente');
  } else if (isFunctionalComponent) {
    analysis.componentType = 'Funktionale Komponente';
    analysis.patterns.push('Funktionale Komponente');
  } else if (isHOC) {
    analysis.componentType = 'Higher Order Component (HOC)';
    analysis.patterns.push('Higher Order Component');
  } else if (isHook) {
    analysis.componentType = 'Custom Hook';
    analysis.patterns.push('Custom Hook');
  } else if (isContext) {
    analysis.componentType = 'Context';
    analysis.patterns.push('Context API');
  }
}

/**
 * Hilfsfunktion zur Erkennung von JSX in der Rückgabe
 */
function returnsJSX(path) {
  let returnsJSX = false;
  
  if (t.isBlockStatement(path.node.body)) {
    // Manuelles Traversieren, um traverse.cheap zu vermeiden (die besonders bei TS-Dateien Probleme macht)
    path.node.body.body.forEach(node => {
      if (t.isReturnStatement(node) && node.argument && isJSX(node.argument)) {
        returnsJSX = true;
      }
    });
  } else if (isJSX(path.node.body)) {
    returnsJSX = true;
  }
  
  return returnsJSX;
}

/**
 * Prüft, ob ein Node JSX enthält
 */
function isJSX(node) {
  return t.isJSXElement(node) || 
         t.isJSXFragment(node) || 
         (t.isCallExpression(node) && 
          t.isMemberExpression(node.callee) && 
          t.isIdentifier(node.callee.property, { name: 'createElement' }));
}

/**
 * Prüft, ob eine Funktion eine Komponente zurückgibt
 */
function returnsComponent(path) {
  // Einfache Heuristik für HOCs: Sie geben oft eine Komponente zurück
  return true;
}

/**
 * Analysiere Props
 */
function analyzeProps(ast, analysis) {
  const props = [];
  
  traverse(ast, {
    // Funktionale Komponenten mit Destructuring
    FunctionDeclaration(path) {
      if (returnsJSX(path) && path.node.params.length > 0) {
        const param = path.node.params[0];
        if (t.isObjectPattern(param)) {
          param.properties.forEach(prop => {
            if (t.isObjectProperty(prop) || t.isRestElement(prop)) {
              const name = t.isObjectProperty(prop) ? 
                           prop.key.name : 
                           `...${prop.argument.name}`;
              
              props.push({
                name,
                isRequired: !hasDefaultValue(prop),
                defaultValue: getDefaultValue(prop),
                type: inferType(prop),
                description: getDescriptionFromJSDoc(path.node),
              });
            }
          });
        } else if (t.isIdentifier(param)) {
          // Propsname als Ganzes (z.B. `props`)
          props.push({
            name: param.name,
            isObjectProps: true,
            type: 'object',
            description: null,
          });
        }
      }
    },
    
    // Arrow Functions mit Destructuring
    ArrowFunctionExpression(path) {
      if (returnsJSX(path) && path.node.params.length > 0) {
        const param = path.node.params[0];
        if (t.isObjectPattern(param)) {
          param.properties.forEach(prop => {
            if (t.isObjectProperty(prop) || t.isRestElement(prop)) {
              const name = t.isObjectProperty(prop) ? 
                           prop.key.name : 
                           `...${prop.argument.name}`;
              
              props.push({
                name,
                isRequired: !hasDefaultValue(prop),
                defaultValue: getDefaultValue(prop),
                type: inferType(prop),
                description: getDescriptionFromJSDoc(path.node),
              });
            }
          });
        } else if (t.isIdentifier(param)) {
          // Propsname als Ganzes (z.B. `props`)
          props.push({
            name: param.name,
            isObjectProps: true,
            type: 'object',
            description: null,
          });
        }
      }
    },
    
    // PropTypes
    AssignmentExpression(path) {
      if (t.isMemberExpression(path.node.left) && 
          path.node.left.property && 
          t.isIdentifier(path.node.left.property, { name: 'propTypes' })) {
        
        const componentName = path.node.left.object.name;
        if (componentName === analysis.componentName && 
            t.isObjectExpression(path.node.right)) {
          
          path.node.right.properties.forEach(prop => {
            if (t.isObjectProperty(prop) && prop.key) {
              const propName = prop.key.name;
              const existingProp = props.find(p => p.name === propName);
              
              // PropType Ausdruck (z.B. PropTypes.string.isRequired)
              const propTypeInfo = extractPropTypeInfo(prop.value);
              
              if (existingProp) {
                // Ergänze vorhandene Prop-Info
                existingProp.type = propTypeInfo.type;
                existingProp.isRequired = propTypeInfo.isRequired;
              } else {
                // Neue Prop hinzufügen
                props.push({
                  name: propName,
                  type: propTypeInfo.type,
                  isRequired: propTypeInfo.isRequired,
                  defaultValue: null,
                  description: null,
                });
              }
            }
          });
        }
      }
      
      // defaultProps
      if (t.isMemberExpression(path.node.left) && 
          path.node.left.property && 
          t.isIdentifier(path.node.left.property, { name: 'defaultProps' })) {
        
        const componentName = path.node.left.object.name;
        if (componentName === analysis.componentName && 
            t.isObjectExpression(path.node.right)) {
          
          path.node.right.properties.forEach(prop => {
            if (t.isObjectProperty(prop) && prop.key) {
              const propName = prop.key.name;
              const existingProp = props.find(p => p.name === propName);
              
              const defaultValue = extractLiteralValue(prop.value);
              
              if (existingProp) {
                // Ergänze vorhandene Prop-Info
                existingProp.defaultValue = defaultValue;
                existingProp.isRequired = false;
              } else {
                // Neue Prop hinzufügen
                props.push({
                  name: propName,
                  defaultValue,
                  isRequired: false,
                  type: inferTypeFromValue(prop.value),
                  description: null,
                });
              }
            }
          });
        }
      }
    },
    
    // TypeScript Props Interface
    TSInterfaceDeclaration(path) {
      if (path.node.id && 
          (path.node.id.name === `${analysis.componentName}Props` || 
           path.node.id.name.endsWith('Props'))) {
        
        path.node.body.body.forEach(prop => {
          if (t.isTSPropertySignature(prop) && prop.key) {
            const propName = prop.key.name || prop.key.value;
            const isRequired = !prop.optional;
            let typeAnnotation = 'unknown';
            
            if (prop.typeAnnotation && prop.typeAnnotation.typeAnnotation) {
              typeAnnotation = extractTSType(prop.typeAnnotation.typeAnnotation);
            }
            
            props.push({
              name: propName,
              isRequired,
              type: typeAnnotation,
              defaultValue: null,
              description: getDescriptionFromJSDoc(prop),
            });
          }
        });
      }
    },
    
    // TypeScript Typdefinition für funktionale Komponente
    TSTypeAliasDeclaration(path) {
      if (path.node.id && 
          (path.node.id.name === `${analysis.componentName}Props` || 
           path.node.id.name.endsWith('Props'))) {
        
        if (t.isTSTypeLiteral(path.node.typeAnnotation)) {
          path.node.typeAnnotation.members.forEach(member => {
            if (t.isTSPropertySignature(member) && member.key) {
              const propName = member.key.name || member.key.value;
              const isRequired = !member.optional;
              let typeAnnotation = 'unknown';
              
              if (member.typeAnnotation && member.typeAnnotation.typeAnnotation) {
                typeAnnotation = extractTSType(member.typeAnnotation.typeAnnotation);
              }
              
              props.push({
                name: propName,
                isRequired,
                type: typeAnnotation,
                defaultValue: null,
                description: getDescriptionFromJSDoc(member),
              });
            }
          });
        }
      }
    },
  });
  
  analysis.props = props;
}

/**
 * Extrahiere Informationen aus PropTypes
 */
function extractPropTypeInfo(node) {
  let type = 'any';
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
          type = node.property.name;
          
          // Konvertiere PropTypes-Typen in lesbarere Form
          switch (type) {
            case 'string': case 'number': case 'bool': case 'object':
            case 'array': case 'func': case 'symbol': case 'node':
            case 'element': case 'elementType': 
              break;
            case 'any': type = 'any'; break;
            default: type = `PropTypes.${type}`; break;
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
    
    if (method === 'oneOf' && node.arguments.length > 0) {
      if (t.isArrayExpression(node.arguments[0])) {
        const values = node.arguments[0].elements
          .map(extractLiteralValue)
          .filter(Boolean);
        type = `oneOf(${values.join(' | ')})`;
      }
    } else if (method === 'oneOfType' && node.arguments.length > 0) {
      if (t.isArrayExpression(node.arguments[0])) {
        const types = node.arguments[0].elements
          .map(el => extractPropTypeInfo(el).type)
          .filter(Boolean);
        type = `oneOfType(${types.join(' | ')})`;
      }
    } else if (method === 'arrayOf' && node.arguments.length > 0) {
      const itemType = extractPropTypeInfo(node.arguments[0]).type;
      type = `arrayOf(${itemType})`;
    } else if (method === 'objectOf' && node.arguments.length > 0) {
      const valueType = extractPropTypeInfo(node.arguments[0]).type;
      type = `objectOf(${valueType})`;
    } else if (method === 'shape' && node.arguments.length > 0) {
      if (t.isObjectExpression(node.arguments[0])) {
        type = 'shape({...})';
      }
    }
  }
  
  return { type, isRequired };
}

/**
 * Extrahiere den Wert eines Literals
 */
function extractLiteralValue(node) {
  if (!node) return null;
  
  if (t.isStringLiteral(node)) {
    return `"${node.value}"`;
  } else if (t.isNumericLiteral(node)) {
    return node.value;
  } else if (t.isBooleanLiteral(node)) {
    return node.value;
  } else if (t.isNullLiteral(node)) {
    return 'null';
  } else if (t.isIdentifier(node)) {
    if (node.name === 'undefined') {
      return 'undefined';
    } else {
      return `[Variable: ${node.name}]`;
    }
  } else if (t.isObjectExpression(node)) {
    return '{...}';
  } else if (t.isArrayExpression(node)) {
    return '[...]';
  } else if (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) {
    return '[Function]';
  }
  
  return null;
}

/**
 * Inferiere den Typ aus einem Wert
 */
function inferTypeFromValue(node) {
  if (!node) return 'unknown';
  
  if (t.isStringLiteral(node)) {
    return 'string';
  } else if (t.isNumericLiteral(node)) {
    return 'number';
  } else if (t.isBooleanLiteral(node)) {
    return 'boolean';
  } else if (t.isNullLiteral(node)) {
    return 'null';
  } else if (t.isObjectExpression(node)) {
    return 'object';
  } else if (t.isArrayExpression(node)) {
    return 'array';
  } else if (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) {
    return 'function';
  }
  
  return 'unknown';
}

/**
 * Extrahiere TypeScript-Typ
 */
function extractTSType(typeAnnotation) {
  if (t.isTSStringKeyword(typeAnnotation)) {
    return 'string';
  } else if (t.isTSNumberKeyword(typeAnnotation)) {
    return 'number';
  } else if (t.isTSBooleanKeyword(typeAnnotation)) {
    return 'boolean';
  } else if (t.isTSAnyKeyword(typeAnnotation)) {
    return 'any';
  } else if (t.isTSVoidKeyword(typeAnnotation)) {
    return 'void';
  } else if (t.isTSNullKeyword(typeAnnotation)) {
    return 'null';
  } else if (t.isTSUndefinedKeyword(typeAnnotation)) {
    return 'undefined';
  } else if (t.isTSUnknownKeyword(typeAnnotation)) {
    return 'unknown';
  } else if (t.isTSObjectKeyword(typeAnnotation)) {
    return 'object';
  } else if (t.isTSArrayType(typeAnnotation)) {
    const elementType = extractTSType(typeAnnotation.elementType);
    return `${elementType}[]`;
  } else if (t.isTSTypeReference(typeAnnotation)) {
    if (t.isIdentifier(typeAnnotation.typeName)) {
      return typeAnnotation.typeName.name;
    }
  } else if (t.isTSUnionType(typeAnnotation)) {
    const types = typeAnnotation.types.map(extractTSType);
    return types.join(' | ');
  } else if (t.isTSLiteralType(typeAnnotation)) {
    if (typeAnnotation.literal) {
      return extractLiteralValue(typeAnnotation.literal) || 'literal';
    }
  } else if (t.isTSFunctionType(typeAnnotation)) {
    return 'function';
  }
  
  return 'unknown';
}

/**
 * Prüfe, ob eine Prop einen Standardwert hat
 */
function hasDefaultValue(prop) {
  return t.isAssignmentPattern(prop.value);
}

/**
 * Extrahiere den Standardwert einer Prop
 */
function getDefaultValue(prop) {
  if (t.isObjectProperty(prop) && t.isAssignmentPattern(prop.value)) {
    return extractLiteralValue(prop.value.right);
  }
  return null;
}

/**
 * Inferiere den Typ einer Prop
 */
function inferType(prop) {
  // Für funktionale Komponenten haben wir oft keine expliziten Types
  return 'unknown';
}

/**
 * Extrahiere eine Beschreibung aus JSDoc
 */
function getDescriptionFromJSDoc(node) {
  if (node.leadingComments && node.leadingComments.length > 0) {
    const jsdocComment = node.leadingComments.find(
      comment => comment.type === 'CommentBlock' && comment.value.startsWith('*')
    );
    
    if (jsdocComment) {
      const lines = jsdocComment.value
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trim())
        .filter(line => !line.startsWith('@'));
      
      return lines.join(' ').trim();
    }
  }
  
  return null;
}

/**
 * Analysiere Hooks
 */
function analyzeHooks(ast, analysis) {
  const hooks = [];
  
  traverse(ast, {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee) && 
          path.node.callee.name.startsWith('use')) {
        
        const hookName = path.node.callee.name;
        const hookSource = inferHookSource(hookName, path);
        const existingHook = hooks.find(h => h.name === hookName);
        
        if (existingHook) {
          existingHook.count += 1;
        } else {
          hooks.push({
            name: hookName,
            source: hookSource,
            count: 1,
            args: path.node.arguments.length
          });
        }
        
        // Spezielle Hooks-Analyse
        if (hookName === 'useState') {
          analyzeUseState(path, analysis);
        } else if (hookName === 'useEffect' || hookName === 'useLayoutEffect') {
          analyzeUseEffect(path, analysis);
        } else if (hookName === 'useCallback' || hookName === 'useMemo') {
          analyzeUseCallback(path, analysis);
        } else if (hookName === 'useRef') {
          analyzeUseRef(path, analysis);
        } else if (hookName === 'useContext') {
          analyzeUseContext(path, analysis);
        }
      }
    }
  });
  
  analysis.hooks = hooks;
}

/**
 * Inferiere die Quelle eines Hooks
 */
function inferHookSource(hookName, path) {
  // Built-in React Hooks
  const reactHooks = [
    'useState', 'useEffect', 'useContext', 'useReducer', 
    'useCallback', 'useMemo', 'useRef', 'useImperativeHandle', 
    'useLayoutEffect', 'useDebugValue'
  ];
  
  if (reactHooks.includes(hookName)) {
    return 'react';
  }
  
  // Prüfe Imports
  let source = 'custom';
  let scope = path.scope;
  
  while (scope) {
    if (scope.bindings[hookName]) {
      const binding = scope.bindings[hookName];
      if (binding.path.isImportSpecifier() || binding.path.isImportDefaultSpecifier()) {
        const importDeclaration = binding.path.parentPath;
        if (importDeclaration.isImportDeclaration()) {
          source = importDeclaration.node.source.value;
        }
      }
      break;
    }
    scope = scope.parent;
  }
  
  return source;
}

/**
 * Analysiere useState-Aufrufe
 */
function analyzeUseState(path, analysis) {
  if (!analysis.state) {
    analysis.state = [];
  }
  
  // Finde den LHS des useState-Calls (z.B. const [count, setCount] = useState(0);)
  const parent = path.parentPath;
  if (parent.isVariableDeclarator() && 
      t.isArrayPattern(parent.node.id)) {
    
    const stateVariable = parent.node.id.elements[0];
    const setterVariable = parent.node.id.elements[1];
    
    if (stateVariable && t.isIdentifier(stateVariable)) {
      const defaultValue = path.node.arguments.length > 0 ? 
                          extractLiteralValue(path.node.arguments[0]) : 
                          'undefined';
      
      const stateType = path.node.arguments.length > 0 ? 
                        inferTypeFromValue(path.node.arguments[0]) : 
                        'unknown';
      
      analysis.state.push({
        name: stateVariable.name,
        setter: setterVariable ? setterVariable.name : null,
        defaultValue,
        type: stateType
      });
    }
  }
}

/**
 * Analysiere useEffect-Aufrufe
 */
function analyzeUseEffect(path, analysis) {
  if (!analysis.effects) {
    analysis.effects = [];
  }
  
  let dependencies = 'unknown';
  let hasCleanup = false;
  
  // Prüfe, ob Abhängigkeiten angegeben sind
  if (path.node.arguments.length > 1) {
    const depsArg = path.node.arguments[1];
    if (t.isArrayExpression(depsArg)) {
      dependencies = depsArg.elements.length === 0 ? 
                     'empty array' : 
                     `[${depsArg.elements.map(el => el.name || 'unknown').join(', ')}]`;
    } else {
      dependencies = 'dynamic';
    }
  }
  
  // Prüfe, ob eine Cleanup-Funktion vorhanden ist
  if (path.node.arguments.length > 0) {
    const effectCallback = path.node.arguments[0];
    if (t.isArrowFunctionExpression(effectCallback) || 
        t.isFunctionExpression(effectCallback)) {
      
      // Prüfe, ob die Funktion etwas zurückgibt
      if (t.isBlockStatement(effectCallback.body)) {
        traverse.default.cheap(effectCallback.body, {
          ReturnStatement() {
            hasCleanup = true;
          }
        });
      }
    }
  }
  
  analysis.effects.push({
    type: path.node.callee.name, // useEffect oder useLayoutEffect
    dependencies,
    hasCleanup
  });
}

/**
 * Analysiere useCallback-Aufrufe
 */
function analyzeUseCallback(path, analysis) {
  if (!analysis.callbacks) {
    analysis.callbacks = [];
  }
  
  let dependencies = 'unknown';
  const hookName = path.node.callee.name;
  
  // Prüfe, ob Abhängigkeiten angegeben sind
  if (path.node.arguments.length > 1) {
    const depsArg = path.node.arguments[1];
    if (t.isArrayExpression(depsArg)) {
      dependencies = depsArg.elements.length === 0 ? 
                     'empty array' : 
                     `[${depsArg.elements.map(el => el.name || 'unknown').join(', ')}]`;
    } else {
      dependencies = 'dynamic';
    }
  }
  
  // Finde den Namen des Callbacks
  let callbackName = null;
  const parent = path.parentPath;
  if (parent.isVariableDeclarator() && 
      t.isIdentifier(parent.node.id)) {
    callbackName = parent.node.id.name;
  }
  
  analysis.callbacks.push({
    type: hookName,
    name: callbackName || 'anonymous',
    dependencies
  });
}

/**
 * Analysiere useRef-Aufrufe
 */
function analyzeUseRef(path, analysis) {
  if (!analysis.refs) {
    analysis.refs = [];
  }
  
  // Finde den LHS des useRef-Calls (z.B. const inputRef = useRef(null);)
  const parent = path.parentPath;
  if (parent.isVariableDeclarator() && 
      t.isIdentifier(parent.node.id)) {
    
    const refName = parent.node.id.name;
    const initialValue = path.node.arguments.length > 0 ? 
                        extractLiteralValue(path.node.arguments[0]) : 
                        'undefined';
    
    analysis.refs.push({
      name: refName,
      initialValue
    });
  }
}

/**
 * Analysiere useContext-Aufrufe
 */
function analyzeUseContext(path, analysis) {
  if (!analysis.contextUsage) {
    analysis.contextUsage = [];
  }
  
  // Finde den Context, der verwendet wird
  if (path.node.arguments.length > 0) {
    const contextArg = path.node.arguments[0];
    let contextName = 'unknown';
    
    if (t.isIdentifier(contextArg)) {
      contextName = contextArg.name;
    }
    
    // Finde den LHS des useContext-Calls
    const parent = path.parentPath;
    if (parent.isVariableDeclarator()) {
      let varName = 'anonymous';
      
      if (t.isIdentifier(parent.node.id)) {
        varName = parent.node.id.name;
      } else if (t.isObjectPattern(parent.node.id)) {
        varName = `{${parent.node.id.properties.map(p => p.key.name).join(', ')}}`;
      }
      
      analysis.contextUsage.push({
        context: contextName,
        variable: varName
      });
    } else {
      analysis.contextUsage.push({
        context: contextName,
        variable: 'anonymous'
      });
    }
  }
}

/**
 * Analysiere State in Klassenkomponenten
 */
function analyzeState(ast, analysis) {
  const stateFields = [];
  
  traverse(ast, {
    // Klassenkomponenten mit state
    ClassProperty(path) {
      if (t.isIdentifier(path.node.key, { name: 'state' }) && 
          t.isObjectExpression(path.node.value)) {
        
        path.node.value.properties.forEach(prop => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            stateFields.push({
              name: prop.key.name,
              defaultValue: extractLiteralValue(prop.value),
              type: inferTypeFromValue(prop.value)
            });
          }
        });
      }
    },
    
    // State-Initialisierung im Konstruktor
    AssignmentExpression(path) {
      if (t.isMemberExpression(path.node.left) && 
          t.isThisExpression(path.node.left.object) && 
          t.isIdentifier(path.node.left.property, { name: 'state' }) &&
          t.isObjectExpression(path.node.right)) {
        
        path.node.right.properties.forEach(prop => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            const existingState = stateFields.find(s => s.name === prop.key.name);
            
            if (!existingState) {
              stateFields.push({
                name: prop.key.name,
                defaultValue: extractLiteralValue(prop.value),
                type: inferTypeFromValue(prop.value)
              });
            }
          }
        });
      }
    }
  });
  
  // Nur hinzufügen, wenn die Komponente nicht bereits useState verwendet
  if (stateFields.length > 0 && (!analysis.state || analysis.state.length === 0)) {
    analysis.state = stateFields;
  }
}

/**
 * Analysiere Abhängigkeiten
 */
function analyzeDependencies(ast, analysis) {
  const imports = {};
  const dependencies = [];
  
  // Finde alle Imports
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      
      // Importtyp bestimmen (intern oder extern)
      let importType = 'extern';
      if (source.startsWith('./') || 
          source.startsWith('../') || 
          source.startsWith('@/') || 
          source.startsWith('@app/') || 
          source.startsWith('@components/') || 
          source.startsWith('@lib/') || 
          source.startsWith('@hooks/') || 
          source.startsWith('@types/') || 
          source.startsWith('@public/')) {
        importType = 'intern';
      }
      
      // Importierte Namen sammeln
      const importedNames = path.node.specifiers.map(specifier => {
        if (t.isImportDefaultSpecifier(specifier)) {
          return { name: specifier.local.name, type: 'default' };
        } else if (t.isImportSpecifier(specifier)) {
          return { 
            name: specifier.local.name, 
            imported: specifier.imported ? specifier.imported.name : specifier.local.name,
            type: 'named' 
          };
        } else if (t.isImportNamespaceSpecifier(specifier)) {
          return { name: specifier.local.name, type: 'namespace' };
        }
        return null;
      }).filter(Boolean);
      
      // Import speichern
      imports[source] = importedNames;
      
      // Zur Abhängigkeitsliste hinzufügen
      if (importedNames.length > 0) {
        dependencies.push({
          source,
          type: importType,
          identifiers: importedNames.map(n => n.name),
        });
      }
    }
  });
  
  analysis.dependencies = dependencies;
}

/**
 * Analysiere JSDoc-Kommentare
 */
function analyzeJSDoc(ast, analysis) {
  const jsdocComments = [];
  
  // Suche nach JSDoc-Kommentaren für die Komponente und Methoden
  traverse(ast, {
    Function(path) {
      if (path.node.leadingComments && path.node.leadingComments.length > 0) {
        const jsdoc = path.node.leadingComments.find(
          comment => comment.type === 'CommentBlock' && comment.value.startsWith('*')
        );
        
        if (jsdoc) {
          const funcName = path.node.id ? path.node.id.name : 'anonymous';
          const jsdocInfo = parseJSDocComment(jsdoc.value);
          
          jsdocComments.push({
            target: funcName,
            description: jsdocInfo.description,
            tags: jsdocInfo.tags
          });
        }
      }
    },
    ClassDeclaration(path) {
      if (path.node.leadingComments && path.node.leadingComments.length > 0) {
        const jsdoc = path.node.leadingComments.find(
          comment => comment.type === 'CommentBlock' && comment.value.startsWith('*')
        );
        
        if (jsdoc) {
          const className = path.node.id ? path.node.id.name : 'anonymous';
          const jsdocInfo = parseJSDocComment(jsdoc.value);
          
          jsdocComments.push({
            target: className,
            description: jsdocInfo.description,
            tags: jsdocInfo.tags
          });
        }
      }
    },
    ClassMethod(path) {
      if (path.node.leadingComments && path.node.leadingComments.length > 0) {
        const jsdoc = path.node.leadingComments.find(
          comment => comment.type === 'CommentBlock' && comment.value.startsWith('*')
        );
        
        if (jsdoc) {
          const className = path.parent.id ? path.parent.id.name : 'anonymous';
          const methodName = path.node.key ? path.node.key.name : 'anonymous';
          const jsdocInfo = parseJSDocComment(jsdoc.value);
          
          jsdocComments.push({
            target: `${className}.${methodName}`,
            description: jsdocInfo.description,
            tags: jsdocInfo.tags
          });
        }
      }
    }
  });
  
  analysis.jsdoc = jsdocComments;
}

/**
 * Parst einen JSDoc-Kommentar
 */
function parseJSDocComment(comment) {
  const lines = comment
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, '').trim());
  
  const descriptionLines = [];
  const tags = [];
  
  let inDescription = true;
  
  for (const line of lines) {
    if (line.startsWith('@')) {
      inDescription = false;
      const tagMatch = line.match(/^@(\w+)(?:\s+(.*))?$/);
      if (tagMatch) {
        tags.push({
          name: tagMatch[1],
          value: tagMatch[2] || ''
        });
      }
    } else if (inDescription) {
      if (line) descriptionLines.push(line);
    } else if (tags.length > 0) {
      // Fortsetzung des vorherigen Tags
      const lastTag = tags[tags.length - 1];
      if (line) lastTag.value += ' ' + line;
    }
  }
  
  return {
    description: descriptionLines.join(' ').trim(),
    tags
  };
}

/**
 * Analysiere Code-Patterns
 */
function analyzePatterns(ast, analysis) {
  const patterns = analysis.patterns || [];
  
  // Prüfe auf verschiedene React-Patterns
  const hasRenderProps = false;
  const hasConditionalRendering = false;
  const hasList = false;
  const hasFetchData = false;
  const hasFormHandling = false;
  
  // Render Props
  traverse(ast, {
    JSXElement(path) {
      const openingElement = path.node.openingElement;
      if (openingElement && openingElement.attributes) {
        for (const attr of openingElement.attributes) {
          if (attr.type === 'JSXAttribute' && 
              attr.value && 
              (attr.value.type === 'JSXExpressionContainer') && 
              (t.isArrowFunctionExpression(attr.value.expression) || 
               t.isFunctionExpression(attr.value.expression))) {
            if (!patterns.includes('Render Props')) {
              patterns.push('Render Props');
            }
            break;
          }
        }
      }
    }
  });
  
  // Conditional Rendering
  traverse(ast, {
    ConditionalExpression(path) {
      if (path.findParent(p => p.isJSXElement())) {
        if (!patterns.includes('Conditional Rendering')) {
          patterns.push('Conditional Rendering');
        }
      }
    },
    LogicalExpression(path) {
      if (path.node.operator === '&&' && path.findParent(p => p.isJSXElement())) {
        if (!patterns.includes('Conditional Rendering')) {
          patterns.push('Conditional Rendering');
        }
      }
    }
  });
  
  // List Rendering
  traverse(ast, {
    CallExpression(path) {
      if (t.isMemberExpression(path.node.callee) && 
          t.isIdentifier(path.node.callee.property, { name: 'map' }) &&
          path.findParent(p => p.isJSXElement())) {
        if (!patterns.includes('List Rendering')) {
          patterns.push('List Rendering');
        }
      }
    }
  });
  
  // Fetch Data (in useEffect or componentDidMount)
  traverse(ast, {
    CallExpression(path) {
      if ((t.isIdentifier(path.node.callee, { name: 'fetch' }) || 
           (t.isMemberExpression(path.node.callee) && 
            t.isIdentifier(path.node.callee.property, { name: 'then' }))) &&
          path.findParent(p => 
            (p.isCallExpression() && 
             t.isIdentifier(p.node.callee, { name: 'useEffect' })) ||
            (p.isClassMethod() && 
             t.isIdentifier(p.node.key, { name: 'componentDidMount' }))
          )) {
        if (!patterns.includes('Data Fetching')) {
          patterns.push('Data Fetching');
        }
      }
    }
  });
  
  // Form Handling
  traverse(ast, {
    JSXAttribute(path) {
      if ((t.isJSXIdentifier(path.node.name, { name: 'onSubmit' }) ||
           t.isJSXIdentifier(path.node.name, { name: 'onChange' })) &&
          path.parent.name && 
          (t.isJSXIdentifier(path.parent.name, { name: 'form' }) ||
           t.isJSXIdentifier(path.parent.name, { name: 'input' }) ||
           t.isJSXIdentifier(path.parent.name, { name: 'select' }) ||
           t.isJSXIdentifier(path.parent.name, { name: 'textarea' }))) {
        if (!patterns.includes('Form Handling')) {
          patterns.push('Form Handling');
        }
      }
    }
  });
  
  // Controlled Components
  traverse(ast, {
    JSXAttribute(path) {
      if (t.isJSXIdentifier(path.node.name, { name: 'value' }) &&
          path.parent.name && 
          (t.isJSXIdentifier(path.parent.name, { name: 'input' }) ||
           t.isJSXIdentifier(path.parent.name, { name: 'select' }) ||
           t.isJSXIdentifier(path.parent.name, { name: 'textarea' }))) {
        const hasOnChange = path.parent.attributes.some(
          attr => t.isJSXIdentifier(attr.name, { name: 'onChange' })
        );
        if (hasOnChange && !patterns.includes('Controlled Components')) {
          patterns.push('Controlled Components');
        }
      }
    }
  });
  
  // Composition
  traverse(ast, {
    JSXElement(path) {
      if (path.node.children && 
          path.node.children.some(child => 
            t.isJSXExpressionContainer(child) && 
            t.isIdentifier(child.expression, { name: 'children' })
          )) {
        if (!patterns.includes('Component Composition')) {
          patterns.push('Component Composition');
        }
      }
    }
  });
  
  // Memoization (React.memo)
  traverse(ast, {
    CallExpression(path) {
      if ((t.isIdentifier(path.node.callee, { name: 'memo' }) ||
           (t.isMemberExpression(path.node.callee) && 
            t.isIdentifier(path.node.callee.object, { name: 'React' }) && 
            t.isIdentifier(path.node.callee.property, { name: 'memo' })))) {
        if (!patterns.includes('Memoization')) {
          patterns.push('Memoization');
        }
      }
    }
  });
  
  analysis.patterns = patterns;
}

/**
 * Analysiere Exports
 */
function analyzeExports(ast, analysis) {
  const exports = [];
  
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      let name = 'default';
      
      if (t.isIdentifier(path.node.declaration)) {
        name = path.node.declaration.name;
      } else if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
        name = path.node.declaration.id.name;
      } else if (t.isClassDeclaration(path.node.declaration) && path.node.declaration.id) {
        name = path.node.declaration.id.name;
      }
      
      exports.push({
        name,
        type: 'default'
      });
    },
    
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
          exports.push({
            name: path.node.declaration.id.name,
            type: 'named'
          });
        } else if (t.isVariableDeclaration(path.node.declaration)) {
          path.node.declaration.declarations.forEach(decl => {
            if (decl.id && t.isIdentifier(decl.id)) {
              exports.push({
                name: decl.id.name,
                type: 'named'
              });
            }
          });
        } else if (t.isClassDeclaration(path.node.declaration) && path.node.declaration.id) {
          exports.push({
            name: path.node.declaration.id.name,
            type: 'named'
          });
        }
      } else if (path.node.specifiers) {
        path.node.specifiers.forEach(specifier => {
          if (t.isExportSpecifier(specifier)) {
            exports.push({
              name: specifier.exported.name,
              local: specifier.local.name !== specifier.exported.name ? specifier.local.name : undefined,
              type: 'named'
            });
          }
        });
      }
    }
  });
  
  analysis.exports = exports;
}

/**
 * Berechne die Komplexität der Komponente
 */
function calculateComplexity(analysis) {
  let score = 0;
  
  // Komponententyp
  if (analysis.componentType === 'Klassenkomponente') {
    score += COMPLEXITY_INDICATORS.CLASS_COMPONENT.value * COMPLEXITY_INDICATORS.CLASS_COMPONENT.weight;
  }
  
  if (analysis.patterns.includes('Higher Order Component')) {
    score += COMPLEXITY_INDICATORS.HOC_USAGE.value * COMPLEXITY_INDICATORS.HOC_USAGE.weight;
  }
  
  // Props
  const propCount = analysis.props.length;
  const complexProps = analysis.props.filter(p => 
    p.type && 
    (p.type.includes('object') || 
     p.type.includes('array') || 
     p.type.includes('func') || 
     p.type.includes('shape') || 
     p.type.includes('oneOf'))
  ).length;
  
  const optionalProps = analysis.props.filter(p => !p.isRequired).length;
  
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.PROP_COUNT, propCount);
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.COMPLEX_PROPS, complexProps);
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.OPTIONAL_PROPS, optionalProps);
  
  // Children-Prop
  const usesChildren = analysis.props.some(p => p.name === 'children');
  score += calculateIndicatorScore(
    COMPLEXITY_INDICATORS.CHILDREN_USAGE, 
    usesChildren ? 1 : 0
  );
  
  // State
  const stateCount = analysis.state ? analysis.state.length : 0;
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.STATE_COUNT, stateCount);
  
  // Effects
  const effectCount = analysis.effects ? analysis.effects.length : 0;
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.EFFECT_COUNT, effectCount);
  
  // Callbacks
  const callbackCount = analysis.callbacks ? analysis.callbacks.length : 0;
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.CALLBACK_COUNT, callbackCount);
  
  // Refs
  const refCount = analysis.refs ? analysis.refs.length : 0;
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.REF_COUNT, refCount);
  
  // Komplexe Logik (anhand der Patterns)
  const complexLogicCount = [
    'Conditional Rendering',
    'List Rendering',
    'Data Fetching',
    'Form Handling',
    'Controlled Components'
  ].filter(pattern => analysis.patterns.includes(pattern)).length;
  
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.COMPLEX_LOGIC, complexLogicCount);
  
  // Externe Abhängigkeiten
  const externalDepsCount = analysis.dependencies.filter(d => d.type === 'extern').length;
  score += calculateIndicatorScore(COMPLEXITY_INDICATORS.EXTERNAL_DEPS, externalDepsCount);
  
  // Komplexitätsstufe zuweisen
  let complexityLevel;
  if (score < 5) {
    complexityLevel = COMPLEXITY_LEVELS.LOW;
  } else if (score < 10) {
    complexityLevel = COMPLEXITY_LEVELS.MEDIUM;
  } else if (score < 15) {
    complexityLevel = COMPLEXITY_LEVELS.HIGH;
  } else {
    complexityLevel = COMPLEXITY_LEVELS.VERY_HIGH;
  }
  
  analysis.complexityScore = score;
  analysis.complexityLevel = complexityLevel;
}

/**
 * Berechne den Score für einen Indikator
 */
function calculateIndicatorScore(indicator, value) {
  if (!indicator) return 0;
  
  // Für Indikatoren mit diskreten Werten
  if (indicator.value !== undefined) {
    return value ? indicator.value * indicator.weight : 0;
  }
  
  // Für Indikatoren mit Schwellenwerten
  if (indicator.threshold) {
    if (value <= indicator.threshold[0]) {
      return 0;
    } else if (value <= indicator.threshold[1]) {
      return 1 * indicator.weight;
    } else if (value <= indicator.threshold[2]) {
      return 2 * indicator.weight;
    } else {
      return 3 * indicator.weight;
    }
  }
  
  return 0;
}

/**
 * Formatiere die Analyse-Ausgabe für die Konsole
 */
function formatAnalysis(analysis) {
  let output = '';
  
  output += chalk.bold(`Komponenten-Analyse für: ${analysis.fileName}\n`);
  output += ''.padEnd(50, '-') + '\n';
  
  output += chalk.bold('Typ: ') + analysis.componentType + '\n';
  output += chalk.bold('Komplexität: ') + analysis.complexityLevel + '\n\n';
  
  if (analysis.props.length > 0) {
    output += chalk.bold('Identifizierte Props:\n');
    analysis.props.forEach(prop => {
      output += `- ${prop.name}${prop.isRequired ? ' (erforderlich)' : ''}: ${prop.type || 'unknown'}`;
      if (prop.defaultValue) {
        output += ` = ${prop.defaultValue}`;
      }
      if (prop.description) {
        output += `\n  ${prop.description}`;
      }
      output += '\n';
    });
    output += '\n';
  }
  
  if (analysis.state && analysis.state.length > 0) {
    output += chalk.bold('State-Variablen:\n');
    analysis.state.forEach(state => {
      output += `- ${state.name}: ${state.type || 'unknown'}`;
      if (state.defaultValue) {
        output += ` = ${state.defaultValue}`;
      }
      output += '\n';
    });
    output += '\n';
  }
  
  if (analysis.hooks && analysis.hooks.length > 0) {
    output += chalk.bold('Verwendete Hooks:\n');
    const hooksByType = {};
    analysis.hooks.forEach(hook => {
      if (!hooksByType[hook.name]) {
        hooksByType[hook.name] = { count: 0, source: hook.source };
      }
      hooksByType[hook.name].count += hook.count;
    });
    
    Object.entries(hooksByType).forEach(([name, info]) => {
      output += `- ${name} (${info.count}x): aus ${info.source}\n`;
    });
    output += '\n';
  }
  
  if (analysis.patterns && analysis.patterns.length > 0) {
    output += chalk.bold('Code-Patterns:\n');
    analysis.patterns.forEach(pattern => {
      output += `- ${pattern}\n`;
    });
    output += '\n';
  }
  
  if (analysis.dependencies && analysis.dependencies.length > 0) {
    output += chalk.bold('Abhängigkeiten:\n');
    const internDeps = analysis.dependencies.filter(d => d.type === 'intern');
    const externDeps = analysis.dependencies.filter(d => d.type === 'extern');
    
    if (externDeps.length > 0) {
      output += chalk.bold('  Externe Module:\n');
      externDeps.forEach(dep => {
        output += `  - ${dep.source}: ${dep.identifiers.join(', ')}\n`;
      });
    }
    
    if (internDeps.length > 0) {
      output += chalk.bold('  Interne Module:\n');
      internDeps.forEach(dep => {
        output += `  - ${dep.source}: ${dep.identifiers.join(', ')}\n`;
      });
    }
    output += '\n';
  }
  
  if (analysis.exports && analysis.exports.length > 0) {
    output += chalk.bold('Exportierte API:\n');
    analysis.exports.forEach(exp => {
      output += `- ${exp.name} (${exp.type})\n`;
    });
    output += '\n';
  }
  
  if (analysis.jsdoc && analysis.jsdoc.length > 0) {
    output += chalk.bold('JSDoc-Dokumentation:\n');
    analysis.jsdoc.forEach(doc => {
      output += `- ${doc.target}:\n`;
      if (doc.description) {
        output += `  Beschreibung: ${doc.description}\n`;
      }
      if (doc.tags.length > 0) {
        output += '  Tags:\n';
        doc.tags.forEach(tag => {
          output += `  - @${tag.name}${tag.value ? ': ' + tag.value : ''}\n`;
        });
      }
    });
    output += '\n';
  }
  
  output += chalk.bold('Migrations-Komplexität: ') + analysis.complexityLevel + '\n';
  output += 'Migration erfordert: ';
  
  const requirements = [];
  if (analysis.componentType === 'Klassenkomponente') {
    requirements.push('Umwandlung zu funktionaler Komponente');
  }
  if (analysis.props.some(p => !p.type || p.type === 'unknown')) {
    requirements.push('TypeScript-Typdefinitionen für Props');
  }
  if (analysis.state && analysis.state.some(s => !s.type || s.type === 'unknown')) {
    requirements.push('TypeScript-Typdefinitionen für State');
  }
  if (analysis.patterns.includes('Higher Order Component')) {
    requirements.push('HOC-Behandlung');
  }
  if (analysis.patterns.includes('Render Props')) {
    requirements.push('Render-Props-Behandlung');
  }
  
  if (requirements.length === 0) {
    requirements.push('Minimale Anpassungen');
  }
  
  output += requirements.join(', ');
  
  return output;
}

/**
 * Exportiere Analyse als JSON
 */
function exportAsJSON(analysis) {
  return JSON.stringify(analysis, null, 2);
}

/**
 * Exportiere Analyse als YAML
 */
function exportAsYAML(analysis) {
  return yaml.dump(analysis);
}

/**
 * Gruppiere Komponenten nach Komplexität
 */
function groupByComplexity(analyses) {
  const groups = {
    [COMPLEXITY_LEVELS.LOW]: [],
    [COMPLEXITY_LEVELS.MEDIUM]: [],
    [COMPLEXITY_LEVELS.HIGH]: [],
    [COMPLEXITY_LEVELS.VERY_HIGH]: [],
  };
  
  analyses.forEach(analysis => {
    groups[analysis.complexityLevel].push({
      name: analysis.componentName,
      file: analysis.filePath,
      score: analysis.complexityScore,
    });
  });
  
  return groups;
}

/**
 * Analysiere ein Verzeichnis
 */
function analyzeDirectory(dirPath, options = {}) {
  const jsFiles = walkDirectorySync(dirPath, file => 
    file.match(/\.(js|jsx|ts|tsx)$/) && 
    !file.includes('node_modules') && 
    !file.includes('.git')
  );
  
  const analyses = [];
  
  jsFiles.forEach(file => {
    try {
      const analysis = analyzeComponent(file, options);
      if (analysis.componentType !== 'Unknown') {
        analyses.push(analysis);
      }
    } catch (error) {
      console.error(`Fehler bei der Analyse von ${file}:`, error);
    }
  });
  
  return analyses;
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
    console.log('Verwendung: node scripts/analyzeComponent.js [Dateipfad] [Optionen]');
    console.log('Optionen:');
    console.log('  --export=json|yaml  - Exportiert die Analyse als JSON oder YAML');
    console.log('  --dir               - Analysiert alle Komponenten in einem Verzeichnis');
    console.log('  --group             - Gruppiert Komponenten nach Migrations-Komplexität');
    console.log('  --patterns          - Analysiert und listet verwendete Code-Patterns');
    return;
  }
  
  const options = {
    exportFormat: null,
    analyzeDir: false,
    groupByComplexity: false,
    analyzePatterns: false,
  };
  
  let target = args[0];
  
  // Optionen parsen
  args.slice(1).forEach(arg => {
    if (arg.startsWith('--export=')) {
      options.exportFormat = arg.split('=')[1];
    } else if (arg === '--dir') {
      options.analyzeDir = true;
    } else if (arg === '--group') {
      options.groupByComplexity = true;
    } else if (arg === '--patterns') {
      options.analyzePatterns = true;
    }
  });
  
  try {
    if (options.analyzeDir) {
      // Verzeichnis analysieren
      const analyses = analyzeDirectory(target, options);
      
      if (options.groupByComplexity) {
        const groups = groupByComplexity(analyses);
        
        console.log(chalk.bold('Komponenten nach Migrations-Komplexität:\n'));
        Object.entries(groups).forEach(([level, comps]) => {
          if (comps.length > 0) {
            console.log(chalk.bold(`${level} (${comps.length}):`));
            comps.forEach(comp => {
              console.log(`- ${comp.name} (Score: ${comp.score.toFixed(1)}) - ${comp.file}`);
            });
            console.log('');
          }
        });
      } else {
        console.log(chalk.bold(`${analyses.length} Komponenten analysiert\n`));
        
        analyses.forEach(analysis => {
          console.log(formatAnalysis(analysis));
          console.log(''.padEnd(50, '=') + '\n');
        });
      }
      
      if (options.exportFormat) {
        const exportFile = `component-analyses.${options.exportFormat}`;
        let content;
        
        if (options.exportFormat === 'json') {
          content = JSON.stringify(analyses, null, 2);
        } else if (options.exportFormat === 'yaml') {
          content = yaml.dump(analyses);
        }
        
        fs.writeFileSync(exportFile, content);
        console.log(`Analyse in ${exportFile} exportiert`);
      }
    } else {
      // Einzelne Datei analysieren
      const analysis = analyzeComponent(target, options);
      
      if (options.exportFormat) {
        const exportFile = `${path.basename(target, path.extname(target))}-analysis.${options.exportFormat}`;
        let content;
        
        if (options.exportFormat === 'json') {
          content = exportAsJSON(analysis);
        } else if (options.exportFormat === 'yaml') {
          content = exportAsYAML(analysis);
        }
        
        fs.writeFileSync(exportFile, content);
        console.log(`Analyse in ${exportFile} exportiert`);
      } else {
        console.log(formatAnalysis(analysis));
      }
    }
  } catch (error) {
    console.error(chalk.red('Fehler bei der Analyse:'), error);
    process.exit(1);
  }
}

// Wenn direkt ausgeführt
if (require.main === module) {
  main();
} else {
  // Als Modul exportieren
  module.exports = {
    analyzeComponent,
    analyzeDirectory,
    exportAsJSON,
    exportAsYAML,
    groupByComplexity,
    formatAnalysis,
  };
}