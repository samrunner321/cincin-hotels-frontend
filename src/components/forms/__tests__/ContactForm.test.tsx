import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../ContactForm';

// Mock BaseForm
jest.mock('../../ui/forms/BaseForm', () => {
  return {
    __esModule: true,
    default: ({ 
      fields, 
      onSubmit, 
      submitButtonText,
      submittingButtonText,
      className,
      layout,
      resetOnSuccess,
      hiddenFields,
      submitButtonAlignment
    }: any) => {
      // Simuliere den Formular-Submit
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        fields.forEach((field: any) => {
          if (field.id === 'name') formData.append(field.id, 'Test Name');
          else if (field.id === 'email') formData.append(field.id, 'test@example.com');
          else if (field.id === 'subject') formData.append(field.id, 'Test Subject');
          else if (field.id === 'message') formData.append(field.id, 'Test Message Content');
          else formData.append(field.id, '');
        });
        
        // Füge versteckte Felder hinzu
        if (hiddenFields) {
          Object.entries(hiddenFields).forEach(([key, value]) => {
            formData.append(key, value);
          });
        }
        
        if (onSubmit) {
          await onSubmit(formData, {});
        }
      };
      
      // Simuliere Absenden-Status
      const [isSubmitting, setIsSubmitting] = React.useState(false);
      
      const mockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await handleSubmit(e);
        // Kurze Verzögerung für Tests
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsSubmitting(false);
      };
      
      return (
        <form 
          data-testid="base-form" 
          onSubmit={mockSubmit}
          className={className}
          data-layout={layout}
          data-reset-on-success={resetOnSuccess ? 'true' : 'false'}
          data-submit-alignment={submitButtonAlignment}
        >
          {fields.map((field: any) => (
            <div key={field.id} data-testid={`field-${field.id}`}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                type={field.type === 'textarea' ? 'text' : field.type}
                id={field.id}
                name={field.id}
                required={field.required}
                placeholder={field.placeholder}
              />
            </div>
          ))}
          <button type="submit">
            {isSubmitting ? submittingButtonText : submitButtonText}
          </button>
        </form>
      );
    }
  };
});

describe('ContactForm Component', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue({ success: true });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly with default props', () => {
    render(<ContactForm />);
    
    // Prüfe, ob die BaseForm-Komponente gerendert wurde
    expect(screen.getByTestId('base-form')).toBeInTheDocument();
    
    // Prüfe, ob der Standardtitel angezeigt wird
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    
    // Prüfe, ob alle Felder vorhanden sind
    expect(screen.getByTestId('field-name')).toBeInTheDocument();
    expect(screen.getByTestId('field-email')).toBeInTheDocument();
    expect(screen.getByTestId('field-subject')).toBeInTheDocument();
    expect(screen.getByTestId('field-message')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    const title = 'Custom Contact Title';
    const description = 'Custom contact form description';
    
    render(
      <ContactForm 
        title={title} 
        description={description} 
      />
    );
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('passes correct props to BaseForm', () => {
    const submitButtonText = 'Custom Submit';
    const submittingButtonText = 'Sending Form...';
    const hiddenFields = { source: 'website' };
    
    render(
      <ContactForm 
        submitButtonText={submitButtonText}
        submittingButtonText={submittingButtonText}
        layout="grid"
        hiddenFields={hiddenFields}
      />
    );
    
    const baseForm = screen.getByTestId('base-form');
    expect(baseForm).toHaveAttribute('data-layout', 'grid');
    expect(baseForm).toHaveAttribute('data-reset-on-success', 'true');
    expect(baseForm).toHaveAttribute('data-submit-alignment', 'full');
    
    // Prüfe, ob der richtige Submit-Button-Text verwendet wird
    expect(screen.getByRole('button')).toHaveTextContent(submitButtonText);
  });

  it('calls onSubmit when the form is submitted', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Simuliere das Absenden des Formulars
    fireEvent.submit(screen.getByTestId('base-form'));
    
    // Prüfe, ob onSubmit aufgerufen wurde
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('shows submitting state during form submission', async () => {
    const submitButtonText = 'Send Message';
    const submittingButtonText = 'Sending...';
    
    render(
      <ContactForm 
        onSubmit={mockOnSubmit} 
        submitButtonText={submitButtonText}
        submittingButtonText={submittingButtonText}
      />
    );
    
    // Simuliere das Absenden des Formulars
    fireEvent.submit(screen.getByTestId('base-form'));
    
    // Submitting-Text sollte angezeigt werden
    expect(screen.getByRole('button')).toHaveTextContent(submittingButtonText);
    
    // Warte, bis der Submit abgeschlossen ist
    await waitFor(() => {
      // Nach dem Absenden sollte der ursprüngliche Text wieder angezeigt werden
      expect(screen.getByRole('button')).toHaveTextContent(submitButtonText);
    });
  });

  it('handles form submission with default handler when no onSubmit is provided', async () => {
    render(<ContactForm />);
    
    // Simuliere das Absenden des Formulars
    fireEvent.submit(screen.getByTestId('base-form'));
    
    // Warte auf das Ende der Submission
    await waitFor(() => {
      // Wenn wir hier ankommen, wurde kein Fehler geworfen
      expect(screen.getByTestId('base-form')).toBeInTheDocument();
    });
  });
});