import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedBorder from '../effects/AnimatedBorder';

const CustomizableTees = ({ customizableProducts = [] }) => {
  const navigate = useNavigate();

  if (!customizableProducts || !customizableProducts.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="mt-8">
        <div className="relative mb-10 md:mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-100"></div>
          </div>
          <div className="relative flex flex-col items-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center bg-white px-4 text-black" style={{ fontFamily: "Marcellus SC, serif" }}>
              CUSTOMIZABLE TEES
            </h2>
            <span className="mt-2 w-16 h-1 bg-black rounded-full"></span>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedBorder radius="1.25rem" className="w-full">
            <div className="w-full py-6 sm:py-8 md:py-10 bg-white rounded-2xl">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-5/12 lg:w-2/5">
                    <div className="relative w-full aspect-square sm:aspect-[3/4] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-2 border-white/30">
                      <motion.img
                        src={customizableProducts[0].image}
                        alt={customizableProducts[0].name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
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

                  <div className="w-full md:w-7/12 lg:w-3/5 space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Marcellus SC, serif' }}>
                      {customizableProducts[0].name}
                    </h2>

                    <p className="text-sm sm:text-base text-gray-700">
                      Create your own unique t-shirt with our easy-to-use customization tool.
                      Choose from various colors, add text, or upload your own design!
                    </p>

                    <div className="flex items-center gap-2 pt-2">
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
                      <motion.button
                        onClick={() => navigate(`/customize/${customizableProducts[0].id}`)}
                        className="px-6 py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 group shadow-md"
                        whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          START CUSTOMIZING
                        </span>
                      </motion.button>
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
            </div>
          </AnimatedBorder>
        </div>
      </div>
    </div>
  );
};

export default CustomizableTees;
