'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;

export default function MembershipForm() {
  const formRef = useRef(null);
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
  
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Validate form fields
  const errors = useMemo(() => {
    const validationErrors = {};
    
    if (touchedFields.firstName && !formData.firstName.trim()) {
      validationErrors.firstName = 'First name is required';
    }
    
    if (touchedFields.lastName && !formData.lastName.trim()) {
      validationErrors.lastName = 'Last name is required';
    }
    
    if (touchedFields.hotelName && !formData.hotelName.trim()) {
      validationErrors.hotelName = 'Hotel name is required';
    }
    
    if (touchedFields.email) {
      if (!formData.email.trim()) {
        validationErrors.email = 'Email address is required';
      } else if (!EMAIL_REGEX.test(formData.email)) {
        validationErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (touchedFields.website) {
      if (!formData.website.trim()) {
        validationErrors.website = 'Website URL is required';
      } else if (!URL_REGEX.test(formData.website)) {
        validationErrors.website = 'Please enter a valid website URL';
      }
    }
    
    if (touchedFields.agreeToTerms && !formData.agreeToTerms) {
      validationErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    return validationErrors;
  }, [formData, touchedFields]);

  // Check if the form is valid
  const isFormValid = useMemo(() => {
    return Object.keys(errors).length === 0 && 
      formData.firstName.trim() && 
      formData.lastName.trim() && 
      formData.hotelName.trim() && 
      formData.email.trim() && 
      EMAIL_REGEX.test(formData.email) && 
      formData.website.trim() && 
      URL_REGEX.test(formData.website) && 
      formData.agreeToTerms;
  }, [errors, formData]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Mark field as touched
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({
        ...prev,
        [name]: true
      }));
    }
  }, [touchedFields]);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);
    
    // Check if form is valid
    if (!isFormValid) {
      // Focus the first field with an error
      const firstErrorField = formRef.current?.querySelector('[aria-invalid="true"]');
      firstErrorField?.focus();
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setSuccess(true);
      
      // Scroll to top on success
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'There was an error submitting your application. Please try again.');
      
      // Scroll error into view
      setTimeout(() => {
        document.querySelector('.error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isFormValid]);

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      setFormData({
        firstName: '',
        lastName: '',
        hotelName: '',
        email: '',
        phone: '',
        website: '',
        about: '',
        agreeToTerms: false
      });
      setSuccess(false);
      setError(null);
      setIsSubmitting(false);
      setTouchedFields({});
    };
  }, []);

  // Field renderer to reduce repetition
  const renderField = useCallback(({ name, label, type = 'text', placeholder, required = false, icon = null }) => {
    const hasError = touchedFields[name] && errors[name];
    
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          id={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={`${placeholder}${required ? '*' : ''}`}
          required={required}
          aria-required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={`w-full border-b ${hasError ? 'border-red-500' : 'border-gray-300'} py-2 ${icon ? 'pl-6' : 'px-0'} focus:outline-none focus:border-black transition-colors`}
        />
        
        {hasError && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }, [formData, touchedFields, errors, handleChange, handleBlur]);

  if (success) {
    return (
      <div className="max-w-lg mx-auto p-8 bg-gray-50 rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-green-500">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 className="text-2xl font-normal mb-4 text-center">Thank you for your application</h2>
        <p className="mb-6 text-center">We've received your application and will be in touch shortly.</p>
        <div className="text-center">
          <Link href="/" className="text-black underline hover:text-gray-700 transition-colors">
            Return to homepage
          </Link>
        </div>
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
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md error-message" role="alert">
            {error}
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-6">* Required fields</p>
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Row with First name and Last name */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {renderField({
                name: 'firstName',
                label: 'First name',
                placeholder: 'First name',
                required: true
              })}
            </div>
            <div>
              {renderField({
                name: 'lastName',
                label: 'Last name',
                placeholder: 'Last name',
                required: true
              })}
            </div>
          </div>
          
          {/* Hotel name */}
          {renderField({
            name: 'hotelName',
            label: 'Hotel name',
            placeholder: 'Hotel name',
            required: true
          })}
          
          {/* Email address */}
          {renderField({
            name: 'email',
            label: 'Email address',
            type: 'email',
            placeholder: 'Email address',
            required: true
          })}
          
          {/* Phone number */}
          {renderField({
            name: 'phone',
            label: 'Phone number',
            type: 'tel',
            placeholder: 'Phone number'
          })}
          
          {/* Hotel website */}
          {renderField({
            name: 'website',
            label: 'Hotel website',
            type: 'url',
            placeholder: 'Hotel website',
            required: true,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            )
          })}
          
          {/* About property */}
          <div className="relative">
            <textarea
              name="about"
              id="about"
              value={formData.about}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tell us about your property"
              rows={6}
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black rounded-md transition-colors"
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
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={touchedFields.agreeToTerms && errors.agreeToTerms ? 'true' : 'false'}
                aria-describedby={touchedFields.agreeToTerms && errors.agreeToTerms ? 'agreeToTerms-error' : undefined}
                className={`h-4 w-4 ${touchedFields.agreeToTerms && errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-black`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="text-gray-700">
                I agree to the CinCin Hotels Terms & Conditions and have read the Privacy Policy. *
              </label>
              {touchedFields.agreeToTerms && errors.agreeToTerms && (
                <p id="agreeToTerms-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>
          </div>
          
          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-3 rounded-md flex items-center hover:bg-gray-800 transition-colors disabled:opacity-70"
              aria-busy={isSubmitting}
              aria-live="polite"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}