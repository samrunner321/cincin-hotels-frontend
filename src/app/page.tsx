import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { DEFAULT_LANGUAGE, LanguageCode } from '../lib/i18n';
import HomePageClient from './HomePageClient';

/**
 * Metadata for the homepage
 */
export const metadata: Metadata = {
  title: 'CinCin Hotels - Handpicked Luxury Accommodations',
  description: 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.',
  openGraph: {
    type: 'website',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'CinCin Hotels - Luxury Accommodations',
      },
    ],
  },
};

/**
 * HomePage component - the main landing page of the application
 * This is a server component that renders the client component
 */
export default function HomePage({ params }: { params?: { locale?: string } }): React.ReactElement {
  // Simplified homepage for debugging the locale routing
  const localeParam = params?.locale as LanguageCode;
  const currentLocale = localeParam || DEFAULT_LANGUAGE;
  
  return (
    <div className="min-h-screen">
      <HomePageClient currentLocale={currentLocale} />
    </div>
  );
}