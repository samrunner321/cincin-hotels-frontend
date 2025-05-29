'use client';

import { useState, useEffect, useRef } from 'react';

export default function DestinationContentTabs({ destination }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(64);
  const contentTabsRef = useRef(null);
  const tabsPositionRef = useRef(null);
  
  const tabs = [
    { id: 'overview', label: destination?.tab_overview || 'Overview' },
    { id: 'hotels', label: destination?.tab_hotels || 'Hotels' },
    { id: 'dining', label: destination?.tab_dining || 'Dining' },
    { id: 'activities', label: destination?.tab_activities || 'Activities' }
  ];
  
  // Handle navbar height measurement and scroll events
  useEffect(() => {
    // Get the navbar element and measure its height
    const measureNavbar = () => {
      const navbar = document.querySelector('header');
      if (navbar) {
        const height = navbar.offsetHeight;
        setNavbarHeight(height);
      }
    };

    // Initial measurement
    measureNavbar();

    // Create a sentinel element to mark the original position of tabs
    const createSentinel = () => {
      if (!contentTabsRef.current) return;
      
      // Remove any existing sentinel to avoid duplicates
      const existingSentinel = document.getElementById('tabs-position-sentinel');
      if (existingSentinel) {
        existingSentinel.remove();
      }
      
      // Create a new sentinel element
      const sentinel = document.createElement('div');
      sentinel.id = 'tabs-position-sentinel';
      sentinel.style.height = '0px';
      sentinel.style.width = '100%';
      sentinel.style.position = 'relative';
      sentinel.style.visibility = 'hidden';
      
      // Insert the sentinel right before the tabs
      contentTabsRef.current.parentNode.insertBefore(sentinel, contentTabsRef.current);
      
      // Store the initial position of the sentinel
      tabsPositionRef.current = sentinel.getBoundingClientRect().top + window.scrollY;
    };
    
    createSentinel();
    
    // Store the content tabs height to ensure consistency
    if (contentTabsRef.current) {
      contentTabsRef.current.dataset.originalHeight = `${contentTabsRef.current.offsetHeight}px`;
    }
    
    // Update on resize
    window.addEventListener('resize', () => {
      measureNavbar();
      createSentinel();
    });
    
    // Create IntersectionObserver to detect when the sentinel enters/exits viewport
    const createObserver = () => {
      if (!contentTabsRef.current) return;
      
      const sentinel = document.getElementById('tabs-position-sentinel');
      if (!sentinel) return;
      
      const observerOptions = {
        rootMargin: `-${navbarHeight}px 0px 0px 0px`,
        threshold: [0, 1]
      };
      
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        
        // When the sentinel is below the navbar, make tabs sticky
        // When the sentinel is at or above the navbar, make tabs normal
        setIsSticky(!entry.isIntersecting);
      }, observerOptions);
      
      observer.observe(sentinel);
      return observer;
    };
    
    const observer = createObserver();
    
    const handleScroll = () => {
      if (!contentTabsRef.current) return;
      
      // Find which section is currently visible
      const sections = tabs.map(tab => document.getElementById(tab.id)).filter(Boolean);
      
      // Determine active section based on scroll position
      let currentSection = 'overview';
      const totalOffset = navbarHeight + (isSticky ? contentTabsRef.current.offsetHeight : 0);
      
      for (const section of sections) {
        const sectionTop = section.getBoundingClientRect().top;
        
        // Consider the section active when it's close to the bottom of the tabs
        if (sectionTop <= totalOffset + 20) {
          currentSection = section.id;
        }
      }
      
      if (currentSection !== activeTab) {
        setActiveTab(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measureNavbar);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [activeTab, tabs, navbarHeight, isSticky]);
  
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      // Calculate total offset (navbar + tabs)
      const totalOffset = navbarHeight + (contentTabsRef.current?.offsetHeight || 0);
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      
      // Scroll to element position minus the total offset
      window.scrollTo({
        top: elementPosition - totalOffset,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <>
      <div 
        id="content-tabs" 
        ref={contentTabsRef}
        className={`${
          isSticky 
            ? 'fixed' 
            : 'relative'
        } w-full z-40 bg-white border-b border-gray-200 transition-all duration-300`}
        style={{ 
          top: isSticky ? `${navbarHeight}px` : 'auto',
          left: isSticky ? '0' : 'auto',
          right: isSticky ? '0' : 'auto',
          height: isSticky && contentTabsRef.current && contentTabsRef.current.dataset.originalHeight 
            ? contentTabsRef.current.dataset.originalHeight 
            : 'auto',
          boxShadow: isSticky ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[61px]">
            <nav className="flex gap-2 overflow-x-auto hide-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    relative px-5 py-4 whitespace-nowrap text-sm font-medium
                    transition-colors duration-300
                    ${activeTab === tab.id 
                      ? 'text-[#93A27F]' 
                      : 'text-gray-600 hover:text-[#93A27F]'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-[#93A27F] transition-all duration-300"
                    />
                  )}
                </button>
              ))}
            </nav>
            
            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#93A27F] text-white rounded-md hover:bg-[#7A8861] transition-colors duration-300 text-sm font-medium">
              {destination?.tab_plan_trip || 'Plan Your Trip'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Add an invisible spacer element when fixed to maintain layout flow */}
      {isSticky && (
        <div style={{ height: contentTabsRef.current && contentTabsRef.current.dataset.originalHeight 
                      ? contentTabsRef.current.dataset.originalHeight 
                      : `${contentTabsRef.current?.offsetHeight || 0}px` }} />
      )}
    </>
  );
}