'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '../../../lib/utils';

export interface CategoryButtonProps {
  /** Icon Element (SVG oder andere Komponente) */
  icon: React.ReactNode;
  /** Name/Label der Kategorie */
  name: string;
  /** URL, zu der der Button verlinkt */
  url: string;
  /** Ob der Button aktiv/ausgewählt ist */
  isActive?: boolean;
  /** Optionale onClick-Funktion */
  onClick?: () => void;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * CategoryButton Komponente
 * 
 * Zeigt einen Kategorie-Button mit Icon und Text an, der als Link zu einer Kategorie funktioniert.
 * 
 * @example
 * <CategoryButton 
 *   icon={<BeachIcon />} 
 *   name="Strand" 
 *   url="/categories/beach" 
 *   isActive={true} 
 * />
 */
export default function CategoryButton({ 
  icon, 
  name, 
  url, 
  isActive = false, 
  onClick = () => {}, 
  className = '' 
}: CategoryButtonProps): JSX.Element {
  return (
    <Link 
      href={url}
      className={cn(
        "flex flex-col items-center min-w-[80px] transition-all",
        isActive && "font-medium",
        className
      )}
      onClick={onClick}
      aria-label={`Browse ${name} hotels`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="mb-2 w-12 h-12 flex items-center justify-center text-black">
        {icon}
      </div>
      <span className="text-sm text-center">{name}</span>
    </Link>
  );
}