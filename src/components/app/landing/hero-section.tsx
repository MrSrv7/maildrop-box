'use client';

import { EmailForm } from '@/components/app/inbox/email-form';

interface HeroSectionProps {
  /**
   * Callback for when the email form is submitted
   */
  onSubmit: (username: string) => void;
}

/**
 * Hero section component for the landing page
 */
export const HeroSection = ({ onSubmit }: HeroSectionProps) => {
  return (
    <main className="flex items-center justify-center px-4 sm:px-6 py-8 pb-2">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight px-2">
          Temporary Email,{" "}
          <span className="block">Permanently Simple.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
          Get free, disposable email addresses instantly. Maildrop Box offers a clean,
          modern interface for managing temporary inboxes without the hassle.
        </p>
        
        {/* Email Input Form */}
        <EmailForm onSubmit={onSubmit} />
      </div>
    </main>
  );
};

export default HeroSection;
