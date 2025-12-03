import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const banners = ["/images/banner1.png", "/images/banner2.JPG"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(interval);
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

      {/* Text */}
      <div className="relative z-10 px-6 py-8 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide mb-4">
          Fresh Styles. Everyday Comfort.
        </h1>

        <p className="text-lg sm:text-xl opacity-90 mb-6">
          Quality you can feel. Designs that speak.
        </p>

        <button
          onClick={handleShopNow}
          className="px-8 py-3 text-lg font-semibold text-gray-800 bg-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
