import { NextResponse } from 'next/server';

// Simple test API endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API is working',
    time: new Date().toISOString(),
    environment: {
      directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL,
      hasAdminToken: !!process.env.DIRECTUS_ADMIN_TOKEN,
      hasPublicToken: !!process.env.DIRECTUS_PUBLIC_TOKEN,
      mockMode: process.env.IS_MOCK_SERVER === 'true',
    }
  });
}