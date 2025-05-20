import { NextRequest, NextResponse } from 'next/server';
import { getPageBySlug } from '../../../../lib/directus';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Page slug is required' },
        { status: 400 }
      );
    }

    const page = await getPageBySlug(slug);
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page, { status: 200 });
  } catch (error) {
    console.error(`Error fetching page with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}