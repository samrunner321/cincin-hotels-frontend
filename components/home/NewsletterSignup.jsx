'use client';

import { useState } from 'react';

export default function NewsletterSignup({
  title = "Join the Community.",
  subtitle = "Join the journey and tap into a wealth of insider picks, rare offers, and local knowledge."
}) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      // In a real app, this would be an API call to your newsletter service
      // For demonstration, we're simulating a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Thanks for subscribing!');
      setEmail('');
    } catch (error) {
      setMessage('There was an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-20 bg-brand-olive-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-4 font-brooklyn">{title}</h2>
          <p className="text-gray-700 text-lg mb-8 font-brooklyn">{subtitle}</p>
          
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-grow px-4 py-3 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-olive-400 focus:border-transparent font-brooklyn"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 sm:mt-0 px-6 py-3 bg-brand-olive-400 text-white font-medium rounded-r sm:rounded-l-none hover:bg-brand-olive-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-olive-400 focus:ring-offset-2 disabled:opacity-70 font-brooklyn"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            
            {message && (
              <p className={`mt-2 text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}