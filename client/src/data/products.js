const products = [
  {
    id: 1,
    name: 'Classic T-Shirt',
    price: 19.99,
    category: 'clothing',
    image: '/images/black.png',
    rating: 4.3,
    reviews: 95,
    customizable: false
  },
  {
    id: 2,
    name: 'Basic Mug',
    price: 9.99,
    category: 'accessories',
    image: '/images/black.png',
    rating: 4.0,
    reviews: 67,
    customizable: false
  },
  {
    id: 3,
    name: 'Standard Notebook',
    price: 7.99,
    category: 'stationery',
    image: '/images/black.png',
    rating: 3.8,
    reviews: 34,
    customizable: false
  }
];

const customizableProducts = [
  {
    id: 4,
    name: 'Custom T-Shirt',
    price: 24.99,
    category: 'clothing',
    image: '/images/black.png',
    rating: 4.5,
    reviews: 128,
    customizable: true,
    colors: ['red', 'blue', 'black', 'white'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 5,
    name: 'Personalized Mug',
    price: 12.99,
    category: 'accessories',
    image: '/images/black.png',
    rating: 4.2,
    reviews: 89,
    customizable: true,
    colors: ['white', 'black'],
    sizes: ['Standard']
  },
  {
    id: 6,
    name: 'Custom Phone Case',
    price: 19.99,
    category: 'accessories',
    image: '/images/black.png',
    rating: 4.7,
    reviews: 156,
    customizable: true,
    colors: ['clear', 'black', 'blue', 'red'],
    sizes: ['iPhone 13', 'iPhone 14', 'Samsung S22', 'Google Pixel 6']
  },
  {
    id: 7,
    name: 'Custom Notebook',
    price: 9.99,
    category: 'stationery',
    image: '/images/black.png',
    rating: 4.0,
    reviews: 42,
    customizable: true,
    colors: ['blue', 'red', 'green', 'yellow'],
    sizes: ['A5', 'A4']
  },
  {
    id: 8,
    name: 'Custom Tote Bag',
    price: 14.99,
    category: 'accessories',
    image: '/images/black.png',
    rating: 4.3,
    reviews: 76,
    customizable: true,
    colors: ['beige', 'black', 'navy', 'olive'],
    sizes: ['Standard']
  },
  {
    id: 9,
    name: 'Personalized Keychain',
    price: 7.99,
    category: 'accessories',
    image: '/images/black.png',
    rating: 4.1,
    reviews: 63,
    customizable: true,
    colors: ['silver', 'gold', 'rose gold'],
    sizes: ['Standard']
  }
];

// Combine both products and customizableProducts into allProducts
const allProducts = [...products, ...customizableProducts];

export { products, customizableProducts, allProducts };