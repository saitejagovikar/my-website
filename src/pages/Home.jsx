// src/pages/Home.jsx
import React, { useState } from 'react';
import HeroBanner from '../components/HeroBanner.jsx';
import ScrollingBanner from '../components/ScrollingBanner.jsx';
import CategoryTabs from '../components/CategoryTabs.jsx';
import ProductGrid from '../components/ProductsGrid.jsx';
import Luxe from './Luxe.jsx';

export default function Home({ 
  addToCart, 
  onViewProduct, 
  onCustomize,
  user 
}) {
  const [activeCategory, setActiveCategory] = useState('everyday');
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  return (
    <>
      {/* Hero Banner and Scrolling Banner - No Space */}
      <div className="w-full">
        <HeroBanner />
        <div className="relative -mt-1">
          <ScrollingBanner />
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Conditionally render content based on active category */}
      {activeCategory === 'luxe' ? (
        <Luxe 
          addToCart={addToCart} 
          user={user}
        />
      ) : (
        <ProductGrid 
          addToCart={addToCart} 
          user={user}
        />
      )}
    </>
  );
}
