import React from 'react';

function AnnouncementBanner() {
  const text = '🎉 New Year Offer: Get 20% off on all products! Limited time only. 🎉';
  const repeatedText = Array(4).fill(text).join('    •••    ');

  return (
    <div className="w-full overflow-hidden bg-[#6a040f] relative z-50">
      <div className="animate-marquee whitespace-nowrap py-2">
        <span className="inline-flex items-center px-8 text-sm md:text-base font-medium text-white" style={{ fontFamily: "'Marcellus SC', serif" }}>
          {repeatedText}
        </span>
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 45s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default AnnouncementBanner;
