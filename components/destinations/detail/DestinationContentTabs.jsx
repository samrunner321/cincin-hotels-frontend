'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function DestinationContentTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(80);
  const sentinelRef = useRef(null);
  const tabsRef = useRef(null);
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'hotels', label: 'Hotels' },
    { id: 'dining', label: 'Dining' },
    { id: 'activities', label: 'Activities' },
    { id: 'info', label: 'Info' }
  ];
  
  // Dynamic navbar height calculation
  useEffect(() => {
    const calculateNavbarHeight = () => {
      const navbar = document.querySelector('header[class*="fixed top-0"]');
      if (navbar) {
        const height = navbar.offsetHeight;
        setNavbarHeight(height);
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };
    
    calculateNavbarHeight();
    window.addEventListener('resize', calculateNavbarHeight);
    window.addEventListener('scroll', calculateNavbarHeight);
    
    return () => {
      window.removeEventListener('resize', calculateNavbarHeight);
      window.removeEventListener('scroll', calculateNavbarHeight);
    };
  }, []);

  // CSS variables for spacing
  useEffect(() => {
    const updateTabsHeight = () => {
      if (tabsRef.current) {
        const height = tabsRef.current.offsetHeight;
        document.documentElement.style.setProperty('--content-tabs-height', `${height}px`);
        document.documentElement.style.setProperty('--total-nav-height', `${height + navbarHeight}px`);
      }
    };

    updateTabsHeight();
    window.addEventListener('resize', updateTabsHeight);
    return () => window.removeEventListener('resize', updateTabsHeight);
  }, [navbarHeight]);
  
  // IntersectionObserver for sticky behavior
  useEffect(() => {
    if (!sentinelRef.current) return;
    
    const setupObserver = () => {
      const options = {
        rootMargin: `-${navbarHeight}px 0px 0px 0px`,
        threshold: 0
      };
      
      const observer = new IntersectionObserver(([entry]) => {
        setIsSticky(!entry.isIntersecting);
      }, options);
      
      observer.observe(sentinelRef.current);
      return observer;
    };
    
    const observer = setupObserver();
    
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [navbarHeight]);
  
  // Handle scroll for active tab detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + navbarHeight + 20;
      
      const sections = tabs.map(tab => {
        const element = document.getElementById(tab.id);
        return element ? { id: tab.id, offsetTop: element.offsetTop } : null;
      }).filter(Boolean);
      
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offsetTop) {
          setActiveTab(sections[i].id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabs, navbarHeight]);
  
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    const element = document.getElementById(tabId);
    if (element) {
      const contentTabsHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--content-tabs-height').trim() || '0',
        10
      );
      
      const totalOffset = navbarHeight + contentTabsHeight;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - totalOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <>
      {/* Sentinel element */}
      <div ref={sentinelRef} className="sentinel-element h-0 w-full" />
      
      <div 
        ref={tabsRef}
        className={`content-tabs-main bg-white border-b border-gray-100 transition-all duration-300 z-[90] ${
          isSticky 
            ? 'fixed left-0 right-0 shadow-md' 
            : 'relative'
        }`}
        style={isSticky ? { top: `${navbarHeight}px` } : {}}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
          <div className="flex items-center justify-between">
            <nav className="overflow-x-auto hide-scrollbar flex space-x-2">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`py-5 px-4 md:px-6 relative whitespace-nowrap text-sm font-brooklyn transition-colors ${
                    activeTab === tab.id 
                      ? 'text-brand-olive-400 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-olive-400'
                      : 'text-gray-700 hover:text-brand-olive-400'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </nav>
            
            <a 
              href="/contact" 
              className="hidden md:block bg-brand-olive-400 text-white px-6 py-2.5 text-sm font-brooklyn rounded-full hover:bg-brand-olive-500 transition-colors shadow-sm"
            >
              Plan Your Trip
            </a>
          </div>
        </div>
      </div>
      
      {/* Spacer div */}
      {isSticky && (
        <div className="block w-full z-0" style={{ height: `${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--content-tabs-height').trim() || '0', 10)}px` }} />
      )}
    </>
  );
}