import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../api/client';

const LimitedEdition = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: 'easeOut' },
      });
    } else {
      controls.start({
        opacity: 0,
        filter: 'blur(10px)',
        transition: { duration: 0.5 },
      });
    }
  }, [controls, inView]);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet('/api/products?category=limited-edition');
        if (mounted) setProducts(data);
      } catch (_) {
        setProducts([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleViewDetails = (product) => {
    // Normalize product ID - handle both _id (from API) and id (from static data)
    const productId = product._id || product.id;
    navigate(`/product/${productId}`, {
      state: { from: '/limited-edition', product },
    });
  };

  return (
    <Box
      ref={ref}
      component={motion.div}
      className="py-16 bg-white overflow-hidden"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={controls}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative mb-8 md:mb-12 px-2">
            <Typography
              variant="h3"
              component="h2"
              className="text-2xl sm:text-3xl font-bold text-left text-black"
              style={{ fontFamily: 'Marcellus SC, serif' }}
            >
              LIMITED EDITION
            </Typography>
            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-black rounded-full mt-2 sm:mt-3"></div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <Box
          component={motion.div}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'center' },
            gap: { xs: '8px', sm: '10px' },
          }}
        >
          {products.map((product) => {
            // Normalize product ID - handle both _id (from API) and id (from static data)
            const productId = product._id || product.id;
            return (
            <motion.div
              key={productId}
              className="relative group overflow-hidden shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              whileHover={{
                scale: 1.02,
                transition: { 
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              style={{
                flex: '1 1 48%',
                minWidth: { xs: '48%', sm: '48%', md: '45%', lg: '500px' },
                maxWidth: { xs: '48%', sm: '48%', md: '45%', lg: '500px' },
                cursor: 'pointer',
                position: 'relative',
                margin: '0',
              }}
              onClick={() => handleViewDetails(product)}
            >
              {/* Product Image */}
              {/* Product Image */}
              <div className="w-full" style={{ paddingTop: '140%', position: 'relative', overflow: 'hidden' }}>
                <motion.img
                  src={product.image}
                  alt={product.alt}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Hover Overlay with only View Details button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1, backdropFilter: 'blur(6px)' }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-center items-center"
                >
                  <Box
                    sx={{
                      border: '2px solid white',
                      px: 3,
                      py: 1,
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      '&:hover': {
                        backgroundColor: 'white',
                        color: 'black',
                        transition: 'all 0.3s ease',
                      },
                    }}
                  >
                    View Details
                  </Box>
                </motion.div>
              </div>
              
              {/* Product Details Below Image */}
              <div className="p-3 text-center">
                <Typography 
                  variant="h6" 
                  className="font-semibold mb-1"
                  style={{ fontFamily: 'Marcellus SC, serif' }}
                >
                  {product.name}
                </Typography>
                <div className="flex justify-center items-center gap-2 mb-1">
                  <span className="font-bold text-black text-lg">₹{product.price}</span>
                  <span className="text-gray-400 line-through text-sm">₹{Math.round(product.price * 1.5)}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">In Stock</span>
                </div>
              </div>
            </motion.div>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default LimitedEdition;
