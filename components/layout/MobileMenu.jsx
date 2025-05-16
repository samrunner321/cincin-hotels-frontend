'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileMenu({ isOpen, onClose }) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Animation variants
  const menuVariants = {
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
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { y: 20, opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-white z-50 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
        >
          <div className="container mx-auto px-4 py-6">
            <motion.div 
              className="flex justify-between items-center mb-8"
              variants={itemVariants}
            >
              <Link href="/" onClick={onClose} aria-label="CinCin Hotels Home">
                <Image 
                  src="/images/logo/logo-dark.png" 
                  alt="CinCin Hotels" 
                  width={143} 
                  height={35} 
                  className="h-[35px] w-auto"
                />
              </Link>
              
              <div className="flex items-center space-x-4">
                <button className="focus:outline-none" aria-label="User Profile">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="15" 
                    height="16" 
                    viewBox="0 0 15 16" 
                    fill="none" 
                    stroke="black"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M14 14.75V13.25C14 12.4544 13.6488 11.6913 13.0236 11.1287C12.3985 10.5661 11.5507 10.25 10.6666 10.25H3.99996C3.1159 10.25 2.26806 10.5661 1.64294 11.1287C1.01782 11.6913 0.666626 12.4544 0.666626 13.25V14.75M10.6666 4.25C10.6666 5.90685 9.17424 7.25 7.33329 7.25C5.49234 7.25 3.99996 5.90685 3.99996 4.25C3.99996 2.59315 5.49234 1.25 7.33329 1.25C9.17424 1.25 10.6666 2.59315 10.6666 4.25Z" />
                  </svg>
                </button>
                
                <button 
                  className="focus:outline-none" 
                  aria-label="Close Menu"
                  onClick={onClose}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6L18 18" />
                  </svg>
                </button>
              </div>
            </motion.div>
            
            <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                variants={itemVariants}
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
                variants={itemVariants}
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
                variants={itemVariants}
                onClick={onClose}
              />
              
              <NavSection 
                title="About Us" 
                links={[
                  { text: 'About CinCin Hotels', href: '/about' },
                  { text: 'Become a member', href: '/membership' },
                  { text: 'Contact Us', href: '/contact' },
                ]}
                variants={itemVariants}
                onClick={onClose}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavSection({ title, links, variants, onClick }) {
  return (
    <motion.div variants={variants}>
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map(link => (
          <motion.li key={link.href} variants={variants}>
            <Link 
              href={link.href} 
              className="text-gray-700 hover:text-brand-blue-600 transition-colors" 
              onClick={onClick}
            >
              {link.text}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}