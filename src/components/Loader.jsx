// src/components/Loader.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Loader.css';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simple progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsVisible(false);
          setTimeout(() => onComplete(), 300); // Match fadeOut duration
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loader-container ${!isVisible ? 'hidden' : ''}`}>
      <div className="loader"></div>
      <div className="loader-text">Loading</div>
      <div className="percentage">{Math.min(Math.round(progress), 100)}%</div>
    </div>
  );
}
