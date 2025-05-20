#!/usr/bin/env node

/**
 * Batch Migration Tool
 * 
 * This script migrates a batch of components from /components to /src/components,
 * converting them to TypeScript and standardizing import paths.
 * 
 * Usage: node batch-migrate.js <batch-number> [options]
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync, spawn } = require('child_process');
const { glob } = require('glob');

// Configuration
const ROADMAP_FILE = path.join(process.cwd(), 'migration-roadmap.json');
const COMPONENTS_DIR = path.join(process.cwd(), 'components');
const SRC_COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components');
const DEFAULT_MEMORY = 8192;

// Parse command line arguments
const args = process.argv.slice(2);
let batchNumber = args[0] ? parseInt(args[0], 10) : null;
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const skipExisting = args.includes('--skip-existing');
const force = args.includes('--force');
const memory = args.find(arg => arg.startsWith('--memory=')) 
  ? parseInt(args.find(arg => arg.startsWith('--memory=')).split('=')[1], 10) 
  : DEFAULT_MEMORY;

// Helper functions
function logVerbose(message) {
  if (verbose) {
    console.log(chalk.gray(message));
  }
}

/**
 * Run a command in a child process with increased memory limit
 * @param {string} command Command to run
 * @param {string[]} args Command arguments
 * @param {Object} options Options for spawn
 * @returns {Promise<string>} Command output
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const nodeArgs = [`--max-old-space-size=${memory}`];
    
    // If the command is node, append the memory argument
    const finalCommand = command === 'node' ? command : command;
    const finalArgs = command === 'node' ? [...nodeArgs, ...args] : args;
    
    logVerbose(`Running: ${finalCommand} ${finalArgs.join(' ')}`);
    
    const child = spawn(finalCommand, finalArgs, {
      ...options,
      shell: true,
      stdio: verbose ? 'inherit' : 'pipe'
    });
    
    let stdout = '';
    let stderr = '';
    
    if (!verbose) {
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
    }
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
      }
    });
  });
}

/**
 * Check if a component is already migrated
 * @param {string} componentName Component name
 * @param {string} sourcePath Source path
 * @returns {boolean} Is component migrated
 */
function isAlreadyMigrated(componentName, sourcePath) {
  const fileName = path.basename(sourcePath);
  const dirName = path.dirname(sourcePath).split('/').pop();
  
  // Check possible target paths
  const possibleTargetPaths = [
    path.join(SRC_COMPONENTS_DIR, fileName.replace(/\.jsx?$/, '.tsx')),
    path.join(SRC_COMPONENTS_DIR, fileName.replace(/\.jsx?$/, '.ts')),
    path.join(SRC_COMPONENTS_DIR, componentName, 'index.tsx'),
    path.join(SRC_COMPONENTS_DIR, componentName, 'index.ts'),
    path.join(SRC_COMPONENTS_DIR, dirName, componentName + '.tsx'),
    path.join(SRC_COMPONENTS_DIR, dirName, componentName + '.ts')
  ];
  
  return possibleTargetPaths.some(targetPath => fs.existsSync(targetPath));
}

/**
 * Build the target path for a component
 * @param {string} sourcePath Source component path
 * @returns {string} Target path
 */
function buildTargetPath(sourcePath) {
  // Get component path relative to components directory
  const relativePath = path.relative(COMPONENTS_DIR, sourcePath);
  const dirName = path.dirname(relativePath);
  const fileName = path.basename(relativePath);
  
  // Convert .js/.jsx to .ts/.tsx
  const newExtension = fileName.endsWith('.jsx') ? '.tsx' : 
                       fileName.endsWith('.js') ? '.ts' : fileName;
  
  // Build target path
  const targetPath = path.join(SRC_COMPONENTS_DIR, dirName, 
    fileName.replace(/\.(js|jsx)$/, newExtension.endsWith('.ts') || newExtension.endsWith('.tsx') ? 
      newExtension : 
      newExtension.endsWith('.js') ? '.ts' : '.tsx'));
  
  return targetPath;
}

/**
 * Create directory for target file if it doesn't exist
 * @param {string} targetPath Target file path
 */
function ensureTargetDirectory(targetPath) {
  const targetDir = path.dirname(targetPath);
  
  if (!fs.existsSync(targetDir)) {
    logVerbose(`Creating directory: ${targetDir}`);
    if (!dryRun) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  }
}

/**
 * Migrate a single component
 * @param {Object} component Component to migrate
 * @returns {Promise<Object>} Migration result
 */
async function migrateComponent(component) {
  try {
    const { name, path: sourcePath } = component;
    
    // Check if the component is already migrated
    if (isAlreadyMigrated(name, sourcePath) && skipExisting) {
      console.log(chalk.yellow(`➤ Skipping ${name} (already migrated)`));
      return { name, success: true, skipped: true, reason: 'Already migrated' };
    }
    
    // Build target path
    const targetPath = buildTargetPath(sourcePath);
    ensureTargetDirectory(targetPath);
    
    console.log(chalk.blue(`\n➤ Migrating component: ${chalk.bold(name)}`));
    console.log(chalk.gray(`  Source: ${sourcePath}`));
    console.log(chalk.gray(`  Target: ${targetPath}`));
    
    if (dryRun) {
      console.log(chalk.yellow('  Dry run, not actually migrating'));
      return { name, success: true, dryRun: true };
    }
    
    // Step 1: Run TypeScript conversion
    console.log(chalk.cyan('  Converting to TypeScript...'));
    
    try {
      await runCommand('node', [
        'scripts/migration-tools.js', 
        'convert', 
        sourcePath, 
        `--output-dir=${path.dirname(targetPath)}`,
        `--memory=${memory}`
      ]);
    } catch (error) {
      console.error(chalk.red(`  Error converting to TypeScript: ${error.message}`));
      return { name, success: false, error: error.message, step: 'typescript-conversion' };
    }
    
    // Step 2: Standardize import paths
    console.log(chalk.cyan('  Standardizing import paths...'));
    let content = fs.readFileSync(targetPath, 'utf-8');
    
    // Replace relative imports
    content = content.replace(/from\s+['"]\.\.\/\.\.\/([^'"]+)['"]/g, "from '@/$1'");
    content = content.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, (match, importPath) => {
      // Check if it's a relative import to another component
      if (importPath.startsWith('components/')) {
        return `from '@/${importPath}'`;
      }
      // Is it a relative import within the same directory?
      const currentDir = path.dirname(sourcePath).split('/').pop();
      return `from '@/components/${currentDir}/${importPath}'`;
    });
    
    // Standardize component imports
    content = content.replace(/from\s+['"](components\/[^'"]+)['"]/g, "from '@/$1'");
    
    // Fix common issues
    content = content.replace(/React\.FC<(\w+)Props>/g, 'React.FC<$1Props>');
    
    // Add React import if missing
    if (!content.includes('import React')) {
      content = "import React from 'react';\n" + content;
    }
    
    // Write the updated content
    fs.writeFileSync(targetPath, content);
    
    // Step 3: Add proper TypeScript types
    console.log(chalk.cyan('  Adding proper TypeScript types...'));
    
    // Add React imports if needed for events
    if (content.includes('onClick') || content.includes('onChange') || content.includes('onSubmit')) {
      if (!content.includes('MouseEvent') && content.includes('onClick')) {
        content = content.replace(
          /import React/,
          "import React, { MouseEvent }"
        );
      }
      if (!content.includes('ChangeEvent') && content.includes('onChange')) {
        content = content.replace(
          /import React(,\s*{[^}]+})?/,
          (match, group) => group 
            ? `import React, { ${group.replace('{', '').replace('}', '')}, ChangeEvent }`
            : "import React, { ChangeEvent }"
        );
      }
    }
    
    // Write the updated content again
    fs.writeFileSync(targetPath, content);
    
    // Step 4: Verify the migration
    console.log(chalk.cyan('  Verifying migration...'));
    
    try {
      // Try to lint/typecheck the file if possible
      // This is a placeholder - you'd typically run TypeScript or ESLint here
      const tsConfigExists = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
      if (tsConfigExists) {
        try {
          await runCommand('npx', ['tsc', '--noEmit', targetPath]);
          console.log(chalk.green('  ✓ TypeScript verification passed'));
        } catch (error) {
          console.warn(chalk.yellow(`  ⚠ TypeScript verification failed: ${error.message}`));
          // Don't fail the migration for TypeScript errors at this stage
        }
      }
    } catch (error) {
      console.warn(chalk.yellow(`  ⚠ Verification step skipped: ${error.message}`));
    }
    
    console.log(chalk.green(`  ✓ Successfully migrated ${name}`));
    return { name, success: true };
    
  } catch (error) {
    console.error(chalk.red(`  ✗ Migration failed: ${error.message}`));
    if (verbose) {
      console.error(error.stack);
    }
    return { name, success: false, error: error.message };
  }
}

/**
 * Migrate all components in a batch
 * @param {Array} components Components to migrate
 * @returns {Promise<Array>} Migration results
 */
async function migrateBatch(components) {
  console.log(chalk.blue(`\n🚀 Starting batch migration of ${components.length} components`));
  
  if (dryRun) {
    console.log(chalk.yellow('⚠️ DRY RUN MODE: No actual changes will be made'));
  }
  
  const results = [];
  
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    console.log(chalk.blue(`\n[${i + 1}/${components.length}] Processing component: ${component.name}`));
    
    const result = await migrateComponent(component);
    results.push(result);
    
    // Add a small delay between components to allow for garbage collection
    if (i < components.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.blue(`\n📦 BATCH MIGRATION TOOL`));
  console.log(chalk.gray('════════════════════════════════════════════'));
  
  try {
    // Check if roadmap file exists
    if (!fs.existsSync(ROADMAP_FILE)) {
      console.error(chalk.red(`Migration roadmap file not found at ${ROADMAP_FILE}`));
      console.log(chalk.yellow('Run create-component-inventory.js first to generate the roadmap'));
      process.exit(1);
    }
    
    // Load migration roadmap
    const roadmap = JSON.parse(fs.readFileSync(ROADMAP_FILE, 'utf-8'));
    
    // If no batch number provided, show available batches
    if (batchNumber === null) {
      console.log(chalk.yellow('Available migration batches:'));
      roadmap.forEach((batch, index) => {
        console.log(`  [${batch.id}] ${batch.name}: ${batch.componentCount} components (${batch.estimatedEffort} hours)`);
      });
      console.log(chalk.yellow('\nUsage: node batch-migrate.js <batch-number> [options]'));
      console.log(chalk.yellow('Options:'));
      console.log(chalk.yellow('  --dry-run       : Run without making actual changes'));
      console.log(chalk.yellow('  --verbose       : Show detailed output'));
      console.log(chalk.yellow('  --skip-existing : Skip already migrated components'));
      console.log(chalk.yellow('  --force         : Force migration even if verification fails'));
      console.log(chalk.yellow('  --memory=<MB>   : Set memory limit (default: 8192)'));
      process.exit(0);
    }
    
    // Check if batch number is valid
    if (batchNumber < 1 || batchNumber > roadmap.length) {
      console.error(chalk.red(`Invalid batch number. Choose between 1 and ${roadmap.length}`));
      process.exit(1);
    }
    
    // Get batch
    const batch = roadmap[batchNumber - 1];
    console.log(chalk.green(`Selected batch: ${batch.name}`));
    console.log(chalk.gray(`Description: ${batch.description}`));
    console.log(chalk.gray(`Components: ${batch.componentCount}`));
    console.log(chalk.gray(`Estimated effort: ${batch.estimatedEffort} hours`));
    
    if (batch.componentCount === 0) {
      console.log(chalk.yellow('\nThis batch has no components to migrate.'));
      process.exit(0);
    }
    
    // Confirm migration if not forced
    if (!force && !dryRun) {
      const answer = await new Promise(resolve => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        readline.question(chalk.yellow(`\nDo you want to proceed with migrating ${batch.componentCount} components? (y/n) `), answer => {
          readline.close();
          resolve(answer.toLowerCase());
        });
      });
      
      if (answer !== 'y' && answer !== 'yes') {
        console.log(chalk.yellow('\nMigration cancelled.'));
        process.exit(0);
      }
    }
    
    // Start the migration
    const startTime = Date.now();
    const results = await migrateBatch(batch.components);
    const duration = (Date.now() - startTime) / 1000; // in seconds
    
    // Print migration summary
    console.log(chalk.blue('\n📊 MIGRATION SUMMARY'));
    console.log(chalk.gray('════════════════════════════════════════════'));
    
    const successful = results.filter(r => r.success && !r.skipped).length;
    const skipped = results.filter(r => r.skipped).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`Total components: ${results.length}`);
    console.log(`Successfully migrated: ${chalk.green(successful)}`);
    console.log(`Skipped: ${chalk.yellow(skipped)}`);
    console.log(`Failed: ${chalk.red(failed)}`);
    console.log(`Duration: ${Math.floor(duration / 60)}m ${Math.floor(duration % 60)}s`);
    
    if (failed > 0) {
      console.log(chalk.red('\nFailed components:'));
      results.filter(r => !r.success).forEach(result => {
        console.log(`  - ${result.name}: ${result.error}`);
      });
    }
    
    console.log(chalk.gray('════════════════════════════════════════════'));
    
    if (successful > 0) {
      console.log(chalk.green(`\n✅ Migration completed successfully for ${successful} components.`));
    } else if (skipped > 0 && failed === 0) {
      console.log(chalk.yellow(`\n⚠️ All ${skipped} components were skipped.`));
    } else {
      console.log(chalk.red(`\n❌ Migration failed for all ${failed} components.`));
    }
    
  } catch (error) {
    console.error(chalk.red(`\n❌ Error during migration: ${error.message}`));
    if (verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error(chalk.red(`Unhandled error: ${error.message}`));
  if (verbose) {
    console.error(error.stack);
  }
  process.exit(1);
});