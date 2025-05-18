'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ContentTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(80); // Initialer Wert mit neuer Höhe
  const sentinelRef = useRef(null);
  const tabsRef = useRef(null);
  const pathname = usePathname();
  const isRoomsPage = pathname.includes('/rooms');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'rooms', label: 'Room & Rates' },
    { id: 'originals', label: 'The Originals' }
  ];
  
  // Dynamische Berechnung der Navbar-Höhe
  useEffect(() => {
    const calculateNavbarHeight = () => {
      // Navbar-Element anhand der Klasse finden
      const navbar = document.querySelector('header[class*="fixed top-0"]');
      if (navbar) {
        // Tatsächliche Höhe der Navbar messen
        const height = navbar.offsetHeight;
        setNavbarHeight(height);
        // CSS-Variable setzen für Verwendung in anderen Komponenten
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };
    
    // Initialer Aufruf
    calculateNavbarHeight();
    
    // Bei Window-Resize aktualisieren
    window.addEventListener('resize', calculateNavbarHeight);
    
    // Zusätzlicher Listener für Scroll-Events, da sich die Navbar-Höhe beim Scrollen ändern kann
    window.addEventListener('scroll', calculateNavbarHeight);
    
    return () => {
      window.removeEventListener('resize', calculateNavbarHeight);
      window.removeEventListener('scroll', calculateNavbarHeight);
    };
  }, []);

  // Set CSS variables for spacing calculations
  useEffect(() => {
    // Set the CSS variable for the content tabs height
    const updateTabsHeight = () => {
      if (tabsRef.current) {
        const height = tabsRef.current.offsetHeight;
        document.documentElement.style.setProperty('--content-tabs-height', `${height}px`);
        document.documentElement.style.setProperty('--total-nav-height', `${height + navbarHeight}px`);
      }
    };

    // Initial calculation
    updateTabsHeight();
    
    // Update on resize
    window.addEventListener('resize', updateTabsHeight);
    return () => window.removeEventListener('resize', updateTabsHeight);
  }, [navbarHeight]);
  
  // Setup IntersectionObserver to monitor when the sentinel element hits the viewport top
  useEffect(() => {
    // Check if we're on the rooms page and set active tab accordingly
    if (isRoomsPage) {
      setActiveTab('rooms');
    }
    
    if (!sentinelRef.current) return;
    
    // Observer-Funktion, die bei jeder Änderung neu erstellt wird
    const setupObserver = () => {
      // Aktuelle Navbar-Höhe für rootMargin verwenden
      const options = {
        rootMargin: `-${navbarHeight}px 0px 0px 0px`,
        threshold: 0
      };
      
      const observer = new IntersectionObserver(([entry]) => {
        // When sentinel is not intersecting, it's scrolled out of view -> make tabs sticky
        setIsSticky(!entry.isIntersecting);
      }, options);
      
      observer.observe(sentinelRef.current);
      
      return observer;
    };
    
    // Observer initial einrichten
    const observer = setupObserver();
    
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [isRoomsPage, navbarHeight]);
  
  // Handle scroll for active tab detection
  useEffect(() => {
    const handleScroll = () => {
      // Dynamische Navbar-Höhe plus etwas Puffer für bessere Erkennung
      const scrollPosition = window.scrollY + navbarHeight + 20;
      
      // Get all section elements
      const sections = tabs.map(tab => {
        const element = document.getElementById(tab.id);
        return element ? { id: tab.id, offsetTop: element.offsetTop } : null;
      }).filter(Boolean);
      
      // Find the section we're currently scrolled to
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
    
    // If we're on the rooms page and click a different tab, navigate back to main page
    if (isRoomsPage && tabId !== 'rooms') {
      window.location.href = `${pathname.split('/rooms')[0]}#${tabId}`;
      return;
    }
    
    // Scroll to corresponding section
    const element = document.getElementById(tabId);
    if (element) {
      // Get the current content tabs height from CSS variable
      const contentTabsHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--content-tabs-height').trim() || '0',
        10
      );
      
      // Calculate correct offset using the current navbar height
      const totalOffset = navbarHeight + contentTabsHeight;
      
      // Calculate position
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - totalOffset;
      
      // Smooth scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <>
      {/* Sentinel element to detect when tabs should become sticky */}
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
          <div className="flex justify-between items-center">
            <nav className="overflow-x-auto hide-scrollbar flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`py-5 px-6 relative whitespace-nowrap text-sm font-brooklyn transition-colors ${
                    activeTab === tab.id 
                      ? 'text-brand-olive-400 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-olive-400'
                      : 'text-gray-700 hover:text-brand-olive-400'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            
            <button className="bg-brand-olive-400 text-white px-6 py-2.5 text-sm font-brooklyn rounded-full hover:bg-brand-olive-500 transition-colors shadow-sm">
              Book Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Spacer div to prevent content jump when tabs become fixed */}
      {isSticky && (
        <div className="block w-full z-0" style={{ height: `${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--content-tabs-height').trim() || '0', 10)}px` }} />
      )}
    </>
  );
}