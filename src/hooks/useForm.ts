import { useState, useCallback, useEffect, useReducer, FormEvent, ChangeEvent, FocusEvent } from 'react';
import { FormStatus, FormValidationErrors, FormValidationOptions, FormAction, UseFormReturn } from '../types/forms';

// Standardwerte für Formularstatus
const initialFormStatus: FormStatus = {
  isSubmitting: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  successMessage: undefined,
  isDirty: false,
  isValid: true,
};

/**
 * Reducer für Formular-Aktionen
 */
function formStatusReducer(state: FormStatus, action: FormAction): FormStatus {
  switch (action.type) {
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        isSuccess: false,
        isError: false,
        errorMessage: undefined,
      };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        successMessage: action.message || 'Form submitted successfully',
        isDirty: false,
      };
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: action.error,
      };
    case 'VALIDATE':
      return {
        ...state,
        isValid: !action.errors || Object.keys(action.errors).length === 0,
      };
    case 'RESET':
      return {
        ...initialFormStatus,
      };
    case 'SET_DIRTY':
      return {
        ...state,
        isDirty: action.isDirty,
      };
    default:
      return state;
  }
}

/**
 * Hook für Formularvalidierung und -verwaltung
 * 
 * @param initialValues Anfangswerte für das Formular
 * @param onSubmit Callback-Funktion für das Absenden
 * @param validationSchema Validierungsschema für die Formularfelder
 * @returns Formularlogik und -zustand
 * 
 * @example
 * const { values, handleChange, handleSubmit, errors, status } = useForm({
 *   name: '',
 *   email: '',
 * }, async (values) => {
 *   await submitToApi(values);
 * });
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validationSchema?: Record<keyof T, FormValidationOptions>,
): UseFormReturn<T> {
  // Zustand für Formulardaten
  const [values, setValues] = useState<T>(initialValues);
  
  // Zustand für Validierungsfehler
  const [errors, setErrors] = useState<FormValidationErrors>({});
  
  // Reducer für Formularstatus
  const [status, dispatch] = useReducer(formStatusReducer, initialFormStatus);

  /**
   * Validiert einen einzelnen Feldwert
   */
  const validateField = useCallback((name: string, value: any): string | null => {
    if (!validationSchema || !validationSchema[name as keyof T]) {
      return null;
    }

    const fieldValidation = validationSchema[name as keyof T];

    // Prüfe auf Required
    if (fieldValidation.required && (value === undefined || value === null || value === '')) {
      return `${name} is required`;
    }

    // Prüfe auf Mindestlänge für Strings
    if (typeof value === 'string' && fieldValidation.minLength !== undefined && value.length < fieldValidation.minLength) {
      return `${name} must be at least ${fieldValidation.minLength} characters`;
    }

    // Prüfe auf Maximallänge für Strings
    if (typeof value === 'string' && fieldValidation.maxLength !== undefined && value.length > fieldValidation.maxLength) {
      return `${name} must be at most ${fieldValidation.maxLength} characters`;
    }

    // Prüfe auf Mindestwert für Zahlen
    if (typeof value === 'number' && fieldValidation.min !== undefined && value < fieldValidation.min) {
      return `${name} must be at least ${fieldValidation.min}`;
    }

    // Prüfe auf Höchstwert für Zahlen
    if (typeof value === 'number' && fieldValidation.max !== undefined && value > fieldValidation.max) {
      return `${name} must be at most ${fieldValidation.max}`;
    }

    // Prüfe auf Muster
    if (typeof value === 'string' && fieldValidation.pattern && !fieldValidation.pattern.test(value)) {
      return `${name} has an invalid format`;
    }

    // Benutzerdefinierte Validierung
    if (fieldValidation.validate) {
      const validateResult = fieldValidation.validate(value);
      if (typeof validateResult === 'string') {
        return validateResult;
      }
      if (validateResult === false) {
        return `${name} is invalid`;
      }
    }

    return null;
  }, [validationSchema]);

  /**
   * Validiert alle Formularfelder
   */
  const validateForm = useCallback((): boolean => {
    if (!validationSchema) {
      return true;
    }

    const newErrors: FormValidationErrors = {};
    let isValid = true;

    Object.entries(values).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    dispatch({ type: 'VALIDATE', errors: newErrors });
    return isValid;
  }, [values, validateField, validationSchema]);

  /**
   * Setzt ein Formularfeld
   */
  const setFieldValue = useCallback((field: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
    dispatch({ type: 'SET_DIRTY', isDirty: true });

    // Validiere das Feld, wenn ein Validierungsschema existiert
    if (validationSchema) {
      const error = validateField(field, value);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  }, [validateField, validationSchema]);

  /**
   * Handler für Änderungen an Formularfeldern
   */
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setFieldValue(name, fieldValue);
  }, [setFieldValue]);

  /**
   * Handler für Fokus-Verlust bei Formularfeldern (Blur)
   */
  const handleBlur = useCallback((
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // Validiere das Feld, wenn ein Validierungsschema existiert
    if (validationSchema) {
      const { name, value } = e.target;
      const error = validateField(name, value);
      
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  }, [validateField, validationSchema]);

  /**
   * Handler für Formular-Übermittlung
   */
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    // Formular validieren
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    
    // Absenden starten
    dispatch({ type: 'SUBMIT_START' });
    
    try {
      // Callback-Funktion aufrufen
      await onSubmit(values);
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (error) {
      dispatch({ 
        type: 'SUBMIT_ERROR', 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  }, [values, validateForm, onSubmit]);

  /**
   * Formular zurücksetzen
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    dispatch({ type: 'RESET' });
  }, [initialValues]);

  return {
    values,
    status,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    validateForm,
  };
}