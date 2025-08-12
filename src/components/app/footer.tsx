'use client'

import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white py-4 px-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-500" />
          <span>using Next.js</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
