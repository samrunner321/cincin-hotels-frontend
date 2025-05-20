/**
 * BaseFeatureDisplay Component
 * 
 * A reusable component for displaying featured content in CinCin Hotels application
 * with various layout options, hover effects, and interaction patterns.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRtl } from '../../../hooks/useRtl';
import { BaseLayoutProps, BaseAnimationProps } from '../../../types/advanced-ui';

export interface FeatureItem {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
  icon?: React.ReactNode;
  cta?: {
    text: string;
    url?: string;
    onClick?: () => void;
  };
  metadata?: Record<string, any>;
}

export interface BaseFeatureDisplayProps extends BaseLayoutProps, BaseAnimationProps {
  /** Items to display */
  items: FeatureItem[];
  
  /** Display mode */
  mode?: 'grid' | 'list' | 'carousel' | 'alternating' | 'overlay';
  
  /** Number of columns for grid mode */
  columns?: number;
  
  /** Aspect ratio for images */
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2';
  
  /** Section title */
  title?: string;
  
  /** Section subtitle */
  subtitle?: string;
  
  /** Enable image change on hover */
  enableHoverEffect?: boolean;
  
  /** Enable selection on click */
  enableSelection?: boolean;
  
  /** Initial selected item index */
  initialSelectedIndex?: number;
  
  /** Callback when item is selected */
  onItemSelect?: (item: FeatureItem, index: number) => void;
  
  /** Enable scrolling to selected item */
  enableScrollToSelected?: boolean;
  
  /** Custom render function for item */
  renderItem?: (item: FeatureItem, index: number, isSelected: boolean, isHovered: boolean) => React.ReactNode;
  
  /** Custom render function for header section */
  renderHeader?: () => React.ReactNode;
  
  /** Custom render function for item image */
  renderItemImage?: (item: FeatureItem, index: number, isSelected: boolean, isHovered: boolean) => React.ReactNode;
  
  /** Custom render function for item content */
  renderItemContent?: (item: FeatureItem, index: number, isSelected: boolean, isHovered: boolean) => React.ReactNode;
  
  /** Enable responsive design adjustments */
  enableResponsive?: boolean;
}

/**
 * Calculate aspect ratio styles
 */
const getAspectRatioStyle = (aspectRatio: string): React.CSSProperties => {
  const [width, height] = aspectRatio.split(':').map(Number);
  return {
    position: 'relative',
    paddingBottom: `${(height / width) * 100}%`,
  };
};

/**
 * BaseFeatureDisplay component for showcasing featured content
 */
const BaseFeatureDisplay: React.FC<BaseFeatureDisplayProps> = ({
  items = [],
  mode = 'grid',
  columns = 3,
  aspectRatio = '16:9',
  title,
  subtitle,
  enableHoverEffect = true,
  enableSelection = false,
  initialSelectedIndex = 0,
  onItemSelect,
  enableScrollToSelected = false,
  renderItem,
  renderHeader,
  renderItemImage,
  renderItemContent,
  enableResponsive = true,
  className = '',
  style,
  id,
  visible = true,
  rtlAware = true,
  animationVariant = 'fade',
  animationDelay = 0,
  animationDuration = 500,
  animationsEnabled = true,
  reducedMotion = false,
}) => {
  // State management
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    initialSelectedIndex >= 0 && initialSelectedIndex < items.length 
      ? initialSelectedIndex 
      : 0
  );
  const [isSelectionLocked, setIsSelectionLocked] = useState<boolean>(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  // RTL support
  const { isRtl, direction, getOrderedArray } = useRtl();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0 : animationDuration / 1000,
        delay: reducedMotion ? 0 : animationDelay / 1000,
        staggerChildren: reducedMotion ? 0 : 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.5,
        delay: reducedMotion ? 0 : (custom * 0.1) + (animationDelay / 1000),
      }
    }),
  };
  
  const hoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
      }
    }
  };
  
  // Handle item hover
  const handleItemHover = useCallback((index: number | null) => {
    if (!isSelectionLocked) {
      setHoveredIndex(index);
    }
  }, [isSelectionLocked]);
  
  // Handle item selection
  const handleItemSelect = useCallback((index: number) => {
    setSelectedIndex(index);
    
    if (enableSelection) {
      setIsSelectionLocked(!isSelectionLocked);
    }
    
    if (onItemSelect && items[index]) {
      onItemSelect(items[index], index);
    }
    
    // Scroll to selected item if enabled
    if (enableScrollToSelected && itemRefs.current[index]) {
      itemRefs.current[index]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [enableSelection, isSelectionLocked, onItemSelect, items, enableScrollToSelected]);
  
  // Initialize itemRefs array for each item
  useEffect(() => {
    itemRefs.current = Array(items.length).fill(0).map(() => React.createRef<HTMLDivElement>());
  }, [items]);
  
  // Determine active index based on hover and selection
  const activeIndex = isSelectionLocked 
    ? selectedIndex 
    : hoveredIndex !== null 
      ? hoveredIndex 
      : selectedIndex;
  
  // Exit early if not visible
  if (!visible) {
    return null;
  }
  
  // Exit early if no items
  if (items.length === 0) {
    return (
      <div className={`text-center p-8 ${className}`} style={style} id={id}>
        <div className="bg-gray-100 p-8 rounded-lg">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <p className="text-gray-500">No features available</p>
        </div>
      </div>
    );
  }
  
  // Reorder items for RTL if needed
  const orderedItems = rtlAware ? getOrderedArray(items) : items;
  
  // Custom header or default
  const headerSection = renderHeader ? (
    renderHeader()
  ) : (
    (title || subtitle) && (
      <div className="mb-8 text-center">
        {title && <h2 className="text-2xl md:text-3xl font-medium mb-3">{title}</h2>}
        {subtitle && <p className="text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
      </div>
    )
  );
  
  // Render different feature display modes
  switch (mode) {
    case 'list':
      return (
        <div
          ref={containerRef}
          className={`space-y-8 ${className}`}
          style={style}
          id={id}
          dir={rtlAware ? direction : undefined}
        >
          {headerSection}
          
          <motion.div
            className="space-y-6"
            initial={animationsEnabled ? "hidden" : "visible"}
            animate={isInView && animationsEnabled ? "visible" : "visible"}
            variants={containerVariants}
          >
            {orderedItems.map((item, index) => {
              const isActive = activeIndex === index;
              const isHovered = hoveredIndex === index;
              
              // Custom render function if provided
              if (renderItem) {
                return (
                  <div 
                    key={item.id}
                    ref={itemRefs.current[index]}
                  >
                    {renderItem(item, index, isActive, isHovered)}
                  </div>
                );
              }
              
              return (
                <motion.div
                  key={item.id}
                  ref={itemRefs.current[index]}
                  custom={index}
                  variants={itemVariants}
                  whileHover={enableHoverEffect ? "hover" : undefined}
                  className={`flex flex-col md:flex-row gap-6 p-4 rounded-lg transition-colors ${
                    isActive ? 'bg-gray-50' : 'hover:bg-gray-50'
                  } cursor-pointer`}
                  onMouseEnter={() => handleItemHover(index)}
                  onMouseLeave={() => handleItemHover(null)}
                  onClick={() => handleItemSelect(index)}
                >
                  {/* Image */}
                  {(item.image || renderItemImage) && (
                    <div className="w-full md:w-1/3 rounded-lg overflow-hidden">
                      {renderItemImage ? (
                        renderItemImage(item, index, isActive, isHovered)
                      ) : (
                        <div className="relative" style={getAspectRatioStyle(aspectRatio)}>
                          <Image
                            src={item.image!}
                            alt={item.title}
                            fill
                            className="object-cover transition-all duration-300"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1">
                    {renderItemContent ? (
                      renderItemContent(item, index, isActive, isHovered)
                    ) : (
                      <>
                        <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 mb-3">{item.description}</p>
                        )}
                        {item.cta && (
                          <div className="mt-auto">
                            <a
                              href={item.cta.url || '#'}
                              onClick={(e) => {
                                if (item.cta?.onClick) {
                                  e.preventDefault();
                                  item.cta.onClick();
                                }
                              }}
                              className="text-brand-olive-500 hover:text-brand-olive-700 font-medium flex items-center gap-1"
                            >
                              {item.cta.text}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      );
      
    case 'carousel':
      return (
        <div
          ref={containerRef}
          className={`${className}`}
          style={style}
          id={id}
          dir={rtlAware ? direction : undefined}
        >
          {headerSection}
          
          <div className="relative">
            {/* Main content */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Featured image */}
              <div className={`${
                enableResponsive ? 'w-full md:w-1/2' : 'w-1/2'
              } relative rounded-lg overflow-hidden`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={animationsEnabled ? { opacity: 0, scale: 0.95 } : undefined}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: reducedMotion ? 0 : 0.3 }}
                    className="relative"
                    style={getAspectRatioStyle(aspectRatio)}
                  >
                    {renderItemImage ? (
                      renderItemImage(
                        orderedItems[activeIndex], 
                        activeIndex, 
                        activeIndex === selectedIndex,
                        activeIndex === hoveredIndex
                      )
                    ) : (
                      <Image
                        src={orderedItems[activeIndex].image || '/images/placeholder.jpg'}
                        alt={orderedItems[activeIndex].title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Item list */}
              <div className={`${
                enableResponsive ? 'w-full md:w-1/2' : 'w-1/2'
              } space-y-4`}>
                <motion.div
                  initial={animationsEnabled ? "hidden" : "visible"}
                  animate={isInView && animationsEnabled ? "visible" : "visible"}
                  variants={containerVariants}
                  className="space-y-3"
                >
                  {orderedItems.map((item, index) => {
                    const isActive = activeIndex === index;
                    const isHovered = hoveredIndex === index;
                    const isSelected = selectedIndex === index;
                    
                    return (
                      <motion.div
                        key={item.id}
                        ref={itemRefs.current[index]}
                        custom={index}
                        variants={itemVariants}
                        className={`p-4 border-l-4 cursor-pointer transition-all ${
                          isActive
                            ? 'border-brand-olive-500 bg-brand-olive-50'
                            : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => handleItemHover(index)}
                        onMouseLeave={() => handleItemHover(null)}
                        onClick={() => handleItemSelect(index)}
                      >
                        {renderItemContent ? (
                          renderItemContent(item, index, isSelected, isHovered)
                        ) : (
                          <>
                            <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                            {item.description && (
                              <p className="text-gray-600 line-clamp-2">{item.description}</p>
                            )}
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
                
                {/* Selection lock button */}
                {enableSelection && (
                  <button
                    onClick={() => setIsSelectionLocked(!isSelectionLocked)}
                    className={`mt-4 text-sm flex items-center gap-1 px-3 py-1.5 rounded-full ${
                      isSelectionLocked
                        ? 'bg-brand-olive-100 text-brand-olive-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelectionLocked ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span>Click to lock</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      
    case 'overlay':
      return (
        <div
          ref={containerRef}
          className={`${className}`}
          style={style}
          id={id}
          dir={rtlAware ? direction : undefined}
        >
          {headerSection}
          
          <div className="relative rounded-xl overflow-hidden">
            {/* Background image */}
            <div className="relative" style={{ height: '70vh', minHeight: '500px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={animationsEnabled ? { opacity: 0 } : undefined}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.5 }}
                  className="absolute inset-0"
                >
                  {renderItemImage ? (
                    renderItemImage(
                      orderedItems[activeIndex], 
                      activeIndex, 
                      activeIndex === selectedIndex,
                      activeIndex === hoveredIndex
                    )
                  ) : (
                    <Image
                      src={orderedItems[activeIndex].image || '/images/placeholder.jpg'}
                      alt={orderedItems[activeIndex].title}
                      fill
                      className="object-cover"
                    />
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/70" />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Content overlay */}
            <motion.div
              initial={animationsEnabled ? "hidden" : "visible"}
              animate={isInView && animationsEnabled ? "visible" : "visible"}
              variants={containerVariants}
              className="absolute bottom-0 left-0 right-0 p-8"
            >
              {/* Featured item content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={animationsEnabled ? { opacity: 0, y: 20 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  className="text-white mb-8"
                >
                  {renderItemContent ? (
                    renderItemContent(
                      orderedItems[activeIndex], 
                      activeIndex, 
                      activeIndex === selectedIndex,
                      activeIndex === hoveredIndex
                    )
                  ) : (
                    <>
                      <h3 className="text-2xl md:text-3xl font-medium mb-2">
                        {orderedItems[activeIndex].title}
                      </h3>
                      {orderedItems[activeIndex].description && (
                        <p className="text-white/90 max-w-2xl">
                          {orderedItems[activeIndex].description}
                        </p>
                      )}
                      {orderedItems[activeIndex].cta && (
                        <a
                          href={orderedItems[activeIndex].cta.url || '#'}
                          onClick={(e) => {
                            if (orderedItems[activeIndex].cta?.onClick) {
                              e.preventDefault();
                              orderedItems[activeIndex].cta?.onClick?.();
                            }
                          }}
                          className="inline-flex items-center gap-1 mt-4 text-white hover:text-gray-200 border-b border-white/50 hover:border-white pb-1"
                        >
                          {orderedItems[activeIndex].cta.text}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation dots */}
              <div className="flex items-center justify-center gap-2">
                {orderedItems.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeIndex === index
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    onClick={() => handleItemSelect(index)}
                    onMouseEnter={() => handleItemHover(index)}
                    onMouseLeave={() => handleItemHover(null)}
                    aria-label={`View feature ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      );
      
    case 'alternating':
      return (
        <div
          ref={containerRef}
          className={`space-y-16 ${className}`}
          style={style}
          id={id}
          dir={rtlAware ? direction : undefined}
        >
          {headerSection}
          
          <motion.div
            initial={animationsEnabled ? "hidden" : "visible"}
            animate={isInView && animationsEnabled ? "visible" : "visible"}
            variants={containerVariants}
          >
            {orderedItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const isActive = activeIndex === index;
              const isHovered = hoveredIndex === index;
              
              // Custom render function if provided
              if (renderItem) {
                return (
                  <div 
                    key={item.id}
                    ref={itemRefs.current[index]}
                    className={index !== 0 ? 'mt-16' : ''}
                  >
                    {renderItem(item, index, isActive, isHovered)}
                  </div>
                );
              }
              
              // RTL-aware layout direction
              const imageOnLeft = isRtl ? !isEven : isEven;
              
              return (
                <motion.div
                  key={item.id}
                  ref={itemRefs.current[index]}
                  custom={index}
                  variants={itemVariants}
                  className={`flex flex-col ${
                    enableResponsive ? 'md:flex-row' : 'flex-row'
                  } items-center gap-8 ${index !== 0 ? 'mt-16' : ''}`}
                  onMouseEnter={() => handleItemHover(index)}
                  onMouseLeave={() => handleItemHover(null)}
                >
                  {/* Image */}
                  <div className={`w-full ${
                    enableResponsive ? 'md:w-1/2' : 'w-1/2'
                  } order-1 ${imageOnLeft ? '' : 'md:order-2'}`}>
                    {renderItemImage ? (
                      renderItemImage(item, index, isActive, isHovered)
                    ) : (
                      item.image && (
                        <motion.div
                          className="rounded-lg overflow-hidden"
                          whileHover={enableHoverEffect ? hoverVariants.hover : undefined}
                        >
                          <div className="relative" style={getAspectRatioStyle(aspectRatio)}>
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className={`w-full ${
                    enableResponsive ? 'md:w-1/2' : 'w-1/2'
                  } order-2 ${imageOnLeft ? '' : 'md:order-1'}`}>
                    {renderItemContent ? (
                      renderItemContent(item, index, isActive, isHovered)
                    ) : (
                      <div>
                        {item.icon && (
                          <div className="mb-4 text-brand-olive-500">
                            {item.icon}
                          </div>
                        )}
                        <h3 className="text-2xl font-medium mb-3">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 mb-4">{item.description}</p>
                        )}
                        {item.cta && (
                          <div>
                            <a
                              href={item.cta.url || '#'}
                              onClick={(e) => {
                                if (item.cta?.onClick) {
                                  e.preventDefault();
                                  item.cta.onClick();
                                }
                              }}
                              className="text-brand-olive-500 hover:text-brand-olive-700 font-medium flex items-center gap-1"
                            >
                              {item.cta.text}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      );
    
    // Default grid mode
    case 'grid':
    default:
      return (
        <div
          ref={containerRef}
          className={`${className}`}
          style={style}
          id={id}
          dir={rtlAware ? direction : undefined}
        >
          {headerSection}
          
          <motion.div
            className={`grid grid-cols-1 ${
              enableResponsive
                ? `sm:grid-cols-2 lg:grid-cols-${columns}`
                : `grid-cols-${columns}`
            } gap-6`}
            initial={animationsEnabled ? "hidden" : "visible"}
            animate={isInView && animationsEnabled ? "visible" : "visible"}
            variants={containerVariants}
          >
            {orderedItems.map((item, index) => {
              const isActive = activeIndex === index;
              const isHovered = hoveredIndex === index;
              
              // Custom render function if provided
              if (renderItem) {
                return (
                  <div 
                    key={item.id}
                    ref={itemRefs.current[index]}
                  >
                    {renderItem(item, index, isActive, isHovered)}
                  </div>
                );
              }
              
              return (
                <motion.div
                  key={item.id}
                  ref={itemRefs.current[index]}
                  custom={index}
                  variants={itemVariants}
                  whileHover={enableHoverEffect ? "hover" : undefined}
                  className={`flex flex-col overflow-hidden rounded-lg ${
                    enableSelection ? 'cursor-pointer' : ''
                  } border border-gray-200 transition-all hover:shadow-md`}
                  onMouseEnter={() => handleItemHover(index)}
                  onMouseLeave={() => handleItemHover(null)}
                  onClick={() => enableSelection && handleItemSelect(index)}
                >
                  {/* Image */}
                  {(item.image || renderItemImage) && (
                    <div className="relative" style={getAspectRatioStyle(aspectRatio)}>
                      {renderItemImage ? (
                        renderItemImage(item, index, isActive, isHovered)
                      ) : (
                        <Image
                          src={item.image!}
                          alt={item.title}
                          fill
                          className="object-cover transition-all duration-300"
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex flex-col p-5">
                    {renderItemContent ? (
                      renderItemContent(item, index, isActive, isHovered)
                    ) : (
                      <>
                        {item.icon && (
                          <div className="mb-3 text-brand-olive-500">
                            {item.icon}
                          </div>
                        )}
                        <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 mb-4 text-sm line-clamp-3">{item.description}</p>
                        )}
                        {item.cta && (
                          <div className="mt-auto pt-3">
                            <a
                              href={item.cta.url || '#'}
                              onClick={(e) => {
                                if (item.cta?.onClick) {
                                  e.preventDefault();
                                  item.cta.onClick();
                                }
                              }}
                              className="text-brand-olive-500 hover:text-brand-olive-700 text-sm font-medium flex items-center gap-1"
                            >
                              {item.cta.text}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      );
  }
};

export default BaseFeatureDisplay;