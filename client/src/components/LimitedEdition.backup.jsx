import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LimitedEdition = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: 'easeOut' }
      });
    } else {
      controls.start({
        opacity: 0,
        filter: 'blur(10px)',
        transition: { duration: 0.5 }
      });
    }
  }, [controls, inView]);

  const products = [
    {
      id: 'dragon-tee',
      name: 'Dragon Design Tee',
      image: '/images/dragon.png',
      alt: 'Dragon Limited Edition',
      description: 'Exclusive dragon design t-shirt, limited edition',
      price: 39.99,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White'],
      details: 'Handcrafted dragon design on premium cotton fabric. Limited edition collectible.',
      category: 'limited-edition',
      inStock: true,
      rating: 4.8,
      reviews: 124,
      material: '100% Cotton',
      care: 'Machine wash cold, tumble dry low'
    },
    {
      id: 'anime-tee',
      name: 'Anime Art Tee',
      image: '/images/anime.png',
      alt: 'Anime Limited Edition',
      description: 'Unique anime artwork t-shirt, limited edition',
      price: 34.99,
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'Gray'],
      details: 'Vibrant anime artwork on soft cotton blend. Limited stock available.',
      category: 'limited-edition',
      inStock: true,
      rating: 4.9,
      reviews: 98,
      material: 'Cotton Blend',
      care: 'Machine wash cold, tumble dry low'
    },
  ];

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { 
      state: { 
        from: '/limited-edition',
        product: product
      } 
    });
  };

  return (
    <Box 
      ref={ref}
      className="py-12 bg-white overflow-hidden"
      component={motion.div}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={controls}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative mb-10 md:mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-100"></div>
            </div>
            <div className="relative flex flex-col items-center mb-4">
              <Typography 
                variant="h3" 
                component="h2" 
                className="text-2xl md:text-3xl font-bold text-center bg-white px-4 text-black"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                LIMITED EDITION
              </Typography>
              <span className="mt-2 w-16 h-1 bg-black rounded-full"></span>
            </div>
          </div>
        </motion.div>
        <Box 
          component={motion.div}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            justifyContent: 'center',
            '& > *': {
              flex: '1 1 calc(50% - 4px)',
              minWidth: '45%',
              maxWidth: '48%',
              '@media (max-width: 900px)': {
                flex: '1 1 100%',
                maxWidth: '100%',
              },
            },
          }}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="relative overflow-hidden rounded-lg shadow-lg group"
              variants={{
                hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  filter: 'blur(0px)',
                  transition: { 
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }
              }}
            >
              <div className="relative overflow-hidden" style={{ height: '500px' }}>
                <motion.img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '12px 30px',
                    border: '2px solid white',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    opacity: 0,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'black',
                      transform: 'translate(-50%, -50%) scale(1.05)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(product);
                    '&:hover .overlay': { opacity: 1 },
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.alt}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />

                  {/* Overlay */}
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '12px 30px',
                      border: '2px solid white',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'black',
                        transform: 'translate(-50%, -50%) scale(1.05)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(product);
                    }}
                  >
                    VIEW DETAILS
                  </Box>
                </Box>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LimitedEdition;
