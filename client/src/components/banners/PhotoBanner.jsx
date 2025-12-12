import React, { useState } from 'react';

const PhotoBanner = () => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    console.error('Video failed to load:', '/videos/banner.mp4');
    setVideoError(true);
  };

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden" style={{
        width: '100%',
        height: '400px',
        maxWidth: '711px', // 400 * (16/9) ≈ 711
        margin: '0 auto'
      }}>
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={handleVideoError}
            className="w-full h-full object-cover rounded-lg"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
          >
            <source src="/videos/banner.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Video unavailable</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoBanner;
