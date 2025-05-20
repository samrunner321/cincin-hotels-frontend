#!/usr/bin/env node

/**
 * Fix Remaining Imports Script
 * 
 * This script fixes the remaining broken imports in app pages,
 * specifically for files that reference the old components directory.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

// Path mappings for components
const COMPONENT_MAPPINGS = {
  // Common components
  '../../components/common/PageHero': '../../src/components/common/PageHero',
  '../../components/common/ContentBlock': '../../src/components/common/ContentBlock',
  '../../../components/common/PageHero': '../../../src/components/common/PageHero',
  '../../../components/common/ContentBlock': '../../../src/components/common/ContentBlock',
  '../../components/common/AssetManager': '../../src/components/common/AssetPreloader',
  '../../../components/common/AssetManager': '../../../src/components/common/AssetPreloader',
  '../../../../components/common/AssetManager': '../../../../src/components/common/AssetPreloader',
  
  // Hotel components
  '../../components/hotel-detail/HotelDetailPage': '../../src/components/hotel-detail/HotelDetailPage',
  '../../../components/hotel-detail/HotelDetailPage': '../../../src/components/hotel-detail/HotelDetailPage',
  '../../../../components/hotel-detail/HotelRoomsPage': '../../../../src/components/hotel-detail/HotelRoomsPage',
  '../../components/hotels/HotelsPage': '../../src/components/hotels/HotelsPage',
  '../../../components/hotels/HotelList': '../../../src/components/hotels/HotelList',
  '../../../components/hotels/CategoryBar': '../../../src/components/ui/buttons/CategoryButton',
  
  // Destination components
  '../../components/destinations/Hero': '../../src/components/destinations/Hero',
  '../../components/destinations/DestinationExplorer': '../../src/components/destinations/DestinationExplorer',
  '../../components/destinations/FeaturedDestination': '../../src/components/destinations/FeaturedDestination',
  '../../components/destinations/PopularHotels': '../../src/components/destinations/PopularHotels',
  '../../components/destinations/DestinationInteractiveFeatures': '../../src/components/destinations/DestinationInteractiveFeatures',
  '../../../components/destinations/detail/DestinationHero': '../../../src/components/destinations/detail/DestinationHero',
  '../../../components/destinations/detail/DestinationContentTabs': '../../../src/components/destinations/detail/DestinationContentTabs',
  '../../../components/destinations/detail/OverviewSection': '../../../src/components/destinations/detail/OverviewSection',
  '../../../components/destinations/detail/HotelsSection': '../../../src/components/destinations/detail/HotelsSection',
  '../../../components/destinations/detail/DiningSection': '../../../src/components/destinations/detail/DiningSection',
  '../../../components/destinations/detail/ActivitiesSection': '../../../src/components/destinations/detail/ActivitiesSection',
  '../../../components/destinations/detail/InfoSection': '../../../src/components/destinations/detail/InfoSection',
  '../../../components/destinations/RecommendedDestinations': '../../../src/components/destinations/RecommendedDestinations',
  
  // Forms components
  '../../components/forms/MembershipForm': '../../src/components/forms/MembershipForm',
  '../../components/forms/MembershipHero': '../../src/components/forms/MembershipHero',
  '../../components/forms/MembershipBenefits': '../../src/components/forms/MembershipBenefits',
  '../../components/forms/ContactForm': '../../src/components/forms/ContactForm',
  
  // Journal components
  '../../components/journal/JournalGrid': '../../src/components/journal/JournalGrid',
  '../../components/journal/Hero': '../../src/components/journal/Hero',
  '../../../components/journal_post': '../../../src/components/journal_post',
  
  // Home components
  '../../components/home/NewsletterSignup': '../../src/components/home/NewsletterSignup',
  '../../../components/home/NewsletterSignup': '../../../src/components/home/NewsletterSignup',
  
  // Other utility imports
  '../../../components/common/directus-client': '../../../src/lib/directus-client',
};

// Target app directories
const APP_DIRS = [
  'app/about',
  'app/careers',
  'app/contact',
  'app/cookies',
  'app/destinations',
  'app/hotels',
  'app/imprint',
  'app/journal',
  'app/membership',
  'app/partner',
  'app/press',
  'app/privacy',
  'app/terms',
];

// File patterns to search
const FILE_PATTERNS = [
  'page.js',
  'layout.js',
  '*/page.js',
  '*/layout.js',
  '*/*/page.js',
  '*/*/layout.js',
];

// Regex for finding imports
const IMPORT_REGEX = /from\s+(['"])([^'"]+)(['"])/g;
const DYNAMIC_IMPORT_REGEX = /import\((['"])([^'"]+)(['"])\)/g;

// Root directory
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Fix import paths in a file
 */
async function fixImportsInFile(filePath) {
  try {
    if (!await exists(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return false;
    }
    
    let content = await readFile(filePath, 'utf8');
    const originalContent = content;
    
    // Fix regular imports
    content = content.replace(IMPORT_REGEX, (match, quote1, importPath, quote2) => {
      const newPath = COMPONENT_MAPPINGS[importPath];
      if (newPath) {
        console.log(`${filePath}: ${importPath} -> ${newPath}`);
        return `from ${quote1}${newPath}${quote2}`;
      }
      return match;
    });
    
    // Fix dynamic imports
    content = content.replace(DYNAMIC_IMPORT_REGEX, (match, quote1, importPath, quote2) => {
      const newPath = COMPONENT_MAPPINGS[importPath];
      if (newPath) {
        console.log(`${filePath} (dynamic): ${importPath} -> ${newPath}`);
        return `import(${quote1}${newPath}${quote2})`;
      }
      return match;
    });
    
    // Only write if changed
    if (content !== originalContent) {
      await writeFile(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

/**
 * Process a directory to fix imports
 */
async function processDirectory(dirPath) {
  try {
    const absPath = path.resolve(ROOT_DIR, dirPath);
    
    // Check if directory exists
    if (!await exists(absPath)) {
      console.log(`Directory does not exist: ${absPath}`);
      return 0;
    }
    
    let fixedCount = 0;
    
    // Process each file pattern
    for (const pattern of FILE_PATTERNS) {
      const filePath = path.join(absPath, pattern);
      
      // Handle glob patterns
      if (pattern.includes('*')) {
        const subdir = pattern.split('/')[0];
        const filename = pattern.split('/').pop();
        
        // Check if subdir exists
        const subdirPath = path.join(absPath, subdir);
        if (await exists(subdirPath)) {
          const entries = await fs.promises.readdir(subdirPath);
          
          // Iterate through subdir entries
          for (const entry of entries) {
            const subEntryPath = path.join(subdirPath, entry);
            const stats = await fs.promises.stat(subEntryPath);
            
            if (stats.isDirectory() && pattern.split('/').length > 2) {
              // Handle nested patterns like */*/page.js
              const fileToCheck = path.join(subEntryPath, filename);
              if (await exists(fileToCheck)) {
                const fixed = await fixImportsInFile(fileToCheck);
                if (fixed) fixedCount++;
              }
            } else if (stats.isFile() && entry === filename) {
              // Handle patterns like */page.js
              const fixed = await fixImportsInFile(subEntryPath);
              if (fixed) fixedCount++;
            }
          }
        }
      } else {
        // Handle direct file paths
        if (await exists(filePath)) {
          const fixed = await fixImportsInFile(filePath);
          if (fixed) fixedCount++;
        }
      }
    }
    
    return fixedCount;
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
    return 0;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Fixing remaining import paths in app pages...');
  
  let totalFixed = 0;
  
  // Process each target directory
  for (const dir of APP_DIRS) {
    console.log(`\nProcessing directory: ${dir}`);
    const fixedCount = await processDirectory(dir);
    totalFixed += fixedCount;
    console.log(`Fixed ${fixedCount} files in ${dir}`);
  }
  
  console.log(`\n✅ Import path correction complete! Fixed ${totalFixed} files.`);
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});