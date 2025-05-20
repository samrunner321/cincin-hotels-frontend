/**
 * Enhanced import path fixing script for CinCin Hotels project
 * 
 * This script standardizes import paths across the codebase focusing on:
 * 1. Fixing references between old and new component locations
 * 2. Standardizing import paths to use proper aliases
 * 3. Handling special cases in the codebase's dual-structure
 * 4. Converting relative paths to absolute paths with aliases where appropriate
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// Root paths for the project
const PROJECT_ROOT = path.resolve('.');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const OLD_COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');
const SRC_COMPONENTS_DIR = path.join(SRC_DIR, 'components');

// Verzeichnisse, die durchsucht werden sollen
const DIRS_TO_SCAN = ['app', 'src', 'components', 'lib'];

// Dateitypen, die bearbeitet werden sollen
const FILE_TYPES = /\.(jsx?|tsx?)$/;

// Import patterns to standardize
const IMPORT_PATTERNS = [
  // Fix component imports
  { 
    from: /from ['"]@components\/([^'"]+)['"]/g, 
    to: 'from \'@src-components/$1\'',
    condition: (filePath) => filePath.includes('/src/') && !filePath.includes('components/') 
  },
  { 
    from: /from ['"]@src-components\/([^'"]+)['"]/g, 
    to: 'from \'@components/$1\'',
    condition: (filePath) => !filePath.includes('/src/') 
  },
  
  // Fix lib imports
  { 
    from: /from ['"]@lib\/([^'"]+)['"]/g, 
    to: 'from \'@src-lib/$1\'',
    condition: (filePath) => filePath.includes('/src/') && !filePath.includes('/lib/') 
  },
  { 
    from: /from ['"]@src-lib\/([^'"]+)['"]/g, 
    to: 'from \'@lib/$1\'',
    condition: (filePath) => !filePath.includes('/src/') 
  },
  
  // Fix @/src/ imports to use proper aliases
  { from: /from ['"]@\/src\/components\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/components/${p1}'` },
  { from: /from ['"]@\/src\/lib\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/lib/${p1}'` },
  { from: /from ['"]@\/src\/hooks\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/hooks/${p1}'` },
  { from: /from ['"]@\/src\/types\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/types/${p1}'` },
  { from: /from ['"]@\/src\/app\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/app/${p1}'` },
  { from: /from ['"]@\/src\/utils\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/utils/${p1}'` },
  
  // Fix @/ imports to use more specific aliases
  { from: /from ['"]@\/components\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/components/${p1}'` },
  { from: /from ['"]@\/lib\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/lib/${p1}'` },
  { from: /from ['"]@\/hooks\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/hooks/${p1}'` },
  { from: /from ['"]@\/types\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/types/${p1}'` },
  { from: /from ['"]@\/app\/([^'"]+)['"]/g, to: (match, p1) => `from '../../src/app/${p1}'` },

  // Fix relative paths to src directory
  { 
    from: /from ['"]\.\.\/\.\.\/\.\.\/src\/([^'"]+)['"]/g, 
    to: 'from \'@/$1\'',
    condition: (filePath) => !filePath.includes('/src/') 
  },
  { 
    from: /from ['"]\.\.\/\.\.\/src\/([^'"]+)['"]/g, 
    to: 'from \'@/$1\'',
    condition: (filePath) => !filePath.includes('/src/') 
  },
  { 
    from: /from ['"]\.\.\/src\/([^'"]+)['"]/g, 
    to: 'from \'@/$1\'',
    condition: (filePath) => !filePath.includes('/src/') 
  },
];

// Special case patterns for specific files or patterns
const SPECIAL_CASES = [
  {
    // For migrated components that import from the old component structure
    pattern: /from ['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g,
    replacement: 'from \'@components/$1\'',
    condition: (filePath) => filePath.includes('/src/components/')
  },
  {
    // Fix component imports from relative paths in the src directory
    pattern: /from ['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g,
    replacement: 'from \'@components/$1\'',
    condition: (filePath) => filePath.includes('/src/')
  },
  {
    // Fix imports in the src directory that still use relative paths to other src modules
    pattern: /from ['"]\.\.\/\.\.\/\.\.\/([^'"]+)['"]/g,
    replacement: (match, p1) => {
      // Determine the appropriate alias
      if (p1.startsWith('components/')) return `from '@components/${p1.slice('components/'.length)}'`;
      if (p1.startsWith('lib/')) return `from '@lib/${p1.slice('lib/'.length)}'`;
      if (p1.startsWith('hooks/')) return `from '@hooks/${p1.slice('hooks/'.length)}'`;
      if (p1.startsWith('types/')) return `from '@types/${p1.slice('types/'.length)}'`;
      if (p1.startsWith('app/')) return `from '@app/${p1.slice('app/'.length)}'`;
      return `from '@/${p1}'`;
    },
    condition: (filePath) => filePath.includes('/src/')
  },
  {
    // Fix deep relative paths in src/components
    pattern: /from ['"]\.\.\/\.\.\/([^'"]+)['"]/g,
    replacement: (match, p1) => {
      // Determine the appropriate alias
      if (p1.startsWith('types/')) return `from '@types/${p1.slice('types/'.length)}'`;
      if (p1.startsWith('hooks/')) return `from '@hooks/${p1.slice('hooks/'.length)}'`;
      if (p1.startsWith('lib/')) return `from '@lib/${p1.slice('lib/'.length)}'`;
      if (p1.startsWith('utils/')) return `from '@/utils/${p1.slice('utils/'.length)}'`;
      return match; // Don't replace if no appropriate alias found
    },
    condition: (filePath) => filePath.includes('/src/components/')
  }
];

/**
 * Durchläuft ein Verzeichnis rekursiv und gibt alle Dateien zurück
 */
async function scanDirectory(dir) {
  try {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? scanDirectory(res) : res;
    }));
    return files.flat().filter(file => FILE_TYPES.test(file));
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
    return [];
  }
}

/**
 * Check if a file has a reference in the src directory structure
 */
async function hasSrcEquivalent(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  if (relativePath.startsWith('components/')) {
    const srcPath = path.join(SRC_DIR, relativePath);
    try {
      await stat(srcPath);
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

/**
 * Process a file by replacing import paths with the standardized versions
 */
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    const changes = {
      standard: 0,
      special: 0,
      total: 0
    };
    
    // Apply standard import patterns
    for (const pattern of IMPORT_PATTERNS) {
      if (pattern.condition && !pattern.condition(filePath)) {
        continue;
      }
      
      const matches = newContent.match(pattern.from);
      if (matches) {
        changes.standard += matches.length;
        newContent = newContent.replace(pattern.from, pattern.to);
      }
    }
    
    // Apply special case patterns for specific files or patterns
    for (const specialCase of SPECIAL_CASES) {
      if (specialCase.condition && !specialCase.condition(filePath)) {
        continue;
      }
      
      const matches = newContent.match(specialCase.pattern);
      if (matches) {
        changes.special += matches.length;
        if (typeof specialCase.replacement === 'function') {
          // For complex replacements that need context
          newContent = newContent.replace(specialCase.pattern, specialCase.replacement);
        } else {
          // For simple string replacements
          newContent = newContent.replace(specialCase.pattern, specialCase.replacement);
        }
      }
    }
    
    changes.total = changes.standard + changes.special;
    
    if (changes.total > 0) {
      await writeFile(filePath, newContent, 'utf8');
      return { 
        file: filePath, 
        changes: changes.total,
        details: changes
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

/**
 * Main function to process all files
 */
async function fixImports() {
  console.log('🔍 Starting enhanced import path fixing...');
  
  try {
    const startTime = Date.now();
    
    // Check if a specific file was provided as a command-line argument
    const targetFile = process.argv[2];
    let files;
    
    if (targetFile) {
      console.log(`Processing specific file: ${targetFile}`);
      files = [targetFile];
    } else {
      console.log(`Scanning ${DIRS_TO_SCAN.join(', ')} directories...`);
      const allFilePromises = DIRS_TO_SCAN.map(dir => scanDirectory(dir));
      files = (await Promise.all(allFilePromises)).flat();
      console.log(`Found ${files.length} files to process`);
    }
    
    const results = await Promise.all(files.map(processFile));
    const changedFiles = results.filter(Boolean);
    
    // Count the different types of changes
    const standardChanges = changedFiles.reduce((sum, f) => sum + f.details.standard, 0);
    const specialChanges = changedFiles.reduce((sum, f) => sum + f.details.special, 0);
    
    console.log('\n✨ Import path fixing complete!');
    console.log(`Processed ${files.length} files in ${(Date.now() - startTime) / 1000}s`);
    console.log(`Modified ${changedFiles.length} files with ${changedFiles.reduce((sum, f) => sum + f.changes, 0)} import path changes`);
    console.log(`- ${standardChanges} standard path corrections`);
    console.log(`- ${specialChanges} special case corrections`);
    
    if (changedFiles.length > 0) {
      console.log('\nFiles modified:');
      changedFiles.forEach(({ file, changes, details }) => {
        console.log(`  ${file} (${changes} changes: ${details.standard} standard, ${details.special} special)`);
      });
    } else {
      console.log('\nNo files were modified.');
    }
  } catch (error) {
    console.error('Error fixing imports:', error);
  }
}

// Add simple debug flag for troubleshooting
async function debug() {
  if (process.argv.includes('--debug')) {
    const debugFile = process.argv[process.argv.indexOf('--debug') + 1];
    
    try {
      const content = await readFile(debugFile, 'utf8');
      console.log('Debug mode: Analyzing file', debugFile);
      
      // Test the file processing without writing changes
      const result = await processFile(debugFile);
      
      if (result) {
        console.log('Changes detected:', result);
        
        // Re-read the file to see the changes that would be applied
        const updatedContent = await readFile(debugFile, 'utf8');
        
        if (content !== updatedContent) {
          console.log('Changes would be applied to the file:');
          console.log('=== BEFORE ===');
          console.log(content);
          console.log('=== AFTER ===');
          console.log(updatedContent);
        }
        
        // Revert the changes since we're in debug mode
        if (!process.argv.includes('--apply')) {
          await writeFile(debugFile, content, 'utf8');
          console.log('File reverted (debug mode).');
        } else {
          console.log('Applied changes to file (--apply flag set).');
        }
      } else {
        console.log('No changes would be made to this file.');
      }
    } catch (error) {
      console.error('Error in debug mode:', error);
    }
    
    // Exit early in debug mode unless --continue is specified
    if (!process.argv.includes('--continue')) {
      process.exit(0);
    }
  }
}

// Check for target directory flag
const targetDir = process.argv.includes('--target') ? 
  process.argv[process.argv.indexOf('--target') + 1] : null;

if (targetDir) {
  console.log(`Processing only files in directory: ${targetDir}`);
  DIRS_TO_SCAN.length = 0;
  DIRS_TO_SCAN.push(targetDir);
}

// Run the script
debug().then(() => {
  // Skip normal processing if we're in debug mode without --continue
  if (!process.argv.includes('--debug') || process.argv.includes('--continue')) {
    fixImports();
  }
});