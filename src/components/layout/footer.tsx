'use client'

import React from 'react'
import { Heart } from 'lucide-react'

/**
 * Footer props interface
 */
export interface FooterProps {
  /**
   * Additional CSS classes
   */
  className?: string
}

export const Footer: React.FC<FooterProps> = ({
  className = ''
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-4 px-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>© {currentYear} Maildrop Box. Built with</span>
          <Heart className="w-4 h-4 text-red-500" />
          <span>using Next.js</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
