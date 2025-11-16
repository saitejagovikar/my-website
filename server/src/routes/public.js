import { Router } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Banner } from '../models/Banner.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Banners
router.get('/banners', async (_req, res) => {
  const items = await Banner.find({ active: true }).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

// Products
router.get('/products', async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  const items = await Product.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

router.get('/products/:id', async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export default router;









