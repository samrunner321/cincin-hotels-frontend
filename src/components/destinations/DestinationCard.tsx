// @ts-nocheck
'use client';

import Link from 'next/link';
import { Destination } from '../../lib/directus';
import DirectusImage from '../../../components/common/DirectusImage';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link href={`/destinations/${destination.slug}`}>
      <div className="group bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
        <div className="aspect-[4/3] relative overflow-hidden">
          {destination.main_image && (
            <DirectusImage
              fileId={destination.main_image}
              alt={destination.name}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              widths={[400, 600, 800]}
              priority
            />
          )}
          {destination.is_featured && (
            <div className="absolute top-4 left-4 bg-primary text-white text-sm px-3 py-1 rounded-full">
              Featured
            </div>
          )}
          {destination.is_popular && (
            <div className="absolute top-4 right-4 bg-secondary text-white text-sm px-3 py-1 rounded-full">
              Popular
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
            {destination.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {destination.country}
            {destination.region && ` • ${destination.region.replace('_', ' ')}`}
          </p>
          <p className="text-gray-700 text-sm mb-4 flex-grow">{destination.short_description}</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-primary font-semibold">
              Explore
            </span>
            <span className="text-sm text-gray-600">
              {destination.hotels?.length || 0} hotels
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}