'use client'

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/base/error-boundary';
import { Database } from 'lucide-react';

interface GraphQLProviderProps {
  children: ReactNode;
}

export function GraphQLProvider({ children }: GraphQLProviderProps) {
  return (
    <ErrorBoundary
      variant="card"
      size="md"
      errorIcon={Database}
      errorTitle="GraphQL Connection Error"
      errorMessage="Unable to connect to the GraphQL service. Please check your connection and try again."
      showRetry={true}
      retryText="Retry Connection"
      onError={(error, errorInfo) => {
        console.error('GraphQL Provider Error:', error, errorInfo);
      }}
    >
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </ErrorBoundary>
  );
}
