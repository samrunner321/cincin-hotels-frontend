/**
 * finalize-migration.js
 * This script creates a backup of the old components directory
 * and then removes it from the project after migration is complete.
 * 
 * IMPORTANT: Only run this script after all imports have been fixed
 * and the application builds successfully.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');
const BACKUP_DIR = path.join(ROOT_DIR, 'components-backup-' + new Date().toISOString().replace(/:/g, '-'));

// Utility functions
function log(message) {
  console.log(`[Finalize Migration] ${message}`);
}

function error(message) {
  console.error(`[Finalize Migration ERROR] ${message}`);
  process.exit(1);
}

function createBackup() {
  log('Creating backup of components directory...');
  if (!fs.existsSync(COMPONENTS_DIR)) {
    error('Components directory does not exist at ' + COMPONENTS_DIR);
  }
  
  try {
    // Use cp -r for recursive directory copy
    execSync(`cp -r "${COMPONENTS_DIR}" "${BACKUP_DIR}"`);
    log(`Backup created at ${BACKUP_DIR}`);
  } catch (err) {
    error(`Failed to create backup: ${err.message}`);
  }
}

function removeComponentsDir() {
  log('Removing old components directory...');
  try {
    execSync(`rm -rf "${COMPONENTS_DIR}"`);
    log('Old components directory removed successfully');
  } catch (err) {
    error(`Failed to remove components directory: ${err.message}`);
  }
}

// Main execution
function main() {
  log('Starting migration finalization process...');
  
  // Confirmation prompt in real script (skipped here for automation)
  log('WARNING: This will remove the old components directory. Make sure you have fixed all imports first!');
  
  // Create backup for safety
  createBackup();
  
  // Remove the old components directory
  removeComponentsDir();
  
  log('Migration finalization complete. The old components directory has been backed up and removed.');
  log(`If you need to restore the old components, you can find them at: ${BACKUP_DIR}`);
}

main();