/**
 * Test script for checking direct access to Directus API endpoints
 */

const axios = require('axios');

// Configuration
const DIRECTUS_URL = 'http://localhost:8055';
const PUBLIC_TOKEN = 'hWGovZk89VM0_3bNC96aRPnMhwVb9ZPE';

async function getDestinations() {
  try {
    const response = await axios.get(`${DIRECTUS_URL}/items/destinations`, {
      headers: { 'Authorization': `Bearer ${PUBLIC_TOKEN}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching destinations:', error.response?.data || error.message);
    return [];
  }
}

async function getHotels() {
  try {
    const response = await axios.get(`${DIRECTUS_URL}/items/hotels`, {
      headers: { 'Authorization': `Bearer ${PUBLIC_TOKEN}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hotels:', error.response?.data || error.message);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await axios.get(`${DIRECTUS_URL}/items/categories`, {
      headers: { 'Authorization': `Bearer ${PUBLIC_TOKEN}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    return [];
  }
}

async function getDestinationTranslations() {
  try {
    const response = await axios.get(`${DIRECTUS_URL}/items/destinations_translations`, {
      headers: { 'Authorization': `Bearer ${PUBLIC_TOKEN}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching destination translations:', error.response?.data || error.message);
    return [];
  }
}

async function main() {
  console.log('🔍 Testing direct access to Directus API endpoints...');
  
  // Get destinations
  console.log('\n📍 Fetching destinations...');
  const destinations = await getDestinations();
  console.log(`✅ Found ${destinations.length} destinations`);
  
  if (destinations.length > 0) {
    console.log('First destination:', JSON.stringify(destinations[0], null, 2));
  }
  
  // Get destination translations
  console.log('\n🌐 Fetching destination translations...');
  const destinationTranslations = await getDestinationTranslations();
  console.log(`✅ Found ${destinationTranslations.length} destination translations`);
  
  if (destinationTranslations.length > 0) {
    console.log('First destination translation:', JSON.stringify(destinationTranslations[0], null, 2));
  }
  
  // Get hotels
  console.log('\n🏨 Fetching hotels...');
  const hotels = await getHotels();
  console.log(`✅ Found ${hotels.length} hotels`);
  
  if (hotels.length > 0) {
    console.log('First hotel:', JSON.stringify(hotels[0], null, 2));
  }
  
  // Get categories
  console.log('\n🏷️ Fetching categories...');
  const categories = await getCategories();
  console.log(`✅ Found ${categories.length} categories`);
  
  if (categories.length > 0) {
    console.log('First category:', JSON.stringify(categories[0], null, 2));
  }
}

main();