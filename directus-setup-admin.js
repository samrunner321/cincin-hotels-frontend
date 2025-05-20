/**
 * CinCin Hotels Directus Setup mit Admin-Token
 * 
 * Dieses Skript erstellt alle benötigten Collections und Felder für das CinCin Hotels Projekt
 * unter Verwendung des Admin-Tokens, der für Schema-Änderungen benötigt wird.
 */

const axios = require('axios');
const fs = require('fs');

// Konfiguration
const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_TOKEN = '_hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn'; // Der funktionierende Admin-Token

// API-Client mit Admin-Token
const api = axios.create({
  baseURL: DIRECTUS_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  }
});

// Collections definieren (aus dem vorhandenen Skript)
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
    collection: 'articles',
    meta: {
      collection: 'articles',
      icon: 'article',
      note: 'Blog- und Journal-Artikel',
      display_template: '{{title}}',
      sort_field: 'date'
    },
    schema: {
      name: 'articles',
    }
  },
  {
    collection: 'restaurant_features',
    meta: {
      collection: 'restaurant_features',
      icon: 'restaurant',
      note: 'Restaurant-Features in Hotels',
      display_template: '{{title}}',
      sort_field: 'sort'
    },
    schema: {
      name: 'restaurant_features',
    }
  }
];

// Felder für die Collections definieren (aus dem vorhandenen Skript)
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
  ],
  'articles': [
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
      field: 'excerpt',
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
      field: 'date',
      type: 'date',
      meta: {
        interface: 'datetime',
        display: 'datetime',
        required: true
      },
      schema: {
        is_nullable: false
      }
    },
    {
      field: 'author',
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
      field: 'featured_image',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        special: ['file']
      },
      schema: {
        is_nullable: true
      }
    }
  ],
  'restaurant_features': [
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
      field: 'image',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        special: ['file']
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
        options: {
          template: '{{name}}'
        }
      },
      schema: {
        is_nullable: true,
        foreign_key_table: 'hotels'
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

// Junction-Collections für m2m-Beziehungen
const junctionCollections = [
  {
    collection: 'hotels_categories',
    meta: {
      hidden: true,
      icon: 'link'
    },
    schema: {
      name: 'hotels_categories'
    }
  },
  {
    collection: 'destinations_categories',
    meta: {
      hidden: true,
      icon: 'link'
    },
    schema: {
      name: 'destinations_categories'
    }
  }
];

// Felder für Junction-Collections
const junctionFields = {
  'hotels_categories': [
    {
      field: 'id',
      type: 'integer',
      meta: { 
        hidden: true 
      },
      schema: { 
        is_primary_key: true, 
        has_auto_increment: true 
      }
    },
    {
      field: 'hotels_id',
      type: 'uuid',
      meta: { 
        interface: 'select-dropdown-m2o', 
        special: ['m2o'] 
      },
      schema: {}
    },
    {
      field: 'categories_id',
      type: 'uuid',
      meta: { 
        interface: 'select-dropdown-m2o', 
        special: ['m2o'] 
      },
      schema: {}
    }
  ],
  'destinations_categories': [
    {
      field: 'id',
      type: 'integer',
      meta: { 
        hidden: true 
      },
      schema: { 
        is_primary_key: true, 
        has_auto_increment: true 
      }
    },
    {
      field: 'destinations_id',
      type: 'uuid',
      meta: { 
        interface: 'select-dropdown-m2o', 
        special: ['m2o'] 
      },
      schema: {}
    },
    {
      field: 'categories_id',
      type: 'uuid',
      meta: { 
        interface: 'select-dropdown-m2o', 
        special: ['m2o'] 
      },
      schema: {}
    }
  ]
};

// Beziehungen zwischen Collections
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
  },
  // Restaurant_features zu Hotels (m2o)
  {
    collection: 'restaurant_features',
    field: 'hotel',
    related_collection: 'hotels',
    meta: {
      junction_field: null,
      many_collection: 'restaurant_features',
      many_field: 'hotel',
      one_collection: 'hotels',
      one_field: 'restaurant_features',
      sort_field: null
    }
  }
];

// 1. Erstelle Collections
async function createCollections() {
  console.log('📊 Erstelle Collections...');
  
  // Hauptsammlungen erstellen
  for (const collection of collections) {
    try {
      // Prüfe, ob Collection bereits existiert
      try {
        await api.get(`/collections/${collection.collection}`);
        console.log(`⚠️ Collection "${collection.collection}" existiert bereits, überspringe...`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Collection existiert nicht, erstelle sie
          await api.post('/collections', collection);
          console.log(`✅ Collection "${collection.collection}" erstellt!`);
        } else {
          console.error(`❌ Fehler beim Überprüfen der Collection "${collection.collection}":`, 
            error.response?.data?.errors || error.message);
        }
      }
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen der Collection "${collection.collection}":`, 
        error.response?.data?.errors || error.message);
    }
  }
  
  // Junction-Collections erstellen
  for (const junction of junctionCollections) {
    try {
      // Prüfe, ob Junction-Collection bereits existiert
      try {
        await api.get(`/collections/${junction.collection}`);
        console.log(`⚠️ Junction-Collection "${junction.collection}" existiert bereits, überspringe...`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Junction-Collection existiert nicht, erstelle sie
          await api.post('/collections', junction);
          console.log(`✅ Junction-Collection "${junction.collection}" erstellt!`);
        } else {
          console.error(`❌ Fehler beim Überprüfen der Junction-Collection "${junction.collection}":`, 
            error.response?.data?.errors || error.message);
        }
      }
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen der Junction-Collection "${junction.collection}":`, 
        error.response?.data?.errors || error.message);
    }
  }
}

// 2. Erstelle Felder für Collections
async function createFields() {
  console.log('\n🏷️ Erstelle Felder für Collections...');
  
  // Felder für Hauptsammlungen erstellen
  for (const [collection, fields] of Object.entries(collectionsFields)) {
    for (const field of fields) {
      try {
        // Überprüfe, ob das Feld bereits existiert
        try {
          await api.get(`/fields/${collection}/${field.field}`);
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
        await api.post(`/fields/${collection}`, field);
        console.log(`✅ Feld "${field.field}" für Collection "${collection}" erstellt!`);
      } catch (error) {
        console.error(`❌ Fehler beim Erstellen des Feldes "${field.field}" für Collection "${collection}":`, 
          error.response?.data?.errors || error.message);
      }
    }
  }
  
  // Felder für Junction-Collections erstellen
  for (const [collection, fields] of Object.entries(junctionFields)) {
    for (const field of fields) {
      try {
        // Überprüfe, ob das Feld bereits existiert
        try {
          await api.get(`/fields/${collection}/${field.field}`);
          console.log(`⚠️ Feld "${field.field}" für Junction-Collection "${collection}" existiert bereits, überspringe...`);
          continue;
        } catch (error) {
          if (error.response && error.response.status !== 404) {
            console.error(`❌ Fehler beim Überprüfen des Feldes "${field.field}" für Junction-Collection "${collection}":`, 
              error.response?.data?.errors || error.message);
            continue;
          }
          // 404 bedeutet, dass das Feld nicht existiert, was gut ist, da wir es erstellen wollen
        }

        // Erstelle das Feld
        await api.post(`/fields/${collection}`, field);
        console.log(`✅ Feld "${field.field}" für Junction-Collection "${collection}" erstellt!`);
      } catch (error) {
        console.error(`❌ Fehler beim Erstellen des Feldes "${field.field}" für Junction-Collection "${collection}":`, 
          error.response?.data?.errors || error.message);
      }
    }
  }
}

// 3. Erstelle Beziehungen zwischen Collections
async function createRelations() {
  console.log('\n🔄 Erstelle Beziehungen zwischen Collections...');
  
  for (const relation of relations) {
    try {
      // Überprüfe, ob die Beziehung bereits existiert
      try {
        await api.get(`/relations/${relation.collection}/${relation.field}`);
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
      await api.post(`/relations`, relation);
      console.log(`✅ Beziehung "${relation.collection}.${relation.field}" zu "${relation.related_collection}" erstellt!`);
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen der Beziehung "${relation.collection}.${relation.field}" zu "${relation.related_collection}":`, 
        error.response?.data?.errors || error.message);
    }
  }
}

// Hauptfunktion
async function main() {
  console.log('🚀 Starte Directus-Setup mit Admin-Token für CinCin Hotels...');
  
  try {
    // 1. Erstelle Collections
    await createCollections();
    
    // 2. Erstelle Felder
    await createFields();
    
    // 3. Erstelle Beziehungen
    await createRelations();
    
    console.log('\n✅ Directus-Setup erfolgreich abgeschlossen!');
  } catch (error) {
    console.error('\n❌ Ein unerwarteter Fehler ist aufgetreten:', error);
  }
}

// Führe die Hauptfunktion aus
main();