import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import dynamic from 'next/dynamic';
import { TranslationsProvider } from '../src/components/TranslationsContext';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../src/lib/i18n';

// Dynamisches Importieren der interaktiven Komponenten 
const TravelAdvisor = dynamic(() => import('../components/chatbot/TravelAdvisor'), { ssr: false });
const TravelJourneyDesigner = dynamic(() => import('../components/journey-designer/TravelJourneyDesigner'), { ssr: false });

export const metadata = {
  title: 'CinCin Hotels - Handpicked Luxury Accommodations',
  description: 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.',
  keywords: 'luxury hotels, boutique hotels, travel, accommodations, cincin hotels',
};

export default function RootLayout({ children, params }) {
  // Determine language from URL params or use default
  const lang = params?.lang || DEFAULT_LANGUAGE;
  
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