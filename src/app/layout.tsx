import '../app/globals.css';
import { ReactNode } from 'react';
import { DEFAULT_LANGUAGE, LanguageCode } from '../lib/i18n';
import { EnhancedTranslationsProvider } from '../components/i18n/EnhancedTranslationsProvider';
import { UIStateProvider } from '../components/UIStateContext';
import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import dynamic from 'next/dynamic';

// Dynamically import interactive components
const TravelAdvisor = dynamic(() => import('../components/chatbot/TravelAdvisor'), { ssr: false });
const TravelJourneyDesigner = dynamic(() => import('../components/journey-designer/TravelJourneyDesigner'), { ssr: false });

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
    locale?: string;
  };
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Determine language from URL params or use default
  const locale = params.locale as LanguageCode;
  const lang = locale || DEFAULT_LANGUAGE;
  
  // Determine initial theme based on system preference
  // This is a placeholder as the actual detection happens client-side in UIStateProvider
  const initialTheme = 'light';
  
  return (
    <html lang={lang.split('-')[0]} className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="font-brooklyn antialiased text-gray-900 bg-white overflow-x-hidden">
        <EnhancedTranslationsProvider initialLanguage={lang}>
          <UIStateProvider initialTheme={initialTheme}>
            <Navbar />
            <main className="min-h-screen w-full overflow-x-hidden">{children}</main>
            <Footer />
            
            {/* Interactive Components */}
            <TravelAdvisor />
            <TravelJourneyDesigner />
          </UIStateProvider>
        </EnhancedTranslationsProvider>
      </body>
    </html>
  );
}