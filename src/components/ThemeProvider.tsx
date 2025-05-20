'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultTheme, darkTheme, ThemeContextType } from '../styles/theme';

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  colorMode: 'light',
  setColorMode: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultColorMode?: 'light' | 'dark';
}

/**
 * ThemeProvider component
 * 
 * Provides theme context to the application, including theme switching functionality.
 * Uses localStorage to persist theme preference when available.
 */
export default function ThemeProvider({ 
  children,
  defaultColorMode = 'light'
}: ThemeProviderProps) {
  // State for color mode
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(defaultColorMode);
  
  // Effect to initialize color mode from localStorage or system preference
  useEffect(() => {
    // Check for saved preference
    const savedColorMode = localStorage.getItem('colorMode') as 'light' | 'dark' | null;
    
    if (savedColorMode) {
      setColorMode(savedColorMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Check system preference
      setColorMode('dark');
    }
    
    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('colorMode')) {
        setColorMode(e.matches ? 'dark' : 'light');
      }
    };
    
    // Add listener if supported
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);
  
  // Effect to apply color mode to document
  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('colorMode', colorMode);
    
    // Apply color mode to document
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorMode]);
  
  // Handler to set color mode
  const handleSetColorMode = (mode: 'light' | 'dark') => {
    setColorMode(mode);
  };
  
  // Get current theme based on color mode
  const theme = colorMode === 'dark' ? darkTheme : defaultTheme;
  
  // Context value
  const contextValue: ThemeContextType = {
    theme,
    colorMode,
    setColorMode: handleSetColorMode,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}