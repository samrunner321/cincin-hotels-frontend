import './globals.css';

export const metadata = {
  title: 'CinCin Hotels - Handpicked Luxury Accommodations',
  description: 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.',
  keywords: 'luxury hotels, boutique hotels, travel, accommodations, cincin hotels',
  metadataBase: new URL('https://cincinhotels.example.com'),
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body className="font-brooklyn">
        {children}
      </body>
    </html>
  );
}