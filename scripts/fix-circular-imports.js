/**
 * This script fixes circular imports by replacing alias paths with direct relative paths
 * in components that are causing build issues.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Files to fix and their corresponding imports
const FILES_TO_FIX = [
  {
    path: 'components/destinations/detail/DestinationHero.jsx',
    oldImport: "from '@/components/destinations/detail/DestinationHero'",
    newImport: "from '../../../src/components/destinations/detail/DestinationHero'"
  },
  {
    path: 'components/forms/ContactForm.jsx',
    oldImport: "from '@/components/forms/ContactForm'",
    newImport: "from '../../src/components/forms/ContactForm'"
  },
  {
    path: 'components/home/NewsletterSignup.jsx',
    oldImport: "from '@/components/home/NewsletterSignup'",
    newImport: "from '../../src/components/home/NewsletterSignup'"
  },
  {
    path: 'components/hotels/HotelFilters.jsx',
    oldImport: "from '@components/hotels/HotelFilters'",
    newImport: "from '../../src/components/hotels/HotelFilters'"
  },
  {
    path: 'components/journal_post/RelatedHotelCard.jsx',
    oldImport: "from '@/components/journal_post/RelatedHotelCard'",
    newImport: "from '../../src/components/journal_post/RelatedHotelCard'"
  }
];

/**
 * Find all files that use a specific import pattern in the components folder
 */
async function findComponentsWithImportPattern(pattern) {
  const componentDir = path.resolve('components');
  const files = await scanDirectory(componentDir);
  
  const matchingFiles = [];
  
  for (const file of files) {
    try {
      const content = await readFile(file, 'utf8');
      if (content.includes(pattern)) {
        matchingFiles.push({
          path: path.relative(process.cwd(), file),
          oldImport: pattern,
          newImport: generateRelativeImport(file)
        });
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error.message);
    }
  }
  
  return matchingFiles;
}

/**
 * Generate a relative import path for a component file
 */
function generateRelativeImport(filePath) {
  // Determine the number of levels up from the components folder
  const relativePath = path.relative(process.cwd(), filePath);
  const parts = relativePath.split(path.sep);
  const componentsIndex = parts.indexOf('components');
  
  if (componentsIndex >= 0) {
    // Extract the component path after 'components/'
    const componentPath = parts.slice(componentsIndex + 1).join('/');
    // Count how many directories deep we are to create the proper ../ prefix
    const depth = parts.length - componentsIndex - 1;
    const relativePrefixes = Array(depth).fill('..').join('/');
    
    return `from '${relativePrefixes}/src/components/${componentPath}'`;
  }
  
  return null;
}

/**
 * Scan directory recursively for JS/JSX files
 */
async function scanDirectory(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? scanDirectory(res) : res;
  }));
  return files.flat().filter(file => file.endsWith('.js') || file.endsWith('.jsx'));
}

/**
 * Fix a specific file by replacing its imports
 */
async function fixFile(fileConfig) {
  try {
    const fullPath = path.resolve(fileConfig.path);
    const content = await readFile(fullPath, 'utf8');
    
    // Replace the import
    let newContent = content.replace(fileConfig.oldImport, fileConfig.newImport);
    
    // Only write if something changed
    if (newContent !== content) {
      await writeFile(fullPath, newContent, 'utf8');
      console.log(`✅ Fixed imports in ${fileConfig.path}`);
      return { path: fileConfig.path, fixed: true };
    } else {
      console.log(`⚠️ No changes made to ${fileConfig.path}`);
      return { path: fileConfig.path, fixed: false };
    }
  } catch (error) {
    console.error(`❌ Error fixing ${fileConfig.path}:`, error.message);
    return { path: fileConfig.path, fixed: false, error: error.message };
  }
}

/**
 * Find all files with @/components or @components imports
 */
async function findAllProblematicImports() {
  console.log('🔍 Scanning for components with problematic imports...');
  
  const atComponentsFiles = await findComponentsWithImportPattern("from '@/components/");
  const atComponentsAliasFiles = await findComponentsWithImportPattern("from '@components/");
  
  return [...atComponentsFiles, ...atComponentsAliasFiles];
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔧 Starting to fix circular import issues...');
    
    // Fix known problematic files first
    const fixedFilesPromises = FILES_TO_FIX.map(fileConfig => fixFile(fileConfig));
    const fixedFiles = await Promise.all(fixedFilesPromises);
    
    // Find all other potentially problematic files
    const problematicFiles = await findAllProblematicImports();
    
    if (problematicFiles.length > 0) {
      console.log(`\n📝 Found ${problematicFiles.length} additional files that may have circular imports:`);
      problematicFiles.forEach(file => {
        console.log(`  - ${file.path} (${file.oldImport} => ${file.newImport})`);
      });
      
      console.log('\n🔄 Fixing these additional files...');
      const additionalFixesPromises = problematicFiles.map(fileConfig => fixFile(fileConfig));
      const additionalFixedFiles = await Promise.all(additionalFixesPromises);
      
      const fixedCount = additionalFixedFiles.filter(result => result.fixed).length;
      console.log(`\n✨ Fixed imports in ${fixedCount} additional files.`);
    } else {
      console.log('\n✅ No additional problematic imports found.');
    }
    
    const totalFixedCount = fixedFiles.filter(result => result.fixed).length;
    console.log(`\n✨ Done! Fixed imports in ${totalFixedCount} files from the predefined list.`);
    
  } catch (error) {
    console.error('Error executing script:', error);
    process.exit(1);
  }
}

// Run the script
main();