'use client'

import React, { forwardRef } from 'react'
import { type LucideIcon } from 'lucide-react'

/**
 * Input variant types
 */
export type InputVariant = 
  | 'default' 
  | 'error' 
  | 'success'
  | 'ghost'

/**
 * Input size types  
 */
export type InputSize = 'sm' | 'md' | 'lg'

/**
 * Input props interface
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input visual variant
   * @default 'default'
   */
  variant?: InputVariant
  
  /**
   * Input size
   * @default 'md'
   */
  size?: InputSize
  
  /**
   * Whether input is in loading state
   * @default false
   */
  loading?: boolean
  
  /**
   * Icon to display before input (from lucide-react)
   */
  leftIcon?: LucideIcon
  
  /**
   * Icon to display after input (from lucide-react)
   */
  rightIcon?: LucideIcon
  
  /**
   * Label text for the input
   */
  label?: string
  
  /**
   * Helper text displayed below the input
   */
  helperText?: string
  
  /**
   * Error message (overrides helperText when present)
   */
  error?: string
  
  /**
   * Whether the input should take full width
   * @default true
   */
  fullWidth?: boolean
  
  /**
   * Additional CSS classes for the input container
   */
  className?: string
  
  /**
   * Additional CSS classes for the input element
   */
  inputClassName?: string
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: InputVariant, hasError: boolean): string => {
  if (hasError) {
    return 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400'
  }
  
  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600 dark:focus:border-green-400 dark:focus:ring-green-400',
    ghost: 'border-transparent focus:border-gray-300 focus:ring-gray-300 dark:focus:border-gray-600 dark:focus:ring-gray-600'
  }
  
  return variants[variant]
}

/**
 * Get size-specific styles
 */
const getSizeStyles = (size: InputSize): string => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-3 py-2 text-sm h-10',
    lg: 'px-4 py-3 text-base h-12'
  }
  
  return sizes[size]
}

/**
 * Get icon size based on input size
 */
const getIconSize = (size: InputSize): string => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  return sizes[size]
}

/**
 * Get padding adjustments when icons are present
 */
const getIconPadding = (size: InputSize, hasLeftIcon: boolean, hasRightIcon: boolean): string => {
  const paddings = {
    sm: {
      left: hasLeftIcon ? 'pl-9' : '',
      right: hasRightIcon ? 'pr-9' : ''
    },
    md: {
      left: hasLeftIcon ? 'pl-10' : '',
      right: hasRightIcon ? 'pr-10' : ''
    },
    lg: {
      left: hasLeftIcon ? 'pl-12' : '',
      right: hasRightIcon ? 'pr-12' : ''
    }
  }
  
  return `${paddings[size].left} ${paddings[size].right}`.trim()
}

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<{ size: InputSize }> = ({ size }) => (
  <svg
    className={`animate-spin ${getIconSize(size)}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'default',
    size = 'md',
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    label,
    helperText,
    error,
    fullWidth = true,
    className = '',
    inputClassName = '',
    labelClassName = '',
    id,
    disabled,
    ...props
  }, ref) => {
    const hasError = Boolean(error)
    const hasLeftIcon = Boolean(LeftIcon) || loading
    const hasRightIcon = Boolean(RightIcon) && !loading
    
    // Use React's useId hook or a static ID instead of Math.random()
    // This ensures consistent IDs between server and client rendering
    const inputId = id || `input-field-${props.name || 'default'}`
    
    // Combine input classes
    const inputClasses = [
      // Base styles
      'block w-full rounded-lg border',
      'bg-white dark:bg-gray-900',
      'text-gray-900 dark:text-gray-100',
      'placeholder-gray-400 dark:placeholder-gray-500',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'disabled:bg-gray-50 dark:disabled:bg-gray-800',
      
      // Variant styles
      getVariantStyles(variant, hasError),
      
      // Size styles
      getSizeStyles(size),
      
      // Icon padding adjustments
      getIconPadding(size, hasLeftIcon, hasRightIcon),
      
      // Custom input classes
      inputClassName
    ].filter(Boolean).join(' ')

    // Container classes
    const containerClasses = [
      fullWidth ? 'w-full' : '',
      className
    ].filter(Boolean).join(' ')

    // Label classes
    const labelClasses = [
      'block text-sm font-medium mb-1',
      'text-gray-700 dark:text-gray-300',
      hasError ? 'text-red-600 dark:text-red-400' : '',
      labelClassName
    ].filter(Boolean).join(' ')

    // Helper/error text classes
    const helperClasses = [
      'mt-1 text-xs',
      hasError 
        ? 'text-red-600 dark:text-red-400' 
        : 'text-gray-500 dark:text-gray-400'
    ].filter(Boolean).join(' ')

    return (
      <div className={containerClasses}>
        {label && (
          <label 
            htmlFor={inputId} 
            className={labelClasses}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${loading ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {loading ? (
                <LoadingSpinner size={size} />
              ) : LeftIcon ? (
                <LeftIcon className={getIconSize(size)} />
              ) : null}
            </div>
          )}
          
          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled || loading}
            {...props}
          />
          
          {/* Right Icon */}
          {hasRightIcon && RightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <RightIcon className={getIconSize(size)} />
            </div>
          )}
        </div>
        
        {/* Helper Text or Error */}
        {(helperText || error) && (
          <p className={helperClasses}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

/**
 * Export default for easier imports
 */
export default Input