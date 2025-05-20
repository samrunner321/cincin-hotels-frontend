/**
 * Test script for checking Next.js access to Directus
 */

const { getDestinations, getHotels, getCategories } = require('./lib/api');

async function main() {
  console.log('🔍 Testing Next.js access to Directus data...');
  
  try {
    console.log('Fetching destinations...');
    const destinations = await getDestinations();
    console.log(`✅ Found ${destinations.length} destinations`);
    
    if (destinations.length > 0) {
      console.log('First destination:', JSON.stringify(destinations[0], null, 2).substring(0, 300) + '...');
    }
    
    console.log('\nFetching hotels...');
    const hotels = await getHotels();
    console.log(`✅ Found ${hotels.length} hotels`);
    
    if (hotels.length > 0) {
      console.log('First hotel:', JSON.stringify(hotels[0], null, 2).substring(0, 300) + '...');
    }
    
    console.log('\nFetching categories...');
    const categories = await getCategories();
    console.log(`✅ Found ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log('First category:', JSON.stringify(categories[0], null, 2).substring(0, 300) + '...');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();