'use client';

import Image from 'next/image';

export default function OriginalsSection({ 
  name = "The Originals: Vangelis, Panos, Markos, and Marios Daktylides",
  description = "Vangelis, Panos, Markos, and Marios Daktylides honor their Mykonian roots at Avaton, blending heritage with luxurious growth.",
  image = "/images/hotels/hotel-7.jpg"
}) {
  return (
    <section id="originals" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/3">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">{name}</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>
            
            <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition">
              <span className="mr-2">Read more about The Originals</span>
              <svg width="25" height="9" viewBox="0 0 25 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}