#!/usr/bin/env node

/**
 * TypeScript-Konvertierungsskript
 * 
 * Dieses Skript konvertiert React-Komponenten von JavaScript/JSX nach TypeScript/TSX
 * und fügt Typdefinitionen basierend auf der Analyse der Komponente hinzu.
 */

const fs = require('fs');
const path = require('path');
const { analyzeComponent } = require('./analyze-component');

/**
 * Generiert eine TypeScript-Interface-Definition für die Props einer Komponente
 * @param {string} componentName - Name der Komponente
 * @param {Array<string>} props - Liste der Props
 * @returns {string} TypeScript-Interface-Definition
 */
function generatePropsInterface(componentName, props) {
  // Vordefinierte Typen für häufig verwendete Props
  const commonPropTypes = {
    className: 'string',
    style: 'React.CSSProperties',
    id: 'string',
    onClick: '(event: React.MouseEvent<HTMLElement>) => void',
    onChange: '(event: React.ChangeEvent<HTMLInputElement>) => void',
    onSubmit: '(event: React.FormEvent<HTMLFormElement>) => void',
    children: 'React.ReactNode',
    disabled: 'boolean',
    active: 'boolean',
    value: 'string | number',
    defaultValue: 'string | number',
    placeholder: 'string',
    name: 'string',
    type: 'string',
    href: 'string',
    target: '"_blank" | "_self" | "_parent" | "_top"',
    rel: 'string',
    src: 'string',
    alt: 'string',
    height: 'number | string',
    width: 'number | string',
    title: 'string',
    label: 'string',
    description: 'string',
    variant: 'string',
    size: '"sm" | "md" | "lg" | string',
    color: 'string',
    required: 'boolean',
    options: 'Array<{ value: string; label: string }>',
    data: 'any',
    isOpen: 'boolean',
    onClose: '() => void',
    onOpen: '() => void',
    isLoading: 'boolean',
    error: 'string | Error | null',
    success: 'boolean',
  };

  // Liste der Props mit ihren Typen
  const propDefinitions = props.map(prop => {
    // Rest-Parameter behandeln
    if (prop.startsWith('...')) {
      return `  // Additional props can be passed
  [key: string]: any;`;
    }

    // Bekannter Prop-Typ
    if (commonPropTypes[prop]) {
      return `  ${prop}?: ${commonPropTypes[prop]};`;
    }

    // Unbekannter Prop-Typ (mit any)
    return `  ${prop}?: any; // TODO: Replace with more specific type`;
  });

  // Interface-Definition erstellen
  return `export interface ${componentName}Props {
${propDefinitions.join('\n')}
}`;
}

/**
 * Generiert die TypeScript-Typdefinition für eine Komponente
 * @param {string} componentName - Name der Komponente
 * @param {boolean} isClientComponent - Ist es eine Client-Komponente?
 * @param {Array<string>} props - Liste der Props
 * @returns {string} TypeScript-Komponenten-Definition
 */
function generateComponentType(componentName, isClientComponent, props) {
  const hasProps = props && props.length > 0;
  const propsType = hasProps ? `${componentName}Props` : '{}';
  
  return `${isClientComponent ? "'use client';\n\n" : ""}import React from 'react';
${hasProps ? `import { ${componentName}Props } from '../src/types/${componentName.toLowerCase()}';
` : ""}
export default function ${componentName}(${hasProps ? `props: ${propsType}` : "props: {}"}) {
  // Component implementation will be added here
  return (
    <div>
      ${componentName} Component
    </div>
  );
}`;
}

/**
 * Konvertiert eine JSX-Komponente zu TSX
 * @param {string} inputFile - Pfad zur JSX-Datei
 * @param {string} outputFile - Pfad zur zu erstellenden TSX-Datei
 * @param {Object} options - Optionen für die Konvertierung
 * @returns {Object} Ergebnis der Konvertierung
 */
function convertJsxToTsx(inputFile, outputFile, options = {}) {
  // Standardoptionen
  const opts = {
    createTypesFile: true,
    typesDir: path.join('src', 'types'),
    ...options
  };

  // Überprüfen, ob die Eingabedatei existiert
  if (!fs.existsSync(inputFile)) {
    console.error(`Eingabedatei nicht gefunden: ${inputFile}`);
    return { success: false, error: 'File not found' };
  }

  try {
    // Komponente analysieren
    const analysis = analyzeComponent(inputFile);
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    
    // Komponentenname aus Dateinamen oder Analyse bestimmen
    let componentName = analysis.exportName;
    if (!componentName) {
      componentName = path.basename(inputFile, path.extname(inputFile));
      // Ersten Buchstaben groß schreiben
      componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    }

    // Ausgabeverzeichnis erstellen, falls es nicht existiert
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Original JSX in TSX konvertieren (einfache Konvertierung)
    let tsxContent = fileContent;

    // 'use client' Direktive beibehalten
    const isClientComponent = analysis.isClientComponent;

    // TypeScript-spezifische Änderungen
    
    // 1. Importe anpassen
    // React Import hinzufügen, falls nicht vorhanden
    if (!analysis.imports.some(imp => imp.source === 'react')) {
      tsxContent = "import React from 'react';\n" + tsxContent;
    }

    // 2. Props-Interface hinzufügen oder in separater Datei erstellen
    if (analysis.props && analysis.props.length > 0) {
      const propsInterface = generatePropsInterface(componentName, analysis.props);
      
      if (opts.createTypesFile) {
        // Types-Verzeichnis erstellen, falls es nicht existiert
        if (!fs.existsSync(opts.typesDir)) {
          fs.mkdirSync(opts.typesDir, { recursive: true });
        }

        // Types-Datei erstellen
        const typesFilePath = path.join(opts.typesDir, `${componentName.toLowerCase()}.ts`);
        fs.writeFileSync(typesFilePath, `import React from 'react';\n\n${propsInterface}\n`);
        
        // Import für Types in TSX-Datei hinzufügen
        tsxContent = tsxContent.replace(/import React([^;]*);/, 
          `import React$1;\nimport { ${componentName}Props } from '../src/types/${componentName.toLowerCase()}';`);
      } else {
        // Props-Interface direkt in die TSX-Datei einfügen
        tsxContent = tsxContent.replace(/('use client';\n+)?import React/,
          `$1${propsInterface}\n\nimport React`);
      }
    }

    // 3. Funktions-Deklaration mit Typen anpassen
    // Verschiedene Muster für Komponentendeklarationen berücksichtigen
    const functionPatterns = [
      // Named function declaration: export default function Component(props) {...}
      {
        pattern: new RegExp(`export\\s+default\\s+function\\s+${componentName}\\s*\\(([^)]*)\\)`, 'g'),
        replacement: (match, props) => {
          if (props.trim() === '') {
            return `export default function ${componentName}(props: {})`;  
          } else if (props.includes('{')) {
            // Destrukturierte Props
            return `export default function ${componentName}({ ${analysis.props.join(', ')} }: ${componentName}Props)`;
          } else {
            // Einfache Props
            return `export default function ${componentName}(props: ${componentName}Props)`;
          }
        }
      },
      // Arrow function: const Component = (props) => {...}
      {
        pattern: new RegExp(`const\\s+${componentName}\\s*=\\s*\\(([^)]*)\\)\\s*=>`, 'g'),
        replacement: (match, props) => {
          if (props.trim() === '') {
            return `const ${componentName} = (props: {}) =>`;
          } else if (props.includes('{')) {
            // Destrukturierte Props
            return `const ${componentName} = ({ ${analysis.props.join(', ')} }: ${componentName}Props) =>`;
          } else {
            // Einfache Props
            return `const ${componentName} = (props: ${componentName}Props) =>`;
          }
        }
      }
    ];

    // Alle Funktions-Patterns ersetzen
    functionPatterns.forEach(({ pattern, replacement }) => {
      tsxContent = tsxContent.replace(pattern, replacement);
    });

    // Einige häufige JS-Konstanten mit TypeScript-Typen versehen
    const commonStatePatterns = [
      // useState mit einfachen Typen
      {
        pattern: /const\s+\[(\w+), set(\w+)\]\s*=\s*useState\(([^)]*)\);/g,
        typeMapper: (stateVar, value) => {
          if (value === 'false' || value === 'true') return 'boolean';
          if (value === '[]') return 'any[]';
          if (value === '{}') return 'Record<string, any>';
          if (value === 'null') return 'any | null';
          if (value === '0' || value.match(/^[0-9]+$/)) return 'number';
          if (value.startsWith('\'') || value.startsWith('"')) return 'string';
          return undefined; // Kein Typ konnte ermittelt werden
        },
        replacement: (match, stateVar, setterSuffix, value) => {
          const inferredType = value ? this.typeMapper(stateVar, value.trim()) : undefined;
          if (inferredType) {
            return `const [${stateVar}, set${setterSuffix}] = useState<${inferredType}>(${value});`;
          }
          return match; // Keine Änderung, wenn Typ nicht ermittelt werden konnte
        }
      }
    ];

    // TSX-Datei speichern
    fs.writeFileSync(outputFile, tsxContent);

    return { 
      success: true,
      componentName,
      typesFile: opts.createTypesFile ? path.join(opts.typesDir, `${componentName.toLowerCase()}.ts`) : null
    };
  } catch (error) {
    console.error('Fehler bei der Konvertierung:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Konvertiert eine Komponente zu TypeScript und gibt das Ergebnis aus
 */
function convertAndPrint(inputFile, outputFile, options) {
  console.log(`\n=== TypeScript-Konvertierung ===`);
  console.log(`Eingabedatei: ${inputFile}`);
  console.log(`Ausgabedatei: ${outputFile}`);
  
  const result = convertJsxToTsx(inputFile, outputFile, options);
  
  if (result.success) {
    console.log(`\n✅ Konvertierung erfolgreich!`);
    console.log(`Komponente: ${result.componentName}`);
    
    if (result.typesFile) {
      console.log(`Types-Datei erstellt: ${result.typesFile}`);
    }
  } else {
    console.error(`\n❌ Konvertierung fehlgeschlagen: ${result.error}`);
  }
  
  console.log('\n=== Ende der Konvertierung ===\n');
}

// Direkter Aufruf von der Kommandozeile
if (require.main === module) {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3];
  
  if (!inputFile || !outputFile) {
    console.error('Bitte geben Sie einen Eingabe- und Ausgabedateipfad an.');
    console.log('Verwendung: node convert-to-typescript.js <eingabedatei.jsx> <ausgabedatei.tsx> [--no-types-file]');
    process.exit(1);
  }
  
  const options = {
    createTypesFile: !process.argv.includes('--no-types-file')
  };
  
  convertAndPrint(inputFile, outputFile, options);
}

module.exports = { convertJsxToTsx, convertAndPrint, generatePropsInterface };
