'use client'

import React, { forwardRef } from 'react'
import { type LucideIcon } from 'lucide-react'

/**
 * Button variant types
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'ghost' 
  | 'danger' 
  | 'danger-ghost'
  | 'outline'
  | 'link'

/**
 * Button size types  
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

/**
 * Button props interface
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: ButtonVariant
  
  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize
  
  /**
   * Whether button is in loading state
   * @default false
   */
  loading?: boolean
  
  /**
   * Icon to display before text (from lucide-react)
   */
  leftIcon?: LucideIcon
  
  /**
   * Icon to display after text (from lucide-react)
   */
  rightIcon?: LucideIcon
  
  /**
   * Icon for icon-only buttons (from lucide-react)
   */
  icon?: LucideIcon
  
  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Button content
   */
  children?: React.ReactNode
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: ButtonVariant): string => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
    'danger-ghost': 'bg-transparent hover:bg-red-50 text-red-600 border-transparent dark:hover:bg-red-900/20 dark:text-red-400 focus:ring-red-500',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 focus:ring-gray-500',
    link: 'bg-transparent hover:bg-transparent text-blue-600 border-transparent underline-offset-4 hover:underline p-0 h-auto dark:text-blue-400 focus:ring-blue-500'
  }
  
  return variants[variant]
}

/**
 * Get size-specific styles
 */
const getSizeStyles = (size: ButtonSize): string => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10', 
    lg: 'px-6 py-3 text-base h-12',
    icon: 'p-2 h-10 w-10',
    'icon-sm': 'p-1.5 h-8 w-8'
  }
  
  return sizes[size]
}

/**
 * Get loading spinner styles based on button size
 */
const getSpinnerSize = (size: ButtonSize): string => {
  if (size === 'sm' || size === 'icon-sm') return 'h-3 w-3'
  if (size === 'lg') return 'h-5 w-5'
  return 'h-4 w-4'
}

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => (
  <svg
    className={`animate-spin ${getSpinnerSize(size)}`}
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md', 
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    icon: Icon,
    fullWidth = false,
    className = '',
    disabled,
    children,
    ...props
  }, ref) => {
    // Determine if this is an icon-only button
    const isIconOnly = Icon || (!children && (LeftIcon || RightIcon))
    
    // Use icon size for icon-only buttons if not explicitly set
    const buttonSize = isIconOnly && size === 'md' ? 'icon' : size
    
    // Combine all styles
    const buttonClasses = [
      // Base styles
      'inline-flex items-center justify-center',
      'font-medium rounded-lg border',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'dark:focus:ring-offset-gray-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'disabled:pointer-events-none',
      
      // Variant styles
      getVariantStyles(variant),
      
      // Size styles (skip for link variant)
      variant !== 'link' ? getSizeStyles(buttonSize) : '',
      
      // Full width
      fullWidth ? 'w-full' : '',
      
      // Custom classes
      className
    ].filter(Boolean).join(' ')

    // Content rendering
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <LoadingSpinner size={buttonSize} />
            {children && !isIconOnly && (
              <span className="ml-2">{children}</span>
            )}
          </>
        )
      }

      if (Icon) {
        return <Icon className={getSpinnerSize(buttonSize)} />
      }

      return (
        <>
          {LeftIcon && <LeftIcon className={`${getSpinnerSize(buttonSize)} ${children ? 'mr-2' : ''}`} />}
          {children}
          {RightIcon && <RightIcon className={`${getSpinnerSize(buttonSize)} ${children ? 'ml-2' : ''}`} />}
        </>
      )
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </button>
    )
  }
)

Button.displayName = 'Button'

/**
 * Export default for easier imports
 */
export default Button