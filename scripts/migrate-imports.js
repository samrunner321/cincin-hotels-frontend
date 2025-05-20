#!/usr/bin/env node
/**
 * Main script to orchestrate the entire import migration process
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuration
const rootDir = path.resolve(__dirname, '..');

// Create an interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Execute a child process and return its output
 */
function execute(command, silent = false) {
  try {
    if (!silent) console.log(`Executing: ${command}`);
    return execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    throw error;
  }
}

/**
 * Ask user for confirmation
 */
function confirm(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n) `, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Phase 1: Find and fix alias imports
 */
async function phase1() {
  console.log('\n=== Phase 1: Finding and Fixing Alias Imports ===\n');
  
  // Run the find script to identify problematic imports
  console.log('Scanning for alias imports...');
  execute('node scripts/find-alias-imports.js');
  
  const batches = [
    { name: 'Hooks', path: 'src/hooks' },
    { name: 'Types', path: 'src/types' },
    { name: 'Components/UI', path: 'src/components/ui' },
    { name: 'Components/Layout', path: 'src/components/layout' },
    { name: 'Components/Hotels', path: 'src/components/hotels' },
    { name: 'Components/Common', path: 'src/components/common' },
    { name: 'Lib', path: 'src/lib' },
    { name: 'App', path: 'src/app' },
  ];
  
  for (const batch of batches) {
    if (!fs.existsSync(path.join(rootDir, batch.path))) {
      console.log(`Skipping ${batch.name} (directory not found: ${batch.path})`);
      continue;
    }
    
    console.log(`\nProcessing batch: ${batch.name} (${batch.path})`);
    const proceed = await confirm(`Do you want to fix imports in ${batch.path}?`);
    
    if (proceed) {
      console.log(`Fixing imports in ${batch.path}...`);
      
      try {
        // Get list of files before fixing for documentation
        const fileListOutput = execute(`find ${batch.path} -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \\)`, true);
        const fixedFiles = fileListOutput.trim().split('\n').filter(Boolean);
        
        // Fix imports in this batch
        execute(`node scripts/batch-fix-imports.js ${batch.path}`);
        
        // Document changes
        execute(`node scripts/document-import-changes.js "${batch.name}" ${fixedFiles.join(' ')}`);
        
        // Verify with TypeScript (if applicable)
        if (batch.path.includes('.ts') || batch.path.includes('.tsx') || fs.existsSync(path.join(rootDir, 'tsconfig.json'))) {
          console.log(`Running TypeScript check...`);
          try {
            execute('npx tsc --noEmit', true);
            console.log('✅ TypeScript check passed');
          } catch (error) {
            console.error('⚠️ TypeScript check failed, but continuing with next batch');
          }
        }
      } catch (error) {
        console.error(`Error processing batch ${batch.name}:`, error.message);
        const skipRest = await confirm('Do you want to skip the rest of this batch?');
        if (skipRest) continue;
      }
    }
  }
  
  console.log('\nPhase 1 completed.');
}

/**
 * Phase 2: Project cleanup and structure optimization
 */
async function phase2() {
  console.log('\n=== Phase 2: Project Cleanup and Structure Optimization ===\n');
  
  // Check if project is ready for cleanup
  console.log('Checking if project is ready for cleanup...');
  try {
    execute('node scripts/prepare-cleanup.js');
    
    const cleanupReport = path.join(rootDir, 'CLEANUP_REPORT.md');
    if (fs.existsSync(cleanupReport)) {
      console.log(`Cleanup report generated: ${cleanupReport}`);
      
      const proceed = await confirm('Do you want to proceed with cleanup?');
      if (!proceed) {
        console.log('Skipping cleanup phase.');
        return;
      }
      
      // Proceed with cleanup steps
      const oldDirs = ['components', 'lib'];
      for (const dir of oldDirs) {
        if (fs.existsSync(path.join(rootDir, dir))) {
          const removeDir = await confirm(`Remove old directory: ${dir}?`);
          if (removeDir) {
            console.log(`Removing ${dir}...`);
            fs.rmSync(path.join(rootDir, dir), { recursive: true, force: true });
          }
        }
      }
      
      // Clean up empty directories
      const cleanEmptyDirs = await confirm('Clean up empty directories?');
      if (cleanEmptyDirs) {
        console.log('Finding and removing empty directories...');
        try {
          execute('find src -type d -empty -delete');
          console.log('Empty directories removed.');
        } catch (error) {
          console.error('Error removing empty directories:', error.message);
        }
      }
    }
  } catch (error) {
    console.error('Project is not ready for cleanup. Please fix remaining issues first.');
    return;
  }
  
  console.log('\nPhase 2 completed.');
}

/**
 * Phase 3: Validation and documentation
 */
async function phase3() {
  console.log('\n=== Phase 3: Validation and Documentation ===\n');
  
  // Run a full build to validate changes
  const runBuild = await confirm('Run a full build to validate changes?');
  if (runBuild) {
    console.log('Running build...');
    try {
      execute('npm run build');
      console.log('✅ Build successful.');
    } catch (error) {
      console.error('❌ Build failed. Please fix the issues before continuing.');
      return;
    }
  }
  
  // Create or update import guidelines document
  console.log('Creating import guidelines document...');
  execute('node scripts/document-import-changes.js "Final Documentation"');
  
  // Ask about keeping alias definitions in tsconfig
  const updateTsConfig = await confirm('Do you want to remove alias definitions from tsconfig.json?');
  if (updateTsConfig) {
    console.log('Note: This step requires manual intervention.');
    console.log('Please open tsconfig.json and remove or comment out the path mappings in the "paths" section.');
  }
  
  console.log('\nPhase 3 completed.');
}

/**
 * Main function to run the entire migration process
 */
async function main() {
  console.log('=== Import Migration Process ===');
  
  try {
    // Run each phase with confirmation
    const runPhase1 = await confirm('Run Phase 1: Find and fix alias imports?');
    if (runPhase1) await phase1();
    
    const runPhase2 = await confirm('Run Phase 2: Project cleanup and structure optimization?');
    if (runPhase2) await phase2();
    
    const runPhase3 = await confirm('Run Phase 3: Validation and documentation?');
    if (runPhase3) await phase3();
    
    console.log('\n=== Import Migration Complete ===');
  } catch (error) {
    console.error('Migration process failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run the main function
main();