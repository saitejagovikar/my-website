import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../api/client';

const LimitedEdition = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet('/api/products?category=limited-edition');
        if (mounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (_) {
        if (mounted) {
          setProducts([]);
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleViewDetails = (product) => {
    const productId = product._id || product.id;
    navigate(`/product/${productId}`, {
      state: { from: '/limited-edition', product },
    });
  };

  return (
    <Box
      ref={ref}
      className="py-16 bg-white overflow-hidden"
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>

        {/* ⭐ STATIC TITLE (NO ANIMATION) */}
        <div className="relative mb-8 md:mb-12 px-2">
          <Typography
            variant="h3"
            component="h2"
            className="text-2xl sm:text-3xl font-bold text-left text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            LIMITED EDITION
          </Typography>
          <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-white rounded-full mt-2 sm:mt-3"></div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No limited edition products available.</p>
          </div>
        ) : (
          /* ⭐ PRODUCT GRID WITH ANIMATION */
          <Box
            component={motion.div}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delay: 0.2,
                  staggerChildren: 0.15
                },
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
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }}
                  style={{
                    flex: '1 1 48%',
                    minWidth: '48%',
                    maxWidth: '500px',
                    cursor: 'pointer',
                    position: 'relative',
                    margin: '0',
                  }}
                  onClick={() => handleViewDetails(product)}
                >
                  {/* PRODUCT IMAGE */}
                  <div
                    className="w-full"
                    style={{
                      paddingTop: '140%',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.img
                      src={product.images?.[0] || product.image}
                      alt={product.alt || product.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {/* Hover Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col justify-center items-center bg-black/40"
                      style={{ backdropFilter: 'blur(4px)' }}
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

                  {/* PRODUCT DETAILS */}
                  <div className="p-3 text-center">
                    <Typography
                      variant="h6"
                      className="font-semibold mb-1"
                      style={{ fontFamily: 'Marcellus SC, serif' }}
                    >
                      {product.name}
                    </Typography>

                    <div className="flex justify-center items-center gap-2 mb-1">
                      <span className="font-bold text-black text-lg">
                        ₹{product.price}
                      </span>
                      <span className="text-gray-400 line-through text-sm">
                        ₹{Math.round(product.price * 1.5)}
                      </span>
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
        )}
      </Container>
    </Box>
  );
};

export default LimitedEdition;
