import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import styles from './BaseInput.module.css';
import { useEnhancedTranslations } from '../../../components/i18n/EnhancedTranslationsProvider';

export type InputType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'tel' 
  | 'number' 
  | 'url' 
  | 'date' 
  | 'time' 
  | 'datetime-local' 
  | 'search' 
  | 'file' 
  | 'hidden';

export interface BaseInputProps {
  /** HTML-ID für das Input-Element */
  id: string;
  /** Name-Attribut für das Formular */
  name?: string;
  /** Label-Text */
  label?: string;
  /** Input-Typ */
  type?: InputType;
  /** Platzhaltertext */
  placeholder?: string;
  /** Ob das Feld erforderlich ist */
  required?: boolean;
  /** Ob das Feld deaktiviert ist */
  disabled?: boolean;
  /** Aktueller Wert */
  value?: string | number;
  /** Default-Wert */
  defaultValue?: string | number;
  /** CSS-Klassen für den Container */
  className?: string;
  /** CSS-Klassen für das Label */
  labelClassName?: string;
  /** CSS-Klassen für das Input-Element */
  inputClassName?: string;
  /** CSS-Klassen für die Fehlermeldung */
  errorClassName?: string;
  /** CSS-Klassen für den Hilfetext */
  helpTextClassName?: string;
  /** Ob das Label angezeigt werden soll */
  hideLabel?: boolean;
  /** Hilfetext unter dem Input */
  helpText?: string;
  /** Fehlermeldung */
  error?: string;
  /** Icon vor dem Input */
  icon?: React.ReactNode;
  /** Suffix nach dem Input */
  suffix?: React.ReactNode;
  /** Ist das Feld im Fokus? */
  focused?: boolean;
  /** Ob das Icon geklickt werden kann */
  iconClickable?: boolean;
  /** Wird das Feld gerade validiert? */
  validating?: boolean;
  /** Ist das Feld valid? */
  valid?: boolean;
  /** AutoComplete-Attribut */
  autoComplete?: string;
  /** Min-Attribut für number, date, etc. */
  min?: number | string;
  /** Max-Attribut für number, date, etc. */
  max?: number | string;
  /** Step-Attribut für number, date, etc. */
  step?: number | string;
  /** Pattern-Attribut für Validierung */
  pattern?: string;
  /** Input-Size */
  size?: 'small' | 'medium' | 'large';
  /** Führende Beschriftung (links vom Input) */
  prefix?: React.ReactNode;
  /** Change-Handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur-Handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Focus-Handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Icon-Click-Handler */
  onIconClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Keyboard-Handler */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Input-Mode für virtuelle Keyboards */
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  /** HTML-Attribute */
  [key: string]: any;
}

/**
 * BaseInput-Komponente
 * 
 * Eine flexible, umfassende Input-Komponente für alle Arten von Eingabefeldern.
 * 
 * @example
 * <BaseInput
 *   id="email"
 *   name="email"
 *   label="Email-Adresse"
 *   type="email"
 *   placeholder="name@example.com"
 *   required
 *   icon={<EmailIcon />}
 * />
 */
export default function BaseInput({
  id,
  name = id,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  value,
  defaultValue,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  helpTextClassName,
  hideLabel = false,
  helpText,
  error,
  icon,
  suffix,
  focused = false,
  iconClickable = false,
  validating = false,
  valid,
  autoComplete,
  min,
  max,
  step,
  pattern,
  size = 'medium',
  prefix,
  onChange,
  onBlur,
  onFocus,
  onIconClick,
  onKeyDown,
  inputMode,
  ...rest
}: BaseInputProps) {
  // Get RTL direction from context
  const { isRtl, direction } = useEnhancedTranslations();
  
  // Verwalte den Fokus-Zustand
  const [isFocused, setIsFocused] = useState(focused);
  // Input-Referenz für Fokus-Management
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Fokussiere das Input-Element bei focused-Prop-Änderung
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);
  
  // Focus-Handler
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus]);
  
  // Blur-Handler
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(event);
    }
  }, [onBlur]);
  
  // Icon-Click-Handler
  const handleIconClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (iconClickable && onIconClick) {
      onIconClick(event);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [iconClickable, onIconClick]);
  
  // CSS-Klassen berechnen
  const containerClasses = cn(
    styles.inputContainer,
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    disabled && styles.disabled,
    error && styles.hasError,
    isFocused && styles.focused,
    valid && !error && styles.valid,
    icon && styles.hasIcon,
    suffix && styles.hasSuffix,
    prefix && styles.hasPrefix,
    className
  );
  
  const labelClasses = cn(
    styles.label,
    required && styles.required,
    error && styles.labelError,
    labelClassName
  );
  
  const inputClasses = cn(
    styles.input,
    error && styles.inputError,
    valid && !error && styles.inputValid,
    icon && styles.withIcon,
    suffix && styles.withSuffix,
    prefix && styles.withPrefix,
    inputClassName
  );
  
  const errorClasses = cn(
    styles.errorMessage,
    errorClassName
  );
  
  const helpTextClasses = cn(
    styles.helpText,
    helpTextClassName
  );
  
  const iconWrapperClasses = cn(
    styles.iconWrapper,
    iconClickable && styles.clickable
  );
  
  // Zusätzliche Eigenschaften basierend auf Typ
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    id,
    name,
    type,
    placeholder,
    disabled,
    required,
    autoComplete,
    value: value !== undefined ? value : undefined,
    defaultValue: value === undefined && defaultValue !== undefined ? defaultValue : undefined,
    'aria-describedby': error || helpText ? `${id}-description` : undefined,
    'aria-invalid': !!error,
    min,
    max,
    step,
    pattern,
    inputMode,
    onChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onKeyDown,
    className: inputClasses,
    ...rest
  };
  
  return (
    <div className={containerClasses} dir={direction}>
      {/* Label, sofern nicht versteckt */}
      {label && !hideLabel && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      
      {/* Input-Wrapper für Icon, Prefix, Input und Suffix */}
      <div className={styles.inputWrapper}>
        {/* Prefix Element - Abhängig von RTL-Unterstützung */}
        {prefix && (
          <div className={cn(
            isRtl ? styles.prefixRtl : styles.prefix
          )}>
            {prefix}
          </div>
        )}
        
        {/* Icon - Abhängig von RTL-Unterstützung */}
        {icon && (
          <div 
            className={cn(
              isRtl ? styles.iconWrapperRtl : iconWrapperClasses
            )}
            onClick={handleIconClick}
            aria-hidden={!iconClickable}
          >
            {icon}
          </div>
        )}
        
        {/* Input Element */}
        <input
          ref={inputRef}
          {...inputProps}
          style={{ textAlign: isRtl ? 'right' : 'left' }}
        />
        
        {/* Suffix Element - Abhängig von RTL-Unterstützung */}
        {suffix && (
          <div className={cn(
            isRtl ? styles.suffixRtl : styles.suffix
          )}>
            {suffix}
          </div>
        )}
        
        {/* Validierungs-Indikator - Abhängig von RTL-Unterstützung */}
        {validating && (
          <div className={cn(
            isRtl ? styles.validatingRtl : styles.validating
          )} aria-hidden="true">
            <div className={styles.spinner}></div>
          </div>
        )}
        
        {/* Valid-Indikator - Abhängig von RTL-Unterstützung */}
        {valid && !error && !validating && (
          <div className={cn(
            isRtl ? styles.validIconRtl : styles.validIcon
          )} aria-hidden="true">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className={styles.checkIcon}
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Hilfetext oder Fehlermeldung */}
      <div className={styles.feedbackContainer} id={`${id}-description`}>
        {error ? (
          <div className={errorClasses}>{error}</div>
        ) : helpText ? (
          <div className={helpTextClasses}>{helpText}</div>
        ) : null}
      </div>
    </div>
  );
}