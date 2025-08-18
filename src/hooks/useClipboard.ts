'use client';

import { useCallback } from 'react';

interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<boolean>;
  pasteFromClipboard: () => Promise<string>;
}

/**
 * Custom hook for interacting with the clipboard API.
 * 
 * @returns Object containing methods to copy text to and paste text from the clipboard
 */
export const useClipboard = (): UseClipboardReturn => {
  /**
   * Copy the given text to clipboard
   * 
   * @param text - Text to copy to clipboard
   * @returns Promise that resolves to true if successful, false otherwise
   */
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
      return false;
    }
  }, []);

  /**
   * Paste text from clipboard
   * 
   * @returns Promise that resolves to the clipboard text content
   */
  const pasteFromClipboard = useCallback(async (): Promise<string> => {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
      return '';
    }
  }, []);

  return {
    copyToClipboard,
    pasteFromClipboard,
  };
};

export default useClipboard;
