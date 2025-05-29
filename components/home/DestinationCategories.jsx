'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/providers/TranslationProvider';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export default function DestinationCategories({ 
  categories: propCategories
}) {
  const { t, locale } = useTranslation();
  
  // Fallback categories if no data is provided
  const fallbackCategories = [
    {
      id: 1,
      name: "Beach Days",
      slug: "beach",
      image: "/images/beach.jpg"
    },
    {
      id: 2,
      name: "Mountain Retreat",
      slug: "mountain",
      image: "/images/mountain.jpg"
    },
    {
      id: 3,
      name: "City Break",
      slug: "city",
      image: "/images/city.jpg"
    },
    {
      id: 4,
      name: "Country-Side",
      slug: "countryside",
      image: "/images/countryside.jpg"
    }
  ];
  
  const categories = propCategories || fallbackCategories;
  
  const getImageSrc = (category) => {
    // Check if image is an object (fetched with relation data)
    if (category.image && typeof category.image === 'object' && category.image.id) {
      return `${DIRECTUS_URL}/assets/${category.image.id}?width=400&height=550&fit=cover&quality=80`;
    }
    // Check if image is a UUID string
    else if (category.image && typeof category.image === 'string' && category.image.length === 36) {
      return `${DIRECTUS_URL}/assets/${category.image}?width=400&height=550&fit=cover&quality=80`;
    }
    // Fallback to local image based on slug
    const fallbackImages = {
      'beach': '/images/beach.jpg',
      'mountain': '/images/mountain.jpg',
      'city': '/images/city.jpg',
      'countryside': '/images/countryside.jpg'
    };
    return fallbackImages[category.slug] || "/images/destination-default.jpg";
  };
  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/${locale}/destinations/category/${category.slug}`}
              className="group relative h-[550px] overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300 z-10"></div>
              
              <Image
                src={getImageSrc(category)}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute bottom-8 left-0 right-0 text-center z-20">
                <h5 className="text-white text-xl font-normal">{category.name}</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}