import React from 'react';

export default function CategoryTabs({ activeCategory = 'everyday', onCategoryChange = () => {} }) {
  return (
    <div className="w-full bg-white py-8">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex justify-center">
          <div className="relative flex bg-gray-100 rounded-full p-1">
            {/* Animated background slider */}
            <div 
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-black transition-all duration-300 ease-in-out ${
                activeCategory === 'everyday' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            
            {/* Everyday button */}
            <button
              onClick={() => onCategoryChange('everyday')}
              className={`relative z-10 px-8 py-3 rounded-full font-medium transition-colors duration-300 ${
                activeCategory === 'everyday' ? 'text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              EVERYDAY
            </button>

            {/* Luxe button */}
            <button
              onClick={() => onCategoryChange('luxe')}
              className={`relative z-10 px-8 py-3 rounded-full font-medium transition-colors duration-300 ${
                activeCategory === 'luxe' ? 'text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              LUXE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
