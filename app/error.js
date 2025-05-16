'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Please try again later or contact support if the problem persists.
        </p>
        <button
          onClick={() => reset()}
          className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
