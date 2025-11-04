import React, { useEffect, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { useNavigate } from 'react-router-dom';
import { products as staticProducts, customizableProducts } from '../data/products';
import { apiGet } from '../api/client';
import PhotoBanner from './PhotoBanner';
import ElectricBorder from './ElectricBorder';
import LimitedEdition from './LimitedEdition';

function ProductGrid({ addToCart, onViewProduct, onCustomize, user }) {
  const navigate = useNavigate();
  const [fetchedProducts, setFetchedProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await apiGet('/api/products?category=everyday');
        if (isMounted) setFetchedProducts(data);
      } catch (e) {
        setError(e?.message || 'Failed to load');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);
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
      className={`group relative border rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 shadow-md hover:shadow-xl
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
            {(fetchedProducts || staticProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Limited Edition Section */}
          <div className="mt-16 w-full">
            <LimitedEdition />
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
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <ElectricBorder 
                color="white"
                speed={0.5}
                chaos={0.5}
                thickness={2}
                glowIntensity={0.8}
                style={{ 
                  borderRadius: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(190, 201, 205, 0.9) 0%, rgb(145, 207, 224) 100%)',
                  boxShadow: '0 10px 30px -10px rgba(175, 141, 231, 0.2)'
                }}
                className="w-full py-6 sm:py-8 md:py-10"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Image Side - More compact on mobile */}
                    <div className="w-full md:w-5/12 lg:w-2/5">
                      <div className="relative w-full aspect-square sm:aspect-[3/4] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-2 border-white/30">
                        <img
                          src={customizableProducts[0].image}
                          alt={customizableProducts[0].name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-white/95 text-purple-600 shadow-md backdrop-blur-sm border border-white/20">
                            <span className="relative flex h-2 w-2 mr-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                            </span>
                            CUSTOMIZE
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Text Side - Stacked on mobile */}
                    <div className="w-full md:w-7/12 lg:w-3/5 space-y-3 sm:space-y-4 text-center md:text-left">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Marcellus SC, serif' }}>
                        {customizableProducts[0].name}
                      </h2>
                      
                      <p className="text-sm sm:text-base text-gray-700">
                        Create your own unique t-shirt with our easy-to-use customization tool.
                        Choose from various colors, add text, or upload your own design!
                      </p>
                      
                      <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                        <span className="text-2xl sm:text-3xl font-light text-gray-900">
                          ₹{customizableProducts[0].price}
                        </span>
                        {customizableProducts[0].originalPrice && (
                          <span className="text-sm sm:text-base text-gray-500 line-through">
                            ₹{customizableProducts[0].originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <div className="pt-2">
                        <button
                          onClick={() => navigate(`/customize/${customizableProducts[0].id}`)}
                          className="w-full sm:w-auto relative overflow-hidden px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 group"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span className="relative flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            START CUSTOMIZING
                          </span>
                        </button>
                      </div>
                      
                      <div className="pt-3">
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                          {[
                            'Premium quality fabric that lasts',
                            'Easy-to-use design tool',
                            'Fast shipping and easy returns'
                          ].map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                              <span className="text-left">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </ElectricBorder>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;
