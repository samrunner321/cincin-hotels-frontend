/**
 * Enhanced import path standardization tool
 * 
 * This script standardizes import paths across the codebase to use the defined aliases.
 * It builds upon the previous standardize-imports.js script with added functionality:
 * 
 * 1. Converts all @/* imports to @/*
 * 2. Converts deep relative imports to use appropriate aliases
 * 3. Fixes cross-directory imports to use proper path aliases based on import standards
 * 4. Generates a detailed report of all converted files
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Root paths for the project
const PROJECT_ROOT = path.resolve('.');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const APP_DIR = path.join(PROJECT_ROOT, 'app');

// Patterns to replace basic alias imports
const ALIAS_PATTERNS = [
  // Convert @/* to @/*
  { from: /@\/src\/(.*)/g, to: '@/$1' },
  
  // Convert specific directory imports to use appropriate aliases
  { from: /@\/src\/app\/(.*)/g, to: '@app/$1' },
  { from: /@\/src\/components\/(.*)/g, to: '@components/$1' },
  { from: /@\/src\/lib\/(.*)/g, to: '@lib/$1' },
  { from: /@\/src\/hooks\/(.*)/g, to: '@hooks/$1' },
  { from: /@\/src\/types\/(.*)/g, to: '@types/$1' },
  
  // Also fix patterns with the correct @ but incorrect paths
  { from: /@\/components\/(.*)/g, to: '@components/$1' },
  { from: /@\/lib\/(.*)/g, to: '@lib/$1' },
  { from: /@\/hooks\/(.*)/g, to: '@hooks/$1' },
  { from: /@\/types\/(.*)/g, to: '@types/$1' },
];

// File patterns to include
const INCLUDE_PATTERNS = [
  '\\.js$',
  '\\.jsx$',
  '\\.ts$',
  '\\.tsx$',
];

// Directories and files to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '\\.git',
  '\\.next',
  '\\.vscode',
  'out',
  'build',
  'dist',
];

// Compile all patterns into RegExp objects
const includeRegex = new RegExp(INCLUDE_PATTERNS.join('|'));
const excludeRegex = new RegExp(EXCLUDE_PATTERNS.join('|'));

/**
 * Check if a file should be processed based on the include and exclude patterns
 */
function shouldProcessFile(filePath) {
  return includeRegex.test(filePath) && !excludeRegex.test(filePath);
}

/**
 * Walk through a directory and collect all files that match the criteria
 */
function* walkDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory() && !excludeRegex.test(file.name)) {
      yield* walkDirectory(filePath);
    } else if (file.isFile() && shouldProcessFile(file.name)) {
      yield filePath;
    }
  }
}

/**
 * Determine the appropriate path alias for a given import
 */
function getPathAlias(importPath, filePath) {
  // For ClientProvider.jsx in app/_components directory
  if (filePath.includes('app/_components/ClientProvider.jsx')) {
    // Handle src/components directory
    if (importPath.includes('components/')) {
      return '@components/' + importPath.split('components/')[1];
    }
    // Handle src/lib directory
    else if (importPath.includes('lib/')) {
      return '@lib/' + importPath.split('lib/')[1];
    }
    // Handle other src directories
    else if (importPath.includes('hooks/')) {
      return '@hooks/' + importPath.split('hooks/')[1];
    }
    else if (importPath.includes('types/')) {
      return '@types/' + importPath.split('types/')[1];
    }
    else if (importPath.includes('app/')) {
      return '@app/' + importPath.split('app/')[1];
    }
    else if (importPath.startsWith('src/')) {
      return '@/' + importPath.substring(4);
    }
  }
  
  // Standard directory checks for other files
  if (importPath.includes('/src/components/')) {
    return importPath.replace(/.*\/src\/components\/(.*)/, '@components/$1');
  } else if (importPath.includes('/src/lib/')) {
    return importPath.replace(/.*\/src\/lib\/(.*)/, '@lib/$1');
  } else if (importPath.includes('/src/hooks/')) {
    return importPath.replace(/.*\/src\/hooks\/(.*)/, '@hooks/$1');
  } else if (importPath.includes('/src/types/')) {
    return importPath.replace(/.*\/src\/types\/(.*)/, '@types/$1');
  } else if (importPath.includes('/src/app/')) {
    return importPath.replace(/.*\/src\/app\/(.*)/, '@app/$1');
  } else if (importPath.includes('/src/')) {
    return importPath.replace(/.*\/src\/(.*)/, '@/$1');
  } else if (importPath.includes('/public/')) {
    return importPath.replace(/.*\/public\/(.*)/, '@public/$1');
  }
  
  return importPath;
}

/**
 * Process a file's imports to fix relative paths that cross directory boundaries
 */
function processRelativePaths(content, filePath) {
  // Regular expression to find relative imports
  const relativeImportRegex = /from\s+['"](\.{2,}\/[^'"]+)['"]/g;
  const relativeDynamicImportRegex = /import\s*\(\s*['"](\.{2,}\/[^'"]+)['"]\s*\)/g;
  
  // Additional patterns for specific project cases
  const specificRelativeImportRegex = /from\s+['"]((?:\.\.\/)+src\/[^'"]+)['"]/g;
  const appComponentsRegex = /from\s+['"](\.\.\/(\.\.\/)?src\/([^'"]+))['"]/g;
  
  // Track changes
  let newContent = content;
  let relativePathChanges = 0;
  
  // Get the directory of the current file
  const fileDir = path.dirname(filePath);
  
  // Helper function to process a match
  function processMatch(match, captureGroup) {
    // If it has more than two parent references, it's a candidate for alias
    const parentDirCount = (captureGroup.match(/\.\.\//g) || []).length;
    
    if (parentDirCount > 1 || captureGroup.includes('../src/')) {
      // Resolve the absolute path of the import
      const absoluteImportPath = path.resolve(fileDir, captureGroup);
      const relativeToProject = path.relative(PROJECT_ROOT, absoluteImportPath);
      
      // Get the appropriate alias
      const aliasPath = getPathAlias(relativeToProject, filePath);
      
      // Only replace if we actually created an alias
      if (aliasPath !== relativeToProject && aliasPath.startsWith('@')) {
        relativePathChanges++;
        return match.replace(captureGroup, aliasPath);
      }
    }
    
    return match;
  }
  
  // Replace standard imports
  newContent = newContent.replace(relativeImportRegex, (match, importPath) => {
    return processMatch(match, importPath);
  });
  
  // Replace dynamic imports
  newContent = newContent.replace(relativeDynamicImportRegex, (match, importPath) => {
    return processMatch(match, importPath);
  });
  
  // Handle specific case for imports from "../src/..."
  newContent = newContent.replace(specificRelativeImportRegex, (match, importPath) => {
    return processMatch(match, importPath);
  });
  
  // Handle app/_components specific case
  newContent = newContent.replace(appComponentsRegex, (match, fullPath, middlePath, componentPath) => {
    // Try to convert the path to a proper alias
    let srcPath = "src/" + componentPath;
    const aliasPath = getPathAlias(srcPath, filePath);
    
    if (aliasPath !== srcPath && aliasPath.startsWith('@')) {
      relativePathChanges++;
      return match.replace(fullPath, aliasPath);
    }
    
    return match;
  });
  
  return { newContent, relativePathChanges };
}

/**
 * Process a file by replacing import paths with the standardized versions
 */
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    let changes = {
      alias: 0,
      relative: 0
    };
    
    // First pass: Fix alias patterns
    for (const pattern of ALIAS_PATTERNS) {
      const matches = newContent.match(pattern.from);
      if (matches) {
        changes.alias += matches.length;
        newContent = newContent.replace(pattern.from, pattern.to);
      }
    }
    
    // Second pass: Fix deep relative imports
    const { newContent: finalContent, relativePathChanges } = processRelativePaths(newContent, filePath);
    changes.relative = relativePathChanges;
    
    const totalChanges = changes.alias + changes.relative;
    
    if (totalChanges > 0) {
      await writeFile(filePath, finalContent, 'utf8');
      return { 
        file: filePath, 
        changes: totalChanges,
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
async function updateImportPaths() {
  console.log('Starting enhanced import path standardization...');
  
  try {
    const startTime = Date.now();
    
    // Check if a specific file was provided as a command-line argument
    const targetFile = process.argv[2];
    let files;
    
    if (targetFile) {
      console.log(`Processing specific file: ${targetFile}`);
      files = [targetFile];
    } else {
      files = Array.from(walkDirectory('.'));
      console.log(`Found ${files.length} files to process`);
    }
    
    const results = await Promise.all(files.map(processFile));
    const changedFiles = results.filter(Boolean);
    
    // Count the different types of changes
    const aliasChanges = changedFiles.reduce((sum, f) => sum + f.details.alias, 0);
    const relativeChanges = changedFiles.reduce((sum, f) => sum + f.details.relative, 0);
    
    console.log('\nImport path standardization complete!');
    console.log(`Processed ${files.length} files in ${(Date.now() - startTime) / 1000}s`);
    console.log(`Modified ${changedFiles.length} files with ${changedFiles.reduce((sum, f) => sum + f.changes, 0)} import path changes`);
    console.log(`- ${aliasChanges} alias path corrections`);
    console.log(`- ${relativeChanges} deep relative path conversions`);
    
    if (changedFiles.length > 0) {
      console.log('\nFiles modified:');
      changedFiles.forEach(({ file, changes, details }) => {
        console.log(`  ${file} (${changes} changes: ${details.alias} alias, ${details.relative} relative)`);
      });
    } else {
      console.log('\nNo files were modified.');
    }
  } catch (error) {
    console.error('Error standardizing imports:', error);
  }
}

// Add simple debug flag for troubleshooting
async function debug() {
  if (process.argv.includes('--debug')) {
    const debugFile = process.argv[process.argv.indexOf('--debug') + 1];
    const filePath = debugFile || '/Users/samuelrenner/cincinhotels/app/_components/ClientProvider.jsx';
    
    try {
      const content = await readFile(filePath, 'utf8');
      console.log('Debug mode: Analyzing file', filePath);
      
      // Test the file processing directly
      const { newContent, relativePathChanges } = processRelativePaths(content, filePath);
      
      if (content !== newContent) {
        console.log('Changes detected! Here are the differences:');
        console.log('=== BEFORE ===');
        console.log(content);
        console.log('=== AFTER ===');
        console.log(newContent);
        console.log(`Total relative path changes: ${relativePathChanges}`);
        
        // Actually update the file if requested
        if (process.argv.includes('--apply')) {
          await writeFile(filePath, newContent, 'utf8');
          console.log('Applied changes to file.');
        }
      } else {
        console.log('No changes detected in the file.');
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

// Run the script
debug().then(() => {
  // Skip normal processing if we're in debug mode without --continue
  if (!process.argv.includes('--debug') || process.argv.includes('--continue')) {
    updateImportPaths();
  }
});