import { NextResponse } from 'next/server';

// Simple API route to test Directus connection
export async function GET(request) {
  try {
    // Get Directus URL from environment variable
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    
    // Try to connect to Directus server info endpoint
    const response = await fetch(`${directusUrl}/server/info`);
    
    if (!response.ok) {
      throw new Error(`Failed to connect to Directus: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      status: 'connected',
      directus: {
        url: directusUrl,
        version: data.data?.version || 'unknown',
        project: data.data?.project || 'unknown',
      },
      environment: {
        hasAdminToken: !!process.env.DIRECTUS_ADMIN_TOKEN,
        hasPublicToken: !!process.env.DIRECTUS_PUBLIC_TOKEN,
        mockMode: process.env.IS_MOCK_SERVER === 'true',
      }
    });
  } catch (error) {
    console.error('Error connecting to Directus:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error.message,
      directus: {
        url: process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
      },
      hint: 'Make sure Directus is running and accessible',
    }, { status: 500 });
  }
}