import React from 'react';

/**
 * Standard-Typen für Formularfelder
 */
export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'date'
  | 'datetime-local'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'textarea'
  | 'file'
  | 'hidden';

/**
 * Interface für generische Formular-Validierungsoptionen
 */
export interface FormValidationOptions {
  /** Ist das Feld erforderlich? */
  required?: boolean;
  /** Minimale Länge */
  minLength?: number;
  /** Maximale Länge */
  maxLength?: number;
  /** Minimaler Wert für numerische Felder */
  min?: number;
  /** Maximaler Wert für numerische Felder */
  max?: number;
  /** Regulärer Ausdruck zur Validierung */
  pattern?: RegExp;
  /** Benutzerdefinierte Validierungsfunktion */
  validate?: (value: any) => boolean | string;
}

/**
 * Interface für Validierungsfehler
 */
export interface FormValidationErrors {
  /** Key ist der Feldname, Wert ist die Fehlermeldung */
  [key: string]: string;
}

/**
 * Interface für generische Formularstatus
 */
export interface FormStatus {
  /** Wird das Formular gerade abgesendet? */
  isSubmitting: boolean;
  /** War das Absenden erfolgreich? */
  isSuccess: boolean;
  /** Ist ein Fehler aufgetreten? */
  isError: boolean;
  /** Fehlermeldung, falls vorhanden */
  errorMessage?: string;
  /** Erfolgsmeldung, falls vorhanden */
  successMessage?: string;
  /** Wurde das Formular verändert? */
  isDirty: boolean;
  /** Ist das Formular gültig? */
  isValid: boolean;
}

/**
 * Interface für Formularaktionen (für useReducer)
 */
export type FormAction = 
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'VALIDATE'; errors?: FormValidationErrors }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; message?: string }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET' }
  | { type: 'SET_DIRTY'; isDirty: boolean };

/**
 * Interface für die Rückgabe des useForm-Hooks
 */
export interface UseFormReturn<T extends Record<string, any>> {
  /** Formulardaten */
  values: T;
  /** Formularstatus */
  status: FormStatus;
  /** Validierungsfehler */
  errors: FormValidationErrors;
  /** Handler für Feldänderungen */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Handler für Feldblur (Verlassen eines Feldes) */
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Handler für Formularabsenden */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** Feld manuell setzen */
  setFieldValue: (field: string, value: any) => void;
  /** Formular zurücksetzen */
  resetForm: () => void;
  /** Alle Felder validieren */
  validateForm: () => boolean;
}

/**
 * Interface für Kontaktformulardaten
 */
export interface ContactFormData {
  /** Name des Kontakts */
  name: string;
  /** E-Mail */
  email: string;
  /** Betreff */
  subject: string;
  /** Nachricht */
  message: string;
  /** Newsletter-Anmeldung */
  newsletter?: boolean;
}

/**
 * Interface für einfache Mitgliedschaftsformulardaten
 */
export interface BasicMembershipFormData {
  /** Vorname */
  firstName: string;
  /** Nachname */
  lastName: string;
  /** E-Mail */
  email: string;
  /** Telefonnummer */
  phone?: string;
  /** Adresse */
  address?: string;
  /** Stadt */
  city?: string;
  /** Land */
  country?: string;
  /** PLZ */
  postalCode?: string;
  /** Mitgliedschaftstyp */
  membershipType: 'basic' | 'premium' | 'vip';
  /** Newsletter-Anmeldung */
  newsletter: boolean;
  /** Akzeptierte Bedingungen */
  acceptedTerms: boolean;
}