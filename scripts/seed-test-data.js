/**
 * Test-Daten-Generator für Directus CMS
 * 
 * Dieses Skript fügt Test-Daten für Destinations, Hotels, und Kategorien hinzu.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

// Überprüfen Sie, ob DIRECTUS_TOKEN vorhanden ist
if (!DIRECTUS_TOKEN) {
  console.error('❌ Kein DIRECTUS_TOKEN gefunden. Bitte in .env.local konfigurieren.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${DIRECTUS_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Kategorien anlegen
 */
const categories = [
  {
    name: 'Luxury',
    slug: 'luxury',
    type: 'both',
    description: 'Premium accommodations and destinations offering the highest level of service and amenities.',
    featured: true
  },
  {
    name: 'Beach',
    slug: 'beach',
    type: 'destination',
    description: 'Beautiful coastal locations with stunning beaches and ocean views.',
    featured: true
  },
  {
    name: 'Mountain',
    slug: 'mountain',
    type: 'destination',
    description: 'Spectacular mountain destinations perfect for outdoor activities and dramatic landscapes.',
    featured: true
  },
  {
    name: 'Cultural',
    slug: 'cultural',
    type: 'destination',
    description: 'Destinations rich in history, art, and cultural experiences.',
    featured: true
  },
  {
    name: 'Culinary',
    slug: 'culinary',
    type: 'both',
    description: 'Experiences focused on exceptional dining and local cuisines.',
    featured: false
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    type: 'hotel',
    description: 'Properties featuring exceptional spa and wellness facilities.',
    featured: true
  },
  {
    name: 'Family-Friendly',
    slug: 'family-friendly',
    type: 'both',
    description: 'Accommodations and destinations perfect for family vacations.',
    featured: false
  },
  {
    name: 'Romantic',
    slug: 'romantic',
    type: 'both',
    description: 'Ideal settings for couples and romantic getaways.',
    featured: true
  }
];

/**
 * Prüft, ob eine Kategorie bereits existiert
 */
async function categoryExists(slug) {
  try {
    const response = await axios.get(`${DIRECTUS_URL}/items/categories?filter[slug][_eq]=${slug}`, { headers });
    return response.data.data && response.data.data.length > 0;
  } catch (error) {
    console.error(`Fehler beim Prüfen der Kategorie ${slug}:`, error.message);
    return false;
  }
}

/**
 * Kategorie erstellen
 */
async function createCategory(category) {
  if (await categoryExists(category.slug)) {
    console.log(`Kategorie "${category.name}" existiert bereits, überspringe...`);
    return;
  }
  
  try {
    const response = await axios.post(`${DIRECTUS_URL}/items/categories`, category, { headers });
    console.log(`✅ Kategorie "${category.name}" erstellt`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen der Kategorie "${category.name}":`, error.message);
  }
}

/**
 * Alle Test-Daten erstellen
 */
async function createTestData() {
  console.log('🔄 Erstelle Test-Daten für Directus CMS...');
  
  // Kategorien erstellen
  console.log('\n📋 Erstelle Kategorien:');
  for (const category of categories) {
    await createCategory(category);
  }
  
  console.log('\n✅ Test-Daten erfolgreich hinzugefügt!');
  console.log('\nHinweis: Destinationen werden über das Docker-Setup in seed.js erstellt.');
  console.log('Sie können weitere Daten über das Directus Admin-Interface hinzufügen:');
  console.log(`${DIRECTUS_URL}/admin`);
}

createTestData();