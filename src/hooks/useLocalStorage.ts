'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for working with localStorage
 * 
 * @param key - The key to store data under in localStorage
 * @param initialValue - The default value if the key doesn't exist in localStorage
 * @returns Array containing state value and setter function
 */
export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Flag to track if component is mounted (for client-side rendering)
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Update localStorage when state changes
  const setValue = (value: T): void => {
    try {
      // Allow value to be a function for setter pattern
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage (only on client)
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Utility function to safely get data from localStorage
 * 
 * @param key - The localStorage key to retrieve
 * @param defaultValue - Default value if key doesn't exist
 * @returns The parsed value from localStorage or defaultValue
 */
export const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  // Return default on server-side
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Utility function to safely set data in localStorage
 * 
 * @param key - The localStorage key to set
 * @param value - Value to store
 * @returns true if successful, false otherwise
 */
export const setToStorage = <T,>(key: string, value: T): boolean => {
  // Return false on server-side
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Utility function to safely remove a key from localStorage
 * 
 * @param key - The localStorage key to remove
 */
export const removeFromStorage = (key: string): void => {
  // Do nothing on server-side
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};
