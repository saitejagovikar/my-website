import React from 'react';

const PhotoBanner = () => {
  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden" style={{
        width: '100%',
        height: '400px',
        maxWidth: '711px', // 400 * (16/9) ≈ 711
        margin: '0 auto'
      }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        >
          <source src="/client/public/videos/banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default PhotoBanner;
