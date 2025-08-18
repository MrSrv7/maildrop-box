/**
 * Validates if the given email is a valid maildrop address
 * 
 * @param email - Email to validate
 * @param domain - Domain to validate against (default: maildrop.cc)
 * @returns Error message if invalid, empty string if valid
 */
export const validateMaildropEmail = (email: string, domain: string = 'maildrop.cc'): string => {
  if (!email) return '';
  
  // If the input contains @, validate it's a proper domain
  if (email.includes('@') && !email.endsWith(`@${domain}`)) {
    return `Please use a ${domain} address`;
  }
  
  return '';
};

/**
 * Extract username from an email address or return the input if it's already a username
 * 
 * @param emailOrUsername - Email address or username
 * @returns Username extracted from the email or the original input if no @ symbol is found
 */
export const extractUsername = (emailOrUsername: string): string => {
  if (!emailOrUsername) return '';
  return emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername;
};

/**
 * Truncate a string if it's longer than maxLength
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - String to append when truncating (default: '...')
 * @returns Truncated string
 */
export const truncateText = (
  text: string, 
  maxLength: number = 50, 
  suffix: string = '...'
): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};
