'use client'

import { ThemeProvider } from 'next-themes'

/**
 * AppThemeProvider - A wrapper component for next-themes ThemeProvider
 * 
 * This component provides theme management functionality to the entire application,
 * enabling seamless switching between light and dark modes. It respects the user's
 * system preference by default and provides a consistent theming experience.
 * 
 * Features:
 * - Automatic system theme detection
 * - Class-based theme switching for Tailwind CSS
 * - Hydration-safe theme persistence
 * - TypeScript support with proper prop typing
 */
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
