'use client';

import Image from 'next/image';
import { getHotelImage } from '../hotels/HotelCard';

export default function DetailHeroBanner({ 
  hotelName = "Myconian Avaton", 
  location = "Mykonos, Greece", 
  description = "A Cycladic retreat with stunning Aegean views on Elia Beach.",
  backgroundImage = "/images/hotels/hotel-1.jpg",
  slug
}) {
  return (
    <section className="relative min-h-screen flex items-end pb-16 md:pb-24">
      <div className="absolute inset-0 z-0">
        <Image
          src={slug ? getHotelImage(slug, backgroundImage) : backgroundImage}
          alt={hotelName}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">{hotelName}</h1>
          <div className="text-lg text-white/90 mb-4">{location}</div>
          <p className="text-white/80 mb-8 max-w-md">{description}</p>
          <a 
            href="#overview" 
            className="inline-flex items-center text-white border-2 border-white px-8 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('overview').scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Show More</span>
            <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="25" height="9" viewBox="0 0 25 9" fill="none">
              <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}