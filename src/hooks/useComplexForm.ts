'use client';

/**
 * useComplexForm Hook
 * 
 * A comprehensive form management hook for CinCin Hotels application
 * with validation, submission handling, and multi-step support.
 */

import { useState, useCallback, useReducer, useEffect } from 'react';

type FieldValue = string | number | boolean | null | undefined;

interface FormField<T extends Record<string, FieldValue>> {
  name: keyof T;
  label?: string;
  type?: string;
  required?: boolean;
  validator?: (value: FieldValue, formValues: T) => string | null;
  dependencies?: Array<keyof T>;
}

interface ValidationErrors<T extends Record<string, FieldValue>> {
  [key: string]: string | null;
}

type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

interface FormOptions<T extends Record<string, FieldValue>> {
  /** Initial form values */
  initialValues: T;
  
  /** Field definitions with validation rules */
  fields?: FormField<T>[];
  
  /** Whether to validate on change */
  validateOnChange?: boolean;
  
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  
  /** Whether to validate all fields on submit */
  validateOnSubmit?: boolean;
  
  /** Custom validation function */
  validate?: (values: T) => ValidationErrors<T> | Promise<ValidationErrors<T>>;
  
  /** Callback when form is submitted successfully */
  onSubmit?: (values: T) => void | Promise<any>;
  
  /** Callback when form submission fails */
  onError?: (error: any) => void;
  
  /** For multi-step forms, the total number of steps */
  totalSteps?: number;
  
  /** For multi-step forms, the initial step */
  initialStep?: number;
  
  /** Enable debug mode */
  debug?: boolean;
}

interface ComplexFormState<T extends Record<string, FieldValue>> {
  values: T;
  errors: ValidationErrors<T>;
  touched: Record<keyof T, boolean>;
  status: FormStatus;
  submitError: string | null;
  isValid: boolean;
  isDirty: boolean;
  currentStep: number;
}

type FormAction<T extends Record<string, FieldValue>> =
  | { type: 'SET_VALUE'; field: keyof T; value: FieldValue }
  | { type: 'SET_VALUES'; values: Partial<T> }
  | { type: 'SET_TOUCHED'; field: keyof T }
  | { type: 'SET_ERRORS'; errors: ValidationErrors<T> }
  | { type: 'SET_FIELD_ERROR'; field: keyof T; error: string | null }
  | { type: 'SET_STATUS'; status: FormStatus }
  | { type: 'SET_SUBMIT_ERROR'; error: string | null }
  | { type: 'RESET_FORM' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

function createFormReducer<T extends Record<string, FieldValue>>(initialValues: T, totalSteps: number, initialStep: number) {
  return function formReducer(state: ComplexFormState<T>, action: FormAction<T>): ComplexFormState<T> {
    switch (action.type) {
      case 'SET_VALUE':
        return {
          ...state,
          values: {
            ...state.values,
            [action.field]: action.value,
          },
          isDirty: true,
        };
        
      case 'SET_VALUES':
        return {
          ...state,
          values: {
            ...state.values,
            ...action.values,
          },
          isDirty: true,
        };
        
      case 'SET_TOUCHED':
        return {
          ...state,
          touched: {
            ...state.touched,
            [action.field]: true,
          },
        };
        
      case 'SET_ERRORS':
        return {
          ...state,
          errors: action.errors,
          isValid: Object.values(action.errors).every(error => error === null || error === undefined),
        };
        
      case 'SET_FIELD_ERROR':
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.field]: action.error,
          },
          isValid: action.error === null && 
            Object.entries(state.errors)
              .filter(([key]) => key !== String(action.field))
              .every(([_, value]) => value === null || value === undefined),
        };
        
      case 'SET_STATUS':
        return {
          ...state,
          status: action.status,
        };
        
      case 'SET_SUBMIT_ERROR':
        return {
          ...state,
          submitError: action.error,
          status: action.error ? 'error' : state.status,
        };
        
      case 'RESET_FORM':
        return {
          values: initialValues,
          errors: {} as ValidationErrors<T>,
          touched: {} as Record<keyof T, boolean>,
          status: 'idle',
          submitError: null,
          isValid: true,
          isDirty: false,
          currentStep: initialStep,
        };
        
      case 'GO_TO_STEP':
        const step = Math.max(1, Math.min(action.step, totalSteps));
        return {
          ...state,
          currentStep: step,
        };
        
      case 'NEXT_STEP':
        return {
          ...state,
          currentStep: Math.min(state.currentStep + 1, totalSteps),
        };
        
      case 'PREV_STEP':
        return {
          ...state,
          currentStep: Math.max(state.currentStep - 1, 1),
        };
        
      default:
        return state;
    }
  };
}

interface ComplexFormResult<T extends Record<string, FieldValue>> {
  /** Current form values */
  values: T;
  
  /** Validation errors by field */
  errors: ValidationErrors<T>;
  
  /** Fields that have been touched */
  touched: Record<keyof T, boolean>;
  
  /** Form submission status */
  status: FormStatus;
  
  /** Form-level submission error */
  submitError: string | null;
  
  /** Whether the form is valid */
  isValid: boolean;
  
  /** Whether the form has been modified */
  isDirty: boolean;
  
  /** For multi-step forms, the current step */
  currentStep: number;
  
  /** For multi-step forms, the total number of steps */
  totalSteps: number;
  
  /** Change handler for form fields */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  
  /** Blur handler for form fields */
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  
  /** Set a field value directly */
  setFieldValue: (field: keyof T, value: FieldValue) => void;
  
  /** Set multiple field values at once */
  setValues: (values: Partial<T>) => void;
  
  /** Set a field as touched */
  setFieldTouched: (field: keyof T) => void;
  
  /** Set a field error directly */
  setFieldError: (field: keyof T, error: string | null) => void;
  
  /** Validate the form or specific fields */
  validateForm: (fields?: Array<keyof T>) => Promise<boolean>;
  
  /** Reset the form to initial values */
  resetForm: () => void;
  
  /** Submit the form programmatically */
  submitForm: () => Promise<void>;
  
  /** Get props for a form field */
  getFieldProps: (field: keyof T) => {
    name: string;
    value: FieldValue;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  };
  
  /** For multi-step forms, go to a specific step */
  goToStep: (step: number) => void;
  
  /** For multi-step forms, go to the next step */
  nextStep: () => void;
  
  /** For multi-step forms, go to the previous step */
  prevStep: () => void;
  
  /** Whether the current step is the first step */
  isFirstStep: boolean;
  
  /** Whether the current step is the last step */
  isLastStep: boolean;
}

/**
 * A hook for managing complex forms with validation and multi-step support
 */
export function useComplexForm<T extends Record<string, FieldValue>>({
  initialValues,
  fields = [],
  validateOnChange = true,
  validateOnBlur = true,
  validateOnSubmit = true,
  validate,
  onSubmit,
  onError,
  totalSteps = 1,
  initialStep = 1,
  debug = false,
}: FormOptions<T>): ComplexFormResult<T> {
  // Create field name to field mapping for quick lookups
  const fieldMap = fields.reduce((acc, field) => {
    acc[field.name] = field;
    return acc;
  }, {} as Record<keyof T, FormField<T>>);
  
  // Initialize form reducer
  const [state, dispatch] = useReducer(
    createFormReducer<T>(initialValues, totalSteps, initialStep),
    {
      values: initialValues,
      errors: {} as ValidationErrors<T>,
      touched: {} as Record<keyof T, boolean>,
      status: 'idle',
      submitError: null,
      isValid: true,
      isDirty: false,
      currentStep: initialStep,
    }
  );
  
  // Debug logging
  useEffect(() => {
    if (debug) {
      console.group('ComplexForm Debug');
      console.log('Values:', state.values);
      console.log('Errors:', state.errors);
      console.log('Touched:', state.touched);
      console.log('Status:', state.status);
      console.log('Valid:', state.isValid);
      console.log('Step:', state.currentStep);
      console.groupEnd();
    }
  }, [debug, state]);
  
  // Validate a single field
  const validateField = useCallback(async (field: keyof T): Promise<string | null> => {
    const value = state.values[field];
    const fieldConfig = fieldMap[field];
    
    // Skip validation if field is not defined in fields
    if (!fieldConfig) {
      return null;
    }
    
    // Check required
    if (fieldConfig.required && (value === undefined || value === null || value === '')) {
      return `${fieldConfig.label || String(field)} is required`;
    }
    
    // Run field validator
    if (fieldConfig.validator) {
      return fieldConfig.validator(value, state.values);
    }
    
    return null;
  }, [state.values, fieldMap]);
  
  // Validate the entire form or specific fields
  const validateForm = useCallback(async (fieldsToValidate?: Array<keyof T>): Promise<boolean> => {
    dispatch({ type: 'SET_STATUS', status: 'validating' });
    
    try {
      // Use custom validator if provided
      if (validate) {
        const errors = await validate(state.values);
        dispatch({ type: 'SET_ERRORS', errors });
        return Object.values(errors).every(error => !error);
      }
      
      // Determine which fields to validate
      const fieldKeys = fieldsToValidate || Object.keys(state.values) as Array<keyof T>;
      
      // Validate each field
      const newErrors: ValidationErrors<T> = {} as ValidationErrors<T>;
      await Promise.all(
        fieldKeys.map(async field => {
          newErrors[field as string] = await validateField(field);
        })
      );
      
      dispatch({ type: 'SET_ERRORS', errors: newErrors });
      const isValid = Object.values(newErrors).every(error => !error);
      
      return isValid;
    } catch (error) {
      if (debug) {
        console.error('Validation error:', error);
      }
      
      return false;
    } finally {
      dispatch({ type: 'SET_STATUS', status: 'idle' });
    }
  }, [validate, state.values, validateField, debug]);
  
  // Handle field change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const fieldName = name as keyof T;
    
    // Handle different input types
    let finalValue: FieldValue = value;
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }
    
    dispatch({ type: 'SET_VALUE', field: fieldName, value: finalValue });
    
    // Validate on change if enabled
    if (validateOnChange) {
      // Validate the field that changed
      validateField(fieldName).then(error => {
        dispatch({ type: 'SET_FIELD_ERROR', field: fieldName, error });
        
        // Validate dependent fields
        const fieldConfig = fieldMap[fieldName];
        if (fieldConfig?.dependencies?.length) {
          fieldConfig.dependencies.forEach(dependentField => {
            validateField(dependentField).then(error => {
              dispatch({ type: 'SET_FIELD_ERROR', field: dependentField, error });
            });
          });
        }
      });
    }
  }, [validateOnChange, validateField, fieldMap]);
  
  // Handle field blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    const fieldName = name as keyof T;
    
    dispatch({ type: 'SET_TOUCHED', field: fieldName });
    
    // Validate on blur if enabled
    if (validateOnBlur) {
      validateField(fieldName).then(error => {
        dispatch({ type: 'SET_FIELD_ERROR', field: fieldName, error });
      });
    }
  }, [validateOnBlur, validateField]);
  
  // Set field value directly
  const setFieldValue = useCallback((field: keyof T, value: FieldValue) => {
    dispatch({ type: 'SET_VALUE', field, value });
    
    // Validate if needed
    if (validateOnChange) {
      validateField(field).then(error => {
        dispatch({ type: 'SET_FIELD_ERROR', field, error });
        
        // Validate dependent fields
        const fieldConfig = fieldMap[field];
        if (fieldConfig?.dependencies?.length) {
          fieldConfig.dependencies.forEach(dependentField => {
            validateField(dependentField).then(error => {
              dispatch({ type: 'SET_FIELD_ERROR', field: dependentField, error });
            });
          });
        }
      });
    }
  }, [validateOnChange, validateField, fieldMap]);
  
  // Set multiple values at once
  const setValues = useCallback((values: Partial<T>) => {
    dispatch({ type: 'SET_VALUES', values });
    
    // Validate if needed
    if (validateOnChange) {
      const fieldsToValidate = Object.keys(values) as Array<keyof T>;
      validateForm(fieldsToValidate);
    }
  }, [validateOnChange, validateForm]);
  
  // Set field as touched
  const setFieldTouched = useCallback((field: keyof T) => {
    dispatch({ type: 'SET_TOUCHED', field });
    
    // Validate if needed
    if (validateOnBlur) {
      validateField(field).then(error => {
        dispatch({ type: 'SET_FIELD_ERROR', field, error });
      });
    }
  }, [validateOnBlur, validateField]);
  
  // Set field error directly
  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    dispatch({ type: 'SET_FIELD_ERROR', field, error });
  }, []);
  
  // Reset form to initial values
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);
  
  // Submit form
  const submitForm = useCallback(async () => {
    // Validate first if enabled
    if (validateOnSubmit) {
      const isValid = await validateForm();
      if (!isValid) {
        if (onError) {
          onError(new Error('Form validation failed'));
        }
        dispatch({ type: 'SET_SUBMIT_ERROR', error: 'Please correct the errors in the form' });
        return;
      }
    }
    
    // If multi-step and not on the last step, just go to the next step
    if (totalSteps > 1 && state.currentStep < totalSteps) {
      dispatch({ type: 'NEXT_STEP' });
      return;
    }
    
    // Submit the form
    dispatch({ type: 'SET_STATUS', status: 'submitting' });
    
    try {
      if (onSubmit) {
        await onSubmit(state.values);
      }
      
      dispatch({ type: 'SET_STATUS', status: 'success' });
      dispatch({ type: 'SET_SUBMIT_ERROR', error: null });
    } catch (error) {
      dispatch({ type: 'SET_STATUS', status: 'error' });
      
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during submission';
      dispatch({ type: 'SET_SUBMIT_ERROR', error: errorMessage });
      
      if (onError) {
        onError(error);
      }
      
      if (debug) {
        console.error('Form submission error:', error);
      }
    }
  }, [validateOnSubmit, validateForm, onSubmit, onError, totalSteps, state.currentStep, state.values, debug]);
  
  // Get props for a form field
  const getFieldProps = useCallback((field: keyof T) => {
    return {
      name: String(field),
      value: state.values[field] ?? '',
      onChange: handleChange,
      onBlur: handleBlur,
    };
  }, [state.values, handleChange, handleBlur]);
  
  // Multi-step form navigation
  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'GO_TO_STEP', step });
  }, []);
  
  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);
  
  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);
  
  // Calculate step indicators
  const isFirstStep = state.currentStep === 1;
  const isLastStep = state.currentStep === totalSteps;
  
  return {
    // State
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    status: state.status,
    submitError: state.submitError,
    isValid: state.isValid,
    isDirty: state.isDirty,
    currentStep: state.currentStep,
    totalSteps,
    
    // Event handlers
    handleChange,
    handleBlur,
    
    // Form actions
    setFieldValue,
    setValues,
    setFieldTouched,
    setFieldError,
    validateForm,
    resetForm,
    submitForm,
    getFieldProps,
    
    // Multi-step form
    goToStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
  };
}