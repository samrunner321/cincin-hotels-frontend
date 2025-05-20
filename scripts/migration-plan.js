/**
 * Migration Plan for CincinHotels
 * This script analyzes the current component structure and creates a prioritized migration plan
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');
const APP_DIR = path.join(PROJECT_ROOT, 'app');
const SRC_COMPONENTS_DIR = path.join(PROJECT_ROOT, 'src', 'components');
const SRC_APP_DIR = path.join(PROJECT_ROOT, 'src', 'app');

// Define component categories for prioritization
const CATEGORIES = {
  UI: 'ui',
  LAYOUT: 'layout',
  COMMON: 'common',
  HOTELS: 'hotels',
  DESTINATIONS: 'destinations',
  FORMS: 'forms',
  JOURNAL: 'journal',
  OTHER: 'other'
};

// Define component priorities
const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Define component complexity
const COMPLEXITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Define component dependencies mapping
// This helps identify simple components with few dependencies
const DEPENDENCY_MAPPING = {
  // UI components with minimal dependencies
  'LoadingSpinner.jsx': { category: CATEGORIES.UI, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.LOW },
  'ContentBlock.jsx': { category: CATEGORIES.UI, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.LOW },
  'ViewSwitcher.jsx': { category: CATEGORIES.UI, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.MEDIUM },
  'CategoryButton.js': { category: CATEGORIES.UI, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.LOW },
  'FeatureItem.js': { category: CATEGORIES.UI, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.LOW },
  
  // Layout components
  'Layout.jsx': { category: CATEGORIES.LAYOUT, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.MEDIUM },
  'Navbar.jsx': { category: CATEGORIES.LAYOUT, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.MEDIUM },
  'Footer.jsx': { category: CATEGORIES.LAYOUT, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.LOW },
  'MobileMenu.jsx': { category: CATEGORIES.LAYOUT, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.MEDIUM },
  
  // Common components
  'PageHero.jsx': { category: CATEGORIES.COMMON, priority: PRIORITIES.MEDIUM, complexity: COMPLEXITY.MEDIUM },
  'AssetManager.jsx': { category: CATEGORIES.COMMON, priority: PRIORITIES.MEDIUM, complexity: COMPLEXITY.HIGH },
  'ResponsiveDirectusImage.jsx': { category: CATEGORIES.COMMON, priority: PRIORITIES.MEDIUM, complexity: COMPLEXITY.MEDIUM },
  
  // Hotel components
  'HotelCard.js': { category: CATEGORIES.HOTELS, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.MEDIUM },
  'HotelFilters.jsx': { category: CATEGORIES.HOTELS, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.MEDIUM },
  'HotelList.js': { category: CATEGORIES.HOTELS, priority: PRIORITIES.HIGH, complexity: COMPLEXITY.MEDIUM },
  'HotelModal.jsx': { category: CATEGORIES.HOTELS, priority: PRIORITIES.MEDIUM, complexity: COMPLEXITY.MEDIUM },
  'HotelListView.jsx': { category: CATEGORIES.HOTELS, priority: PRIORITIES.MEDIUM, complexity: COMPLEXITY.MEDIUM },
  'HotelMapView.jsx': { category: CATEGORIES.HOTELS, priority: PRIORITIES.MEDIUM, complexity: COMPLEXITY.HIGH },
  'HotelsPage.jsx': { category: CATEGORIES.HOTELS, priority: PRIORITIES.MEDIUM, complexity: COMPLEXITY.HIGH },
  
  // Form components
  'ContactForm.jsx': { category: CATEGORIES.FORMS, priority: PRIORITIES.MEDIUM, complexity: COMPLEXITY.MEDIUM },
  'MembershipForm.jsx': { category: CATEGORIES.FORMS, priority: PRIORITIES.LOW, complexity: COMPLEXITY.HIGH },
};

// Function to scan the component directory and create a migration plan
function scanComponentsForMigration() {
  console.log('Scanning components for migration...');
  
  // Get all JSX and JS files in the components directory
  const componentFiles = [];
  
  function scanDir(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath, relPath);
      } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
        // Skip index.js files as they're usually just exports
        if (entry.name === 'index.js') return;
        
        // Check if this file is already migrated to src
        const srcPath = path.join(SRC_COMPONENTS_DIR, path.dirname(relPath), 
          entry.name.replace('.jsx', '.tsx').replace('.js', '.tsx'));
        
        const isMigrated = fs.existsSync(srcPath);
        
        componentFiles.push({
          name: entry.name,
          fullPath: fullPath,
          relativePath: relPath,
          targetPath: srcPath,
          isMigrated: isMigrated,
          ...getDependencyInfo(entry.name)
        });
      }
    });
  }
  
  // Helper function to get dependency info
  function getDependencyInfo(fileName) {
    const info = DEPENDENCY_MAPPING[fileName] || { 
      category: CATEGORIES.OTHER, 
      priority: PRIORITIES.LOW, 
      complexity: COMPLEXITY.MEDIUM 
    };
    
    return info;
  }
  
  // Start the scan
  scanDir(COMPONENTS_DIR);
  
  // Sort components by priority and complexity
  componentFiles.sort((a, b) => {
    // First sort by priority
    const priorityOrder = { [PRIORITIES.HIGH]: 0, [PRIORITIES.MEDIUM]: 1, [PRIORITIES.LOW]: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then sort by complexity
    const complexityOrder = { [COMPLEXITY.LOW]: 0, [COMPLEXITY.MEDIUM]: 1, [COMPLEXITY.HIGH]: 2 };
    return complexityOrder[a.complexity] - complexityOrder[b.complexity];
  });
  
  return componentFiles;
}

// Function to create migration queues
function createMigrationQueues(componentFiles) {
  const queues = {
    [CATEGORIES.UI]: [],
    [CATEGORIES.LAYOUT]: [],
    [CATEGORIES.COMMON]: [],
    [CATEGORIES.HOTELS]: [],
    [CATEGORIES.DESTINATIONS]: [],
    [CATEGORIES.FORMS]: [],
    [CATEGORIES.JOURNAL]: [],
    [CATEGORIES.OTHER]: []
  };
  
  // Group components by category
  componentFiles.forEach(component => {
    queues[component.category].push(component);
  });
  
  return queues;
}

// Function to print the migration plan
function printMigrationPlan(queues) {
  console.log('='.repeat(80));
  console.log('MIGRATION PLAN');
  console.log('='.repeat(80));
  
  let totalComponents = 0;
  
  Object.entries(queues).forEach(([category, components]) => {
    if (components.length === 0) return;
    
    console.log(`\n${category.toUpperCase()} COMPONENTS (${components.length}):`);
    console.log('-'.repeat(80));
    console.log('Priority | Complexity | Status       | Component Path');
    console.log('-'.repeat(80));
    
    components.forEach(component => {
      const status = component.isMigrated ? 'MIGRATED' : 'PENDING';
      console.log(
        `${component.priority.padEnd(8)} | ` +
        `${component.complexity.padEnd(10)} | ` +
        `${status.padEnd(12)} | ` +
        `${component.relativePath}`
      );
      totalComponents++;
    });
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL COMPONENTS: ${totalComponents}`);
  console.log('='.repeat(80));
}

// Function to create a migration script
function generateMigrationScript(queues) {
  const scriptContent = `#!/bin/bash
# Generated Migration Script for CincinHotels
# Generated on: ${new Date().toISOString()}

set -e

echo "Starting component migration process..."

# Create necessary directories
mkdir -p "${SRC_COMPONENTS_DIR}/ui"
mkdir -p "${SRC_COMPONENTS_DIR}/ui/buttons"
mkdir -p "${SRC_COMPONENTS_DIR}/ui/forms"
mkdir -p "${SRC_COMPONENTS_DIR}/layout"
mkdir -p "${SRC_COMPONENTS_DIR}/common"
mkdir -p "${SRC_COMPONENTS_DIR}/hotels"
mkdir -p "${SRC_COMPONENTS_DIR}/hotels/filters"
mkdir -p "${SRC_COMPONENTS_DIR}/destinations"
mkdir -p "${SRC_COMPONENTS_DIR}/forms"
mkdir -p "${SRC_COMPONENTS_DIR}/journal"

${Object.entries(queues)
  .filter(([_, components]) => components.length > 0)
  .map(([category, components]) => {
    return `
# Migration Group: ${category.toUpperCase()} Components
echo "Migrating ${category} components..."
${components
  .filter(c => !c.isMigrated)
  .map(component => {
    const targetDir = path.dirname(component.targetPath);
    return `
# Migrating: ${component.relativePath}
mkdir -p "${targetDir}"
echo "Converting ${component.name} to TypeScript..."
npx ts-migrate -i "${component.fullPath}" -o "${component.targetPath}"
echo "✓ Migrated ${component.name}"
`;
  }).join('')}
`;
  }).join('')}

echo "Migration script completed."
`;

  const scriptPath = path.join(PROJECT_ROOT, 'scripts', 'migrate-components.sh');
  fs.writeFileSync(scriptPath, scriptContent);
  fs.chmodSync(scriptPath, '755');  // Make executable
  
  console.log(`\nMigration script generated at: ${scriptPath}`);
}

// Main function
function main() {
  console.log('Starting component migration planning...');
  
  const componentFiles = scanComponentsForMigration();
  const queues = createMigrationQueues(componentFiles);
  
  printMigrationPlan(queues);
  generateMigrationScript(queues);
  
  console.log('\nMigration plan complete. You can now run the migration script.');
}

main();