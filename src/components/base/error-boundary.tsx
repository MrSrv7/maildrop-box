'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { type LucideIcon, AlertTriangle, RefreshCw, Home } from 'lucide-react'

/**
 * Error boundary variant types
 */
export type ErrorBoundaryVariant = 
  | 'default'
  | 'minimal'
  | 'card'
  | 'fullscreen'

/**
 * Error boundary size types
 */
export type ErrorBoundarySize = 'sm' | 'md' | 'lg'

/**
 * Error boundary props interface
 */
export interface ErrorBoundaryProps {
  /**
   * Children components to render
   */
  children: ReactNode
  
  /**
   * Visual variant of the error boundary
   * @default 'default'
   */
  variant?: ErrorBoundaryVariant
  
  /**
   * Size of the error boundary
   * @default 'md'
   */
  size?: ErrorBoundarySize
  
  /**
   * Custom fallback component to render when error occurs
   */
  fallback?: (error: Error, errorInfo: ErrorInfo, resetError: () => void) => ReactNode
  
  /**
   * Custom error icon (from lucide-react)
   * @default AlertTriangle
   */
  errorIcon?: LucideIcon
  
  /**
   * Custom error title
   * @default 'Something went wrong'
   */
  errorTitle?: string
  
  /**
   * Custom error message
   * @default 'An unexpected error occurred. Please try again.'
   */
  errorMessage?: string
  
  /**
   * Whether to show retry button
   * @default true
   */
  showRetry?: boolean
  
  /**
   * Whether to show home button
   * @default false
   */
  showHome?: boolean
  
  /**
   * Custom retry button text
   * @default 'Try Again'
   */
  retryText?: string
  
  /**
   * Custom home button text
   * @default 'Go Home'
   */
  homeText?: string
  
  /**
   * Custom retry action
   */
  onRetry?: () => void
  
  /**
   * Custom home navigation action
   */
  onHome?: () => void
  
  /**
   * Whether to log errors to console
   * @default true
   */
  logError?: boolean
  
  /**
   * Custom error logging function
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  
  /**
   * Additional CSS classes for the error container
   */
  className?: string
  
  /**
   * Whether to show error details in development
   * @default process.env.NODE_ENV === 'development'
   */
  showErrorDetails?: boolean
}

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: ErrorBoundaryVariant): string => {
  const variants = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm',
    minimal: 'bg-transparent',
    card: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg',
    fullscreen: 'min-h-screen bg-gray-50 dark:bg-gray-900'
  }
  
  return variants[variant]
}

/**
 * Get size-specific styles
 */
const getSizeStyles = (size: ErrorBoundarySize, variant: ErrorBoundaryVariant): string => {
  if (variant === 'fullscreen') {
    return 'p-8'
  }
  
  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return sizes[size]
}

/**
 * Get icon size based on error boundary size
 */
const getIconSize = (size: ErrorBoundarySize): string => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }
  
  return sizes[size]
}

/**
 * Get text size styles
 */
const getTextSizes = (size: ErrorBoundarySize) => {
  const sizes = {
    sm: {
      title: 'text-lg font-semibold',
      message: 'text-sm'
    },
    md: {
      title: 'text-xl font-semibold',
      message: 'text-base'
    },
    lg: {
      title: 'text-2xl font-bold',
      message: 'text-lg'
    }
  }
  
  return sizes[size]
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{
  error: Error
  errorInfo: ErrorInfo
  resetError: () => void
  props: ErrorBoundaryProps
}> = ({ error, errorInfo, resetError, props }) => {
  const {
    variant = 'default',
    size = 'md',
    errorIcon: ErrorIcon = AlertTriangle,
    errorTitle = 'Something went wrong',
    errorMessage = 'An unexpected error occurred. Please try again.',
    showRetry = true,
    showHome = false,
    retryText = 'Try Again',
    homeText = 'Go Home',
    onRetry,
    onHome,
    className = '',
    showErrorDetails = process.env.NODE_ENV === 'development'
  } = props

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      resetError()
    }
  }

  const handleHome = () => {
    if (onHome) {
      onHome()
    } else {
      window.location.href = '/'
    }
  }

  const containerClasses = [
    'flex flex-col items-center justify-center text-center',
    getVariantStyles(variant),
    getSizeStyles(size, variant),
    variant === 'fullscreen' ? 'min-h-screen' : 'min-h-64',
    className
  ].filter(Boolean).join(' ')

  const textSizes = getTextSizes(size)

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        {/* Error Icon */}
        <div className="flex items-center justify-center">
          <ErrorIcon className={`${getIconSize(size)} text-red-500`} />
        </div>
        
        {/* Error Title */}
        <h2 className={`${textSizes.title} text-gray-900 dark:text-gray-100`}>
          {errorTitle}
        </h2>
        
        {/* Error Message */}
        <p className={`${textSizes.message} text-gray-600 dark:text-gray-400 max-w-md`}>
          {errorMessage}
        </p>
        
        {/* Action Buttons */}
        {(showRetry || showHome) && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {showRetry && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {retryText}
              </button>
            )}
            
            {showHome && (
              <button
                onClick={handleHome}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                <Home className="h-4 w-4 mr-2" />
                {homeText}
              </button>
            )}
          </div>
        )}
        
        {/* Error Details (Development Only) */}
        {showErrorDetails && (
          <details className="mt-6 w-full max-w-2xl">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Show error details
            </summary>
            <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
              <div className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                <strong>Error:</strong> {error.message}
                {error.stack && (
                  <>
                    <br /><br />
                    <strong>Stack trace:</strong>
                    <br />
                    {error.stack}
                  </>
                )}
                {errorInfo.componentStack && (
                  <>
                    <br /><br />
                    <strong>Component stack:</strong>
                    <br />
                    {errorInfo.componentStack}
                  </>
                )}
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

/**
 * Error Boundary Component
 * 
 * A React error boundary that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { logError = true, onError } = this.props

    // Log error to console in development
    if (logError && process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo)
    }

    // Update state with error info
    this.setState({
      hasError: true,
      error,
      errorInfo
    })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback } = this.props

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback && errorInfo) {
        return fallback(error, errorInfo, this.resetError)
      }

      // Use default fallback
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo || { componentStack: '' }}
          resetError={this.resetError}
          props={this.props}
        />
      )
    }

    return children
  }
}

/**
 * Export default for easier imports
 */
export default ErrorBoundary

/**
 * Preset error boundary configurations for common use cases
 */
export const ErrorBoundaryPresets = {
  /**
   * Full page error boundary for application-level errors
   */
  App: ({ children, ...props }: Partial<ErrorBoundaryProps> & { children: ReactNode }) => (
    <ErrorBoundary
      variant="fullscreen"
      size="lg"
      errorTitle="Application Error"
      errorMessage="The application encountered an unexpected error. Please refresh the page or try again later."
      showRetry={true}
      showHome={true}
      retryText="Refresh Page"
      onRetry={() => window.location.reload()}
      {...props}
    >
      {children}
    </ErrorBoundary>
  ),

  /**
   * Page-level error boundary for individual routes
   */
  Page: ({ children, ...props }: Partial<ErrorBoundaryProps> & { children: ReactNode }) => (
    <ErrorBoundary
      variant="card"
      size="lg"
      errorTitle="Page Error"
      errorMessage="Unable to load this page. Please try refreshing or go back to the previous page."
      showRetry={true}
      showHome={true}
      retryText="Reload Page"
      onRetry={() => window.location.reload()}
      {...props}
    >
      {children}
    </ErrorBoundary>
  ),

  /**
   * Component-level error boundary for smaller sections
   */
  Component: ({ children, ...props }: Partial<ErrorBoundaryProps> & { children: ReactNode }) => (
    <ErrorBoundary
      variant="default"
      size="md"
      errorTitle="Component Error"
      errorMessage="This section encountered an error. Please try refreshing."
      showRetry={true}
      retryText="Retry"
      {...props}
    >
      {children}
    </ErrorBoundary>
  ),

  /**
   * Minimal error boundary for inline components
   */
  Minimal: ({ children, ...props }: Partial<ErrorBoundaryProps> & { children: ReactNode }) => (
    <ErrorBoundary
      variant="minimal"
      size="sm"
      errorTitle="Error"
      errorMessage="Something went wrong."
      showRetry={false}
      {...props}
    >
      {children}
    </ErrorBoundary>
  )
}