'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Interface for the OriginalsSection props
 */
interface OriginalsSectionProps {
  name?: string;
  description?: string;
  longDescription?: string;
  image?: string;
  ctaLink?: string;
  ctaText?: string;
}

/**
 * OriginalsSection Component
 * 
 * This component displays information about the hotel founders or owners
 * in an aesthetically pleasing section with image and text.
 */
export default function OriginalsSection({ 
  name = "The Originals: Vangelis, Panos, Markos, and Marios Daktylides",
  description = "Vangelis, Panos, Markos, and Marios Daktylides honor their Mykonian roots at Avaton, blending heritage with luxurious growth.",
  longDescription = "The Daktylides brothers represent a new generation of hoteliers, bringing together their shared passion for hospitality, design, and authentic experiences. Born and raised on the island of Mykonos, they have an intrinsic understanding of the location's unique character and charm. Each brother contributes his own expertise: Vangelis oversees operations, Panos focuses on guest experience, Markos manages the culinary direction, and Marios handles design and aesthetics. Together, they have created a distinctive property that honors local traditions while embracing contemporary luxury.",
  image = "/images/hotels/hotel-7.jpg",
  ctaLink = "#rooms",
  ctaText = "Explore Our Rooms"
}: OriginalsSectionProps) {
  // Animation variants for motion elements
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Extract initials for the avatar display
  const getInitials = (): JSX.Element[] => {
    const nameParts = name.split(':')[1]?.trim().split(/[,\s]+/) || [];
    const initials = nameParts
      .filter(part => part.length > 0)
      .map(part => part[0])
      .filter(initial => initial && /[A-Za-z]/.test(initial))
      .slice(0, 4);

    return initials.map((initial, index) => (
      <span 
        key={index} 
        className={`flex h-10 w-10 rounded-full bg-brand-olive-400 text-white ${index > 0 ? '-ml-2' : ''} justify-center items-center font-brooklyn text-sm`}
        aria-hidden="true"
      >
        {initial}
      </span>
    ));
  };

  return (
    <section id="originals" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-brooklyn mb-4">The Originals</h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
            Meet the visionaries behind this exceptional hotel experience, whose passion and dedication bring the property to life.
          </p>
        </motion.div>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-5 relative">
              <div className="relative h-[300px] lg:h-full w-full">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-brooklyn mb-4">{name}</h3>
              
              <div className="space-y-4 mb-6">
                {description && (
                  <p className="text-gray-700 font-brooklyn leading-relaxed">
                    {description}
                  </p>
                )}
                {longDescription && (
                  <p className="text-gray-700 font-brooklyn leading-relaxed">
                    {longDescription}
                  </p>
                )}
              </div>
              
              <div className="mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex">
                    {getInitials()}
                  </div>
                  <a 
                    href="#" 
                    className="flex items-center text-brand-olive-400 hover:text-brand-olive-600 transition font-brooklyn"
                    aria-label="Read more about our story"
                  >
                    <span>More about our story</span>
                    <svg 
                      className="w-5 h-5 ml-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {ctaLink && ctaText && (
          <div className="mt-16 text-center">
            <a 
              href={ctaLink} 
              className="inline-flex items-center px-8 py-3 font-brooklyn bg-brand-olive-400 text-white rounded-full hover:bg-brand-olive-500 transition-colors shadow-sm"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}