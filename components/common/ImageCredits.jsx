'use client';

import { useState, useEffect } from 'react';

export default function ImageCredits() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImageCredits();
  }, []);

  const fetchImageCredits = async () => {
    try {
      const response = await fetch('/api/image-credits');
      if (!response.ok) {
        throw new Error('Failed to fetch image credits');
      }
      const data = await response.json();
      setCredits(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded-md bg-red-50">
        <p>Fehler beim Laden der Bildnachweise: {error}</p>
      </div>
    );
  }

  if (credits.length === 0) {
    return null;
  }

  return (
    <div className="image-credits-section py-8">
      <h2 className="text-2xl font-bold mb-6">Bildnachweise</h2>
      <div className="space-y-4">
        {credits.map((credit, index) => (
          <div key={credit.id || index} className="border-b border-gray-200 pb-4 last:border-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{credit.image_name}</h3>
                {credit.page_location && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Verwendung:</span> {credit.page_location}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Fotograf:</span> {credit.photographer}
                </p>
                {credit.source && (
                  <p className="text-sm">
                    <span className="font-medium">Quelle:</span> {credit.source}
                  </p>
                )}
                {credit.license && (
                  <p className="text-sm">
                    <span className="font-medium">Lizenz:</span> {credit.license}
                  </p>
                )}
                {credit.url && (
                  <p className="text-sm">
                    <span className="font-medium">Link:</span>{' '}
                    <a 
                      href={credit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {credit.url}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}