'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '../../../../lib/utils';

/**
 * Interface for pagination component props
 */
export interface BasePaginationProps {
  /** Total number of items */
  totalItems: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Current page (1-based) */
  currentPage?: number;
  /** Default current page (uncontrolled mode) */
  defaultPage?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Maximum number of pages to show */
  maxVisiblePages?: number;
  /** Show first/last page buttons */
  showFirstLastButtons?: boolean;
  /** Show total items count */
  showTotalItems?: boolean;
  /** Show items per page selector */
  showItemsPerPageSelector?: boolean;
  /** Available options for items per page */
  itemsPerPageOptions?: number[];
  /** Callback when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  /** Layout variant */
  variant?: 'default' | 'simple' | 'compact' | 'buttons';
  /** Size of pagination controls */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class name */
  className?: string;
  /** Text for previous button */
  previousLabel?: React.ReactNode;
  /** Text for next button */
  nextLabel?: React.ReactNode;
  /** Text for first page button */
  firstPageLabel?: React.ReactNode;
  /** Text for last page button */
  lastPageLabel?: React.ReactNode;
  /** Aria label for pagination component */
  ariaLabel?: string;
  /** Allow keyboard navigation */
  keyboardNavigation?: boolean;
  /** Whether to disable pagination (all buttons disabled) */
  disabled?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Whether to show page size selector */
  showPageSizeSelector?: boolean;
}

/**
 * BasePagination component for navigation through paged content
 * 
 * Features include customizable navigation buttons, different variants,
 * accessibility support, and controlled/uncontrolled modes.
 */
export default function BasePagination({
  totalItems,
  itemsPerPage,
  currentPage: controlledCurrentPage,
  defaultPage = 1,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLastButtons = true,
  showTotalItems = true,
  showItemsPerPageSelector = false,
  itemsPerPageOptions = [10, 20, 50, 100],
  onItemsPerPageChange,
  variant = 'default',
  size = 'md',
  className = '',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  firstPageLabel = '«',
  lastPageLabel = '»',
  ariaLabel = 'Pagination',
  keyboardNavigation = true,
  disabled = false,
  isLoading = false,
  showPageSizeSelector = false,
}: BasePaginationProps): JSX.Element {
  // Internal state for current page (uncontrolled mode)
  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(
    controlledCurrentPage !== undefined ? controlledCurrentPage : defaultPage
  );
  
  // Internal state for items per page (uncontrolled mode)
  const [internalItemsPerPage, setInternalItemsPerPage] = useState<number>(itemsPerPage);
  
  // Effect to update internal state when controlled props change
  useEffect(() => {
    if (controlledCurrentPage !== undefined) {
      setInternalCurrentPage(controlledCurrentPage);
    }
  }, [controlledCurrentPage]);
  
  useEffect(() => {
    setInternalItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);
  
  // Calculate the effective current page (controlled or uncontrolled)
  const effectiveCurrentPage = controlledCurrentPage !== undefined 
    ? controlledCurrentPage 
    : internalCurrentPage;
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / internalItemsPerPage));
  }, [totalItems, internalItemsPerPage]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(page, totalPages));
    
    if (validPage === effectiveCurrentPage) return;
    
    // Update internal state if uncontrolled
    if (controlledCurrentPage === undefined) {
      setInternalCurrentPage(validPage);
    }
    
    // Call onPageChange callback
    if (onPageChange) {
      onPageChange(validPage);
    }
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    
    // Update internal state
    setInternalItemsPerPage(newItemsPerPage);
    
    // Calculate new current page to keep the current view as close as possible
    const startIndex = (effectiveCurrentPage - 1) * internalItemsPerPage;
    const newPage = Math.floor(startIndex / newItemsPerPage) + 1;
    const validNewPage = Math.max(1, Math.min(newPage, Math.ceil(totalItems / newItemsPerPage)));
    
    // Update current page
    if (controlledCurrentPage === undefined) {
      setInternalCurrentPage(validNewPage);
    }
    
    // Call callbacks
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
    
    if (onPageChange && validNewPage !== effectiveCurrentPage) {
      onPageChange(validNewPage);
    }
  };
  
  // Calculate visible pages range
  const visiblePages = useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      // Show all pages if the total is less than max visible
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, effectiveCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    // Adjust if end page exceeds total pages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [effectiveCurrentPage, totalPages, maxVisiblePages]);
  
  // Get CSS classes for pagination button based on variant and state
  const getButtonClasses = (isActive = false, isDisabled = false) => {
    const baseClasses = 'focus:outline-none focus:ring-2 focus:ring-brand-olive-300 focus:ring-opacity-50 transition-colors duration-150';
    const disabledClasses = 'opacity-50 cursor-not-allowed';
    
    // Size classes
    let sizeClasses = '';
    switch (size) {
      case 'sm':
        sizeClasses = 'text-sm py-1 px-2';
        break;
      case 'lg':
        sizeClasses = 'text-base py-2 px-4';
        break;
      case 'md':
      default:
        sizeClasses = 'text-sm py-1.5 px-3';
        break;
    }
    
    // Variant-specific classes
    let variantClasses = '';
    switch (variant) {
      case 'simple':
        variantClasses = cn(
          sizeClasses,
          isActive
            ? 'text-brand-olive-700 font-medium'
            : 'text-gray-600 hover:text-brand-olive-700'
        );
        break;
      case 'compact':
        variantClasses = cn(
          'mx-0.5',
          sizeClasses,
          isActive
            ? 'bg-brand-olive-100 text-brand-olive-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100'
        );
        break;
      case 'buttons':
        variantClasses = cn(
          'border mx-0.5 rounded-md',
          sizeClasses,
          isActive
            ? 'bg-brand-olive-500 text-white border-brand-olive-600'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        );
        break;
      case 'default':
      default:
        variantClasses = cn(
          'relative inline-flex items-center mx-1 rounded-md',
          sizeClasses,
          isActive
            ? 'z-10 bg-brand-olive-50 border-brand-olive-500 text-brand-olive-600'
            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
          'border'
        );
        break;
    }
    
    return cn(
      baseClasses,
      variantClasses,
      isDisabled || disabled ? disabledClasses : ''
    );
  };
  
  // Calculate item range for current page
  const startItem = (effectiveCurrentPage - 1) * internalItemsPerPage + 1;
  const endItem = Math.min(effectiveCurrentPage * internalItemsPerPage, totalItems);
  
  // Get container classes based on variant
  const containerClasses = cn(
    'flex items-center justify-between',
    className
  );
  
  return (
    <nav className={containerClasses} aria-label={ariaLabel}>
      {/* Left side: Total items and items per page selector */}
      <div className="flex items-center">
        {showTotalItems && (
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{Math.min(startItem, totalItems)}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> items
          </p>
        )}
        
        {showItemsPerPageSelector && (
          <div className="ml-4 flex items-center">
            <label htmlFor="items-per-page" className="text-sm text-gray-700 mr-2">
              Show
            </label>
            <select
              id="items-per-page"
              className="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-brand-olive-500 focus:border-brand-olive-500"
              value={internalItemsPerPage}
              onChange={handleItemsPerPageChange}
              disabled={disabled || isLoading}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Right side: Pagination controls */}
      <div className={cn("flex items-center", variant === 'simple' ? 'space-x-2' : '')}>
        {/* First page button */}
        {showFirstLastButtons && variant !== 'simple' && (
          <button
            type="button"
            className={getButtonClasses(false, effectiveCurrentPage <= 1 || disabled || isLoading)}
            onClick={() => handlePageChange(1)}
            disabled={effectiveCurrentPage <= 1 || disabled || isLoading}
            aria-label="Go to first page"
            tabIndex={keyboardNavigation ? 0 : -1}
          >
            {firstPageLabel}
          </button>
        )}
        
        {/* Previous page button */}
        <button
          type="button"
          className={getButtonClasses(false, effectiveCurrentPage <= 1 || disabled || isLoading)}
          onClick={() => handlePageChange(effectiveCurrentPage - 1)}
          disabled={effectiveCurrentPage <= 1 || disabled || isLoading}
          aria-label="Go to previous page"
          tabIndex={keyboardNavigation ? 0 : -1}
        >
          {variant === 'simple' ? (
            <span aria-hidden="true">&lsaquo;</span>
          ) : (
            previousLabel
          )}
        </button>
        
        {/* Page numbers (hidden in simple variant) */}
        {variant !== 'simple' && (
          <div className="flex items-center">
            {visiblePages.map(page => (
              <button
                key={page}
                type="button"
                className={getButtonClasses(page === effectiveCurrentPage, disabled || isLoading)}
                onClick={() => handlePageChange(page)}
                disabled={disabled || isLoading}
                aria-label={`Page ${page}`}
                aria-current={page === effectiveCurrentPage ? 'page' : undefined}
                tabIndex={keyboardNavigation ? 0 : -1}
              >
                {page}
              </button>
            ))}
          </div>
        )}
        
        {/* Next page button */}
        <button
          type="button"
          className={getButtonClasses(false, effectiveCurrentPage >= totalPages || disabled || isLoading)}
          onClick={() => handlePageChange(effectiveCurrentPage + 1)}
          disabled={effectiveCurrentPage >= totalPages || disabled || isLoading}
          aria-label="Go to next page"
          tabIndex={keyboardNavigation ? 0 : -1}
        >
          {variant === 'simple' ? (
            <span aria-hidden="true">&rsaquo;</span>
          ) : (
            nextLabel
          )}
        </button>
        
        {/* Last page button */}
        {showFirstLastButtons && variant !== 'simple' && (
          <button
            type="button"
            className={getButtonClasses(false, effectiveCurrentPage >= totalPages || disabled || isLoading)}
            onClick={() => handlePageChange(totalPages)}
            disabled={effectiveCurrentPage >= totalPages || disabled || isLoading}
            aria-label="Go to last page"
            tabIndex={keyboardNavigation ? 0 : -1}
          >
            {lastPageLabel}
          </button>
        )}
        
        {/* Simple variant: current page indicator */}
        {variant === 'simple' && (
          <span className="text-sm text-gray-700 mx-2">
            Page <span className="font-medium">{effectiveCurrentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </span>
        )}
      </div>
      
      {/* Page size selector for specific layouts */}
      {showPageSizeSelector && (
        <div className="ml-4">
          <label htmlFor="page-size" className="text-sm text-gray-700 mr-2">
            Items per page:
          </label>
          <select
            id="page-size"
            className="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-brand-olive-500 focus:border-brand-olive-500"
            value={internalItemsPerPage}
            onChange={handleItemsPerPageChange}
            disabled={disabled || isLoading}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}