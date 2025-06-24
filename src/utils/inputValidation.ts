
// Client-side input validation utilities
export const validatePhoneNumber = (phone: string): boolean => {
  // Basic phone number validation
  const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
  return phoneRegex.test(phone) && phone.length >= 10 && phone.length <= 20;
};

export const validateTelegramUsername = (username: string): boolean => {
  // Telegram username validation (5-32 chars, alphanumeric + underscore, no consecutive underscores)
  const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
  return usernameRegex.test(username) && !username.includes('__');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeTextInput = (input: string): string => {
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim();
};

export const validateMessageContent = (message: string): string | null => {
  if (!message || message.trim().length === 0) {
    return 'Message cannot be empty';
  }
  if (message.length > 4096) {
    return 'Message is too long (max 4096 characters)';
  }
  return null;
};

export const validateApiToken = (token: string): string | null => {
  if (!token || token.trim().length === 0) {
    return 'API token cannot be empty';
  }
  // Basic Telegram bot token format validation
  const tokenRegex = /^\d+:[A-Za-z0-9_-]{35}$/;
  if (!tokenRegex.test(token)) {
    return 'Invalid Telegram bot token format';
  }
  return null;
};
