import React, { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { useNavigate } from 'react-router-dom';
import { products, customizableProducts } from '../data/products';
import PhotoBanner from './PhotoBanner';

function ProductGrid({ addToCart, onViewProduct, onCustomize, user }) {
  const navigate = useNavigate();
  const handleAddToCart = (e) => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }
    const itemQuantity = e?.quantity || 1;
    for (let i = 0; i < itemQuantity; i++) {
      addToCart(e.product);
    }
  };


  // ✅ Reusable card component
  const ProductCard = ({ product, customizable }) => (
    <div
      key={product.id}
      className={`group relative border rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 
        ${customizable ? "border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50" : "border-gray-200 bg-white"}`}
    >
      {/* Image */}
      <div className="relative">
        <div className={`aspect-square flex items-center justify-center overflow-hidden 
          ${customizable ? "bg-gradient-to-br from-purple-100 to-blue-100" : "bg-gray-100"}`}>
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

        {/* Hover black overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 -z-10 transition-colors duration-500"></div>

        {/* Badges - Right side */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {product.isBestseller && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-600 text-white shadow-md">
              BESTSELLER
            </span>
          )}
          {product.onSale && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white shadow-md">
              SALE
            </span>
          )}
          {customizable && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-purple-600 shadow-md">
              CUSTOMIZABLE
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 relative z-10">
        <h3 className="text-sm font-medium text-gray-900 tracking-wide uppercase leading-relaxed mb-3">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-light text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>

        {customizable ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/customize/${product.id}`);
            }}
            className="w-full py-2.5 text-xs rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium tracking-wide uppercase
              bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            ✨ CUSTOMIZE
          </button>
        ) : (
          <div className="space-y-1">
            <div className="text-xs text-gray-500 mb-1">
              {product.description || 'Premium quality product'}
            </div>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200 text-right"
            >
              View Details →
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-8">
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Everyday Collection */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-black" style={{ fontFamily: "Marcellus SC, serif" }}>
            EVERYDAY COLLECTION
          </h2>
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
        {/* Photo Banner - Full Width */}
        <div className="w-full mt-12 mb-8">
          <PhotoBanner />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Customizable Tees */}
          <div className="mt-8">
            <div className="relative mb-10 md:mb-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-100"></div>
              </div>
              <div className="relative flex flex-col items-center mb-4">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center bg-white px-4 text-black" 
                  style={{ fontFamily: "Marcellus SC, serif" }}
                >
                  CUSTOMIZABLE TEES
                </h2>
                <span className="mt-2 w-16 h-1 bg-black rounded-full"></span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {customizableProducts.map((product) => (
                <ProductCard key={product.id} product={product} customizable />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;
