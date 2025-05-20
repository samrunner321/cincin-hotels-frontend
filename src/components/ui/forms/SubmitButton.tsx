import React from 'react';
import { cn } from '../../../lib/utils';

/**
 * Props für die SubmitButton-Komponente
 */
export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ist der Button im Ladevorgang? */
  isLoading?: boolean;
  /** Text während des Ladevorgangs */
  loadingText?: string;
  /** Zeigt ein Icon nach dem Text an */
  showArrow?: boolean;
  /** Variante des Buttons */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Größe des Buttons */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SubmitButton-Komponente
 * 
 * Ein Button für Formular-Submits mit Ladezustand und verschiedenen Stilen
 * 
 * @example
 * <SubmitButton
 *   isLoading={isSubmitting}
 *   loadingText="Sending..."
 *   showArrow
 * >
 *   Send Message
 * </SubmitButton>
 */
export default function SubmitButton({
  children,
  isLoading = false,
  loadingText = 'Processing...',
  showArrow = false,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...rest
}: SubmitButtonProps): JSX.Element {
  // Styling basierend auf der Variante
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-brand-olive-600 text-white hover:bg-brand-olive-700',
    outline: 'bg-transparent text-black border border-black hover:bg-gray-100',
  }[variant];
  
  // Styling basierend auf der Größe
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  }[size];
  
  // Ist der Button deaktiviert?
  const isDisabled = disabled || isLoading;
  
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={cn(
        "rounded-md flex items-center justify-center transition-colors",
        variantStyles,
        sizeStyles,
        isDisabled && "opacity-70 cursor-not-allowed",
        className
      )}
      {...rest}
    >
      {isLoading ? loadingText : children}
      
      {isLoading && (
        <svg className="animate-spin ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && showArrow && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="ml-2 h-4 w-4"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      )}
    </button>
  );
}