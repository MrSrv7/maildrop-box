'use client'

import { ReactNode } from 'react';
import { AppThemeProvider } from "@/components/providers/theme-provider";
import { GraphQLProvider } from "@/components/providers/graphql-provider";
import { ErrorBoundary } from "@/components/base/error-boundary";
import { Footer } from "@/components/layout/footer";

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <ErrorBoundary
      variant="fullscreen"
      size="lg"
      errorTitle="Application Error"
      errorMessage="The application encountered an unexpected error. Please refresh the page or try again later."
      showRetry={true}
      showHome={true}
      retryText="Refresh Page"
      onRetry={() => window.location.reload()}
    >
      <AppThemeProvider>
        <GraphQLProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </GraphQLProvider>
      </AppThemeProvider>
    </ErrorBoundary>
  );
}
