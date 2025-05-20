'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

/**
 * Interface for the NewsletterSignup component props
 */
interface NewsletterSignupProps {
  title?: string;
  subtitle?: string;
  successMessage?: string;
  errorMessage?: string;
  buttonText?: string;
  onSubmit?: (email: string) => Promise<void>;
  placeholderText?: string;
  backgroundColor?: string;
}

/**
 * NewsletterSignup Component
 * 
 * A component for collecting email subscriptions with form validation
 * and submission feedback.
 */
export default function NewsletterSignup({
  title = "Join the Community.",
  subtitle = "Join the journey and tap into a wealth of insider picks, rare offers, and local knowledge.",
  successMessage = "Thanks for subscribing!",
  errorMessage = "There was an error. Please try again.",
  buttonText = "Submit",
  onSubmit,
  placeholderText = "you@example.com",
  backgroundColor = "bg-brand-olive-50"
}: NewsletterSignupProps) {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  /**
   * Validate email format using a regular expression
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    setStatus('idle');
    
    try {
      if (onSubmit) {
        // Use custom submission handler if provided
        await onSubmit(email);
      } else {
        // Default behavior with simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Success feedback
      setStatus('success');
      setMessage(successMessage);
      setEmail('');
    } catch (error) {
      // Error feedback
      setStatus('error');
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle email input changes
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear any existing messages when user starts typing again
    if (message) {
      setMessage('');
      setStatus('idle');
    }
  };

  return (
    <section className={`py-12 md:py-20 ${backgroundColor}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-4 font-brooklyn">{title}</h2>
          <p className="text-gray-700 text-lg mb-8 font-brooklyn">{subtitle}</p>
          
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto" aria-label="Newsletter signup form">
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder={placeholderText}
                className="flex-grow px-4 py-3 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-olive-400 focus:border-transparent font-brooklyn"
                required
                aria-label="Email address"
                aria-invalid={status === 'error'}
                aria-describedby={message ? "newsletter-feedback" : undefined}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 sm:mt-0 px-6 py-3 bg-brand-olive-400 text-white font-medium rounded-r sm:rounded-l-none hover:bg-brand-olive-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-olive-400 focus:ring-offset-2 disabled:opacity-70 font-brooklyn"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : buttonText}
              </button>
            </div>
            
            {message && (
              <p 
                id="newsletter-feedback"
                className={`mt-2 text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}
                aria-live="polite"
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}