import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HotelCategories({
  title = "Hotel Categories",
  categories = [
    {
      id: 1,
      name: "Culinary",
      image: "/images/category-culinary.jpg",
      url: "/hotels/category/culinary"
    },
    {
      id: 2,
      name: "Spa",
      image: "/images/category-spa.jpg",
      url: "/hotels/category/spa"
    },
    {
      id: 3,
      name: "City",
      image: "/images/category-city.jpg",
      url: "/hotels/category/city"
    },
    {
      id: 4,
      name: "Beach",
      image: "/images/category-beach.jpg",
      url: "/hotels/category/beach"
    },
    {
      id: 5,
      name: "Adults Only",
      image: "/images/category-adults.jpg",
      url: "/hotels/category/adults-only"
    }
  ]
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-semibold mb-8">{title}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.url}
              className="group relative block h-56 md:h-64 rounded-lg overflow-hidden"
            >
              <Image
                src={category.image}
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