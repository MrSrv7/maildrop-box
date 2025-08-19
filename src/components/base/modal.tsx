'use client'

import React, { forwardRef, useEffect, useRef } from 'react'
import { type LucideIcon, X } from 'lucide-react'
import { Button } from './button'

/**
 * Modal size types
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

/**
 * Modal variant types
 */
export type ModalVariant = 'default' | 'danger' | 'success' | 'warning'

/**
 * Modal props interface
 */
export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean
  
  /**
   * Function to call when modal should be closed
   */
  onClose: () => void
  
  /**
   * Modal title
   */
  title?: string
  
  /**
   * Modal size
   * @default 'md'
   */
  size?: ModalSize
  
  /**
   * Modal variant for styling
   * @default 'default'
   */
  variant?: ModalVariant
  
  /**
   * Whether to show the close button in header
   * @default true
   */
  showCloseButton?: boolean
  
  /**
   * Whether clicking the backdrop should close the modal
   * @default true
   */
  closeOnBackdropClick?: boolean
  
  /**
   * Whether pressing escape should close the modal
   * @default true
   */
  closeOnEscape?: boolean
  
  /**
   * Custom header content (overrides title)
   */
  header?: React.ReactNode
  
  /**
   * Modal body content
   */
  children: React.ReactNode
  
  /**
   * Custom footer content
   */
  footer?: React.ReactNode
  
  /**
   * Icon to display in header (from lucide-react)
   */
  icon?: LucideIcon
  
  /**
   * Additional CSS classes for the modal container
   */
  className?: string
  
  /**
   * Additional CSS classes for the modal backdrop
   */
  backdropClassName?: string
  
  /**
   * Whether the modal content should be scrollable
   * @default true
   */
  scrollable?: boolean
}

/**
 * Get size-specific styles
 */
const getSizeStyles = (size: ModalSize): string => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4'
  }
  
  return sizes[size]
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: ModalVariant): string => {
  const variants = {
    default: 'border-gray-200 dark:border-gray-700',
    danger: 'border-red-200 dark:border-red-800',
    success: 'border-green-200 dark:border-green-800', 
    warning: 'border-yellow-200 dark:border-yellow-800'
  }
  
  return variants[variant]
}

/**
 * Get variant-specific header styles
 */
const getHeaderVariantStyles = (variant: ModalVariant): string => {
  const variants = {
    default: 'text-gray-900 dark:text-gray-100',
    danger: 'text-red-900 dark:text-red-100',
    success: 'text-green-900 dark:text-green-100',
    warning: 'text-yellow-900 dark:text-yellow-100'
  }
  
  return variants[variant]
}

/**
 * Modal component
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    title,
    size = 'md',
    variant = 'default',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    header,
    children,
    footer,
    icon: Icon,
    className = '',
    backdropClassName = '',
    scrollable = true,
    ...props
  }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null)
    
    // Handle escape key
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])
    
    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose()
      }
    }
    
    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = 'unset'
        }
      }
    }, [isOpen])
    
    // Focus management
    useEffect(() => {
      if (isOpen && modalRef.current) {
        modalRef.current.focus()
      }
    }, [isOpen])
    
    if (!isOpen) return null
    
    // Combine modal classes
    const modalClasses = [
      // Base modal styles
      'relative bg-white dark:bg-gray-900 rounded-lg shadow-xl border',
      'w-full mx-4',
      
      // Size styles
      getSizeStyles(size),
      
      // Variant styles
      getVariantStyles(variant),
      
      // Custom classes
      className
    ].filter(Boolean).join(' ')
    
    // Backdrop classes
    const backdropClasses = [
      // Base backdrop styles
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-black bg-opacity-50 backdrop-blur-sm',
      'transition-opacity duration-300',
      
      // Custom backdrop classes
      backdropClassName
    ].filter(Boolean).join(' ')
    
    // Content wrapper classes
    const contentClasses = [
      'max-h-[90vh] flex flex-col',
      scrollable ? 'overflow-hidden' : ''
    ].filter(Boolean).join(' ')
    
    // Body classes
    const bodyClasses = [
      'px-6 py-4',
      scrollable ? 'overflow-y-auto flex-1' : ''
    ].filter(Boolean).join(' ')
    
    return (
      <div 
        className={backdropClasses}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div
          ref={ref || modalRef}
          className={modalClasses}
          tabIndex={-1}
          {...props}
        >
          <div className={contentClasses}>
            {/* Header */}
            {(header || title || Icon || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  {Icon && (
                    <Icon className={`mr-3 h-6 w-6 ${getHeaderVariantStyles(variant)}`} />
                  )}
                  {header || (
                    title && (
                      <h2 
                        id="modal-title"
                        className={`text-lg font-semibold ${getHeaderVariantStyles(variant)}`}
                      >
                        {title}
                      </h2>
                    )
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    icon={X}
                    onClick={onClose}
                    aria-label="Close modal"
                  />
                )}
              </div>
            )}
            
            {/* Body */}
            <div className={bodyClasses}>
              {children}
            </div>
            
            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

/**
 * Export default for easier imports
 */
export default Modal