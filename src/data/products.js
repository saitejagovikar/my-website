// Centralized product data for reuse across components and routes

// Helper to resolve public image paths (Vite serves from /public at root)
const getImageUrl = (path) => (path && path.startsWith('/') ? path : `/${path}`);

export const products = [
  { 
    id: 1, 
    name: "GOLDEN BLOOM TEE", 
    price: 699, 
    originalPrice: 999, 
    image: getImageUrl('/images/black.png'), 
    category: "everyday", 
    description: "Premium cotton with golden accents",
    isBestseller: true
  },
  { 
    id: 2, 
    name: "STREETWEAR CLASSIC", 
    price: 599, 
    originalPrice: 799, 
    image: getImageUrl('/images/blue.png'), 
    category: "everyday", 
    description: "Comfortable everyday wear",
    onSale: true
  },
  { 
    id: 3, 
    name: "MINIMALIST PURE", 
    price: 499, 
    originalPrice: 699, 
    image: getImageUrl('/images/grey.png'), 
    category: "everyday", 
    description: "Clean and simple design",
    onSale: true
  },
  { 
    id: 4, 
    name: "GRAPHIC VIBES", 
    price: 799, 
    originalPrice: 1099, 
    image: getImageUrl('/images/white.png'), 
    category: "everyday", 
    description: "Bold graphic prints",
    onSale: true
  },
  { 
    id: 5, 
    name: "OVERSIZED COMFORT", 
    price: 649, 
    originalPrice: 899, 
    image: getImageUrl('/images/black.png'), 
    category: "everyday", 
    description: "Relaxed fit for ultimate comfort",
    onSale: true
  },
  { 
    id: 6, 
    name: "SPORT READY", 
    price: 549, 
    originalPrice: 749, 
    image: getImageUrl('/images/bargandi.png'), 
    category: "everyday", 
    description: "Perfect for active lifestyle",
    onSale: true
  },
];

export const customizableProducts = [
  { id: 101, name: "BLACK TEE", price: 799, originalPrice: 999, image: getImageUrl('/images/black.png'), category: "customizable", description: "Create unique designs with AI assistance", customizable: true },
  { id: 102, name: "BLUE TEE", price: 699, originalPrice: 899, image: getImageUrl('/images/blue.png'), category: "customizable", description: "Upload your own images and designs", customizable: true },
  { id: 103, name: "GREY TEE", price: 899, originalPrice: 1199, image: getImageUrl('/images/grey.png'), category: "customizable", description: "Full creative control with templates", customizable: true },
  { id: 104, name: "WHITE TEE", price: 999, originalPrice: 1299, image: getImageUrl('/images/white.png'), category: "customizable", description: "Premium AI-powered artistic designs", customizable: true },
  { id: 105, name: "CLASSIC TEE", price: 749, originalPrice: 949, image: getImageUrl('/images/black.png'), category: "customizable", description: "Custom typography and quotes", customizable: true },
  { id: 106, name: "BARGANDI TEE", price: 849, originalPrice: 1099, image: getImageUrl('/images/bargandi.png'), category: "customizable", description: "Unique pattern and graphic designs", customizable: true },
];

export const allProducts = [...products, ...customizableProducts];


