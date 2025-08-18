'use client';

import { FeaturesGrid } from './features-grid';

/**
 * About section component for the landing page
 */
export const AboutSection = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Column - About */}
          <div className="text-center lg:text-left">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide">
              About This Project
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Built for the Modern Web
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Maildrop Box is an unofficial, open-source alternative interface for Maildrop.cc, 
              built with Next.js, TypeScript, and Tailwind CSS. The goal is to provide a modern, 
              accessible, and user-friendly experience for temporary email management.
            </p>
          </div>

          {/* Right Column - Features */}
          <FeaturesGrid />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
