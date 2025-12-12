// src/pages/Explore.jsx
import React from 'react';

export default function Explore() {
  const exploreCategories = [
    {
      id: 1,
      name: "NEW ARRIVALS",
      description: "Discover our latest collection",
      image: "/api/placeholder/400/300",
      count: "12 items"
    },
    {
      id: 2,
      name: "BESTSELLERS",
      description: "Our most loved designs",
      image: "/api/placeholder/400/300",
      count: "8 items"
    },
    {
      id: 3,
      name: "SEASONAL",
      description: "Perfect for every season",
      image: "/api/placeholder/400/300",
      count: "15 items"
    },
    {
      id: 4,
      name: "LIMITED EDITION",
      description: "Exclusive designs",
      image: "/api/placeholder/400/300",
      count: "5 items"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "SIGNATURE COLLECTION",
      description: "Our most iconic designs",
      image: "/api/placeholder/300/400"
    },
    {
      id: 2,
      name: "ARTIST COLLABORATION",
      description: "Limited edition artist series",
      image: "/api/placeholder/300/400"
    },
    {
      id: 3,
      name: "SUSTAINABLE LINE",
      description: "Eco-friendly materials",
      image: "/api/placeholder/300/400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black to-gray-800 text-white pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            EXPLORE
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            Discover our diverse collection of premium tees, from everyday essentials to luxury pieces
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            SHOP BY CATEGORY
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {exploreCategories.map((category) => (
              <div key={category.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm">{category.count}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 
                    className="text-xl font-semibold mb-2 text-black group-hover:text-gray-600 transition-colors"
                    style={{ fontFamily: 'Marcellus SC, serif' }}
                  >
                    {category.name}
                  </h3>
                  <p className="text-gray-500">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            FEATURED COLLECTIONS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative bg-gray-100 rounded-2xl overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 
                      className="text-2xl font-bold mb-2"
                      style={{ fontFamily: 'Marcellus SC, serif' }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-200">{product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-black text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                10K+
              </div>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div>
              <div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                500+
              </div>
              <p className="text-gray-300">Designs</p>
            </div>
            <div>
              <div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                50+
              </div>
              <p className="text-gray-300">Cities</p>
            </div>
            <div>
              <div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                24/7
              </div>
              <p className="text-gray-300">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            STAY UPDATED
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Subscribe to our newsletter for exclusive offers and new arrivals
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
              style={{ fontFamily: 'Marcellus SC, serif' }}
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
