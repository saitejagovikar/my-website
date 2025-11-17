import React, { useState } from 'react';

const AddToCartButton = ({ 
  onClick, 
  className = '', 
  children = 'ADD TO CART', 
  disabled = false,
  showQuantity = true,
  quantity = 1,
  onIncrement,
  onDecrement
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;
    
    setIsAdded(true);
    if (onClick) {
      // Pass the quantity to the onClick handler
      const eventWithQuantity = { ...e, quantity };
      onClick(eventWithQuantity);
    }
    
    // Reset the button state after animation
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showQuantity && (
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDecrement?.();
            }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
            type="button"
          >
            −
          </button>
          <span className="px-3 py-2 min-w-[2rem] text-center">{quantity}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIncrement?.();
            }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
            type="button"
          >
            +
          </button>
        </div>
      )}
      
      <button
        onClick={handleClick}
        disabled={disabled || isAdded}
        className={`relative overflow-hidden py-3 px-6 rounded-xl font-medium transition-all duration-300 flex-1 ${
          isAdded 
            ? 'bg-green-500 text-white' 
            : 'bg-black text-white hover:bg-gray-800'
        }`}
        style={{ fontFamily: 'Marcellus SC, serif' }}
      >
        <span className={`transition-opacity duration-300 ${isAdded ? 'opacity-0' : 'opacity-100'}`}>
          {children}
        </span>
        <span 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isAdded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="ml-2">ADDED!</span>
        </span>
      </button>
    </div>
  );
};

export default AddToCartButton;
