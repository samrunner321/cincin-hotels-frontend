/**
 * Batch script to fix alias imports in multiple files or directories
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const targetPath = process.argv[2]; // Get target path from command line args
const fixScriptPath = path.join(__dirname, 'fix-alias-imports.js');

/**
 * Fix imports in a single file
 */
function fixFile(filePath) {
  try {
    const output = execSync(`node ${fixScriptPath} "${filePath}"`, { encoding: 'utf8' });
    process.stdout.write(output);
    return true;
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Recursively fix imports in a directory
 */
function fixDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath);
    let fixedCount = 0;
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      const stat = fs.statSync(entryPath);
      
      if (stat.isDirectory()) {
        fixedCount += fixDirectory(entryPath);
      } else if (stat.isFile() && fileExtensions.includes(path.extname(entryPath))) {
        const fixed = fixFile(entryPath);
        if (fixed) fixedCount++;
      }
    }
    
    return fixedCount;
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
    return 0;
  }
}

// Main execution
if (!targetPath) {
  console.error('Please provide a target path (file or directory)');
  console.log('Usage: node batch-fix-imports.js <target-path>');
  process.exit(1);
}

const resolvedTargetPath = path.resolve(rootDir, targetPath);

if (!fs.existsSync(resolvedTargetPath)) {
  console.error(`Target not found: ${resolvedTargetPath}`);
  process.exit(1);
}

console.log(`Starting batch fix of alias imports in ${targetPath}...`);

const stats = fs.statSync(resolvedTargetPath);
let fixedCount = 0;

if (stats.isDirectory()) {
  fixedCount = fixDirectory(resolvedTargetPath);
  console.log(`\nCompleted batch fix: ${fixedCount} files modified in ${targetPath}`);
} else if (stats.isFile()) {
  const fixed = fixFile(resolvedTargetPath);
  fixedCount = fixed ? 1 : 0;
  console.log(`\nCompleted batch fix: ${fixedCount} files modified`);
} else {
  console.error(`Target is neither a file nor a directory: ${resolvedTargetPath}`);
  process.exit(1);
}