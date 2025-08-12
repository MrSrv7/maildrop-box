'use client'

import { use } from 'react';
import { useQuery } from '@apollo/client';
import { Mail, ArrowLeft, Trash2, Home } from 'lucide-react';
import { GET_MESSAGE, MessageData } from '@/lib/graphql-queries';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { useRouter } from 'next/navigation';

interface MessagePageProps {
  params: Promise<{
    mailbox: string;
    messageId: string;
  }>;
}

export default function MessagePage({ params }: MessagePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { mailbox, messageId } = resolvedParams;

  // Query for message data
  const { data: messageData, loading: messageLoading, error: messageError } = useQuery<MessageData>(
    GET_MESSAGE,
    {
      variables: { mailbox, id: messageId },
      errorPolicy: 'all',
    }
  );

  const parseHeaderFrom = (headerFrom: string) => {
    // Parse "Display Name <email@domain.com>" format
    const match = headerFrom.match(/^(.*?)\s*<(.+)>$/);
    if (match) {
      return {
        name: match[1].trim().replace(/^"(.*)"$/, '$1'), // Remove quotes if present
        email: match[2].trim()
      };
    }
    
    // If no match, treat the whole string as email
    return {
      name: '',
      email: headerFrom.trim()
    };
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const messageDate = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - messageDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) {
        return "just now";
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
      } else {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
      }
    } catch {
      return "";
    }
  };

  const handleDelete = () => {
    // For now, just go back to inbox
    // In a real app, you'd implement the delete mutation here
    router.push(`/inbox/${mailbox}`);
  };

  const message = messageData?.message;
  const senderInfo = message ? parseHeaderFrom(message.headerfrom) : null;

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {/* Back button */}
          <button
            onClick={() => router.push(`/inbox/${mailbox}`)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Back to inbox"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Home button */}
          <button
            onClick={() => router.push('/')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Go to homepage"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Maildrop Box
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <button
            onClick={() => router.push('/')}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => router.push(`/inbox/${mailbox}`)}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {mailbox}@maildrop.cc
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">Message</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {messageLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Loading message...</p>
            </div>
          </div>
        ) : messageError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-500 mb-2">Error loading message</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {messageError.message}
              </div>
              <button
                onClick={() => router.push(`/inbox/${mailbox}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Inbox
              </button>
            </div>
          </div>
        ) : !message ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Message not found</p>
              <button
                onClick={() => router.push(`/inbox/${mailbox}`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Inbox
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Message Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Subject */}
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 break-words">
                    {message.subject || 'No Subject'}
                  </h1>
                  
                  <div className="space-y-2">
                    {/* Sender info */}
                    {senderInfo && (
                      <>
                        {senderInfo.name && (
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {senderInfo.name}
                          </div>
                        )}
                        <div className="text-gray-600 dark:text-gray-400 break-all">
                          {senderInfo.email}
                        </div>
                      </>
                    )}
                    
                    {/* Date and time */}
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(message.date)} ({getRelativeTime(message.date)})
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={handleDelete}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {message.html ? (
                <div 
                  className="prose dark:prose-invert max-w-none prose-sm sm:prose-base"
                  dangerouslySetInnerHTML={{ __html: message.html }}
                />
              ) : message.data ? (
                <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm sm:text-base font-mono">
                  {message.data}
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No message content available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
