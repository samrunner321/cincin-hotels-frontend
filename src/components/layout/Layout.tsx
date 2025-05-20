'use client';

import React from 'react';
import { LayoutProps } from '../../types/layout';
import { useEnhancedTranslations } from '../i18n/EnhancedTranslationsProvider';

/**
 * Layout component that serves as a wrapper for the page content
 * Navbar and Footer are now included in the global app layout
 * 
 * This component provides RTL support for the entire page layout
 */
export default function Layout({ children }: LayoutProps): React.ReactElement {
  const { direction, isRtl } = useEnhancedTranslations();
  
  return (
    <div dir={direction} className={isRtl ? 'rtl' : 'ltr'}>
      {/* Navbar is rendered in the global layout */}
      {children}
      {/* Footer is rendered in the global layout */}
    </div>
  );
}