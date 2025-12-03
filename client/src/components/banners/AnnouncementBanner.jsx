import React from 'react';
import '../../styles/announcement-banner.css';

function AnnouncementBanner() {
  const text = '🎉 New Year Offer: Get 20% off on all products! Limited time only. 🎉';
  const repeatedText = Array(4).fill(text).join('    •••    ');

  return (
    <div className="announcement-banner">
      <div className="announcement-marquee">
        <span className="announcement-text">
          {repeatedText}
        </span>
      </div>
    </div>
  );
}

export default AnnouncementBanner;
