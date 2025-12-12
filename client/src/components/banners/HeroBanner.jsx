import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HeroBanner = ({ activeCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use different banners based on category
  const banners = activeCategory === 'luxe'
    ? ["/images/luxe.png"]
    : ["/images/banner1.png", "/images/banner2.JPG"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Reset index when category changes
    setIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    // Only auto-slide if there are multiple banners
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % banners.length);
      }, 7000); // Change image every 7 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const handleShopNow = () => {
    if (location.pathname === "/") {
      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden">

      {/* RIGHT → LEFT sliding animation ALWAYS */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{
          width: `${banners.length * 100}%`,
          transform: `translateX(-${index * (100 / banners.length)}%)`,
        }}
      >
        {banners.map((banner, i) => (
          <div
            key={i}
            className="w-full h-full bg-cover bg-center bg-no-repeat flex-shrink-0"
            style={{
              width: `${100 / banners.length}%`,
              backgroundImage: `url(${banner})`,
            }}
          ></div>
        ))}
      </div>

      {/* Text - Hidden for Luxe category */}
      {activeCategory !== 'luxe' && (
        <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide mb-3 sm:mb-4"
            style={{ fontFamily: '"Zalando Sans Expanded", sans-serif' }}
          >
            WEAR SLAY.SLAY EVERYTHING.
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg font-light opacity-80 mb-5 sm:mb-6"
            style={{ fontFamily: '"Zalando Sans Expanded", sans-serif', fontWeight: 300 }}
          >
            Quality you can feel. Designs that speak.
          </p>

          <button
            onClick={handleShopNow}
            className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-900 bg-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            style={{ fontFamily: '"Zalando Sans Expanded", sans-serif' }}
          >
            Shop Now
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
