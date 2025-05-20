/**
 * Script to find unused assets in the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const assetDirs = [
  'public/images',
  'public/icons',
  'public/font',
  'public/fonts',
  'public/mock-images'
];
const srcDir = path.join(rootDir, 'src');
const fileExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ttf', '.woff', '.woff2', '.eot'];

// Results storage
const unusedAssets = [];
const usedAssets = new Set();

/**
 * Find all assets in the project
 */
function findAllAssets() {
  const allAssets = [];
  
  for (const assetDir of assetDirs) {
    const fullAssetDir = path.join(rootDir, assetDir);
    
    if (!fs.existsSync(fullAssetDir)) {
      console.log(`Asset directory not found: ${assetDir}`);
      continue;
    }
    
    const findCommand = `find ${fullAssetDir} -type f ${fileExtensions.map(ext => `-o -name "*${ext}"`).join(' ')}`;
    
    try {
      const output = execSync(findCommand, { encoding: 'utf8' }).trim();
      if (output) {
        output.split('\n').forEach(file => {
          if (file.trim()) {
            allAssets.push(file);
          }
        });
      }
    } catch (error) {
      console.error(`Error finding assets in ${assetDir}:`, error.message);
    }
  }
  
  return allAssets;
}

/**
 * Check if an asset is used in the codebase
 */
function isAssetUsed(assetPath) {
  const assetFilename = path.basename(assetPath);
  const relativeAssetPath = path.relative(rootDir, assetPath).replace(/\\/g, '/');
  
  // Try different ways the asset might be referenced
  const searchPatterns = [
    assetFilename,
    relativeAssetPath,
    relativeAssetPath.replace(/^public\//, '/')
  ];
  
  for (const pattern of searchPatterns) {
    try {
      const sanitizedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const grepCommand = `rg -l "${sanitizedPattern}" ${srcDir}`;
      const output = execSync(grepCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      
      if (output) {
        return true;
      }
    } catch (error) {
      // Non-zero exit code means no matches found
      if (error.status !== 1) {
        console.error(`Error checking if asset is used: ${assetPath}`, error.message);
      }
    }
  }
  
  return false;
}

/**
 * Find unused assets and generate a report
 */
function findUnusedAssets() {
  const allAssets = findAllAssets();
  console.log(`Found ${allAssets.length} total assets.`);
  
  console.log('Checking which assets are used in the codebase...');
  let processedCount = 0;
  
  for (const assetPath of allAssets) {
    processedCount++;
    
    // Show progress every 10 assets
    if (processedCount % 10 === 0) {
      process.stdout.write(`Processed ${processedCount}/${allAssets.length} assets...\r`);
    }
    
    if (!isAssetUsed(assetPath)) {
      unusedAssets.push(assetPath);
    } else {
      usedAssets.add(assetPath);
    }
  }
  
  console.log(`\nCompleted asset scan.`);
  console.log(`Found ${unusedAssets.length} potentially unused assets.`);
  
  // Generate report
  const reportPath = path.join(rootDir, 'UNUSED_ASSETS_REPORT.md');
  let report = `# Unused Assets Report\n\n`;
  report += `This report identifies assets that do not appear to be referenced in the codebase.\n\n`;
  report += `**Warning**: This is an approximate analysis. Some assets might be referenced dynamically or used in ways that this script cannot detect.\n\n`;
  report += `## Summary\n\n`;
  report += `- Total assets: ${allAssets.length}\n`;
  report += `- Used assets: ${usedAssets.size}\n`;
  report += `- Potentially unused assets: ${unusedAssets.length}\n\n`;
  
  if (unusedAssets.length > 0) {
    report += `## Potentially Unused Assets\n\n`;
    
    // Group by directory
    const assetsByDirectory = {};
    for (const asset of unusedAssets) {
      const dir = path.dirname(asset);
      if (!assetsByDirectory[dir]) {
        assetsByDirectory[dir] = [];
      }
      assetsByDirectory[dir].push(asset);
    }
    
    for (const dir in assetsByDirectory) {
      const relativeDir = path.relative(rootDir, dir);
      report += `### ${relativeDir}\n\n`;
      
      for (const asset of assetsByDirectory[dir]) {
        const relativeAsset = path.relative(rootDir, asset);
        report += `- ${relativeAsset}\n`;
      }
      
      report += '\n';
    }
    
    // Add cleanup script
    report += `## Cleanup Script\n\n`;
    report += `⚠️ **USE WITH CAUTION**: Always review the list before deleting files.\n\n`;
    report += `\`\`\`bash\n`;
    for (const asset of unusedAssets) {
      report += `rm "${asset}"\n`;
    }
    report += `\`\`\`\n`;
  } else {
    report += `No unused assets found.\n`;
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`Report saved to ${reportPath}`);
}

// Main execution
console.log('Scanning for unused assets...');
findUnusedAssets();