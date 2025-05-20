/**
 * Direktus API Setup-Skript
 * Erstellt Collections, Felder und Testdaten in Direktus
 */

const axios = require('axios');

// Konfiguration
const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@cincinhotels.com';
const ADMIN_PASSWORD = 'admin123';

// ----- Helper-Funktionen -----

async function login() {
  console.log('🔑 Anmelden bei Directus...');
  
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    const token = response.data.data.access_token;
    console.log('✅ Anmeldung erfolgreich!');
    return token;
  } catch (error) {
    console.error('❌ Anmeldung fehlgeschlagen:', error.response?.data || error);
    process.exit(1);
  }
}

async function createCollection(token, collection) {
  console.log(`📊 Erstelle Collection "${collection.collection}"...`);
  
  try {
    // Prüfen, ob Collection bereits existiert
    try {
      await axios.get(`${DIRECTUS_URL}/collections/${collection.collection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`⚠️ Collection "${collection.collection}" existiert bereits, überspringe...`);
      return true;
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
      // Collection existiert nicht, erstellen...
    }
    
    // Collection erstellen
    const response = await axios.post(`${DIRECTUS_URL}/collections`, collection, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Collection "${collection.collection}" erstellt!`);
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen der Collection "${collection.collection}":`, error.response?.data || error);
    return false;
  }
}

async function createField(token, collection, field) {
  console.log(`🏷️ Erstelle Feld "${field.field}" für Collection "${collection}"...`);
  
  try {
    // Prüfen, ob Feld bereits existiert
    try {
      await axios.get(`${DIRECTUS_URL}/fields/${collection}/${field.field}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`⚠️ Feld "${field.field}" existiert bereits, überspringe...`);
      return true;
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
      // Feld existiert nicht, erstellen...
    }
    
    // Feld erstellen
    const response = await axios.post(`${DIRECTUS_URL}/fields/${collection}`, field, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Feld "${field.field}" erstellt!`);
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen des Feldes "${field.field}":`, error.response?.data || error);
    return false;
  }
}

async function createItem(token, collection, item) {
  console.log(`📝 Erstelle Datensatz in "${collection}"...`);
  
  try {
    const response = await axios.post(`${DIRECTUS_URL}/items/${collection}`, item, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Datensatz in "${collection}" erstellt!`);
    return response.data.data.id;
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen des Datensatzes in "${collection}":`, error.response?.data || error);
    return null;
  }
}

// ----- Hauptfunktion -----

async function main() {
  console.log('🚀 Starte Direktus API Setup...');
  
  // Anmelden
  const token = await login();
  
  // Collections erstellen
  const collections = [
    {
      collection: 'hotels',
      meta: {
        collection: 'hotels',
        icon: 'hotel',
        note: 'Hotels im CinCin Hotels Netzwerk',
        display_template: '{{name}}',
        sort_field: 'sort'
      },
      schema: { name: 'hotels' }
    },
    {
      collection: 'destinations',
      meta: {
        collection: 'destinations',
        icon: 'place',
        note: 'Reiseziele für CinCin Hotels',
        display_template: '{{name}}',
        sort_field: 'sort'
      },
      schema: { name: 'destinations' }
    },
    {
      collection: 'categories',
      meta: {
        collection: 'categories',
        icon: 'category',
        note: 'Kategorien für Hotels und Destinationen',
        display_template: '{{name}}',
        sort_field: 'sort'
      },
      schema: { name: 'categories' }
    }
  ];
  
  for (const collection of collections) {
    await createCollection(token, collection);
  }
  
  // Felder für Hotels erstellen
  const hotelFields = [
    {
      field: 'name',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true },
        required: true
      },
      schema: { is_nullable: false }
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true, slug: true },
        required: true,
        note: 'URL-freundlicher eindeutiger Identifier'
      },
      schema: {
        is_nullable: false,
        is_unique: true
      }
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Veröffentlicht', value: 'published' },
            { text: 'Entwurf', value: 'draft' },
            { text: 'Archiviert', value: 'archived' }
          ]
        }
      },
      schema: { default_value: 'published' }
    },
    {
      field: 'location',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true }
      },
      schema: { is_nullable: true }
    },
    {
      field: 'short_description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        options: { trim: true }
      },
      schema: { is_nullable: true }
    }
  ];
  
  for (const field of hotelFields) {
    await createField(token, 'hotels', field);
  }
  
  // Felder für Destinations erstellen
  const destinationFields = [
    {
      field: 'name',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true },
        required: true
      },
      schema: { is_nullable: false }
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true, slug: true },
        required: true,
        note: 'URL-freundlicher eindeutiger Identifier'
      },
      schema: {
        is_nullable: false,
        is_unique: true
      }
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Veröffentlicht', value: 'published' },
            { text: 'Entwurf', value: 'draft' },
            { text: 'Archiviert', value: 'archived' }
          ]
        }
      },
      schema: { default_value: 'published' }
    },
    {
      field: 'country',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true }
      },
      schema: { is_nullable: true }
    },
    {
      field: 'short_description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        options: { trim: true }
      },
      schema: { is_nullable: true }
    }
  ];
  
  for (const field of destinationFields) {
    await createField(token, 'destinations', field);
  }
  
  // Felder für Categories erstellen
  const categoryFields = [
    {
      field: 'name',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true },
        required: true
      },
      schema: { is_nullable: false }
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true, slug: true },
        required: true,
        note: 'URL-freundlicher eindeutiger Identifier'
      },
      schema: {
        is_nullable: false,
        is_unique: true
      }
    },
    {
      field: 'type',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Hotel', value: 'hotel' },
            { text: 'Destination', value: 'destination' },
            { text: 'Beide', value: 'both' }
          ]
        }
      },
      schema: { default_value: 'both' }
    },
    {
      field: 'description',
      type: 'string',
      meta: {
        interface: 'input-multiline',
        options: { trim: true }
      },
      schema: { is_nullable: true }
    }
  ];
  
  for (const field of categoryFields) {
    await createField(token, 'categories', field);
  }
  
  // Testdaten erstellen
  
  // Kategorien
  const categories = [
    {
      name: 'Luxury',
      slug: 'luxury',
      type: 'both',
      description: 'Premium accommodations and destinations offering the highest level of service.'
    },
    {
      name: 'Beach',
      slug: 'beach',
      type: 'destination',
      description: 'Beautiful coastal locations with stunning beaches and ocean views.'
    },
    {
      name: 'Mountain',
      slug: 'mountain',
      type: 'destination',
      description: 'Spectacular mountain destinations perfect for outdoor activities and dramatic landscapes.'
    }
  ];
  
  const categoryIds = [];
  for (const category of categories) {
    const id = await createItem(token, 'categories', category);
    if (id) categoryIds.push(id);
  }
  
  // Destinationen
  const destinations = [
    {
      name: 'Amalfi Coast',
      slug: 'amalfi-coast',
      status: 'published',
      country: 'Italy',
      short_description: 'Discover the stunning Amalfi Coast with its dramatic cliffs, colorful villages, and crystal-clear waters.'
    },
    {
      name: 'Swiss Alps',
      slug: 'swiss-alps',
      status: 'published',
      country: 'Switzerland',
      short_description: 'Experience the breathtaking beauty of the Swiss Alps with their soaring peaks and pristine lakes.'
    }
  ];
  
  const destinationIds = [];
  for (const destination of destinations) {
    const id = await createItem(token, 'destinations', destination);
    if (id) destinationIds.push(id);
  }
  
  // Hotels
  const hotels = [
    {
      name: 'Grand Hotel Convento di Amalfi',
      slug: 'grand-hotel-convento-di-amalfi',
      status: 'published',
      location: 'Amalfi, Italy',
      short_description: 'Perched on a cliff 80 meters above sea level, this luxury hotel combines 12th-century architecture with modern comforts.'
    },
    {
      name: 'The Alpina Gstaad',
      slug: 'the-alpina-gstaad',
      status: 'published',
      location: 'Gstaad, Switzerland',
      short_description: 'This five-star mountain retreat blends traditional Swiss architecture with contemporary style.'
    }
  ];
  
  for (const hotel of hotels) {
    await createItem(token, 'hotels', hotel);
  }
  
  console.log('\n✅ Direktus API Setup abgeschlossen!');
  console.log('\n🔄 Die Daten wurden in Direktus eingerichtet.');
  console.log('\n🔄 Nächste Schritte:');
  console.log('1. Starte deine Next.js-Anwendung mit "npm run dev"');
  console.log('2. Besuche http://localhost:8055 um deine Daten in Directus zu verwalten (admin@cincinhotels.com / admin123)');
}

// Hauptprogramm ausführen
main().catch(error => {
  console.error('❌ Ein unerwarteter Fehler ist aufgetreten:', error);
});