'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useTheme } from '../../../components/ThemeProvider';
import { useEnhancedTranslations } from '../../../components/i18n/EnhancedTranslationsProvider';
import { rtlFlipClasses } from '../../../utils/rtl-utils';

/**
 * Interface for column definition
 */
export interface TableColumn<T> {
  /** Unique identifier for this column */
  key: string;
  /** Header text for this column */
  header: string;
  /** Function that renders a cell in this column */
  renderCell: (row: T, index: number) => React.ReactNode;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Default sort direction for this column when first activated */
  defaultSortDirection?: 'asc' | 'desc';
  /** Width of the column (CSS value like '200px', '20%', etc.) */
  width?: string;
  /** Whether to hide this column on small screens */
  hideOnMobile?: boolean;
  /** Template area for the column in grid-based tables */
  gridArea?: string;
  /** Optional accessor function for column data (used for sorting) */
  accessor?: (row: T) => any;
  /** Optional filter options specific to this column */
  filterOptions?: {
    type: 'text' | 'select' | 'multiSelect' | 'range' | 'checkbox';
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
  };
}

/**
 * Table error interface
 */
export interface TableError {
  message: string;
  code?: string;
}

/**
 * Pagination interface for table
 */
export interface TablePagination {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Sort options for table
 */
export interface TableSort {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter options for table
 */
export interface TableFilter {
  column: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';
}

/**
 * Selection options for table
 */
export type SelectionType = 'none' | 'single' | 'multiple';

/**
 * BaseTable props
 */
export interface BaseTableProps<T> {
  /** Data to display in the table */
  data: T[];
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: TableError | null;
  /** Empty message to show when data is empty */
  emptyMessage?: string;
  /** Additional CSS class for the table container */
  className?: string;
  /** Table title */
  title?: string;
  /** Table description */
  description?: string;
  /** Whether to use striped rows */
  striped?: boolean;
  /** Whether to show hover effect on rows */
  hoverable?: boolean;
  /** Whether to make the table scrollable horizontally */
  scrollable?: boolean;
  /** Table layout (auto, fixed) */
  layout?: 'auto' | 'fixed' | 'grid';
  /** Row key function */
  getRowKey: (row: T) => string | number;
  /** Pagination config */
  pagination?: TablePagination;
  /** Current sort */
  sort?: TableSort;
  /** Sort change handler */
  onSortChange?: (sort: TableSort) => void;
  /** Current filters */
  filters?: TableFilter[];
  /** Filter change handler */
  onFilterChange?: (filters: TableFilter[]) => void;
  /** Selection type */
  selectionType?: SelectionType;
  /** Currently selected keys */
  selectedKeys?: (string | number)[];
  /** Selection change handler */
  onSelectionChange?: (keys: (string | number)[]) => void;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Grid template for grid layout */
  gridTemplate?: {
    columns?: string;
    areas?: string;
  };
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom empty component */
  emptyComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Animation variant for rows */
  rowAnimation?: 'fade' | 'slide' | 'scale' | 'none';
  /** Minimal design (fewer borders, lighter colors) */
  minimal?: boolean;
  /** Density of the table */
  density?: 'compact' | 'standard' | 'comfortable';
  /** Whether to show borders for cells */
  bordered?: boolean;
  /** Whether to show the filter UI */
  showFilters?: boolean;
  /** Header position (sticky or normal) */
  headerPosition?: 'sticky' | 'normal';
}

/**
 * BaseTable - A versatile, reusable table component
 * 
 * This component supports sorting, filtering, pagination, selection, and customization
 * options for displaying tabular data with TypeScript type safety.
 */
export default function BaseTable<T>({
  data = [],
  columns = [],
  isLoading = false,
  error = null,
  emptyMessage = "No data available",
  className = "",
  title,
  description,
  striped = false,
  hoverable = true,
  scrollable = true,
  layout = "auto",
  getRowKey,
  pagination,
  sort,
  onSortChange,
  filters = [],
  onFilterChange,
  selectionType = "none",
  selectedKeys = [],
  onSelectionChange,
  onRowClick,
  gridTemplate,
  loadingComponent,
  emptyComponent,
  errorComponent,
  rowAnimation = "fade",
  minimal = false,
  density = "standard",
  bordered = true,
  showFilters = false,
  headerPosition = "normal",
}: BaseTableProps<T>): JSX.Element {
  // Get theme from context
  const { theme, colorMode } = useTheme();
  // Get RTL direction from context
  const { isRtl, direction } = useEnhancedTranslations();
  // Internal state for sort if not controlled externally
  const [internalSort, setInternalSort] = useState<TableSort | undefined>(sort);
  
  // Internal state for selected keys if not controlled externally
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<(string | number)[]>(selectedKeys);
  
  // Internal state for filters if not controlled externally
  const [internalFilters, setInternalFilters] = useState<TableFilter[]>(filters);
  
  // Internal state for filter visibility
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(showFilters);

  // Update internal state when props change
  useEffect(() => {
    if (sort !== undefined) {
      setInternalSort(sort);
    }
  }, [sort]);

  useEffect(() => {
    setInternalSelectedKeys(selectedKeys);
  }, [selectedKeys]);

  useEffect(() => {
    setInternalFilters(filters);
  }, [filters]);

  // Calculate the effective sort
  const effectiveSort = useMemo(() => {
    return sort !== undefined ? sort : internalSort;
  }, [sort, internalSort]);

  // Calculate the effective filters
  const effectiveFilters = useMemo(() => {
    return filters.length > 0 ? filters : internalFilters;
  }, [filters, internalFilters]);

  // Calculate the effective selected keys
  const effectiveSelectedKeys = useMemo(() => {
    return selectedKeys.length > 0 ? selectedKeys : internalSelectedKeys;
  }, [selectedKeys, internalSelectedKeys]);

  // Function to toggle sorting
  const handleSort = useCallback((columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    const newSort: TableSort = {
      column: columnKey,
      direction: effectiveSort?.column === columnKey && effectiveSort.direction === 'asc' ? 'desc' : 'asc'
    };

    if (onSortChange) {
      onSortChange(newSort);
    } else {
      setInternalSort(newSort);
    }
  }, [columns, effectiveSort, onSortChange]);

  // Function to handle row selection
  const handleRowSelect = useCallback((key: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (selectionType === 'none') return;

    let newSelectedKeys: (string | number)[];

    if (selectionType === 'single') {
      newSelectedKeys = effectiveSelectedKeys.includes(key) ? [] : [key];
    } else {
      // Multiple selection
      if (effectiveSelectedKeys.includes(key)) {
        newSelectedKeys = effectiveSelectedKeys.filter(k => k !== key);
      } else {
        newSelectedKeys = [...effectiveSelectedKeys, key];
      }
    }

    if (onSelectionChange) {
      onSelectionChange(newSelectedKeys);
    } else {
      setInternalSelectedKeys(newSelectedKeys);
    }
  }, [selectionType, effectiveSelectedKeys, onSelectionChange]);

  // Function to handle select all
  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectionType !== 'multiple') return;

    const newSelectedKeys = e.target.checked ? data.map(row => getRowKey(row)) : [];

    if (onSelectionChange) {
      onSelectionChange(newSelectedKeys);
    } else {
      setInternalSelectedKeys(newSelectedKeys);
    }
  }, [selectionType, data, getRowKey, onSelectionChange]);

  // Function to handle filter change
  const handleFilterChange = useCallback((column: string, value: any, operator: TableFilter['operator'] = 'equals') => {
    const newFilters = [...effectiveFilters.filter(f => f.column !== column)];
    
    if (value !== '' && value !== null && value !== undefined) {
      newFilters.push({ column, value, operator });
    }

    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      setInternalFilters(newFilters);
    }
  }, [effectiveFilters, onFilterChange]);

  // Function to clear all filters
  const handleClearFilters = useCallback(() => {
    if (onFilterChange) {
      onFilterChange([]);
    } else {
      setInternalFilters([]);
    }
  }, [onFilterChange]);

  // Function to toggle filter visibility
  const toggleFilters = useCallback(() => {
    setIsFilterVisible(prev => !prev);
  }, []);

  // Animation variants for rows
  const rowVariants = useMemo(() => {
    switch (rowAnimation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: (i: number) => ({
            opacity: 1,
            transition: { delay: i * 0.05, duration: 0.3 }
          })
        };
      case 'slide':
        return {
          hidden: { x: -20, opacity: 0 },
          visible: (i: number) => ({
            x: 0,
            opacity: 1,
            transition: { delay: i * 0.05, duration: 0.3 }
          })
        };
      case 'scale':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: (i: number) => ({
            scale: 1,
            opacity: 1,
            transition: { delay: i * 0.05, duration: 0.3 }
          })
        };
      case 'none':
      default:
        return {
          hidden: {},
          visible: {}
        };
    }
  }, [rowAnimation]);

  // CSS classes for density
  const densityClasses = useMemo(() => {
    switch (density) {
      case 'compact':
        return `py-1 px-2 text-${theme.components.table.fontSize}`;
      case 'comfortable':
        return `py-3 px-4 text-${theme.typography.fontSize.base}`;
      case 'standard':
      default:
        return `py-2 px-3 text-${theme.components.table.fontSize}`;
    }
  }, [density, theme]);

  // Generate grid template styles for grid layout with RTL support
  const gridStyles = useMemo(() => {
    if (layout !== 'grid' || !gridTemplate) return {};

    // For RTL layouts, we might need to reverse the grid columns
    const rtlGridColumns = isRtl && gridTemplate.columns 
      ? gridTemplate.columns.split(' ').reverse().join(' ')
      : gridTemplate.columns;

    return {
      gridTemplateColumns: rtlGridColumns || `repeat(${columns.length}, 1fr)`,
      gridTemplateAreas: gridTemplate.areas,
      direction
    };
  }, [layout, gridTemplate, columns.length, isRtl, direction]);

  // Render loading state
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        {title && <h2 className="text-xl font-medium mb-2">{title}</h2>}
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        
        <div className="flex justify-center items-center min-h-[200px]">
          {loadingComponent || <LoadingSpinner size="large" label="Loading data..." />}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={cn("w-full", className)}>
        {title && <h2 className="text-xl font-medium mb-2">{title}</h2>}
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        
        {errorComponent || (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <svg 
              className="w-8 h-8 text-red-400 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-lg font-medium text-red-800">Error loading data</h3>
            <p className="text-red-600 mt-1">{error.message}</p>
          </div>
        )}
      </div>
    );
  }

  // Render empty state
  if (data.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        {title && <h2 className="text-xl font-medium mb-2">{title}</h2>}
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        
        {/* Filter bar if needed */}
        {showFilters && (
          <div className="mb-4 flex justify-between items-center">
            <button 
              onClick={toggleFilters}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
            >
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                ></path>
              </svg>
              Filters {effectiveFilters.length > 0 && `(${effectiveFilters.length})`}
            </button>
            
            {effectiveFilters.length > 0 && (
              <button 
                onClick={handleClearFilters}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
        
        {emptyComponent || (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
            <svg 
              className="w-12 h-12 text-gray-400 mx-auto mb-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-1">{emptyMessage}</h3>
            {effectiveFilters.length > 0 && (
              <p className="text-gray-600 mt-1 text-sm">
                Try adjusting your filters to find what you're looking for.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Main table render
  return (
    <div className={cn("w-full", className)}>
      {/* Table header area */}
      <div className="mb-4">
        {title && <h2 className="text-xl font-medium mb-2">{title}</h2>}
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        
        {/* Filter bar */}
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={toggleFilters}
            className={cn(
              "px-3 py-1 text-sm rounded-md flex items-center",
              isFilterVisible || effectiveFilters.length > 0 
                ? "bg-brand-olive-100 text-brand-olive-800 hover:bg-brand-olive-200" 
                : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            <svg 
              className={cn("w-4 h-4", isRtl ? "ml-1" : "mr-1")} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              ></path>
            </svg>
            Filters {effectiveFilters.length > 0 && `(${effectiveFilters.length})`}
          </button>
          
          {effectiveFilters.length > 0 && (
            <button 
              onClick={handleClearFilters}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Clear filters
            </button>
          )}
        </div>
        
        {/* Filter panel */}
        <AnimatePresence>
          {isFilterVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 p-4 rounded-md mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {columns.filter(col => col.filterOptions).map(column => (
                  <div key={`filter-${column.key}`} className="space-y-1">
                    <label htmlFor={`filter-${column.key}`} className="block text-sm font-medium text-gray-700">
                      {column.header}
                    </label>
                    
                    {column.filterOptions?.type === 'text' && (
                      <input
                        id={`filter-${column.key}`}
                        type="text"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-olive-500 focus:border-brand-olive-500 sm:text-sm"
                        placeholder={column.filterOptions.placeholder || `Filter by ${column.header}`}
                        value={effectiveFilters.find(f => f.column === column.key)?.value || ''}
                        onChange={(e) => handleFilterChange(column.key, e.target.value, 'contains')}
                      />
                    )}
                    
                    {column.filterOptions?.type === 'select' && (
                      <select
                        id={`filter-${column.key}`}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-olive-500 focus:border-brand-olive-500 sm:text-sm"
                        value={effectiveFilters.find(f => f.column === column.key)?.value || ''}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                      >
                        <option value="">All</option>
                        {column.filterOptions.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {column.filterOptions?.type === 'multiSelect' && (
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {column.filterOptions.options?.map(option => {
                          const filter = effectiveFilters.find(f => f.column === column.key);
                          const isSelected = filter?.operator === 'in' && Array.isArray(filter.value) 
                            ? filter.value.includes(option.value)
                            : false;
                          
                          return (
                            <div key={option.value} className="flex items-center">
                              <input
                                id={`filter-${column.key}-${option.value}`}
                                type="checkbox"
                                className="h-4 w-4 text-brand-olive-600 border-gray-300 rounded focus:ring-brand-olive-500"
                                checked={isSelected}
                                onChange={() => {
                                  const filter = effectiveFilters.find(f => f.column === column.key);
                                  let newValue: string[] = [];
                                  
                                  if (filter && Array.isArray(filter.value)) {
                                    if (isSelected) {
                                      newValue = filter.value.filter(v => v !== option.value);
                                    } else {
                                      newValue = [...filter.value, option.value];
                                    }
                                  } else {
                                    newValue = [option.value];
                                  }
                                  
                                  handleFilterChange(column.key, newValue.length ? newValue : null, 'in');
                                }}
                              />
                              <label htmlFor={`filter-${column.key}-${option.value}`} className="ml-2 text-sm text-gray-700">
                                {option.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {column.filterOptions?.type === 'range' && (
                      <div className="flex space-x-2">
                        <input
                          id={`filter-${column.key}-min`}
                          type="number"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-olive-500 focus:border-brand-olive-500 sm:text-sm"
                          placeholder="Min"
                          value={effectiveFilters.find(f => f.column === column.key && f.operator === 'greaterThan')?.value || ''}
                          onChange={(e) => handleFilterChange(column.key, e.target.value ? Number(e.target.value) : null, 'greaterThan')}
                        />
                        <input
                          id={`filter-${column.key}-max`}
                          type="number"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-olive-500 focus:border-brand-olive-500 sm:text-sm"
                          placeholder="Max"
                          value={effectiveFilters.find(f => f.column === column.key && f.operator === 'lessThan')?.value || ''}
                          onChange={(e) => handleFilterChange(column.key, e.target.value ? Number(e.target.value) : null, 'lessThan')}
                        />
                      </div>
                    )}
                    
                    {column.filterOptions?.type === 'checkbox' && (
                      <div className="pt-1">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-brand-olive-600 border-gray-300 rounded focus:ring-brand-olive-500"
                            checked={effectiveFilters.find(f => f.column === column.key)?.value === true}
                            onChange={(e) => handleFilterChange(column.key, e.target.checked ? true : null)}
                          />
                          <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Table container */}
      <div className={cn(
        "w-full",
        minimal 
          ? `border border-${colorMode === 'dark' ? theme.border.light : 'gray-200'} rounded-${theme.components.table.borderRadius} overflow-hidden` 
          : `border-2 border-${colorMode === 'dark' ? theme.border.default : 'gray-300'} rounded-${theme.components.table.borderRadius} overflow-hidden`,
        scrollable && "overflow-x-auto"
      )}>
        {layout === 'grid' ? (
          // Grid layout
          <div 
            className={cn(
              "w-full",
              "grid",
              colorMode === 'dark' ? 'bg-gray-800' : 'bg-white',
              bordered && `divide-y divide-${colorMode === 'dark' ? 'gray-700' : 'gray-200'}`,
              minimal ? theme.shadows.sm : theme.shadows.md
            )}
            style={gridStyles}
          >
            {/* Grid header */}
            <div className={cn(
              "contents",
              headerPosition === 'sticky' && "sticky top-0 z-10"
            )}>
              {/* Select all checkbox for grid layout */}
              {selectionType === 'multiple' && (
                <div className={cn(
                  `${colorMode === 'dark' ? 'bg-gray-700' : theme.components.table.headerBackgroundColor} flex items-center justify-center`,
                  densityClasses,
                  bordered && `border-b border-${colorMode === 'dark' ? 'gray-600' : theme.components.table.borderColor}`
                )}>
                  <input
                    type="checkbox"
                    className={`h-4 w-4 text-${theme.primary[500]} border-${colorMode === 'dark' ? 'gray-600' : 'gray-300'} rounded focus:ring-${theme.primary[400]}`}
                    checked={effectiveSelectedKeys.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
              )}
              
              {/* Column headers for grid layout */}
              {columns.map(column => (
                <div
                  key={column.key}
                  className={cn(
                    `${colorMode === 'dark' ? 'bg-gray-700' : theme.components.table.headerBackgroundColor} font-medium ${colorMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`,
                    densityClasses,
                    column.sortable ? `cursor-pointer hover:${colorMode === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}` : "",
                    bordered && `border-b border-${colorMode === 'dark' ? 'gray-600' : theme.components.table.borderColor}`,
                    column.hideOnMobile && "hidden sm:table-cell"
                  )}
                  style={{ 
                    width: column.width, 
                    gridArea: column.gridArea
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    
                    {column.sortable && (
                      <span className={isRtl ? "mr-1" : "ml-1"}>
                        {effectiveSort?.column === column.key ? (
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ transform: isRtl ? 'scaleX(-1)' : undefined }}
                          >
                            {effectiveSort.direction === 'asc' ? (
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M5 15l7-7 7 7"
                              ></path>
                            ) : (
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M19 9l-7 7-7-7"
                              ></path>
                            )}
                          </svg>
                        ) : (
                          <svg 
                            className="w-4 h-4 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ transform: isRtl ? 'scaleX(-1)' : undefined }}
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            ></path>
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Grid rows */}
            {data.map((row, rowIndex) => {
              const rowKey = getRowKey(row);
              const isSelected = effectiveSelectedKeys.includes(rowKey);
              
              return (
                <React.Fragment key={rowKey}>
                  {/* Selection cell for grid layout */}
                  {selectionType !== 'none' && (
                    <motion.div
                      custom={rowIndex}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn(
                        "flex items-center justify-center",
                        densityClasses,
                        isSelected ? "bg-brand-olive-50" : striped && rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white",
                        bordered && "border-b border-gray-200",
                        hoverable && !isSelected && "hover:bg-gray-50"
                      )}
                      onClick={(e) => handleRowSelect(rowKey, e)}
                    >
                      <input
                        type={selectionType === 'single' ? 'radio' : 'checkbox'}
                        className={cn(
                          selectionType === 'single' 
                            ? "h-4 w-4 text-brand-olive-600 border-gray-300 focus:ring-brand-olive-500" 
                            : "h-4 w-4 text-brand-olive-600 border-gray-300 rounded focus:ring-brand-olive-500"
                        )}
                        checked={isSelected}
                        onChange={() => {}}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </motion.div>
                  )}
                  
                  {/* Data cells for grid layout */}
                  {columns.map(column => (
                    <motion.div
                      key={`${rowKey}-${column.key}`}
                      custom={rowIndex}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn(
                        densityClasses,
                        `text-${isRtl ? 'right' : 'left'}`,
                        isSelected ? "bg-brand-olive-50" : striped && rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white",
                        bordered && "border-b border-gray-200",
                        hoverable && !isSelected && "hover:bg-gray-50",
                        onRowClick && "cursor-pointer",
                        column.hideOnMobile && "hidden sm:table-cell"
                      )}
                      style={{ 
                        width: column.width, 
                        gridArea: column.gridArea,
                        direction
                      }}
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {column.renderCell(row, rowIndex)}
                    </motion.div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          // Standard table layout
          <table className={cn(
            "w-full",
            "bg-white",
            layout === 'fixed' ? "table-fixed" : "table-auto",
            minimal ? "shadow-sm" : "shadow-md"
          )}>
            <thead className={cn(
              headerPosition === 'sticky' && "sticky top-0 z-10"
            )}>
              <tr>
                {/* Selection column */}
                {selectionType !== 'none' && (
                  <th className={cn(
                    "bg-gray-50",
                    densityClasses,
                    `text-${isRtl ? 'right' : 'left'} font-medium text-gray-700`,
                    bordered && "border-b border-gray-200"
                  )}
                  style={{ width: '40px' }}>
                    {selectionType === 'multiple' && (
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-brand-olive-600 border-gray-300 rounded focus:ring-brand-olive-500"
                        checked={effectiveSelectedKeys.length === data.length && data.length > 0}
                        onChange={handleSelectAll}
                      />
                    )}
                  </th>
                )}
                
                {/* Column headers */}
                {columns.map(column => (
                  <th
                    key={column.key}
                    className={cn(
                      colorMode === 'dark' ? 'bg-gray-700' : theme.components.table.headerBackgroundColor,
                      densityClasses,
                      `font-medium ${colorMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`,
                      `text-${isRtl ? 'right' : 'left'}`,
                      column.sortable ? `cursor-pointer hover:${colorMode === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}` : "",
                      bordered && `border-b border-${colorMode === 'dark' ? 'gray-600' : theme.components.table.borderColor}`,
                      column.hideOnMobile && "hidden sm:table-cell"
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      <span>{column.header}</span>
                      
                      {column.sortable && (
                        <span className="ml-1">
                          {effectiveSort?.column === column.key ? (
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              {effectiveSort.direction === 'asc' ? (
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="2" 
                                  d="M5 15l7-7 7 7"
                                ></path>
                              ) : (
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="2" 
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              )}
                            </svg>
                          ) : (
                            <svg 
                              className="w-4 h-4 text-gray-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                              ></path>
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {data.map((row, rowIndex) => {
                const rowKey = getRowKey(row);
                const isSelected = effectiveSelectedKeys.includes(rowKey);
                
                return (
                  <motion.tr
                    key={rowKey}
                    custom={rowIndex}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      isSelected ? "bg-brand-olive-50" : striped && rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white",
                      bordered && "border-b border-gray-200",
                      hoverable && !isSelected && "hover:bg-gray-50",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {/* Selection cell */}
                    {selectionType !== 'none' && (
                      <td 
                        className={cn(
                          densityClasses,
                          bordered && columns.length > 0 && "border-r border-gray-200"
                        )}
                        onClick={(e) => handleRowSelect(rowKey, e)}
                      >
                        <input
                          type={selectionType === 'single' ? 'radio' : 'checkbox'}
                          className={cn(
                            selectionType === 'single' 
                              ? "h-4 w-4 text-brand-olive-600 border-gray-300 focus:ring-brand-olive-500" 
                              : "h-4 w-4 text-brand-olive-600 border-gray-300 rounded focus:ring-brand-olive-500"
                          )}
                          checked={isSelected}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    
                    {/* Data cells */}
                    {columns.map(column => (
                      <td
                        key={`${rowKey}-${column.key}`}
                        className={cn(
                          densityClasses,
                          `text-${isRtl ? 'right' : 'left'}`,
                          bordered && "border-r border-gray-200",
                          column.hideOnMobile && "hidden sm:table-cell"
                        )}
                      >
                        {column.renderCell(row, rowIndex)}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-gray-600">
            {pagination.totalItems !== undefined && (
              <span>
                Showing {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} entries
              </span>
            )}
          </div>
          
          <div className={cn("flex items-center", isRtl ? "space-x-reverse space-x-2" : "space-x-2")}>
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage <= 1}
              className={cn(
                "p-2 rounded-md",
                pagination.currentPage <= 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label="First page"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: isRtl ? 'scaleX(-1)' : undefined }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
              </svg>
            </button>
            
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className={cn(
                "p-2 rounded-md",
                pagination.currentPage <= 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label="Previous page"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: isRtl ? 'scaleX(-1)' : undefined }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <span className="text-gray-700">
              Page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
            </span>
            
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className={cn(
                "p-2 rounded-md",
                pagination.currentPage >= pagination.totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label="Next page"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: isRtl ? 'scaleX(-1)' : undefined }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
            <button
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className={cn(
                "p-2 rounded-md",
                pagination.currentPage >= pagination.totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label="Last page"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: isRtl ? 'scaleX(-1)' : undefined }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}