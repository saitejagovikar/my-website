import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import AddToCartButton from "./AddToCartButton";
import { useNavigate } from 'react-router-dom';
import { customizableProducts } from '../../data/products';
import { apiGet } from '../../api/client';
import PhotoBanner from '../banners/PhotoBanner';
import LimitedEdition from './LimitedEdition';
import CustomizableTees from './CustomizableTees';

function ProductGrid({ addToCart, onViewProduct, onCustomize, user }) {
  const navigate = useNavigate();
  const [fetchedProducts, setFetchedProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await apiGet(`/api/products?category=everyday&_t=${Date.now()}`);
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

  const ProductCard = ({ product, customizable }) => {
    const productId = product._id || product.id;

    const handleCardClick = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      navigate(`/product/${productId}`);
    };

    return (
      <div
        key={productId}
        onClick={handleCardClick}
        className={`group relative border rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 shadow-md hover:shadow-xl cursor-pointer
        ${customizable ? "border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50" : "border-gray-200 bg-white"}`}
      >
        <div className="relative">
          <div className={`aspect-square flex items-center justify-center overflow-hidden 
          ${customizable ? "bg-gradient-to-br from-purple-100 to-blue-100" : "bg-gray-100"}`}>
            <img
              src={product.images?.[0] || product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
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

          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            {product.isBestseller && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-600 text-white shadow-md">
                BESTSELLER
              </span>
            )}
            {product.onSale && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white shadow-md">
                SALE
              </span>
            )}
            {customizable && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-purple-600 shadow-md">
                CUSTOMIZABLE
              </span>
            )}
          </div>
        </div>

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
                navigate(`/customize/${productId}`);
              }}
              className="w-full py-2.5 text-xs rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium tracking-wide uppercase bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            >
              ✨ CUSTOMIZE
            </button>
          ) : (
            <div className="space-y-1">
              <div className="text-xs text-gray-500 mb-1">
                {product.description || 'Premium quality product'}
              </div>
              <div className="text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200 text-right">
                View Details →
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* EVERYDAY COLLECTION TITLE */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-black" style={{ fontFamily: "Marcellus SC, serif" }}>
            EVERYDAY COLLECTION
          </h2>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="w-full text-center py-4 mb-6 bg-red-100 text-red-700 font-medium rounded-lg">
              🚨 Unable to fetch products — Backend might be offline.
            </div>
          )}

          {/* LOADING MESSAGE */}
          {loading && !error && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          )}

          {/* PRODUCT GRID */}
          {!loading && !error && (
            <motion.div
              className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate={!loading && !error ? "show" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {fetchedProducts && fetchedProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id}
                  variants={{
                    hidden: { opacity: 0, filter: 'blur(8px)', y: 20 },
                    show: {
                      opacity: 1,
                      filter: 'blur(0px)',
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: 'easeOut'
                      }
                    }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Limit Edition */}
          <div className="mt-16 w-full">
            <LimitedEdition />
          </div>
        </div>

        {/* Photo Banner */}
        <div className="w-full mt-12 mb-8">
          <PhotoBanner />
        </div>

        {/* Customizable Tees Section */}
        <CustomizableTees customizableProducts={customizableProducts} />

      </div>
    </div>
  );
}

export default ProductGrid;
