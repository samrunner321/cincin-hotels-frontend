#!/usr/bin/env node

/**
 * JSConfig/TSConfig Simplifier
 * 
 * This script simplifies the jsconfig.json and tsconfig.json files
 * to remove alias paths or standardize them to a simpler pattern.
 * 
 * Usage:
 *   node simplify-jsconfig.js [--mode=<remove|standardize>]
 * 
 * Options:
 *   --mode=remove       Remove all alias paths
 *   --mode=standardize  Standardize to only use @/ for src/ directory
 *   --help              Show usage information
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  mode: args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'standardize',
  help: args.includes('--help')
};

// Show help and exit if requested
if (options.help) {
  console.log(`
  JSConfig/TSConfig Simplifier

  Usage:
    node simplify-jsconfig.js [--mode=<remove|standardize>]

  Options:
    --mode=remove       Remove all alias paths
    --mode=standardize  Standardize to only use @/ for src/ directory (default)
    --help              Show usage information

  Examples:
    node simplify-jsconfig.js --mode=remove
    node simplify-jsconfig.js --mode=standardize
  `);
  process.exit(0);
}

// Validate the mode option
if (!['remove', 'standardize'].includes(options.mode)) {
  console.error(`Invalid mode: ${options.mode}. Must be either 'remove' or 'standardize'.`);
  process.exit(1);
}

// File paths
const jsConfigPath = path.resolve(__dirname, '..', 'jsconfig.json');
const tsConfigPath = path.resolve(__dirname, '..', 'tsconfig.json');

// Function to update a config file
function updateConfigFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }

  try {
    // Read the file
    const configRaw = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(configRaw);

    // Make a backup of the original file
    const backupPath = `${filePath}.bak`;
    fs.writeFileSync(backupPath, configRaw);
    console.log(`Backup created: ${backupPath}`);

    // Update paths based on the selected mode
    if (!config.compilerOptions) {
      config.compilerOptions = {};
    }

    if (!config.compilerOptions.paths) {
      config.compilerOptions.paths = {};
    }

    if (options.mode === 'remove') {
      // Remove all path aliases
      delete config.compilerOptions.paths;
      console.log(`Removed all path aliases from ${filePath}`);
    } else if (options.mode === 'standardize') {
      // Standardize to only use @/ for src/
      config.compilerOptions.paths = {
        '@/*': ['./src/*']
      };
      console.log(`Standardized path aliases in ${filePath} to only use @/ for src/`);
    }

    // Write the updated file
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    console.log(`Updated ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    return false;
  }
}

// Main function
function main() {
  console.log(`Running JSConfig/TSConfig Simplifier in '${options.mode}' mode`);
  
  // Update jsconfig.json if it exists
  const jsConfigUpdated = updateConfigFile(jsConfigPath);
  
  // Update tsconfig.json if it exists
  const tsConfigUpdated = updateConfigFile(tsConfigPath);
  
  if (!jsConfigUpdated && !tsConfigUpdated) {
    console.error('No configuration files were updated.');
    process.exit(1);
  }
  
  console.log('\nNext steps:');
  console.log('1. Update import statements in your code to match the new configuration');
  console.log('2. Run your application to verify the changes work correctly');
  console.log('3. If you encounter issues, you can restore the backup files');
}

// Run the main function
main();