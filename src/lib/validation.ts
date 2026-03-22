// src/lib/validation.ts
export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): boolean => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  username: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    return usernameRegex.test(username);
  },

  creditCard: (cardNumber: string): boolean => {
    const cardRegex = /^[0-9]{13,19}$/;
    return cardRegex.test(cardNumber.replace(/\s/g, ''));
  },

  zipCode: (zipCode: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  },

  isRequired: (value: string | number | boolean | any[]): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  minValue: (value: number, min: number): boolean => {
    return value >= min;
  },

  maxValue: (value: number, max: number): boolean => {
    return value <= max;
  },

  match: (value: string, pattern: RegExp): boolean => {
    return pattern.test(value);
  },

  equalsIgnoreCase: (value1: string, value2: string): boolean => {
    return value1.toLowerCase() === value2.toLowerCase();
  },
};

export default validation;