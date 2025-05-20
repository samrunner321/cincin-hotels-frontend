/**
 * Simplified Directus setup script
 * Creates collections and fields only
 */

const axios = require('axios');

// Configuration
const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@cincinhotels.com';
const ADMIN_PASSWORD = 'admin123';

// Helper function for logging
function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message, error) {
  console.error(`❌ ${message}:`, error.response?.data || error);
}

// Login and get token
async function login() {
  try {
    console.log('🔑 Logging in to Directus...');
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    logSuccess('Login successful!');
    return response.data.data.access_token;
  } catch (error) {
    logError('Login failed', error);
    process.exit(1);
  }
}

// Create collection
async function createCollection(token, collection) {
  try {
    console.log(`📊 Creating collection "${collection.collection}"...`);
    
    // Check if collection already exists
    try {
      await axios.get(`${DIRECTUS_URL}/collections/${collection.collection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`⚠️ Collection "${collection.collection}" already exists, skipping...`);
      return true;
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
      // Collection doesn't exist, proceed with creation
    }
    
    await axios.post(`${DIRECTUS_URL}/collections`, collection, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    logSuccess(`Collection "${collection.collection}" created!`);
    return true;
  } catch (error) {
    logError(`Failed to create collection "${collection.collection}"`, error);
    return false;
  }
}

// Create field
async function createField(token, collection, field) {
  try {
    console.log(`🏷️ Creating field "${field.field}" for collection "${collection}"...`);
    
    // Check if field already exists
    try {
      await axios.get(`${DIRECTUS_URL}/fields/${collection}/${field.field}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`⚠️ Field "${field.field}" already exists, skipping...`);
      return true;
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
      // Field doesn't exist, proceed with creation
    }
    
    await axios.post(`${DIRECTUS_URL}/fields/${collection}`, field, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    logSuccess(`Field "${field.field}" created!`);
    return true;
  } catch (error) {
    logError(`Failed to create field "${field.field}"`, error);
    return false;
  }
}

// Create test item
async function createItem(token, collection, item) {
  try {
    console.log(`📝 Creating item in "${collection}"...`);
    
    const response = await axios.post(`${DIRECTUS_URL}/items/${collection}`, item, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    logSuccess(`Item created in "${collection}"!`);
    return response.data.data.id;
  } catch (error) {
    logError(`Failed to create item in "${collection}"`, error);
    return null;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Directus setup...');
  
  // Login
  const token = await login();
  
  // Define collections
  const collections = [
    {
      collection: 'destinations',
      meta: {
        collection: 'destinations',
        icon: 'place',
        note: 'Travel destinations for CinCin Hotels',
        display_template: '{{name}}'
      },
      schema: { name: 'destinations' }
    },
    {
      collection: 'categories',
      meta: {
        collection: 'categories',
        icon: 'category',
        note: 'Categories for hotels and destinations',
        display_template: '{{name}}'
      },
      schema: { name: 'categories' }
    },
    {
      collection: 'pages',
      meta: {
        collection: 'pages',
        icon: 'article',
        note: 'Content pages for the website',
        display_template: '{{title}}'
      },
      schema: { name: 'pages' }
    }
  ];
  
  // Create collections
  for (const collection of collections) {
    await createCollection(token, collection);
  }
  
  // Define fields for destinations
  const destinationFields = [
    {
      field: 'name',
      type: 'string',
      meta: {
        interface: 'input',
        required: true
      },
      schema: { is_nullable: false }
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        required: true
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
            { text: 'Published', value: 'published' },
            { text: 'Draft', value: 'draft' }
          ]
        }
      },
      schema: { default_value: 'published' }
    },
    {
      field: 'country',
      type: 'string',
      meta: {
        interface: 'input'
      }
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline'
      }
    }
  ];
  
  // Create fields for destinations
  for (const field of destinationFields) {
    await createField(token, 'destinations', field);
  }
  
  // Define fields for categories
  const categoryFields = [
    {
      field: 'name',
      type: 'string',
      meta: {
        interface: 'input',
        required: true
      },
      schema: { is_nullable: false }
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        required: true
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
            { text: 'Both', value: 'both' }
          ]
        }
      },
      schema: { default_value: 'both' }
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline'
      }
    }
  ];
  
  // Create fields for categories
  for (const field of categoryFields) {
    await createField(token, 'categories', field);
  }
  
  // Define fields for pages
  const pageFields = [
    {
      field: 'title',
      type: 'string',
      meta: {
        interface: 'input',
        required: true
      },
      schema: { is_nullable: false }
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        required: true
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
        interface: 'input-rich-text-html'
      }
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Published', value: 'published' },
            { text: 'Draft', value: 'draft' }
          ]
        }
      },
      schema: { default_value: 'published' }
    }
  ];
  
  // Create fields for pages
  for (const field of pageFields) {
    await createField(token, 'pages', field);
  }
  
  // Define fields for hotels (if not exists yet)
  const hotelFields = [
    {
      field: 'name',
      type: 'string',
      meta: {
        interface: 'input',
        required: true
      },
      schema: { is_nullable: false }
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        required: true
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
            { text: 'Published', value: 'published' },
            { text: 'Draft', value: 'draft' }
          ]
        }
      },
      schema: { default_value: 'published' }
    },
    {
      field: 'location',
      type: 'string',
      meta: {
        interface: 'input'
      }
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline'
      }
    }
  ];
  
  // Create a hotels collection if it doesn't exist
  await createCollection(token, {
    collection: 'hotels',
    meta: {
      collection: 'hotels',
      icon: 'hotel',
      note: 'Hotels in the CinCin Hotels network',
      display_template: '{{name}}'
    },
    schema: { name: 'hotels' }
  });
  
  // Create fields for hotels
  for (const field of hotelFields) {
    await createField(token, 'hotels', field);
  }
  
  // Create some test data
  
  // Test category
  const categoryId = await createItem(token, 'categories', {
    name: 'Luxury',
    slug: 'luxury',
    type: 'both',
    description: 'Premium accommodations and destinations'
  });
  
  // Test destination
  const destinationId = await createItem(token, 'destinations', {
    name: 'Paris',
    slug: 'paris',
    status: 'published',
    country: 'France',
    description: 'The city of love and lights'
  });
  
  // Test hotel
  const hotelId = await createItem(token, 'hotels', {
    name: 'Grand Hotel Paris',
    slug: 'grand-hotel-paris',
    status: 'published',
    location: 'Paris, France',
    description: 'A luxury hotel in the heart of Paris'
  });
  
  // Test page
  const pageId = await createItem(token, 'pages', {
    title: 'About Us',
    slug: 'about',
    content: '<h1>About CinCin Hotels</h1><p>We are a luxury hotel chain with properties across the globe.</p>',
    status: 'published'
  });
  
  console.log('\n✅ Directus setup completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Start your Next.js application with "npm run dev"');
  console.log('2. Visit http://localhost:8055 to manage your data in Directus (admin@cincinhotels.com / admin123)');
}

// Run the main function
main().catch(error => {
  console.error('❌ An unexpected error occurred:', error);
});