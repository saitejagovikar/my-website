import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../api/client';
import { getDirectImageUrl } from '../../utils/imageUtils';

const useLuxeProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet('/api/products?category=luxe');
        if (mounted) {
          setItems(data);
          setLoading(false);
        }
      } catch (_) {
        if (mounted) {
          setItems([]);
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);
  return { items, loading };
};

const ProductCard = ({ product, addToCart, user }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Normalize product ID - handle both _id (from API) and id (from static data)
  const productId = product._id || product.id;

  // Get primary and hover images
  const primaryImage = product.images && product.images.length > 0
    ? getDirectImageUrl(product.images[0])
    : product.image
      ? getDirectImageUrl(product.image)
      : '/images/black.png';

  const hoverImage = product.images && product.images.length > 1
    ? getDirectImageUrl(product.images[1])
    : primaryImage;

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or links
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/product/${productId}`);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/product/${productId}`);
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
        className="group relative cursor-pointer overflow-hidden bg-white flex flex-col h-full transition-all duration-300"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex-shrink-0 overflow-hidden">
          <div className="aspect-[3/4] flex items-center justify-center overflow-hidden bg-gray-50">
            {/* Primary Image */}
            <img
              src={primaryImage}
              alt={product.name}
              className={`object-cover w-full h-full transition-opacity duration-500 ${isHovered && hoverImage !== primaryImage ? 'opacity-0' : 'opacity-100'
                }`}
              style={{
                filter: 'blur(0)',
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
            {/* Hover Image */}
            {hoverImage !== primaryImage && (
              <img
                src={hoverImage}
                alt={`${product.name} alternate view`}
                className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{
                  filter: 'blur(0)',
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
            )}
          </div>

          {/* Luxe Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider rounded-sm bg-red-500 text-white">
              LUXE
            </span>
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handleViewDetails}
              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-6 py-2 bg-white text-black text-sm font-medium tracking-wide hover:bg-black hover:text-white"
            >
              QUICK VIEW
            </button>
          </div>
        </div>

        <div className="flex flex-col p-4 flex-grow bg-white">
          <div className="mb-auto">
            <h3 className="text-sm font-medium text-gray-900 tracking-wider uppercase mb-2 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Luxe({ addToCart, user }) {
  const { items: luxuryProducts, loading } = useLuxeProducts();
  return (
    <div className="pt-8 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-black" style={{ fontFamily: "Marcellus SC, serif" }}>
          LUXE COLLECTION
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12" style={{ fontFamily: 'Marcellus SC, serif' }}>
          Discover our premium collection of luxury tees crafted with the finest materials and exquisite attention to detail.
        </p>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : luxuryProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {luxuryProducts.map((product) => {
              // Normalize product ID - handle both _id (from API) and id (from static data)
              const productId = product._id || product.id;
              return (
                <ProductCard
                  key={productId}
                  product={product}
                  addToCart={addToCart}
                  user={user}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
