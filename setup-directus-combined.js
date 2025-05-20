/**
 * CinCin Hotels Directus Setup Script (Kombinierte Version)
 * 
 * Dieses Skript konfiguriert automatisch das Directus CMS für das CinCin Hotels Projekt.
 * Es erstellt alle Collections, Felder, Beziehungen, Berechtigungen und Testdaten.
 * 
 * Ausführung: node setup-directus-combined.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// CONFIGURATION
const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@cincinhotels.com';
const ADMIN_PASSWORD = 'admin123';
const ALTERNATE_PASSWORD = 'admin123';
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // 3 Sekunden

// Check if required packages are installed, install if not
function checkAndInstallDependencies() {
  console.log('🔍 Prüfe Abhängigkeiten...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const missingDeps = [];
    if (!dependencies.axios && !devDependencies.axios) missingDeps.push('axios');
    if (!dependencies.dotenv && !devDependencies.dotenv) missingDeps.push('dotenv');
    
    if (missingDeps.length > 0) {
      console.log(`📦 Installiere fehlende Abhängigkeiten: ${missingDeps.join(', ')}...`);
      execSync(`npm install --save-dev ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    }
  } catch (error) {
    // If package.json doesn't exist or can't be read, just install the dependencies
    console.log('📦 Installiere Abhängigkeiten...');
    execSync('npm install --save-dev axios dotenv', { stdio: 'inherit' });
  }
}

// Check if Directus is running
async function checkDirectusStatus() {
  console.log('🔍 Prüfe, ob Directus läuft...');
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await axios.get(`${DIRECTUS_URL}/server/ping`);
      if (response.data === 'pong') {
        console.log('✅ Directus läuft!');
        return true;
      }
    } catch (error) {
      console.log(`⚠️ Versuch ${i+1}/${MAX_RETRIES}: Directus ist nicht erreichbar.`);
      if (i < MAX_RETRIES - 1) {
        console.log(`⏱️ Warte ${RETRY_DELAY/1000} Sekunden vor dem nächsten Versuch...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error('❌ Directus ist nicht erreichbar. Bitte stelle sicher, dass Directus auf http://localhost:8055 läuft.');
        process.exit(1);
      }
    }
  }
  return false;
}

// Login to Directus with multiple password attempts
async function loginToDirectus() {
  console.log('🔑 Melde mich bei Directus an...');
  
  try {
    // First login attempt with primary password
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    console.log('✅ Anmeldung erfolgreich!');
    return response.data.data.access_token;
  } catch (error) {
    console.log('⚠️ Erster Anmeldeversuch fehlgeschlagen, versuche alternatives Passwort...');
    
    try {
      // Second login attempt with alternate password
      const altResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
        email: ADMIN_EMAIL,
        password: ALTERNATE_PASSWORD
      });
      
      console.log('✅ Anmeldung mit alternativem Passwort erfolgreich!');
      return altResponse.data.data.access_token;
    } catch (altError) {
      console.error('❌ Anmeldung fehlgeschlagen:', 
        altError.response?.data?.errors || altError.message);
      process.exit(1);
    }
  }
}

// Create Collections
async function createCollections(accessToken) {
  console.log('📊 Erstelle Collections...');
  
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
      schema: {
        name: 'hotels',
      }
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
      schema: {
        name: 'destinations',
      }
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
      schema: {
        name: 'categories',
      }
    },
    {
      collection: 'rooms',
      meta: {
        collection: 'rooms',
        icon: 'bed',
        note: 'Zimmer in Hotels',
        display_template: '{{name}} ({{hotel.name}})',
        sort_field: 'sort'
      },
      schema: {
        name: 'rooms',
      }
    },
    {
      collection: 'pages',
      meta: {
        collection: 'pages',
        icon: 'description',
        note: 'Webseiten und Inhaltsseiten',
        display_template: '{{title}}',
        sort_field: 'sort'
      },
      schema: {
        name: 'pages',
      }
    }
  ];

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  let createdCollections = 0;
  for (const collection of collections) {
    try {
      // Check if collection already exists
      try {
        const checkResponse = await axios.get(`${DIRECTUS_URL}/collections/${collection.collection}`, { headers });
        console.log(`⚠️ Collection "${collection.collection}" existiert bereits, überspringe...`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Collection doesn't exist, create it
          try {
            await axios.post(`${DIRECTUS_URL}/collections`, collection, { headers });
            console.log(`✅ Collection "${collection.collection}" erstellt!`);
            createdCollections++;
          } catch (createError) {
            console.error(`❌ Fehler beim Erstellen der Collection "${collection.collection}":`, 
              createError.response?.data?.errors || createError.message);
          }
        } else {
          console.error(`❌ Fehler beim Überprüfen der Collection "${collection.collection}":`, 
            error.response?.data?.errors || error.message);
        }
      }
    } catch (error) {
      console.error(`❌ Unerwarteter Fehler bei Collection "${collection.collection}":`, error);
    }
  }

  return createdCollections;
}

// Create Fields for Collections
async function createFields(accessToken) {
  console.log('🏷️ Erstelle Felder für Collections...');
  
  const collectionsFields = {
    'hotels': [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid']
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false
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
          },
          width: 'half'
        },
        schema: {
          default_value: 'published'
        }
      },
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true },
          required: true
        },
        schema: {
          is_nullable: false
        }
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
        field: 'subtitle',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'location',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'region',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Alpen', value: 'alps' },
              { text: 'Mittelmeer', value: 'mediterranean' },
              { text: 'Nordeuropa', value: 'northern_europe' },
              { text: 'Mitteleuropa', value: 'central_europe' },
              { text: 'Südeuropa', value: 'southern_europe' }
            ]
          }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'short_description',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-rich-text-html',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'main_image',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'price_from',
        type: 'integer',
        meta: {
          interface: 'input',
          width: 'half'
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'currency',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Euro (EUR)', value: 'EUR' },
              { text: 'Schweizer Franken (CHF)', value: 'CHF' },
              { text: 'US-Dollar (USD)', value: 'USD' },
              { text: 'Britisches Pfund (GBP)', value: 'GBP' }
            ]
          },
          width: 'half'
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'star_rating',
        type: 'integer',
        meta: {
          interface: 'input',
          options: { min: 1, max: 5 },
          width: 'half'
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'destination',
        type: 'uuid',
        meta: {
          interface: 'select-dropdown-m2o',
          special: ['m2o']
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'is_featured',
        type: 'boolean',
        meta: {
          interface: 'boolean',
          width: 'half'
        },
        schema: {
          default_value: false
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'input',
          hidden: false
        },
        schema: {
          is_nullable: true
        }
      }
    ],
    'destinations': [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid']
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false
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
          },
          width: 'half'
        },
        schema: {
          default_value: 'published'
        }
      },
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true },
          required: true
        },
        schema: {
          is_nullable: false
        }
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
        field: 'subtitle',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'country',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'region',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Alpen', value: 'alps' },
              { text: 'Mittelmeer', value: 'mediterranean' },
              { text: 'Nordeuropa', value: 'northern_europe' },
              { text: 'Mitteleuropa', value: 'central_europe' },
              { text: 'Südeuropa', value: 'southern_europe' }
            ]
          }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'short_description',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-rich-text-html',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'main_image',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'is_featured',
        type: 'boolean',
        meta: {
          interface: 'boolean',
          width: 'half'
        },
        schema: {
          default_value: false
        }
      },
      {
        field: 'is_popular',
        type: 'boolean',
        meta: {
          interface: 'boolean',
          width: 'half'
        },
        schema: {
          default_value: false
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'input',
          hidden: false
        },
        schema: {
          is_nullable: true
        }
      }
    ],
    'categories': [
      {
        field: 'id',
        type: 'string',
        meta: {
          interface: 'input',
          readonly: false
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false
        }
      },
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true },
          required: true
        },
        schema: {
          is_nullable: false
        }
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
          },
          width: 'half'
        },
        schema: {
          default_value: 'both'
        }
      },
      {
        field: 'description',
        type: 'string',
        meta: {
          interface: 'input-multiline',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'featured',
        type: 'boolean',
        meta: {
          interface: 'boolean',
          width: 'half'
        },
        schema: {
          default_value: false
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'input',
          hidden: false
        },
        schema: {
          is_nullable: true
        }
      }
    ],
    'rooms': [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid']
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false
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
          },
          width: 'half'
        },
        schema: {
          default_value: 'published'
        }
      },
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true },
          required: true
        },
        schema: {
          is_nullable: false
        }
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
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-rich-text-html',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'size',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'max_occupancy',
        type: 'integer',
        meta: {
          interface: 'input',
          options: { min: 1 }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'main_image',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'price_per_night',
        type: 'integer',
        meta: {
          interface: 'input'
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'currency',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Euro (EUR)', value: 'EUR' },
              { text: 'Schweizer Franken (CHF)', value: 'CHF' },
              { text: 'US-Dollar (USD)', value: 'USD' },
              { text: 'Britisches Pfund (GBP)', value: 'GBP' }
            ]
          }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'hotel',
        type: 'uuid',
        meta: {
          interface: 'select-dropdown-m2o',
          special: ['m2o'],
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'input',
          hidden: false
        },
        schema: {
          is_nullable: true
        }
      }
    ],
    'pages': [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid']
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false
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
          },
          width: 'half'
        },
        schema: {
          default_value: 'published'
        }
      },
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true },
          required: true
        },
        schema: {
          is_nullable: false
        }
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
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'template',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Standard', value: 'default' },
              { text: 'Volle Breite', value: 'full_width' },
              { text: 'Mit Seitenleiste', value: 'sidebar' },
              { text: 'Landing Page', value: 'landing' }
            ]
          }
        },
        schema: {
          default_value: 'default'
        }
      },
      {
        field: 'meta_title',
        type: 'string',
        meta: {
          interface: 'input',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'meta_description',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'show_in_navigation',
        type: 'boolean',
        meta: {
          interface: 'boolean'
        },
        schema: {
          default_value: false
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'input',
          hidden: false
        },
        schema: {
          is_nullable: true
        }
      }
    ]
  };

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  let createdFields = 0;
  for (const [collection, fields] of Object.entries(collectionsFields)) {
    for (const field of fields) {
      try {
        // Überprüfe, ob das Feld bereits existiert
        try {
          await axios.get(`${DIRECTUS_URL}/fields/${collection}/${field.field}`, { headers });
          console.log(`⚠️ Feld "${field.field}" für Collection "${collection}" existiert bereits, überspringe...`);
          continue;
        } catch (error) {
          if (error.response && error.response.status !== 404) {
            console.error(`❌ Fehler beim Überprüfen des Feldes "${field.field}" für Collection "${collection}":`, 
              error.response?.data?.errors || error.message);
            continue;
          }
          // 404 bedeutet, dass das Feld nicht existiert, was gut ist, da wir es erstellen wollen
        }

        // Erstelle das Feld
        await axios.post(`${DIRECTUS_URL}/fields/${collection}`, field, { headers });
        console.log(`✅ Feld "${field.field}" für Collection "${collection}" erstellt!`);
        createdFields++;
      } catch (error) {
        console.error(`❌ Fehler beim Erstellen des Feldes "${field.field}" für Collection "${collection}":`, 
          error.response?.data?.errors || error.message);
      }
    }
  }
  
  return createdFields;
}

// Create Relations
async function createRelations(accessToken) {
  console.log('🔄 Erstelle Beziehungen zwischen Collections...');
  
  const relations = [
    // Hotels zu Destinations (m2o)
    {
      collection: 'hotels',
      field: 'destination',
      related_collection: 'destinations',
      meta: {
        junction_field: null,
        many_collection: 'hotels',
        many_field: 'destination',
        one_collection: 'destinations',
        one_field: 'hotels',
        sort_field: null
      }
    },
    // Hotels zu Categories (m2m)
    {
      collection: 'hotels_categories',
      field: 'hotels_id',
      related_collection: 'hotels',
      meta: {
        junction_field: 'categories_id'
      }
    },
    {
      collection: 'hotels_categories',
      field: 'categories_id',
      related_collection: 'categories',
      meta: {
        junction_field: 'hotels_id'
      }
    },
    // Destinations zu Categories (m2m)
    {
      collection: 'destinations_categories',
      field: 'destinations_id',
      related_collection: 'destinations',
      meta: {
        junction_field: 'categories_id'
      }
    },
    {
      collection: 'destinations_categories',
      field: 'categories_id',
      related_collection: 'categories',
      meta: {
        junction_field: 'destinations_id'
      }
    },
    // Rooms zu Hotels (m2o)
    {
      collection: 'rooms',
      field: 'hotel',
      related_collection: 'hotels',
      meta: {
        junction_field: null,
        many_collection: 'rooms',
        many_field: 'hotel',
        one_collection: 'hotels',
        one_field: 'rooms',
        sort_field: null
      }
    }
  ];

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  // Prüfe, ob Verknüpfungstabellen existieren, erstelle sie wenn nicht
  const junctionCollections = ['hotels_categories', 'destinations_categories'];
  for (const collection of junctionCollections) {
    try {
      // Überprüfe, ob die Collection bereits existiert
      await axios.get(`${DIRECTUS_URL}/collections/${collection}`, { headers });
      console.log(`⚠️ Junction Collection "${collection}" existiert bereits, überspringe...`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Collection existiert nicht, erstelle sie
        try {
          await axios.post(`${DIRECTUS_URL}/collections`, {
            collection,
            meta: {
              hidden: true,
              icon: 'link'
            },
            schema: {
              name: collection
            }
          }, { headers });
          console.log(`✅ Junction Collection "${collection}" erstellt!`);
          
          // Erstelle die erforderlichen Felder für die Junction Collection
          const fields = [];
          if (collection === 'hotels_categories') {
            fields.push(
              {
                field: 'id',
                type: 'integer',
                meta: { hidden: true },
                schema: { is_primary_key: true, has_auto_increment: true }
              },
              {
                field: 'hotels_id',
                type: 'uuid',
                meta: { interface: 'select-dropdown-m2o', special: ['m2o'] },
                schema: {}
              },
              {
                field: 'categories_id',
                type: 'string',
                meta: { interface: 'select-dropdown-m2o', special: ['m2o'] },
                schema: {}
              }
            );
          } else if (collection === 'destinations_categories') {
            fields.push(
              {
                field: 'id',
                type: 'integer',
                meta: { hidden: true },
                schema: { is_primary_key: true, has_auto_increment: true }
              },
              {
                field: 'destinations_id',
                type: 'uuid',
                meta: { interface: 'select-dropdown-m2o', special: ['m2o'] },
                schema: {}
              },
              {
                field: 'categories_id',
                type: 'string',
                meta: { interface: 'select-dropdown-m2o', special: ['m2o'] },
                schema: {}
              }
            );
          }
          
          for (const field of fields) {
            try {
              await axios.post(`${DIRECTUS_URL}/fields/${collection}`, field, { headers });
              console.log(`✅ Feld "${field.field}" für Junction Collection "${collection}" erstellt!`);
            } catch (fieldError) {
              console.error(`❌ Fehler beim Erstellen des Feldes "${field.field}" für Junction Collection "${collection}":`, 
                fieldError.response?.data?.errors || fieldError.message);
            }
          }
        } catch (createError) {
          console.error(`❌ Fehler beim Erstellen der Junction Collection "${collection}":`, 
            createError.response?.data?.errors || createError.message);
        }
      } else {
        console.error(`❌ Fehler beim Überprüfen der Junction Collection "${collection}":`, 
          error.response?.data?.errors || error.message);
      }
    }
  }

  // Erstelle die Beziehungen
  let createdRelations = 0;
  for (const relation of relations) {
    try {
      // Überprüfe, ob die Beziehung bereits existiert
      try {
        const response = await axios.get(`${DIRECTUS_URL}/relations/${relation.collection}/${relation.field}`, { headers });
        console.log(`⚠️ Beziehung "${relation.collection}.${relation.field}" zu "${relation.related_collection}" existiert bereits, überspringe...`);
        continue;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error(`❌ Fehler beim Überprüfen der Beziehung "${relation.collection}.${relation.field}" zu "${relation.related_collection}":`, 
            error.response?.data?.errors || error.message);
          continue;
        }
        // 404 bedeutet, dass die Beziehung nicht existiert, was gut ist, da wir sie erstellen wollen
      }

      // Erstelle die Beziehung
      await axios.post(`${DIRECTUS_URL}/relations`, relation, { headers });
      console.log(`✅ Beziehung "${relation.collection}.${relation.field}" zu "${relation.related_collection}" erstellt!`);
      createdRelations++;
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen der Beziehung "${relation.collection}.${relation.field}" zu "${relation.related_collection}":`, 
        error.response?.data?.errors || error.message);
    }
  }
  
  return createdRelations;
}

// Set Permissions
async function setPermissions(accessToken) {
  console.log('🔐 Setze Berechtigungen...');
  
  // Get all collections including junction tables
  let collections = [];
  try {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await axios.get(`${DIRECTUS_URL}/collections`, { headers });
    
    collections = response.data.data
      .filter(collection => !collection.collection.startsWith('directus_'))
      .map(collection => collection.collection);
    
    console.log(`📚 Gefundene Collections für Berechtigungen: ${collections.join(', ')}`);
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Collections für Berechtigungen:', 
      error.response?.data?.errors || error.message);
    return 0;
  }

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  // Get or create the public role
  let publicRoleId;
  try {
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, { headers });
    const publicRole = rolesResponse.data.data.find(role => role.name === 'Public');
    
    if (publicRole) {
      console.log(`✅ Public-Rolle gefunden mit ID: ${publicRole.id}`);
      publicRoleId = publicRole.id;
    } else {
      console.log('⚠️ Keine Public-Rolle gefunden, erstelle neue...');
      
      try {
        const createRoleResponse = await axios.post(`${DIRECTUS_URL}/roles`, {
          name: 'Public',
          app_access: false,
          admin_access: false,
          enforce_tfa: false,
          description: 'Public access role for API'
        }, { headers });
        
        publicRoleId = createRoleResponse.data.data.id;
        console.log(`✅ Public-Rolle erstellt mit ID: ${publicRoleId}`);
      } catch (createError) {
        console.error('❌ Fehler beim Erstellen der Public-Rolle:', 
          createError.response?.data?.errors || createError.message);
        return 0;
      }
    }
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Rollen:', 
      error.response?.data?.errors || error.message);
    return 0;
  }

  // Add system collections that need permissions
  collections.push('directus_files');

  // Überprüfe und aktualisiere Berechtigungen für alle Collections
  let setPermissionsCount = 0;
  for (const collection of collections) {
    for (const action of ['create', 'read', 'update', 'delete']) {
      try {
        // Prüfe, ob Berechtigungen bereits existieren
        const checkPermission = await axios.get(
          `${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[action][_eq]=${action}&filter[role][_eq]=${publicRoleId}`, 
          { headers }
        );
        
        if (checkPermission.data.data.length > 0) {
          console.log(`⚠️ ${action.charAt(0).toUpperCase() + action.slice(1)}-Berechtigung für "${collection}" existiert bereits, aktualisiere...`);
          
          // Aktualisiere die Berechtigung
          const permissionId = checkPermission.data.data[0].id;
          await axios.patch(`${DIRECTUS_URL}/permissions/${permissionId}`, {
            action,
            role: publicRoleId,
            collection,
            fields: ['*']
          }, { headers });
          
          console.log(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)}-Berechtigung für "${collection}" aktualisiert!`);
          setPermissionsCount++;
        } else {
          // Erstelle neue Berechtigung
          await axios.post(`${DIRECTUS_URL}/permissions`, {
            role: publicRoleId,
            collection,
            action,
            fields: ['*']
          }, { headers });
          
          console.log(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)}-Berechtigung für "${collection}" hinzugefügt!`);
          setPermissionsCount++;
        }
      } catch (error) {
        console.error(`❌ Fehler beim Setzen der ${action}-Berechtigungen für "${collection}":`, 
          error.response?.data?.errors || error.message);
      }
    }
  }
  
  return setPermissionsCount;
}

// Add Test Data
async function addTestData(accessToken) {
  console.log('📊 Füge Testdaten hinzu...');
  
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  // Add categories
  const categories = [
    { id: '1', name: 'Luxury', slug: 'luxury', type: 'both', description: 'Premium accommodations and destinations offering the highest level of service and amenities.', featured: true },
    { id: '2', name: 'Beach', slug: 'beach', type: 'destination', description: 'Beautiful coastal locations with stunning beaches and ocean views.', featured: true },
    { id: '3', name: 'Mountain', slug: 'mountain', type: 'destination', description: 'Spectacular mountain destinations perfect for outdoor activities and dramatic landscapes.', featured: true },
    { id: '4', name: 'Cultural', slug: 'cultural', type: 'destination', description: 'Destinations rich in history, art, and cultural experiences.', featured: true },
    { id: '5', name: 'Culinary', slug: 'culinary', type: 'both', description: 'Experiences focused on exceptional dining and local cuisines.', featured: false },
    { id: '6', name: 'Wellness', slug: 'wellness', type: 'hotel', description: 'Properties featuring exceptional spa and wellness facilities.', featured: true },
    { id: '7', name: 'Family-Friendly', slug: 'family-friendly', type: 'both', description: 'Accommodations and destinations perfect for family vacations.', featured: false },
    { id: '8', name: 'Romantic', slug: 'romantic', type: 'both', description: 'Ideal settings for couples and romantic getaways.', featured: true }
  ];
  
  const categoryIds = [];
  let addedCategories = 0;
  for (const category of categories) {
    try {
      // Check if category exists
      const checkResponse = await axios.get(
        `${DIRECTUS_URL}/items/categories?filter[slug][_eq]=${category.slug}`, 
        { headers }
      );
      
      if (checkResponse.data.data.length > 0) {
        console.log(`⚠️ Kategorie "${category.name}" existiert bereits, überspringe...`);
        categoryIds.push(checkResponse.data.data[0].id);
        continue;
      }
      
      // Create category
      const response = await axios.post(`${DIRECTUS_URL}/items/categories`, category, { headers });
      console.log(`✅ Kategorie "${category.name}" erstellt!`);
      categoryIds.push(response.data.data.id);
      addedCategories++;
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen der Kategorie "${category.name}":`, 
        error.response?.data?.errors || error.message);
    }
  }

  // Add destinations
  const destinations = [
    {
      name: 'Amalfi Coast',
      slug: 'amalfi-coast',
      subtitle: 'Italy\'s breathtaking coastal paradise',
      country: 'Italy',
      region: 'mediterranean',
      short_description: 'Discover the stunning Amalfi Coast with its dramatic cliffs, colorful villages, and crystal-clear waters of the Mediterranean.',
      description: '<p>The Amalfi Coast, a UNESCO World Heritage Site, is one of Italy\'s most iconic and breathtaking destinations. This 50-kilometer stretch of coastline along the southern edge of Italy\'s Sorrentine Peninsula features dramatic cliffs that plunge into the azure waters of the Mediterranean, creating a landscape of exceptional beauty.</p><p>The coast is dotted with picturesque towns and villages, each with its own unique charm. Positano, with its pastel-colored houses cascading down the hillside; Amalfi, with its impressive cathedral and maritime history; and Ravello, perched high above the sea with its luxurious villas and gardens, are just a few of the highlights.</p>',
      main_image: 'amalfi-coast.jpg',
      is_featured: true,
      is_popular: true,
      status: 'published'
    },
    {
      name: 'Swiss Alps',
      slug: 'swiss-alps',
      subtitle: 'Majestic mountain landscapes and luxury experiences',
      country: 'Switzerland',
      region: 'alps',
      short_description: 'Experience the breathtaking beauty of the Swiss Alps with their soaring peaks, pristine lakes, and world-class mountain resorts.',
      description: '<p>The Swiss Alps represent one of the most iconic and spectacular mountain ranges in the world. Covering nearly 60% of Switzerland\'s territory, these majestic mountains offer an unparalleled combination of natural beauty, outdoor activities, and cultural experiences.</p><p>From the famous peaks of the Matterhorn, Eiger, and Jungfrau to the stunning alpine lakes and meadows, the landscape presents a breathtaking panorama in every direction. Picturesque villages with traditional wooden chalets dot the valleys, preserving centuries-old Swiss customs and architecture.</p>',
      main_image: 'swiss-alps.jpg',
      is_featured: true,
      is_popular: true,
      status: 'published'
    },
    {
      name: 'Barcelona',
      slug: 'barcelona',
      subtitle: 'A vibrant blend of culture, architecture, and Mediterranean charm',
      country: 'Spain',
      region: 'mediterranean',
      short_description: 'Explore the unique Catalan culture, Gaudí\'s architectural marvels, and the sun-soaked beaches of Barcelona.',
      description: '<p>Barcelona, the cosmopolitan capital of Spain\'s Catalonia region, is a city that seamlessly blends historic charm with avant-garde style. Its streets are a living museum of architectural wonders, from the medieval Gothic Quarter to Antoni Gaudí\'s surreal masterpieces like the Sagrada Familia and Park Güell.</p><p>The city offers a perfect balance of urban excitement and relaxation. Stroll down the iconic La Rambla boulevard, explore the bustling La Boqueria market, or unwind on the city\'s Mediterranean beaches. Barcelona\'s culinary scene is equally impressive, with everything from traditional tapas bars to innovative Michelin-starred restaurants showcasing Catalan and Spanish cuisine.</p>',
      main_image: 'barcelona.jpg',
      is_featured: false,
      is_popular: true,
      status: 'published'
    }
  ];
  
  const destinationIds = [];
  let addedDestinations = 0;
  for (const destination of destinations) {
    try {
      // Check if destination exists
      const checkResponse = await axios.get(
        `${DIRECTUS_URL}/items/destinations?filter[slug][_eq]=${destination.slug}`, 
        { headers }
      );
      
      if (checkResponse.data.data.length > 0) {
        console.log(`⚠️ Destination "${destination.name}" existiert bereits, überspringe...`);
        destinationIds.push(checkResponse.data.data[0].id);
        continue;
      }
      
      // Create destination
      const response = await axios.post(`${DIRECTUS_URL}/items/destinations`, destination, { headers });
      console.log(`✅ Destination "${destination.name}" erstellt!`);
      destinationIds.push(response.data.data.id);
      addedDestinations++;
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen der Destination "${destination.name}":`, 
        error.response?.data?.errors || error.message);
    }
  }

  // Add hotels
  const hotels = [
    {
      name: 'Grand Hotel Convento di Amalfi',
      slug: 'grand-hotel-convento-di-amalfi',
      subtitle: 'A historic monastery transformed into a luxury cliff-side retreat',
      location: 'Amalfi',
      region: 'mediterranean',
      short_description: 'Perched on a cliff 80 meters above sea level, this luxury hotel combines 12th-century architecture with modern comforts and breathtaking views.',
      description: '<p>Perched on a cliff 80 meters above sea level, this luxury hotel combines 12th-century architecture with modern comforts. Featuring a stunning infinity pool, panoramic terraces, and a wellness center.</p><p>The hotel occupies a converted 13th-century monastery and features a fascinating mix of Arab-Norman, Baroque, and Rococo architectural styles.</p>',
      main_image: 'convento-amalfi.jpg',
      price_from: 450,
      currency: 'EUR',
      star_rating: 5,
      destination: destinationIds[0], // Amalfi Coast
      is_featured: true,
      status: 'published'
    },
    {
      name: 'The Alpina Gstaad',
      slug: 'alpina-gstaad',
      subtitle: 'Contemporary Swiss luxury with alpine soul',
      location: 'Gstaad',
      region: 'alps',
      short_description: 'This five-star mountain retreat blends traditional Swiss architecture with contemporary style, offering exceptional amenities including a world-class spa and Michelin-starred dining.',
      description: '<p>A five-star mountain resort blending traditional Swiss architecture with contemporary style. The hotel features three restaurants, a spa, and an indoor swimming pool.</p><p>Each room offers stunning views of the Swiss Alps and is finished with authentic local materials including Swiss spruce and regional granite.</p>',
      main_image: 'alpina-gstaad.jpg',
      price_from: 850,
      currency: 'CHF',
      star_rating: 5,
      destination: destinationIds[1], // Swiss Alps
      is_featured: true,
      status: 'published'
    },
    {
      name: 'Hotel Arts Barcelona',
      slug: 'hotel-arts-barcelona',
      subtitle: 'Modern luxury overlooking the Mediterranean',
      location: 'Barcelona',
      region: 'mediterranean',
      short_description: 'This iconic 44-story skyscraper offers luxurious accommodations with stunning sea views, an outdoor pool, and a two-Michelin-star restaurant.',
      description: '<p>This iconic 44-story skyscraper offers luxurious accommodations with stunning sea views. The hotel features an outdoor pool, a spa, and the two-Michelin-star restaurant Enoteca.</p><p>Located on the beachfront in the Olympic Village area, Hotel Arts Barcelona provides easy access to both the city center and the beach.</p>',
      main_image: 'hotel-arts-barcelona.jpg',
      price_from: 380,
      currency: 'EUR',
      star_rating: 5,
      destination: destinationIds[2], // Barcelona
      is_featured: false,
      status: 'published'
    }
  ];
  
  let addedHotels = 0;
  const hotelIds = [];
  for (const hotel of hotels) {
    try {
      // Check if hotel exists
      const checkResponse = await axios.get(
        `${DIRECTUS_URL}/items/hotels?filter[slug][_eq]=${hotel.slug}`, 
        { headers }
      );
      
      if (checkResponse.data.data.length > 0) {
        console.log(`⚠️ Hotel "${hotel.name}" existiert bereits, überspringe...`);
        hotelIds.push(checkResponse.data.data[0].id);
        continue;
      }
      
      // Create hotel
      const response = await axios.post(`${DIRECTUS_URL}/items/hotels`, hotel, { headers });
      console.log(`✅ Hotel "${hotel.name}" erstellt!`);
      hotelIds.push(response.data.data.id);
      addedHotels++;
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen des Hotels "${hotel.name}":`, 
        error.response?.data?.errors || error.message);
    }
  }

  // Add rooms
  const rooms = [
    {
      name: 'Deluxe Sea View',
      slug: 'deluxe-sea-view-convento',
      hotel: hotelIds[0], // Grand Hotel Convento di Amalfi
      size: '35 m²',
      max_occupancy: 2,
      description: 'Elegant room with a stunning sea view and a king-size bed.',
      price_per_night: 500,
      currency: 'EUR',
      main_image: 'room-convento-1.jpg',
      status: 'published'
    },
    {
      name: 'Superior Suite',
      slug: 'superior-suite-convento',
      hotel: hotelIds[0], // Grand Hotel Convento di Amalfi
      size: '60 m²',
      max_occupancy: 3,
      description: 'Spacious suite with a separate living area and a private terrace overlooking the sea.',
      price_per_night: 800,
      currency: 'EUR',
      main_image: 'room-convento-2.jpg',
      status: 'published'
    },
    {
      name: 'Deluxe Room',
      slug: 'deluxe-room-alpina',
      hotel: hotelIds[1], // The Alpina Gstaad
      size: '40 m²',
      max_occupancy: 2,
      description: 'Elegant room with Alpine views and a king-size or twin beds.',
      price_per_night: 600,
      currency: 'CHF',
      main_image: 'room-alpina-1.jpg',
      status: 'published'
    },
    {
      name: 'Junior Suite',
      slug: 'junior-suite-alpina',
      hotel: hotelIds[1], // The Alpina Gstaad
      size: '55 m²',
      max_occupancy: 3,
      description: 'Spacious suite with a cozy fireplace and a balcony offering mountain views.',
      price_per_night: 900,
      currency: 'CHF',
      main_image: 'room-alpina-2.jpg',
      status: 'published'
    },
    {
      name: 'Deluxe Sea View',
      slug: 'deluxe-sea-view-arts',
      hotel: hotelIds[2], // Hotel Arts Barcelona
      size: '40 m²',
      max_occupancy: 2,
      description: 'Contemporary room with panoramic sea views and elegant furnishings.',
      price_per_night: 380,
      currency: 'EUR',
      main_image: 'room-arts-1.jpg',
      status: 'published'
    },
    {
      name: 'Executive Suite',
      slug: 'executive-suite-arts',
      hotel: hotelIds[2], // Hotel Arts Barcelona
      size: '75 m²',
      max_occupancy: 3,
      description: 'Luxurious suite with a separate living area and views over Barcelona and the Mediterranean.',
      price_per_night: 550,
      currency: 'EUR',
      main_image: 'room-arts-2.jpg',
      status: 'published'
    }
  ];
  
  let addedRooms = 0;
  for (const room of rooms) {
    try {
      // Check if room exists
      const checkResponse = await axios.get(
        `${DIRECTUS_URL}/items/rooms?filter[slug][_eq]=${room.slug}`, 
        { headers }
      );
      
      if (checkResponse.data.data.length > 0) {
        console.log(`⚠️ Zimmer "${room.name}" existiert bereits, überspringe...`);
        continue;
      }
      
      // Create room
      const response = await axios.post(`${DIRECTUS_URL}/items/rooms`, room, { headers });
      console.log(`✅ Zimmer "${room.name}" erstellt!`);
      addedRooms++;
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen des Zimmers "${room.name}":`, 
        error.response?.data?.errors || error.message);
    }
  }

  // Add pages
  const pages = [
    {
      title: 'About',
      slug: 'about',
      content: '<p>Welcome to CinCin Hotels, your gateway to extraordinary hospitality experiences across Europe\'s most beautiful destinations.</p><p>Founded with a passion for exceptional service and memorable stays, CinCin Hotels curates a collection of the finest boutique and luxury properties across the Mediterranean, Alps, and beyond.</p><p>Our commitment goes beyond providing a place to stay. We believe in creating immersive experiences that connect our guests with the heart and soul of each destination. From the culinary delights of coastal Italy to the serene beauty of Alpine retreats, each property in our collection tells a unique story and offers a distinctive sense of place.</p>',
      template: 'default',
      meta_title: 'About CinCin Hotels | Luxury Hotel Collection',
      meta_description: 'Learn about CinCin Hotels, a curated collection of luxury boutique properties across Europe\'s most beautiful destinations.',
      show_in_navigation: true,
      sort: 10,
      status: 'published'
    },
    {
      title: 'Contact',
      slug: 'contact',
      content: '<h2>Get in Touch</h2><p>We\'d love to hear from you. Whether you have a question about one of our properties, need assistance with a booking, or want to discuss potential partnerships, our team is here to help.</p><p><strong>General Inquiries:</strong><br>info@cincinhotels.com<br>+41 44 123 4567</p><p><strong>Reservations:</strong><br>reservations@cincinhotels.com<br>+41 44 123 4568</p><p><strong>Media & Press:</strong><br>press@cincinhotels.com</p><p><strong>Head Office:</strong><br>CinCin Hotels AG<br>Bahnhofstrasse 10<br>8001 Zürich<br>Switzerland</p>',
      template: 'sidebar',
      meta_title: 'Contact CinCin Hotels | Get in Touch',
      meta_description: 'Contact CinCin Hotels for inquiries about our luxury properties, assistance with bookings, or partnership opportunities.',
      show_in_navigation: true,
      sort: 20,
      status: 'published'
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: '<h2>Privacy Policy</h2><p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a reservation through cincinhotels.com (the "Site").</p><p><strong>Personal Information We Collect</strong></p><p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as "Device Information."</p>',
      template: 'default',
      meta_title: 'Privacy Policy | CinCin Hotels',
      meta_description: 'Learn about how CinCin Hotels collects, uses, and protects your personal information.',
      show_in_navigation: false,
      sort: 30,
      status: 'published'
    }
  ];
  
  let addedPages = 0;
  for (const page of pages) {
    try {
      // Check if page exists
      const checkResponse = await axios.get(
        `${DIRECTUS_URL}/items/pages?filter[slug][_eq]=${page.slug}`, 
        { headers }
      );
      
      if (checkResponse.data.data.length > 0) {
        console.log(`⚠️ Seite "${page.title}" existiert bereits, überspringe...`);
        continue;
      }
      
      // Create page
      const response = await axios.post(`${DIRECTUS_URL}/items/pages`, page, { headers });
      console.log(`✅ Seite "${page.title}" erstellt!`);
      addedPages++;
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen der Seite "${page.title}":`, 
        error.response?.data?.errors || error.message);
    }
  }
  
  return {
    categories: addedCategories,
    destinations: addedDestinations,
    hotels: addedHotels,
    rooms: addedRooms,
    pages: addedPages
  };
}

// Create .env.local file without mock server
function updateEnvFile() {
  console.log('📝 Aktualisiere .env.local Datei...');
  
  try {
    if (fs.existsSync('.env.local')) {
      let envContent = fs.readFileSync('.env.local', 'utf8');
      
      // Deaktiviere Mock-Server
      if (envContent.includes('IS_MOCK_SERVER=')) {
        envContent = envContent.replace(/IS_MOCK_SERVER=.+/, 'IS_MOCK_SERVER=false');
        fs.writeFileSync('.env.local', envContent);
        console.log('✅ .env.local aktualisiert: IS_MOCK_SERVER=false');
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der .env.local Datei:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starte vollständiges Directus Setup für CinCin Hotels...');
  
  // Check and install dependencies
  checkAndInstallDependencies();
  
  // Check if Directus is running
  await checkDirectusStatus();
  
  // Login to Directus
  const accessToken = await loginToDirectus();
  
  // Create Collections
  const collectionsCount = await createCollections(accessToken);
  
  // Create Fields
  const fieldsCount = await createFields(accessToken);
  
  // Create Relations
  const relationsCount = await createRelations(accessToken);
  
  // Set Permissions
  const permissionsCount = await setPermissions(accessToken);
  
  // Add Test Data
  const testData = await addTestData(accessToken);
  
  // Deactivate Mock Server
  const envUpdated = updateEnvFile();
  
  // Summary
  console.log('\n✅ Directus Setup abgeschlossen!');
  console.log('\n📊 Setup-Zusammenfassung:');
  console.log(`- Collections erstellt: ${collectionsCount}`);
  console.log(`- Felder erstellt: ${fieldsCount}`);
  console.log(`- Beziehungen erstellt: ${relationsCount}`);
  console.log(`- Berechtigungen gesetzt: ${permissionsCount}`);
  console.log(`- Testdaten:
  • ${testData.categories} Kategorien
  • ${testData.destinations} Destinationen
  • ${testData.hotels} Hotels
  • ${testData.rooms} Zimmer
  • ${testData.pages} Seiten`);
  
  console.log(`\n🔄 .env.local Datei: ${envUpdated ? 'Aktualisiert (IS_MOCK_SERVER=false)' : 'Keine Änderung nötig'}`);
  
  console.log('\n🔄 Nächste Schritte:');
  console.log('1. Starte deine Next.js-Anwendung mit "npm run dev"');
  console.log('2. Besuche http://localhost:8055 um deine Daten in Directus zu verwalten');
}

// Run the main function
main().catch(error => {
  console.error('❌ Ein unerwarteter Fehler ist aufgetreten:', error);
});