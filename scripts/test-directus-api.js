require('dotenv').config({ path: '.env.local' });

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_PUBLIC_TOKEN = process.env.DIRECTUS_PUBLIC_TOKEN;
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

async function main() {
  console.log('Environment Variables:');
  console.log(`NEXT_PUBLIC_DIRECTUS_URL: ${DIRECTUS_URL}`);
  console.log(`DIRECTUS_PUBLIC_TOKEN: ${DIRECTUS_PUBLIC_TOKEN ? DIRECTUS_PUBLIC_TOKEN.substring(0, 5) + '...' : 'Not set'}`);
  console.log(`DIRECTUS_ADMIN_TOKEN: ${DIRECTUS_ADMIN_TOKEN ? DIRECTUS_ADMIN_TOKEN.substring(0, 5) + '...' : 'Not set'}`);
  console.log(`DIRECTUS_TOKEN: ${DIRECTUS_TOKEN ? DIRECTUS_TOKEN.substring(0, 5) + '...' : 'Not set'}`);
  
  try {
    // Test with Authorization Header
    console.log('\n1. Testing with Authorization Header:');
    const response1 = await fetch(`${DIRECTUS_URL}/items/hotels?limit=1`, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_PUBLIC_TOKEN}`
      }
    });
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('Success! First hotel:', data1.data[0].name);
      console.log('First hotel slug:', data1.data[0].slug);
      console.log('First hotel ID:', data1.data[0].id);
    } else {
      console.error(`Error: ${response1.status} - ${response1.statusText}`);
      const errorText = await response1.text();
      console.error('Error details:', errorText);
    }
    
    // Test with Query Parameter
    console.log('\n2. Testing with Query Parameter:');
    const response2 = await fetch(`${DIRECTUS_URL}/items/hotels?limit=1&access_token=${DIRECTUS_PUBLIC_TOKEN}`);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('Success! First hotel:', data2.data[0].name);
    } else {
      console.error(`Error: ${response2.status} - ${response2.statusText}`);
      const errorText = await response2.text();
      console.error('Error details:', errorText);
    }
    
    // Test specific hotel by ID
    if (response1.ok) {
      const data1 = await response1.json();
      const hotelId = data1.data[0].id;
      
      console.log(`\n3. Testing specific hotel fetch by ID (${hotelId}):`);
      const response3 = await fetch(`${DIRECTUS_URL}/items/hotels/${hotelId}`, {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_PUBLIC_TOKEN}`
        }
      });
      
      if (response3.ok) {
        const data3 = await response3.json();
        console.log('Success! Hotel details:', data3.data.name);
      } else {
        console.error(`Error: ${response3.status} - ${response3.statusText}`);
        const errorText = await response3.text();
        console.error('Error details:', errorText);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

main();