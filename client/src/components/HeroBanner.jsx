// HeroBanner.jsx
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function HeroBanner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: '/client/public/images/banner1.png',
      alt: 'Hero Image 1',
      title: 'Welcome to SLAY',
      subtitle: 'Discover Amazing Products',
      textColor: 'text-black',
    },
    {
      src: '/client/public/images/banner2.JPG',
      alt: 'Hero Image 2',
      title: 'Premium Quality',
      subtitle: 'Shop with Confidence',
      textColor: 'text-white',
    },
  ];

  // Auto-slide every 5 seconds
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
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-screen min-h-[500px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay content */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/10 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl mx-auto">
                <h2
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 ${image.textColor} drop-shadow-lg`}
                  style={{ fontFamily: 'Marcellus SC, serif' }}
                >
                  {image.title}
                </h2>
                <p
                  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-6 md:mb-8 ${image.textColor} drop-shadow-md`}
                >
                  {image.subtitle}
                </p>
                <button
                  className="px-6 py-2 md:px-8 md:py-3 bg-white/20 backdrop-blur-sm rounded-full text-white border-2 border-white/30 hover:bg-white/30 transition-all duration-300 font-medium text-sm md:text-base"
                  onClick={() =>
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: 'smooth',
                    })
                  }
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}

        

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 w-3 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
