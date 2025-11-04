import { connectToDatabase } from './server/src/lib/db.js';
import { products, customizableProducts } from './src/data/products.js';
import { Product } from './server/src/models/Product.js';
import mongoose from 'mongoose';

async function seedDatabase() {
  try {
    await connectToDatabase();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Combine all products
    const allProducts = [...products, ...customizableProducts];
    
    // Insert products with generated ObjectIds
    for (const product of allProducts) {
      await Product.create({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        category: product.category,
        isBestseller: product.isBestseller || false,
        onSale: product.onSale || false,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black'],
        inStock: true
      });
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
