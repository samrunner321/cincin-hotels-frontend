import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function GET() {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/image_credits?filter[status][_eq]=published&sort=sort`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image credits from Directus');
    }

    const data = await response.json();
    
    return NextResponse.json(data.data || []);
  } catch (error) {
    console.error('Error fetching image credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image credits' },
      { status: 500 }
    );
  }
}