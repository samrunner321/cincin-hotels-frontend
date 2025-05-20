/**
 * Dieses Skript erstellt Redirect-Dateien in src/components,
 * die auf die originalen Komponenten in /components verweisen.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

// Verzeichnis der originalen Komponenten
const ORIG_COMPONENT_DIR = 'components';

// Zielverzeichnis
const TARGET_COMPONENT_DIR = 'src/components';

/**
 * Generiert einen Redirect-Code für eine .jsx Komponente
 */
function generateJsxRedirect(componentName, relativePath) {
  return `'use client';

// Redirect file for backward compatibility
// This file ensures that imports from the src structure will work
import ${componentName} from '../components/${relativePath}';

export default ${componentName};
`;
}

/**
 * Generiert einen Redirect-Code für eine .tsx Komponente (mit TypeScript)
 */
function generateTsxRedirect(componentName, relativePath, originalPath) {
  let tsCode = `'use client';

// Redirect file for backward compatibility
// This file ensures that imports from the src structure will work
import ${componentName} from '../components/${relativePath}';

// Re-export the component
export default ${componentName};
`;
  
  // Versuche, Typen aus der ursprünglichen Komponente zu extrahieren
  try {
    const originalContent = fs.readFileSync(originalPath, 'utf8');
    const exportMatches = originalContent.match(/export\s+(?:interface|type)\s+(\w+)/g);
    
    if (exportMatches && exportMatches.length > 0) {
      const typeExports = exportMatches.map(m => m.replace(/export\s+/, '')).join('\n');
      tsCode += `\n// Re-export types\n${typeExports}\n`;
    }
  } catch (err) {
    // Ignoriere Fehler beim Lesen der Originalkomponente
  }
  
  return tsCode;
}

/**
 * Durchläuft Verzeichnisse rekursiv
 */
async function walkDirectory(dir, baseDir = '') {
  const result = [];
  const items = await readdir(path.join(baseDir, dir));
  
  for (const item of items) {
    const fullPath = path.join(baseDir, dir, item);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      const subItems = await walkDirectory(item, path.join(baseDir, dir));
      result.push(...subItems);
    } else if (stats.isFile() && /\.(jsx?|tsx?)$/.test(item)) {
      result.push({
        path: path.join(dir, item),
        fullPath: fullPath
      });
    }
  }
  
  return result;
}

/**
 * Erstellt ein Verzeichnis rekursiv
 */
async function ensureDirectoryExists(dirPath) {
  const dirs = dirPath.split(path.sep);
  let currentPath = '';
  
  for (const dir of dirs) {
    currentPath = path.join(currentPath, dir);
    if (!(await exists(currentPath))) {
      await mkdir(currentPath);
    }
  }
}

/**
 * Erstellt eine Redirect-Datei
 */
async function createRedirectFile(componentInfo) {
  try {
    const { path: componentPath, fullPath } = componentInfo;
    
    // Bestimme Zielverzeichnis und -datei
    const targetDir = path.dirname(path.join(TARGET_COMPONENT_DIR, componentPath));
    await ensureDirectoryExists(targetDir);
    
    // Bestimme Zieldateiname und Komponentenname
    const fileName = path.basename(componentPath);
    const componentName = path.basename(fileName, path.extname(fileName));
    
    // Relativer Pfad zur Originalkomponente für den Import
    const relativePath = componentPath.replace(/\.(jsx?|tsx?)$/, '');
    
    // Generiere den Code basierend auf der Dateierweiterung
    const targetExtension = path.extname(fileName) === '.jsx' ? '.tsx' : path.extname(fileName);
    const targetFile = path.join(targetDir, componentName + targetExtension);
    
    // Prüfe, ob die Zieldatei bereits existiert und keine Redirect-Datei ist
    if (await exists(targetFile)) {
      const content = await readFile(targetFile, 'utf8');
      if (!content.includes('// Redirect file for backward compatibility')) {
        console.log(`⚠️ ${targetFile} already exists and is not a redirect file. Skipping.`);
        return false;
      }
    }
    
    // Generiere den Code und schreibe die Datei
    const redirectCode = targetExtension === '.tsx' 
      ? generateTsxRedirect(componentName, relativePath, fullPath)
      : generateJsxRedirect(componentName, relativePath);
    
    await writeFile(targetFile, redirectCode, 'utf8');
    console.log(`✅ Created redirect: ${targetFile} -> ${fullPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating redirect for ${componentInfo.path}:`, error.message);
    return false;
  }
}

/**
 * Hauptfunktion
 */
async function main() {
  try {
    console.log('🔍 Scanning original components directory...');
    
    // Finde alle originalen Komponenten
    const components = await walkDirectory('', ORIG_COMPONENT_DIR);
    console.log(`Found ${components.length} components to redirect`);
    
    // Erstelle für jede Komponente eine Redirect-Datei
    const results = await Promise.all(components.map(createRedirectFile));
    const createdCount = results.filter(Boolean).length;
    
    console.log(`\n✨ Done! Created ${createdCount} redirects out of ${components.length} components.`);
  } catch (error) {
    console.error('Error executing script:', error);
    process.exit(1);
  }
}

// Führe das Skript aus
main();
