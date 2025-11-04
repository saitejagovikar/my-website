import { Router } from 'express';
import { Product } from '../models/Product.js';
import { Banner } from '../models/Banner.js';

// NOTE: Authentication middleware can be added later. For now, open endpoints.

const router = Router();

// Banners CRUD
router.post('/banners', async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});

router.put('/banners/:id', async (req, res) => {
  const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/banners/:id', async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.status(204).end();
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

router.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put('/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;





