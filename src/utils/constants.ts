/**
 * Application constants for consistent configuration across components
 */

/**
 * Email domain used for temporary mailboxes
 */
export const EMAIL_DOMAIN = 'maildrop.cc';

/**
 * Maximum number of mailboxes to store in user preferences
 */
export const MAX_MAILBOXES = 10;

/**
 * Local storage key for saved mailboxes
 */
export const MAILBOXES_STORAGE_KEY = 'maildrop-mailboxes';

/**
 * Local storage key for user theme preference
 */
export const THEME_STORAGE_KEY = 'maildrop-theme';

/**
 * Default message to show when inbox is empty
 */
export const EMPTY_INBOX_MESSAGE = 'Your inbox is empty. Waiting for new messages...';

/**
 * Auto-refresh interval for inbox (in milliseconds)
 */
export const INBOX_REFRESH_INTERVAL = 15000; // 15 seconds

/**
 * Error message for invalid email domain
 */
export const INVALID_EMAIL_DOMAIN_MESSAGE = (domain: string) => `Please use a ${domain} address`;
