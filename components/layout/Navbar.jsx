'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 75);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent pt-4'
    }`}>
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center ${
        isScrolled ? 'py-5' : 'py-3 md:py-4'
      }`}>
        <motion.div 
          className="flex items-center" 
          initial="hidden"
          animate="visible"
          variants={logoVariants}
        >
          <Link href="/" aria-label="CinCin Hotels Home" className="block">
            {isScrolled ? (
              <Image 
                src="/images/logo/logo-dark.png" 
                alt="CinCin Hotels" 
                width={130} 
                height={32} 
                className="h-[25px] sm:h-[29px] md:h-[31px] w-auto" // 10% kleiner als das weiße Logo
                priority
              />
            ) : (
              <Image 
                src="/images/logo/logo.png" 
                alt="CinCin Hotels" 
                width={130} 
                height={32} 
                className="h-[28px] sm:h-[32px] md:h-[35px] w-auto"
                priority
              />
            )}
          </Link>
        </motion.div>
        
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <nav className="hidden lg:block mr-8">
            <ul className="flex space-x-4 xl:space-x-8">
              {[
                { text: 'Hotels', href: '/hotels' },
                { text: 'Destinations', href: '/destinations' },
                { text: 'Journal', href: '/journal' },
              ].map((item, i) => (
                <motion.li key={item.href} custom={i} variants={navItemVariants} initial="hidden" animate="visible">
                  <Link 
                    href={item.href} 
                    className={`${isScrolled ? 'text-gray-700 hover:text-brand-olive-400' : 'text-white hover:text-black'} text-sm xl:text-base transition-colors py-2 block`}
                  >
                    {item.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <motion.button 
              className="focus:outline-none flex items-center justify-center" 
              aria-label="Open Menu"
              onClick={() => setIsMobileMenuOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="14" 
                viewBox="0 0 20 14" 
                fill="none" 
                stroke={isScrolled ? "#1E293B" : "white"}
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="w-5 h-4"
              >
                <path d="M1 7H19M1 1H19M1 13H19" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}