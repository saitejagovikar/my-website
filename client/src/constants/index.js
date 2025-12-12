// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/user/login',
        REGISTER: '/api/user/register',
        GOOGLE_LOGIN: '/api/user/google-login',
    },
    USER: {
        PROFILE: '/api/user/profile',
        UPDATE_PROFILE: '/api/user/profile',
        ADDRESSES: '/api/user/addresses',
        PAYMENT_METHODS: '/api/user/payment-methods',
    },
    PASSWORD: {
        FORGOT: '/api/user/forgot-password',
        VERIFY_OTP: '/api/user/verify-otp',
        RESET: '/api/user/reset-password',
    },
    ORDERS: {
        CREATE: '/api/orders',
        GET_USER_ORDERS: '/api/orders/user',
        GET_ORDER: (id) => `/api/orders/${id}`,
        UPDATE_STATUS: (id) => `/api/orders/${id}/status`,
    },
    PRODUCTS: {
        GET_ALL: '/api/public/products',
        GET_ONE: (id) => `/api/public/products/${id}`,
    },
    ADMIN: {
        PRODUCTS: '/api/admin/products',
        ORDERS: '/api/admin/orders',
        USERS: '/api/admin/users',
        ANALYTICS: '/api/admin/analytics',
    },
    PAYMENT: {
        CREATE_RAZORPAY_ORDER: '/api/orders/create-razorpay-order',
        VERIFY_PAYMENT: '/api/orders/verify-payment',
    },
    UPLOAD: {
        IMAGE: '/api/upload',
    },
};

// Routes
export const ROUTES = {
    HOME: '/',
    SHOP: '/shop',
    EXPLORE: '/shop',
    LUXE: '/luxe',
    PRODUCT_DETAIL: (id) => `/product/${id}`,
    CUSTOMIZE: (id) => `/customize/${id}`,
    CART: '/cart',
    CHECKOUT: '/checkout',
    PROFILE: '/profile',
    ORDER_DETAIL: (id) => `/order/${id}`,
    LOGIN: '/login',
    ADMIN: '/admin',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_ANALYTICS: '/admin/analytics',
    ABOUT: '/about',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    SHIPPING: '/shipping',
    RETURNS: '/returns',
};

// App Constants
export const APP_CONFIG = {
    SITE_NAME: 'SLAY',
    SITE_TAGLINE: 'a fashion tee brand',
    FREE_SHIPPING_THRESHOLD: 999,
    STANDARD_SHIPPING_COST: 99,
    COD_LIMIT: 5000,
    COD_FEE: 50,
    CURRENCY: 'INR',
    CURRENCY_SYMBOL: '₹',
};

// Order Status
export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
};

// Payment Methods
export const PAYMENT_METHODS = {
    COD: 'cod',
    RAZORPAY: 'razorpay',
};

// User Roles
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
};

// Delivery Timelines
export const DELIVERY_TIMELINE = {
    METRO_CITIES: '3-5 business days',
    OTHER_CITIES: '5-7 business days',
};

// Contact Info
export const CONTACT_INFO = {
    EMAIL: 'support@slay.com',
    PHONE: '+91 7780-661493',
    ADDRESS: 'Hyderabad, Telangana, India',
};
