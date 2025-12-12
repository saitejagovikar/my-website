import { Router } from 'express';
import { Product } from '../models/Product.js';
import { Banner } from '../models/Banner.js';
import { Order } from '../models/Order.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validators.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyToken, verifyAdmin);

// Banners CRUD
router.post('/banners', async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Failed to create banner', error: error.message });
  }
});

router.put('/banners/:id', async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Banner not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Failed to update banner', error: error.message });
  }
});

router.delete('/banners/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Failed to delete banner', error: error.message });
  }
});

// Products CRUD
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.post('/products', validateProduct, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

router.put('/products/:id', validateProduct, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// Admin Order Management
router.get('/orders', async (req, res) => {
  try {
    const { status, paymentStatus, limit = 50, skip = 0 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('userId', 'name email phone');

    const total = await Order.countDocuments(filter);

    res.json({ orders, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Admin can update any field
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

export default router;
