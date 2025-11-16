// src/pages/Customize.jsx
import React, { useState, useEffect } from 'react';

export default function Customize({ product, onBack, onAddToCart, user }) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="mb-4">Product not found</p>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [customText, setCustomText] = useState('Your Text Here');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [customFontUrl, setCustomFontUrl] = useState('');
  const [isCustomFont, setIsCustomFont] = useState(false);
  const [isFontLoading, setIsFontLoading] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [textEffect, setTextEffect] = useState('none');
  const [gradientColors, setGradientColors] = useState(['#000000', '#4f46e5']);
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [useGradient, setUseGradient] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });

  // Popular Google Fonts
  const googleFonts = [
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open+Sans' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Oswald', value: 'Oswald' },
    { name: 'Roboto Condensed', value: 'Roboto+Condensed' },
    { name: 'Source Sans Pro', value: 'Source+Sans+Pro' },
    { name: 'Nunito', value: 'Nunito' },
    { name: 'Raleway', value: 'Raleway' },
    { name: 'PT Sans', value: 'PT+Sans' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Custom (Paste URL)', value: 'custom' }
  ];

  // Load Google Font
  useEffect(() => {
    if (isCustomFont && customFontUrl) {
      setIsFontLoading(true);
      const link = document.createElement('link');
      link.href = customFontUrl;
      link.rel = 'stylesheet';
      
      link.onload = () => {
        // Extract font family from URL
        const fontNameMatch = customFontUrl.match(/family=([^:&]+)/);
        if (fontNameMatch && fontNameMatch[1]) {
          const fontName = fontNameMatch[1].split('&')[0].replace(/\+/g, ' ');
          setFontFamily(fontName);
        }
        setIsFontLoading(false);
      };
      
      link.onerror = () => {
        console.error('Failed to load custom font');
        setIsFontLoading(false);
      };
      
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [customFontUrl, isCustomFont]);
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState('normal');
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedTeeImage, setSelectedTeeImage] = useState('/images/white.png');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50, scale: 100 });
  const [designType, setDesignType] = useState('text'); // 'text', 'upload', 'template'

  const teeOptions = [
    { name: 'Classic White', value: 'white', image: '/images/white.png' },
    { name: 'Premium Black', value: 'black', image: '/images/black.png' },
    { name: 'Ocean Blue', value: 'blue', image: '/images/blue.png' },
    { name: 'Charcoal Grey', value: 'grey', image: '/images/grey.png' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const designTemplates = [
    { id: 1, name: 'Beach Vibes', description: 'Tropical paradise', preview: '/images/beach.png' },
    { id: 2, name: 'Bargandi Style', description: 'Traditional patterns', preview: '/images/bargandi.png' },
    { id: 3, name: 'Minimalist', description: 'Clean and simple', preview: '/images/white.png' },
    { id: 4, name: 'Vintage', description: 'Retro inspired', preview: '/images/grey.png' },
    { id: 5, name: 'Geometric', description: 'Modern shapes', preview: '/images/blue.png' },
    { id: 6, name: 'Abstract', description: 'Artistic patterns', preview: '/images/black.png' }
  ];

  const handleAIGenerate = async () => {
    if (!customText.trim()) {
      alert("Please enter some text to generate a design");
      return;
    }
  
    setIsGenerating(true);
    setDesignType("ai");
  
    try {
      const res = await fetch("http://localhost:5000/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customText })
      });
  
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedDesign({
          id: Date.now(),
          name: "AI Generated Design",
          preview: data.imageUrl,
          type: "ai",
        });
      } else {
        alert("Image generation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating image");
    } finally {
      setIsGenerating(false);
    }
  };
  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          id: Date.now(),
          name: file.name,
          url: e.target.result,
          type: 'upload'
        });
        setDesignType('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePositionChange = (axis, value) => {
    setImagePosition(prev => ({
      ...prev,
      [axis]: value
    }));
  };

  const handleTeeSelection = (tee) => {
    setSelectedColor(tee.value);
    setSelectedTeeImage(tee.image);
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);

    const customizedProduct = {
      ...product,
      name: `${product.name} - Customized`,
      price: product.price + 200, // Add customization fee
      customizations: {
        text: customText,
        color: selectedColor,
        size: selectedSize,
        design: selectedDesign || generatedDesign || uploadedImage,
        designType: designType,
        imagePosition: imagePosition,
        textPosition: { x: 0, y: 0 }, // Default position
        fontSize: 18, // Default font size
        fontFamily: 'sans-serif', // Default font family
        textColor: '#000000' // Default text color
      }
    };

    onAddToCart(customizedProduct);
    
    // Reset animation after 1 second
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  // Add animation styles
  const buttonStyles = {
    transform: isAddingToCart ? 'scale(0.95)' : 'scale(1)',
    transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
    backgroundColor: isAddingToCart ? '#10B981' : '#000000',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {/* Customization Panel */}
          <div className="space-y-8">
            <div>
              <h1 
                className="text-3xl md:text-4xl font-bold text-black mb-2"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                CUSTOMIZE YOUR TEE
              </h1>
              <p className="text-gray-600">Create a unique design with AI assistance</p>
            </div>

            {/* Design Type Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 
                className="text-xl font-semibold mb-4 text-black"
              >
                Choose Design Method
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setDesignType('text')}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    designType === 'text'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">✏️</div>
                  <div className="text-sm font-medium">Add Text</div>
                </button>
                <button
                  onClick={() => setDesignType('upload')}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    designType === 'upload'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">📷</div>
                  <div className="text-sm font-medium">Upload Image</div>
                </button>
                <button
                  onClick={() => setDesignType('template')}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    designType === 'template'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm font-medium">Template</div>
                </button>
              </div>

              {/* Text Design Editor */}
              {designType === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your text
                    </label>
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none text-sm"
                      placeholder="Type your text here..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          Text Color
                        </label>
                        <label className="flex items-center text-xs text-gray-700">
                          <input
                            type="checkbox"
                            checked={useGradient}
                            onChange={(e) => setUseGradient(e.target.checked)}
                            className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-1">Gradient</span>
                        </label>
                      </div>
                      
                      {!useGradient ? (
                        <div className="flex items-center space-x-2">
                          <input 
                            type="color" 
                            value={textColor} 
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-10 h-10 rounded border border-gray-300"
                          />
                          <span className="text-sm">{textColor.toUpperCase()}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1">
                            {gradientColors.map((color, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => {
                                    const newColors = [...gradientColors];
                                    newColors[index] = e.target.value;
                                    setGradientColors(newColors);
                                  }}
                                  className="w-8 h-8 rounded border border-gray-300"
                                />
                                {gradientColors.length > 2 && (
                                  <button
                                    onClick={() => {
                                      const newColors = [...gradientColors];
                                      newColors.splice(index, 1);
                                      setGradientColors(newColors);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                            {gradientColors.length < 4 && (
                              <button
                                onClick={() => setGradientColors([...gradientColors, '#000000'])}
                                className="w-8 h-8 flex items-center justify-center border-2 border-dashed border-gray-300 rounded hover:border-gray-400 text-gray-400 hover:text-gray-600"
                              >
                                <span className="text-lg">+</span>
                              </button>
                            )}
                          </div>
                          <select
                            value={gradientDirection}
                            onChange={(e) => setGradientDirection(e.target.value)}
                            className="w-full p-1 text-xs border rounded"
                          >
                            <option value="to right">→ Left to Right</option>
                            <option value="to left">← Right to Left</option>
                            <option value="to bottom">↓ Top to Bottom</option>
                            <option value="to top">↑ Bottom to Top</option>
                            <option value="to bottom right">↘ Diagonal</option>
                            <option value="to top right">↗ Diagonal</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Position: X {textPosition.x}%</span>
                          <span>Y {textPosition.y}%</span>
                        </div>
                        <div className="space-y-1">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={textPosition.x}
                            onChange={(e) => setTextPosition({...textPosition, x: parseInt(e.target.value)})}
                            className="w-full h-1.5"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={textPosition.y}
                            onChange={(e) => setTextPosition({...textPosition, y: parseInt(e.target.value)})}
                            className="w-full h-1.5"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <select
                      value={isCustomFont ? 'custom' : fontFamily.replace(/ /g, '+')}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomFont(true);
                        } else {
                          setIsCustomFont(false);
                          setFontFamily(e.target.value.replace(/\+/g, ' '));
                          // Load Google Font
                          const link = document.createElement('link');
                          link.href = `https://fonts.googleapis.com/css2?family=${e.target.value}:wght@400;700&display=swap`;
                          link.rel = 'stylesheet';
                          document.head.appendChild(link);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {googleFonts.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                    {isCustomFont && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={customFontUrl}
                          onChange={(e) => setCustomFontUrl(e.target.value)}
                          placeholder="Paste Google Fonts URL here"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Example: https://fonts.googleapis.com/css2?family=Your+Font&display=swap
                        </p>
                        {isFontLoading && (
                          <p className="text-xs text-blue-500 mt-1">Loading font...</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Weight
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setFontWeight('normal')}
                        className={`py-2 border rounded-lg ${
                          fontWeight === 'normal' ? 'bg-black text-white border-black' : 'border-gray-300'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setFontWeight('bold')}
                        className={`py-2 border rounded-lg ${
                          fontWeight === 'bold' ? 'bg-black text-white border-black' : 'border-gray-300'
                        }`}
                      >
                        Bold
                      </button>
                      <button
                        onClick={() => setFontWeight('lighter')}
                        className={`py-2 border rounded-lg ${
                          fontWeight === 'lighter' ? 'bg-black text-white border-black' : 'border-gray-300'
                        }`}
                      >
                        Light
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload */}
              {designType === 'upload' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload your image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                  {uploadedImage && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Image:</p>
                      <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                        <img src={uploadedImage.url} alt="Uploaded" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Design Templates */}
            {designType === 'template' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 
                  className="text-xl font-semibold mb-4 text-black"
                >
                  Choose a Template
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {designTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedDesign(template);
                        setDesignType('template');
                      }}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedDesign?.id === template.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                      <div className="text-left">
                        <div className="font-medium text-sm text-black">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Position Controls */}
            {(designType === 'upload' && uploadedImage) || (designType === 'ai' && generatedDesign) || (designType === 'template' && selectedDesign) ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 
                  className="text-xl font-semibold mb-4 text-black"
                >
                  Design Position & Size
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horizontal Position: {imagePosition.x}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={imagePosition.x}
                      onChange={(e) => handleImagePositionChange('x', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vertical Position: {imagePosition.y}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={imagePosition.y}
                      onChange={(e) => handleImagePositionChange('y', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {imagePosition.scale}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={imagePosition.scale}
                      onChange={(e) => handleImagePositionChange('scale', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Tee Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 
                className="text-xl font-semibold mb-4 text-black"
              >
                Choose Your Tee
              </h3>
              <p className="text-sm text-gray-500 mb-4">Select your preferred t-shirt style</p>
              <div className="grid grid-cols-2 gap-4">
                {teeOptions.map((tee) => (
                  <button
                    key={tee.value}
                    onClick={() => handleTeeSelection(tee)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedColor === tee.value ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={tee.image} 
                        alt={tee.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm text-black">{tee.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 
                className="text-xl font-semibold mb-4 text-black"
              >
                Choose Size
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full h-12 border-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-black">Total Price:</span>
                <span 
                  className="text-2xl font-bold text-black"
                >
                  ₹{product.price + 200}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Base price: ₹{product.price} + Customization: ₹200
              </p>
              <button
                onClick={handleAddToCart}
                className={`w-full text-white py-4 rounded-xl font-medium flex items-center justify-center ${
                  isAddingToCart ? 'bg-green-500' : 'bg-black hover:bg-gray-800'
                } transition-all duration-300`}
                disabled={isAddingToCart}
                style={buttonStyles}
              >
                {isAddingToCart ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ADDED!
                  </>
                ) : (
                  'ADD CUSTOMIZED TEE TO CART'
                )}
              </button>
            </div>
          </div>

            {/* Preview Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold mb-4 text-black">
                Live Preview
              </h3>
              <div className="aspect-[1/1] max-w-xs mx-auto bg-gray-100 rounded-xl relative overflow-hidden">
                {/* Tee Preview */}
                <div className="absolute inset-2 rounded-lg shadow-inner overflow-hidden">
                  <img 
                    src={selectedTeeImage} 
                    alt="Selected Tee"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Design Overlay */}
                  {(generatedDesign || selectedDesign || uploadedImage || (designType === 'text' && customText)) ? (
                    <div 
                      className="absolute"
                      style={{
                        left: designType === 'text' ? '50%' : `${imagePosition.x}%`,
                        top: designType === 'text' ? '50%' : `${imagePosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: designType === 'text' ? '100%' : `${imagePosition.scale * 0.8}px`,
                        height: designType === 'text' ? '100%' : `${imagePosition.scale * 0.8}px`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                    >
                      {uploadedImage && (
                        <img 
                          src={uploadedImage.url} 
                          alt="Custom"
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                      {designType === 'text' && customText && (
                        <div 
                          className="w-full h-full flex items-center justify-center p-2 absolute"
                          style={{
                            color: useGradient || textEffect === 'gradient' ? 'transparent' : textColor,
                            fontFamily: fontFamily,
                            fontSize: `${fontSize}px`,
                            fontWeight: fontWeight,
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            letterSpacing: `${letterSpacing}px`,
                            lineHeight: lineHeight,
                            left: `${textPosition.x}%`,
                            top: `${textPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            ...((useGradient || textEffect === 'gradient') && {
                              background: `linear-gradient(${gradientDirection}, ${gradientColors.join(', ')})`,
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }),
                            ...(textEffect === 'outline' && {
                              WebkitTextStroke: `1px ${textColor}`,
                              color: 'transparent'
                            })
                          }}
                        >
                          {customText}
                        </div>
                      )}

                      {selectedDesign && (
                        <div className="w-full h-full bg-white/90 rounded flex items-center justify-center text-xs text-gray-600 font-medium">
                          {selectedDesign.name}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* No Design State */
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium">Choose a design method</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customization Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 
                className="text-xl font-semibold mb-4 text-black"
              >
                Customization Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Product:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tee Style:</span>
                  <span className="font-medium">{teeOptions.find(t => t.value === selectedColor)?.name || selectedColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{selectedSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Design Type:</span>
                  <span className="font-medium capitalize">{designType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Design:</span>
                  <span className="font-medium">
                    {designType === 'text' ? 'Custom Text' : selectedDesign ? selectedDesign.name : uploadedImage ? uploadedImage.name : 'None selected'}
                  </span>
                </div>
                {customText && designType === 'text' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Custom Text:</span>
                      <span className="font-medium">"{customText}"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Font:</span>
                      <span className="font-medium">{fontFamily} ({fontWeight})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size & Color:</span>
                      <span className="font-medium">{fontSize}px, {textColor.toUpperCase()}</span>
                    </div>
                  </div>
                )}
                {(generatedDesign || selectedDesign || uploadedImage) && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">{imagePosition.x}%, {imagePosition.y}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{imagePosition.scale}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
