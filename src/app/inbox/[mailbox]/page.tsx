'use client'

import { useState, use, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Mail, RefreshCw, Trash2, Plus, Copy, ArrowLeft } from 'lucide-react';
import { GET_INBOX, DELETE_MESSAGE, GET_MESSAGE, EmailMessage, InboxData, MessageData } from '@/lib/graphql-queries';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { useRouter } from 'next/navigation';

interface InboxPageProps {
  params: Promise<{
    mailbox: string;
  }>;
}

export default function InboxPage({ params }: InboxPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [selectedMailbox, setSelectedMailbox] = useState<string>(resolvedParams.mailbox || 'example');
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [mailboxes, setMailboxes] = useState<string[]>([resolvedParams.mailbox || 'example']);
  const [newMailbox, setNewMailbox] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [totalToDelete, setTotalToDelete] = useState(0);
  const [cancelDeletion, setCancelDeletion] = useState(false);
  const [showAccountDeleteConfirm, setShowAccountDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  
  // Mobile navigation state
  const [showMobileAccountMenu, setShowMobileAccountMenu] = useState(false);
  const [showMobileAccountModal, setShowMobileAccountModal] = useState(false);
  
  // New state for smart refresh management
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const [displayedEmails, setDisplayedEmails] = useState<EmailMessage[]>([]);
  const lastFetchRef = useRef<EmailMessage[]>([]);
  const isInitializedRef = useRef(false);

  // Local storage key
  const MAILBOXES_STORAGE_KEY = 'maildrop-mailboxes';
  const MAX_MAILBOXES = 10;

  // Initialize mailboxes from localStorage only once on mount
  useEffect(() => {
    // Only run on client side and only once
    if (typeof window === 'undefined' || isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    const currentMailbox = resolvedParams.mailbox || 'example';
    console.log('🏁 Initializing mailboxes for:', currentMailbox);
    
    try {
      const savedMailboxes = localStorage.getItem(MAILBOXES_STORAGE_KEY);
      if (savedMailboxes) {
        const parsed = JSON.parse(savedMailboxes);
        console.log('📦 Found saved mailboxes:', parsed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If current mailbox is not in saved list, add it
          if (!parsed.includes(currentMailbox)) {
            const updatedMailboxes = [currentMailbox, ...parsed].slice(0, MAX_MAILBOXES);
            console.log('➕ Adding current mailbox to saved list:', updatedMailboxes);
            setMailboxes(updatedMailboxes);
            localStorage.setItem(MAILBOXES_STORAGE_KEY, JSON.stringify(updatedMailboxes));
          } else {
            console.log('✅ Current mailbox already in list, using saved:', parsed);
            setMailboxes(parsed);
          }
          return;
        }
      }
    } catch (error) {
      console.error('Error parsing saved mailboxes:', error);
    }
    
    // If no valid saved data, initialize with current mailbox
    const initialMailboxes = [currentMailbox];
    console.log('🆕 No saved data, initializing with:', initialMailboxes);
    setMailboxes(initialMailboxes);
    localStorage.setItem(MAILBOXES_STORAGE_KEY, JSON.stringify(initialMailboxes));
  }, [resolvedParams.mailbox]);

  // Add current mailbox to the list if it's not already there (when navigating to a new mailbox via URL)
  useEffect(() => {
    if (!isInitializedRef.current || mailboxes.length === 0) return; // Wait for initialization
    
    const currentMailbox = resolvedParams.mailbox || 'example';
    if (!mailboxes.includes(currentMailbox)) {
      const updatedMailboxes = [currentMailbox, ...mailboxes].slice(0, MAX_MAILBOXES);
      setMailboxes(updatedMailboxes);
    }
  }, [resolvedParams.mailbox, mailboxes]);

  // Update selectedMailbox when URL changes
  useEffect(() => {
    setSelectedMailbox(resolvedParams.mailbox || 'example');
  }, [resolvedParams.mailbox]);

  // Save mailboxes to localStorage whenever mailboxes change (but only after initialization)
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitializedRef.current || mailboxes.length === 0) return;
    console.log('💾 Saving mailboxes to localStorage:', mailboxes);
    localStorage.setItem(MAILBOXES_STORAGE_KEY, JSON.stringify(mailboxes));
  }, [mailboxes]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMobileAccountMenu && !target.closest('[data-mobile-account-menu]')) {
        setShowMobileAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileAccountMenu]);

  // Query for inbox data
  const { data: inboxData, loading: inboxLoading, error: inboxError, refetch: refetchInbox } = useQuery<InboxData>(
    GET_INBOX,
    {
      variables: { mailbox: selectedMailbox },
      pollInterval: 30000, // Poll every 30 seconds
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network', // Ensure we get loading states
    }
  );

  // Effect to handle smart email updates (programmatic vs manual refresh)
  useEffect(() => {
    console.log('📧 Email effect triggered - inboxData:', !!inboxData?.inbox, 'isManualRefresh:', isManualRefresh, 'displayedEmails.length:', displayedEmails.length);
    
    if (inboxData?.inbox) {
      const newEmails = inboxData.inbox;
      
      // Check if this is the first load or a manual refresh
      if (displayedEmails.length === 0 || isManualRefresh) {
        console.log('🔄 Handling manual refresh or first load');
        // First load or manual refresh - replace all emails
        setDisplayedEmails(newEmails);
        
        // Add a small delay before hiding the skeleton to ensure it's visible
        if (isManualRefresh) {
          console.log('⏱️ Setting timeout to hide skeleton in 500ms');
          setTimeout(() => {
            console.log('✅ Hiding skeleton after timeout');
            setIsManualRefresh(false);
          }, 500); // Show skeleton for at least 500ms
        }
      } else {
        // Programmatic refresh - append only new emails
        const existingIds = new Set(displayedEmails.map(email => email.id));
        const newEmailsToAdd = newEmails.filter(email => !existingIds.has(email.id));
        
        if (newEmailsToAdd.length > 0) {
          console.log('📬 Adding new emails:', newEmailsToAdd.length);
          // Add new emails to the beginning of the list (most recent first)
          setDisplayedEmails(prev => [...newEmailsToAdd, ...prev]);
        }
      }
      
      lastFetchRef.current = newEmails;
    }
  }, [inboxData?.inbox, isManualRefresh, displayedEmails]);

  // Reset displayed emails when mailbox changes
  useEffect(() => {
    setDisplayedEmails([]);
    setSelectedMessage(null);
  }, [selectedMailbox]);

  // Query for selected message details
  const { data: messageData, loading: messageLoading } = useQuery<MessageData>(
    GET_MESSAGE,
    {
      variables: { 
        mailbox: selectedMailbox, 
        id: selectedMessage?.id || '' 
      },
      skip: !selectedMessage?.id,
    }
  );

  // Delete message mutation
  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    onCompleted: () => {
      setSelectedMessage(null);
      refetchInbox();
    },
  });

  const handleDeleteMessage = async (messageId: string) => {
    setMessageToDelete(messageId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    
    try {
      await deleteMessage({
        variables: {
          mailbox: selectedMailbox,
          id: messageToDelete,
        },
      });
      
      // Remove the deleted message from displayed emails immediately
      setDisplayedEmails(prev => prev.filter(email => email.id !== messageToDelete));
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  const cancelDeleteMessage = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  const handleDeleteAll = () => {
    if (!displayedEmails?.length) return;
    setShowDeleteAllConfirm(true);
  };

  const confirmDeleteAll = async () => {
    if (!displayedEmails?.length) return;
    
    setShowDeleteAllConfirm(false);
    setIsDeleting(true);
    setCancelDeletion(false);
    setDeleteProgress(0);
    setTotalToDelete(displayedEmails.length);
    
    const messages = [...displayedEmails];
    
    for (let i = 0; i < messages.length; i++) {
      if (cancelDeletion) {
        break;
      }
      
      try {
        await deleteMessage({
          variables: {
            mailbox: selectedMailbox,
            id: messages[i].id,
          },
        });
        
        // Remove the deleted message from displayed emails immediately
        setDisplayedEmails(prev => prev.filter(email => email.id !== messages[i].id));
        setDeleteProgress(i + 1);
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Error deleting message:', error);
        break;
      }
    }
    
    setIsDeleting(false);
    setCancelDeletion(false);
    setDeleteProgress(0);
    setTotalToDelete(0);
  };

  const cancelDeleteAll = () => {
    setShowDeleteAllConfirm(false);
  };

  const cancelDeletionProcess = () => {
    setCancelDeletion(true);
  };

  const handleAddMailbox = () => {
    const trimmedMailbox = newMailbox.trim();
    console.log('➕ Adding new mailbox:', trimmedMailbox, 'Current mailboxes:', mailboxes);
    if (trimmedMailbox && !mailboxes.includes(trimmedMailbox) && mailboxes.length < MAX_MAILBOXES) {
      const updatedMailboxes = [trimmedMailbox, ...mailboxes];
      console.log('📝 Updated mailboxes will be:', updatedMailboxes);
      setMailboxes(updatedMailboxes);
      setNewMailbox('');
      setShowAddForm(false);
      
      // Navigate to the new mailbox immediately
      router.push(`/inbox/${trimmedMailbox}`);
    }
  };

  const handleSelectMailbox = (mailbox: string) => {
    // Only navigate if it's a different mailbox
    if (mailbox !== selectedMailbox) {
      setSelectedMailbox(mailbox);
      setSelectedMessage(null);
      router.push(`/inbox/${mailbox}`);
    }
  };

  const handleDeleteAccount = (mailbox: string) => {
    setAccountToDelete(mailbox);
    setShowAccountDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    if (!accountToDelete) return;
    
    const updatedMailboxes = mailboxes.filter(mb => mb !== accountToDelete);
    setMailboxes(updatedMailboxes);
    
    // If the deleted mailbox was the current one, switch to the first available
    if (accountToDelete === selectedMailbox && updatedMailboxes.length > 0) {
      router.push(`/inbox/${updatedMailboxes[0]}`);
    }
    
    setShowAccountDeleteConfirm(false);
    setAccountToDelete(null);
  };

  const cancelDeleteAccount = () => {
    setShowAccountDeleteConfirm(false);
    setAccountToDelete(null);
  };

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setIsManualRefresh(true);
    refetchInbox();
  };

  // Copy functions
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here if you have one
      console.log('📋 Copied to clipboard:', text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleCopyEmail = (mailbox: string) => {
    const emailAddress = `${mailbox}@maildrop.cc`;
    copyToClipboard(emailAddress);
  };

  const handleCopyCurrentEmail = () => {
    const emailAddress = `${selectedMailbox}@maildrop.cc`;
    copyToClipboard(emailAddress);
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

  const truncateText = (text: string, maxLength: number = 30) => {
    // Remove spaces for counting but keep them in display
    const textWithoutSpaces = text.replace(/\s/g, '');
    if (textWithoutSpaces.length <= maxLength) {
      return text;
    }
    
    // Find the position where we should cut, considering spaces
    let charCount = 0;
    let cutPosition = 0;
    
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== ' ') {
        charCount++;
      }
      if (charCount >= maxLength) {
        cutPosition = i;
        break;
      }
    }
    
    return text.substring(0, cutPosition + 1) + '...';
  };

  // Skeleton loading component for inbox
  const InboxSkeleton = () => (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="p-4 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {/* Mobile back button */}
          {selectedMessage && (
            <button
              onClick={() => setSelectedMessage(null)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              title="Back to inbox"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Go to homepage"
          >
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Maildrop Box
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Account Switcher */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileAccountModal(true)}
              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium hover:bg-blue-700 transition-colors"
              title="Switch account"
            >
              {selectedMailbox.charAt(0).toUpperCase()}
            </button>
          </div>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Mailboxes */}
        <div className="w-80 md:flex hidden border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Accounts</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {mailboxes.map((mailbox) => (
                <div
                  key={mailbox}
                  className={`flex items-start w-full rounded-lg mb-2 transition-colors ${
                    selectedMailbox === mailbox
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <button
                    onClick={() => handleSelectMailbox(mailbox)}
                    className={`flex-1 text-left p-3 transition-colors ${
                      selectedMailbox === mailbox
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="font-medium break-all leading-tight max-w-full">
                      {mailbox}
                    </div>
                  </button>
                  
                  {/* Copy email button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyEmail(mailbox);
                    }}
                    className="p-2 m-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex-shrink-0 self-start"
                    title="Copy email address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  {/* Delete account button */}
                  <button
                    onClick={() => handleDeleteAccount(mailbox)}
                    className="p-2 m-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex-shrink-0 self-start"
                    title="Remove account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Mailbox */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {showAddForm ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter username..."
                  value={newMailbox}
                  onChange={(e) => setNewMailbox(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMailbox()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddMailbox}
                    disabled={!newMailbox.trim() || mailboxes.includes(newMailbox.trim()) || mailboxes.length >= MAX_MAILBOXES}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
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
                className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                {mailboxes.length >= MAX_MAILBOXES ? 'Maximum accounts reached' : 'Add New Address'}
              </button>
            )}
            {mailboxes.length >= MAX_MAILBOXES && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                You can have up to {MAX_MAILBOXES} accounts
              </p>
            )}
          </div>
        </div>

        {/* Middle Panel - Email List */}
        <div className="w-96 md:flex hidden border-r border-gray-200 dark:border-gray-700 flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Inbox
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCurrentEmail}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  title="Copy email address"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={handleManualRefresh}
                  disabled={inboxLoading && isManualRefresh}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh"
                >
                  <RefreshCw className={`w-5 h-5 ${inboxLoading && isManualRefresh ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={!displayedEmails?.length}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete all messages"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedMailbox}@maildrop.cc
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {displayedEmails?.length || 0} messages
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {(inboxLoading && isManualRefresh) ? (
              <InboxSkeleton />
            ) : inboxError ? (
              <div className="p-4 text-center">
                <div className="text-red-500 mb-2">Error loading messages</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {inboxError.message}
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : !displayedEmails?.length ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {inboxLoading ? 'Loading messages...' : 'No messages in this inbox'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayedEmails.map((message) => {
                  const senderInfo = parseHeaderFrom(message.headerfrom);
                  return (
                    <div
                      key={message.id}
                      className={`flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                          : ''
                      }`}
                    >
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="flex-1 text-left p-4"
                      >
                        {/* First row: Sender's name */}
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                          {truncateText(senderInfo.name || senderInfo.email)}
                        </div>
                        
                        {/* Second row: Sender's email address (if name exists) */}
                        {senderInfo.name && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                            {senderInfo.email}
                          </div>
                        )}
                        
                        {/* Third row: Date and time */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {formatDate(message.date)} ({getRelativeTime(message.date)})
                        </div>
                        
                        {/* Fourth row: Subject */}
                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {truncateText(message.subject)}
                        </div>
                      </button>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                        className="p-3 m-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Message Content (Desktop Only) */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {(() => {
                        const senderInfo = parseHeaderFrom(selectedMessage.headerfrom);
                        return (
                          <>
                            {/* Sender's name */}
                            {senderInfo.name && (
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {senderInfo.name}
                              </div>
                            )}
                            
                            {/* Sender's email address */}
                            <div className="text-gray-600 dark:text-gray-400">
                              {senderInfo.email}
                            </div>
                            
                            {/* Date and time */}
                            <div className="text-gray-500 dark:text-gray-400">
                              {formatDate(selectedMessage.date)} ({getRelativeTime(selectedMessage.date)})
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {messageLoading ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading message content...
                  </div>
                ) : messageData?.message?.html ? (
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: messageData.message.html }}
                  />
                ) : messageData?.message?.data ? (
                  <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                    {messageData.message.data}
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    No message content available
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a message to view its content</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Email List */}
        <div className="md:hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Inbox
              </h2>
              <div className="flex flex-row gap-2">
                <button
                  onClick={handleCopyCurrentEmail}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  title="Copy email address"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleManualRefresh}
                  disabled={inboxLoading && isManualRefresh}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${inboxLoading && isManualRefresh ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={!displayedEmails?.length}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedMailbox}@maildrop.cc
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {displayedEmails?.length || 0} messages
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {(inboxLoading && isManualRefresh) ? (
              <InboxSkeleton />
            ) : inboxError ? (
              <div className="p-4 text-center">
                <div className="text-red-500 mb-2">Error loading messages</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {inboxError.message}
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : !displayedEmails?.length ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {inboxLoading ? 'Loading messages...' : 'No messages in this inbox'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayedEmails.map((message) => {
                  const senderInfo = parseHeaderFrom(message.headerfrom);
                  return (
                    <div
                      key={message.id}
                      className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <button
                        onClick={() => router.push(`/inbox/${selectedMailbox}/${message.id}`)}
                        className="flex-1 text-left p-4"
                      >
                        {/* Sender's name */}
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                          {truncateText(senderInfo.name || senderInfo.email)}
                        </div>
                        
                        {/* Sender's email address (if name exists) */}
                        {senderInfo.name && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                            {senderInfo.email}
                          </div>
                        )}
                        
                        {/* Date and time */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {formatDate(message.date)} ({getRelativeTime(message.date)})
                        </div>
                        
                        {/* Subject */}
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {truncateText(message.subject)}
                        </div>
                      </button>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                        className="p-2 mr-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Account Switcher Modal */}
      {showMobileAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Switch Account
                </h3>
                <button
                  onClick={() => setShowMobileAccountModal(false)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Accounts List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {mailboxes.map((mailbox) => (
                  <div
                    key={mailbox}
                    className={`flex items-center rounded-lg border transition-colors ${
                      selectedMailbox === mailbox
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="p-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        selectedMailbox === mailbox ? 'bg-blue-600' : 'bg-gray-500'
                      }`}>
                        {mailbox.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Account Info */}
                    <button
                      onClick={() => {
                        handleSelectMailbox(mailbox);
                        setShowMobileAccountModal(false);
                      }}
                      className={`flex-1 text-left p-3 transition-colors ${
                        selectedMailbox === mailbox
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="font-medium break-all leading-tight">
                        {mailbox}
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
                          handleCopyEmail(mailbox);
                        }}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                        title="Copy email"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      {mailboxes.length > 1 && (
                        <button
                          onClick={() => {
                            handleDeleteAccount(mailbox);
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
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {showAddForm ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter username..."
                    value={newMailbox}
                    onChange={(e) => setNewMailbox(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMailbox()}
                    autoFocus
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
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Delete Message
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this email? This action is permanent and irreversible.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteMessage}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Dialog */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Delete All Messages
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete all {displayedEmails?.length || 0} emails in this inbox? 
              This action is permanent and irreversible.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteAll}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Progress Dialog */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Deleting Messages
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deleteProgress} of {totalToDelete} deleted
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(deleteProgress / totalToDelete) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Deleting email {deleteProgress + 1} of {totalToDelete}...
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={cancelDeletionProcess}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Delete Confirmation Dialog */}
      {showAccountDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Remove Account
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will remove the account from your list only
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to remove <strong>{accountToDelete}@maildrop.cc</strong> from your accounts list? 
              This will only remove it from the UI and will NOT delete any email messages permanently. 
              You can add it back anytime.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteAccount}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
              >
                Remove Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
