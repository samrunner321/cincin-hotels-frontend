'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { NavbarProps, NavAnimationVariants, NavLink } from '../../types/layout';
import { useScrollPosition } from '../../utils/layout-helpers';
import MobileMenu from './MobileMenu';
import EnhancedLanguageSwitcher from '../i18n/EnhancedLanguageSwitcher';
import { useEnhancedTranslations } from '../i18n/EnhancedTranslationsProvider';
import { rtlFlipClasses } from '../../utils/rtl-utils';

/**
 * Main navigation component that shows at the top of every page
 * @param className - Optional additional className for the navbar
 * @param transparent - Whether the navbar should start transparent (default: true)
 */
export default function Navbar({ 
  className = '',
  transparent = true 
}: NavbarProps): React.ReactElement {
  const isScrolled = useScrollPosition(75);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Get RTL status from translations context
  const { isRtl, direction } = useEnhancedTranslations();

  // Animation variants
  const animationVariants: NavAnimationVariants = {
    logoVariants: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.5 }
      },
    },
    navItemVariants: {
      hidden: { opacity: 0, y: -10 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1,
          duration: 0.5
        }
      })
    }
  };

  // Navigation links
  const navLinks: NavLink[] = [
    { text: 'Hotels', href: '/hotels' },
    { text: 'Destinations', href: '/destinations' },
    { text: 'Journal', href: '/journal' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent pt-4'
      } ${className}`}
      role="banner"
      dir={direction}
    >
      <div 
        className={`container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center ${
          isScrolled ? 'py-5' : 'py-3 md:py-4'
        }`}
      >
        <motion.div 
          className="flex items-center" 
          initial="hidden"
          animate="visible"
          variants={animationVariants.logoVariants}
        >
          <Link href="/" aria-label="CinCin Hotels Home" className="block">
            {isScrolled ? (
              <Image 
                src="/images/logo/logo-dark.png" 
                alt="CinCin Hotels" 
                width={130} 
                height={32} 
                className="h-[25px] sm:h-[29px] md:h-[31px] w-auto" // 10% smaller than the white logo
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
          <nav className="hidden lg:block mr-8" aria-label="Main Navigation">
            <ul className={rtlFlipClasses('flex space-x-4 xl:space-x-8', isRtl)}>
              {/* In RTL mode, we need to reverse the order of the links */}
              {(isRtl ? [...navLinks].reverse() : navLinks).map((item, i) => (
                <motion.li 
                  key={item.href} 
                  custom={i} 
                  variants={animationVariants.navItemVariants} 
                  initial="hidden" 
                  animate="visible"
                >
                  <Link 
                    href={item.href} 
                    className={`${
                      isScrolled ? 'text-gray-700 hover:text-brand-olive-400' : 'text-white hover:text-black'
                    } text-sm xl:text-base transition-colors py-2 block ${isRtl ? 'text-right' : 'text-left'}`}
                    aria-current={item.href === "/hotels" ? "page" : undefined}
                  >
                    {item.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          
          {/* Language Switcher - Desktop */}
          <div className={`hidden lg:block ${isRtl ? 'ml-4' : 'mr-4'}`}>
            <EnhancedLanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <motion.button 
              className="focus:outline-none focus:ring-2 focus:ring-brand-olive-400 rounded-full p-1 flex items-center justify-center" 
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMobileMenuOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              type="button"
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