import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import von der originalen HotelsPage Komponente
const HotelsPage = dynamic(
  () => import('../../src/components/hotels/HotelsPage'),
  { 
    ssr: false, 
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div>
      </div>
    ) 
  }
);

export const metadata = {
  title: 'Unsere Hotels - CinCin Hotels',
  description: 'Entdecken Sie unsere sorgfältig kuratierte Auswahl an außergewöhnlichen Hotels, von Bergrückzugsorten bis hin zu urbanen Refugien.',
  openGraph: {
    title: 'Unsere Hotels - CinCin Hotels',
    description: 'Entdecken Sie unsere sorgfältig kuratierte Auswahl an außergewöhnlichen Hotels, von Bergrückzugsorten bis hin zu urbanen Refugien.',
    images: [
      {
        url: '/images/og-hotels.jpg',
        width: 1200,
        height: 630,
        alt: 'Unsere Hotels - CinCin Hotels',
      },
    ],
  },
};

export default function HotelsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div>
      </div>
    }>
      <HotelsPage />
    </Suspense>
  );
}