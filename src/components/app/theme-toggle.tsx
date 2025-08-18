'use client'

import React, { memo } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useThemeToggle, ThemeOption } from '@/hooks/useThemeToggle'

/**
 * Available theme options with their configurations
 */
const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
  },
]

/**
 * Improved Theme Toggle component with enhanced accessibility and animations
 */
export const ThemeToggle = memo(() => {
  const {
    theme,
    currentTheme,
    isOpen,
    mounted,
    activeIndex,
    dropdownRef,
    buttonRef,
    handleToggle,
    handleThemeSelect,
  } = useThemeToggle(THEME_OPTIONS);
  
  const CurrentIcon = currentTheme.icon;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer focus:outline-none"
          disabled
          aria-label="Loading theme toggle..."
        >
          <Monitor className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main toggle button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="group flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 cursor-pointer"
        aria-label={`Current theme: ${currentTheme.label}. Click to open theme selector.`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={`Current theme: ${currentTheme.label}`}
      >
        <CurrentIcon 
          className={`h-6 w-6 transition-all duration-200 ${
            theme === 'light' 
              ? 'text-orange-600' 
              : theme === 'dark'
              ? 'text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          } ${isOpen ? 'rotate-12 scale-110' : 'group-hover:rotate-6 group-hover:scale-105'}`}
        />
      </button>

      {/* Dropdown menu with improved a11y */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full z-50 mt-2 w-40 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
          role="listbox"
          aria-label="Theme options"
        >
          <div className="rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {THEME_OPTIONS.map((option, index) => {
              const Icon = option.icon;
              const isSelected = option.value === theme;
              const isActive = index === activeIndex;

              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeSelect(option.value)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                >
                  <Icon 
                    className={`h-4 w-4 ${
                      option.value === 'light' 
                        ? 'text-orange-600' 
                        : option.value === 'dark'
                        ? 'text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <span className="flex-1 text-left">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

/**
 * Export for easier imports
 */
export default ThemeToggle;
