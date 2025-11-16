import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Address } from '../models/Address.js';
import { PaymentMethod } from '../models/PaymentMethod.js';

const router = Router();

// Helper function to get user ID from request (for now, we'll use email as identifier)
// In production, you'd use JWT tokens
const getUserId = async (req) => {
  const { email } = req.body;
  if (!email) return null;
  const user = await User.findOne({ email });
  return user?._id;
};

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

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
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get user by email
router.get('/user', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email }).select('-password');
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
router.get('/addresses', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addresses = await Address.find({ userId: user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Failed to get addresses', error: error.message });
  }
});

router.post('/addresses', async (req, res) => {
  try {
    const { email, ...addressData } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await Address.updateMany({ userId: user._id }, { isDefault: false });
    }

    const address = await Address.create({
      ...addressData,
      userId: user._id,
    });

    res.status(201).json(address);
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ message: 'Failed to create address', error: error.message });
  }
});

router.put('/addresses/:id', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = await Address.findOne({ _id: req.params.id, userId: user._id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is set as default, unset other defaults
    if (req.body.isDefault) {
      await Address.updateMany({ userId: user._id, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Failed to update address', error: error.message });
  }
});

router.delete('/addresses/:id', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = await Address.findOne({ _id: req.params.id, userId: user._id });
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
router.get('/payment-methods', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const paymentMethods = await PaymentMethod.find({ userId: user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(paymentMethods);
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Failed to get payment methods', error: error.message });
  }
});

router.post('/payment-methods', async (req, res) => {
  try {
    const { email, cardNumber, ...paymentData } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!cardNumber) {
      return res.status(400).json({ message: 'Card number is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
      await PaymentMethod.updateMany({ userId: user._id }, { isDefault: false });
    }

    const paymentMethod = await PaymentMethod.create({
      ...paymentData,
      cardNumber: last4Digits,
      cardType,
      userId: user._id,
    });

    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error('Create payment method error:', error);
    res.status(500).json({ message: 'Failed to create payment method', error: error.message });
  }
});

router.put('/payment-methods/:id', async (req, res) => {
  try {
    const { email, cardNumber, ...updateData } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const paymentMethod = await PaymentMethod.findOne({ _id: req.params.id, userId: user._id });
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
      await PaymentMethod.updateMany({ userId: user._id, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    const updated = await PaymentMethod.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({ message: 'Failed to update payment method', error: error.message });
  }
});

router.delete('/payment-methods/:id', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const paymentMethod = await PaymentMethod.findOne({ _id: req.params.id, userId: user._id });
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

export default router;

