/**
 * Mock Seed-Skript für Test-Daten
 */
const fs = require('fs');
const path = require('path');

// Definiere Zielverzeichnis für Mock-Daten
const mockDataDir = path.join(__dirname, '../mock-directus/data');
if (!fs.existsSync(mockDataDir)) {
  fs.mkdirSync(mockDataDir, { recursive: true });
}

console.log('🌱 Erstelle Test-Daten für Directus CMS (Mock)...');

// Kategorien
const categories = [
  {
    id: '1',
    name: 'Luxury',
    slug: 'luxury',
    type: 'both',
    description: 'Premium accommodations and destinations offering the highest level of service and amenities.',
    featured: true
  },
  {
    id: '2',
    name: 'Beach',
    slug: 'beach',
    type: 'destination',
    description: 'Beautiful coastal locations with stunning beaches and ocean views.',
    featured: true
  },
  {
    id: '3',
    name: 'Mountain',
    slug: 'mountain',
    type: 'destination',
    description: 'Spectacular mountain destinations perfect for outdoor activities and dramatic landscapes.',
    featured: true
  },
  {
    id: '4',
    name: 'Cultural',
    slug: 'cultural',
    type: 'destination',
    description: 'Destinations rich in history, art, and cultural experiences.',
    featured: true
  },
  {
    id: '5',
    name: 'Culinary',
    slug: 'culinary',
    type: 'both',
    description: 'Experiences focused on exceptional dining and local cuisines.',
    featured: false
  },
  {
    id: '6',
    name: 'Wellness',
    slug: 'wellness',
    type: 'hotel',
    description: 'Properties featuring exceptional spa and wellness facilities.',
    featured: true
  },
  {
    id: '7',
    name: 'Family-Friendly',
    slug: 'family-friendly',
    type: 'both',
    description: 'Accommodations and destinations perfect for family vacations.',
    featured: false
  },
  {
    id: '8',
    name: 'Romantic',
    slug: 'romantic',
    type: 'both',
    description: 'Ideal settings for couples and romantic getaways.',
    featured: true
  }
];

// Destinations
const destinations = [
  {
    id: 'da8192c5-f28f-4f11-98de-37ca1e729a5a',
    status: 'published',
    name: 'Amalfi Coast',
    slug: 'amalfi-coast',
    subtitle: 'Italy\'s breathtaking coastal paradise',
    country: 'Italy',
    region: 'mediterranean',
    short_description: 'Discover the stunning Amalfi Coast with its dramatic cliffs, colorful villages, and crystal-clear waters of the Mediterranean.',
    description: '<p>The Amalfi Coast, a UNESCO World Heritage Site, is one of Italy\'s most iconic and breathtaking destinations. This 50-kilometer stretch of coastline along the southern edge of Italy\'s Sorrentine Peninsula features dramatic cliffs that plunge into the azure waters of the Mediterranean, creating a landscape of exceptional beauty.</p><p>The coast is dotted with picturesque towns and villages, each with its own unique charm. Positano, with its pastel-colored houses cascading down the hillside; Amalfi, with its impressive cathedral and maritime history; and Ravello, perched high above the sea with its luxurious villas and gardens, are just a few of the highlights.</p>',
    main_image: 'amalfi-coast.jpg',
    coordinates: { lat: 40.6333, lng: 14.6027 },
    is_featured: true,
    is_popular: true,
    categories: ['2', '4', '5', '8'], // Beach, Cultural, Culinary, Romantic
    weather: [
      {
        season: 'spring',
        temp_low: 15,
        temp_high: 22,
        precipitation: 'Moderate'
      },
      {
        season: 'summer',
        temp_low: 23,
        temp_high: 30,
        precipitation: 'Low'
      },
      {
        season: 'autumn',
        temp_low: 16,
        temp_high: 25,
        precipitation: 'Moderate'
      },
      {
        season: 'winter',
        temp_low: 8,
        temp_high: 15,
        precipitation: 'High'
      }
    ]
  },
  {
    id: '7b824242-1ab8-46a1-8e07-7f96c6a6b383',
    status: 'published',
    name: 'Swiss Alps',
    slug: 'swiss-alps',
    subtitle: 'Majestic mountain landscapes and luxury experiences',
    country: 'Switzerland',
    region: 'alps',
    short_description: 'Experience the breathtaking beauty of the Swiss Alps with their soaring peaks, pristine lakes, and world-class mountain resorts.',
    description: '<p>The Swiss Alps represent one of the most iconic and spectacular mountain ranges in the world. Covering nearly 60% of Switzerland\'s territory, these majestic mountains offer an unparalleled combination of natural beauty, outdoor activities, and cultural experiences.</p><p>From the famous peaks of the Matterhorn, Eiger, and Jungfrau to the stunning alpine lakes and meadows, the landscape presents a breathtaking panorama in every direction. Picturesque villages with traditional wooden chalets dot the valleys, preserving centuries-old Swiss customs and architecture.</p>',
    main_image: 'swiss-alps.jpg',
    coordinates: { lat: 46.8182, lng: 8.2275 },
    is_featured: true,
    is_popular: true,
    categories: ['1', '3', '6', '8'], // Luxury, Mountain, Wellness, Romantic
    weather: [
      {
        season: 'spring',
        temp_low: 2,
        temp_high: 15,
        precipitation: 'Moderate'
      },
      {
        season: 'summer',
        temp_low: 10,
        temp_high: 25,
        precipitation: 'Moderate'
      },
      {
        season: 'autumn',
        temp_low: 5,
        temp_high: 18,
        precipitation: 'Low'
      },
      {
        season: 'winter',
        temp_low: -10,
        temp_high: 5,
        precipitation: 'High (snow)'
      }
    ]
  },
  {
    id: '5c8f8e9a-3e7d-4cbd-b22c-15b5c6de9b72',
    status: 'published',
    name: 'Barcelona',
    slug: 'barcelona',
    subtitle: 'A vibrant blend of culture, architecture, and Mediterranean charm',
    country: 'Spain',
    region: 'mediterranean',
    short_description: 'Explore the unique Catalan culture, Gaudí\'s architectural marvels, and the sun-soaked beaches of Barcelona.',
    description: '<p>Barcelona, the cosmopolitan capital of Spain\'s Catalonia region, is a city that seamlessly blends historic charm with avant-garde style. Its streets are a living museum of architectural wonders, from the medieval Gothic Quarter to Antoni Gaudí\'s surreal masterpieces like the Sagrada Familia and Park Güell.</p><p>The city offers a perfect balance of urban excitement and relaxation. Stroll down the iconic La Rambla boulevard, explore the bustling La Boqueria market, or unwind on the city\'s Mediterranean beaches. Barcelona\'s culinary scene is equally impressive, with everything from traditional tapas bars to innovative Michelin-starred restaurants showcasing Catalan and Spanish cuisine.</p>',
    main_image: 'barcelona.jpg',
    coordinates: { lat: 41.3851, lng: 2.1734 },
    is_featured: false,
    is_popular: true,
    categories: ['2', '4', '5'], // Beach, Cultural, Culinary
    weather: [
      {
        season: 'spring',
        temp_low: 13,
        temp_high: 20,
        precipitation: 'Low'
      },
      {
        season: 'summer',
        temp_low: 20,
        temp_high: 28,
        precipitation: 'Very Low'
      },
      {
        season: 'autumn',
        temp_low: 14,
        temp_high: 23,
        precipitation: 'Moderate'
      },
      {
        season: 'winter',
        temp_low: 8,
        temp_high: 14,
        precipitation: 'Low'
      }
    ]
  }
];

// Hotels
const hotels = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    status: 'published',
    name: 'Grand Hotel Convento di Amalfi',
    slug: 'grand-hotel-convento-di-amalfi',
    subtitle: 'A historic monastery transformed into a luxury cliff-side retreat',
    location: 'Amalfi',
    region: 'mediterranean',
    short_description: 'Perched on a cliff 80 meters above sea level, this luxury hotel combines 12th-century architecture with modern comforts and breathtaking views.',
    main_image: 'convento-amalfi.jpg',
    price_from: 450,
    currency: 'EUR',
    star_rating: 5,
    destination: 'da8192c5-f28f-4f11-98de-37ca1e729a5a', // Amalfi Coast
    is_featured: true
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    status: 'published',
    name: 'The Alpina Gstaad',
    slug: 'alpina-gstaad',
    subtitle: 'Contemporary Swiss luxury with alpine soul',
    location: 'Gstaad',
    region: 'alps',
    short_description: 'This five-star mountain retreat blends traditional Swiss architecture with contemporary style, offering exceptional amenities including a world-class spa and Michelin-starred dining.',
    main_image: 'alpina-gstaad.jpg',
    price_from: 850,
    currency: 'CHF',
    star_rating: 5,
    destination: '7b824242-1ab8-46a1-8e07-7f96c6a6b383', // Swiss Alps
    is_featured: true
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    status: 'published',
    name: 'Hotel Arts Barcelona',
    slug: 'hotel-arts-barcelona',
    subtitle: 'Modern luxury overlooking the Mediterranean',
    location: 'Barcelona',
    region: 'mediterranean',
    short_description: 'This iconic 44-story skyscraper offers luxurious accommodations with stunning sea views, an outdoor pool, and a two-Michelin-star restaurant.',
    main_image: 'hotel-arts-barcelona.jpg',
    price_from: 380,
    currency: 'EUR',
    star_rating: 5,
    destination: '5c8f8e9a-3e7d-4cbd-b22c-15b5c6de9b72', // Barcelona
    is_featured: false
  }
];

// Speichere die Daten in JSON-Dateien
fs.writeFileSync(path.join(mockDataDir, 'categories.json'), JSON.stringify(categories, null, 2));
console.log('✅ Kategorien erstellt: ' + categories.length);

fs.writeFileSync(path.join(mockDataDir, 'destinations.json'), JSON.stringify(destinations, null, 2));
console.log('✅ Destinations erstellt: ' + destinations.length);

fs.writeFileSync(path.join(mockDataDir, 'hotels.json'), JSON.stringify(hotels, null, 2));
console.log('✅ Hotels erstellt: ' + hotels.length);

// Erstelle ein leeres Bildverzeichnis für Mockdaten
const mockImagesDir = path.join(mockDataDir, 'images');
if (!fs.existsSync(mockImagesDir)) {
  fs.mkdirSync(mockImagesDir, { recursive: true });
}

console.log('\n✅ Test-Daten wurden erfolgreich in mock-directus/data/ gespeichert.');
console.log('\nHinweis: In einer echten Umgebung würden diese Daten in die Direktus-Datenbank geladen.');
console.log('Die Anwendung kann jetzt diese Mock-Daten für Entwicklungszwecke verwenden.');