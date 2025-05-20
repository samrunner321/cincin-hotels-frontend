import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { action, collection, item, key } = await request.json();
    
    // Log the event
    console.log(`Webhook received: ${action} on ${collection} with key ${key}`);
    
    // Revalidate paths
    if (collection === 'destinations') {
      // Revalidate destinations listing page
      revalidatePath('/destinations');
      
      // Revalidate the specific destination page if we have a slug
      if (item && item.slug) {
        revalidatePath(`/destinations/${item.slug}`);
      }
      
      // Revalidate homepage as it shows popular/featured destinations
      revalidatePath('/');
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully processed webhook for ${collection}`,
        action,
        collection,
        key
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}