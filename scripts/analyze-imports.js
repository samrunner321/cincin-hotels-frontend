#!/usr/bin/env node

/**
 * Import Analysis Script
 * 
 * This script analyzes specific files with import errors,
 * identifies missing dependencies, and suggests fixes.
 * 
 * Usage:
 *   node analyze-imports.js --file=path/to/problematic/file.js
 *   node analyze-imports.js --error="Module not found: Can't resolve './AssetManager'"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const exists = promisify(fs.exists);

// Project root directory
const ROOT_DIR = path.resolve(__dirname, '..');

// Files to analyze if not specified
const DEFAULT_PROBLEM_FILES = [
  path.join(ROOT_DIR, 'app/categories/[slug]/page.js'),
  path.join(ROOT_DIR, 'app/contact/page.js'),
  path.join(ROOT_DIR, 'src/components/common/AssetPreloader.tsx')
];

// Map of common module names and their possible alternative locations
const MODULE_ALTERNATIVES = {
  './AssetManager': [
    '../common/AssetPreloader', 
    '../common/AssetManager',
    './AssetPreloader',
    '../../components/common/AssetManager'
  ],
  '../../components/common/PageHero': [
    '../../src/components/common/PageHero',
    '../src/components/ui/Hero',
    '../src/components/common/PageHero'
  ],
  '../../components/common/ContentBlock': [
    '../../src/components/common/ContentBlock',
    '../src/components/ui/ContentBlock',
    '../src/components/ui/BaseSection'
  ],
  '../../../components/hotels/HotelList': [
    '../../../src/components/hotels/HotelList',
    '../../../src/components/hotels/HotelGrid'
  ],
  '../../../components/hotels/CategoryBar': [
    '../../../src/components/hotels/CategoryButton',
    '../../../src/components/ui/buttons/CategoryButton'
  ]
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  file: args.find(arg => arg.startsWith('--file='))?.split('=')[1],
  error: args.find(arg => arg.startsWith('--error='))?.split('=')[1],
  fix: args.includes('--fix'),
  verbose: args.includes('--verbose'),
  help: args.includes('--help')
};

if (options.help) {
  console.log(`
  Import Analysis Script

  Analyzes files with import errors, suggests and optionally fixes them.

  Usage:
    node analyze-imports.js [options]

  Options:
    --file=path/to/file   Analyze a specific file
    --error="error msg"   Search for files with a specific error
    --fix                 Attempt to automatically fix import errors
    --verbose             Show more detailed output
    --help                Show this help message
  
  Examples:
    node analyze-imports.js
    node analyze-imports.js --file=app/contact/page.js
    node analyze-imports.js --error="Can't resolve './AssetManager'"
    node analyze-imports.js --file=app/contact/page.js --fix
  `);
  process.exit(0);
}

/**
 * Find instances of import statements in a file
 */
async function analyzeImports(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Find all import statements
    const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+[^\s,]+|[\w\d_$]+)?\s*(?:,\s*(?:{[^}]*}|[\w\d_$]+))?\s*from\s+['"]([^'"]+)['"]/g;
    
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        statement: match[0],
        path: match[1],
        position: match.index
      });
    }
    
    // Also find dynamic imports
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      imports.push({
        statement: match[0],
        path: match[1],
        isDynamic: true,
        position: match.index
      });
    }
    
    return imports;
  } catch (error) {
    console.error(`Error analyzing imports in ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Check if an import path exists relative to a file
 */
async function checkImportExists(importPath, importingFile) {
  if (importPath.startsWith('@') || importPath.startsWith('next/') || importPath.startsWith('react')) {
    // Skip checking aliased imports, Next.js imports, and React
    return true;
  }
  
  try {
    const basePath = path.dirname(importingFile);
    const absolutePath = path.resolve(basePath, importPath);
    
    // Handle directory imports (e.g., import from './components')
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
    
    // Check if the import is an exact file
    if (await exists(absolutePath)) {
      return true;
    }
    
    // Check with various extensions
    for (const ext of extensions) {
      if (await exists(absolutePath + ext)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking import ${importPath}:`, error.message);
    return false;
  }
}

/**
 * Suggest alternative import paths for a missing module
 */
async function suggestAlternatives(importPath, importingFile) {
  // Check predefined alternatives
  const predefinedAlts = MODULE_ALTERNATIVES[importPath];
  
  if (predefinedAlts) {
    // Check if any predefined alternative exists
    const validAlts = [];
    
    for (const alt of predefinedAlts) {
      if (await checkImportExists(alt, importingFile)) {
        validAlts.push(alt);
      }
    }
    
    if (validAlts.length > 0) {
      return validAlts;
    }
  }
  
  // If no predefined alternatives were found, try to find similar modules
  const filename = path.basename(importPath);
  const results = [];
  
  try {
    // Search for similar files in the src directory
    const cmd = `find ${ROOT_DIR}/src -type f -name "*${filename}*" -o -name "*${filename.toLowerCase()}*"`;
    const output = execSync(cmd, { encoding: 'utf8' });
    
    if (output) {
      const files = output.trim().split('\n').filter(Boolean);
      
      for (const file of files) {
        // Calculate relative path from importing file to found file
        const basePath = path.dirname(importingFile);
        const relativePath = path.relative(basePath, file).replace(/\\/g, '/');
        
        // Ensure path starts with ./ or ../
        results.push(relativePath.startsWith('.') ? relativePath : './' + relativePath);
      }
    }
  } catch (error) {
    if (options.verbose) {
      console.error('Error searching for alternatives:', error.message);
    }
  }
  
  return results;
}

/**
 * Fix a broken import in a file
 */
async function fixImport(filePath, brokenImport, alternativeImport) {
  try {
    let content = await readFile(filePath, 'utf8');
    
    if (brokenImport.isDynamic) {
      // Fix dynamic import
      const newImport = `import('${alternativeImport}')`;
      content = content.replace(
        new RegExp(`import\\s*\\(\\s*['"]${brokenImport.path}['"]\\s*\\)`, 'g'),
        newImport
      );
    } else {
      // Fix static import
      const newImport = brokenImport.statement.replace(
        new RegExp(`from\\s+['"]${brokenImport.path}['"]`),
        `from '${alternativeImport}'`
      );
      content = content.replace(brokenImport.statement, newImport);
    }
    
    await writeFile(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error fixing import in ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Fix missing imports in a specific directory 
 */
async function fixDirectoryImports(dir, targetFilename) {
  try {
    const files = await readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.promises.stat(filePath);
      
      if (stats.isDirectory()) {
        // Recursively search subdirectories
        await fixDirectoryImports(filePath, targetFilename);
      } else if (file.includes(targetFilename) && file.match(/\.(js|jsx|ts|tsx)$/)) {
        // We found a potential match, fix imports in files that might be using it
        if (options.verbose) {
          console.log(`Found potential match: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

/**
 * Main function to analyze and fix import problems
 */
async function main() {
  console.log('🔍 Analyzing problematic imports...\n');
  
  // Determine which files to analyze
  let filesToAnalyze = [];
  
  if (options.file) {
    // Analyze a single file
    const filePath = path.isAbsolute(options.file) 
      ? options.file 
      : path.resolve(ROOT_DIR, options.file);
      
    filesToAnalyze.push(filePath);
  } else if (options.error) {
    // Find files with a specific error
    try {
      const cmd = `grep -r "${options.error}" ${ROOT_DIR} --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"`;
      const output = execSync(cmd, { encoding: 'utf8' });
      
      if (output) {
        // Extract filenames from grep output
        const fileMatches = output.match(/(.+?):\d+/g);
        if (fileMatches) {
          filesToAnalyze = [...new Set(fileMatches.map(match => match.split(':')[0]))];
        }
      }
    } catch (error) {
      if (!error.message.includes('No such file or directory') && !error.message.includes('exitCode: 1')) {
        console.error('Error searching for files:', error.message);
      }
      console.log('No files found with the specified error. Using default problem files.');
      filesToAnalyze = DEFAULT_PROBLEM_FILES;
    }
  } else {
    // Use default problem files
    filesToAnalyze = DEFAULT_PROBLEM_FILES;
  }
  
  if (filesToAnalyze.length === 0) {
    console.log('No files to analyze. Exiting.');
    return;
  }
  
  console.log(`Analyzing ${filesToAnalyze.length} files for import issues...\n`);
  
  let fixedCount = 0;
  const problemSummary = [];
  
  // Analyze each file
  for (const filePath of filesToAnalyze) {
    console.log(`📄 Analyzing ${path.relative(ROOT_DIR, filePath)}`);
    
    // Skip if file doesn't exist
    if (!await exists(filePath)) {
      console.log(`  ❌ File does not exist`);
      continue;
    }
    
    // Get all imports in the file
    const imports = await analyzeImports(filePath);
    console.log(`  Found ${imports.length} imports`);
    
    // Check each import
    const brokenImports = [];
    
    for (const imp of imports) {
      const importExists = await checkImportExists(imp.path, filePath);
      
      if (!importExists) {
        brokenImports.push(imp);
        
        if (options.verbose) {
          console.log(`  ❌ Broken import: ${imp.statement}`);
        }
      }
    }
    
    if (brokenImports.length === 0) {
      console.log('  ✅ All imports valid');
      continue;
    }
    
    console.log(`  ❌ Found ${brokenImports.length} broken imports`);
    let fileFixed = false;
    
    // Suggest alternatives for each broken import
    for (const brokenImport of brokenImports) {
      console.log(`\n  🔍 Analyzing broken import: ${brokenImport.path}`);
      const alternatives = await suggestAlternatives(brokenImport.path, filePath);
      
      if (alternatives.length > 0) {
        console.log('  ✨ Found alternatives:');
        alternatives.forEach((alt, idx) => {
          console.log(`     ${idx + 1}. ${alt}`);
        });
        
        if (options.fix) {
          // Automatically fix the import using the first alternative
          const fixed = await fixImport(filePath, brokenImport, alternatives[0]);
          
          if (fixed) {
            console.log(`  ✅ Fixed import: ${brokenImport.path} → ${alternatives[0]}`);
            fileFixed = true;
          } else {
            console.log(`  ❌ Failed to fix import: ${brokenImport.path}`);
          }
        }
      } else {
        console.log('  ❌ No alternatives found');
      }
      
      problemSummary.push({
        file: path.relative(ROOT_DIR, filePath),
        import: brokenImport.path,
        alternatives
      });
    }
    
    if (fileFixed) {
      fixedCount++;
    }
    
    console.log('');
  }
  
  // Generate summary report
  console.log('\n📊 Import Analysis Summary:');
  console.log(`Total files analyzed: ${filesToAnalyze.length}`);
  console.log(`Files with import problems: ${problemSummary.length > 0 ? problemSummary.reduce((acc, curr) => {
    if (!acc.includes(curr.file)) acc.push(curr.file);
    return acc;
  }, []).length : 0}`);
  console.log(`Total broken imports: ${problemSummary.length}`);
  
  if (options.fix) {
    console.log(`Fixed imports: ${fixedCount}`);
  }
  
  if (problemSummary.length > 0) {
    // Write a detailed report
    const reportPath = path.join(ROOT_DIR, 'IMPORT_ANALYSIS_REPORT.md');
    let report = `# Import Analysis Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- Total files analyzed: ${filesToAnalyze.length}\n`;
    report += `- Files with import problems: ${problemSummary.reduce((acc, curr) => {
      if (!acc.includes(curr.file)) acc.push(curr.file);
      return acc;
    }, []).length}\n`;
    report += `- Total broken imports: ${problemSummary.length}\n`;
    
    if (options.fix) {
      report += `- Fixed imports: ${fixedCount}\n`;
    }
    
    report += `\n## Details\n\n`;
    
    // Group by file
    const fileGroups = {};
    problemSummary.forEach(problem => {
      if (!fileGroups[problem.file]) {
        fileGroups[problem.file] = [];
      }
      fileGroups[problem.file].push(problem);
    });
    
    for (const [file, problems] of Object.entries(fileGroups)) {
      report += `### ${file}\n\n`;
      
      problems.forEach(problem => {
        report += `- Import: \`${problem.import}\`\n`;
        
        if (problem.alternatives.length > 0) {
          report += `  - Alternatives:\n`;
          problem.alternatives.forEach(alt => {
            report += `    - \`${alt}\`\n`;
          });
        } else {
          report += `  - No alternatives found\n`;
        }
        
        report += `\n`;
      });
    }
    
    // Add recommendation section
    report += `## Recommendations\n\n`;
    report += `1. Update imports to use the suggested alternatives\n`;
    report += `2. For imports with no alternatives, consider:\n`;
    report += `   - Creating the missing modules\n`;
    report += `   - Updating the component to use different dependencies\n`;
    report += `   - Creating stub/adapter modules to maintain backward compatibility\n`;
    report += `3. After fixing, run a full build test\n`;
    
    // Write the report
    await writeFile(reportPath, report, 'utf8');
    console.log(`\n📝 Detailed report written to: ${path.relative(ROOT_DIR, reportPath)}`);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});