import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String },
    category: { type: String, enum: ['everyday', 'luxe', 'limited-edition', 'customizable'], required: true },
    isBestseller: { type: Boolean, default: false },
    onSale: { type: Boolean, default: false },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    material: { type: String },
    care: { type: String },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', ProductSchema);



