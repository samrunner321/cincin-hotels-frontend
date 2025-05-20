'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DirectusImage from '../../../components/common/DirectusImage';
import { useCategories } from '../../hooks/useDirectusData';

export default function DestinationCategories() {
  const { categories, isLoading, isError } = useCategories({
    type: 'destination',
    featured: true,
    revalidate: 600 // 10 minutes
  });
  
  const [destinationCategories, setDestinationCategories] = useState([]);
  
  useEffect(() => {
    if (categories) {
      setDestinationCategories(categories);
    }
  }, [categories]);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg aspect-square"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !destinationCategories || destinationCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Explore by Category</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Find your perfect destination based on your travel preferences
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {destinationCategories.map((category) => (
            <Link 
              href={`/destinations?category=${category.id}`} 
              key={category.id}
              className="group relative rounded-lg overflow-hidden aspect-square bg-gray-100"
            >
              {category.image ? (
                <DirectusImage
                  fileId={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  fill
                />
              ) : (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  {category.icon && (
                    <span className="text-4xl text-primary">{/* Icon would go here */}</span>
                  )}
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-white text-lg md:text-xl font-semibold group-hover:text-primary-light transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-white/80 text-xs mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}