import { NextResponse } from 'next/server';

export async function GET() {
  // Wir zeigen nur die ersten 5 Zeichen jedes Tokens an, um die Sicherheit zu gewährleisten
  const tokenPreview = (token) => token ? `${token.substring(0, 5)}...` : 'Not set';
  
  return NextResponse.json({
    NEXT_PUBLIC_DIRECTUS_URL: process.env.NEXT_PUBLIC_DIRECTUS_URL,
    DIRECTUS_PUBLIC_TOKEN: tokenPreview(process.env.DIRECTUS_PUBLIC_TOKEN),
    DIRECTUS_ADMIN_TOKEN: tokenPreview(process.env.DIRECTUS_ADMIN_TOKEN),
    DIRECTUS_TOKEN: tokenPreview(process.env.DIRECTUS_TOKEN),
    SERVER_ENV: process.env.NODE_ENV
  });
}