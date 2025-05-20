'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Interface for an optional error object
 */
export interface ListError {
  message: string;
  code?: string;
}

/**
 * Interface for list pagination
 */
export interface ListPagination {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Sorting options interface
 */
export interface SortOption {
  label: string;
  value: string;
  direction?: 'asc' | 'desc';
}

/**
 * BaseList props interface
 */
export interface BaseListProps<T> {
  /** The items to display in the list */
  items: T[];
  /** A render function to display each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** A function to get a unique key for each item */
  getItemKey: (item: T) => string | number;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: ListError | null;
  /** Empty state message */
  emptyMessage?: string;
  /** List title */
  title?: string;
  /** List description */
  description?: string;
  /** View modes, default is ['grid'] */
  viewModes?: ('grid' | 'list' | 'table' | 'map')[];
  /** Default view mode */
  defaultViewMode?: 'grid' | 'list' | 'table' | 'map';
  /** Animation delay between items (in seconds) */
  animationDelay?: number;
  /** Pagination config */
  pagination?: ListPagination;
  /** Available sort options */
  sortOptions?: SortOption[];
  /** Default sort option */
  defaultSort?: string;
  /** Handler for sort change */
  onSortChange?: (sortOption: SortOption) => void;
  /** CSS Grid columns for grid view (tailwind classes) */
  gridCols?: {
    default: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  /** Allow users to select items */
  selectable?: boolean;
  /** Handler for selected item changes */
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Custom empty component */
  emptyComponent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Additional CSS classes for the container */
  containerClassName?: string;
  /** Handler for item click */
  onItemClick?: (item: T) => void;
  /** Custom animation variants */
  animationVariants?: any;
  /** Include a search bar */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Current search query */
  searchQuery?: string;
}

/**
 * BaseList - A versatile, reusable list component
 * 
 * This component supports multiple view modes, pagination, sorting, selection,
 * and animations. It renders lists of items with loading, error, and empty states.
 */
export default function BaseList<T>({
  items = [],
  renderItem,
  getItemKey,
  isLoading = false,
  error = null,
  emptyMessage = "No items found",
  title,
  description,
  viewModes = ['grid'],
  defaultViewMode = 'grid',
  animationDelay = 0.05,
  pagination,
  sortOptions,
  defaultSort,
  onSortChange,
  gridCols = {
    default: 'grid-cols-1',
    sm: 'sm:grid-cols-2',
    md: 'md:grid-cols-2',
    lg: 'lg:grid-cols-3',
    xl: 'xl:grid-cols-4',
  },
  selectable = false,
  onSelectionChange,
  loadingComponent,
  errorComponent,
  emptyComponent,
  className = '',
  containerClassName = '',
  onItemClick,
  animationVariants,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  searchQuery = '',
}: BaseListProps<T>): JSX.Element {
  // State for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table' | 'map'>(defaultViewMode);
  
  // State for selected items
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  
  // State for internal search query (if not controlled externally)
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>(searchQuery);
  
  // State for current sort
  const [currentSort, setCurrentSort] = useState<string>(defaultSort || (sortOptions && sortOptions.length > 0 ? sortOptions[0].value : ''));

  // Default animation variants
  const defaultAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * animationDelay,
        duration: 0.3,
        ease: 'easeOut'
      }
    }),
  };

  // Use provided animation variants or default
  const itemVariants = animationVariants || defaultAnimationVariants;

  // Effect to notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedKeys);
    }
  }, [selectedKeys, onSelectionChange]);

  // Handler for view mode change
  const handleViewChange = (mode: 'grid' | 'list' | 'table' | 'map') => {
    setViewMode(mode);
  };

  // Handler for item selection
  const handleItemSelect = (key: string | number) => {
    if (selectable) {
      setSelectedKeys(prev => {
        const isSelected = prev.includes(key);
        if (isSelected) {
          return prev.filter(k => k !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  // Handler for select all toggle
  const handleSelectAll = () => {
    if (selectable) {
      if (selectedKeys.length === items.length) {
        setSelectedKeys([]);
      } else {
        setSelectedKeys(items.map(getItemKey));
      }
    }
  };

  // Handler for sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setCurrentSort(sortValue);
    
    if (onSortChange && sortOptions) {
      const selectedSort = sortOptions.find(option => option.value === sortValue);
      if (selectedSort) {
        onSortChange(selectedSort);
      }
    }
  };

  // Handler for search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInternalSearchQuery(query);
    
    if (onSearch) {
      onSearch(query);
    }
  };

  // Handler for search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(internalSearchQuery);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <section 
        className={cn("py-8 md:py-12", className)} 
        aria-busy="true" 
        aria-label="Loading items"
      >
        <div className={cn("mx-auto px-4 sm:px-6 lg:px-8 flex justify-center", containerClassName)}>
          {loadingComponent || <LoadingSpinner size="large" label="Loading..." />}
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    if (errorComponent) {
      return (
        <section className={cn("py-8 md:py-12", className)}>
          <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
            {errorComponent}
          </div>
        </section>
      );
    }

    return (
      <section className={cn("py-8 md:py-12", className)}>
        <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading items</h3>
            <p className="text-gray-600">{error.message || "Please try again later."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Render empty state
  if (items.length === 0) {
    if (emptyComponent) {
      return (
        <section className={cn("py-8 md:py-12", className)}>
          <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
            {emptyComponent}
          </div>
        </section>
      );
    }

    return (
      <section className={cn("py-8 md:py-12", className)}>
        <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              ></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">{emptyMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  // Generate grid column classes
  const gridColsClass = cn(
    gridCols.default,
    gridCols.sm,
    gridCols.md,
    gridCols.lg,
    gridCols.xl
  );

  return (
    <section className={cn("py-8 md:py-12", className)}>
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
        {/* Header area with title, description, controls */}
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-medium mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search bar */}
            {searchable && (
              <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={onSearch ? internalSearchQuery : searchQuery}
                    onChange={handleSearch}
                    placeholder={searchPlaceholder}
                    className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-olive-400"
                  />
                  <svg 
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </form>
            )}
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Sort dropdown */}
              {sortOptions && sortOptions.length > 0 && (
                <div className="flex-shrink-0">
                  <label htmlFor="sort-select" className="sr-only">Sort by</label>
                  <select
                    id="sort-select"
                    value={currentSort}
                    onChange={handleSortChange}
                    className="pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-olive-400 text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* View mode switcher */}
              {viewModes.length > 1 && (
                <div className="flex items-center space-x-2 ml-auto">
                  {viewModes.includes('grid') && (
                    <button
                      type="button"
                      onClick={() => handleViewChange('grid')}
                      className={cn(
                        "p-2 rounded-md",
                        viewMode === 'grid' 
                          ? "bg-brand-olive-100 text-brand-olive-700" 
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      )}
                      aria-label="Grid view"
                      aria-pressed={viewMode === 'grid'}
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        ></path>
                      </svg>
                    </button>
                  )}
                  
                  {viewModes.includes('list') && (
                    <button
                      type="button"
                      onClick={() => handleViewChange('list')}
                      className={cn(
                        "p-2 rounded-md",
                        viewMode === 'list' 
                          ? "bg-brand-olive-100 text-brand-olive-700" 
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      )}
                      aria-label="List view"
                      aria-pressed={viewMode === 'list'}
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        ></path>
                      </svg>
                    </button>
                  )}
                  
                  {viewModes.includes('table') && (
                    <button
                      type="button"
                      onClick={() => handleViewChange('table')}
                      className={cn(
                        "p-2 rounded-md",
                        viewMode === 'table' 
                          ? "bg-brand-olive-100 text-brand-olive-700" 
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      )}
                      aria-label="Table view"
                      aria-pressed={viewMode === 'table'}
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </button>
                  )}
                  
                  {viewModes.includes('map') && (
                    <button
                      type="button"
                      onClick={() => handleViewChange('map')}
                      className={cn(
                        "p-2 rounded-md",
                        viewMode === 'map' 
                          ? "bg-brand-olive-100 text-brand-olive-700" 
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      )}
                      aria-label="Map view"
                      aria-pressed={viewMode === 'map'}
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        ></path>
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Select all checkbox if selectable */}
          {selectable && items.length > 0 && (
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedKeys.length === items.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-brand-olive-600 focus:ring-brand-olive-500 border-gray-300 rounded"
              />
              <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                {selectedKeys.length === items.length 
                  ? "Deselect all"
                  : selectedKeys.length > 0
                    ? `Selected ${selectedKeys.length} of ${items.length}`
                    : "Select all"
                }
              </label>
            </div>
          )}
        </div>
        
        {/* Content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className={cn("grid gap-6", gridColsClass)}>
                {items.map((item, index) => {
                  const key = getItemKey(item);
                  const isSelected = selectedKeys.includes(key);
                  
                  return (
                    <motion.div
                      key={key}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn(
                        selectable && "relative",
                        onItemClick && "cursor-pointer"
                      )}
                      onClick={() => onItemClick && onItemClick(item)}
                    >
                      {selectable && (
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemSelect(key)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-brand-olive-600 focus:ring-brand-olive-500 border-gray-300 rounded"
                          />
                        </div>
                      )}
                      {renderItem(item, index)}
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {items.map((item, index) => {
                  const key = getItemKey(item);
                  const isSelected = selectedKeys.includes(key);
                  
                  return (
                    <motion.div
                      key={key}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn(
                        "flex items-start",
                        selectable && "relative",
                        onItemClick && "cursor-pointer"
                      )}
                      onClick={() => onItemClick && onItemClick(item)}
                    >
                      {selectable && (
                        <div className="mr-4 mt-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemSelect(key)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-brand-olive-600 focus:ring-brand-olive-500 border-gray-300 rounded"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        {renderItem(item, index)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                {/* Table implementation would go here */}
                <p className="text-center text-gray-500 py-8">Table view not implemented for this list</p>
              </div>
            )}
            
            {/* Map View */}
            {viewMode === 'map' && (
              <div className="rounded-lg border border-gray-200 h-96 bg-gray-50 flex items-center justify-center">
                {/* Map implementation would go here */}
                <p className="text-center text-gray-500">Map view not implemented for this list</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Pagination */}
        {pagination && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => pagination.onPageChange(1)}
                disabled={pagination.currentPage <= 1}
                className={cn(
                  "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium",
                  pagination.currentPage <= 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                )}
              >
                <span className="sr-only">First page</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className={cn(
                  "relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium",
                  pagination.currentPage <= 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                )}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }
                
                // Only show valid page numbers
                if (pageNum > 0 && pageNum <= pagination.totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => pagination.onPageChange(pageNum)}
                      className={cn(
                        "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                        pagination.currentPage === pageNum
                          ? "z-10 bg-brand-olive-50 border-brand-olive-500 text-brand-olive-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className={cn(
                  "relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium",
                  pagination.currentPage >= pagination.totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                )}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => pagination.onPageChange(pagination.totalPages)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className={cn(
                  "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium",
                  pagination.currentPage >= pagination.totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                )}
              >
                <span className="sr-only">Last page</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}