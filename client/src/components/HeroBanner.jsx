import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  const banners = [
    '/images/banner1.png',
    '/images/banner2.JPG'
  ];
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <Box 
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Banner Container with smooth scroll animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${banners.length * 100}%`,
          height: '100%',
          display: 'flex',
          transition: 'transform 1s ease-in-out',
          transform: `translateX(-${currentBannerIndex * (100 / banners.length)}%)`,
          zIndex: 0,
        }}
      >
        {banners.map((banner, index) => (
          <Box
            key={index}
            sx={{
              width: `${100 / banners.length}%`,
              height: '100%',
              backgroundImage: `url(${banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              flexShrink: 0,
            }}
          />
        ))}
      </Box>
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 3,
            textTransform: 'uppercase',
            letterSpacing: 2
          }}
        >
          Welcome to Our Store
        </Typography>
        <Typography 
          variant="h5" 
          component="p" 
          gutterBottom
          sx={{
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Discover amazing products at unbeatable prices. Shop now and experience the difference.
        </Typography>
        <Button 
          component={Link} 
          to="/products" 
          variant="contained" 
          color="primary"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          Shop Now
        </Button>
      </Container>
    </Box>
  );
};

export default HeroBanner;