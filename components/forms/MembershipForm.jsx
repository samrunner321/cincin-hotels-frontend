'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MembershipForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    hotelName: '',
    email: '',
    phone: '',
    website: '',
    about: '',
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <h2 className="text-2xl font-normal mb-4">Thank you for your application</h2>
        <p className="mb-6">We've received your application and will be in touch shortly.</p>
        <Link href="/" className="text-black underline">
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-16 py-16 px-4 max-w-7xl mx-auto">
      {/* Left side - Heading */}
      <div>
        <h1 className="text-4xl md:text-5xl font-normal mb-6">
          Apply now to become a member of CinCin Hotels.
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Join our exclusive collection of boutique hotels and enjoy the benefits of being part of the CinCin Hotels family.
        </p>
      </div>
      
      {/* Right side - Form */}
      <div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
            {error}
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-6">* Required fields</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row with First name and Last name */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name*"
                required
                className="w-full border-b border-gray-300 py-2 px-0 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name*"
                required
                className="w-full border-b border-gray-300 py-2 px-0 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          
          {/* Hotel name */}
          <div>
            <input
              type="text"
              name="hotelName"
              id="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              placeholder="Hotel name*"
              required
              className="w-full border-b border-gray-300 py-2 px-0 focus:outline-none focus:border-black"
            />
          </div>
          
          {/* Email address */}
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address*"
              required
              className="w-full border-b border-gray-300 py-2 px-0 focus:outline-none focus:border-black"
            />
          </div>
          
          {/* Phone number */}
          <div>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="w-full border-b border-gray-300 py-2 px-0 focus:outline-none focus:border-black"
            />
          </div>
          
          {/* Hotel website */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <input
              type="url"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Hotel website*"
              required
              className="w-full border-b border-gray-300 py-2 pl-6 focus:outline-none focus:border-black"
            />
          </div>
          
          {/* About property */}
          <div>
            <textarea
              name="about"
              id="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about your property"
              rows={6}
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black rounded-md"
            ></textarea>
          </div>
          
          {/* Terms agreement */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="agreeToTerms"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="h-4 w-4 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="text-gray-700">
                I agree to the CinCin Hotels Terms & Conditions and have read the Privacy Policy. *
              </label>
            </div>
          </div>
          
          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-3 rounded-md flex items-center hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
              {!isSubmitting && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}