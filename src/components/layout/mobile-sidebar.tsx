'use client'

import React from 'react';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { Modal, Input } from '@/components/base';

export interface MobileSidebarProps {
  /**
   * Whether the mobile sidebar is open
   */
  isOpen: boolean;
  
  /**
   * Called when the mobile sidebar is closed
   */
  onClose: () => void;
  
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
   * The value for the new mailbox input
   */
  newMailbox: string;
  
  /**
   * Called when the new mailbox input changes
   */
  onNewMailboxChange: (value: string) => void;
  
  /**
   * Whether to show the add mailbox form
   */
  showAddForm: boolean;
  
  /**
   * Called when the show add form state changes
   */
  onShowAddFormChange: (show: boolean) => void;
  
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
 * Mobile sidebar modal component for mailbox navigation
 */
export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  selectedMailbox,
  mailboxes,
  maxMailboxes = 10,
  newMailbox,
  onNewMailboxChange,
  showAddForm,
  onShowAddFormChange,
  onSelectMailbox,
  onDeleteMailbox,
  onAddMailbox,
  onCopyEmail
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Account"
      size="md"
      className="max-w-md"
    >
      <div className="max-h-96 overflow-y-auto">
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
                  onSelectMailbox(mailbox);
                  onClose();
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
                    onCopyEmail(mailbox);
                  }}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  title="Copy email"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                {mailboxes.length > 1 && (
                  <button
                    onClick={() => {
                      onDeleteMailbox(mailbox);
                      if (mailboxes.length === 1) {
                        onClose();
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
              onChange={(e) => onNewMailboxChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onAddMailbox(newMailbox)}
              autoFocus
              fullWidth
            />
            <div className="flex gap-2">
              <button
                onClick={() => onAddMailbox(newMailbox)}
                disabled={!newMailbox.trim() || mailboxes.includes(newMailbox.trim()) || mailboxes.length >= maxMailboxes}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Account
              </button>
              <button
                onClick={() => {
                  onShowAddFormChange(false);
                  onNewMailboxChange('');
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onShowAddFormChange(true)}
            disabled={mailboxes.length >= maxMailboxes}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            {mailboxes.length >= maxMailboxes ? 'Maximum accounts reached' : 'Add New Account'}
          </button>
        )}
        {mailboxes.length >= maxMailboxes && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            You can have up to {maxMailboxes} accounts
          </p>
        )}
      </div>
    </Modal>
  );
};
