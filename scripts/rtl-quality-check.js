/**
 * RTL Quality Check Script
 * 
 * This script analyzes components that have been updated for RTL support
 * to ensure they meet the quality standards for bidirectional text support.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Base directories to check
const SRC_DIR = path.resolve(__dirname, '../src');
const COMPONENTS_DIR = path.resolve(SRC_DIR, 'components');

// Key RTL indicators to check for
const RTL_INDICATORS = [
  { pattern: 'direction', description: 'Direction property or attribute' },
  { pattern: 'isRtl', description: 'RTL state variable' },
  { pattern: 'useRtl', description: 'RTL custom hook' },
  { pattern: 'useEnhancedTranslations', description: 'Enhanced translations hook with RTL support' },
  { pattern: 'rtl-utils', description: 'RTL utility functions' },
  { pattern: 'dir=', description: 'Direction HTML attribute' },
  { pattern: /\[dir=['"]rtl['"]]/g, description: 'RTL CSS selector' },
  { pattern: 'rtlFlip', description: 'RTL class flipping utility' },
  { pattern: /Rtl[A-Z]/g, description: 'RTL-specific class or component variant' }
];

// Components that should have RTL support
const CRITICAL_RTL_COMPONENTS = [
  'BaseTable',
  'BaseTabs',
  'BaseInput', 
  'BaseNavigation',
  'Layout',
  'Navbar',
  'Footer'
];

// Function to check a file for RTL support
function checkFileForRtlSupport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [];
    let score = 0;
    
    RTL_INDICATORS.forEach(indicator => {
      if (typeof indicator.pattern === 'string') {
        if (content.includes(indicator.pattern)) {
          matches.push(indicator.description);
          score++;
        }
      } else if (indicator.pattern instanceof RegExp) {
        if (indicator.pattern.test(content)) {
          matches.push(indicator.description);
          score++;
        }
      }
    });
    
    return { score, matches };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return { score: 0, matches: [] };
  }
}

// Function to check CSS files for RTL selectors
function checkCssForRtlSupport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const rtlSelectorRegex = /\[dir\s*=\s*(['"])rtl\1\]/g;
    const rtlSelectorMatches = content.match(rtlSelectorRegex) || [];
    
    const rtlClassRegex = /\.(.*Rtl)\s*\{/g;
    const rtlClassMatches = content.match(rtlClassRegex) || [];
    
    const uniqueRtlSelectors = [...new Set([...rtlSelectorMatches, ...rtlClassMatches])];
    
    return {
      score: uniqueRtlSelectors.length,
      matches: uniqueRtlSelectors
    };
  } catch (error) {
    console.error(`Error reading CSS file ${filePath}:`, error);
    return { score: 0, matches: [] };
  }
}

// Function to check that a component suite has tests
function checkComponentHasTests(componentName, componentDir) {
  const testDirPattern = path.join(componentDir, '**/__tests__/*.rtl.test.{js,jsx,ts,tsx}');
  const testFiles = glob.sync(testDirPattern);
  return testFiles.length > 0;
}

// Main function to analyze all components
function analyzeRtlComponents() {
  console.log('RTL Quality Check - Component Analysis\n');
  
  // Find all component files
  const componentFiles = glob.sync(path.join(COMPONENTS_DIR, '**/*.{js,jsx,ts,tsx}'));
  const cssFiles = glob.sync(path.join(COMPONENTS_DIR, '**/*.{css,scss}'));
  
  // Process component files
  const results = [];
  
  componentFiles.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath);
    const componentName = path.basename(filePath, path.extname(filePath));
    const componentDir = path.dirname(filePath);
    
    // Skip test files
    if (filePath.includes('__tests__') || filePath.includes('.test.') || filePath.includes('.spec.')) {
      return;
    }
    
    // Check for RTL support
    const { score, matches } = checkFileForRtlSupport(filePath);
    
    // Check for tests
    const hasTests = checkComponentHasTests(componentName, componentDir);
    
    // Add to results
    results.push({
      componentName,
      relativePath,
      score,
      matches,
      hasTests,
      isCritical: CRITICAL_RTL_COMPONENTS.includes(componentName)
    });
  });
  
  // Process CSS files
  cssFiles.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath);
    const cssName = path.basename(filePath, path.extname(filePath));
    
    // Check for RTL support in CSS
    const { score, matches } = checkCssForRtlSupport(filePath);
    
    if (score > 0) {
      results.push({
        componentName: `${cssName} (CSS)`,
        relativePath,
        score,
        matches,
        hasTests: false, // CSS files themselves don't have tests
        isCritical: false
      });
    }
  });
  
  // Sort by score, descending
  results.sort((a, b) => b.score - a.score);
  
  // Print results
  console.log('=== Components with RTL Support ===\n');
  
  results.forEach(result => {
    if (result.score > 0) {
      console.log(`${result.componentName} (${result.relativePath})`);
      console.log(`  RTL Score: ${result.score}`);
      console.log(`  RTL Features: ${result.matches.join(', ')}`);
      console.log(`  Has RTL Tests: ${result.hasTests ? 'Yes' : 'No'}`);
      console.log(`  Critical Component: ${result.isCritical ? 'Yes' : 'No'}`);
      console.log('');
    }
  });
  
  // Check critical components without RTL support
  console.log('\n=== Critical Components Missing RTL Support ===\n');
  
  const missingRtlComponents = CRITICAL_RTL_COMPONENTS.filter(criticalComponent => {
    return !results.some(result => 
      result.componentName === criticalComponent && result.score > 0
    );
  });
  
  if (missingRtlComponents.length === 0) {
    console.log('All critical components have RTL support! 🎉');
  } else {
    missingRtlComponents.forEach(component => {
      console.log(`⚠️ ${component} is missing RTL support`);
    });
  }
  
  // Summary stats
  const totalComponents = results.length;
  const componentsWithRtl = results.filter(r => r.score > 0).length;
  const componentsWithTests = results.filter(r => r.hasTests).length;
  const criticalWithRtl = results.filter(r => r.isCritical && r.score > 0).length;
  
  console.log('\n=== Summary ===\n');
  console.log(`Total Components Analyzed: ${totalComponents}`);
  console.log(`Components with RTL Support: ${componentsWithRtl} (${Math.round(componentsWithRtl / totalComponents * 100)}%)`);
  console.log(`Components with RTL Tests: ${componentsWithTests}`);
  console.log(`Critical Components with RTL: ${criticalWithRtl}/${CRITICAL_RTL_COMPONENTS.length}`);
  
  return {
    totalComponents,
    componentsWithRtl,
    componentsWithTests,
    criticalWithRtl,
    criticalComponentsCount: CRITICAL_RTL_COMPONENTS.length,
    missingRtlComponents
  };
}

// Run the analysis
const results = analyzeRtlComponents();

// Export results for other scripts
module.exports = results;

// Exit with error if critical components are missing RTL support
if (results.missingRtlComponents.length > 0) {
  process.exit(1);
}