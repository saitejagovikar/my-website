// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left: Brand and Social Links */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col items-start">
              <h2
                className="text-xl md:text-2xl font-bold leading-none"
                style={{ fontFamily: '"Nosifer", sans-serif', fontWeight: 400 }}
              >
                SLAY
              </h2>
              <span 
                className="text-xs text-gray-300 -mt-0.5"
                style={{ fontFamily: '"Zalando Sans Expanded", sans-serif', fontWeight: 300, fontStyle: 'italic', display: 'block' }}
              >
                a fashion tee brand
              </span>
            </div>
            <div className="flex space-x-4 md:space-x-6">
              <a
                href="https://instagram.com"
                className="hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a
                href="https://facebook.com"
                className="hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a
                href="https://twitter.com"
                className="hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm justify-items-start md:justify-items-end md:ml-auto">
              <Link
                to="/about"
                className="hover:text-red-500 transition-colors duration-200 py-1"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="hover:text-red-500 transition-colors duration-200 py-1"
              >
                Contact
              </Link>
              <Link
                to="/shipping"
                className="hover:text-red-500 transition-colors duration-200 py-1"
              >
                Shipping
              </Link>
              <Link
                to="/returns"
                className="hover:text-red-500 transition-colors duration-200 py-1"
              >
                Returns
              </Link>
              <Link
                to="/privacy"
                className="hover:text-red-500 transition-colors duration-200 py-1"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-red-500 transition-colors duration-200 py-1"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Description - Hidden on mobile */}
        <div className="hidden md:block mt-6 text-center">
          <p className="text-xs text-gray-400 max-w-2xl mx-auto">
            Discover unique, customizable t-shirts that reflect your style.
            Premium quality, sustainable fashion for the conscious consumer.
          </p>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-800">
          <div className="text-2xs md:text-xs text-center text-gray-500">
            © {new Date().getFullYear()} SLAY. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
