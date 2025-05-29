'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/providers/TranslationProvider';
import { fetchSiteSettings, getImageUrl } from '@/lib/directus';

export default function Hero({ 
  backgroundImage = "/images/hero-bg.jpg"
}) {
  const [heroImage, setHeroImage] = useState(backgroundImage);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { t, locale } = useTranslation();

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        const settings = await fetchSiteSettings();
        if (settings && settings.homepage_hero_image) {
          setHeroImage(getImageUrl(settings.homepage_hero_image));
        }
      } catch (error) {
        console.error('Failed to load hero image from settings:', error);
        // Fallback to default image is already set in useState
      }
    };

    loadHeroImage();
  }, []);

  const formatDateRange = () => {
    if (checkInDate && checkOutDate) {
      const checkin = new Date(checkInDate).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
        day: 'numeric',
        month: 'short'
      });
      const checkout = new Date(checkOutDate).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
        day: 'numeric',
        month: 'short'
      });
      return `${checkin} - ${checkout}`;
    }
    return locale === 'de' ? 'Datum wählen' : 'Select dates';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search:', {
      destination: searchQuery,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests
    });
    // Hier würde die Weiterleitung zur Suchergebnisseite erfolgen
  };

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 } 
    }
  };

  const searchBarVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.5,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Scrollfunktion entfernt, da sie browser-spezifische APIs verwendet,
  // welche zu Hydration-Fehlern führen können, wenn sie beim ersten Render ausgeführt werden

  return (
    <section 
      className="relative h-[80vh] flex items-end pb-[50px]"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Glassy Searchbar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-full max-w-3xl px-4"
          variants={searchBarVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            {/* Destination Input */}
            <div className="flex-[2] min-w-0">
              <label className="block text-white/80 text-xs mb-1 font-medium">
                {locale === 'de' ? 'Destination' : 'Destination'}
              </label>
              <input 
                type="text" 
                placeholder={locale === 'de' ? 'Wohin möchten Sie reisen?' : 'Where would you like to go?'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/60 text-sm focus:outline-none border-none"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-white/20"></div>

            {/* Check-in / Check-out */}
            <div className="flex-[1.2] min-w-0 relative">
              <label className="block text-white/80 text-xs mb-1 font-medium">
                {locale === 'de' ? 'An- & Abreise' : 'Check-in & Check-out'}
              </label>
              <input 
                type="text"
                value={formatDateRange()}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full bg-transparent text-white placeholder-white/60 text-sm focus:outline-none border-none cursor-pointer"
                readOnly
              />
              
              {/* Simple Date Picker */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 w-64">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 text-xs font-medium mb-1">
                        {locale === 'de' ? 'Anreise' : 'Check-in'}
                      </label>
                      <input 
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-xs font-medium mb-1">
                        {locale === 'de' ? 'Abreise' : 'Check-out'}
                      </label>
                      <input 
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm"
                        min={checkInDate}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowDatePicker(false)}
                      className="w-full bg-gray-900 text-white rounded px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
                    >
                      {locale === 'de' ? 'Fertig' : 'Done'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-white/20"></div>

            {/* Guests */}
            <div className="flex-[0.8] min-w-0">
              <label className="block text-white/80 text-xs mb-1 font-medium">
                {locale === 'de' ? 'Gäste' : 'Guests'}
              </label>
              <select 
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none border-none"
              >
                <option value="1" className="text-gray-900">1 {locale === 'de' ? 'Gast' : 'Guest'}</option>
                <option value="2" className="text-gray-900">2 {locale === 'de' ? 'Gäste' : 'Guests'}</option>
                <option value="3" className="text-gray-900">3 {locale === 'de' ? 'Gäste' : 'Guests'}</option>
                <option value="4" className="text-gray-900">4 {locale === 'de' ? 'Gäste' : 'Guests'}</option>
                <option value="5+" className="text-gray-900">5+ {locale === 'de' ? 'Gäste' : 'Guests'}</option>
              </select>
            </div>

            {/* Search Button */}
            <button 
              type="submit"
              className="bg-white text-gray-900 rounded-full px-6 py-2 hover:bg-gray-100 transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2 self-end"
            >
              <span>{locale === 'de' ? 'Suchen' : 'Search'}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </form>
          </div>
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-white w-full">
        <div className="flex justify-between items-end">
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <p className="text-xl md:text-2xl leading-relaxed">
              {locale === 'de' 
                ? "CINCIN® Hotels ist eine kuratierte Sammlung einzigartiger Unterkünfte, bekannt für zeitloses Design und warme, persönliche Gastfreundschaft."
                : "CINCIN® hotels is a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality."
              }
            </p>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link 
              href={`/${locale}/hotels`}
              className="inline-flex items-center text-white bg-transparent border border-white hover:bg-white hover:text-gray-900 transition-colors duration-300 rounded-md px-6 py-3"
            >
              <span>{locale === 'de' ? 'Alle Hotels entdecken' : 'Explore all Hotels'}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 25 9" 
                fill="none"
              >
                <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" 
                  fill="currentColor"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}