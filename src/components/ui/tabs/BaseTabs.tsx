'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { useEnhancedTranslations } from '../../../components/i18n/EnhancedTranslationsProvider';
import { rtlFlipClasses } from '../../../utils/rtl-utils';

/**
 * Interface for tab item
 */
export interface TabItem {
  /** Unique ID for this tab */
  id: string;
  /** Display label for the tab */
  label: React.ReactNode;
  /** The tab content */
  content: React.ReactNode;
  /** Whether this tab is disabled */
  disabled?: boolean;
  /** Icon to display in the tab (optional) */
  icon?: React.ReactNode;
  /** Additional badge (e.g. counter) to display in the tab */
  badge?: React.ReactNode;
  /** Additional custom data */
  data?: any;
}

/**
 * Base Tabs component props
 */
export interface BaseTabsProps {
  /** Tabs to display */
  tabs: TabItem[];
  /** ID of the initially active tab */
  defaultActiveTab?: string;
  /** ID of the active tab (controlled mode) */
  activeTab?: string;
  /** Callback when active tab changes */
  onTabChange?: (tabId: string) => void;
  /** Visual appearance of the tabs */
  variant?: 'default' | 'outline' | 'pills' | 'underline' | 'buttons';
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical';
  /** Size of the tabs */
  size?: 'sm' | 'md' | 'lg';
  /** Enable animated transitions */
  animated?: boolean;
  /** Enable lazy loading of tab content (only render active tab) */
  lazy?: boolean;
  /** Allow keyboard navigation with arrow keys */
  keyboardNavigation?: boolean;
  /** Whether the tabs should stretch to fill the container width */
  stretch?: boolean;
  /** Whether to center the tabs */
  centered?: boolean;
  /** Position of the tabs relative to the content when orientation is horizontal */
  tabPosition?: 'top' | 'bottom';
  /** Additional class name for the tabs container */
  className?: string;
  /** Additional class name for the tabs header */
  tabsHeaderClassName?: string;
  /** Additional class name for the tabs content container */
  tabsContentClassName?: string;
  /** Additional class name for tab buttons */
  tabClassName?: string;
  /** Additional class name for active tab button */
  activeTabClassName?: string;
  /** Animation variants for tab transitions */
  animationVariants?: {
    initial?: object;
    animate?: object;
    exit?: object;
  };
  /** Additional props for the tab list element */
  tabListProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Additional props for the tab panel element */
  tabPanelProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Aria label for the tabs component */
  ariaLabel?: string;
}

/**
 * BaseTabs - A flexible, accessible tabs component with various styles and layouts
 */
export default function BaseTabs({
  tabs = [],
  defaultActiveTab,
  activeTab,
  onTabChange,
  variant = 'default',
  orientation = 'horizontal',
  size = 'md',
  animated = true,
  lazy = true,
  keyboardNavigation = true,
  stretch = false,
  centered = false,
  tabPosition = 'top',
  className = '',
  tabsHeaderClassName = '',
  tabsContentClassName = '',
  tabClassName = '',
  activeTabClassName = '',
  animationVariants,
  tabListProps = {},
  tabPanelProps = {},
  ariaLabel = 'Tabs',
}: BaseTabsProps): JSX.Element {
  // Get RTL direction from context
  const { isRtl, direction } = useEnhancedTranslations();
  
  // Find default active tab if not explicitly provided
  const initialActiveTab = activeTab || defaultActiveTab || (tabs.length > 0 ? tabs[0].id : '');
  
  // Internal active tab state (used in uncontrolled mode)
  const [internalActiveTab, setInternalActiveTab] = useState<string>(initialActiveTab);
  
  // Ref for tab list for keyboard navigation
  const tablistRef = useRef<HTMLDivElement>(null);
  
  // Calculate effective active tab (controlled or uncontrolled)
  const effectiveActiveTab = activeTab !== undefined ? activeTab : internalActiveTab;
  
  // Update internal state when activeTab prop changes
  useEffect(() => {
    if (activeTab !== undefined) {
      setInternalActiveTab(activeTab);
    }
  }, [activeTab]);
  
  // Update internal state when defaultActiveTab changes
  useEffect(() => {
    if (activeTab === undefined && defaultActiveTab !== undefined) {
      setInternalActiveTab(defaultActiveTab);
    }
  }, [activeTab, defaultActiveTab]);
  
  // Handler for tab click
  const handleTabClick = useCallback((tabId: string) => {
    if (activeTab === undefined) {
      setInternalActiveTab(tabId);
    }
    
    if (onTabChange) {
      onTabChange(tabId);
    }
  }, [activeTab, onTabChange]);
  
  // Handler for keyboard navigation with RTL support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!keyboardNavigation) return;
    
    // Get enabled tabs
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const currentIndex = enabledTabs.findIndex(tab => tab.id === effectiveActiveTab);
    
    // Handle keyboard navigation
    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        // In RTL, ArrowRight moves to previous tab
        if (isRtl) {
          if (currentIndex > 0) {
            const prevTabId = enabledTabs[currentIndex - 1].id;
            handleTabClick(prevTabId);
            
            // Focus the previous tab button
            const prevTabButton = tablistRef.current?.querySelector(`[data-tab-id="${prevTabId}"]`) as HTMLButtonElement;
            prevTabButton?.focus();
          }
        } else {
          // In LTR, ArrowRight moves to next tab
          if (currentIndex < enabledTabs.length - 1) {
            const nextTabId = enabledTabs[currentIndex + 1].id;
            handleTabClick(nextTabId);
            
            // Focus the next tab button
            const nextTabButton = tablistRef.current?.querySelector(`[data-tab-id="${nextTabId}"]`) as HTMLButtonElement;
            nextTabButton?.focus();
          }
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        // In RTL, ArrowLeft moves to next tab
        if (isRtl) {
          if (currentIndex < enabledTabs.length - 1) {
            const nextTabId = enabledTabs[currentIndex + 1].id;
            handleTabClick(nextTabId);
            
            // Focus the next tab button
            const nextTabButton = tablistRef.current?.querySelector(`[data-tab-id="${nextTabId}"]`) as HTMLButtonElement;
            nextTabButton?.focus();
          }
        } else {
          // In LTR, ArrowLeft moves to previous tab
          if (currentIndex > 0) {
            const prevTabId = enabledTabs[currentIndex - 1].id;
            handleTabClick(prevTabId);
            
            // Focus the previous tab button
            const prevTabButton = tablistRef.current?.querySelector(`[data-tab-id="${prevTabId}"]`) as HTMLButtonElement;
            prevTabButton?.focus();
          }
        }
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        if (currentIndex < enabledTabs.length - 1) {
          const nextTabId = enabledTabs[currentIndex + 1].id;
          handleTabClick(nextTabId);
          
          // Focus the next tab button
          const nextTabButton = tablistRef.current?.querySelector(`[data-tab-id="${nextTabId}"]`) as HTMLButtonElement;
          nextTabButton?.focus();
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (currentIndex > 0) {
          const prevTabId = enabledTabs[currentIndex - 1].id;
          handleTabClick(prevTabId);
          
          // Focus the previous tab button
          const prevTabButton = tablistRef.current?.querySelector(`[data-tab-id="${prevTabId}"]`) as HTMLButtonElement;
          prevTabButton?.focus();
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        const firstTabId = enabledTabs[0].id;
        handleTabClick(firstTabId);
        
        // Focus the first tab button
        const firstTabButton = tablistRef.current?.querySelector(`[data-tab-id="${firstTabId}"]`) as HTMLButtonElement;
        firstTabButton?.focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        const lastTabId = enabledTabs[enabledTabs.length - 1].id;
        handleTabClick(lastTabId);
        
        // Focus the last tab button
        const lastTabButton = tablistRef.current?.querySelector(`[data-tab-id="${lastTabId}"]`) as HTMLButtonElement;
        lastTabButton?.focus();
        break;
      }
    }
  }, [keyboardNavigation, tabs, effectiveActiveTab, handleTabClick, isRtl]);
  
  // Find the active tab object
  const activeTabObject = tabs.find(tab => tab.id === effectiveActiveTab);
  
  // Default animation variants if none provided
  const defaultAnimationVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
  
  // Merge default animation variants with provided ones
  const mergedAnimationVariants = {
    initial: animationVariants?.initial || defaultAnimationVariants.initial,
    animate: animationVariants?.animate || defaultAnimationVariants.animate,
    exit: animationVariants?.exit || defaultAnimationVariants.exit,
  };
  
  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-sm py-1 px-2';
      case 'lg': return 'text-lg py-3 px-6';
      case 'md':
      default: return 'text-base py-2 px-4';
    }
  };
  
  // Get CSS classes for tab button based on variant
  const getTabClasses = (isActive: boolean, isDisabled: boolean) => {
    const sizeClass = getSizeClasses();
    const baseClasses = 'focus:outline-none focus:ring-2 focus:ring-brand-olive-300 focus:ring-opacity-50 rounded-md transition-all duration-200 inline-flex items-center';
    const commonActiveClasses = 'font-medium';
    const commonDisabledClasses = 'cursor-not-allowed opacity-50';
    
    let variantClasses = '';
    
    switch (variant) {
      case 'outline':
        variantClasses = cn(
          'border border-gray-300',
          isActive 
            ? 'bg-white border-brand-olive-500 text-brand-olive-700 shadow-sm' 
            : 'hover:bg-gray-50 hover:border-gray-400'
        );
        break;
      case 'pills':
        variantClasses = cn(
          isActive 
            ? 'bg-brand-olive-500 text-white' 
            : 'hover:bg-gray-100 hover:text-gray-900'
        );
        break;
      case 'underline':
        variantClasses = cn(
          'border-b-2',
          isActive 
            ? 'border-brand-olive-500 text-brand-olive-700' 
            : 'border-transparent hover:border-gray-300 hover:text-gray-700'
        );
        break;
      case 'buttons':
        variantClasses = cn(
          'border',
          isActive 
            ? 'bg-brand-olive-500 text-white border-brand-olive-600' 
            : 'bg-white border-gray-300 hover:bg-gray-50'
        );
        break;
      case 'default':
      default:
        variantClasses = cn(
          isActive 
            ? 'text-brand-olive-700 border-b-2 border-brand-olive-500' 
            : 'text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300'
        );
        break;
    }
    
    return cn(
      baseClasses,
      sizeClass,
      variantClasses,
      isActive ? commonActiveClasses : '',
      isDisabled ? commonDisabledClasses : '',
      tabClassName,
      isActive && !isDisabled ? activeTabClassName : ''
    );
  };
  
  // Get container classes based on orientation and tab position
  const getContainerClasses = () => {
    let orientationClasses = '';
    
    if (orientation === 'vertical') {
      orientationClasses = 'flex flex-row';
    } else {
      // Horizontal orientation
      orientationClasses = cn(
        'flex flex-col',
        tabPosition === 'bottom' ? 'flex-col-reverse' : ''
      );
    }
    
    return cn(
      orientationClasses,
      className
    );
  };
  
  // Get tab list classes based on orientation, layout options, and RTL support
  const getTabListClasses = () => {
    let tablistClasses = cn(
      'flex',
      tabsHeaderClassName
    );
    
    if (orientation === 'vertical') {
      tablistClasses = cn(
        tablistClasses,
        'flex-col',
        isRtl 
          ? cn('border-l border-gray-200', variant === 'default' ? 'pl-2' : '', variant === 'underline' ? 'border-l-0' : '')
          : cn('border-r border-gray-200', variant === 'default' ? 'pr-2' : '', variant === 'underline' ? 'border-r-0' : '')
      );
    } else {
      // Horizontal orientation
      tablistClasses = cn(
        tablistClasses,
        stretch ? 'w-full' : '',
        centered ? 'justify-center' : '',
        variant === 'default' ? 'border-b border-gray-200' : '',
        variant === 'underline' ? 'border-b border-gray-200' : '',
        orientation === 'horizontal' && variant === 'underline' 
          ? (isRtl ? 'space-x-reverse space-x-1' : 'space-x-1') 
          : (isRtl ? 'space-x-reverse space-x-2' : 'space-x-2')
      );
    }
    
    return tablistClasses;
  };
  
  // Get tab content classes based on orientation and RTL support
  const getTabContentClasses = () => {
    if (orientation === 'vertical') {
      return cn(
        'flex-grow p-4', 
        isRtl ? 'pl-0' : 'pr-0',
        tabsContentClassName
      );
    } else {
      return cn('pt-4', tabsContentClassName);
    }
  };
  
  // Render tab buttons
  const renderTabButtons = () => {
    return tabs.map((tab) => {
      const isActive = tab.id === effectiveActiveTab;
      
      return (
        <button
          key={tab.id}
          role="tab"
          data-tab-id={tab.id}
          id={`tab-${tab.id}`}
          aria-selected={isActive}
          aria-controls={`tabpanel-${tab.id}`}
          tabIndex={isActive ? 0 : -1}
          disabled={tab.disabled}
          className={getTabClasses(isActive, !!tab.disabled)}
          onClick={() => !tab.disabled && handleTabClick(tab.id)}
          dir={direction}
        >
          {tab.icon && <span className={isRtl ? "ml-2" : "mr-2"}>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge && <span className={isRtl ? "mr-2" : "ml-2"}>{tab.badge}</span>}
        </button>
      );
    });
  };
  
  // Render tab content
  const renderTabContent = () => {
    // If lazy loading is enabled, only render the active tab
    if (lazy) {
      if (!activeTabObject) return null;
      
      return (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTabObject.id}`}
          aria-labelledby={`tab-${activeTabObject.id}`}
          className="outline-none"
          tabIndex={0}
          {...tabPanelProps}
        >
          {animated ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabObject.id}
                initial={mergedAnimationVariants.initial}
                animate={mergedAnimationVariants.animate}
                exit={mergedAnimationVariants.exit}
                transition={{ duration: 0.2 }}
              >
                {activeTabObject.content}
              </motion.div>
            </AnimatePresence>
          ) : (
            activeTabObject.content
          )}
        </div>
      );
    }
    
    // If lazy loading is disabled, render all tabs (but hide inactive ones)
    return (
      <div className="relative">
        {tabs.map((tab) => {
          const isActive = tab.id === effectiveActiveTab;
          
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              className={cn("outline-none", !isActive && "hidden")}
              tabIndex={isActive ? 0 : -1}
              {...tabPanelProps}
            >
              {animated && isActive ? (
                <motion.div
                  key={tab.id}
                  initial={mergedAnimationVariants.initial}
                  animate={mergedAnimationVariants.animate}
                  transition={{ duration: 0.2 }}
                >
                  {tab.content}
                </motion.div>
              ) : (
                isActive && tab.content
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Main render
  return (
    <div 
      className={getContainerClasses()} 
      data-orientation={orientation}
      dir={direction}
    >
      {/* Tab list */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={getTabListClasses()}
        onKeyDown={handleKeyDown}
        {...tabListProps}
      >
        {renderTabButtons()}
      </div>
      
      {/* Tab content */}
      <div className={getTabContentClasses()}>
        {renderTabContent()}
      </div>
    </div>
  );
}