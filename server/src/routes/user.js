import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { Address } from '../models/Address.js';
import { PaymentMethod } from '../models/PaymentMethod.js';
import { OTP } from '../models/OTP.js';
import { generateToken, verifyToken } from '../middleware/auth.js';
import { validateRegistration, validateLogin, validateAddress, validatePaymentMethod } from '../middleware/validators.js';
import { sendOTPEmail, sendPasswordResetConfirmation, sendWelcomeEmail } from '../config/mailer.js';

const router = Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

// Helper function removed - now using JWT tokens from req.user

// Google OAuth Login
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for OAuth users
        role: 'user',
        picture,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Please contact support.' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    // Send welcome email asynchronously (don't block response)
    sendWelcomeEmail(email, name)
      .catch(err => console.error('Failed to send welcome email:', err.message));

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

// User Registration
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: 'user', // Default role
    });

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// User Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'Email not registered. Please sign up to create an account.',
        notRegistered: true
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Please contact support.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user (protected route)
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
});

// Addresses CRUD
router.get('/addresses', verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Failed to get addresses', error: error.message });
  }
});

router.post('/addresses', verifyToken, validateAddress, async (req, res) => {
  try {
    const addressData = req.body;

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await Address.updateMany({ userId: req.user.userId }, { isDefault: false });
    }

    const address = await Address.create({
      ...addressData,
      userId: req.user.userId,
    });

    res.status(201).json(address);
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ message: 'Failed to create address', error: error.message });
  }
});

router.put('/addresses/:id', verifyToken, validateAddress, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is set as default, unset other defaults
    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.user.userId, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Failed to update address', error: error.message });
  }
});

router.delete('/addresses/:id', verifyToken, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await Address.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Failed to delete address', error: error.message });
  }
});

// Payment Methods CRUD
router.get('/payment-methods', verifyToken, async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ userId: req.user.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(paymentMethods);
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Failed to get payment methods', error: error.message });
  }
});

router.post('/payment-methods', verifyToken, validatePaymentMethod, async (req, res) => {
  try {
    const { cardNumber, ...paymentData } = req.body;

    if (!cardNumber) {
      return res.status(400).json({ message: 'Card number is required' });
    }

    // Store only last 4 digits for security
    const last4Digits = cardNumber.slice(-4);

    // Determine card type
    let cardType = 'other';
    if (cardNumber.startsWith('4')) cardType = 'visa';
    else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) cardType = 'mastercard';
    else if (cardNumber.startsWith('3')) cardType = 'amex';

    // If this is set as default, unset other defaults
    if (paymentData.isDefault) {
      await PaymentMethod.updateMany({ userId: req.user.userId }, { isDefault: false });
    }

    const paymentMethod = await PaymentMethod.create({
      ...paymentData,
      cardNumber: last4Digits,
      cardType,
      userId: req.user.userId,
    });

    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error('Create payment method error:', error);
    res.status(500).json({ message: 'Failed to create payment method', error: error.message });
  }
});

router.put('/payment-methods/:id', verifyToken, validatePaymentMethod, async (req, res) => {
  try {
    const { cardNumber, ...updateData } = req.body;

    const paymentMethod = await PaymentMethod.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // If card number is provided, update last 4 digits
    if (cardNumber) {
      updateData.cardNumber = cardNumber.slice(-4);
      // Update card type
      if (cardNumber.startsWith('4')) updateData.cardType = 'visa';
      else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) updateData.cardType = 'mastercard';
      else if (cardNumber.startsWith('3')) updateData.cardType = 'amex';
    }

    // If this is set as default, unset other defaults
    if (updateData.isDefault) {
      await PaymentMethod.updateMany({ userId: req.user.userId, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    const updated = await PaymentMethod.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({ message: 'Failed to update payment method', error: error.message });
  }
});

router.delete('/payment-methods/:id', verifyToken, async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ message: 'Failed to delete payment method', error: error.message });
  }
});

// Cart Management
router.get('/cart', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user's cart or empty array if no cart exists
    res.json(user.cart || []);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to get cart', error: error.message });
  }
});

router.put('/cart', verifyToken, async (req, res) => {
  try {
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      console.error('Cart is not an array:', typeof cart);
      return res.status(400).json({ message: 'Cart must be an array' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's cart
    user.cart = cart;
    await user.save();
    res.json({ message: 'Cart updated successfully', cart: user.cart });
  } catch (error) {
    console.error('Update cart error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
});

// ==================== PASSWORD RESET ROUTES ====================

// Request OTP for password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If the email exists, an OTP has been sent' });
    }

    // Check for recent OTP requests (rate limiting)
    const recentOTP = await OTP.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) } // Last 1 minute
    });

    if (recentOTP) {
      return res.status(429).json({
        message: 'Please wait before requesting another OTP',
        retryAfter: 60
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing unverified OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase(), verified: false });

    // Create new OTP
    await OTP.create({
      email: email.toLowerCase(),
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otpCode, user.name);
      res.json({ message: 'OTP sent to your email' });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process request', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find the OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      verified: false,
    }).sort({ createdAt: -1 }); // Get the most recent one

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if expired
    if (otpRecord.isExpired()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check if max attempts reached
    if (otpRecord.hasMaxAttempts()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'Maximum attempts exceeded. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await otpRecord.incrementAttempts();
      const remainingAttempts = 3 - otpRecord.attempts;
      return res.status(400).json({
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`
      });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
});

// Reset password with verified OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find verified OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      verified: true,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or unverified OTP' });
    }

    // Check if expired (even though verified)
    if (otpRecord.isExpired()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send confirmation email (don't wait for it)
    sendPasswordResetConfirmation(email, user.name).catch(err =>
      console.error('Failed to send confirmation email:', err)
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
});

export default router;

