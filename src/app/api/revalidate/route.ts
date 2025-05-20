import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { secret, path } = await request.json();
    
    // Check if the secret is valid
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid revalidation secret' },
        { status: 401 }
      );
    }

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    // Revalidate the path
    revalidatePath(path);
    
    // Optionally revalidate the homepage too since it might show destinations
    if (path !== '/') {
      revalidatePath('/');
    }

    return NextResponse.json({ revalidated: true, path }, { status: 200 });
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}