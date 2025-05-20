#!/usr/bin/env node
/**
 * Enhanced script to fix alias imports in the codebase
 * This script converts alias imports to relative imports with additional options
 */

const fs = require('fs');
const path = require('path');

// Check if glob and commander packages are available, install if not
try {
  require.resolve('glob');
  require.resolve('commander');
} catch (e) {
  console.log('Required packages not found. Installing...');
  require('child_process').execSync('npm install glob commander --save-dev');
  console.log('Packages installed successfully.');
}

const { glob } = require('glob');
const { program } = require('commander');

// Configuration
const rootDir = path.resolve(__dirname, '..');
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
function fixFileImports(filePath, aliasFilter = null, dryRun = false) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return { changed: false, count: 0 };
  }
  
  try {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    let modified = false;
    let changeCount = 0;
    let changes = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Process import lines and mock lines
      if (((line.includes('import ') || line.includes('export * from') || line.includes('export { ')) && 
          (line.includes('from \'@') || line.includes('from "@'))) ||
          (line.includes('mock(') && (line.includes('\'@') || line.includes('"@')))) {
        
        // Extract the import path
        let match;
        // Match both 'from "../src/path"' and 'mock("@/path",' patterns
        const singleQuoteMatch = /(?:from\s+|mock\s*\(\s*)['"]([^'"]+)['"]/;
        const doubleQuoteMatch = /(?:from\s+|mock\s*\(\s*)["']([^"']+)["']/;
        
        if (line.includes('\'')) {
          match = line.match(singleQuoteMatch);
          if (match && match[1].startsWith('@')) {
            // If we have an alias filter, check if this import matches
            if (aliasFilter && !match[1].startsWith(aliasFilter)) {
              continue;
            }
            
            const originalPath = match[1];
            const relativePath = convertToRelativePath(filePath, match[1]);
            
            // Skip if the conversion didn't change anything
            if (originalPath === relativePath) {
              continue;
            }
            
            const newLine = line.replace(match[1], relativePath);
            
            changes.push({
              line: i + 1,
              original: originalPath,
              replacement: relativePath
            });
            
            if (!dryRun) {
              lines[i] = newLine;
            }
            
            modified = true;
            changeCount++;
          }
        } else if (line.includes('"')) {
          match = line.match(doubleQuoteMatch);
          if (match && match[1].startsWith('@')) {
            // If we have an alias filter, check if this import matches
            if (aliasFilter && !match[1].startsWith(aliasFilter)) {
              continue;
            }
            
            const originalPath = match[1];
            const relativePath = convertToRelativePath(filePath, match[1]);
            
            // Skip if the conversion didn't change anything
            if (originalPath === relativePath) {
              continue;
            }
            
            const newLine = line.replace(match[1], relativePath);
            
            changes.push({
              line: i + 1,
              original: originalPath,
              replacement: relativePath
            });
            
            if (!dryRun) {
              lines[i] = newLine;
            }
            
            modified = true;
            changeCount++;
          }
        }
      }
    }
    
    // Output the changes that would be made or were made
    if (changes.length > 0) {
      console.log(`\nFile: ${path.relative(rootDir, filePath)}`);
      changes.forEach(change => {
        console.log(`  Line ${change.line}: '${change.original}' -> '${change.replacement}'`);
      });
      
      if (!dryRun) {
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log(`  ✅ ${dryRun ? 'Would fix' : 'Fixed'} ${changeCount} alias imports`);
      }
    }
    
    return { changed: modified, count: changeCount };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return { changed: false, count: 0 };
  }
}

// Configure CLI options
program
  .name('fix-alias-imports-enhanced')
  .description('Update alias imports to relative imports in JavaScript/TypeScript files')
  .option('-d, --dry-run', 'Show changes without modifying files', false)
  .option('-p, --pattern <string>', 'Only process imports matching specific alias pattern (e.g. @components)')
  .option('-e, --extensions <string>', 'File extensions to process (comma-separated)', 'js,jsx,ts,tsx')
  .option('-i, --include <glob>', 'Directory/file pattern to include', '**/*.{js,jsx,ts,tsx}')
  .option('-x, --exclude <glob>', 'Directory/file pattern to exclude', 'node_modules/**,**/node_modules/**,dist/**,build/**')
  .option('-s, --single <file>', 'Process a single file')
  .option('-l, --list-aliases', 'List all available alias mappings')
  .version('1.0.0')
  .parse(process.argv);

const options = program.opts();

// List all available alias mappings if requested
if (options.listAliases) {
  console.log('\nAvailable alias mappings:');
  Object.entries(aliasMapping).forEach(([alias, target]) => {
    console.log(`  ${alias} -> ${target}`);
  });
  console.log('\nUse --pattern option to target specific aliases');
  process.exit(0);
}

// Process a single file if specified
if (options.single) {
  const filePath = path.resolve(rootDir, options.single);
  console.log(`Processing single file: ${filePath}`);
  
  const result = fixFileImports(filePath, options.pattern, options.dryRun);
  
  if (options.dryRun && result.count > 0) {
    console.log(`\nThis was a dry run. To apply these changes, run without --dry-run flag.`);
  }
  
  process.exit(0);
}

// Prepare the file extensions to process
const extensions = options.extensions.split(',').map(ext => ext.trim());
const extensionPattern = `**/*.{${extensions.join(',')}}`;

// Use glob to find all matching files
const includePattern = options.include || extensionPattern;
const excludePatterns = options.exclude ? options.exclude.split(',') : [];

console.log(`Running in ${options.dryRun ? 'dry run' : 'write'} mode`);
if (options.pattern) {
  console.log(`Filtering for imports that start with: ${options.pattern}`);
}

// Process all matching files
(async () => {
  try {
    const files = await glob(includePattern, { ignore: excludePatterns, cwd: rootDir });
    
    console.log(`Found ${files.length} files to process`);
    
    let totalChanges = 0;
    let filesChanged = 0;

    files.forEach(relativeFilePath => {
      const filePath = path.join(rootDir, relativeFilePath);
      const result = fixFileImports(filePath, options.pattern, options.dryRun);
      
      if (result.changed) {
        filesChanged++;
        totalChanges += result.count;
      }
    });

    // Log summary
    console.log('\n===== Summary =====');
    console.log(`Files processed: ${files.length}`);
    console.log(`Files with changes: ${filesChanged}`);
    console.log(`Total import paths ${options.dryRun ? 'that would be changed' : 'changed'}: ${totalChanges}`);
    
    if (options.dryRun && totalChanges > 0) {
      console.log('\nThis was a dry run. Run without --dry-run to apply changes.');
    }
  } catch (err) {
    console.error('Error finding files:', err);
    process.exit(1);
  }
})();