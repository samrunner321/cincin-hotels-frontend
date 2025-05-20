#!/usr/bin/env node

/**
 * Import Path Corrector Script
 * 
 * This script finds and fixes alias imports in TypeScript/JavaScript files,
 * replacing them with proper relative paths.
 * 
 * Usage:
 *   node fix-import-paths.js [options]
 * 
 * Options:
 *   --dry-run             Show changes without applying them
 *   --pattern=@components Only target imports that match the specified pattern
 *   --dir=src/components  Only scan files in the specified directory
 *   --help                Show usage information
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert callback-based fs methods to Promise-based
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

// Root directory of the project
const rootDir = path.resolve(__dirname, '..');

// Mapping of alias patterns to their actual directory paths
const aliasMapping = {
  '@components/': './components/',
  '@src-components/': './src/components/',
  '@lib/': './lib/',
  '@src-lib/': './src/lib/',
  '@hooks/': './src/hooks/',
  '@types/': './src/types/',
  '@src-types/': './src/types/',
  '@/': './src/',
  '@app/': './src/app/',
  '@public/': './public/'
};

// File extensions to process
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

// Directories to exclude
const excludeDirs = [
  'node_modules',
  '.git',
  'build',
  'dist',
  '.next',
  'out'
];

// Regex for finding imports/requires using aliases
const importRegex = /(?:import|require)\s*\(?[\s\n]*(?:[\w*{}\s,\n$]+from\s*)?['"](@[\w\/-]+[^'"]*)['"]\)?/g;

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  pattern: args.find(arg => arg.startsWith('--pattern='))?.split('=')[1] || '',
  dir: args.find(arg => arg.startsWith('--dir='))?.split('=')[1] || '',
  help: args.includes('--help')
};

// Show help and exit if requested
if (options.help) {
  console.log(`
  Import Path Corrector

  Usage:
    node fix-import-paths.js [options]

  Options:
    --dry-run             Show changes without applying them
    --pattern=@components Only target imports that match the specified pattern
    --dir=src/components  Only scan files in the specified directory
    --help                Show usage information

  Examples:
    node fix-import-paths.js --dry-run
    node fix-import-paths.js --pattern=@components
    node fix-import-paths.js --dir=src/components
  `);
  process.exit(0);
}

// Report script settings
console.log('Running import path corrector');
if (options.dryRun) console.log('Dry run mode: no changes will be made');
if (options.pattern) console.log(`Filtering for imports that start with: ${options.pattern}`);
if (options.dir) console.log(`Scanning directory: ${options.dir}`);

// Convert a relative path from one file to another
function getRelativePath(fromFilePath, toFilePath) {
  // Get the directory of the source file
  const fromDir = path.dirname(fromFilePath);
  
  // Calculate the relative path from the source directory to the target path
  let relativePath = path.relative(fromDir, toFilePath);
  
  // Ensure the path starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }
  
  // Normalize the path to use forward slashes
  return relativePath.replace(/\\/g, '/');
}

// Process a single file to fix imports
async function processFile(filePath) {
  try {
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    const originalContent = content;
    
    // Variable to track if the file was modified
    let modified = false;
    
    // Find all alias imports
    let newContent = content.replace(importRegex, (match, aliasPath) => {
      // Skip if we're filtering for a specific pattern and this doesn't match
      if (options.pattern && !aliasPath.startsWith(options.pattern)) {
        return match;
      }
      
      // Find which alias pattern matches this import
      const matchedAlias = Object.keys(aliasMapping).find(pattern => 
        aliasPath.startsWith(pattern)
      );
      
      if (!matchedAlias) {
        return match; // No matching alias pattern found
      }
      
      // Get the actual path that the alias points to
      const actualPath = aliasMapping[matchedAlias];
      
      // Replace the alias with the actual path in the import
      const importPathWithoutAlias = aliasPath.replace(matchedAlias, '');
      const fullActualPath = path.join(rootDir, actualPath.replace(/^\.\//, ''), importPathWithoutAlias);
      
      // Calculate the relative path from this file to the imported file
      const relativePath = getRelativePath(filePath, fullActualPath);
      
      // Create the new import statement
      const newImport = match.replace(aliasPath, relativePath);
      
      // Log the change
      console.log(`${filePath}:`);
      console.log(`  - ${match}`);
      console.log(`  + ${newImport}`);
      console.log();
      
      modified = true;
      return newImport;
    });
    
    // Write back to the file if content changed and not in dry run mode
    if (modified && !options.dryRun) {
      await writeFile(filePath, newContent, 'utf8');
      return true;
    }
    
    return modified;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Recursively find all files in a directory
async function findFiles(dir) {
  const files = [];
  
  async function traverse(currentDir) {
    const entries = await readdir(currentDir);
    
    for (const entry of entries) {
      if (excludeDirs.includes(entry)) continue;
      
      const entryPath = path.join(currentDir, entry);
      const stats = await stat(entryPath);
      
      if (stats.isDirectory()) {
        await traverse(entryPath);
      } else if (stats.isFile() && fileExtensions.includes(path.extname(entryPath))) {
        files.push(entryPath);
      }
    }
  }
  
  await traverse(dir);
  return files;
}

// Main function
async function main() {
  try {
    // Determine which directory to scan
    const scanDir = options.dir 
      ? path.join(rootDir, options.dir)
      : rootDir;
    
    console.log(`Scanning directory: ${scanDir}`);
    
    // Find all eligible files
    const files = await findFiles(scanDir);
    console.log(`Found ${files.length} files to process`);
    
    // Process all files
    let modifiedCount = 0;
    for (const file of files) {
      const wasModified = await processFile(file);
      if (wasModified) modifiedCount++;
    }
    
    // Report results
    if (options.dryRun) {
      console.log(`Dry run complete. ${modifiedCount} files would be modified.`);
    } else {
      console.log(`Import path correction complete. Modified ${modifiedCount} files.`);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the main function
main();