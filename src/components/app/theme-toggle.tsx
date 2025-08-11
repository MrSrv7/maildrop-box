'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

/**
 * ThemeOption represents a single theme configuration
 */
interface ThemeOption {
  /** The theme identifier used by next-themes */
  value: string
  /** Display label for the theme option */
  label: string
  /** Icon component representing the theme */
  icon: React.ComponentType<{ className?: string }>
}

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
 * ThemeToggle Component
 * 
 * A modern, accessible theme toggle component that provides a dropdown interface
 * for switching between light, dark, and system themes. Features smooth animations,
 * keyboard navigation, and proper accessibility attributes.
 * 
 * @example
 * ```tsx
 * // Basic usage in a navbar
 * import { ThemeToggle } from '@/components/app/theme-toggle'
 * 
 * export function Navbar() {
 *   return (
 *     <nav className="flex items-center justify-between p-4">
 *       <div>Your Logo</div>
 *       <ThemeToggle />
 *     </nav>
 *   )
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Usage in a settings panel
 * import { ThemeToggle } from '@/components/app/theme-toggle'
 * 
 * export function SettingsPanel() {
 *   return (
 *     <div className="space-y-4">
 *       <div className="flex items-center justify-between">
 *         <span>Theme Preference</span>
 *         <ThemeToggle />
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 */
export const ThemeToggle = React.memo(() => {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Find current theme option - use resolvedTheme for better detection
  const currentTheme = THEME_OPTIONS.find(option => option.value === theme) || THEME_OPTIONS[2]
  const CurrentIcon = currentTheme.icon

  // Handle theme selection
  const handleThemeSelect = useCallback((selectedTheme: string) => {
    setTheme(selectedTheme)
    setIsOpen(false)
    setActiveIndex(0)
    
    // Return focus to button after selection
    setTimeout(() => {
      buttonRef.current?.focus()
    }, 0)
  }, [setTheme])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          buttonRef.current?.focus()
          break
        case 'ArrowDown':
          event.preventDefault()
          setActiveIndex(prev => (prev + 1) % THEME_OPTIONS.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setActiveIndex(prev => (prev - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleThemeSelect(THEME_OPTIONS[activeIndex].value)
          break
        case 'Home':
          event.preventDefault()
          setActiveIndex(0)
          break
        case 'End':
          event.preventDefault()
          setActiveIndex(THEME_OPTIONS.length - 1)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, activeIndex, handleThemeSelect])

  // Toggle dropdown
  const handleToggle = () => {
    setIsOpen(prev => !prev)
    if (!isOpen) {
      // Set active index to current theme when opening
      const currentIndex = THEME_OPTIONS.findIndex(option => option.value === theme)
      setActiveIndex(currentIndex >= 0 ? currentIndex : 2) // Default to system (index 2)
    }
  }

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
    )
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

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full z-50 mt-2 w-40 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
          role="listbox"
          aria-label="Theme options"
        >
          <div className="rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {THEME_OPTIONS.map((option, index) => {
              const Icon = option.icon
              const isSelected = option.value === theme
              const isActive = index === activeIndex

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
  )
})

ThemeToggle.displayName = 'ThemeToggle'

/**
 * Export for easier imports
 */
export default ThemeToggle
