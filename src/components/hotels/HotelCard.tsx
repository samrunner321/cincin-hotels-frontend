import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hotel, HotelSummary } from '../../types/hotel';
import { Category } from '../../types/category';
import { getHotelImage, getResponsiveImageSizes } from '../../utils/image-helpers';
import { cn } from '../../../lib/utils';

/**
 * Props für die HotelCard-Komponente
 */
export interface HotelCardProps extends Partial<Hotel> {
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Maximale Länge der Beschreibung */
  maxDescriptionLength?: number;
  /** Callback bei Klick auf die Karte */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  /** Priorität für das Laden des Bildes */
  imagePriority?: boolean;
  /** Zeigt einen Hover-Effekt für das Bild an */
  imageHoverEffect?: boolean;
  /** Lässt die Beschreibung weg */
  hideDescription?: boolean;
  /** Zeigt Preise an */
  showPrice?: boolean;
  /** Zeigt Kategorien an */
  showCategories?: boolean;
}

/**
 * HotelCard-Komponente
 * 
 * Zeigt ein einzelnes Hotel als Karte an, mit Bild, Name, Ort und weiteren Informationen
 * 
 * @example
 * <HotelCard 
 *   id="123" 
 *   name="The Comodo" 
 *   location="Paris, France" 
 *   short_description="A luxury hotel in the heart of Paris" 
 *   slug="the-comodo"
 *   categories={[{ id: "city", name: "City" }]}
 * />
 */
export default function HotelCard({ 
  id, 
  name, 
  location, 
  description,
  short_description,
  image,
  main_image_url,
  categories = [],
  slug,
  extraInfo,
  price_from,
  currency = 'EUR',
  maxDescriptionLength = 120,
  className = '',
  onClick,
  imagePriority = false,
  imageHoverEffect = true,
  hideDescription = false,
  showPrice = true,
  showCategories = true
}: HotelCardProps): JSX.Element {
  // Slug-Fallback und URL-Erzeugung
  const hotelUrl = `/hotels/${slug || id}`;
  
  // Verwende short_description oder description
  const displayDescription = short_description || description;
  
  // Beschreibung kürzen, wenn zu lang
  const truncatedDescription = displayDescription && displayDescription.length > maxDescriptionLength
    ? `${displayDescription.substring(0, maxDescriptionLength)}...`
    : displayDescription;
    
  // Bild-URL ermitteln
  const imageUrl = main_image_url || image;
  
  // Preis-Anzeige vorbereiten
  const priceDisplay = price_from ? `Ab ${currency} ${price_from}` : null;
  
  // Die Kategorie-Items rendert, falls vorhanden
  const renderCategories = () => {
    if (!showCategories || !categories || categories.length === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.map(category => {
          const categoryName = typeof category === 'string' 
            ? category 
            : (category as Category)?.name || '';
            
          const categorySlug = typeof category === 'string' 
            ? (category as string).toLowerCase().replace(/\s+/g, '-')
            : ((category as Category)?.slug || 
               (category as Category)?.name?.toLowerCase().replace(/\s+/g, '-') || 
               '');
          
          if (!categoryName) return null;
          
          return (
            <Link 
              key={categorySlug || categoryName} 
              href={`/categories/${categorySlug}`}
              className="text-sm text-brand-olive-600 hover:text-brand-olive-800 transition-colors bg-brand-olive-50 px-2 py-1 rounded-full"
              aria-label={`Browse ${categoryName} hotels`}
              onClick={e => e.stopPropagation()}
            >
              {categoryName}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <article 
      className={cn(
        "overflow-hidden rounded-xl font-brooklyn hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Bild-Container */}
        <div className="relative h-[320px] md:h-[400px] lg:h-[460px] overflow-hidden rounded-xl">
          <div className="h-full w-full">
            <Image
              src={getHotelImage(imageUrl, slug)}
              alt={name || "Hotel exterior"}
              fill
              sizes={getResponsiveImageSizes('hotel')}
              className={cn(
                "object-cover", 
                imageHoverEffect && "transition-transform duration-500 hover:scale-105"
              )}
              priority={imagePriority}
            />
            <div className="absolute top-0 right-0 m-4 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Content-Container */}
        <div className="pt-4">
          <h3 className="text-xl font-normal font-brooklyn">
            {name}
          </h3>
          
          {location && (
            <p className="text-gray-700 text-sm mb-3">
              {location}
            </p>
          )}
          
          {!hideDescription && truncatedDescription && (
            <p className="text-gray-700 mb-1">{truncatedDescription}</p>
          )}
          
          {showPrice && priceDisplay && (
            <p className="text-gray-700 text-sm font-semibold mt-3">{priceDisplay}</p>
          )}
          
          {extraInfo && (
            <p className="text-gray-700 text-sm italic mb-3">{extraInfo}</p>
          )}
          
          {renderCategories()}
        </div>
      </div>
    </article>
  );
}