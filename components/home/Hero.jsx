'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Hero({ 
  title = "CINCIN® hotels is a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.",
  subtitle = null,
  buttonText = "Explore all Hotels",
  backgroundImage = "/images/hero-bg.jpg"
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('destination');
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In einer realen Anwendung würde hier die Suche ausgeführt werden
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
    // Optional: Weiterleitung zur Suchergebnisseite
    // router.push(`/search?q=${searchQuery}&type=${selectedCategory}`);
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };
  
  const scrollToNextSection = () => {
    // Scroll to the next section after the hero
    const nextSection = document.querySelector('section:not(.hero-section) + section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no next section found, scroll down 100vh
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-end pb-20 md:pb-32 lg:pb-40"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Glasmorphismus Suchleiste - jetzt mittig auf der Seite */}
      <motion.div
        variants={searchBarVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-20 max-w-3xl mx-auto px-4 sm:px-6"
      >
        <form onSubmit={handleSearch} className="backdrop-blur-[8px] bg-white/5 rounded-full overflow-hidden shadow-2xl hover:shadow-white/5 transition-all group">
          <div className="flex flex-col md:flex-row">
            {/* Kategorie-Auswahl */}
            <div className="relative md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full bg-transparent text-white/90 border-b md:border-b-0 md:border-r md:border-r-white/10 py-4 px-6 focus:outline-none font-brooklyn"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <option value="destination" className="bg-gray-800/90 text-white">Destination</option>
                <option value="hotel" className="bg-gray-800/90 text-white">Hotel</option>
                <option value="experience" className="bg-gray-800/90 text-white">Experience</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/80">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9l3 3 3-3" />
                </svg>
              </div>
            </div>
            
            {/* Sucheingabe */}
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white py-4 px-6 focus:outline-none placeholder-white/60 font-brooklyn"
            />
            
            {/* Suchbutton */}
            <button
              type="submit"
              className="bg-transparent hover:bg-white/10 text-white py-4 px-6 transition-all duration-300 font-brooklyn flex items-center justify-center rounded-full md:rounded-l-none md:rounded-r-full"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
        
        {/* Schnellfilter - jetzt als freier Stil unter der Suchleiste */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mt-4 text-center">
          <span className="text-white/80 text-sm font-brooklyn">Popular:</span>
          <button 
            type="button" 
            onClick={() => setSearchQuery('Italy')} 
            className="text-white/80 hover:text-white hover:scale-105 text-sm transition-all font-brooklyn"
          >
            Italy
          </button>
          <button 
            type="button" 
            onClick={() => setSearchQuery('French Riviera')} 
            className="text-white/80 hover:text-white hover:scale-105 text-sm transition-all font-brooklyn"
          >
            French Riviera
          </button>
          <button 
            type="button" 
            onClick={() => setSearchQuery('Greek Islands')} 
            className="text-white/80 hover:text-white hover:scale-105 text-sm transition-all font-brooklyn"
          >
            Greek Islands
          </button>
          <button 
            type="button" 
            onClick={() => setSearchQuery('Swiss Alps')} 
            className="text-white/80 hover:text-white hover:scale-105 text-sm transition-all font-brooklyn"
          >
            Swiss Alps
          </button>
        </div>
      </motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px] relative z-10 text-white w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <p className="text-xl md:text-2xl leading-relaxed font-brooklyn">
              {title}
            </p>
            
            {subtitle && (
              <p className="text-lg opacity-90 mt-2 font-brooklyn">
                {subtitle}
              </p>
            )}
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link 
              href="/hotels" 
              className="inline-flex items-center text-white bg-transparent border border-white hover:bg-brand-olive-400 hover:border-brand-olive-400 hover:text-white transition-colors duration-300 rounded-md px-6 py-3"
            >
              <span>{buttonText}</span>
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