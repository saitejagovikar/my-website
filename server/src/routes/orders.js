import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';
import { validateOrder } from '../middleware/validators.js';

const router = Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RpzLDatJLkAeV3',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret'
});


// Create Razorpay order (for payment gateway)
router.post('/create-razorpay-order', verifyToken, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_RpzLDatJLkAeV3'
    });
  } catch (error) {
    console.error('❌ Razorpay order creation error:');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    console.error('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set');
    console.error('Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not set');
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
});

// Verify Razorpay payment signature
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification parameters' });
    }

    // Create signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.json({ verified: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ verified: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

// Create a new order
router.post('/', verifyToken, validateOrder, async (req, res) => {
  try {
    const orderData = req.body;

    // Generate unique order number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `SLY-${timestamp}-${random}`;

    // Create order with user ID from JWT token
    const order = await Order.create({
      ...orderData,
      userId: req.user.userId,
      orderNumber: orderNumber,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Get all orders for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to get orders', error: error.message });
  }
});

// Get a single order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to get order', error: error.message });
  }
});

// Update order status (for admin or user cancellation)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber, notes } = req.body;

    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update allowed fields
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

// Update order with payment details (after Razorpay payment)
router.post('/:id/payment', verifyToken, async (req, res) => {
  try {
    const { paymentId, orderId, signature, status, paymentStatus } = req.body;

    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update payment details
    if (paymentId) {
      order.paymentMethod.paymentId = paymentId;
    }
    if (orderId) {
      order.paymentMethod.transactionId = orderId;
    }

    // Update order status
    if (status) {
      order.status = status;
    }

    // Update payment status
    if (paymentStatus) {
      order.paymentStatus = paymentStatus === 'completed' ? 'paid' : paymentStatus;
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Failed to update payment', error: error.message });
  }
});

// Cancel an order
router.post('/:id/cancel', verifyToken, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: `Order cannot be cancelled. Current status: ${order.status}` });
    }

    order.status = 'cancelled';
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
});

export default router;
