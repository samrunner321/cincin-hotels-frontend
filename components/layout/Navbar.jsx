'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useTranslation } from '@/providers/TranslationProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, locale } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 75);
    };
    
    // Set initial scroll state
    handleScroll();
    
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

  // Check if we're on a page that needs immediate white background
  const isHomePage = pathname === `/${locale}` || pathname === '/';
  const isHotelDetailPage = pathname.includes('/hotels/') && !pathname.endsWith('/hotels');
  const isHotelsListPage = pathname.endsWith('/hotels');
  const isDestinationsPage = pathname.endsWith('/destinations');
  const isDestinationDetailPage = pathname.includes('/destinations/') && !pathname.endsWith('/destinations');
  const isJournalPage = pathname.endsWith('/journal');
  const needsTransparentStart = isHomePage || isHotelDetailPage || isHotelsListPage || isDestinationsPage || isDestinationDetailPage || isJournalPage;
  const needsImmediateWhiteBg = !needsTransparentStart;

  // Avoid hydration issues by only rendering dynamic content after mount
  const headerClass = mounted
    ? `fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || needsImmediateWhiteBg ? 'bg-white shadow-md' : 'bg-transparent'
      }`
    : 'fixed top-0 w-full z-50 transition-all duration-300 bg-transparent';

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center" 
          initial="hidden"
          animate="visible"
          variants={logoVariants}
        >
          <Link href={`/${locale}`} aria-label="CinCin Hotels Home">
            {mounted && (isScrolled || needsImmediateWhiteBg) ? (
              <Image 
                src="/images/logo/logo-dark.png" 
                alt="CinCin Hotels" 
                width={122} 
                height={30} 
                className="h-7 w-auto"
                priority
              />
            ) : (
              <Image 
                src="/images/logo/logo.png" 
                alt="CinCin Hotels" 
                width={122} 
                height={29} 
                className="h-7 w-auto"
                priority
              />
            )}
          </Link>
        </motion.div>
        
        <div className="flex items-center">
          <nav className="hidden md:block mr-8">
            <ul className="flex space-x-8">
              {[
                { text: t('nav.hotels'), href: `/${locale}/hotels` },
                { text: t('nav.destinations'), href: `/${locale}/destinations` },
                { text: t('nav.journal'), href: `/${locale}/journal` },
              ].map((item, i) => (
                <motion.li key={item.href} custom={i} variants={navItemVariants} initial="hidden" animate="visible">
                  <Link 
                    href={item.href} 
                    className={`${isScrolled || needsImmediateWhiteBg ? 'text-gray-700' : 'text-white'} hover:text-brand-blue-600 transition-colors`}
                  >
                    {item.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher isDark={isScrolled || needsImmediateWhiteBg} />
            
            <motion.button 
              className="focus:outline-none" 
              aria-label="User Profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                stroke={isScrolled || needsImmediateWhiteBg ? "#1E293B" : "white"}
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M14 14.75V13.25C14 12.4544 13.6488 11.6913 13.0236 11.1287C12.3985 10.5661 11.5507 10.25 10.6666 10.25H3.99996C3.1159 10.25 2.26806 10.5661 1.64294 11.1287C1.01782 11.6913 0.666626 12.4544 0.666626 13.25V14.75M10.6666 4.25C10.6666 5.90685 9.17424 7.25 7.33329 7.25C5.49234 7.25 3.99996 5.90685 3.99996 4.25C3.99996 2.59315 5.49234 1.25 7.33329 1.25C9.17424 1.25 10.6666 2.59315 10.6666 4.25Z" />
              </svg>
            </motion.button>
            
            <motion.button 
              className="focus:outline-none" 
              aria-label="Open Menu"
              onClick={() => setIsMobileMenuOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 20 14" 
                fill="none" 
                stroke={isScrolled || needsImmediateWhiteBg ? "#1E293B" : "white"}
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="w-4 h-4"
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