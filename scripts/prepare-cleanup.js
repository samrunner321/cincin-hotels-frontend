/**
 * Script to check if the project is ready for cleanup
 * This validates that no imports are referencing the old directories before removal
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const oldDirectories = [
  '/components/',  // Old components directory
  '/lib/'          // Old lib directory
];

/**
 * Check if any files still import from old directories
 */
function checkForLegacyImports() {
  console.log('Checking for imports from old directories...');
  
  const results = {
    safe: true,
    problematicFiles: {}
  };
  
  try {
    // Use ripgrep for fast searching
    for (const oldDir of oldDirectories) {
      console.log(`Checking imports from ${oldDir}...`);
      
      try {
        // Look for import statements referencing the old directory
        const grepCommand = `rg -l "from ['\\\"]\\.\\.?${oldDir.replace('/', '\\/')}" ${srcDir}`;
        const output = execSync(grepCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        
        if (output) {
          const files = output.split('\n').filter(Boolean);
          results.safe = false;
          
          for (const file of files) {
            if (!results.problematicFiles[oldDir]) {
              results.problematicFiles[oldDir] = [];
            }
            results.problematicFiles[oldDir].push(file);
          }
        }
      } catch (error) {
        // Non-zero exit code from grep means no matches, which is good
        if (error.status !== 1) {
          console.error(`Error searching for imports from ${oldDir}:`, error.message);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error checking for legacy imports:', error.message);
    results.safe = false;
    return results;
  }
}

/**
 * Generate a cleanup report
 */
function generateCleanupReport(results) {
  const reportPath = path.join(rootDir, 'CLEANUP_REPORT.md');
  let report = `# Project Cleanup Report\n\n`;
  
  if (results.safe) {
    report += `## ✅ Ready for Cleanup\n\n`;
    report += `No imports from old directories were found. It should be safe to proceed with cleanup.\n\n`;
  } else {
    report += `## ⚠️ Cleanup Blocked\n\n`;
    report += `The following files still import from old directories that need to be migrated first:\n\n`;
    
    for (const oldDir in results.problematicFiles) {
      report += `### Imports from \`${oldDir}\`\n\n`;
      
      for (const file of results.problematicFiles[oldDir]) {
        const relativePath = path.relative(rootDir, file);
        report += `- ${relativePath}\n`;
      }
      
      report += '\n';
    }
  }
  
  // Add cleanup instructions
  report += `## Cleanup Instructions\n\n`;
  report += `Once all imports have been migrated, you can proceed with these cleanup steps:\n\n`;
  report += `1. Remove old directories:\n`;
  
  for (const oldDir of oldDirectories) {
    report += `   - \`rm -rf ${oldDir.replace(/^\/|\/$/g, '')}\`\n`;
  }
  
  report += `\n2. Remove unused assets:\n`;
  report += `   - Run \`node scripts/find-unused-assets.js\` to identify unused assets\n`;
  report += `   - Review and remove unused assets\n\n`;
  
  report += `3. Clean up empty directories:\n`;
  report += `   - Run \`find . -type d -empty -delete\` to remove empty directories\n\n`;
  
  try {
    fs.writeFileSync(reportPath, report);
    console.log(`Cleanup report generated at ${reportPath}`);
  } catch (error) {
    console.error('Error generating cleanup report:', error.message);
  }
}

// Main execution
console.log('Preparing for project cleanup...');
const results = checkForLegacyImports();
generateCleanupReport(results);

if (results.safe) {
  console.log('✅ Project is ready for cleanup phase.');
} else {
  console.log('⚠️ Found imports from old directories. See CLEANUP_REPORT.md for details.');
  process.exit(1);
}