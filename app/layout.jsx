import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'CinCin Hotels - Handpicked Luxury Accommodations',
  description: 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.',
  keywords: 'luxury hotels, boutique hotels, travel, accommodations, cincin hotels',
};

// Simple navbar component
const SimpleNavbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            CinCin Hotels
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/hotels" className="text-gray-700 hover:text-gray-900">
              Hotels
            </Link>
            <Link href="/destinations" className="text-gray-700 hover:text-gray-900">
              Destinations
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </div>
          <div className="md:hidden">
            <button className="text-gray-700">
              Menu
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Simple footer component
const SimpleFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">CinCin Hotels</h3>
            <p className="text-gray-400">
              Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hotels" className="text-gray-400 hover:text-white">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-white">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">
              info@cincinhotels.com<br />
              +1 (123) 456-7890<br />
              123 Luxury Avenue<br />
              New York, NY 10001
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CinCin Hotels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col">
        <SimpleNavbar />
        <main className="flex-grow">{children}</main>
        <SimpleFooter />
      </body>
    </html>
  );
}