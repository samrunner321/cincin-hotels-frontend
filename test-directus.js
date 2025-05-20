/**
 * Einfaches Test-Skript für Directus
 * Führe es aus mit: node test-directus.js
 */

// Konfiguration
const DIRECTUS_URL = 'http://localhost:8055';
const API_TOKEN = 'hWGovZk89VM0_3bNC96aRPnMhwVb9ZPE';

// Hilfsfunktion für API-Aufrufe
async function fetchFromDirectus(endpoint) {
  try {
    const response = await fetch(`${DIRECTUS_URL}/${endpoint}?access_token=${API_TOKEN}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return { data: [] };
  }
}

// Hauptfunktion
async function testDirectus() {
  console.log('=== DIRECTUS API TEST ===');
  console.log(`URL: ${DIRECTUS_URL}`);
  console.log('========================\n');
  
  // Server-Info
  console.log('=== SERVER INFO ===');
  const serverInfo = await fetchFromDirectus('server/info');
  console.log('Project Name:', serverInfo.data?.project?.project_name);
  console.log('========================\n');
  
  // Collections abrufen
  console.log('=== COLLECTIONS ===');
  const collections = await fetchFromDirectus('collections');
  collections.data.forEach(collection => {
    console.log(`- ${collection.collection}`);
  });
  console.log('========================\n');
  
  // Hotels abrufen
  console.log('=== HOTELS ===');
  const hotels = await fetchFromDirectus('items/hotels');
  
  if (hotels.data?.length > 0) {
    hotels.data.forEach(hotel => {
      console.log(`- ID: ${hotel.id}`);
      console.log(`  Name: ${hotel.name || '[kein Name]'}`);
      console.log(`  Location: ${hotel.location || '[keine Location]'}`);
      console.log(`  Status: ${hotel.status || '[kein Status]'}`);
      console.log(`  Translations: ${JSON.stringify(hotel.translations) || '[keine Übersetzungen]'}`);
      console.log('  ---');
    });
  } else {
    console.log('Keine Hotels gefunden');
  }
  console.log('========================\n');
  
  // Destinations abrufen
  console.log('=== DESTINATIONS ===');
  const destinations = await fetchFromDirectus('items/destinations');
  
  if (destinations.data?.length > 0) {
    destinations.data.forEach(destination => {
      console.log(`- ID: ${destination.id}`);
      console.log(`  Name: ${destination.name || '[kein Name]'}`);
      console.log(`  Country: ${destination.country || '[kein Land]'}`);
      console.log(`  Status: ${destination.status || '[kein Status]'}`);
      console.log('  ---');
    });
  } else {
    console.log('Keine Destinations gefunden');
  }
  console.log('========================\n');
  
  // Rooms abrufen
  console.log('=== ROOMS ===');
  const rooms = await fetchFromDirectus('items/rooms');
  
  if (rooms.data?.length > 0) {
    rooms.data.forEach(room => {
      console.log(`- ID: ${room.id}`);
      console.log(`  Name: ${room.name || '[kein Name]'}`);
      console.log(`  Hotel ID: ${room.hotel || '[kein Hotel]'}`);
      console.log(`  Status: ${room.status || '[kein Status]'}`);
      console.log('  ---');
    });
  } else {
    console.log('Keine Rooms gefunden');
  }
  console.log('========================\n');
  
  // Kategorien abrufen
  console.log('=== CATEGORIES ===');
  const categories = await fetchFromDirectus('items/categories');
  
  if (categories.data?.length > 0) {
    categories.data.forEach(category => {
      console.log(`- ID: ${category.id}`);
      console.log(`  Name: ${category.name || '[kein Name]'}`);
      console.log(`  Typ: ${category.type || '[kein Typ]'}`);
      console.log('  ---');
    });
  } else {
    console.log('Keine Kategorien gefunden');
  }
  console.log('========================\n');
  
  // Pages abrufen
  console.log('=== PAGES ===');
  const pages = await fetchFromDirectus('items/pages');
  
  if (pages.data?.length > 0) {
    pages.data.forEach(page => {
      console.log(`- ID: ${page.id}`);
      console.log(`  Titel: ${page.title || '[kein Titel]'}`);
      console.log(`  Slug: ${page.slug || '[kein Slug]'}`);
      console.log(`  Status: ${page.status || '[kein Status]'}`);
      console.log('  ---');
    });
  } else {
    console.log('Keine Pages gefunden');
  }
  console.log('========================\n');
}

// Script ausführen
testDirectus().catch(error => {
  console.error('Test script error:', error);
});