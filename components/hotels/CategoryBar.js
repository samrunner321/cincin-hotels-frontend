'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

// Kategorie-Icons
const CategoryIcons = {
  'adults-only': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-15c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3 6v2h6v-2h-1.02c-.38 0-.72-.2-.89-.52-.17-.3-.35-.7-.54-1.22-.1-.28-.37-.48-.67-.48h-1.76c-.3 0-.57.2-.68.49-.18.52-.36.91-.53 1.21-.17.32-.51.52-.89.52H9z"/>
    </svg>
  ),
  'fine-dining': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20v1h12v-1l-1.5-1c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zm0 2c3.51 0 5.5.46 6.21 1H5.79c.71-.54 2.7-1 6.21-1zm5.5 5H14v5h-4v-5H6.5v-.5h11v.5z"/>
    </svg>
  ),
  'beach': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21zm4.293-5.73l2.86-2.86c-3.95-3.95-10.35-3.96-14.3-.02 3.93-1.3 8.31-.25 11.44 2.88zM5.95 5.98c-3.94 3.95-3.93 10.35.02 14.3l2.86-2.86C5.7 14.29 4.65 9.91 5.95 5.98zm.02-.02l-.01.01c-.38 3.01 1.17 6.88 4.3 10.02l5.73-5.73c-3.13-3.13-7.01-4.68-10.02-4.3z"/>
    </svg>
  ),
  'spa': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63zm-3.44 4.44c-1.31-1.6-3.04-2.81-4.96-3.63C7.09 8.99 7 7.52 7 6c-3.35 2-5 5.71-5 9.5 0 2.19.89 4.11 2.3 5.5 2.82-3.4 6.3-5.5 8.7-7.43-.05-.26-.19-.47-.19-.51-.54.17-1.23.33-1.45.33.17-.46.55-1.39 1.51-2.29.33-.33.7-.59 1.16-.77l-.81-.66c-.94.86-1.93 1.82-3.17 2.87z"/>
    </svg>
  ),
  'mountains': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z"/>
    </svg>
  ),
  'city-break': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
    </svg>
  ),
  'family': ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 17v-5h1.11c.68 0 1.16-.67.95-1.32l-2.1-6.31C19.68 7.58 18.92 7 18.06 7h-.12c-.86 0-1.63.58-1.89 1.37l-.86 2.58c1.08.6 1.81 1.73 1.81 3.05v8h3zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 8.17 11 9s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 15v-6H8c.55 0 1-.45 1-1V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v5c0 .55.45 1 1 1h.5v6h4zm5.5 0v-4h1v-4c0-.82-.68-1.5-1.5-1.5h-2c-.82 0-1.5.68-1.5 1.5v4h1v4h3z"/>
    </svg>
  )
};

export default function CategoryBar({ 
  categories = [], // Changed from null to empty array to match expected type
  activeCategory = null,
  onCategoryClick = () => {},
  title = null // Titel versteckt im neuen Design
}) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollContainerRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Voreingestellte Kategorien
  const defaultCategories = [
    { id: 'adults-only', name: 'adults only', url: '/categories/adults-only' },
    { id: 'fine-dining', name: 'fine dining', url: '/categories/fine-dining' },
    { id: 'beach', name: 'beach', url: '/categories/beach' },
    { id: 'spa', name: 'spa', url: '/categories/spa' },
    { id: 'mountains', name: 'mountains', url: '/categories/mountains' },
    { id: 'city-break', name: 'city break', url: '/categories/city-break' },
    { id: 'family', name: 'family', url: '/categories/family' }
  ];

  const categoriesToUse = categories && categories.length > 0 ? categories : defaultCategories;
  
  // Scroll-Logik
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      setShowScrollButtons(scrollWidth > clientWidth);
    };
    
    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, []);
  
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
    
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };
  
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };
  
  const getIsActive = (categoryId) => {
    if (activeCategory) {
      return activeCategory === categoryId;
    }
    
    return pathname?.includes(`/categories/${categoryId}`);
  };

  return (
    <section className="py-6 sm:py-8 md:py-10 flex justify-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        {title && (
          <h2 className="text-lg font-medium text-gray-900 mb-4 sr-only">
            {title}
          </h2>
        )}
        
        <div className="relative">
          {/* Scroll-Buttons (nur angezeigt, wenn nötig) */}
          {showScrollButtons && (
            <>
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`
                  absolute left-0 top-1/2 transform -translate-y-1/2 z-10
                  w-10 h-10 flex items-center justify-center rounded-full
                  bg-white shadow-sm focus:outline-none
                  ${!canScrollLeft ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-brand-olive-50'}
                  transition-opacity duration-300
                `}
                aria-label="Scroll categories left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`
                  absolute right-0 top-1/2 transform -translate-y-1/2 z-10
                  w-10 h-10 flex items-center justify-center rounded-full
                  bg-white shadow-sm focus:outline-none
                  ${!canScrollRight ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-brand-olive-50'}
                  transition-opacity duration-300
                `}
                aria-label="Scroll categories right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
          
          {/* Kategorien-Scrollbar */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center justify-center space-x-10 overflow-x-auto pb-2 scrollbar-none"
            role="navigation"
            aria-label="Hotel categories"
            onScroll={handleScroll}
          >
            {categoriesToUse.map((category) => (
              <Link 
                key={category.id}
                href={category.url}
                className="flex flex-col items-center justify-center min-w-[80px] transition-all text-center hover:text-brand-olive-400"
                onClick={() => onCategoryClick(category)}
                aria-label={`Browse ${category.name} hotels`}
                aria-current={getIsActive(category.id) ? 'page' : undefined}
              >
                <div className="mb-2 w-12 h-12 flex items-center justify-center text-black mx-auto">
                  {CategoryIcons[category.id]?.({ className: "w-8 h-8" })}
                </div>
                <span className="text-sm font-brooklyn text-center w-full">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}