'use client';

import { useState, useCallback } from 'react';
import { validateMaildropEmail, extractUsername } from '@/utils/validation';
import { EMAIL_DOMAIN } from '@/utils/constants';

interface UseEmailFormReturn {
  email: string;
  error: string;
  isValid: boolean;
  setEmail: (value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  resetForm: () => void;
}

interface UseEmailFormOptions {
  onSubmit?: (username: string) => void;
  domain?: string;
}

/**
 * Custom hook for managing email form state and validation
 * 
 * @param options - Configuration options for the form
 * @returns Form state and handlers
 */
export const useEmailForm = (options?: UseEmailFormOptions): UseEmailFormReturn => {
  const { onSubmit, domain = EMAIL_DOMAIN } = options || {};
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  /**
   * Handle input change
   * 
   * @param e - Input change event
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError(validateMaildropEmail(value, domain));
  }, [domain]);

  /**
   * Process form submission
   */
  const handleSubmit = useCallback(() => {
    // Validate one more time before submission
    const validationError = validateMaildropEmail(email, domain);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    if (email) {
      // Extract username from email or use as-is if it's just a username
      const username = extractUsername(email);
      
      if (onSubmit) {
        onSubmit(username);
      } else {
        window.location.href = `/inbox/${username}`;
      }
    }
  }, [email, domain, onSubmit]);

  /**
   * Reset the form
   */
  const resetForm = useCallback(() => {
    setEmail('');
    setError('');
  }, []);

  return {
    email,
    error,
    isValid: !error && email.length > 0,
    setEmail,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};

export default useEmailForm;
