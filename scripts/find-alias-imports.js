/**
 * Script to find all alias imports in the codebase
 * This script scans the src directory for imports starting with @
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const srcDir = path.resolve(__dirname, '../src');
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const aliasPatterns = [
  '@types/',
  '@components/',
  '@hooks/',
  '@lib/',
  '@src-lib/',
  '@src-components/',
  '@app/',
  '@src-types/',
  '@public/',
  '@/'
];

// Results storage
const problematicFiles = {};

/**
 * Check if a file contains imports with alias patterns
 */
function checkFileForAliasImports(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const problematicImports = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('export * from ') || trimmedLine.startsWith('export { ')) {
        for (const alias of aliasPatterns) {
          if (line.includes(alias)) {
            problematicImports.push({
              line: trimmedLine,
              alias
            });
            break;
          }
        }
      }
    }

    if (problematicImports.length > 0) {
      problematicFiles[filePath] = problematicImports;
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

/**
 * Recursively scan a directory for files
 */
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (stat.isFile() && fileExtensions.includes(path.extname(filePath))) {
      checkFileForAliasImports(filePath);
    }
  }
}

// Main execution
console.log('Scanning for alias imports...');
scanDirectory(srcDir);

// Sort results by number of problematic imports
const sortedFiles = Object.keys(problematicFiles).sort((a, b) => {
  return problematicFiles[b].length - problematicFiles[a].length;
});

// Generate report
console.log('\nFound', sortedFiles.length, 'files with alias imports:\n');

let report = '';
for (const filePath of sortedFiles) {
  const relativePath = path.relative(path.resolve(__dirname, '..'), filePath);
  report += `\n${relativePath} (${problematicFiles[filePath].length} alias imports):\n`;
  
  for (const importInfo of problematicFiles[filePath]) {
    report += `  - ${importInfo.line}\n`;
  }
}

// Write report to file
const reportPath = path.resolve(__dirname, '../alias-imports-report.txt');
fs.writeFileSync(reportPath, report);

console.log(report);
console.log(`\nReport saved to ${reportPath}`);

// Group files by directory for batch fixing
const filesByDirectory = {};
for (const filePath of sortedFiles) {
  const dirPath = path.dirname(filePath);
  if (!filesByDirectory[dirPath]) {
    filesByDirectory[dirPath] = [];
  }
  filesByDirectory[dirPath].push(filePath);
}

// Generate batching suggestion
console.log('\nSuggested batching for fixes:');
const directoriesInOrder = Object.keys(filesByDirectory).sort((a, b) => {
  // Sort by directory depth (deeper directories first)
  const depthA = a.split(path.sep).length;
  const depthB = b.split(path.sep).length;
  return depthB - depthA;
});

for (const dirPath of directoriesInOrder) {
  const relativeDirPath = path.relative(path.resolve(__dirname, '..'), dirPath);
  console.log(`\nBatch for ${relativeDirPath}:`);
  
  for (const filePath of filesByDirectory[dirPath]) {
    const relativeFilePath = path.relative(path.resolve(__dirname, '..'), filePath);
    console.log(`  - ${relativeFilePath}`);
  }
}