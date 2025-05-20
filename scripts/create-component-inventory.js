#!/usr/bin/env node

/**
 * Component Inventory Script
 * 
 * Creates a detailed inventory of all React components in the project,
 * including dependency relationships, complexity analysis, and categorization.
 * 
 * This script is specifically designed for Phase 3 of the CinCin Hotels migration.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const chalk = require('chalk');
const { execSync } = require('child_process');

// Source directories
const COMPONENTS_DIR = path.join(process.cwd(), 'components');
const SRC_COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components');

// Output paths
const INVENTORY_FILE = path.join(process.cwd(), 'component-inventory.json');
const VISUALIZATION_FILE = path.join(process.cwd(), 'component-relationships.md');
const ROADMAP_FILE = path.join(process.cwd(), 'migration-roadmap.json');

// Configuration
const BATCH_SIZE = 10;
const LOW_COMPLEXITY_THRESHOLD = 20;
const MED_COMPLEXITY_THRESHOLD = 40;
const CRITICAL_USAGE_THRESHOLD = 4;

// Component categories
const CATEGORIES = {
  LAYOUT: 'layout',
  UI: 'ui',
  FORM: 'form',
  FEATURE: 'feature',
  PAGE: 'page',
  UTILITY: 'utility',
  OTHER: 'other'
};

/**
 * Find all component files in the project
 * @returns {Promise<string[]>} List of component file paths
 */
function findComponentFiles() {
  try {
    const files = glob.sync('components/**/*.{js,jsx}');
    // Filter out test files, stories, and utility files
    const componentFiles = files.filter(file => 
      !file.includes('.test.') && 
      !file.includes('.stories.') && 
      !file.includes('.spec.') && 
      !file.includes('__tests__')
    );
    return componentFiles;
  } catch (err) {
    console.error('Error finding component files:', err);
    return [];
  }
}

/**
 * Extract component name from file path
 * @param {string} filePath Component file path
 * @returns {string} Component name
 */
function getComponentName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  // If the file is index.js/jsx, use the directory name instead
  if (fileName.toLowerCase() === 'index') {
    const dirName = path.basename(path.dirname(filePath));
    return dirName;
  }
  return fileName;
}

/**
 * Categorize component based on its path and content
 * @param {string} filePath Component file path
 * @param {string} content Component file content
 * @returns {string} Component category
 */
function categorizeComponent(filePath, content) {
  // Check path-based categories
  if (filePath.includes('/layout/')) return CATEGORIES.LAYOUT;
  if (filePath.includes('/ui/')) return CATEGORIES.UI;
  if (filePath.includes('/forms/')) return CATEGORIES.FORM;
  if (filePath.includes('/pages/')) return CATEGORIES.PAGE;
  if (filePath.includes('/utils/') || filePath.includes('/helpers/')) return CATEGORIES.UTILITY;
  
  // Check content-based categories
  if (content.includes('onChange') && 
     (content.includes('input') || content.includes('select') || content.includes('textarea'))) {
    return CATEGORIES.FORM;
  }
  
  if (content.includes('export default function') && content.includes('props')) {
    // Check if it's a feature component by size and complexity
    if (content.length > 500 && 
       (content.match(/useState/g) || []).length >= 2) {
      return CATEGORIES.FEATURE;
    }
    return CATEGORIES.UI;
  }
  
  return CATEGORIES.OTHER;
}

/**
 * Calculate complexity based on content analysis
 * @param {string} content Component file content
 * @returns {number} Complexity score
 */
function calculateComplexity(content) {
  let score = 0;
  
  // Basic size metrics
  score += Math.min(50, Math.floor(content.length / 100)); // Up to 50 points for size
  
  // Hooks and state complexity
  score += (content.match(/useState/g) || []).length * 3;
  score += (content.match(/useEffect/g) || []).length * 5;
  score += (content.match(/useRef/g) || []).length * 2;
  score += (content.match(/useContext/g) || []).length * 4;
  score += (content.match(/useReducer/g) || []).length * 7;
  score += (content.match(/useMemo/g) || []).length * 3;
  score += (content.match(/useCallback/g) || []).length * 3;
  
  // Conditional rendering and loops
  score += (content.match(/\? /g) || []).length * 2; // Ternary operators
  score += (content.match(/ && /g) || []).length; // Logical AND
  score += (content.match(/\.map\(/g) || []).length * 3; // Array mapping
  score += (content.match(/\.filter\(/g) || []).length * 2; // Array filtering
  
  // Event handlers
  score += (content.match(/on[A-Z][a-zA-Z]+=/g) || []).length * 2; // Event handlers
  score += (content.match(/function handle[A-Z][a-zA-Z]+/g) || []).length * 3; // Handler functions
  
  // Imports
  score += (content.match(/import /g) || []).length;
  
  return score;
}

/**
 * Extract imports and dependencies from component
 * @param {string} content Component file content
 * @param {string} filePath Component file path
 * @returns {Object} Component imports and dependencies
 */
function extractDependencies(content, filePath) {
  const imports = [];
  const internalDependencies = [];
  const externalDependencies = [];
  
  // Extract imports with regex
  const importRegex = /import\s+(?:{([^}]+)}|\*\s+as\s+([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+))\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const namedImports = match[1] ? match[1].split(',').map(name => name.trim()) : [];
    const namespaceImport = match[2] ? [match[2]] : [];
    const defaultImport = match[3] ? [match[3]] : [];
    const importPath = match[4];
    
    imports.push({
      source: importPath,
      imports: [...defaultImport, ...namespaceImport, ...namedImports].filter(Boolean)
    });
    
    // Classify dependencies
    if (importPath.startsWith('.') || 
        importPath.startsWith('/') || 
        importPath.startsWith('@/components')) {
      // Attempt to resolve relative path to component
      const componentDir = path.dirname(filePath);
      let absoluteImportPath;
      
      if (importPath.startsWith('.')) {
        absoluteImportPath = path.resolve(componentDir, importPath);
      } else if (importPath.startsWith('@/components')) {
        absoluteImportPath = importPath.replace('@/components', 'components');
      } else {
        absoluteImportPath = importPath;
      }
      
      internalDependencies.push({
        path: absoluteImportPath,
        imports: [...defaultImport, ...namespaceImport, ...namedImports].filter(Boolean)
      });
    } else {
      externalDependencies.push({
        path: importPath,
        imports: [...defaultImport, ...namespaceImport, ...namedImports].filter(Boolean)
      });
    }
  }
  
  return {
    imports,
    internalDependencies,
    externalDependencies
  };
}

/**
 * Check if a component is already migrated to TypeScript
 * @param {string} componentName Component name
 * @returns {boolean} Is component migrated
 */
function isAlreadyMigrated(componentName) {
  // Check if component exists in src/components with .tsx extension
  const possiblePaths = [
    path.join(SRC_COMPONENTS_DIR, `${componentName}.tsx`),
    path.join(SRC_COMPONENTS_DIR, componentName, 'index.tsx')
  ];
  
  return possiblePaths.some(filePath => fs.existsSync(filePath));
}

/**
 * Create a complete analysis of a component
 * @param {string} filePath Component file path
 * @returns {Object} Component analysis
 */
async function analyzeComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const componentName = getComponentName(filePath);
    const category = categorizeComponent(filePath, content);
    const complexity = calculateComplexity(content);
    const { imports, internalDependencies, externalDependencies } = extractDependencies(content, filePath);
    const migrated = isAlreadyMigrated(componentName);
    
    // Calculate complexity level
    let complexityLevel;
    if (complexity < LOW_COMPLEXITY_THRESHOLD) {
      complexityLevel = 'low';
    } else if (complexity < MED_COMPLEXITY_THRESHOLD) {
      complexityLevel = 'medium';
    } else {
      complexityLevel = 'high';
    }
    
    return {
      name: componentName,
      path: filePath,
      category,
      complexity,
      complexityLevel,
      imports,
      internalDependencies,
      externalDependencies,
      migrated,
      fileSize: content.length,
      exportType: content.includes('export default') ? 'default' : 'named',
      isTypeScript: filePath.endsWith('.tsx'),
      hasJSX: content.includes('</') || content.includes('/>'),
      hasHooks: content.includes('useState') || content.includes('useEffect'),
      dependedOnBy: [] // Will be populated later
    };
  } catch (error) {
    console.error(chalk.red(`Error analyzing component ${filePath}: ${error.message}`));
    return null;
  }
}

/**
 * Build component dependency graph
 * @param {Array} components List of component analyses
 * @returns {Array} Updated component list with dependency graph
 */
function buildDependencyGraph(components) {
  // Create a map of all components for fast lookup
  const componentMap = {};
  components.forEach(component => {
    if (component) {
      componentMap[component.name] = component;
      // Also map by file path without extension
      const pathWithoutExt = component.path.replace(/\.[^/.]+$/, '');
      componentMap[pathWithoutExt] = component;
    }
  });
  
  // Map relative import paths to component names
  components.forEach(component => {
    if (!component) return;
    
    // Check each internal dependency
    component.internalDependencies.forEach(dep => {
      // Try to resolve the dependency to a component
      const depPath = dep.path;
      
      // Try different possible paths
      const possiblePaths = [
        depPath,
        `${depPath}.js`,
        `${depPath}.jsx`,
        `${depPath}/index.js`,
        `${depPath}/index.jsx`,
        path.join('components', depPath),
        path.join('components', `${depPath}.js`),
        path.join('components', `${depPath}.jsx`),
        path.join('components', depPath, 'index.js'),
        path.join('components', depPath, 'index.jsx')
      ];
      
      // Try to find the dependency in the component map
      for (const possiblePath of possiblePaths) {
        if (componentMap[possiblePath]) {
          const depComponent = componentMap[possiblePath];
          // Add to the 'dependedOnBy' list of the dependency
          if (!depComponent.dependedOnBy.includes(component.name)) {
            depComponent.dependedOnBy.push(component.name);
          }
          break;
        }
      }
    });
  });
  
  return components;
}

/**
 * Calculate usage score for a component (how critical it is)
 * @param {Object} component Component analysis
 * @param {Array} allComponents All components
 * @returns {number} Usage score
 */
function calculateUsageScore(component, allComponents) {
  if (!component) return 0;
  
  // Direct usage count
  const directUsage = component.dependedOnBy.length;
  
  // Weighted score based on the complexity of components that depend on this
  let weightedScore = 0;
  component.dependedOnBy.forEach(depName => {
    const depComponent = allComponents.find(c => c && c.name === depName);
    if (depComponent) {
      // More complex components that depend on this give higher weight
      const weight = depComponent.complexityLevel === 'high' ? 2 : 
                    depComponent.complexityLevel === 'medium' ? 1.5 : 1;
      weightedScore += weight;
    }
  });
  
  // Usage is critical if used by high number of components or by critical components
  const isCritical = directUsage >= CRITICAL_USAGE_THRESHOLD || weightedScore >= CRITICAL_USAGE_THRESHOLD * 1.5;
  
  return {
    directUsage,
    weightedScore,
    isCritical
  };
}

/**
 * Prioritize components for migration
 * @param {Array} components List of component analyses
 * @returns {Array} Prioritized component list
 */
function prioritizeComponents(components) {
  const validComponents = components.filter(Boolean);
  
  // Calculate usage score for each component
  validComponents.forEach(component => {
    component.usageScore = calculateUsageScore(component, validComponents);
  });
  
  // Add migration priority field
  validComponents.forEach(component => {
    // Skip already migrated components
    if (component.migrated) {
      component.migrationPriority = 'migrated';
      return;
    }
    
    // Base components (low dependencies, high usage) get highest priority
    if (component.internalDependencies.length <= 1 && component.usageScore.isCritical) {
      component.migrationPriority = 'highest';
    }
    // Utility components with low complexity get high priority
    else if (component.category === CATEGORIES.UTILITY && component.complexityLevel === 'low') {
      component.migrationPriority = 'high';
    }
    // UI components with low complexity and medium usage
    else if (component.category === CATEGORIES.UI && component.complexityLevel === 'low' && component.usageScore.directUsage > 0) {
      component.migrationPriority = 'high';
    }
    // Low complexity components with few dependencies
    else if (component.complexityLevel === 'low' && component.internalDependencies.length <= 2) {
      component.migrationPriority = 'medium';
    }
    // Medium complexity components with medium usage
    else if (component.complexityLevel === 'medium' && component.usageScore.directUsage > 0) {
      component.migrationPriority = 'medium';
    }
    // Complex feature components get lower priority
    else if (component.complexityLevel === 'high' || 
            (component.category === CATEGORIES.FEATURE && component.internalDependencies.length > 3)) {
      component.migrationPriority = 'low';
    }
    // Everything else is medium priority
    else {
      component.migrationPriority = 'medium';
    }
  });
  
  return validComponents;
}

/**
 * Generate migration batches based on priority and dependencies
 * @param {Array} components Prioritized component list
 * @param {number} batchCount Number of batches to create
 * @returns {Array} Migration batches
 */
function generateMigrationBatches(components, batchCount = 6) {
  const batches = [];
  const componentsByPriority = {
    highest: components.filter(c => c.migrationPriority === 'highest'),
    high: components.filter(c => c.migrationPriority === 'high'),
    medium: components.filter(c => c.migrationPriority === 'medium'),
    low: components.filter(c => c.migrationPriority === 'low'),
    migrated: components.filter(c => c.migrationPriority === 'migrated')
  };
  
  // Helper function to get components with minimal dependencies
  const getMinimalDependencyComponents = (list, count) => {
    return [...list]
      .sort((a, b) => a.internalDependencies.length - b.internalDependencies.length)
      .slice(0, count);
  };
  
  // Batch 1: Base components (highest priority, minimum dependencies)
  batches.push({
    name: 'Batch 1: Base Components',
    description: 'Foundation components with minimum dependencies',
    components: [
      ...getMinimalDependencyComponents(componentsByPriority.highest, Math.ceil(componentsByPriority.highest.length * 0.8)),
      ...getMinimalDependencyComponents(componentsByPriority.high, Math.ceil(componentsByPriority.high.length * 0.3))
    ]
  });
  
  // Batch 2: UI Components (high priority, low complexity)
  batches.push({
    name: 'Batch 2: UI Components',
    description: 'Common UI elements and utilities',
    components: [
      ...componentsByPriority.highest.filter(c => !batches[0].components.includes(c)),
      ...getMinimalDependencyComponents(
        componentsByPriority.high.filter(c => !batches[0].components.includes(c) && 
                                          (c.category === CATEGORIES.UI || c.category === CATEGORIES.UTILITY)),
        Math.ceil(componentsByPriority.high.length * 0.5)
      ),
      ...getMinimalDependencyComponents(
        componentsByPriority.medium.filter(c => c.category === CATEGORIES.UI && c.complexityLevel === 'low'),
        Math.ceil(componentsByPriority.medium.length * 0.2)
      )
    ]
  });
  
  // Batch 3: Form and Layout Components
  batches.push({
    name: 'Batch 3: Form and Layout Components',
    description: 'Form elements, layouts, and structural components',
    components: [
      ...componentsByPriority.high.filter(c => !batches[0].components.includes(c) && 
                                         !batches[1].components.includes(c) &&
                                         (c.category === CATEGORIES.FORM || c.category === CATEGORIES.LAYOUT)),
      ...componentsByPriority.medium.filter(c => (c.category === CATEGORIES.FORM || c.category === CATEGORIES.LAYOUT) && 
                                           !batches[1].components.includes(c))
    ]
  });
  
  // Batch 4: Feature Components (Medium complexity)
  batches.push({
    name: 'Batch 4: Feature Components (Medium)',
    description: 'Medium complexity feature components',
    components: [
      ...componentsByPriority.high.filter(c => !batches.flatMap(b => b.components).includes(c)),
      ...componentsByPriority.medium.filter(c => c.category === CATEGORIES.FEATURE && 
                                           c.complexityLevel !== 'high' && 
                                           !batches.flatMap(b => b.components).includes(c))
    ]
  });
  
  // Batch 5: Complex Feature Components
  batches.push({
    name: 'Batch 5: Complex Feature Components',
    description: 'High complexity feature components',
    components: [
      ...componentsByPriority.medium.filter(c => !batches.flatMap(b => b.components).includes(c)),
      ...componentsByPriority.low.filter(c => c.complexityLevel === 'medium' || 
                                       (c.category === CATEGORIES.FEATURE && c.complexityLevel !== 'high'))
    ]
  });
  
  // Batch 6: Remaining Components
  batches.push({
    name: 'Batch 6: Remaining Components',
    description: 'All remaining components',
    components: components.filter(c => c.migrationPriority !== 'migrated' && 
                                    !batches.flatMap(b => b.components).includes(c))
  });
  
  // Add metadata to each batch
  batches.forEach((batch, index) => {
    batch.id = index + 1;
    batch.componentCount = batch.components.length;
    batch.averageComplexity = batch.components.length > 0 
      ? Math.round(batch.components.reduce((sum, c) => sum + c.complexity, 0) / batch.components.length) 
      : 0;
    batch.estimatedEffort = batch.componentCount * batch.averageComplexity / 10; // Rough estimate in hours
    
    // Only keep necessary component info
    batch.components = batch.components.map(c => ({
      name: c.name,
      path: c.path,
      complexity: c.complexity,
      complexityLevel: c.complexityLevel,
      category: c.category,
      dependencyCount: c.internalDependencies.length,
      usedByCount: c.dependedOnBy.length
    }));
  });
  
  return batches;
}

/**
 * Create a visualization of component relationships
 * @param {Array} components Component analysis list
 * @returns {string} Markdown formatted visualization
 */
function createVisualization(components) {
  let markdown = `# Component Relationship Visualization\n\n`;
  
  // Create a section for each category
  Object.values(CATEGORIES).forEach(category => {
    const categoryComponents = components.filter(c => c && c.category === category);
    if (categoryComponents.length === 0) return;
    
    markdown += `## ${category.toUpperCase()} Components\n\n`;
    
    // Create tables for each complexity level within category
    ['high', 'medium', 'low'].forEach(level => {
      const levelComponents = categoryComponents.filter(c => c.complexityLevel === level);
      if (levelComponents.length === 0) return;
      
      markdown += `### ${level.charAt(0).toUpperCase() + level.slice(1)} Complexity\n\n`;
      markdown += `| Component | Dependencies | Used By | Migration Priority |\n`;
      markdown += `|-----------|--------------|---------|-------------------|\n`;
      
      levelComponents.forEach(component => {
        // Format dependency list
        const deps = component.internalDependencies.map(d => 
          d.imports.join(', ')
        ).join('; ');
        
        // Format "used by" list
        const usedBy = component.dependedOnBy.join(', ');
        
        markdown += `| ${component.name} | ${deps || 'None'} | ${usedBy || 'None'} | ${component.migrationPriority} |\n`;
      });
      
      markdown += `\n`;
    });
  });
  
  // Add dependency graph visualization
  markdown += `\n## Dependency Graph\n\n`;
  markdown += `\`\`\`mermaid\ngraph TD\n`;
  
  // Add nodes
  components.forEach(component => {
    if (!component) return;
    
    // Choose node style based on migration priority
    let nodeStyle;
    if (component.migrationPriority === 'highest') {
      nodeStyle = `${component.name}["🔴 ${component.name}"]`;
    } else if (component.migrationPriority === 'high') {
      nodeStyle = `${component.name}["🟠 ${component.name}"]`;
    } else if (component.migrationPriority === 'medium') {
      nodeStyle = `${component.name}["🟡 ${component.name}"]`;
    } else if (component.migrationPriority === 'low') {
      nodeStyle = `${component.name}["🟢 ${component.name}"]`;
    } else {
      nodeStyle = `${component.name}["⚪ ${component.name}"]`;
    }
    
    markdown += `    ${nodeStyle}\n`;
  });
  
  // Add edges (limit to avoid overwhelming graph)
  const criticalComponents = components.filter(c => c && (c.migrationPriority === 'highest' || c.migrationPriority === 'high'));
  
  criticalComponents.forEach(component => {
    // Add dependencies
    component.internalDependencies.forEach(dep => {
      const depImports = dep.imports.join(', ');
      if (depImports) {
        markdown += `    ${component.name} -->|uses| ${depImports}\n`;
      }
    });
  });
  
  markdown += `\`\`\`\n\n`;
  
  // Add legend
  markdown += `### Legend\n\n`;
  markdown += `- 🔴 Highest Migration Priority\n`;
  markdown += `- 🟠 High Migration Priority\n`;
  markdown += `- 🟡 Medium Migration Priority\n`;
  markdown += `- 🟢 Low Migration Priority\n`;
  markdown += `- ⚪ Already Migrated\n`;
  
  return markdown;
}

/**
 * Main function to run the inventory analysis
 */
async function main() {
  console.log(chalk.blue(`\n🚀 Starting Component Inventory Analysis\n`));
  
  try {
    // Find all component files
    console.log(chalk.cyan('Finding component files...'));
    const componentFiles = findComponentFiles();
    console.log(chalk.green(`Found ${componentFiles.length} component files`));
    
    // Analyze components in batches to avoid memory issues
    console.log(chalk.cyan('\nAnalyzing components...'));
    const componentAnalyses = [];
    
    // Process in batches
    for (let i = 0; i < componentFiles.length; i += BATCH_SIZE) {
      const batch = componentFiles.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(componentFiles.length / BATCH_SIZE);
      
      console.log(chalk.gray(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} components)`));
      
      const batchAnalyses = await Promise.all(batch.map(file => analyzeComponent(file)));
      componentAnalyses.push(...batchAnalyses);
      
      // Memory management - force garbage collection if possible
      if (global.gc) {
        global.gc();
      }
    }
    
    // Build dependency graph
    console.log(chalk.cyan('\nBuilding dependency graph...'));
    const componentsWithDependencies = buildDependencyGraph(componentAnalyses);
    
    // Prioritize components
    console.log(chalk.cyan('\nPrioritizing components for migration...'));
    const prioritizedComponents = prioritizeComponents(componentsWithDependencies);
    
    // Generate migration batches
    console.log(chalk.cyan('\nGenerating migration batches...'));
    const migrationBatches = generateMigrationBatches(prioritizedComponents);
    
    // Create visualization
    console.log(chalk.cyan('\nCreating component relationship visualization...'));
    const visualization = createVisualization(prioritizedComponents);
    
    // Write results to files
    console.log(chalk.cyan('\nSaving results...'));
    
    // Full inventory
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(prioritizedComponents, null, 2));
    console.log(chalk.green(`✓ Component inventory saved to ${INVENTORY_FILE}`));
    
    // Visualization
    fs.writeFileSync(VISUALIZATION_FILE, visualization);
    console.log(chalk.green(`✓ Component visualization saved to ${VISUALIZATION_FILE}`));
    
    // Migration roadmap
    fs.writeFileSync(ROADMAP_FILE, JSON.stringify(migrationBatches, null, 2));
    console.log(chalk.green(`✓ Migration roadmap saved to ${ROADMAP_FILE}`));
    
    // Summary
    console.log(chalk.yellow('\n📊 COMPONENT INVENTORY SUMMARY'));
    console.log(chalk.gray('════════════════════════════════════════════'));
    console.log(`Total components: ${prioritizedComponents.length}`);
    
    // Count by category
    const categoryCounts = {};
    Object.values(CATEGORIES).forEach(category => {
      categoryCounts[category] = prioritizedComponents.filter(c => c.category === category).length;
    });
    console.log('\nComponents by category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    
    // Count by complexity
    const complexityCounts = {
      high: prioritizedComponents.filter(c => c.complexityLevel === 'high').length,
      medium: prioritizedComponents.filter(c => c.complexityLevel === 'medium').length,
      low: prioritizedComponents.filter(c => c.complexityLevel === 'low').length
    };
    console.log('\nComponents by complexity:');
    Object.entries(complexityCounts).forEach(([level, count]) => {
      console.log(`  ${level}: ${count}`);
    });
    
    // Count by migration priority
    const priorityCounts = {
      highest: prioritizedComponents.filter(c => c.migrationPriority === 'highest').length,
      high: prioritizedComponents.filter(c => c.migrationPriority === 'high').length,
      medium: prioritizedComponents.filter(c => c.migrationPriority === 'medium').length,
      low: prioritizedComponents.filter(c => c.migrationPriority === 'low').length,
      migrated: prioritizedComponents.filter(c => c.migrationPriority === 'migrated').length
    };
    console.log('\nComponents by migration priority:');
    Object.entries(priorityCounts).forEach(([priority, count]) => {
      console.log(`  ${priority}: ${count}`);
    });
    
    // Migration batches summary
    console.log('\nMigration batches:');
    migrationBatches.forEach(batch => {
      console.log(`  ${batch.name}: ${batch.componentCount} components (avg complexity: ${batch.averageComplexity})`);
    });
    
    console.log(chalk.gray('════════════════════════════════════════════'));
    console.log(chalk.green('\n✅ Component inventory completed successfully!\n'));
    
  } catch (error) {
    console.error(chalk.red(`\n❌ Error during component inventory: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();