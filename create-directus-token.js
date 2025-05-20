/**
 * CinCin Hotels - Directus Token Generator
 * 
 * Dieses Skript erstellt einen neuen API-Token für die Directus API
 * und aktualisiert die .env.local Datei mit dem neuen Token.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// CONFIGURATION
const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@cincinhotels.com';
const ADMIN_PASSWORD = 'CinCinHotels!';
const TOKEN_NAME = 'cincinhotels-api-token';

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
    
    // Versuche alternatives Passwort, wenn die erste Anmeldung fehlschlägt
    try {
      console.log('🔄 Versuche alternatives Passwort...');
      const alternativeResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
        email: ADMIN_EMAIL,
        password: 'CinCin2023!' // Alternatives Passwort aus docker-compose.yml
      });
      
      console.log('✅ Anmeldung mit alternativem Passwort erfolgreich!');
      return alternativeResponse.data.data.access_token;
    } catch (altError) {
      console.error('❌ Auch alternative Anmeldung fehlgeschlagen:', altError.response?.data?.errors || altError.message);
      process.exit(1);
    }
  }
}

async function createApiToken(accessToken) {
  console.log('🔑 Erstelle API-Token...');
  
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  // Check if token already exists
  try {
    const tokensResponse = await axios.get(`${DIRECTUS_URL}/users/me/tokens`, { headers });
    const existingToken = tokensResponse.data.data.find(token => token.name === TOKEN_NAME);
    
    if (existingToken) {
      console.log(`⚠️ API-Token "${TOKEN_NAME}" existiert bereits, versuche ihn zu löschen...`);
      
      try {
        await axios.delete(`${DIRECTUS_URL}/users/me/tokens/${existingToken.id}`, { headers });
        console.log(`✅ Bestehender Token "${TOKEN_NAME}" gelöscht.`);
      } catch (deleteError) {
        console.error('❌ Fehler beim Löschen des bestehenden Tokens:', deleteError.response?.data?.errors || deleteError.message);
      }
    }
  } catch (error) {
    console.error('❌ Fehler beim Abrufen bestehender Tokens:', error.response?.data?.errors || error.message);
  }

  // Create new token
  try {
    const response = await axios.post(`${DIRECTUS_URL}/users/me/tokens`, {
      name: TOKEN_NAME,
      expires: null // Kein Ablaufdatum
    }, { headers });
    
    console.log('✅ Neuer API-Token erstellt!');
    return response.data.data.access_token;
  } catch (error) {
    console.error('❌ Fehler beim Erstellen des API-Tokens:', error.response?.data?.errors || error.message);
    return null;
  }
}

async function updateEnvFile(apiToken) {
  console.log('📝 Aktualisiere .env.local Datei...');
  
  try {
    if (fs.existsSync('.env.local')) {
      let envContent = fs.readFileSync('.env.local', 'utf8');
      
      // Ersetze den Token
      if (envContent.includes('DIRECTUS_TOKEN=')) {
        envContent = envContent.replace(/DIRECTUS_TOKEN=.+/, `DIRECTUS_TOKEN=${apiToken}`);
      } else {
        envContent += `\nDIRECTUS_TOKEN=${apiToken}`;
      }
      
      // Aktiviere Mock-Server als Fallback
      if (envContent.includes('IS_MOCK_SERVER=')) {
        envContent = envContent.replace(/IS_MOCK_SERVER=.+/, 'IS_MOCK_SERVER=true');
      } else {
        envContent += '\nIS_MOCK_SERVER=true';
      }
      
      fs.writeFileSync('.env.local', envContent);
      console.log('✅ .env.local aktualisiert!');
    } else {
      const envContent = `# Directus API Configuration
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=${apiToken}

# Development Mode
IS_MOCK_SERVER=true
`;
      fs.writeFileSync('.env.local', envContent);
      console.log('✅ .env.local erstellt!');
    }
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der .env.local Datei:', error.message);
  }
}

async function main() {
  console.log('🚀 Erstelle neuen Directus API-Token...');
  
  // Login to Directus
  const accessToken = await loginToDirectus();
  
  // Create API Token
  const apiToken = await createApiToken(accessToken);
  
  // Update .env.local file
  if (apiToken) {
    await updateEnvFile(apiToken);
  }
  
  if (apiToken) {
    console.log('\n✅ Token-Erstellung abgeschlossen!');
    console.log('\n📝 Dein neuer API-Token:');
    console.log(apiToken);
    console.log('\nDer Token wurde in .env.local gespeichert und IS_MOCK_SERVER wurde auf "true" gesetzt.');
    console.log('Das bedeutet, dass deine Anwendung den Mock-Server verwenden wird,');
    console.log('während du die Berechtigungsprobleme mit Directus behebst.');
  } else {
    console.error('\n❌ Token-Erstellung fehlgeschlagen.');
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Ein unerwarteter Fehler ist aufgetreten:', error);
});