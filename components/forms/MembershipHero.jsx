'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function MembershipHero() {
  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hotels/hotel-5.jpg"
          alt="CinCin Hotels Membership"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6">
            Join Our Collection of Exceptional Hotels
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Become part of CinCin Hotels' curated selection of boutique properties and access our exclusive network of hoteliers and guests.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a href="#membership-form" className="bg-white text-black px-8 py-3 rounded-md inline-flex items-center hover:bg-gray-100 transition-colors">
              <span>Apply Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}