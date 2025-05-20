/**
 * Script to fix alias imports in the codebase
 * This script converts alias imports to relative imports
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const fileToFix = process.argv[2]; // Get file path from command line args
const aliasMapping = {
  '@types/': 'src/types/',
  '@components/': 'components/',
  '@src-components/': 'src/components/',
  '@hooks/': 'src/hooks/',
  '@lib/': 'lib/',
  '@src-lib/': 'src/lib/',
  '@app/': 'src/app/',
  '@src-types/': 'src/types/',
  '@public/': 'public/',
  '@/': 'src/'
};

/**
 * Convert an alias path to a relative path
 */
function convertToRelativePath(filePath, importPath) {
  // Find which alias is being used
  let matchedAlias = null;
  let aliasPath = '';
  
  for (const alias in aliasMapping) {
    if (importPath.startsWith(alias)) {
      matchedAlias = alias;
      aliasPath = importPath.substring(alias.length);
      break;
    }
  }
  
  if (!matchedAlias) {
    return importPath; // No alias found, return original
  }
  
  // Calculate relative path
  const fileDir = path.dirname(filePath);
  const targetPath = path.join(rootDir, aliasMapping[matchedAlias], aliasPath);
  let relativePath = path.relative(fileDir, targetPath);
  
  // Ensure the path starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  // Replace Windows backslashes with forward slashes for imports
  relativePath = relativePath.replace(/\\/g, '/');
  
  return relativePath;
}

/**
 * Fix alias imports in a file
 */
function fixFileImports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  try {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Process import lines
      if ((line.includes('import ') || line.includes('export * from') || line.includes('export { ')) && 
          (line.includes('from \'@') || line.includes('from "@'))) {
        
        // Extract the import path
        let match;
        const singleQuoteMatch = /from\s+['"]([^'"]+)['"]/;
        const doubleQuoteMatch = /from\s+["']([^"']+)["']/;
        
        if (line.includes('\'')) {
          match = line.match(singleQuoteMatch);
          if (match && match[1].startsWith('@')) {
            const relativePath = convertToRelativePath(filePath, match[1]);
            const newLine = line.replace(singleQuoteMatch, `from '${relativePath}'`);
            lines[i] = newLine;
            modified = true;
          }
        } else if (line.includes('"')) {
          match = line.match(doubleQuoteMatch);
          if (match && match[1].startsWith('@')) {
            const relativePath = convertToRelativePath(filePath, match[1]);
            const newLine = line.replace(doubleQuoteMatch, `from "${relativePath}"`);
            lines[i] = newLine;
            modified = true;
          }
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`✅ Fixed alias imports in ${path.relative(rootDir, filePath)}`);
      return true;
    } else {
      console.log(`No alias imports to fix in ${path.relative(rootDir, filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
if (!fileToFix) {
  console.error('Please provide a file path to fix');
  console.log('Usage: node fix-alias-imports.js <file-path>');
  process.exit(1);
}

// Fix the specified file
const resolvedPath = path.resolve(rootDir, fileToFix);
fixFileImports(resolvedPath);