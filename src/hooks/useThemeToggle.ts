'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from 'next-themes';

/**
 * ThemeOption represents a single theme configuration
 */
export interface ThemeOption {
  /** The theme identifier used by next-themes */
  value: string;
  /** Display label for the theme option */
  label: string;
  /** Icon component representing the theme */
  icon: React.ComponentType<{ className?: string }>;
}

interface UseThemeToggleReturn {
  theme: string | undefined;
  currentTheme: ThemeOption;
  isOpen: boolean;
  mounted: boolean;
  activeIndex: number;
  dropdownRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  handleToggle: () => void;
  handleThemeSelect: (selectedTheme: string) => void;
  setActiveIndex: (value: React.SetStateAction<number>) => void;
}

/**
 * Custom hook for managing theme toggle functionality
 * 
 * @param themeOptions - Array of available theme options
 * @returns Object with theme toggle state and handlers
 */
export const useThemeToggle = (themeOptions: ThemeOption[]): UseThemeToggleReturn => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Find current theme option
  const currentTheme = themeOptions.find(option => option.value === theme) || themeOptions[2]; // Default to system

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme selection
  const handleThemeSelect = useCallback((selectedTheme: string) => {
    setTheme(selectedTheme);
    setIsOpen(false);
    setActiveIndex(0);
    
    // Return focus to button after selection
    setTimeout(() => {
      buttonRef.current?.focus();
    }, 0);
  }, [setTheme]);

  // Toggle dropdown
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      // Set active index to current theme when opening
      const currentIndex = themeOptions.findIndex(option => option.value === theme);
      setActiveIndex(currentIndex >= 0 ? currentIndex : 2); // Default to system (index 2)
    }
  }, [isOpen, theme, themeOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setActiveIndex(prev => (prev + 1) % themeOptions.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setActiveIndex(prev => (prev - 1 + themeOptions.length) % themeOptions.length);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleThemeSelect(themeOptions[activeIndex].value);
          break;
        case 'Home':
          event.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setActiveIndex(themeOptions.length - 1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, activeIndex, handleThemeSelect, themeOptions]);

  return {
    theme,
    currentTheme,
    isOpen,
    mounted,
    activeIndex,
    dropdownRef: dropdownRef as React.RefObject<HTMLDivElement>,
    buttonRef: buttonRef as React.RefObject<HTMLButtonElement>,
    handleToggle,
    handleThemeSelect,
    setActiveIndex
  };
};

export default useThemeToggle;
