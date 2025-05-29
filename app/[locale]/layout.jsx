import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TranslationProvider } from '@/providers/TranslationProvider';
import CookieBanner from '@/components/common/CookieBanner';
import dynamic from 'next/dynamic';

// Dynamisch importieren der ErrorBoundary (nur clientseitig)
const ErrorBoundary = dynamic(() => import('@/components/error/ErrorBoundary'), { ssr: false });

export async function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export async function generateMetadata({ params }) {
  const { locale } = params;
  
  const metadata = {
    de: {
      title: 'CinCin Hotels - Handverlesene Luxusunterkünfte',
      description: 'Entdecken Sie eine kuratierte Sammlung einzigartiger Unterkünfte, bekannt für zeitloses Design und warme, persönliche Gastfreundschaft.',
    },
    en: {
      title: 'CinCin Hotels - Handpicked Luxury Accommodations',
      description: 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.',
    }
  };

  return {
    ...metadata[locale] || metadata.de,
    keywords: 'luxury hotels, boutique hotels, travel, accommodations, cincin hotels',
    metadataBase: new URL('https://cincinhotels.example.com'),
    alternates: {
      languages: {
        'de': `/de`,
        'en': `/en`,
      }
    }
  };
}

export default function LocaleLayout({ children, params }) {
  const { locale } = params;
  
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = '${locale}'`,
        }}
      />
      <TranslationProvider>
        <Navbar />
        <ErrorBoundary id="main-content">
          <main className="min-h-screen">{children}</main>
        </ErrorBoundary>
        <Footer />
        <CookieBanner />
      </TranslationProvider>
    </>
  );
}