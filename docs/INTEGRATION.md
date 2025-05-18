# Integrating the Frontend with Directus CMS

This document explains how to integrate the CinCin Hotels Next.js frontend with the Directus CMS backend.

## Overview

The CinCin Hotels website combines a Next.js frontend with a Directus CMS backend. This document focuses on how to connect these systems to create a seamless content management workflow.

## Configuration

### Environment Variables

Add the following environment variables to your Next.js project in `.env.local`:

```
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your_directus_token
```

For production, create `.env.production` with the appropriate values:

```
NEXT_PUBLIC_DIRECTUS_URL=https://cms.cincinhotels.com
DIRECTUS_TOKEN=your_production_directus_token
```

### API Client Setup

The API client is set up in `src/lib/directus.ts` and provides TypeScript type definitions and helper functions for interacting with the Directus API.

## Data Fetching Patterns

### Static Site Generation (SSG)

For content that changes infrequently, use static site generation:

```typescript
// pages/hotels/[slug].tsx
import { loadHotel, loadHotelSlugs, REVALIDATE } from '@/lib/dataLoaders';

export async function generateStaticParams() {
  const slugs = await loadHotelSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const hotel = await loadHotel(params.slug);
  return {
    title: hotel?.meta_title || hotel?.name,
    description: hotel?.meta_description
  };
}

export default async function HotelPage({ params }) {
  const hotel = await loadHotel(params.slug);
  
  if (!hotel) {
    return <div>Hotel not found</div>;
  }
  
  return (
    <HotelDetailPage hotel={hotel} />
  );
}

// Set revalidation interval
export const revalidate = REVALIDATE.HOTEL;
```

### Incremental Static Regeneration (ISR)

For content that changes more frequently, use ISR:

```typescript
// pages/hotels/index.tsx
import { loadHotels, REVALIDATE } from '@/lib/dataLoaders';

export default async function HotelsPage() {
  const hotels = await loadHotels();
  
  return (
    <HotelListPage hotels={hotels} />
  );
}

// Set revalidation interval (e.g., 5 minutes)
export const revalidate = REVALIDATE.HOTELS;
```

### Client-Side Data Fetching

For dynamic content or personalized experiences, use client-side data fetching with the provided hooks:

```typescript
'use client';

import { useHotels } from '@/hooks/useDirectusData';

export default function FeaturedHotels() {
  const { hotels, isLoading, isError } = useHotels({ 
    featured: true,
    limit: 4
  });
  
  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {hotels.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
```

## Multilingual Content

### Language Detection and Routing

The `middleware.ts` file handles language detection and routing:

1. Detects the user's preferred language from browser settings
2. Routes to the appropriate language-specific path
3. Sets language-specific cookies for client-side language detection

### Displaying Translated Content

Use the `getTranslatedContent` utility to display content in the user's preferred language:

```typescript
import { getTranslatedContent } from '@/lib/i18n';

export default function HotelDescription({ hotel, language }) {
  const translatedHotel = getTranslatedContent(hotel, language);
  
  return (
    <div>
      <h1>{translatedHotel.name}</h1>
      <p>{translatedHotel.description}</p>
    </div>
  );
}
```

### Language Switcher Component

The `LanguageSwitcher` component allows users to change their preferred language:

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      <nav>
        {/* Navigation links */}
        <LanguageSwitcher currentLanguage={currentLanguage} />
      </nav>
    </header>
  );
}
```

## Image Handling

### Directus Assets URLs

Use the `getAssetURL` utility function to generate URLs for images stored in Directus:

```typescript
import { getAssetURL } from '@/lib/directus';
import Image from 'next/image';

export default function HotelImage({ hotel }) {
  const imageUrl = getAssetURL(hotel.main_image);
  
  return (
    <Image 
      src={imageUrl}
      alt={hotel.name}
      width={800}
      height={600}
      className="rounded-lg object-cover"
    />
  );
}
```

### Transforming Images

Directus supports on-the-fly image transformations:

```typescript
function getTransformedImageUrl(fileId, width, height, fit = 'cover', format = 'webp') {
  return `${DIRECTUS_URL}/assets/${fileId}?width=${width}&height=${height}&fit=${fit}&format=${format}`;
}
```

## API Routes

The Next.js API routes in `src/app/api/` serve as a proxy to the Directus API, adding caching and error handling:

```typescript
// src/app/api/hotels/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getHotels } from '@/lib/directus';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const filterParam = searchParams.get('filter');
    
    // Parse filter JSON if present
    const filter = filterParam ? JSON.parse(filterParam) : { status: { _eq: 'published' } };

    // Fetch hotels
    const hotels = await getHotels({ limit, offset, filter });

    return NextResponse.json(hotels, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60'
      }
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
```

## Component Integration

### Hotel Components

Map Directus fields to React component props:

```typescript
// components/hotels/HotelCard.jsx
export default function HotelCard({ 
  name, 
  slug, 
  location, 
  short_description, 
  main_image,
  categories,
  price_from,
  currency
}) {
  const imageUrl = getAssetURL(main_image);
  
  return (
    <article className="rounded-xl overflow-hidden shadow-md">
      <div className="relative h-60">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-medium">{name}</h3>
        <p className="text-gray-600 text-sm">{location}</p>
        <p className="my-2">{short_description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            {categories.map(category => (
              <span key={category} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {category}
              </span>
            ))}
          </div>
          <p className="font-medium">
            From {formatPrice(price_from, currency)}
          </p>
        </div>
      </div>
    </article>
  );
}
```

### Destination Components

```typescript
// components/destinations/DestinationDetail.jsx
export default function DestinationDetail({
  name,
  country,
  description,
  highlights,
  activities,
  dining,
  travel_info,
  weather,
  main_image,
  gallery
}) {
  return (
    <div>
      <HeroSection 
        title={name} 
        location={country}
        image={getAssetURL(main_image)}
      />
      
      <div className="container mx-auto py-8">
        <div dangerouslySetInnerHTML={{ __html: description }} />
        
        <HighlightsSection highlights={highlights} />
        <ActivitiesSection activities={activities} />
        <DiningSection dining={dining} />
        <TravelInfoSection travelInfo={travel_info} weather={weather} />
        <GallerySection images={gallery} />
      </div>
    </div>
  );
}
```

## Form Handling

For forms that interact with Directus, such as newsletter signups or contact forms:

```typescript
'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Subscription failed');
      }
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="px-4 py-2 border rounded"
        required
      />
      <button 
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-2 bg-olive-500 text-white rounded"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      
      {status === 'success' && (
        <p className="text-green-600">Thank you for subscribing!</p>
      )}
      
      {status === 'error' && (
        <p className="text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
```

## Error Handling

Implement error boundaries and fallback UI components:

```typescript
'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-4">We apologize for the inconvenience. Please try again later.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-olive-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

## Authentication and Authorization

For protected routes that require authentication:

```typescript
// middleware.ts (additional logic)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Add this logic to your existing middleware
export function authMiddleware(request: NextRequest) {
  // Check if the route requires authentication
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    // Verify the token
    if (!token || !verifyToken(token)) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}
```

## Best Practices

1. **Typed Data**: Always use TypeScript interfaces for Directus data
2. **Error Handling**: Implement proper error handling and loading states
3. **Caching**: Use ISR and SWR for efficient caching
4. **Performance**: Optimize images and lazy-load content where appropriate
5. **SEO**: Use metadata from Directus for page titles and descriptions
6. **Accessibility**: Ensure all components are accessible

## Troubleshooting

### API Connection Issues

- Check that Directus is running
- Verify API token in environment variables
- Check network requests for errors in browser dev tools

### Missing Content

- Check the status field in Directus (content should be "published")
- Verify the content exists in Directus admin panel
- Check that the API is returning the expected data

### Image Loading Problems

- Verify the image file exists in Directus
- Check the image URL format
- Use Next.js Image component properly for optimization