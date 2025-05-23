'use client';

import Image from 'next/image';
import { getHotelImage } from '../hotels/HotelCard';

export default function DetailHeroBanner({ 
  hotelName = "Seezeitlodge Hotel & Spa", 
  location = "Gonnesweiler, Saarland, Germany", 
  description = "A lakeside wellness retreat with sustainable design and natural splendor.",
  backgroundImage = "/images/hotels/hotel-1.jpg",
  slug
}) {
  return (
    <section className="flex flex-col md:flex-row h-[68vh] w-full relative">
      {/* Hintergrund-Container der vollen Breite */}
      <div className="absolute inset-0 flex w-full h-full">
        {/* Linke Seite - Bild (55%) */}
        <div className="relative w-[55%] h-full">
          <Image
            src={slug ? getHotelImage(slug, backgroundImage) : backgroundImage}
            alt={hotelName}
            fill
            priority
            className="object-cover"
          />
        </div>
        
        {/* Rechte Seite - Farbiger Hintergrund (45%) */}
        <div className="w-[45%] h-full bg-[#93A27F]"></div>
      </div>
      
      {/* Inhalt-Container mit maximaler Breite */}
      <div className="relative flex flex-col md:flex-row w-full h-full max-w-[1814px] mx-auto">
        {/* Linke Seite - Leerraum über dem Bild (55%) */}
        <div className="w-full md:w-[55%] h-2/3 md:h-full"></div>
        
        {/* Rechte Seite - Text-Container (45%) */}
        <div className="w-full md:w-[45%] h-1/3 md:h-full flex flex-col justify-end p-8 md:p-12 lg:p-16">
          <div className="max-w-md lg:max-w-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-2">{hotelName}</h1>
            <div className="text-lg text-white/90 mb-4">{location}</div>
            <p className="text-white/80 mb-8">{description}</p>
            <a 
              href="#overview" 
              className="inline-flex items-center text-white hover:text-gray-200"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('overview').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>show more</span>
              <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="25" height="9" viewBox="0 0 25 9" fill="none">
                <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}