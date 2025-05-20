import { NextResponse } from 'next/server';

export async function GET() {
  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  const DIRECTUS_PUBLIC_TOKEN = process.env.DIRECTUS_PUBLIC_TOKEN;
  const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;
  const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
  
  // Debug-Informationen
  console.log('Environment Variables:');
  console.log(`NEXT_PUBLIC_DIRECTUS_URL: ${DIRECTUS_URL}`);
  console.log(`DIRECTUS_PUBLIC_TOKEN: ${DIRECTUS_PUBLIC_TOKEN ? 'Set' : 'Not set'}`);
  console.log(`DIRECTUS_ADMIN_TOKEN: ${DIRECTUS_ADMIN_TOKEN ? 'Set' : 'Not set'}`);
  console.log(`DIRECTUS_TOKEN: ${DIRECTUS_TOKEN ? 'Set' : 'Not set'}`);
  
  try {
    // Test 1: Server Ping
    const pingResponse = await fetch(`${DIRECTUS_URL}/server/ping`);
    const pingData = await pingResponse.text();
    
    // Test 2: Hotels mit PUBLIC_TOKEN
    const hotelsPublicResponse = await fetch(`${DIRECTUS_URL}/items/hotels?limit=1`, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_PUBLIC_TOKEN}`
      }
    });
    const hotelsPublicData = await hotelsPublicResponse.json();
    
    // Test 3: Hotels mit ADMIN_TOKEN
    const hotelsAdminResponse = await fetch(`${DIRECTUS_URL}/items/hotels?limit=1`, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`
      }
    });
    const hotelsAdminData = await hotelsAdminResponse.json();
    
    // Test 4: Hotels mit DIRECTUS_TOKEN
    const hotelsTokenResponse = await fetch(`${DIRECTUS_URL}/items/hotels?limit=1`, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`
      }
    });
    const hotelsTokenData = await hotelsTokenResponse.json();
    
    // Test 5: Hotels mit Query Parameter statt Header
    const hotelsQueryResponse = await fetch(`${DIRECTUS_URL}/items/hotels?limit=1&access_token=${DIRECTUS_PUBLIC_TOKEN}`);
    const hotelsQueryData = await hotelsQueryResponse.json();
    
    return NextResponse.json({
      success: true,
      serverPing: pingData,
      hotelsPublicToken: {
        status: hotelsPublicResponse.status,
        data: hotelsPublicData
      },
      hotelsAdminToken: {
        status: hotelsAdminResponse.status,
        data: hotelsAdminData
      },
      hotelsDirectusToken: {
        status: hotelsTokenResponse.status,
        data: hotelsTokenData
      },
      hotelsQueryParam: {
        status: hotelsQueryResponse.status,
        data: hotelsQueryData
      }
    });
  } catch (error) {
    console.error('API Debug Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}