// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from '../../components/products/AddToCartButton';
import { getDirectImageUrl } from '../../utils/imageUtils';

export default function ProductDetail({ product, onBack, onAddToCart, user }) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState('');

  // Get all available images (from images array or single image)
  const allImages = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  // Current selected image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Current product image being displayed
  const productImage = allImages.length > 0
    ? getDirectImageUrl(allImages[currentImageIndex])
    : '/images/black.png'; // fallback image

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleAddToCart = (e) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    if (!selectedSize) {
      setSizeError('Please select a size');
      return;
    }

    const itemToAdd = {
      ...product,
      size: selectedSize,
      quantity: quantity
    };

    onAddToCart(itemToAdd);
  };

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to proceed with checkout');
      return;
    }

    if (!selectedSize) {
      setSizeError('Please select a size');
      return;
    }

    const itemToCheckout = {
      ...product,
      size: selectedSize,
      quantity: quantity
    };

    onAddToCart(itemToCheckout);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Products</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            {/* Image Gallery */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Thumbnail Gallery - Left Side */}
              {allImages.length > 1 && (
                <div className="flex md:flex-col space-y-2 md:space-y-3 space-x-2 md:space-x-0 overflow-y-auto md:max-h-[500px] py-2 -mx-2 px-2 md:px-0 md:mx-0 md:py-0 md:pr-4">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${index === currentImageIndex
                        ? 'border-black'
                        : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                      <img
                        src={getDirectImageUrl(img)}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/black.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1">
                <div
                  className={`relative aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isZoomed ? 'scale-110' : 'hover:scale-105'
                    }`}
                  onClick={handleImageClick}
                >
                  <img
                    src={productImage}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.filter = 'blur(0)';
                    }}
                    onError={(e) => {
                      e.target.src = '/images/black.png';
                      e.target.style.opacity = '1';
                      e.target.style.filter = 'blur(0)';
                    }}
                    style={{
                      opacity: 0,
                      filter: 'blur(8px)',
                      transition: 'opacity 0.3s ease-out, filter 0.3s ease-out'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white/90 text-black px-2 py-1 rounded-full text-xs font-semibold">
                    {product.category === 'luxe' || product.category === 'luxury'
                      ? 'LUXE'
                      : product.category === 'limited-edition'
                        ? 'LIMITED EDITION'
                        : 'EVERYDAY'}
                  </div>
                  {isZoomed && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm">Click to zoom out</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold text-black mb-2"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span
                className="text-3xl font-bold text-black"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span
                    className="text-xl text-gray-400 line-through"
                    style={{ fontFamily: 'Marcellus SC, serif' }}
                  >
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Save ₹{Math.round(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Product Features */}
            <div className="space-y-3">
              <h3
                className="text-lg font-semibold text-black"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                Product Features
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>100% Pure Cotton</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Pre-shrunk & Soft</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Machine Washable</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free Shipping All Over India</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>7-Day Easy Returns</span>
                </li>
              </ul>
            </div>

            {/* Size Selection */}
            <div>
              <h3
                className="text-lg font-semibold text-black mb-3"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                Size
              </h3>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError('');
                      }}
                      className={`w-12 h-12 border rounded-lg transition-colors flex items-center justify-center ${selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:border-black'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-red-500 text-sm">{sizeError}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3
                  className="text-lg font-semibold text-black"
                  style={{ fontFamily: 'Marcellus SC, serif' }}
                >
                  Quantity
                </h3>
                <AddToCartButton
                  onClick={handleAddToCart}
                  className={`w-full py-4 ${!selectedSize ? 'opacity-70 cursor-not-allowed' : ''}`}
                  showQuantity={true}
                  disabled={!selectedSize}
                  quantity={quantity}
                  onIncrement={() => setQuantity(prev => prev + 1)}
                  onDecrement={() => setQuantity(prev => Math.max(1, prev - 1))}
                />
              </div>
              <button
                onClick={handleCheckout}
                disabled={!selectedSize}
                className={`w-full py-4 rounded-xl font-medium transition-colors ${selectedSize
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                {selectedSize ? 'BUY NOW' : 'SELECT SIZE'}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h4
                className="font-semibold text-black mb-2"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                Shipping Information
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Free shipping on orders above ₹999</li>
                <li>• Standard delivery: 3-5 business days</li>
                <li>• Express delivery: 1-2 business days (₹99 extra)</li>
                <li>• Cash on delivery available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
