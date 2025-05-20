/**
 * Direktus Permission Fix Script
 * Erstellt eine Rolle mit vollen Berechtigungen und aktualisiert Berechtigungen für den Admin
 */

const axios = require('axios');

// Konfiguration
const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@cincinhotels.com';
const ADMIN_PASSWORD = 'admin123';

/**
 * Anmelden und Token abrufen
 */
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

/**
 * Admin-Benutzer abrufen
 */
async function getAdminUser(token) {
  console.log('👤 Suche Admin-Benutzer...');
  
  try {
    const response = await axios.get(`${DIRECTUS_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Admin-Benutzer gefunden!');
    return response.data.data;
  } catch (error) {
    console.error('❌ Fehler beim Abrufen des Admin-Benutzers:', error.response?.data || error);
    return null;
  }
}

/**
 * Admin-Rolle abrufen
 */
async function getAdminRole(token, adminUser) {
  console.log('👑 Suche Admin-Rolle...');
  
  try {
    const response = await axios.get(`${DIRECTUS_URL}/roles/${adminUser.role}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Admin-Rolle gefunden!');
    return response.data.data;
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Admin-Rolle:', error.response?.data || error);
    return null;
  }
}

/**
 * Öffentliche Rolle erstellen
 */
async function createPublicRole(token) {
  console.log('🌐 Erstelle öffentliche Rolle mit vollen Berechtigungen...');
  
  try {
    // Prüfen, ob bereits eine öffentliche Rolle existiert
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (rolesResponse.data.data && rolesResponse.data.data.length > 0) {
      console.log('⚠️ Öffentliche Rolle existiert bereits!');
      return rolesResponse.data.data[0];
    }
    
    // Neue öffentliche Rolle erstellen
    const response = await axios.post(`${DIRECTUS_URL}/roles`, {
      name: 'Public',
      app_access: true,
      admin_access: true,
      description: 'Public role with full access'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Öffentliche Rolle erstellt!');
    return response.data.data;
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der öffentlichen Rolle:', error.response?.data || error);
    return null;
  }
}

/**
 * Berechtigungen für eine Rolle festlegen
 */
async function setRolePermissions(token, roleId) {
  console.log(`🔓 Setze volle Berechtigungen für Rolle ${roleId}...`);
  
  try {
    // Berechtigungsrichtlinie erstellen
    const policyResponse = await axios.post(`${DIRECTUS_URL}/policies`, {
      name: 'Full Access',
      description: 'Full access policy',
      admin_access: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const policyId = policyResponse.data.data.id;
    console.log(`✅ Berechtigungsrichtlinie erstellt: ${policyId}`);
    
    // Zugriff für die Rolle auf die Richtlinie erstellen
    await axios.post(`${DIRECTUS_URL}/access`, {
      role: roleId,
      policy: policyId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Berechtigungen gesetzt!');
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Setzen der Berechtigungen:', error.response?.data || error);
    return false;
  }
}

/**
 * Direkter API-Zugriff für Collection erstellen
 */
async function createCollection(token, collection) {
  console.log(`📊 Erstelle Collection "${collection.collection}" via direkte API...`);
  
  try {
    // Prüfen, ob Collection bereits existiert
    try {
      const checkResponse = await axios.get(`${DIRECTUS_URL}/collections/${collection.collection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`⚠️ Collection "${collection.collection}" existiert bereits.`);
      return true;
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
      // Collection existiert nicht, weitermachen
    }
    
    // Collections-Endpunkt direkt aufrufen
    const response = await axios({
      method: 'post',
      url: `${DIRECTUS_URL}/collections`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: collection
    });
    
    console.log(`✅ Collection "${collection.collection}" erstellt!`);
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen der Collection "${collection.collection}":`, error.response?.data || error);
    return false;
  }
}

/**
 * Manuell die notwendigen Collections erstellen
 */
async function createCollections(token) {
  const collections = [
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
    },
    {
      collection: 'pages',
      meta: {
        collection: 'pages',
        icon: 'article',
        note: 'Seiten für die Website',
        display_template: '{{title}}',
        sort_field: 'sort'
      },
      schema: { name: 'pages' }
    },
    {
      collection: 'rooms',
      meta: {
        collection: 'rooms',
        icon: 'bed',
        note: 'Zimmer in den Hotels',
        display_template: '{{name}}',
        sort_field: 'sort'
      },
      schema: { name: 'rooms' }
    }
  ];
  
  for (const collection of collections) {
    await createCollection(token, collection);
  }
}

/**
 * Collection-Felder erstellen
 */
async function createField(token, collection, field) {
  console.log(`🏷️ Erstelle Feld "${field.field}" für Collection "${collection}" via direkte API...`);
  
  try {
    // Prüfen, ob Feld bereits existiert
    try {
      const checkResponse = await axios.get(`${DIRECTUS_URL}/fields/${collection}/${field.field}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`⚠️ Feld "${field.field}" existiert bereits.`);
      return true;
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
      // Feld existiert nicht, weitermachen
    }
    
    // Feld erstellen mit POST auf fields Endpunkt
    const response = await axios({
      method: 'post',
      url: `${DIRECTUS_URL}/fields/${collection}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: field
    });
    
    console.log(`✅ Feld "${field.field}" erstellt!`);
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen des Feldes "${field.field}":`, error.response?.data || error);
    return false;
  }
}

/**
 * Basisfelder für alle Collections erstellen
 */
async function createFields(token) {
  // Felder für "pages" Collection
  const pageFields = [
    {
      field: 'title',
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
      field: 'content',
      type: 'text',
      meta: {
        interface: 'input-rich-text-html',
        options: { trim: true }
      },
      schema: { is_nullable: true }
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
    }
  ];
  
  for (const field of pageFields) {
    await createField(token, 'pages', field);
  }
  
  // Felder für "destinations" Collection
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
  
  // Felder für "categories" Collection
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
  
  // Zusätzliche Felder für "hotels" Collection
  const hotelFields = [
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
  
  // Felder für "rooms" Collection
  const roomFields = [
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
      field: 'hotel',
      type: 'string',
      meta: {
        interface: 'input',
        options: { trim: true },
        required: true
      },
      schema: { is_nullable: false }
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        options: { trim: true }
      },
      schema: { is_nullable: true }
    },
    {
      field: 'price',
      type: 'integer',
      meta: {
        interface: 'input',
        options: { min: 0 }
      },
      schema: { is_nullable: true }
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Verfügbar', value: 'available' },
            { text: 'Ausgebucht', value: 'booked' },
            { text: 'Wartung', value: 'maintenance' }
          ]
        }
      },
      schema: { default_value: 'available' }
    }
  ];
  
  for (const field of roomFields) {
    await createField(token, 'rooms', field);
  }
}

/**
 * Beziehungen zwischen Collections erstellen
 */
async function createRelations(token) {
  console.log('🔗 Erstelle Beziehungen zwischen Collections...');
  
  const relations = [
    // Hotel zu Destination (m2o)
    {
      collection: 'hotels',
      field: 'destination',
      related_collection: 'destinations',
      meta: {
        junction_field: null,
        many_collection: 'hotels',
        many_field: 'destination',
        one_collection: 'destinations',
        one_field: null,
        one_collection_field: null,
        one_allowed_collections: null,
        sort_field: null
      },
      schema: {
        table: 'hotels',
        column: 'destination',
        foreign_key_table: 'destinations',
        foreign_key_column: 'id',
        constraint_name: null,
        on_update: 'NO ACTION',
        on_delete: 'SET NULL'
      }
    },
    
    // Hotel zu Categories (m2m)
    {
      collection: 'hotels_categories',
      field: 'hotel_id',
      related_collection: 'hotels',
      meta: {
        junction_field: 'category_id',
        many_collection: 'hotels_categories',
        many_field: 'hotel_id',
        one_collection: 'hotels',
        one_field: 'categories',
        one_collection_field: null,
        one_allowed_collections: null,
        sort_field: null
      }
    },
    {
      collection: 'hotels_categories',
      field: 'category_id',
      related_collection: 'categories',
      meta: {
        junction_field: 'hotel_id',
        many_collection: 'hotels_categories',
        many_field: 'category_id',
        one_collection: 'categories',
        one_field: 'hotels',
        one_collection_field: null,
        one_allowed_collections: null,
        sort_field: null
      }
    },
    
    // Room zu Hotel (m2o)
    {
      collection: 'rooms',
      field: 'hotel_id',
      related_collection: 'hotels',
      meta: {
        junction_field: null,
        many_collection: 'rooms',
        many_field: 'hotel_id',
        one_collection: 'hotels',
        one_field: 'rooms',
        one_collection_field: null,
        one_allowed_collections: null,
        sort_field: null
      }
    }
  ];
  
  try {
    for (const relation of relations) {
      try {
        await axios.post(`${DIRECTUS_URL}/relations`, relation, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(`✅ Beziehung erstellt: ${relation.collection} -> ${relation.related_collection}`);
      } catch (error) {
        console.error(`❌ Fehler beim Erstellen der Beziehung:`, error.response?.data || error);
      }
    }
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Beziehungen:', error);
    return false;
  }
}

/**
 * Einfache Testdaten erstellen
 */
async function createTestData(token) {
  console.log('📝 Erstelle Testdaten...');
  
  // Kategorie erstellen
  try {
    const categoryResponse = await axios.post(`${DIRECTUS_URL}/items/categories`, {
      name: 'Luxury',
      slug: 'luxury',
      type: 'both',
      description: 'Premium accommodations and destinations'
    }, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Testkategorie erstellt!');
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Testkategorie:', error.response?.data || error);
  }
  
  // Destination erstellen
  try {
    const destinationResponse = await axios.post(`${DIRECTUS_URL}/items/destinations`, {
      name: 'Paris',
      slug: 'paris',
      status: 'published',
      country: 'France',
      short_description: 'The city of love and lights'
    }, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Testdestination erstellt!');
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Testdestination:', error.response?.data || error);
  }
  
  // Seite erstellen
  try {
    const pageResponse = await axios.post(`${DIRECTUS_URL}/items/pages`, {
      title: 'About Us',
      slug: 'about',
      content: '<h1>About CinCin Hotels</h1><p>We are a luxury hotel chain with properties across the globe.</p>',
      status: 'published'
    }, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Testseite erstellt!');
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Testseite:', error.response?.data || error);
  }
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log('🚀 Starte Direktus Berechtigungs-Fix...');
  
  // Anmelden
  const token = await login();
  
  // Admin-Benutzer abrufen
  const adminUser = await getAdminUser(token);
  if (!adminUser) {
    console.error('❌ Admin-Benutzer konnte nicht gefunden werden.');
    process.exit(1);
  }
  
  // Admin-Rolle abrufen
  const adminRole = await getAdminRole(token, adminUser);
  if (!adminRole) {
    console.error('❌ Admin-Rolle konnte nicht gefunden werden.');
    process.exit(1);
  }
  
  // Öffentliche Rolle mit vollen Berechtigungen erstellen
  const publicRole = await createPublicRole(token);
  if (publicRole) {
    await setRolePermissions(token, publicRole.id);
  }
  
  // Collections direkt erstellen
  await createCollections(token);
  
  // Felder für alle Collections erstellen
  await createFields(token);
  
  // Beziehungen erstellen
  // await createRelations(token);
  
  // Testdaten erstellen
  await createTestData(token);
  
  console.log('\n✅ Direktus Berechtigungs-Fix abgeschlossen!');
  console.log('\n🔄 Die Berechtigungen wurden aktualisiert und notwendige Collections erstellt.');
  console.log('\n🔄 Nächste Schritte:');
  console.log('1. Starte deine Next.js-Anwendung mit "npm run dev"');
  console.log('2. Besuche http://localhost:8055 um deine Daten in Directus zu verwalten (admin@cincinhotels.com / admin123)');
  console.log('3. Du solltest nun in der Lage sein, alle notwendigen Collections und Felder zu bearbeiten!');
}

// Hauptprogramm ausführen
main().catch(error => {
  console.error('❌ Ein unerwarteter Fehler ist aufgetreten:', error);
});