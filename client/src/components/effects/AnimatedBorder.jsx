import React from 'react';
import { motion, useAnimation } from 'framer-motion';

const AnimatedBorder = ({ children, radius = '1rem', className = '' }) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      backgroundPosition: ['0% 0%', '200% 0%'],
      transition: {
        duration: 3,
        ease: 'linear',
        repeat: Infinity,
      },
    });
  }, [controls]);

  // Parse radius for inner border radius calculation
  const radiusValue = parseFloat(radius) || 16;
  const radiusUnit = typeof radius === 'string' && radius.match(/[a-z%]+$/)?.[0] || 'px';
  const borderWidth = 3; // Increased from default 1px
  const innerRadius = `${Math.max(0, radiusValue - borderWidth)}${radiusUnit}`;

  return (
    <div className={`relative ${className}`}>
      {/* Glow shadow effect */}
      <div className="absolute inset-0" style={{ 
        borderRadius: radius,
        filter: 'blur(25px)',
        opacity: 0.8,
        margin: '-8px',
        padding: '8px'
      }}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, rgba(255,255,255,0.9) 0%, rgba(200,200,255,0.7) 50%, rgba(255,255,255,0.9) 100%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror'
          }}
        />
      </div>

      {/* Animated border */}
      <div className="relative" style={{ 
        padding: '2px',
        borderRadius: radius,
        width: '100%',
        height: '100%',
        boxShadow: '0 0 30px rgba(200,200,255,0.4), 0 10px 30px -10px rgba(0, 0, 0, 0.1)'
      }}>
        <motion.div
          className="absolute inset-0"
          style={{
            borderRadius: innerRadius,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.8) 0%, rgba(200,200,255,0.6) 50%, rgba(255,255,255,0.8) 100%)',
            backgroundSize: '200% 200%',
            opacity: 0.9,
            filter: 'blur(0.5px)',
            boxShadow: '0 0 20px rgba(200,200,255,0.3)'
          }}
          animate={{
            ...controls,
            boxShadow: [
              '0 0 15px rgba(200,200,255,0.3)',
              '0 0 35px rgba(255,255,255,0.5)',
              '0 0 15px rgba(200,200,255,0.3)'
            ]
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />

        {/* Content container */}
        <div 
          className="relative z-10 w-full h-full overflow-hidden"
          style={{ 
            borderRadius: innerRadius,
            backgroundColor: 'white',
            boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.05)'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedBorder;