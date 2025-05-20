/**
 * CinCin Hotels Directus Berechtigungen Setup
 * 
 * Dieses Skript setzt die notwendigen Berechtigungen für das CinCin Hotels Directus CMS.
 */

const axios = require('axios');
const fs = require('fs');

// Konfiguration
const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@cincinhotels.com';
const ADMIN_PASSWORD = 'admin123'; // Das Passwort aus der Docker-Compose-Datei
const ALTERNATE_PASSWORD = 'CinCinHotels!';

// Login-Funktion mit Alternativ-Passwort
async function login() {
  console.log('🔑 Anmelden bei Directus...');
  
  try {
    // Erster Anmeldeversuch
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    console.log('✅ Anmeldung erfolgreich!');
    return response.data.data.access_token;
  } catch (error) {
    console.log('⚠️ Erster Anmeldeversuch fehlgeschlagen, versuche alternatives Passwort...');
    
    try {
      // Zweiter Anmeldeversuch mit alternativem Passwort
      const altResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
        email: ADMIN_EMAIL,
        password: ALTERNATE_PASSWORD
      });
      
      console.log('✅ Anmeldung mit alternativem Passwort erfolgreich!');
      return altResponse.data.data.access_token;
    } catch (altError) {
      console.error('❌ Beide Anmeldeversuche fehlgeschlagen');
      console.error('Details:', altError.response?.data || altError.message);
      process.exit(1);
    }
  }
}

// Funktion zum Abrufen oder Erstellen der Public-Role-ID
async function getPublicRoleId(token) {
  console.log('🔍 Suche nach Public-Rolle...');
  
  try {
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const response = await axios.get(`${DIRECTUS_URL}/roles`, { headers });
    
    let publicRole = response.data.data.find(role => role.name === 'Public');
    
    if (publicRole) {
      console.log(`✅ Public-Rolle gefunden mit ID: ${publicRole.id}`);
      return publicRole.id;
    } else {
      console.log('⚠️ Keine Public-Rolle gefunden, erstelle neue...');
      
      try {
        // Erstelle eine neue Public-Rolle
        const createResponse = await axios.post(`${DIRECTUS_URL}/roles`, {
          name: 'Public',
          app_access: false,
          admin_access: false,
          enforce_tfa: false,
          description: 'Public access role'
        }, { headers });
        
        console.log(`✅ Public-Rolle erstellt mit ID: ${createResponse.data.data.id}`);
        return createResponse.data.data.id;
      } catch (createError) {
        console.error('❌ Fehler beim Erstellen der Public-Rolle:', 
          createError.response?.data || createError.message);
        
        // Versuche nach API-Key-Authentifizierten-Rollen zu suchen als Fallback
        try {
          console.log('🔍 Suche nach API-Authentifizierungsrolle als Fallback...');
          const apiRole = response.data.data.find(role => 
            role.name.includes('API') || 
            role.name.includes('Api') || 
            role.name.includes('Authenticated')
          );
          
          if (apiRole) {
            console.log(`✅ Fallback-Rolle gefunden: "${apiRole.name}" mit ID: ${apiRole.id}`);
            return apiRole.id;
          }
        } catch (err) {
          // Ignoriere Fehler bei der Fallback-Suche
        }
        
        return null;
      }
    }
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Rollen:', error.response?.data || error.message);
    
    // Versuche im Fehlerfall, eine Fallback-Rolle zu erstellen
    try {
      console.log('🔄 Versuche eine Fallback-Rolle zu erstellen...');
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const fallbackResponse = await axios.post(`${DIRECTUS_URL}/roles`, {
        name: 'API Access',
        app_access: false,
        admin_access: false,
        enforce_tfa: false,
        description: 'Role for API access'
      }, { headers });
      
      console.log(`✅ Fallback-Rolle erstellt mit ID: ${fallbackResponse.data.data.id}`);
      return fallbackResponse.data.data.id;
    } catch (fallbackError) {
      console.error('❌ Auch Fallback-Rollenerstellung fehlgeschlagen:', 
        fallbackError.response?.data || fallbackError.message);
      return null;
    }
  }
}

// Funktion zum Abrufen aller Collections
async function getCollections(token) {
  console.log('📚 Rufe alle Collections ab...');
  
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(`${DIRECTUS_URL}/collections`, { headers });
    
    // Filtere interne System-Collections heraus (beginnen mit "directus_")
    const collections = response.data.data
      .filter(collection => !collection.collection.startsWith('directus_'))
      .map(collection => collection.collection);
    
    console.log(`✅ ${collections.length} Collections gefunden:`, collections);
    return collections;
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Collections:', error.response?.data || error.message);
    return [];
  }
}

// Funktion zum Setzen der Berechtigungen für eine Collection
async function setPermissionForCollection(token, roleId, collection) {
  console.log(`🔐 Setze Berechtigungen für Collection: ${collection}`);
  
  try {
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // CRUD-Operationen und zugehörige Berechtigungen
    const operations = [
      { action: 'create', name: 'Erstellen' },
      { action: 'read', name: 'Lesen' },
      { action: 'update', name: 'Aktualisieren' },
      { action: 'delete', name: 'Löschen' }
    ];
    
    for (const op of operations) {
      console.log(`  → Setze ${op.name}-Berechtigung für ${collection}...`);
      
      // Prüfe, ob Berechtigung bereits existiert
      const checkResponse = await axios.get(`${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[action][_eq]=${op.action}&filter[role][_eq]=${roleId}`, { headers });
      
      if (checkResponse.data.data.length > 0) {
        const permissionId = checkResponse.data.data[0].id;
        console.log(`    ⚠️ Berechtigung existiert bereits, aktualisiere...`);
        
        // Aktualisiere bestehende Berechtigung
        await axios.patch(`${DIRECTUS_URL}/permissions/${permissionId}`, {
          action: op.action,
          collection,
          role: roleId,
          fields: ['*']
        }, { headers });
      } else {
        // Erstelle neue Berechtigung
        await axios.post(`${DIRECTUS_URL}/permissions`, {
          action: op.action,
          collection,
          role: roleId,
          fields: ['*']
        }, { headers });
      }
      
      console.log(`    ✅ ${op.name}-Berechtigung für ${collection} gesetzt!`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Setzen der Berechtigungen für ${collection}:`, error.response?.data || error.message);
    return false;
  }
}

// Hauptfunktion
async function main() {
  console.log('🚀 Starte Berechtigungs-Setup für Directus...');
  
  // 1. Anmelden
  const token = await login();
  if (!token) return;
  
  // 2. Public-Role finden
  const publicRoleId = await getPublicRoleId(token);
  if (!publicRoleId) return;
  
  // 3. Collections abrufen
  const collections = await getCollections(token);
  if (collections.length === 0) return;
  
  // 4. Berechtigungen für alle Collections setzen
  console.log('🔐 Setze Berechtigungen für alle Collections...');
  
  let successCount = 0;
  for (const collection of collections) {
    const success = await setPermissionForCollection(token, publicRoleId, collection);
    if (success) successCount++;
  }
  
  // 5. Berechtigungen für Directus-Files setzen (für Bilder)
  console.log('🔐 Setze Berechtigungen für Directus Files...');
  const filesSuccess = await setPermissionForCollection(token, publicRoleId, 'directus_files');
  
  // Zusammenfassung
  console.log('\n✅ Berechtigungssetup abgeschlossen!');
  console.log(`📊 ${successCount} von ${collections.length} Collections erfolgreich konfiguriert.`);
  console.log(`📁 Directus Files: ${filesSuccess ? '✅ OK' : '❌ Fehler'}`);
  
  // Umschalten auf echtes CMS
  if (successCount > 0) {
    console.log('\n🔄 Aktualisiere .env.local, um den Mock-Server zu deaktivieren...');
    
    try {
      if (fs.existsSync('.env.local')) {
        let envContent = fs.readFileSync('.env.local', 'utf8');
        
        // Deaktiviere Mock-Server
        if (envContent.includes('IS_MOCK_SERVER=')) {
          envContent = envContent.replace(/IS_MOCK_SERVER=.+/, 'IS_MOCK_SERVER=false');
          fs.writeFileSync('.env.local', envContent);
          console.log('✅ .env.local aktualisiert: IS_MOCK_SERVER=false');
        }
      }
    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren der .env.local Datei:', error.message);
    }
  }
  
  console.log('\n🎉 Fertig! Das CMS sollte jetzt korrekt konfiguriert sein.');
  console.log('Du kannst jetzt deine Next.js-Anwendung mit dem echten CMS verwenden.');
}

// Führe das Hauptskript aus
main().catch(error => {
  console.error('❌ Ein unerwarteter Fehler ist aufgetreten:', error);
});