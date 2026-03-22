export const APP_NAME = 'Fittrustmedicals';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const PRODUCT_CATEGORIES = [
  'Diagnostics',
  'Monitoring',
  'Protection',
  'First Aid',
  'Mobility',
  'Respiratory',
];

export const PAGINATION_LIMIT = 12;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',

  // Products
  GET_PRODUCTS: '/products',
  GET_PRODUCT: '/products/:id',
  CREATE_PRODUCT: '/products',
  UPDATE_PRODUCT: '/products/:id',
  DELETE_PRODUCT: '/products/:id',

  // Orders
  GET_ORDERS: '/orders',
  GET_ORDER: '/orders/:id',
  CREATE_ORDER: '/orders',
  UPDATE_ORDER: '/orders/:id',

  // Cart
  GET_CART: '/cart',
  ADD_TO_CART: '/cart/items',
  REMOVE_FROM_CART: '/cart/items/:id',
  UPDATE_CART: '/cart/items/:id',

  // User
  GET_USER: '/users/me',
  UPDATE_USER: '/users/me',
  GET_PROFILE: '/users/:id',
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const SHIPPING_METHODS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight',
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};