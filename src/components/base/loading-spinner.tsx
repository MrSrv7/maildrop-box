'use client'

import React from 'react'

/**
 * Loading spinner size types
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Loading spinner variant types
 */
export type SpinnerVariant = 'default' | 'primary' | 'secondary' | 'muted'

/**
 * Loading spinner props interface
 */
export interface LoadingSpinnerProps {
  /**
   * Spinner size
   * @default 'md'
   */
  size?: SpinnerSize
  
  /**
   * Spinner visual variant
   * @default 'default'
   */
  variant?: SpinnerVariant
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Optional text to display alongside spinner
   */
  text?: string
  
  /**
   * Whether to center the spinner in its container
   * @default false
   */
  center?: boolean
  
  /**
   * Custom color for the spinner (overrides variant)
   */
  color?: string
}

/**
 * Get size-specific styles
 */
const getSizeStyles = (size: SpinnerSize): string => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4', 
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }
  
  return sizes[size]
}

/**
 * Get text size styles based on spinner size
 */
const getTextSizeStyles = (size: SpinnerSize): string => {
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  }
  
  return textSizes[size]
}

/**
 * Get variant-specific color styles
 */
const getVariantStyles = (variant: SpinnerVariant): string => {
  const variants = {
    default: 'text-gray-600 dark:text-gray-400',
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-500 dark:text-gray-500',
    muted: 'text-gray-400 dark:text-gray-600'
  }
  
  return variants[variant]
}

/**
 * Loading Spinner Component
 * 
 * A reusable loading spinner component with multiple sizes and variants.
 * Can be used standalone or with accompanying text.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LoadingSpinner />
 * 
 * // With text
 * <LoadingSpinner text="Loading..." />
 * 
 * // Large primary spinner
 * <LoadingSpinner size="lg" variant="primary" />
 * 
 * // Centered with custom styling
 * <LoadingSpinner center className="my-8" />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  text,
  center = false,
  color
}) => {
  const spinnerClasses = [
    'animate-spin',
    getSizeStyles(size),
    !color && getVariantStyles(variant),
    className
  ].filter(Boolean).join(' ')
  
  const containerClasses = [
    'inline-flex items-center',
    center && 'justify-center w-full',
    text && 'gap-2'
  ].filter(Boolean).join(' ')
  
  const textClasses = [
    getTextSizeStyles(size),
    !color && getVariantStyles(variant),
    'font-medium'
  ].filter(Boolean).join(' ')

  const spinnerStyle = color ? { color } : {}
  const textStyle = color ? { color } : {}

  const spinner = (
    <svg
      className={spinnerClasses}
      style={spinnerStyle}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  if (text) {
    return (
      <div className={containerClasses} role="status" aria-live="polite">
        {spinner}
        <span className={textClasses} style={textStyle}>
          {text}
        </span>
      </div>
    )
  }

  if (center) {
    return (
      <div className={containerClasses} role="status" aria-live="polite">
        {spinner}
      </div>
    )
  }

  return (
    <div role="status" aria-live="polite" className="inline-block">
      {spinner}
    </div>
  )
}

/**
 * Export default for easier imports
 */
export default LoadingSpinner
