/**
 * CinCin Hotels Directus Setup Script
 * 
 * Dieses Skript konfiguriert automatisch das Directus CMS für das CinCin Hotels Projekt.
 * Es erstellt alle Collections, Felder, Beziehungen, Berechtigungen und Testdaten.
 * 
 * Ausführung: node setup-directus.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// CONFIGURATION
const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@cincinhotels.com';
// Admin password from docker-compose.yml
const ADMIN_PASSWORD = 'admin123';
const API_TOKEN_NAME = '1m6IZHnuxyhFrLMrcHTTO2FBEH1JQrQ-';
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

// Login to Directus and get access token
async function loginToDirectus() {
  console.log('🔑 Melde mich bei Directus an...');
  
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    console.log('✅ Anmeldung erfolgreich!');
    return response.data.data.access_token;
  } catch (error) {
    console.error('❌ Anmeldung fehlgeschlagen:', error.response?.data?.errors || error.message);
    process.exit(1);
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
    }
  ];

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  for (const collection of collections) {
    try {
      // Check if collection already exists
      const checkResponse = await axios.get(`${DIRECTUS_URL}/collections/${collection.collection}`, { headers });
      console.log(`⚠️ Collection "${collection.collection}" existiert bereits, überspringe...`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Collection doesn't exist, create it
        try {
          await axios.post(`${DIRECTUS_URL}/collections`, collection, { headers });
          console.log(`✅ Collection "${collection.collection}" erstellt!`);
        } catch (createError) {
          console.error(`❌ Fehler beim Erstellen der Collection "${collection.collection}":`, 
            createError.response?.data?.errors || createError.message);
        }
      } else {
        console.error(`❌ Fehler beim Überprüfen der Collection "${collection.collection}":`, 
          error.response?.data?.errors || error.message);
      }
    }
  }
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
          interface: 'input-multiline',
          options: { trim: true }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'long_description',
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
        field: 'price_range',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: '$', value: '$' },
              { text: '$$', value: '$$' },
              { text: '$$$', value: '$$$' },
              { text: '$$$$', value: '$$$$' }
            ]
          }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'images',
        type: 'json',
        meta: {
          interface: 'files',
          special: ['files']
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
          options: {
            label: 'Featured'
          }
        },
        schema: {
          default_value: false
        }
      },
      {
        field: 'destination',
        type: 'uuid',
        meta: {
          interface: 'select-dropdown-m2o',
          special: ['m2o'],
          options: {
            template: '{{name}}'
          }
        },
        schema: {
          is_nullable: true,
          foreign_key_table: 'destinations'
        }
      },
      {
        field: 'categories',
        type: 'alias',
        meta: {
          special: ['m2m'],
          interface: 'list-m2m',
          options: {
            template: '{{categories_id.name}}'
          }
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
          interface: 'input-multiline',
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
        field: 'climate_info',
        type: 'json',
        meta: {
          interface: 'input-code',
          options: {
            language: 'json'
          }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'travel_info',
        type: 'json',
        meta: {
          interface: 'input-code',
          options: {
            language: 'json'
          }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'images',
        type: 'json',
        meta: {
          interface: 'files',
          special: ['files']
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'categories',
        type: 'alias',
        meta: {
          special: ['m2m'],
          interface: 'list-m2m',
          options: {
            template: '{{categories_id.name}}'
          }
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
        field: 'icon',
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
        field: 'hotel',
        type: 'uuid',
        meta: {
          interface: 'select-dropdown-m2o',
          special: ['m2o'],
          required: true,
          options: {
            template: '{{name}}'
          }
        },
        schema: {
          is_nullable: false,
          foreign_key_table: 'hotels'
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
        field: 'max_persons',
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
        field: 'description',
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
        field: 'price',
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
        field: 'images',
        type: 'json',
        meta: {
          interface: 'files',
          special: ['files']
        },
        schema: {
          is_nullable: true
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
      } catch (error) {
        console.error(`❌ Fehler beim Erstellen des Feldes "${field.field}" für Collection "${collection}":`, 
          error.response?.data?.errors || error.message);
      }
    }
  }
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
                type: 'uuid',
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
                type: 'uuid',
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
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen der Beziehung "${relation.collection}.${relation.field}" zu "${relation.related_collection}":`, 
        error.response?.data?.errors || error.message);
    }
  }
}

// Set Permissions
async function setPermissions(accessToken) {
  console.log('🔐 Setze Berechtigungen...');
  
  const collections = ['hotels', 'destinations', 'categories', 'rooms'];
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  // Get the public role
  let publicRoleId;
  try {
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, { headers });
    const publicRole = rolesResponse.data.data.find(role => role.name === 'Public');
    if (publicRole) {
      publicRoleId = publicRole.id;
    } else {
      console.error('❌ Public-Rolle nicht gefunden!');
      return;
    }
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Rollen:', error.response?.data?.errors || error.message);
    return;
  }

  // Überprüfe und aktualisiere Berechtigungen für alle Collections
  for (const collection of collections) {
    try {
      // Prüfe, ob Berechtigungen bereits existieren
      const checkPermission = await axios.get(
        `${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[role][_eq]=${publicRoleId}`, 
        { headers }
      );
      
      if (checkPermission.data.data.length > 0) {
        console.log(`⚠️ Berechtigungen für "${collection}" existieren bereits, aktualisiere...`);
        
        // Aktualisiere die Berechtigung, um sicherzustellen, dass Lesen aktiviert ist
        const permissionId = checkPermission.data.data[0].id;
        await axios.patch(`${DIRECTUS_URL}/permissions/${permissionId}`, {
          action: 'read',
          role: publicRoleId,
          collection,
          fields: ['*']
        }, { headers });
        
        console.log(`✅ Berechtigungen für "${collection}" aktualisiert!`);
      } else {
        // Erstelle neue Berechtigung
        await axios.post(`${DIRECTUS_URL}/permissions`, {
          role: publicRoleId,
          collection,
          action: 'read',
          fields: ['*']
        }, { headers });
        
        console.log(`✅ Leseberechtigungen für "${collection}" hinzugefügt!`);
      }
    } catch (error) {
      console.error(`❌ Fehler beim Setzen der Berechtigungen für "${collection}":`, 
        error.response?.data?.errors || error.message);
    }
  }
  
  // Extra permissions for directus_files (for images)
  try {
    const checkFilePermission = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[collection][_eq]=directus_files&filter[role][_eq]=${publicRoleId}`, 
      { headers }
    );
    
    if (checkFilePermission.data.data.length > 0) {
      console.log('⚠️ Berechtigungen für "directus_files" existieren bereits, aktualisiere...');
      
      // Aktualisiere die Berechtigung
      const permissionId = checkFilePermission.data.data[0].id;
      await axios.patch(`${DIRECTUS_URL}/permissions/${permissionId}`, {
        action: 'read',
        role: publicRoleId,
        collection: 'directus_files',
        fields: ['*']
      }, { headers });
      
      console.log('✅ Berechtigungen für "directus_files" aktualisiert!');
    } else {
      // Erstelle neue Berechtigung
      await axios.post(`${DIRECTUS_URL}/permissions`, {
        role: publicRoleId,
        collection: 'directus_files',
        action: 'read',
        fields: ['*']
      }, { headers });
      
      console.log('✅ Leseberechtigungen für "directus_files" hinzugefügt!');
    }
  } catch (error) {
    console.error('❌ Fehler beim Setzen der Berechtigungen für "directus_files":', 
      error.response?.data?.errors || error.message);
  }
}

// Create API Token
async function createApiToken(accessToken) {
  console.log('🔑 Erstelle API-Token für Next.js-Integration...');
  
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  // Check if token already exists
  try {
    const tokensResponse = await axios.get(`${DIRECTUS_URL}/users/me/tokens`, { headers });
    const existingToken = tokensResponse.data.data.find(token => token.name === API_TOKEN_NAME);
    
    if (existingToken) {
      console.log(`⚠️ API-Token "${API_TOKEN_NAME}" existiert bereits, überspringe...`);
      return existingToken.token;
    }
  } catch (error) {
    console.error('❌ Fehler beim Abrufen bestehender Tokens:', error.response?.data?.errors || error.message);
  }

  // Create new token
  try {
    const response = await axios.post(`${DIRECTUS_URL}/users/me/tokens`, {
      name: API_TOKEN_NAME,
      expires: null // Kein Ablaufdatum
    }, { headers });
    
    console.log('✅ API-Token für Next.js-Integration erstellt!');
    return response.data.data.access_token;
  } catch (error) {
    console.error('❌ Fehler beim Erstellen des API-Tokens:', error.response?.data?.errors || error.message);
    return null;
  }
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
    { name: 'Luxury', slug: 'luxury', icon: 'star', description: 'Luxury hotels and destinations' },
    { name: 'Beach', slug: 'beach', icon: 'beach_access', description: 'Beach hotels and resorts' },
    { name: 'Mountain', slug: 'mountain', icon: 'landscape', description: 'Mountain destinations and chalets' },
    { name: 'Urban', slug: 'urban', icon: 'location_city', description: 'City hotels and apartments' },
    { name: 'Family', slug: 'family', icon: 'family_restroom', description: 'Family-friendly accommodations' }
  ];
  
  const categoryIds = [];
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
      description: 'The Amalfi Coast is a stretch of coastline along the southern edge of Italy\'s Sorrentine Peninsula, in the Campania region.',
      location: 'Italy',
      climate_info: JSON.stringify({
        high_season: 'June to September',
        average_temp_summer: '30°C',
        average_temp_winter: '10°C',
        rainfall: 'Low in summer, moderate in winter'
      }),
      travel_info: JSON.stringify({
        airports: ['Naples International Airport (NAP)'],
        visa_requirements: 'Schengen visa for non-EU citizens',
        languages: ['Italian', 'English in tourist areas'],
        currency: 'Euro (EUR)'
      })
    },
    {
      name: 'Swiss Alps',
      slug: 'swiss-alps',
      description: 'The Swiss Alps are the portion of the Alps mountain range that lies within Switzerland.',
      location: 'Switzerland',
      climate_info: JSON.stringify({
        high_season: 'December to April (winter), June to September (summer)',
        average_temp_summer: '20°C',
        average_temp_winter: '-5°C',
        rainfall: 'Moderate year-round, snow in winter'
      }),
      travel_info: JSON.stringify({
        airports: ['Zurich Airport (ZRH)', 'Geneva Airport (GVA)'],
        visa_requirements: 'Schengen visa for non-EU citizens',
        languages: ['German', 'French', 'Italian', 'Romansh', 'English in tourist areas'],
        currency: 'Swiss Franc (CHF)'
      })
    },
    {
      name: 'Paris',
      slug: 'paris',
      description: 'Paris is the capital and most populous city of France.',
      location: 'France',
      climate_info: JSON.stringify({
        high_season: 'April to October',
        average_temp_summer: '25°C',
        average_temp_winter: '5°C',
        rainfall: 'Moderate year-round'
      }),
      travel_info: JSON.stringify({
        airports: ['Charles de Gaulle Airport (CDG)', 'Orly Airport (ORY)'],
        visa_requirements: 'Schengen visa for non-EU citizens',
        languages: ['French', 'English in tourist areas'],
        currency: 'Euro (EUR)'
      })
    }
  ];
  
  const destinationIds = [];
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
      
      // Create relationship to categories
      if (categoryIds.length > 0) {
        const categoriesForDestination = [];
        // Assign 2-3 random categories
        const numCategories = Math.floor(Math.random() * 2) + 2; // 2-3 categories
        const shuffledCategories = [...categoryIds].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numCategories && i < shuffledCategories.length; i++) {
          categoriesForDestination.push({
            destinations_id: response.data.data.id,
            categories_id: shuffledCategories[i]
          });
        }
        
        // Add categories to destination
        if (categoriesForDestination.length > 0) {
          try {
            await axios.post(`${DIRECTUS_URL}/items/destinations_categories`, categoriesForDestination, { headers });
            console.log(`✅ Kategorien für Destination "${destination.name}" hinzugefügt!`);
          } catch (error) {
            console.error(`❌ Fehler beim Hinzufügen von Kategorien für Destination "${destination.name}":`, 
              error.response?.data?.errors || error.message);
          }
        }
      }
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
      description: 'Perched on a cliff 80 meters above sea level, this luxury hotel combines 12th-century architecture with modern comforts.',
      long_description: '<p>Perched on a cliff 80 meters above sea level, this luxury hotel combines 12th-century architecture with modern comforts. Featuring a stunning infinity pool, panoramic terraces, and a wellness center.</p><p>The hotel occupies a converted 13th-century monastery and features a fascinating mix of Arab-Norman, Baroque, and Rococo architectural styles.</p>',
      location: 'Amalfi, Italy',
      price_range: '$$$$',
      featured: true
    },
    {
      name: 'The Alpina Gstaad',
      slug: 'the-alpina-gstaad',
      description: 'A five-star mountain resort blending traditional Swiss architecture with contemporary style.',
      long_description: '<p>A five-star mountain resort blending traditional Swiss architecture with contemporary style. The hotel features three restaurants, a spa, and an indoor swimming pool.</p><p>Each room offers stunning views of the Swiss Alps and is finished with authentic local materials including Swiss spruce and regional granite.</p>',
      location: 'Gstaad, Switzerland',
      price_range: '$$$$',
      featured: true
    },
    {
      name: 'Le Bristol Paris',
      slug: 'le-bristol-paris',
      description: 'An iconic palace hotel featuring an elegant spa and a rooftop swimming pool.',
      long_description: '<p>Le Bristol Paris is an iconic palace hotel located on the prestigious rue du Faubourg Saint-Honoré. Founded in 1925, it embodies French elegance and art of living.</p><p>The hotel features 190 rooms and suites, a 3-Michelin star restaurant, a luxury spa, and a rooftop swimming pool with views over Paris.</p>',
      location: 'Paris, France',
      price_range: '$$$$',
      featured: false
    },
    {
      name: 'Hotel Santa Caterina',
      slug: 'hotel-santa-caterina',
      description: 'A beautiful hotel built into the cliff side with private beach access and exquisite gardens.',
      long_description: '<p>A beautiful family-owned hotel built into the cliff side with private beach access and exquisite gardens. The hotel features antique hand-painted tiles and Mediterranean architecture.</p><p>Guests can enjoy the panoramic outdoor pool, two restaurants, and a beach club accessible by elevator through the cliff.</p>',
      location: 'Amalfi, Italy',
      price_range: '$$$',
      featured: false
    }
  ];
  
  // Map destination names to IDs
  const destinationMap = {
    'Amalfi, Italy': destinationIds[0], // Amalfi Coast
    'Gstaad, Switzerland': destinationIds[1], // Swiss Alps
    'Paris, France': destinationIds[2] // Paris
  };
  
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
      
      // Add destination ID if available
      if (destinationMap[hotel.location]) {
        hotel.destination = destinationMap[hotel.location];
      }
      
      // Create hotel
      const response = await axios.post(`${DIRECTUS_URL}/items/hotels`, hotel, { headers });
      console.log(`✅ Hotel "${hotel.name}" erstellt!`);
      hotelIds.push(response.data.data.id);
      
      // Create relationship to categories
      if (categoryIds.length > 0) {
        const categoriesForHotel = [];
        // Assign 1-3 random categories
        const numCategories = Math.floor(Math.random() * 3) + 1; // 1-3 categories
        const shuffledCategories = [...categoryIds].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numCategories && i < shuffledCategories.length; i++) {
          categoriesForHotel.push({
            hotels_id: response.data.data.id,
            categories_id: shuffledCategories[i]
          });
        }
        
        // Add categories to hotel
        if (categoriesForHotel.length > 0) {
          try {
            await axios.post(`${DIRECTUS_URL}/items/hotels_categories`, categoriesForHotel, { headers });
            console.log(`✅ Kategorien für Hotel "${hotel.name}" hinzugefügt!`);
          } catch (error) {
            console.error(`❌ Fehler beim Hinzufügen von Kategorien für Hotel "${hotel.name}":`, 
              error.response?.data?.errors || error.message);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen des Hotels "${hotel.name}":`, 
        error.response?.data?.errors || error.message);
    }
  }

  // Add rooms
  const rooms = [
    {
      name: 'Deluxe Sea View',
      hotel: hotelIds[0], // Grand Hotel Convento di Amalfi
      size: '35 m²',
      max_persons: 2,
      description: 'Elegant room with a stunning sea view and a king-size bed.',
      price: '€500 per night'
    },
    {
      name: 'Superior Suite',
      hotel: hotelIds[0], // Grand Hotel Convento di Amalfi
      size: '60 m²',
      max_persons: 3,
      description: 'Spacious suite with a separate living area and a private terrace overlooking the sea.',
      price: '€800 per night'
    },
    {
      name: 'Deluxe Room',
      hotel: hotelIds[1], // The Alpina Gstaad
      size: '40 m²',
      max_persons: 2,
      description: 'Elegant room with Alpine views and a king-size or twin beds.',
      price: 'CHF 600 per night'
    },
    {
      name: 'Junior Suite',
      hotel: hotelIds[1], // The Alpina Gstaad
      size: '55 m²',
      max_persons: 3,
      description: 'Spacious suite with a cozy fireplace and a balcony offering mountain views.',
      price: 'CHF 900 per night'
    },
    {
      name: 'Superior Room',
      hotel: hotelIds[2], // Le Bristol Paris
      size: '40 m²',
      max_persons: 2,
      description: 'Elegant room with Louis XV or Louis XVI style furniture and marble bathroom.',
      price: '€1,100 per night'
    },
    {
      name: 'Prestige Suite',
      hotel: hotelIds[2], // Le Bristol Paris
      size: '75 m²',
      max_persons: 3,
      description: 'Luxurious suite with a separate living room and views over the hotel\'s French garden or Avenue Matignon.',
      price: '€2,500 per night'
    }
  ];
  
  for (const room of rooms) {
    try {
      // Check if room exists
      const checkResponse = await axios.get(
        `${DIRECTUS_URL}/items/rooms?filter[name][_eq]=${encodeURIComponent(room.name)}&filter[hotel][_eq]=${room.hotel}`, 
        { headers }
      );
      
      if (checkResponse.data.data.length > 0) {
        console.log(`⚠️ Zimmer "${room.name}" für das gewählte Hotel existiert bereits, überspringe...`);
        continue;
      }
      
      // Create room
      const response = await axios.post(`${DIRECTUS_URL}/items/rooms`, room, { headers });
      console.log(`✅ Zimmer "${room.name}" erstellt!`);
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen des Zimmers "${room.name}":`, 
        error.response?.data?.errors || error.message);
    }
  }
}

// Create .env.local file
function createEnvFile(apiToken) {
  console.log('📝 Erstelle .env.local Datei...');
  
  const envContent = `# Directus API Configuration
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=${apiToken || 'your_directus_token_here'}

# Revalidation
REVALIDATION_SECRET=e39f42a0-9f33-4b56-a2e0-d1033d2d7245

# Localization
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,de

# Cache Control
NEXT_PUBLIC_REVALIDATE_HOTEL=300
NEXT_PUBLIC_REVALIDATE_DESTINATION=600
NEXT_PUBLIC_REVALIDATE_CATEGORY=1800
NEXT_PUBLIC_REVALIDATE_PAGE=3600

# Development Mode
IS_MOCK_SERVER=false
`;

  try {
    // Check if file already exists
    if (fs.existsSync('.env.local')) {
      console.log('⚠️ .env.local existiert bereits, erstelle .env.local.new stattdessen...');
      fs.writeFileSync('.env.local.new', envContent);
      console.log('✅ .env.local.new erstellt!');
    } else {
      fs.writeFileSync('.env.local', envContent);
      console.log('✅ .env.local erstellt!');
    }
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der .env.local Datei:', error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Starte Directus Setup für CinCin Hotels...');
  
  // Check and install dependencies
  checkAndInstallDependencies();
  
  // Check if Directus is running
  await checkDirectusStatus();
  
  // Login to Directus
  const accessToken = await loginToDirectus();
  
  // Create Collections
  await createCollections(accessToken);
  
  // Create Fields
  await createFields(accessToken);
  
  // Create Relations
  await createRelations(accessToken);
  
  // Set Permissions
  await setPermissions(accessToken);
  
  // Add Test Data
  await addTestData(accessToken);
  
  // Create API Token
  const apiToken = await createApiToken(accessToken);
  
  // Create .env.local file
  createEnvFile(apiToken);
  
  console.log('\n✅ Directus Setup abgeschlossen!');
  console.log('\n📝 API-Token für Next.js-Integration:');
  console.log(apiToken || 'Token konnte nicht erstellt werden');
  
  console.log('\n🔄 Nächste Schritte:');
  console.log('1. Überprüfe die .env.local Datei und passe sie bei Bedarf an');
  console.log('2. Starte deine Next.js-Anwendung mit "npm run dev"');
  console.log('3. Besuche http://localhost:8055 um deine Daten in Directus zu verwalten');
}

// Run the main function
main().catch(error => {
  console.error('❌ Ein unerwarteter Fehler ist aufgetreten:', error);
});
