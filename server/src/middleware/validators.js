import { body, validationResult } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
export const validateRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/).withMessage('Phone must be a valid 10-digit number'),

    validate
];

// User login validation
export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validate
];

// Address validation
export const validateAddress = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name is too long'),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[0-9]{10}$/).withMessage('Phone must be a valid 10-digit number'),

    body('addressLine1')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ max: 200 }).withMessage('Address is too long'),

    body('city')
        .trim()
        .notEmpty().withMessage('City is required')
        .isLength({ max: 100 }).withMessage('City name is too long'),

    body('state')
        .trim()
        .notEmpty().withMessage('State is required')
        .isLength({ max: 100 }).withMessage('State name is too long'),

    body('pincode')
        .trim()
        .notEmpty().withMessage('Pincode is required')
        .matches(/^[0-9]{6}$/).withMessage('Pincode must be a valid 6-digit number'),

    validate
];

// Order creation validation
export const validateOrder = [
    body('items')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item'),

    body('items.*.productId')
        .notEmpty().withMessage('Product ID is required'),

    body('items.*.productName')
        .trim()
        .notEmpty().withMessage('Product name is required'),

    body('items.*.price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

    body('shippingAddress.name')
        .trim()
        .notEmpty().withMessage('Shipping name is required'),

    body('shippingAddress.phone')
        .trim()
        .matches(/^[0-9]{10}$/).withMessage('Phone must be a valid 10-digit number'),

    body('shippingAddress.addressLine1')
        .trim()
        .notEmpty().withMessage('Shipping address is required'),

    body('shippingAddress.city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('shippingAddress.state')
        .trim()
        .notEmpty().withMessage('State is required'),

    body('shippingAddress.pincode')
        .trim()
        .matches(/^[0-9]{6}$/).withMessage('Pincode must be a valid 6-digit number'),

    body('pricing.total')
        .isFloat({ min: 0 }).withMessage('Total must be a positive number'),

    validate
];

// Product validation
export const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 200 }).withMessage('Product name is too long'),

    body('price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(['everyday', 'luxe', 'limited-edition', 'customizable'])
        .withMessage('Invalid category'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    validate
];

// Payment method validation
export const validatePaymentMethod = [
    body('cardNumber')
        .optional()
        .trim()
        .matches(/^[0-9]{16}$/).withMessage('Card number must be 16 digits'),

    body('cardType')
        .optional()
        .trim()
        .isIn(['visa', 'mastercard', 'amex', 'rupay']).withMessage('Invalid card type'),

    validate
];
