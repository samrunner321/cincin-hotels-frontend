'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export type FeatureIconType = 'mountains' | 'default';

export interface FeatureItemProps {
  /** Icon-Typ, der angezeigt werden soll */
  icon: FeatureIconType;
  /** Titel des Features */
  title?: string;
  /** Beschreibung des Features */
  description: string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * FeatureItem Komponente
 * 
 * Zeigt ein Feature mit Icon, Titel und Beschreibung an.
 * 
 * @example
 * <FeatureItem 
 *   icon="mountains" 
 *   title="Bergblick" 
 *   description="Panoramablick auf die umliegende Berglandschaft" 
 * />
 */
export default function FeatureItem({ 
  icon, 
  title, 
  description, 
  className = '' 
}: FeatureItemProps): JSX.Element {
  const renderIcon = (): JSX.Element => {
    switch (icon) {
      case 'mountains':
        return (
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 31.6667L20 11.6667L31.6667 31.6667H8.33333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33333 31.6667L10 21.6667L16.6667 31.6667H3.33333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21.6667 31.6667L30 18.3334L38.3333 31.6667H21.6667Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 31.6667L20 11.6667L31.6667 31.6667H8.33333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };
  
  return (
    <div className={cn("flex items-start mb-4", className)}>
      <div className="mr-4 mt-1" aria-hidden="true">
        {renderIcon()}
      </div>
      <div>
        {title && <h3 className="text-base font-normal mb-1">{title}</h3>}
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}