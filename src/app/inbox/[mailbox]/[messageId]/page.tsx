'use client'

import { use, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Mail, Trash2, Copy, Plus } from 'lucide-react';
import { GET_MESSAGE, MessageData } from '@/lib/graphql-queries';
import { Header } from '@/components/layout';
import { Input, Modal } from '@/components/base';
import { SkeletonText } from '@/components/base/skeleton-loader';
import { ErrorBoundary } from '@/components/base/error-boundary';
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

  // Mobile account selector state
  const [showMobileAccountModal, setShowMobileAccountModal] = useState(false);
  const [mailboxes, setMailboxes] = useState<string[]>([mailbox]);
  const [newMailbox, setNewMailbox] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Local storage key
  const MAILBOXES_STORAGE_KEY = 'maildrop-mailboxes';
  const MAX_MAILBOXES = 10;

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize mailboxes from localStorage only on client side
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const savedMailboxes = localStorage.getItem(MAILBOXES_STORAGE_KEY);
      if (savedMailboxes) {
        const parsed = JSON.parse(savedMailboxes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.includes(mailbox)) {
            const updatedMailboxes = [mailbox, ...parsed].slice(0, MAX_MAILBOXES);
            setMailboxes(updatedMailboxes);
            localStorage.setItem(MAILBOXES_STORAGE_KEY, JSON.stringify(updatedMailboxes));
          } else {
            setMailboxes(parsed);
          }
          return;
        }
      }
    } catch (error) {
      console.error('Error parsing saved mailboxes:', error);
    }
    
    // If no valid saved data, initialize with current mailbox
    const initialMailboxes = [mailbox];
    setMailboxes(initialMailboxes);
    localStorage.setItem(MAILBOXES_STORAGE_KEY, JSON.stringify(initialMailboxes));
  }, [mailbox, isClient]);

  // Mailbox management functions
  const handleSelectMailbox = (selectedMailbox: string) => {
    router.push(`/inbox/${selectedMailbox}`);
  };

  const handleCopyEmail = async (mailboxName: string) => {
    try {
      await navigator.clipboard.writeText(`${mailboxName}@maildrop.cc`);
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
  };

  const handleAddMailbox = () => {
    if (!isClient) return;
    if (newMailbox.trim() && !mailboxes.includes(newMailbox.trim()) && mailboxes.length < MAX_MAILBOXES) {
      const updatedMailboxes = [newMailbox.trim(), ...mailboxes].slice(0, MAX_MAILBOXES);
      setMailboxes(updatedMailboxes);
      localStorage.setItem(MAILBOXES_STORAGE_KEY, JSON.stringify(updatedMailboxes));
      setNewMailbox('');
      setShowAddForm(false);
    }
  };

  const handleDeleteAccount = (mailboxToDelete: string) => {
    if (!isClient) return;
    if (mailboxes.length > 1) {
      const updatedMailboxes = mailboxes.filter(mb => mb !== mailboxToDelete);
      setMailboxes(updatedMailboxes);
      localStorage.setItem(MAILBOXES_STORAGE_KEY, JSON.stringify(updatedMailboxes));
    }
  };

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
      const date = new Date(dateString);
      // Use consistent formatting to avoid hydration mismatches
      return date.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
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

  // Skeleton component for message detail page loading
  const MessageDetailSkeleton = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Message header skeleton */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm dark:bg-gray-800 dark:border-gray-600">
          <div className="space-y-4">
            <SkeletonText size="lg" width="70%" />
            <div className="flex items-center space-x-4">
              <SkeletonText size="md" width="30%" />
              <SkeletonText size="sm" width="20%" />
            </div>
            <SkeletonText size="sm" width="40%" />
          </div>
        </div>
        
        {/* Message content skeleton */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm dark:bg-gray-800 dark:border-gray-600">
          <SkeletonText lines={12} spacing="md" randomize />
        </div>
      </div>
    </div>
  );

  const message = messageData?.message;
  const senderInfo = message ? parseHeaderFrom(message.headerfrom) : null;

  return (
    <ErrorBoundary
      variant="card"
      size="lg"
      errorIcon={Mail}
      errorTitle="Message Error"
      errorMessage="Unable to load the message. Please try going back to the inbox or refreshing the page."
      showRetry={true}
      showHome={true}
      retryText="Reload Message"
      homeText="Back to Inbox"
    >
      <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header 
        variant="mailbox"
        mailbox={mailbox}
        messageSubject={message?.subject}
        selectedMailbox={mailbox}
        onShowMobileAccountModal={() => setShowMobileAccountModal(true)}
        showBackButton={true}
        showBreadcrumbs={true}
        onBack={() => router.push(`/inbox/${mailbox}`)}
      />

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {messageLoading ? (
          <MessageDetailSkeleton />
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
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div 
                    style={{ 
                      color: '#000000',
                      backgroundColor: '#ffffff',
                      minHeight: '200px',
                      padding: '16px',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      lineHeight: 'inherit'
                    }}
                    dangerouslySetInnerHTML={{ __html: message.html }} 
                  />
                </div>
              ) : message.data ? (
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <pre 
                    style={{ 
                      color: '#000000',
                      backgroundColor: '#ffffff',
                      fontFamily: 'Monaco, Consolas, monospace',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0
                    }}
                  >
                    {message.data}
                  </pre>
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
      
      {/* Mobile Account Modal */}
      <Modal
        isOpen={showMobileAccountModal}
        onClose={() => setShowMobileAccountModal(false)}
        title="Switch Account"
        size="md"
      >
        <div className="space-y-4">
          {/* Accounts List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {mailboxes.map((mailboxName) => (
              <div
                key={mailboxName}
                className={`flex items-center w-full rounded-lg p-2 transition-colors ${
                  mailbox === mailboxName
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {/* Avatar */}
                <div className="p-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    mailbox === mailboxName ? 'bg-blue-600' : 'bg-gray-500'
                  }`}>
                    {mailboxName.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* Account Info */}
                <button
                  onClick={() => {
                    handleSelectMailbox(mailboxName);
                    setShowMobileAccountModal(false);
                  }}
                  className={`flex-1 text-left p-3 transition-colors ${
                    mailbox === mailboxName
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium break-all leading-tight">
                    {mailboxName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    @maildrop.cc
                  </div>
                </button>
                
                {/* Actions */}
                <div className="flex items-center gap-1 p-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyEmail(mailboxName);
                    }}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                    title="Copy email"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  {mailboxes.length > 1 && (
                    <button
                      onClick={() => {
                        handleDeleteAccount(mailboxName);
                        if (mailboxes.length === 1) {
                          setShowMobileAccountModal(false);
                        }
                      }}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                      title="Delete account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Add New Account Section */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {showAddForm ? (
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Enter username..."
                value={newMailbox}
                onChange={(e) => setNewMailbox(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMailbox()}
                autoFocus
                fullWidth
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddMailbox}
                  disabled={!newMailbox.trim() || mailboxes.includes(newMailbox.trim()) || mailboxes.length >= MAX_MAILBOXES}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Account
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewMailbox('');
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              disabled={mailboxes.length >= MAX_MAILBOXES}
              className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              {mailboxes.length >= MAX_MAILBOXES ? 'Maximum accounts reached' : 'Add New Account'}
            </button>
          )}
          {mailboxes.length >= MAX_MAILBOXES && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              You can have up to {MAX_MAILBOXES} accounts
            </p>
          )}
        </div>
      </Modal>
      </div>
    </ErrorBoundary>
  );
}
