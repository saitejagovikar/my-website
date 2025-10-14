// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mellicous: ['Mellicous SC', 'cursive'],
        marcellus: ['Marcellus SC', 'serif'],
      },
      keyframes: {
        // we move the track left by 50% because we duplicate content for seamless loop
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        grow: {
          '0%': { 
            transform: 'scale(0.5)',
            opacity: '0.5'
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '0.8'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
        },
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
        grow: 'grow 0.8s ease-out',
      },
    },
  },

  theme: {
    extend: { 
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', filter: 'blur(8px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
