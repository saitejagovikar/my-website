import { useEffect, useRef } from 'react';

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const ElectricBorder = ({
  children,
  color = '#5227FF',
  speed = 1,
  thickness = 3, // Slightly increased default thickness
  className = '',
  style = {},
  pulse = true,
  intensity = 0.8,
  shadow = true
}) => {
  const borderRef = useRef(null);
  const animationId = useRef();
  const animationStart = useRef(0);

  const animate = (timestamp) => {
    if (!animationStart.current) animationStart.current = timestamp;
    const elapsed = timestamp - animationStart.current;
    const progress = (elapsed / (1000 / speed)) % 1;
    
    if (borderRef.current) {
      const angle = progress * 360;
      // Add a subtle pulsing effect to the scale
      const scale = 1 + (Math.sin(progress * Math.PI * 2) * 0.02 * intensity);
      borderRef.current.style.setProperty('--gradient-angle', `${angle}deg`);
      borderRef.current.style.transform = `scale(${scale})`;
    }
    
    animationId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (pulse) {
      animationStart.current = 0;
      animationId.current = requestAnimationFrame(animate);
    } else if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      if (borderRef.current) {
        borderRef.current.style.transform = 'scale(1)';
      }
    }
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [pulse, speed, intensity]);

  useEffect(() => {
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  // Enhanced color variations for a more vibrant effect
  const color1 = hexToRgba(color, 0.9);
  const color2 = hexToRgba(color, 0.6);
  const color3 = hexToRgba(color, 0.9);

  return (
    <div 
      ref={borderRef}
      className={`electric-border ${className}`}
      style={{
        '--thickness': `${thickness}px`,
        '--color1': color1,
        '--color2': color2,
        '--color3': color3,
        '--shadow-color': hexToRgba(color, 0.3),
        transform: 'scale(1)',
        transition: 'transform 0.3s ease-out',
        ...style,
      }}
      data-shadow={shadow}
    >
      <div className="electric-border__content">
        {children}
      </div>
      <style>{`
        @property --gradient-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        .electric-border {
          --gradient-angle: 0deg;
          position: relative;
          background: conic-gradient(
            from var(--gradient-angle),
            var(--color1),
            var(--color2),
            var(--color3),
            var(--color1)
          );
          padding: var(--thickness);
          border-radius: inherit;
          z-index: 0;
          transform-origin: center;
          will-change: transform;
          box-shadow: 0 0 0 0 transparent;
          transition: box-shadow 0.3s ease-out;
        }

        .electric-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: var(--thickness);
          background: inherit;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
        }

        .electric-border[data-shadow="true"] {
          box-shadow: 
            0 0 30px 0 var(--shadow-color),
            0 0 15px 0 var(--shadow-color);
        }

        .electric-border[data-shadow="true"]:hover {
          box-shadow: 
            0 0 45px 5px var(--shadow-color),
            0 0 25px 0 var(--shadow-color);
        }

        .electric-border__content {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: ${style.background || 'inherit'};
          overflow: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .electric-border {
            animation: none !important;
            transform: none !important;
            background: linear-gradient(
              90deg,
              var(--color1),
              var(--color2),
              var(--color3),
              var(--color1)
            );
          }
          
          .electric-border[data-shadow="true"] {
            box-shadow: 0 0 20px 0 var(--shadow-color);
          }
        }
      `}</style>
    </div>
  );
};

export default ElectricBorder;