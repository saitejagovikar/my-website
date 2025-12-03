// src/components/ScrollingBanner.jsx
import React from "react";
// removed unused import that could break build

export default function ScrollingBanner() {
  return (
    <div className="w-full bg-black overflow-hidden relative">
      {/* Track (this is what moves) */}
      <div className="animate-marquee flex whitespace-nowrap will-change-transform">
        {/* First copy */}
        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
          NEW ARRIVAL
        </span>

        {/* Duplicate for seamless loop */}
        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>

        {/* Additional copies for seamless loop */}
        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>

        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>

        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>

        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>

        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>

        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>

        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>

        <span className="text-white text-[8px] sm:text-[10px] tracking-widest py-2 px-4 sm:px-16 flex-shrink-0">
        NEW ARRIVAL
        </span>
        
      </div>
    </div>
  );
}
