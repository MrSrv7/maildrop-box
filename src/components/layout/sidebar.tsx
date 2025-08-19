'use client'

import { useState } from 'react';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/base';
import { EmailForm } from '@/components/app/inbox/email-form';

export interface SidebarProps {
  /**
   * The currently selected mailbox
   */
  selectedMailbox: string;
  
  /**
   * List of mailboxes
   */
  mailboxes: string[];
  
  /**
   * Maximum number of mailboxes allowed
   */
  maxMailboxes?: number;
  
  /**
   * Called when a mailbox is selected
   */
  onSelectMailbox: (mailbox: string) => void;
  
  /**
   * Called when a mailbox is requested to be deleted
   */
  onDeleteMailbox: (mailbox: string) => void;
  
  /**
   * Called when a new mailbox is added
   */
  onAddMailbox: (newMailbox: string) => void;
  
  /**
   * Called when an email address is copied
   */
  onCopyEmail: (mailbox: string) => void;
}

/**
 * Sidebar component for mailbox navigation
 */
export const Sidebar: React.FC<SidebarProps> = ({
  selectedMailbox,
  mailboxes,
  maxMailboxes = 10,
  onSelectMailbox,
  onDeleteMailbox,
  onAddMailbox,
  onCopyEmail
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMailbox, setNewMailbox] = useState('');
  
  const handleAddMailbox = () => {
    const trimmedMailbox = newMailbox.trim();
    if (trimmedMailbox && !mailboxes.includes(trimmedMailbox) && mailboxes.length < maxMailboxes) {
      onAddMailbox(trimmedMailbox);
      setNewMailbox('');
      setShowAddForm(false);
    }
  };

  return (
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
                onClick={() => onSelectMailbox(mailbox)}
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
                  onCopyEmail(mailbox);
                }}
                className="p-2 m-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex-shrink-0 self-start"
                title="Copy email address"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              {/* Delete account button */}
              <button
                onClick={() => onDeleteMailbox(mailbox)}
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
            <EmailForm
              onSubmit={username => {
                setNewMailbox(username);
                handleAddMailbox();
              }}
              helperText={`Enter a username (e.g. "example") or a full email address ending in @maildrop.cc`}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddMailbox}
                disabled={!newMailbox.trim() || mailboxes.includes(newMailbox.trim()) || mailboxes.length >= maxMailboxes}
                variant="primary"
                size="sm"
                fullWidth
              >
                Add
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewMailbox('');
                }}
                variant="outline"
                size="sm"
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            disabled={mailboxes.length >= maxMailboxes}
            variant="ghost"
            leftIcon={Plus}
            fullWidth
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          >
            {mailboxes.length >= maxMailboxes ? 'Maximum accounts reached' : 'Add New Address'}
          </Button>
        )}
        {mailboxes.length >= maxMailboxes && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            You can have up to {maxMailboxes} accounts
          </p>
        )}
      </div>
    </div>
  );
};
