/**
 * CMS-Konfigurations-Validator
 * 
 * Dieses Skript validiert die Konfiguration und Erreichbarkeit des Directus CMS
 * und prüft, ob alle erforderlichen Collections und Felder vorhanden sind.
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

// Erforderliche Collections und Felder
const REQUIRED_COLLECTIONS = [
  'destinations',
  'hotels',
  'categories'
];

const REQUIRED_FIELDS = {
  'destinations': ['id', 'slug', 'name', 'country', 'short_description', 'description', 'main_image'],
  'hotels': ['id', 'slug', 'name', 'short_description', 'main_image'],
  'categories': ['id', 'name', 'slug', 'type']
};

async function validateCMS() {
  console.log('🔍 Validiere Directus CMS-Konfiguration...');
  
  // Prüfe CMS-Erreichbarkeit
  try {
    const serverInfoResponse = await axios.get(`${DIRECTUS_URL}/server/info`);
    console.log('✅ Directus CMS ist erreichbar');
    console.log(`   Version: ${serverInfoResponse.data.data.directus.version}`);
  } catch (error) {
    console.error('❌ Directus CMS ist nicht erreichbar');
    console.error(`   URL: ${DIRECTUS_URL}`);
    console.error(`   Fehler: ${error.message}`);
    process.exit(1);
  }
  
  // Prüfe API-Token
  if (!DIRECTUS_TOKEN) {
    console.warn('⚠️ Kein Directus API-Token konfiguriert');
    console.warn('   Einige Funktionen könnten eingeschränkt sein');
  } else {
    try {
      const headers = {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`
      };
      
      // Prüfe Collections
      const collectionsResponse = await axios.get(`${DIRECTUS_URL}/collections`, { headers });
      const availableCollections = collectionsResponse.data.data.map(c => c.collection);
      
      console.log('\n📋 Prüfe erforderliche Collections:');
      
      let missingCollections = [];
      
      for (const collection of REQUIRED_COLLECTIONS) {
        if (availableCollections.includes(collection)) {
          console.log(`✅ Collection "${collection}" gefunden`);
          
          // Prüfe Felder für diese Collection
          const fieldsResponse = await axios.get(`${DIRECTUS_URL}/fields/${collection}`, { headers });
          const availableFields = fieldsResponse.data.data.map(f => f.field);
          
          let missingFields = [];
          
          console.log(`   Prüfe Felder für "${collection}":`);
          for (const field of REQUIRED_FIELDS[collection]) {
            if (availableFields.includes(field)) {
              console.log(`   ✅ Feld "${field}" gefunden`);
            } else {
              console.log(`   ❌ Feld "${field}" fehlt`);
              missingFields.push(field);
            }
          }
          
          if (missingFields.length > 0) {
            console.warn(`⚠️ Es fehlen ${missingFields.length} Felder in Collection "${collection}"`);
          } else {
            console.log(`   ✅ Alle erforderlichen Felder für "${collection}" sind vorhanden`);
          }
          
        } else {
          console.error(`❌ Collection "${collection}" fehlt`);
          missingCollections.push(collection);
        }
      }
      
      // Zusammenfassung
      console.log('\n📊 Zusammenfassung:');
      if (missingCollections.length === 0) {
        console.log('✅ Alle erforderlichen Collections sind vorhanden');
      } else {
        console.error(`❌ Es fehlen ${missingCollections.length} Collections: ${missingCollections.join(', ')}`);
        console.error('   Bitte erstellen Sie die fehlenden Collections in Directus oder importieren Sie das Schema');
        process.exit(1);
      }
      
    } catch (error) {
      console.error('❌ Fehler bei der Validierung mit API-Token');
      console.error(`   Fehler: ${error.message}`);
      process.exit(1);
    }
  }
  
  console.log('\n✅ CMS-Konfiguration erfolgreich validiert');
}

validateCMS();