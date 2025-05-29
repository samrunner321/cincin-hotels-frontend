const http = require('http');

// Configuration
const ADMIN_TOKEN = 'DVi69WT4QYxPfqto-MU8Gj95w8Wn8x1K';

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.errors?.[0]?.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Admin request (with token for schema changes)
const adminRequest = async (path, method = 'GET', data = null) => {
  return makeRequest({
    hostname: 'localhost',
    port: 8055,
    path: path,
    method: method,
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    }
  }, data);
};

// Public request (no token for data operations)
const publicRequest = async (path, method = 'GET', data = null) => {
  return makeRequest({
    hostname: 'localhost',
    port: 8055,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      // NO AUTHORIZATION HEADER!
    }
  }, data);
};

async function setupDirectusComplete() {
  console.log('🚀 Complete Directus Setup: Admin Fields + Public Data...\n');

  const summary = {
    fieldsCreated: {
      hotels: 0,
      destinations: 0,
      rooms: 0,
      journal: 0
    },
    dataImported: {
      destinations: 0,
      hotels: 0,
      rooms: 0
    }
  };

  try {
    // PHASE 1: CREATE FIELDS WITH ADMIN TOKEN
    console.log('='.repeat(50));
    console.log('PHASE 1: Creating Fields with Admin Token');
    console.log('='.repeat(50));

    // 1. Create fields for hotels collection
    console.log('\n1️⃣ Creating fields for hotels collection (Admin Token)...');
    const hotelFields = [
      { 
        field: "name", 
        type: "string", 
        meta: { 
          required: true, 
          interface: "input",
          note: "Hotel name"
        },
        schema: {
          is_nullable: false
        }
      },
      { 
        field: "slug", 
        type: "string", 
        meta: { 
          required: true, 
          interface: "input",
          note: "URL-friendly identifier"
        },
        schema: {
          is_nullable: false,
          is_unique: true
        }
      },
      { 
        field: "description", 
        type: "text", 
        meta: { 
          interface: "input-rich-text-html",
          note: "Hotel description"
        }
      },
      { 
        field: "location", 
        type: "string", 
        meta: { 
          interface: "input",
          note: "City/Location"
        }
      },
      { 
        field: "region", 
        type: "string", 
        meta: { 
          interface: "input",
          note: "Region/State"
        }
      },
      { 
        field: "stars", 
        type: "integer", 
        meta: { 
          interface: "select-dropdown",
          options: {
            choices: [
              { text: "1 Star", value: 1 },
              { text: "2 Stars", value: 2 },
              { text: "3 Stars", value: 3 },
              { text: "4 Stars", value: 4 },
              { text: "5 Stars", value: 5 }
            ]
          }
        }
      },
      { 
        field: "price_from", 
        type: "integer", 
        meta: { 
          interface: "input",
          note: "Starting price in EUR"
        }
      },
      { 
        field: "featured", 
        type: "boolean", 
        meta: { 
          interface: "boolean",
          default_value: false
        },
        schema: {
          default_value: false
        }
      },
      { 
        field: "status", 
        type: "string", 
        meta: { 
          interface: "select-dropdown",
          options: {
            choices: [
              { text: "Published", value: "published" },
              { text: "Draft", value: "draft" }
            ]
          },
          default_value: "published"
        },
        schema: {
          default_value: "published"
        }
      }
    ];

    for (const field of hotelFields) {
      try {
        await adminRequest('/fields/hotels', 'POST', field);
        console.log(`  ✅ Created field: ${field.field} (${field.type})`);
        summary.fieldsCreated.hotels++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️ Field ${field.field} already exists`);
        } else {
          console.error(`  ❌ Failed to create field ${field.field}: ${error.message}`);
        }
      }
    }

    // 2. Create fields for destinations collection
    console.log('\n2️⃣ Creating fields for destinations collection (Admin Token)...');
    const destinationFields = [
      { 
        field: "name", 
        type: "string", 
        meta: { 
          required: true,
          interface: "input"
        },
        schema: {
          is_nullable: false
        }
      },
      { 
        field: "slug", 
        type: "string", 
        meta: { 
          required: true,
          interface: "input"
        },
        schema: {
          is_nullable: false,
          is_unique: true
        }
      },
      { 
        field: "country", 
        type: "string",
        meta: {
          interface: "input"
        }
      },
      { 
        field: "description", 
        type: "text",
        meta: {
          interface: "input-multiline"
        }
      },
      { 
        field: "featured", 
        type: "boolean", 
        meta: { 
          interface: "boolean",
          default_value: false
        },
        schema: {
          default_value: false
        }
      }
    ];

    for (const field of destinationFields) {
      try {
        await adminRequest('/fields/destinations', 'POST', field);
        console.log(`  ✅ Created field: ${field.field} (${field.type})`);
        summary.fieldsCreated.destinations++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️ Field ${field.field} already exists`);
        } else {
          console.error(`  ❌ Failed to create field ${field.field}: ${error.message}`);
        }
      }
    }

    // 3. Create fields for rooms collection
    console.log('\n3️⃣ Creating fields for rooms collection (Admin Token)...');
    const roomFields = [
      { 
        field: "hotel_id", 
        type: "integer", 
        meta: { 
          interface: "select-dropdown-m2o",
          special: ["m2o"],
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      { 
        field: "name", 
        type: "string", 
        meta: { 
          required: true,
          interface: "input"
        },
        schema: {
          is_nullable: false
        }
      },
      { 
        field: "size", 
        type: "integer",
        meta: {
          interface: "input",
          note: "Room size in m²"
        }
      },
      { 
        field: "max_guests", 
        type: "integer",
        meta: {
          interface: "input",
          note: "Maximum number of guests"
        }
      },
      { 
        field: "price_from", 
        type: "integer",
        meta: {
          interface: "input",
          note: "Starting price in EUR"
        }
      },
      { 
        field: "description", 
        type: "text",
        meta: {
          interface: "input-multiline"
        }
      }
    ];

    for (const field of roomFields) {
      try {
        await adminRequest('/fields/rooms', 'POST', field);
        console.log(`  ✅ Created field: ${field.field} (${field.type})`);
        summary.fieldsCreated.rooms++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️ Field ${field.field} already exists`);
        } else {
          console.error(`  ❌ Failed to create field ${field.field}: ${error.message}`);
        }
      }
    }

    // 4. Create fields for journal collection
    console.log('\n4️⃣ Creating fields for journal collection (Admin Token)...');
    const journalFields = [
      { 
        field: "title", 
        type: "string", 
        meta: { 
          required: true,
          interface: "input"
        },
        schema: {
          is_nullable: false
        }
      },
      { 
        field: "slug", 
        type: "string",
        meta: {
          interface: "input"
        },
        schema: {
          is_unique: true
        }
      },
      { 
        field: "excerpt", 
        type: "text",
        meta: {
          interface: "input-multiline"
        }
      },
      { 
        field: "content", 
        type: "text", 
        meta: { 
          interface: "input-rich-text-html"
        }
      },
      { 
        field: "author", 
        type: "string",
        meta: {
          interface: "input"
        }
      },
      { 
        field: "published_date", 
        type: "date",
        meta: {
          interface: "datetime"
        }
      },
      { 
        field: "category", 
        type: "string",
        meta: {
          interface: "input"
        }
      }
    ];

    for (const field of journalFields) {
      try {
        await adminRequest('/fields/journal', 'POST', field);
        console.log(`  ✅ Created field: ${field.field} (${field.type})`);
        summary.fieldsCreated.journal++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️ Field ${field.field} already exists`);
        } else {
          console.error(`  ❌ Failed to create field ${field.field}: ${error.message}`);
        }
      }
    }

    // PHASE 2: IMPORT DATA WITH PUBLIC ACCESS
    console.log('\n' + '='.repeat(50));
    console.log('PHASE 2: Importing Data with Public Access');
    console.log('='.repeat(50));

    // 5. Import destinations
    console.log('\n5️⃣ Importing destinations (Public Access)...');
    const destinations = [
      { name: "Schweizer Alpen", slug: "swiss-alps", country: "Schweiz", featured: true },
      { name: "Griechische Inseln", slug: "greek-islands", country: "Griechenland", featured: true }
    ];

    const destinationIds = {};
    for (const destination of destinations) {
      try {
        const result = await publicRequest('/items/destinations', 'POST', destination);
        destinationIds[destination.slug] = result.data.id;
        console.log(`  ✅ Created destination: ${destination.name} (ID: ${result.data.id})`);
        summary.dataImported.destinations++;
      } catch (error) {
        console.error(`  ❌ Failed to create destination ${destination.name}: ${error.message}`);
      }
    }

    // 6. Import hotels
    console.log('\n6️⃣ Importing hotels (Public Access)...');
    const hotels = [
      {
        name: "Crans Luxury Lodge",
        slug: "crans-luxury-lodge", 
        location: "Crans-Montana",
        region: "Wallis, Schweiz",
        description: "Luxuriöses Bergresort mit atemberaubendem Alpenpanorama und direktem Pistenzugang",
        stars: 5,
        price_from: 450,
        featured: true,
        status: "published"
      },
      {
        name: "Olea All Suite Hotel",
        slug: "olea-all-suite-hotel",
        location: "Zakynthos", 
        region: "Ionische Inseln, Griechenland",
        description: "Boutique-Hotel mit privatem Strand und luxuriösen Suiten in einem Olivenhain",
        stars: 5,
        price_from: 380,
        featured: true,
        status: "published"
      },
      {
        name: "Istoria Hotel",
        slug: "istoria-santorini",
        location: "Perivolos",
        region: "Santorini, Griechenland", 
        description: "Stilvolles Strandhotel mit minimalistischem Design am schwarzen Vulkanstrand",
        stars: 5,
        price_from: 420,
        featured: true,
        status: "published"
      }
    ];

    const hotelIds = {};
    for (const hotel of hotels) {
      try {
        const result = await publicRequest('/items/hotels', 'POST', hotel);
        hotelIds[hotel.slug] = result.data.id;
        console.log(`  ✅ Created hotel: ${hotel.name} (ID: ${result.data.id})`);
        summary.dataImported.hotels++;
      } catch (error) {
        console.error(`  ❌ Failed to create hotel ${hotel.name}: ${error.message}`);
      }
    }

    // 7. Import rooms
    console.log('\n7️⃣ Importing rooms (Public Access)...');
    const roomsData = [
      // Crans Luxury Lodge
      { 
        hotel_id: hotelIds['crans-luxury-lodge'], 
        name: "Alpine Deluxe Suite", 
        size: 65, 
        max_guests: 2, 
        price_from: 450,
        description: "Luxuriöse Suite mit Panorama-Bergblick und privatem Balkon"
      },
      { 
        hotel_id: hotelIds['crans-luxury-lodge'], 
        name: "Mountain Junior Suite", 
        size: 45, 
        max_guests: 2, 
        price_from: 350,
        description: "Komfortable Suite mit Bergblick und modernem Alpen-Design"
      },
      // Olea All Suite Hotel
      { 
        hotel_id: hotelIds['olea-all-suite-hotel'], 
        name: "Garden Suite with Pool", 
        size: 55, 
        max_guests: 2, 
        price_from: 380,
        description: "Suite mit privatem Pool im Olivenhain"
      },
      { 
        hotel_id: hotelIds['olea-all-suite-hotel'], 
        name: "Sea View Suite", 
        size: 70, 
        max_guests: 3, 
        price_from: 520,
        description: "Geräumige Suite mit direktem Meerblick und Terrasse"
      },
      // Istoria Hotel
      { 
        hotel_id: hotelIds['istoria-santorini'], 
        name: "Beach Classic Room", 
        size: 40, 
        max_guests: 2, 
        price_from: 420,
        description: "Stilvoller Raum mit Blick auf den schwarzen Strand"
      },
      { 
        hotel_id: hotelIds['istoria-santorini'], 
        name: "Premium Suite with Terrace", 
        size: 60, 
        max_guests: 2, 
        price_from: 650,
        description: "Premium Suite mit privater Terrasse und Meerblick"
      }
    ];

    for (const room of roomsData) {
      if (room.hotel_id) {
        try {
          const result = await publicRequest('/items/rooms', 'POST', room);
          console.log(`  ✅ Created room: ${room.name} for hotel ID ${room.hotel_id}`);
          summary.dataImported.rooms++;
        } catch (error) {
          console.error(`  ❌ Failed to create room ${room.name}: ${error.message}`);
        }
      } else {
        console.log(`  ⚠️ Skipping room ${room.name} - hotel not found`);
      }
    }

    // 8. Verification
    console.log('\n8️⃣ Verifying import (Public Access)...');
    try {
      const verifyHotels = await publicRequest('/items/hotels');
      console.log(`✅ Verification: Found ${verifyHotels.data.length} hotels in database`);
      
      verifyHotels.data.forEach(hotel => {
        console.log(`  - ${hotel.name} (${hotel.slug}) - Status: ${hotel.status}`);
      });
    } catch (error) {
      console.error(`❌ Failed to verify data: ${error.message}`);
    }

    // Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('FINAL SUMMARY');
    console.log('='.repeat(50));

    console.log('\n📊 Fields Created (Admin Token):');
    console.log(`  Hotels: ${summary.fieldsCreated.hotels} fields`);
    console.log(`  Destinations: ${summary.fieldsCreated.destinations} fields`);
    console.log(`  Rooms: ${summary.fieldsCreated.rooms} fields`);
    console.log(`  Journal: ${summary.fieldsCreated.journal} fields`);

    console.log('\n📊 Data Imported (Public Access):');
    console.log(`  Destinations: ${summary.dataImported.destinations} items`);
    console.log(`  Hotels: ${summary.dataImported.hotels} items`);
    console.log(`  Rooms: ${summary.dataImported.rooms} items`);

    const totalFields = Object.values(summary.fieldsCreated).reduce((a, b) => a + b, 0);
    const totalData = Object.values(summary.dataImported).reduce((a, b) => a + b, 0);

    console.log('\n🎯 RESULTS:');
    console.log(`✅ Created ${totalFields} fields successfully`);
    console.log(`✅ Imported ${totalData} data records successfully`);

    if (totalData > 0) {
      console.log('\n🌐 Test URLs:');
      console.log('  Frontend (DE): http://localhost:3000/de-DE/hotels/crans-luxury-lodge');
      console.log('  Frontend (EN): http://localhost:3000/en-US/hotels/crans-luxury-lodge');
      console.log('  API Test: http://localhost:3000/api/hotels/crans-luxury-lodge');
      console.log('  Directus Admin: http://localhost:8055');
      
      console.log('\n🎉 SUCCESS! Complete setup finished!');
    } else {
      console.log('\n❌ Data import failed - check Public Access configuration');
    }

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
  }
}

// Run the complete setup
setupDirectusComplete().catch(console.error);