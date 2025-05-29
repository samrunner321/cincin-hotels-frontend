const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'directus/database/data.db');

function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function runSQL(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

async function linkHotelsWithAmenities() {
  const db = new sqlite3.Database(dbPath);
  
  try {
    console.log('Fetching hotels and amenities...');
    
    // Get all hotels
    const hotels = await runQuery(db, 'SELECT id, name FROM hotels LIMIT 5');
    console.log('Found hotels:', hotels.map(h => h.name));
    
    // Get all amenities
    const amenities = await runQuery(db, 'SELECT id, name, `key` FROM hotel_amenities');
    console.log('Found amenities:', amenities.map(a => a.name));
    
    if (hotels.length === 0) {
      console.log('No hotels found. Please add hotels first.');
      return;
    }
    
    if (amenities.length === 0) {
      console.log('No amenities found. Please run the amenities creation script first.');
      return;
    }
    
    console.log('Creating hotel-amenity links...');
    
    // Clear existing links
    await runSQL(db, 'DELETE FROM hotels_amenities');
    
    // Link each hotel with random amenities
    for (const hotel of hotels) {
      // Each hotel gets 3-7 random amenities
      const numAmenities = Math.floor(Math.random() * 5) + 3;
      const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random());
      const selectedAmenities = shuffledAmenities.slice(0, numAmenities);
      
      console.log(`Linking ${hotel.name} with ${selectedAmenities.length} amenities...`);
      
      for (const amenity of selectedAmenities) {
        try {
          await runSQL(db, `
            INSERT INTO hotels_amenities (hotels_id, hotel_amenities_id)
            VALUES (?, ?)
          `, [hotel.id, amenity.id]);
          console.log(`  ✓ Linked ${hotel.name} with ${amenity.name}`);
        } catch (error) {
          console.error(`  Error linking ${hotel.name} with ${amenity.name}:`, error.message);
        }
      }
    }
    
    // Verify the links
    console.log('\nVerifying hotel-amenity links...');
    const links = await runQuery(db, `
      SELECT h.name as hotel_name, a.name as amenity_name 
      FROM hotels_amenities ha
      JOIN hotels h ON ha.hotels_id = h.id
      JOIN hotel_amenities a ON ha.hotel_amenities_id = a.id
      ORDER BY h.name, a.name
    `);
    
    console.log('\nCreated links:');
    let currentHotel = '';
    for (const link of links) {
      if (link.hotel_name !== currentHotel) {
        currentHotel = link.hotel_name;
        console.log(`\n${currentHotel}:`);
      }
      console.log(`  - ${link.amenity_name}`);
    }
    
    console.log(`\n✅ Successfully linked ${hotels.length} hotels with amenities!`);
    console.log(`Total links created: ${links.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close();
  }
}

linkHotelsWithAmenities();