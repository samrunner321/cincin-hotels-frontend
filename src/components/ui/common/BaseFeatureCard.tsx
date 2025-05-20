/**
 * BaseFeatureCard Component - Simplified version
 * 
 * A foundational card component for feature displays in CinCin Hotels application.
 */

import React from 'react';
import { BaseLayoutProps, BaseAnimationProps } from '../../../types/advanced-ui';

export interface BaseFeatureCardProps extends BaseLayoutProps, BaseAnimationProps {
  /** Title text for the card */
  title: string;
  /** Description text */
  description?: string;
  /** Additional content */
  children?: React.ReactNode;
  /** Custom class names */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * BaseFeatureCard provides a consistent foundation for feature cards
 * This component is temporarily simplified to enable build completion.
 */
const BaseFeatureCard: React.FC<BaseFeatureCardProps> = ({
  title,
  description,
  children,
  className = '',
  style,
}) => {
  return (
    <div 
      className={`p-4 shadow rounded bg-white ${className}`}
      style={style}
    >
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
      
      {children}
    </div>
  );
};

export default React.memo(BaseFeatureCard);