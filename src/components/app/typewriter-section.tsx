'use client'

import { useState, useEffect } from 'react';

const changingTexts = [
  "social media notifications.",
  "sites that sell your data.",
  "website security breaches.",
  "shady newsletter writers.",
  "an app you'll only use once.",
  "chatty ecommerce stores.",
  "filling up your real inbox."
];

export const TypewriterSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = changingTexts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (isTyping && !isDeleting) {
        // Typing phase
        if (displayedText.length < currentText.length) {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setIsTyping(false);
          setTimeout(() => setIsDeleting(true), 2000); // Wait 2 seconds before deleting
        }
      } else if (isDeleting) {
        // Deleting phase
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentTextIndex((prev) => (prev + 1) % changingTexts.length);
        }
      }
    }, isDeleting ? 50 : isTyping ? 100 : 0); // Faster deleting, slower typing

    return () => clearTimeout(timeout);
  }, [displayedText, currentTextIndex, isTyping, isDeleting]);

  return (
    <section className="py-8 pt=1 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          <span className="text-gray-900 dark:text-gray-100">Stop spam from</span>
          <br />
          <span className="text-pink-500 dark:text-pink-400 min-h-[1.2em] inline-block mt-4">
            {displayedText}
            <span className="animate-pulse">|</span>
          </span>
        </h2>
      </div>
    </section>
  );
};

export default TypewriterSection;
