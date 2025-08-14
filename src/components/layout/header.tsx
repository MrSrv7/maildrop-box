'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/base/button'
import { ThemeToggle } from '@/components/app/theme-toggle'

/**
 * Header variant types
 * - 'default': Basic header with logo and theme toggle (for home, not-found pages)
 * - 'mailbox': Header with mobile account selector (for inbox and message pages)
 */
export type HeaderVariant = 'default' | 'mailbox'

/**
 * Header props interface
 */
export interface HeaderProps {
  /**
   * Header variant that determines the layout and functionality
   * @default 'default'
   */
  variant?: HeaderVariant
  
  /**
   * Current mailbox name (for mailbox variant)
   */
  mailbox?: string
  
  /**
   * Selected message subject (for breadcrumbs when showBreadcrumbs is true)
   */
  messageSubject?: string
  
  /**
   * Selected mailbox for mobile account selector (for mailbox variant)
   */
  selectedMailbox?: string
  
  /**
   * Callback when mobile account selector is opened (for mailbox variant)
   */
  onShowMobileAccountModal?: () => void
  
  /**
   * Show back button (for message pages)
   * @default false
   */
  showBackButton?: boolean
  
  /**
   * Show breadcrumbs (for message pages)
   * @default false
   */
  showBreadcrumbs?: boolean
  
  /**
   * Callback when back button is clicked
   */
  onBack?: () => void
  
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Reusable header component for the application
 */
export const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  mailbox,
  messageSubject,
  selectedMailbox,
  onShowMobileAccountModal,
  showBackButton = false,
  showBreadcrumbs = false,
  onBack,
  className = ''
}) => {
  const router = useRouter();
  
  const truncateSubject = (subject: string, maxLength: number = 6) => {
    if (!subject) return 'Message';
    if (subject.length <= maxLength) return subject;
    return subject.substring(0, maxLength) + '...';
  };

  const renderBreadcrumbs = () => {
    if (showBreadcrumbs && mailbox) {
      return (
        <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Button
              onClick={() => router.push('/')}
              variant="link"
              size="sm"
            >
              Home
            </Button>
            <span>/</span>
            <Button
              onClick={onBack}
              variant="link"
              size="sm"
            >
              {mailbox}@maildrop.cc
            </Button>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">
              {truncateSubject(messageSubject || '')}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Main Header */}
      <header className={`flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center gap-2">
          {/* Back button when showBackButton is true */}
          {showBackButton && onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              icon={ArrowLeft}
              size="icon-sm"
              title="Back to inbox"
            />
          )}
          
          {/* Logo and title */}
          {variant === 'mailbox' ? (
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Maildrop Box
              </span>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Maildrop Box
              </span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Account Switcher for mailbox variant */}
          {variant === 'mailbox' && selectedMailbox && onShowMobileAccountModal && (
            <div className="md:hidden">
              <Button
                onClick={onShowMobileAccountModal}
                variant="primary"
                size="icon-sm"
                className="w-8 h-8 rounded-full text-sm font-medium"
                title="Switch account"
              >
                {selectedMailbox.charAt(0).toUpperCase()}
              </Button>
            </div>
          )}
          
          <ThemeToggle />
        </div>
      </header>
      
      {/* Breadcrumbs for message variant */}
      {renderBreadcrumbs()}
    </>
  );
};

export default Header;
