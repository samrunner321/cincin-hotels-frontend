/**
 * Test script for checking Directus API access
 */

const axios = require('axios');

// Configuration 
const DIRECTUS_URL = 'http://localhost:8055';
const PUBLIC_TOKEN = 'hWGovZk89VM0_3bNC96aRPnMhwVb9ZPE';

async function main() {
  console.log('🔍 Testing Directus API access...');
  
  // Test collections that should be publicly accessible 
  const collections = [
    'destinations',
    'hotels',
    'categories',
    'rooms',
    'pages'
  ];
  
  for (const collection of collections) {
    try {
      console.log(`Testing access to ${collection}...`);
      
      const response = await axios.get(`${DIRECTUS_URL}/items/${collection}`, {
        headers: {
          'Authorization': `Bearer ${PUBLIC_TOKEN}`
        }
      });
      
      const count = response.data.data ? response.data.data.length : 0;
      console.log(`✅ Successfully accessed ${collection} collection (${count} items)`); 
      
      if (response.data.data && response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        console.log(`First item:`, JSON.stringify(firstItem, null, 2).substring(0, 200) + '...');
      }
    } catch (error) {
      console.error(`❌ Error accessing ${collection}:`, error.response?.data || error.message);
    } 
  }
  
  // Test translation collections
  const translationCollections = [
    'destinations_translations',
    'hotels_translations', 
    'categories_translations',
    'rooms_translations'
  ];
  
  for (const collection of translationCollections) {
    try {
      console.log(`Testing access to ${collection}...`);
      
      const response = await axios.get(`${DIRECTUS_URL}/items/${collection}`, {
        headers: {
          'Authorization': `Bearer ${PUBLIC_TOKEN}`
        }
      });
      
      const count = response.data.data ? response.data.data.length : 0;
      console.log(`✅ Successfully accessed ${collection} collection (${count} items)`);
      
      if (response.data.data && response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        console.log(`First item:`, JSON.stringify(firstItem, null, 2).substring(0, 200) + '...');
      }
    } catch (error) {
      console.error(`❌ Error accessing ${collection}:`, error.response?.data || error.message);
    }
  }
}

main().catch(error => {
  console.error('❌ Unexpected error:', error);
});