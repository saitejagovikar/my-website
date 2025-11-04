import React, { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

// Helper function to get image URLs
const getImageUrl = (path) => {
  return path.startsWith('/') ? path : `/${path}`;
};

const useLuxeProducts = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet('/api/products?category=luxe');
        if (mounted) setItems(data);
      } catch (_) {
        setItems([]);
      }
    })();
    return () => { mounted = false; };
  }, []);
  return items;
};

const ProductCard = ({ product, onViewProduct, addToCart, user }) => {
  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewProduct(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className="group relative cursor-pointer border border-gray-200 rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 bg-white flex flex-col h-full"
        onClick={handleViewDetails}
      >
        <div className="relative flex-shrink-0">
          <div className="aspect-square flex items-center justify-center overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
              onLoad={(e) => {
                e.target.style.opacity = '1';
                e.target.style.filter = 'blur(0)';
              }}
              style={{
                opacity: 0,
                filter: 'blur(8px)',
                transition: 'opacity 0.3s ease-out, filter 0.3s ease-out'
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 -z-10 transition-colors duration-500"></div>
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
              LUXE
            </span>
          </div>
        </div>
        <div className="flex flex-col p-4 flex-grow">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-900 tracking-wide uppercase leading-relaxed mb-2 line-clamp-2 h-10">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-light text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          <div className="mt-auto pt-3">
            <div 
              onClick={handleViewDetails}
              className="text-xs font-medium text-center text-gray-600 hover:text-black cursor-pointer transition-colors duration-200 tracking-wide underline underline-offset-4"
            >
              View Details
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Luxe({ addToCart, onViewProduct, user }) {
  const luxuryProducts = useLuxeProducts();
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-black" style={{ fontFamily: "Marcellus SC, serif" }}>
          LUXE COLLECTION
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12" style={{ fontFamily: 'Marcellus SC, serif' }}>
          Discover our premium collection of luxury tees crafted with the finest materials and exquisite attention to detail.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {luxuryProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart}
              onViewProduct={onViewProduct}
              user={user}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
