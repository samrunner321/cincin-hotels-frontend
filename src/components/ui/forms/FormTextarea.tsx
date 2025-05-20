import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

/**
 * Props für die FormTextarea-Komponente
 */
export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label des Textarea-Felds */
  label?: string;
  /** Fehlermeldung, falls vorhanden */
  error?: string;
  /** Zusätzliche CSS-Klassen für den Container */
  containerClassName?: string;
  /** Zusätzliche CSS-Klassen für das Label */
  labelClassName?: string;
  /** Zusätzliche CSS-Klassen für die Fehlermeldung */
  errorClassName?: string;
  /** Hilfetext unter dem Textarea */
  helpText?: string;
  /** ID des Textarea-Felds */
  id?: string;
  /** Gibt an, ob das Feld erforderlich ist */
  required?: boolean;
}

/**
 * FormTextarea-Komponente
 * 
 * Wiederverwendbare Textarea-Komponente mit Label, Fehlermeldung und Hilfetext
 * 
 * @example
 * <FormTextarea
 *   name="message"
 *   label="Your Message"
 *   required
 *   error={errors.message}
 *   value={values.message}
 *   onChange={handleChange}
 *   rows={6}
 * />
 */
const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ 
    label, 
    error, 
    containerClassName, 
    labelClassName, 
    errorClassName, 
    helpText, 
    className,
    id,
    name,
    required,
    ...rest 
  }, ref) => {
    // Generiere eine ID für das Textarea-Feld, falls nicht angegeben
    const textareaId = id || name || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    
    // Generiere eine ID für den Fehlertext
    const errorId = `${textareaId}-error`;
    
    return (
      <div className={cn("mb-4", containerClassName)}>
        {label && (
          <label 
            htmlFor={textareaId} 
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...rest}
        />
        
        {error && (
          <p 
            id={errorId}
            className={cn(
              "mt-1 text-xs text-red-600",
              errorClassName
            )}
          >
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;