'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export default function HotelCategories({
  title,
  categories: propCategories
}) {
  const { t, locale } = useTranslation();
  
  // Fallback categories if no data is provided
  const fallbackCategories = [
    {
      id: 1,
      name: "Culinary",
      slug: "culinary",
      image: "/images/category-culinary.jpg"
    },
    {
      id: 2,
      name: "Spa & Wellness",
      slug: "spa",
      image: "/images/category-spa.jpg"
    },
    {
      id: 3,
      name: "City",
      slug: "city",
      image: "/images/category-city.jpg"
    },
    {
      id: 4,
      name: "Beach",
      slug: "beach",
      image: "/images/category-beach.jpg"
    },
    {
      id: 5,
      name: "Adults Only",
      slug: "adults-only",
      image: "/images/category-adults.jpg"
    }
  ];

  const categories = propCategories || fallbackCategories;
  const displayTitle = title || (locale === 'de' ? 'Hotel Kategorien' : 'Hotel Categories');
  const getImageSrc = (category) => {
    // Check if image is an object (fetched with relation data)
    if (category.image && typeof category.image === 'object' && category.image.id) {
      return `${DIRECTUS_URL}/assets/${category.image.id}?width=400&height=300&fit=cover&quality=80`;
    }
    // Check if image is a UUID string
    else if (category.image && typeof category.image === 'string' && category.image.length === 36) {
      return `${DIRECTUS_URL}/assets/${category.image}?width=400&height=300&fit=cover&quality=80`;
    }
    // Fallback to local image based on slug
    const fallbackImages = {
      'culinary': '/images/category-culinary.jpg',
      'spa': '/images/category-spa.jpg',
      'city': '/images/category-city.jpg',
      'beach': '/images/category-beach.jpg',
      'adults-only': '/images/category-adults.jpg'
    };
    return fallbackImages[category.slug] || "/images/category-default.jpg";
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-semibold mb-8">{displayTitle}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/hotels/category/${category.slug}`}
              className="group relative block h-56 md:h-64 rounded-lg overflow-hidden"
            >
              <Image
                src={getImageSrc(category)}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
              <h5 className="absolute bottom-6 left-6 text-white text-lg font-semibold">{category.name}</h5>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}