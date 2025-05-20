'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import BaseForm, { FormField } from '../ui/forms/BaseForm';
import styles from './ContactForm.module.css';

export interface ClientContactFormProps {
  /** CSS-Klassen für die Formular-Komponente */
  className?: string;
  /** Handler für das Absenden des Formulars */
  onSubmit?: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  /** Text für den Absenden-Button */
  submitButtonText?: string;
  /** Text für den Absenden-Button während des Absendens */
  submittingButtonText?: string;
  /** Überschrift für das Formular */
  title?: string;
  /** Beschreibung/Text über dem Formular */
  description?: string;
  /** Zusätzliche versteckte Felder */
  hiddenFields?: Record<string, string>;
  /** Layout des Formulars */
  layout?: 'vertical' | 'horizontal' | 'grid';
}

/**
 * ClientContactForm Komponente
 * 
 * Eine Client-Komponente für das Kontaktformular, mit validierung
 */
export default function ClientContactForm({
  className = '',
  onSubmit,
  submitButtonText = 'Send Message',
  submittingButtonText = 'Sending...',
  title = 'Contact Us',
  description,
  hiddenFields = {},
  layout = 'vertical'
}: ClientContactFormProps) {
  // Definiere die Formularfelder mit validierung
  const contactFormFields: FormField[] = [
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      placeholder: 'Your name',
      required: true,
      validate: (value) => {
        if (typeof value === 'string' && value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        return null;
      }
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'your.email@example.com',
      required: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'subject',
      type: 'text',
      label: 'Subject',
      placeholder: 'What is your message about?',
      required: false
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Please write your message here...',
      required: true,
      rows: 5,
      validate: (value) => {
        if (typeof value === 'string' && value.trim().length < 10) {
          return 'Message must be at least 10 characters long';
        }
        return null;
      }
    }
  ];

  // Handler für das Absenden des Formulars mit zusätzlicher Validierung
  const handleSubmit = async (formData: FormData): Promise<{ success: boolean; message?: string }> => {
    // Erweiterte Validierung könnte hier hinzugefügt werden

    // Wenn ein onSubmit-Handler übergeben wurde, verwende diesen
    if (onSubmit) {
      return await onSubmit(formData);
    }

    // Standard-Erfolgsfall
    return { 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon!' 
    };
  };

  return (
    <div className={cn(styles.contactFormWrapper, className)}>
      {/* Formular-Header */}
      {(title || description) && (
        <div className={styles.formHeader}>
          {title && <h2 className={styles.formTitle}>{title}</h2>}
          {description && <p className={styles.formDescription}>{description}</p>}
        </div>
      )}
      
      {/* BaseForm-Komponente */}
      <BaseForm
        fields={contactFormFields}
        onSubmit={handleSubmit}
        submitButtonText={submitButtonText}
        submittingButtonText={submittingButtonText}
        className={styles.contactForm}
        layout={layout}
        resetOnSuccess={true}
        hiddenFields={hiddenFields}
        submitButtonAlignment="full"
      />
    </div>
  );
}