'use client'

import { useState, use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Mail, RefreshCw, Trash2, Plus, MoreVertical } from 'lucide-react';
import { GET_INBOX, DELETE_MESSAGE, GET_MESSAGE, EmailMessage, InboxData, MessageData } from '@/lib/graphql-queries';
import { ThemeToggle } from '@/components/app/theme-toggle';

interface InboxPageProps {
  params: Promise<{
    mailbox: string;
  }>;
}

export default function InboxPage({ params }: InboxPageProps) {
  const resolvedParams = use(params);
  const [selectedMailbox, setSelectedMailbox] = useState<string>(resolvedParams.mailbox || 'example');
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [mailboxes, setMailboxes] = useState<string[]>([resolvedParams.mailbox || 'example']);
  const [newMailbox, setNewMailbox] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Query for inbox data
  const { data: inboxData, loading: inboxLoading, error: inboxError, refetch: refetchInbox } = useQuery<InboxData>(
    GET_INBOX,
    {
      variables: { mailbox: selectedMailbox },
      pollInterval: 30000, // Poll every 30 seconds
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    }
  );

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
    try {
      await deleteMessage({
        variables: {
          mailbox: selectedMailbox,
          id: messageId,
        },
      });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleAddMailbox = () => {
    if (newMailbox.trim() && !mailboxes.includes(newMailbox.trim())) {
      setMailboxes([...mailboxes, newMailbox.trim()]);
      setNewMailbox('');
      setShowAddForm(false);
    }
  };

  const handleSelectMailbox = (mailbox: string) => {
    setSelectedMailbox(mailbox);
    setSelectedMessage(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Maildrop Box
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Mailboxes */}
        <div className="w-80 md:flex hidden border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Addresses</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {mailboxes.map((mailbox) => (
                <button
                  key={mailbox}
                  onClick={() => handleSelectMailbox(mailbox)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    selectedMailbox === mailbox
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium">{mailbox}@maildrop.cc</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {inboxData?.inbox?.length || 0} messages
                  </div>
                </button>
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
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Address
              </button>
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
              <button
                onClick={() => refetchInbox()}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedMailbox}@maildrop.cc
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {inboxData?.inbox?.length || 0} messages
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {inboxLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading messages...
              </div>
            ) : inboxError ? (
              <div className="p-4 text-center">
                <div className="text-red-500 mb-2">Error loading messages</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {inboxError.message}
                </div>
                <button
                  onClick={() => refetchInbox()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : !inboxData?.inbox?.length ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No messages in this inbox
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {inboxData.inbox.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100 truncate pr-2">
                        {message.headerfrom}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(message.date)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {message.subject}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Message Content (Desktop) / Full Panel (Mobile) */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>From: {selectedMessage.headerfrom}</div>
                  <div>Date: {formatDate(selectedMessage.date)}</div>
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
                <div className="md:block hidden">
                  <p className="text-lg">Select a message to view its content</p>
                </div>
                <div className="md:hidden block">
                  <p className="text-lg mb-4">Welcome to {selectedMailbox}@maildrop.cc</p>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {inboxData?.inbox?.length || 0} messages in inbox
                    </p>
                    {inboxData?.inbox?.length ? (
                      <div className="space-y-2 max-w-md mx-auto">
                        {inboxData.inbox.slice(0, 3).map((message) => (
                          <button
                            key={message.id}
                            onClick={() => setSelectedMessage(message)}
                            className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {message.headerfrom}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {message.subject}
                            </div>
                          </button>
                        ))}
                        {inboxData.inbox.length > 3 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            +{inboxData.inbox.length - 3} more messages
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No messages yet. Share this address to receive emails!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
