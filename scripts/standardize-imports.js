/**
 * This script standardizes import paths across the codebase to use the defined aliases.
 * It will:
 * 1. Convert all @/* imports to @/*
 * 2. Convert relative imports to use aliases where appropriate
 * 3. Generate a report of all converted files
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Patterns to replace
const PATH_PATTERNS = [
  // Convert @/* to @/*
  { from: /@\/src\/(.*)/g, to: '@/$1' },
  
  // Add more patterns for specific directories
  { from: /@\/src\/app\/(.*)/g, to: '@app/$1' },
  { from: /@\/src\/components\/(.*)/g, to: '@components/$1' },
  { from: /@\/src\/lib\/(.*)/g, to: '@lib/$1' },
  { from: /@\/src\/hooks\/(.*)/g, to: '@hooks/$1' },
  { from: /@\/src\/types\/(.*)/g, to: '@types/$1' },
];

// File patterns to include
const INCLUDE_PATTERNS = [
  '\.js$',
  '\.jsx$',
  '\.ts$',
  '\.tsx$',
];

// Directories and files to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '\.git',
  '\.next',
  '\.vscode',
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
 * Process a file by replacing import paths with the standardized versions
 */
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    let changes = 0;
    
    for (const pattern of PATH_PATTERNS) {
      const matches = newContent.match(pattern.from);
      if (matches) {
        changes += matches.length;
        newContent = newContent.replace(pattern.from, pattern.to);
      }
    }
    
    if (changes > 0) {
      await writeFile(filePath, newContent, 'utf8');
      return { file: filePath, changes };
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
async function standardizeImports() {
  console.log('Starting import path standardization...');
  
  try {
    const startTime = Date.now();
    const files = Array.from(walkDirectory('.'));
    console.log(`Found ${files.length} files to process`);
    
    const results = await Promise.all(files.map(processFile));
    const changedFiles = results.filter(Boolean);
    
    console.log('\nStandardization complete!');
    console.log(`Processed ${files.length} files in ${(Date.now() - startTime) / 1000}s`);
    console.log(`Modified ${changedFiles.length} files with ${changedFiles.reduce((sum, f) => sum + f.changes, 0)} import path changes`);
    
    if (changedFiles.length > 0) {
      console.log('\nFiles modified:');
      changedFiles.forEach(({ file, changes }) => {
        console.log(`  ${file} (${changes} changes)`);
      });
    }
  } catch (error) {
    console.error('Error standardizing imports:', error);
  }
}

// Run the script
standardizeImports();
