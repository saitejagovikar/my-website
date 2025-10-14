import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function HeroBanner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ⚡ Images must be declared inside the component
  const images = [
    {
      src: '/images/banner1.png',
      alt: 'Hero Image 1',
      title: 'Welcome to PrakriTee',
      subtitle: 'Discover Amazing Products',
      textColor: 'text-black',
    },
    {
      src: '/images/banner2.JPG',
      alt: 'Hero Image 2',
      title: 'Premium Quality',
      subtitle: 'Shop with Confidence',
      textColor: 'text-white',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full -mt-1">
      <div className="relative w-full h-[70vh] sm:h-[35vh] md:h-[40vh] lg:h-[70vh]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/20 md:bg-black/30 flex items-center justify-center">
              <div className={`text-center ${image.textColor} px-4`}>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                  style={{ fontFamily: 'Marcellus SC, serif' }}
                >
                  {image.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">
                  {image.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-3'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
