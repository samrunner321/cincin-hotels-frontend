'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { useEnhancedTranslations } from '../../../components/i18n/EnhancedTranslationsProvider';
import { rtlFlipClasses } from '../../../utils/rtl-utils';

/**
 * Navigation link interface
 */
export interface NavItem {
  /** Display text for the navigation item */
  text: string;
  /** URL the navigation item links to */
  href: string;
  /** If true, renders as a button rather than a link */
  isButton?: boolean;
  /** Icon component to display next to text (optional) */
  icon?: React.ReactNode;
  /** Additional CSS classes for this specific link */
  className?: string;
  /** Additional child items for dropdown menus */
  children?: NavItem[];
}

/**
 * BaseNavigation component props
 */
export interface BaseNavigationProps {
  /** Collection of navigation items to display */
  items: NavItem[];
  /** Layout type for the navigation */
  layout?: 'horizontal' | 'vertical' | 'drawer';
  /** Whether to include a mobile dropdown/drawer */
  mobileMenu?: boolean;
  /** Breakpoint at which to switch from mobile to desktop layout */
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Custom logo component (for example, an image) */
  logo?: React.ReactNode;
  /** URL the logo should link to (defaults to '/') */
  logoHref?: string;
  /** Position of the navigation bar */
  position?: 'static' | 'fixed' | 'sticky';
  /** If true, navigation bar starts transparent and becomes solid on scroll */
  transparent?: boolean;
  /** Background color when not transparent or on scroll */
  bgColor?: 'white' | 'light' | 'dark' | 'primary' | 'none';
  /** Text color for navigation items */
  textColor?: 'white' | 'gray' | 'black' | 'primary';
  /** Additional CSS classes */
  className?: string;
  /** If true, collapses all menus when an item is clicked */
  collapseOnClick?: boolean;
  /** Custom mobile menu trigger (hamburger icon, etc.) */
  mobileMenuTrigger?: React.ReactNode;
  /** Custom animation variants for menu transitions */
  animationVariants?: {
    logoVariants?: any;
    navItemVariants?: any;
    mobileMenuVariants?: any;
  };
}

/**
 * BaseNavigation - A flexible, reusable navigation component
 * 
 * This component handles responsive navigation with horizontal, vertical, and drawer layouts,
 * transparency on scroll, dropdown menus, and animated transitions.
 */
export default function BaseNavigation({
  items = [],
  layout = 'horizontal',
  mobileMenu = true,
  breakpoint = 'lg',
  logo,
  logoHref = '/',
  position = 'fixed',
  transparent = false,
  bgColor = 'white',
  textColor = 'gray',
  className = '',
  collapseOnClick = true,
  mobileMenuTrigger,
  animationVariants,
}: BaseNavigationProps): React.ReactElement {
  // Get RTL direction from context
  const { isRtl, direction } = useEnhancedTranslations();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(!transparent);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll events for transparent navigation
  useEffect(() => {
    if (!transparent) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Toggle dropdown menu
  const toggleDropdown = (href: string) => {
    setActiveDropdown(activeDropdown === href ? null : href);
  };

  // Handler for navigation item click
  const handleNavItemClick = () => {
    if (collapseOnClick) {
      closeMobileMenu();
    }
  };

  // Default animation variants if none provided with RTL support
  const defaultAnimationVariants = {
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
    },
    mobileMenuVariants: {
      hidden: { opacity: 0, x: isRtl ? '-100%' : '100%' },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          type: 'spring',
          damping: 25,
          stiffness: 300
        }
      },
      exit: { 
        opacity: 0, 
        x: isRtl ? '-100%' : '100%',
        transition: { 
          type: 'spring',
          damping: 25,
          stiffness: 300
        }
      }
    },
  };

  // Merge default animation variants with provided ones
  const mergedAnimationVariants = {
    logoVariants: animationVariants?.logoVariants || defaultAnimationVariants.logoVariants,
    navItemVariants: animationVariants?.navItemVariants || defaultAnimationVariants.navItemVariants,
    mobileMenuVariants: animationVariants?.mobileMenuVariants || defaultAnimationVariants.mobileMenuVariants,
  };

  // Background color classes
  const getBgColorClass = () => {
    if (!isScrolled && transparent) return 'bg-transparent';
    switch(bgColor) {
      case 'white': return 'bg-white';
      case 'light': return 'bg-gray-50';
      case 'dark': return 'bg-gray-900';
      case 'primary': return 'bg-brand-olive-600';
      case 'none': return '';
      default: return 'bg-white';
    }
  };

  // Text color classes
  const getTextColorClass = (isActive = false) => {
    if (!isScrolled && transparent) return 'text-white hover:text-gray-200';
    
    switch(textColor) {
      case 'white': return isActive ? 'text-gray-100 hover:text-white' : 'text-white hover:text-gray-200';
      case 'gray': return isActive ? 'text-gray-900 hover:text-black' : 'text-gray-700 hover:text-gray-900';
      case 'black': return isActive ? 'text-black hover:text-gray-800' : 'text-gray-800 hover:text-black';
      case 'primary': return isActive ? 'text-brand-olive-700 hover:text-brand-olive-800' : 'text-brand-olive-600 hover:text-brand-olive-700';
      default: return isActive ? 'text-gray-900 hover:text-black' : 'text-gray-700 hover:text-gray-900';
    }
  };

  // Position classes with RTL support
  const getPositionClass = () => {
    switch(position) {
      case 'fixed': return `fixed top-0 ${isRtl ? 'right-0 left-0' : 'left-0 right-0'}`;
      case 'sticky': return 'sticky top-0';
      case 'static': return 'static';
      default: return `fixed top-0 ${isRtl ? 'right-0 left-0' : 'left-0 right-0'}`;
    }
  };

  // Transition classes
  const transitionClass = 'transition-all duration-300';

  // Render a navigation item
  const renderNavItem = (item: NavItem, index: number, isMobile: boolean = false) => {
    // Check if item has children (dropdown)
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeDropdown === item.href;

    if (item.isButton) {
      return (
        <motion.li 
          key={item.href} 
          custom={index} 
          variants={mergedAnimationVariants.navItemVariants} 
          initial={isMobile ? false : "hidden"} 
          animate="visible"
          className={cn(
            'inline-block',
            isMobile ? 'w-full mb-2' : '',
            item.className
          )}
        >
          <Link
            href={item.href}
            className={cn(
              'px-4 py-2 rounded-md bg-brand-olive-600 text-white hover:bg-brand-olive-700 transition-colors',
              'inline-flex items-center space-x-2',
              'focus:outline-none focus:ring-2 focus:ring-brand-olive-400 focus:ring-opacity-50',
              isMobile ? 'w-full justify-center' : '',
              item.className
            )}
            onClick={handleNavItemClick}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.text}</span>
          </Link>
        </motion.li>
      );
    }

    return (
      <motion.li 
        key={item.href} 
        custom={index} 
        variants={mergedAnimationVariants.navItemVariants} 
        initial={isMobile ? false : "hidden"} 
        animate="visible"
        className={cn(
          isMobile ? 'block w-full' : 'relative',
          item.className
        )}
      >
        {hasChildren ? (
          <div className="relative">
            <button
              onClick={() => toggleDropdown(item.href)}
              className={cn(
                'flex items-center space-x-1 p-2 rounded-md',
                getTextColorClass(isActive),
                'focus:outline-none focus:ring-2 focus:ring-brand-olive-400 focus:ring-opacity-50',
                isMobile ? 'w-full justify-between px-4 py-3 border-b border-gray-100' : '',
                item.className
              )}
              aria-expanded={isActive}
              aria-controls={`dropdown-${item.href}`}
            >
              {item.icon && <span className={isRtl ? "ml-2" : "mr-2"}>{item.icon}</span>}
              <span>{item.text}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={cn(
                  'transition-transform',
                  isActive ? 'transform rotate-180' : ''
                )}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <AnimatePresence>
              {isActive && (
                <motion.div
                  id={`dropdown-${item.href}`}
                  className={cn(
                    'bg-white shadow-lg rounded-md overflow-hidden',
                    'text-gray-700',
                    isMobile ? 'w-full' : cn(
                      'absolute mt-2 min-w-[200px] z-10',
                      isRtl ? 'right-0' : 'left-0'
                    )
                  )}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className={isMobile ? 'pl-4' : 'py-2'}>
                    {item.children?.map((child, childIndex) => (
                      <li key={child.href} className={isMobile ? 'border-b border-gray-50' : ''}>
                        <Link
                          href={child.href}
                          className={cn(
                            'block px-4 py-2 hover:bg-gray-50',
                            getTextColorClass(),
                            'transition-colors',
                            child.className
                          )}
                          onClick={handleNavItemClick}
                        >
                          {child.icon && <span className={isRtl ? "ml-2" : "mr-2"}>{child.icon}</span>}
                          {child.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href={item.href}
            className={cn(
              'flex items-center space-x-1 p-2 rounded-md',
              getTextColorClass(),
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand-olive-400 focus:ring-opacity-50',
              isMobile ? 'w-full block px-4 py-3 border-b border-gray-100' : '',
              item.className
            )}
            onClick={handleNavItemClick}
          >
            {item.icon && <span className={isRtl ? "ml-2" : "mr-2"}>{item.icon}</span>}
            <span>{item.text}</span>
          </Link>
        )}
      </motion.li>
    );
  };

  // Determine mobile breakpoint class
  const breakpointClass = `hidden ${breakpoint}:flex`;
  const mobileBreakpointClass = `${breakpoint}:hidden flex`;

  return (
    <header 
      className={cn(
        getPositionClass(),
        getBgColorClass(),
        transitionClass,
        'w-full z-50',
        isScrolled ? 'shadow-md' : 'pt-4',
        className
      )}
      role="banner"
      dir={direction}
    >
      <div 
        className={cn(
          'container mx-auto px-4 sm:px-6 lg:px-8',
          'flex justify-between items-center',
          isScrolled ? 'py-4' : 'py-6'
        )}
      >
        {/* Logo */}
        <motion.div 
          className="flex items-center" 
          initial="hidden"
          animate="visible"
          variants={mergedAnimationVariants.logoVariants}
        >
          <Link href={logoHref} aria-label="Home" className="focus:outline-none">
            {logo || <span className="text-xl font-semibold">Logo</span>}
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        {layout === 'horizontal' && (
          <nav className={cn(
            'items-center',
            breakpointClass
          )} aria-label="Main Navigation">
            <ul className={cn(
              'flex items-center',
              isRtl ? 'space-x-reverse space-x-1 xl:space-x-reverse xl:space-x-4' : 'space-x-1 xl:space-x-4'
            )}>
              {items.map((item, index) => renderNavItem(item, index))}
            </ul>
          </nav>
        )}
        
        {/* Mobile Menu Button */}
        {mobileMenu && (
          <div className={mobileBreakpointClass}>
            <button 
              className={cn(
                'focus:outline-none focus:ring-2 focus:ring-brand-olive-400 rounded-full p-2',
                'flex items-center justify-center'
              )}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              onClick={toggleMobileMenu}
              type="button"
            >
              {mobileMenuTrigger || (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={!isScrolled && transparent ? "white" : "currentColor"}
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  {isMobileMenuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  )}
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && mobileMenu && (
          <motion.div
            id="mobile-navigation-menu"
            className={cn(
              'fixed inset-y-0 z-50',
              isRtl ? 'left-0' : 'right-0',
              'w-full sm:max-w-sm',
              'bg-white shadow-xl',
              'flex flex-col'
            )}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mergedAnimationVariants.mobileMenuVariants}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <span className="text-lg font-medium">Menu</span>
              <button
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-olive-400"
                aria-label="Close Menu"
                onClick={closeMobileMenu}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile Navigation">
              <ul className="space-y-1">
                {items.map((item, index) => renderNavItem(item, index, true))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}