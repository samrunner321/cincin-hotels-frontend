'use client';
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import styles from './BaseForm.module.css';

/**
 * Typ für die Meldung nach dem Absenden des Formulars
 */
export type FormSubmitMessage = {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
};

/**
 * Formular-Feld Konfiguration
 */
export interface FormField {
  /** Eindeutige ID des Feldes */
  id: string;
  /** Typ des Eingabefeldes */
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'file' | 'date' | 'time' | 'datetime-local';
  /** Anzeigename des Feldes */
  label: string;
  /** Platzhaltertext */
  placeholder?: string;
  /** Ob das Feld erforderlich ist */
  required?: boolean;
  /** Ob das Feld deaktiviert ist */
  disabled?: boolean;
  /** Standard-Wert des Feldes */
  defaultValue?: string | boolean | number;
  /** Zusätzliche HTML-Attribute */
  attributes?: Record<string, string | number | boolean>;
  /** Optionen für Select, Radio, etc. */
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  /** Validierungsfunktion */
  validate?: (value: any) => string | null;
  /** Hilfetexte */
  helpText?: string;
  /** CSS-Klassen */
  className?: string;
  /** Anzahl der Zeilen für Textarea */
  rows?: number;
  /** Icon vor dem Eingabefeld */
  icon?: React.ReactNode;
}

/**
 * Eigenschaften für die BaseForm-Komponente
 */
export interface BaseFormProps {
  /** Formular-Felder */
  fields?: FormField[];
  /** Handler für das Absenden des Formulars */
  onSubmit?: (formData: FormData, rawData: Record<string, any>) => Promise<{ success: boolean; message?: string }>;
  /** Text für den Absenden-Button */
  submitButtonText?: string;
  /** Text für den Absenden-Button während des Absendens */
  submittingButtonText?: string;
  /** CSS-Klassen */
  className?: string;
  /** Layout des Formulars */
  layout?: 'vertical' | 'horizontal' | 'grid';
  /** Anzahl der Spalten bei Grid-Layout */
  columns?: 1 | 2 | 3 | 4;
  /** Form-ID für HTML */
  id?: string;
  /** CSS-Klassen für Felder */
  fieldClassName?: string;
  /** CSS-Klassen für Labels */
  labelClassName?: string;
  /** CSS-Klassen für Inputs */
  inputClassName?: string;
  /** CSS-Klassen für den Absende-Button */
  submitButtonClassName?: string;
  /** CSS-Klassen für Statusmeldungen */
  messageClassName?: string;
  /** Automatisches Zurücksetzen nach erfolgreichem Absenden */
  resetOnSuccess?: boolean;
  /** Kinder-Elemente (für Custom-Felder etc.) */
  children?: React.ReactNode;
  /** Callback bei erfolgreichem Absenden */
  onSuccess?: (data: FormData) => void;
  /** Callback bei Fehler */
  onError?: (error: Error) => void;
  /** Zusätzliche Felder, die dem FormData hinzugefügt werden aber nicht angezeigt werden */
  hiddenFields?: Record<string, string>;
  /** Ausrichtung des Submit-Buttons */
  submitButtonAlignment?: 'left' | 'center' | 'right' | 'full';
}

/**
 * BaseForm-Komponente
 * 
 * Eine flexible Formular-Komponente, die verschiedene Layouts, 
 * Status-Management und Validierung unterstützt.
 * 
 * @example
 * <BaseForm
 *   fields={[
 *     {
 *       id: 'name',
 *       type: 'text',
 *       label: 'Name',
 *       required: true
 *     },
 *     {
 *       id: 'email',
 *       type: 'email',
 *       label: 'E-Mail',
 *       required: true
 *     }
 *   ]}
 *   onSubmit={handleSubmit}
 *   submitButtonText="Senden"
 * />
 */
export default function BaseForm({
  fields = [],
  onSubmit,
  submitButtonText = 'Submit',
  submittingButtonText = 'Submitting...',
  className = '',
  layout = 'vertical',
  columns = 1,
  id,
  fieldClassName = '',
  labelClassName = '',
  inputClassName = '',
  submitButtonClassName = '',
  messageClassName = '',
  resetOnSuccess = true,
  children,
  onSuccess,
  onError,
  hiddenFields = {},
  submitButtonAlignment = 'left'
}: BaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<FormSubmitMessage | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Initialisiere Formularwerte mit Standardwerten
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    setFormValues(initialValues);
  }, [fields]);

  /**
   * Validiert ein einzelnes Feld
   */
  const validateField = (field: FormField, value: any): string | null => {
    // Pflichtfeld-Validierung
    if (field.required && 
        (value === undefined || 
         value === null || 
         (typeof value === 'string' && value.trim() === '') ||
         (typeof value === 'boolean' && value === false))) {
      return `${field.label} ist erforderlich`;
    }
    
    // Benutzerdefinierte Validierung wenn vorhanden
    if (field.validate && value !== undefined && value !== '') {
      return field.validate(value);
    }
    
    // Typ-spezifische Validierungen
    if (value !== undefined && value !== '') {
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
      }
      
      if (field.type === 'url' && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
        return 'Bitte geben Sie eine gültige URL ein';
      }
      
      if (field.type === 'tel' && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
        return 'Bitte geben Sie eine gültige Telefonnummer ein';
      }
    }
    
    return null;
  };

  /**
   * Validiert alle Felder im Formular
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    fields.forEach(field => {
      const value = formValues[field.id];
      const errorMessage = validateField(field, value);
      
      if (errorMessage) {
        newErrors[field.id] = errorMessage;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  /**
   * Aktualisiert ein Feld
   */
  const handleFieldChange = (fieldId: string, value: any) => {
    // Aktualisiere Formularwerte
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Lösche Fehler für dieses Feld
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
    
    // Finde das Feld zur Validierung
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const errorMessage = validateField(field, value);
      if (errorMessage) {
        setErrors(prev => ({
          ...prev,
          [fieldId]: errorMessage
        }));
      }
    }
  };

  /**
   * Setzt das Formular zurück
   */
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    
    // Setze auf Standard-Werte zurück
    const initialValues: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    
    setFormValues(initialValues);
    setErrors({});
    setSubmitMessage(null);
  };

  /**
   * Handler für die Formular-Einreichung
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage(null);
    
    // Validiere das Formular
    if (!validateForm()) {
      setSubmitMessage({
        type: 'error',
        text: 'Bitte korrigieren Sie die markierten Felder'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Erstelle FormData-Objekt
      const formData = new FormData(event.currentTarget);
      
      // Füge versteckte Felder hinzu
      Object.entries(hiddenFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      if (onSubmit) {
        const result = await onSubmit(formData, formValues);
        
        if (result.success) {
          setSubmitMessage({ 
            type: 'success', 
            text: result.message || 'Formular erfolgreich abgesendet' 
          });
          
          if (resetOnSuccess) {
            resetForm();
          }
          
          if (onSuccess) {
            onSuccess(formData);
          }
        } else {
          setSubmitMessage({ 
            type: 'error', 
            text: result.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.' 
          });
        }
      } else {
        // Standardverhalten wenn kein onSubmit-Handler angegeben ist
        setSubmitMessage({ 
          type: 'success', 
          text: 'Formular erfolgreich abgesendet' 
        });
        
        if (resetOnSuccess) {
          resetForm();
        }
        
        if (onSuccess) {
          onSuccess(formData);
        }
      }
    } catch (error) {
      console.error('Fehler beim Absenden des Formulars:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten' 
      });
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Rendert ein einzelnes Formularfeld
   */
  const renderField = (field: FormField) => {
    const { 
      id, type, label, placeholder, required, disabled, 
      attributes = {}, options = [], helpText, className = '',
      rows = 4, icon 
    } = field;
    
    const value = formValues[id] !== undefined ? formValues[id] : '';
    const error = errors[id];
    const isInvalid = !!error;
    
    // Gemeinsame Attribute für alle Felder
    const commonProps = {
      id,
      name: id,
      disabled: disabled || isSubmitting,
      required,
      'aria-invalid': isInvalid,
      'aria-describedby': helpText || error ? `${id}-description` : undefined,
      ...attributes
    };
    
    // Basis-Klassen für Inputs
    const baseInputClasses = cn(
      styles.input,
      inputClassName,
      isInvalid && styles.inputError,
      disabled && styles.inputDisabled,
      className
    );
    
    // Container für das Feld
    return (
      <div 
        key={id} 
        className={cn(
          styles.formField,
          styles[`field${layout.charAt(0).toUpperCase() + layout.slice(1)}`],
          fieldClassName
        )}
      >
        {/* Label (vor dem Input für die meisten Typen, nach dem Input für Checkbox) */}
        {type !== 'checkbox' && (
          <label 
            htmlFor={id} 
            className={cn(
              styles.label,
              required && styles.required,
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        
        {/* Wrapper für Input mit möglichem Icon */}
        <div className={cn(styles.inputWrapper, icon && styles.hasIcon)}>
          {icon && <span className={styles.inputIcon}>{icon}</span>}
          
          {/* Input-Felder nach Typ */}
          {type === 'textarea' ? (
            <textarea
              {...commonProps}
              className={baseInputClasses}
              placeholder={placeholder}
              rows={rows}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              value={value || ''}
            />
          ) : type === 'select' ? (
            <select
              {...commonProps}
              className={baseInputClasses}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              value={value || ''}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value} 
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'checkbox' ? (
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                {...commonProps}
                className={cn(styles.checkbox, className)}
                checked={!!value}
                onChange={(e) => handleFieldChange(id, e.target.checked)}
              />
              <label 
                htmlFor={id} 
                className={cn(
                  styles.checkboxLabel,
                  required && styles.required,
                  labelClassName
                )}
              >
                {label}
              </label>
            </div>
          ) : type === 'radio' ? (
            <div className={styles.radioGroup}>
              {options.map((option) => (
                <div key={option.value} className={styles.radioOption}>
                  <input
                    type="radio"
                    id={`${id}-${option.value}`}
                    name={id}
                    value={option.value}
                    checked={value === option.value}
                    disabled={disabled || option.disabled || isSubmitting}
                    onChange={() => handleFieldChange(id, option.value)}
                    className={cn(styles.radio, className)}
                  />
                  <label htmlFor={`${id}-${option.value}`} className={styles.radioLabel}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <input
              type={type}
              {...commonProps}
              className={baseInputClasses}
              placeholder={placeholder}
              onChange={(e) => {
                const newValue = type === 'number' 
                  ? parseFloat(e.target.value) 
                  : e.target.value;
                handleFieldChange(id, newValue);
              }}
              value={value !== undefined && value !== null ? value : ''}
            />
          )}
        </div>
        
        {/* Hilfetexte und Fehlermeldungen */}
        {(helpText || error) && (
          <div
            id={`${id}-description`}
            className={cn(
              styles.fieldMessage,
              error ? styles.errorMessage : styles.helpText
            )}
          >
            {error || helpText}
          </div>
        )}
      </div>
    );
  };

  // CSS-Klassen für das Formular
  const formClasses = cn(
    styles.baseForm,
    styles[`form${layout.charAt(0).toUpperCase() + layout.slice(1)}`],
    layout === 'grid' && styles[`grid${columns}Cols`],
    className
  );
  
  // CSS-Klassen für den Submit-Button
  const submitButtonClasses = cn(
    styles.submitButton,
    styles[`submitAlign${submitButtonAlignment.charAt(0).toUpperCase() + submitButtonAlignment.slice(1)}`],
    isSubmitting && styles.submitting,
    submitButtonClassName
  );
  
  // CSS-Klassen für Statusmeldungen
  const messageClasses = (type: string) => cn(
    styles.message,
    styles[`message${type.charAt(0).toUpperCase() + type.slice(1)}`],
    messageClassName
  );

  return (
    <form
      ref={formRef}
      id={id}
      className={formClasses}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Formularfelder */}
      <div className={cn(
        styles.formFields,
        layout === 'grid' && styles.formFieldsGrid
      )}>
        {fields.map(renderField)}
        
        {/* Kinder-Elemente (z.B. benutzerdefinierte Felder) */}
        {children}
      </div>
      
      {/* Statusmeldung */}
      {submitMessage && (
        <div className={messageClasses(submitMessage.type)}>
          {submitMessage.text}
        </div>
      )}
      
      {/* Submit-Button */}
      <div className={styles.formActions}>
        <button
          type="submit"
          disabled={isSubmitting}
          className={submitButtonClasses}
        >
          {isSubmitting ? submittingButtonText : submitButtonText}
        </button>
      </div>
    </form>
  );
}