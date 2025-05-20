/**
 * This script helps consolidate the dual app structure by:
 * 1. Creating redirect files in /app that point to /src/app
 * 2. Identifying files that need to be migrated from /app to /src/app
 */

const fs = require('fs');
const path = require('path');

// Files that should be kept in the old app directory for compatibility
const KEEP_FILES = ['page.js', 'layout.js', 'globals.css', 'index.js'];

// Create a redirect file
function createRedirectFile(filePath, targetPath) {
  const content = `// This file redirects to the consolidated structure in src/app
export { default, metadata } from '${targetPath}';
`;
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created redirect: ${filePath} -> ${targetPath}`);
}

// Check if a given file should be migrated
function shouldMigrate(filePath) {
  const baseName = path.basename(filePath);
  return !KEEP_FILES.includes(baseName) && !filePath.includes('/_components') && !filePath.includes('/api/');
}

// Main function to consolidate app structure
async function consolidateAppStructure() {
  console.log('Starting app structure consolidation...');
  
  try {
    // Check if both app directories exist
    if (!fs.existsSync('./app') || !fs.existsSync('./src/app')) {
      console.error('Error: Both ./app and ./src/app directories must exist.');
      return;
    }
    
    // TODO: Implement the actual migration logic
    console.log('App structure consolidation plan created (implementation pending)');
    console.log('To complete the migration:');
    console.log('1. Move all essential custom components from /app to /src/app');
    console.log('2. Update import paths in all components');
    console.log('3. Remove the old /app directory when ready');
  } catch (error) {
    console.error('Error during consolidation:', error);
  }
}

// Run the function
consolidateAppStructure();
