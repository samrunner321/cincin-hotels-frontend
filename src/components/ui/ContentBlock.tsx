'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ContentBlockProps {
  /** Titel des Content Blocks */
  title?: string;
  /** Inhalt des Content Blocks */
  children: React.ReactNode;
  /** Hintergrundfarbe als Tailwind-Klasse */
  bgColor?: string;
  /** Ausrichtung des Inhalts ('left' oder 'center') */
  align?: 'left' | 'center';
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * ContentBlock Komponente
 * 
 * Ein Container für strukturierten Content mit optionaler Animation beim Scrollen.
 * 
 * @example
 * <ContentBlock title="Über uns" bgColor="bg-gray-50" align="center">
 *   <p>Unser Unternehmen wurde 2020 gegründet...</p>
 * </ContentBlock>
 */
export default function ContentBlock({ 
  title, 
  children, 
  bgColor = 'bg-white',
  align = 'left',
  className = ''
}: ContentBlockProps): JSX.Element {
  return (
    <section className={cn("py-10 sm:py-12 md:py-16", bgColor, className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className={cn(
            "max-w-full sm:max-w-4xl mx-auto", 
            align === 'center' && "text-center"
          )}
        >
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-6 sm:mb-8">{title}</h2>
          )}
          <div className="prose prose-base sm:prose-lg max-w-none">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}