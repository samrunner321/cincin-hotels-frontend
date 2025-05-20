const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function updateImports() {
  console.log('Starting component import path correction...');
  
  // Files in /src/ that import from '../components/'
  const srcFiles = await glob('src/**/*.{ts,tsx}');
  
  let updateCount = 0;
  
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if the file imports from '../components/'
    if (content.includes("from '../components/")) {
      console.log(`Checking file: ${file}`);
      
      // Replace imports from '../components/' with imports from the correct location
      let newContent = content.replace(
        /from ['"]\.\.\/components\/([^'"]+)['"]/g, 
        (match, componentPath) => {
          return `from '../components/${componentPath}'`;
        }
      );
      
      // Only write the file if changes were made
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        updateCount++;
        console.log(`Updated: ${file}`);
      }
    }
  }
  
  // Files in /src/ that import from '../../components/'
  // This is more complex and needs to be handled carefully
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if the file imports from '../../components/'
    if (content.includes("from '../../components/")) {
      console.log(`Checking file with deep imports: ${file}`);
      
      // Replace imports from '../../components/' with imports from the correct location
      let newContent = content.replace(
        /from ['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g, 
        (match, componentPath) => {
          // Determine the relative path based on the file's location
          const fileDirDepth = file.split('/').length - 2; // -2 for 'src' and the filename
          const relativePath = '../'.repeat(fileDirDepth) + 'components/';
          return `from '${relativePath}${componentPath}'`;
        }
      );
      
      // Only write the file if changes were made
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        updateCount++;
        console.log(`Updated deep import: ${file}`);
      }
    }
  }
  
  // Handle test files that might import from components
  const testFiles = await glob('__tests__/**/*.{ts,tsx}');
  
  for (const file of testFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if the file imports from '../../components/'
    if (content.includes("from '../../components/")) {
      console.log(`Checking test file: ${file}`);
      
      // Replace imports from '../../components/' with imports from /src/components/
      let newContent = content.replace(
        /from ['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g, 
        (match, componentPath) => {
          return `from '../../src/components/${componentPath}'`;
        }
      );
      
      // Only write the file if changes were made
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        updateCount++;
        console.log(`Updated test file: ${file}`);
      }
    }
  }
  
  // Handle Become_Member directory
  const becomeMemberFiles = await glob('Become_Member/**/*.{js,jsx}');
  
  for (const file of becomeMemberFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    if (content.includes("from '../../components/")) {
      console.log(`Checking Become_Member file: ${file}`);
      
      let newContent = content.replace(
        /from ['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g, 
        (match, componentPath) => {
          return `from '../../src/components/${componentPath}'`;
        }
      );
      
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        updateCount++;
        console.log(`Updated Become_Member file: ${file}`);
      }
    }
  }
  
  console.log(`Total files updated: ${updateCount}`);
}

updateImports().catch(console.error);