import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destination Not Found | CinCin Hotels & Resorts',
  description: 'The destination you are looking for could not be found',
};

export default function DestinationNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-6">Destination Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        The destination you are looking for could not be found or may have been removed.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link 
          href="/destinations"
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Browse All Destinations
        </Link>
        <Link 
          href="/"
          className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}