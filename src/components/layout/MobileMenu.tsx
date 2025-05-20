'use client';

import React, { MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileMenuProps, NavSectionProps, MenuAnimationVariants } from '../../types/layout';
import { useBodyScrollLock } from '../../utils/layout-helpers';
import EnhancedLanguageSwitcher from '../i18n/EnhancedLanguageSwitcher';

/**
 * Mobile navigation menu that appears as a full-screen overlay
 */
export default function MobileMenu({ isOpen, onClose }: MobileMenuProps): React.ReactElement {
  // Lock body scroll when menu is open
  useBodyScrollLock(isOpen);

  // Animation variants
  const animationVariants: MenuAnimationVariants = {
    menuVariants: {
      hidden: { opacity: 0, y: "-100%" },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          staggerChildren: 0.07,
          delayChildren: 0.2
        }
      },
      exit: { 
        opacity: 0,
        y: "-100%",
        transition: { 
          ease: "easeInOut",
          duration: 0.3
        }
      }
    },
    itemVariants: {
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
      exit: { y: 20, opacity: 0 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-white z-50 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants.menuVariants}
          aria-modal="true"
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <motion.div 
              className="flex justify-between items-center mb-6 sm:mb-8"
              variants={animationVariants.itemVariants}
            >
              <Link href="/" onClick={onClose} aria-label="CinCin Hotels Home">
                <Image 
                  src="/images/logo/logo-dark.png" 
                  alt="CinCin Hotels" 
                  width={130} 
                  height={32} 
                  className="h-[28px] sm:h-[32px] w-auto"
                />
              </Link>
              
              <div className="flex items-center space-x-4">
                <button 
                  className="focus:outline-none hidden sm:block" 
                  aria-label="User Profile"
                  type="button"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="15" 
                    height="16" 
                    viewBox="0 0 15 16" 
                    fill="none" 
                    stroke="black"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="w-[15px] h-[16px]"
                  >
                    <path d="M14 14.75V13.25C14 12.4544 13.6488 11.6913 13.0236 11.1287C12.3985 10.5661 11.5507 10.25 10.6666 10.25H3.99996C3.1159 10.25 2.26806 10.5661 1.64294 11.1287C1.01782 11.6913 0.666626 12.4544 0.666626 13.25V14.75M10.6666 4.25C10.6666 5.90685 9.17424 7.25 7.33329 7.25C5.49234 7.25 3.99996 5.90685 3.99996 4.25C3.99996 2.59315 5.49234 1.25 7.33329 1.25C9.17424 1.25 10.6666 2.59315 10.6666 4.25Z" />
                  </svg>
                </button>
                
                <button 
                  className="focus:outline-none p-1 hover:bg-gray-100 rounded transition-colors" 
                  aria-label="Close Menu"
                  onClick={onClose}
                  type="button"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6L18 18" />
                  </svg>
                </button>
              </div>
            </motion.div>
            
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-8">
              <NavSection 
                title="Hotels" 
                links={[
                  { text: 'All Hotels', href: '/hotels' },
                  { text: 'New Hotels', href: '/hotels?filter=new' },
                  { text: 'City', href: '/categories/city-break' },
                  { text: 'Beach', href: '/categories/beach' },
                  { text: 'Mountains', href: '/categories/mountains' },
                  { text: 'Wellness', href: '/categories/spa' },
                ]}
                variants={animationVariants.itemVariants}
                onClick={onClose}
              />
              
              <NavSection 
                title="Destinations" 
                links={[
                  { text: 'Top Destinations', href: '/destinations' },
                  { text: 'Austria', href: '/destinations/austrian-alps' },
                  { text: 'South Tyrol', href: '/destinations/south-tyrol' },
                  { text: 'Germany', href: '/destinations/berlin' },
                  { text: 'France', href: '/destinations/paris' },
                  { text: 'Switzerland', href: '/destinations/swiss-alps' },
                  { text: 'Greece', href: '/destinations/greek-islands' },
                ]}
                variants={animationVariants.itemVariants}
                onClick={onClose}
              />
              
              <NavSection 
                title="Journal" 
                links={[
                  { text: 'All Articles', href: '/journal' },
                  { text: 'Destinations', href: '/journal?category=destinations' },
                  { text: 'Food', href: '/journal?category=food' },
                  { text: 'Design', href: '/journal?category=design' },
                ]}
                variants={animationVariants.itemVariants}
                onClick={onClose}
              />
              
              <NavSection 
                title="About Us" 
                links={[
                  { text: 'About CinCin Hotels', href: '/about' },
                  { text: 'Become a member', href: '/membership' },
                  { text: 'Contact Us', href: '/contact' },
                ]}
                variants={animationVariants.itemVariants}
                onClick={onClose}
              />
            </motion.div>
            
            {/* Social Media & Language Switcher - Mobile Only */}
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between"
              variants={animationVariants.itemVariants}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-6 mb-6 sm:mb-0">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-brand-olive-400 transition-colors"
                  aria-label="Visit our Instagram"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-brand-olive-400 transition-colors"
                  aria-label="Visit our Twitter"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.03 10.03 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-brand-olive-400 transition-colors"
                  aria-label="Visit our LinkedIn"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <div className="flex justify-center sm:justify-end">
                <EnhancedLanguageSwitcher />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Navigation section component used within the mobile menu
 */
function NavSection({ title, links, variants, onClick }: NavSectionProps): React.ReactElement {
  return (
    <motion.div variants={variants}>
      <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{title}</h4>
      <ul className="space-y-1 sm:space-y-2" role="menu">
        {links.map(link => (
          <motion.li key={link.href} variants={variants} role="none">
            <Link 
              href={link.href} 
              className="text-gray-700 hover:text-brand-olive-400 transition-colors text-sm sm:text-base py-1 block" 
              onClick={onClick}
              role="menuitem"
            >
              {link.text}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}