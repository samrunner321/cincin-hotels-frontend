import '../app/globals.css';
import { ReactNode } from 'react';
import { DEFAULT_LANGUAGE, LanguageCode } from '@/lib/i18n';
import { TranslationsProvider } from '@/components/TranslationsContext';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';

// Dynamisches Importieren der interaktiven Komponenten
const TravelAdvisor = dynamic(() => import('@/components/chatbot/TravelAdvisor'), { ssr: false });
const TravelJourneyDesigner = dynamic(() => import('@/components/journey-designer/TravelJourneyDesigner'), { ssr: false });

// App metadata
export const metadata: Metadata = {
  title: 'CinCin Hotels - Handpicked Luxury Accommodations',
  description: 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.',
  keywords: 'luxury hotels, boutique hotels, travel, accommodations, unique hotels',
};

// Root layout props
interface RootLayoutProps {
  children: ReactNode;
  params: {
    lang?: string;
  };
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Determine language from URL params or use default
  const lang = (params.lang as LanguageCode) || DEFAULT_LANGUAGE;
  
  return (
    <html lang={lang.split('-')[0]} className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="font-brooklyn antialiased text-gray-900 bg-white overflow-x-hidden">
        <TranslationsProvider initialLanguage={lang}>
          <Navbar />
          <main className="min-h-screen w-full overflow-x-hidden">{children}</main>
          <Footer />
          
          {/* Interaktive Komponenten */}
          <TravelAdvisor />
          <TravelJourneyDesigner />
        </TranslationsProvider>
      </body>
    </html>
  );
}