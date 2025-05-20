/**
 * Convert JSX/JS files to TSX with proper typing
 * This script handles the conversion of React components to TypeScript
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Converts a JS/JSX file to TypeScript
 * @param {string} sourceFile - Path to source JS/JSX file
 * @param {string} destFile - Path to destination TS/TSX file
 * @param {Object} options - Additional options
 * @returns {boolean} - Success status
 */
function convertToTypeScript(sourceFile, destFile, options = {}) {
  try {
    console.log(`Converting ${sourceFile} to TypeScript...`);
    
    // Read the source file
    const sourceContent = fs.readFileSync(sourceFile, 'utf8');
    
    // Create basic TypeScript conversion with prop types
    let tsContent = addTypeScriptDefinitions(sourceContent, path.basename(sourceFile), options);
    
    // Create the destination directory if it doesn't exist
    const destDir = path.dirname(destFile);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Write the TypeScript file
    fs.writeFileSync(destFile, tsContent);
    
    console.log(`Successfully converted to ${destFile}`);
    return true;
  } catch (error) {
    console.error(`Error converting ${sourceFile}:`, error);
    return false;
  }
}

/**
 * Adds TypeScript definitions to the content
 * @param {string} content - The source file content
 * @param {string} fileName - The source file name
 * @param {Object} options - Additional options
 * @returns {string} - Content with TypeScript definitions
 */
function addTypeScriptDefinitions(content, fileName, options) {
  // Extract component name from file name
  const componentName = fileName.replace(/\.(jsx|js)$/, '');
  
  // Check if it's a functional component
  const isFunctionalComponent = /function\s+(\w+)|const\s+(\w+)\s*=\s*(\([^)]*\)|)\s*=>/i.test(content);
  
  // Extract imports to add them before our type definitions
  const importMatches = content.match(/^import[^\n]+$/gm) || [];
  const imports = importMatches.join('\n');
  const contentWithoutImports = content.replace(/^import[^\n]+$/gm, '').trim();
  
  // Basic template for TypeScript conversion with React import added
  let tsContent = '';
  
  // Ensure React is imported
  if (!imports.includes('import React')) {
    tsContent += 'import React from \'react\';\n';
  }
  
  // Add original imports
  tsContent += imports + '\n\n';
  
  // Add interface for props
  // Extract prop destructuring from function signature or props parameter
  const propsMatch = content.match(/(?:function\s+\w+\s*\(\s*{\s*([^}]*)\s*}\s*\)|const\s+\w+\s*=\s*\(\s*{\s*([^}]*)\s*}\s*\)|const\s+\w+\s*=\s*\(\s*props\s*\))/);
  let propsInterfaceName = `${componentName}Props`;
  let propsInterface = '';
  
  if (propsMatch) {
    const propList = (propsMatch[1] || propsMatch[2] || '').split(',')
      .map(prop => prop.trim())
      .filter(prop => prop && !prop.includes('...'));
    
    if (propList.length > 0) {
      propsInterface = `interface ${propsInterfaceName} {\n`;
      
      propList.forEach(prop => {
        // Extract prop name and default value
        const [propName, defaultValue] = prop.split('=').map(p => p.trim());
        const isRequired = !defaultValue;
        
        // Try to infer type from default value
        let propType = 'any';
        if (defaultValue) {
          if (defaultValue === 'true' || defaultValue === 'false') {
            propType = 'boolean';
          } else if (!isNaN(Number(defaultValue))) {
            propType = 'number';
          } else if (defaultValue.startsWith('"') || defaultValue.startsWith("'")) {
            propType = 'string';
          } else if (defaultValue.startsWith('[')) {
            propType = 'any[]';
          } else if (defaultValue.startsWith('{')) {
            propType = 'Record<string, any>';
          } else if (defaultValue === 'null') {
            propType = 'null';
          } else if (defaultValue === 'undefined') {
            propType = 'undefined';
          }
        }
        
        // Add the prop to the interface
        propsInterface += `  ${propName}${isRequired ? '' : '?'}: ${propType};\n`;
      });
      
      propsInterface += '}\n\n';
      tsContent += propsInterface;
    }
  } else {
    // Default empty props interface
    tsContent += `interface ${propsInterfaceName} {}\n\n`;
  }
  
  // Add the component with type annotation
  if (isFunctionalComponent) {
    // Look for the component definition
    const funcComponentMatch = content.match(/function\s+(\w+)\s*\(/);
    const arrowComponentMatch = content.match(/const\s+(\w+)\s*=\s*(\([^)]*\)|)\s*=>/);
    
    if (funcComponentMatch) {
      const componentNameFromFunc = funcComponentMatch[1];
      // Replace function declaration with typed version
      tsContent += contentWithoutImports.replace(
        new RegExp(`function\\s+${componentNameFromFunc}\\s*\\(`),
        `const ${componentNameFromFunc}: React.FC<${propsInterfaceName}> = (`
      );
    } else if (arrowComponentMatch) {
      const componentNameFromArrow = arrowComponentMatch[1];
      // Replace arrow function declaration with typed version
      tsContent += contentWithoutImports.replace(
        new RegExp(`const\\s+${componentNameFromArrow}\\s*=\\s*`),
        `const ${componentNameFromArrow}: React.FC<${propsInterfaceName}> = `
      );
    } else {
      // Fallback: Just add the content as is
      tsContent += contentWithoutImports;
    }
  } else {
    // For class components or other cases, just add the content as is
    tsContent += contentWithoutImports;
  }
  
  return tsContent;
}

/**
 * Creates a forwarding file that imports from the new location
 * @param {string} sourceFile - Original source file path
 * @param {string} destFile - New TypeScript file path
 */
function createForwardingFile(sourceFile, destFile) {
  try {
    console.log(`Creating forwarding file at ${sourceFile}...`);
    
    // Calculate the relative path from source to destination
    const sourceDir = path.dirname(sourceFile);
    const relPath = path.relative(sourceDir, destFile);
    
    // Ensure relative path starts with ./ or ../
    const importPath = relPath.startsWith('.') ? relPath : `./${relPath}`;
    
    // Create the forwarding content
    const forwardingContent = `// This file is deprecated and will be removed soon.
// Please import from '${importPath.replace(/\\/g, '/')}' instead.

import Component from '${importPath.replace(/\\/g, '/')}';
export default Component;
`;
    
    // Write the forwarding file
    fs.writeFileSync(sourceFile, forwardingContent);
    
    console.log(`Successfully created forwarding file at ${sourceFile}`);
    return true;
  } catch (error) {
    console.error(`Error creating forwarding file at ${sourceFile}:`, error);
    return false;
  }
}

// Command line interface
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node convert-to-tsx.js <sourceFile> <destFile> [--no-forwarding]');
    process.exit(1);
  }
  
  const sourceFile = args[0];
  const destFile = args[1];
  const createForwarding = !args.includes('--no-forwarding');
  
  return { sourceFile, destFile, createForwarding };
}

// Main function
function main() {
  const { sourceFile, destFile, createForwarding } = parseArgs();
  
  console.log(`Converting ${sourceFile} to ${destFile}`);
  
  // Check if source file exists
  if (!fs.existsSync(sourceFile)) {
    console.error(`Source file ${sourceFile} does not exist.`);
    process.exit(1);
  }
  
  // Convert the file
  const success = convertToTypeScript(sourceFile, destFile);
  
  if (success && createForwarding) {
    createForwardingFile(sourceFile, destFile);
  }
  
  console.log('Conversion completed.');
}

// Execute if script is called directly
if (require.main === module) {
  main();
} else {
  // Export functions for use in other scripts
  module.exports = {
    convertToTypeScript,
    createForwardingFile
  };
}