import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import About from './pages/About.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Customize from './pages/Customize.jsx';
import { allProducts } from './data/products.js';

import LoginPage from './pages/Login.jsx';
import ProfilePage from './pages/Profile.jsx';
import Checkout from './pages/Checkout.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      // Create a clean product object with only necessary fields
      const cleanProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.size,
        quantity: product.quantity || 1,
        customizations: product.customizations ? { 
          ...product.customizations,
          // Ensure we're not storing any React components or functions
          design: product.customizations.design ? {
            ...product.customizations.design,
            // Only keep primitive values
            id: product.customizations.design.id,
            name: product.customizations.design.name,
            preview: product.customizations.design.preview || product.customizations.design.url,
            type: product.customizations.design.type
          } : null
        } : undefined
      };

      // Check if the same product with same size and customizations exists
      const existingIndex = prev.findIndex(item => {
        const sameId = item.id === cleanProduct.id;
        const sameSize = item.size === cleanProduct.size;
        const sameCustomizations = !item.customizations && !cleanProduct.customizations || 
          (item.customizations && cleanProduct.customizations && 
           JSON.stringify(item.customizations) === JSON.stringify(cleanProduct.customizations));
        
        return sameId && sameSize && sameCustomizations;
      });

      let updated = [...prev];
      
      if (existingIndex >= 0) {
        // If it exists, update the quantity
        const existing = updated[existingIndex];
        const newQuantity = (existing.quantity || 1) + (cleanProduct.quantity || 1);
        updated[existingIndex] = { ...existing, quantity: newQuantity };
      } else {
        // If it doesn't exist, add the product
        updated = [...updated, cleanProduct];
      }

      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId, size = null) => {
    setCart(prev => {
      const updated = prev.filter(item => {
        // If size is provided, match both id and size
        if (size !== null) {
          return !(item.id === productId && item.size === size);
        }
        // Otherwise just match by id
        return item.id !== productId;
      });
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    
    setCart(prev => {
      const updated = prev.map(item => {
        // Match by both id and size if size is provided, otherwise just by id
        const isMatch = size !== null 
          ? (item.id === productId && item.size === size)
          : (item.id === productId);
          
        return isMatch ? { ...item, quantity } : item;
      });
      
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // User functions
  const handleLogin = (userData) => {
    const userWithId = { ...userData, id: Date.now().toString() };
    localStorage.setItem('user', JSON.stringify(userWithId));
    setUser(userWithId);
  };
  
  const handleCheckout = () => {
    if (!user) {
      alert("Please login to proceed with checkout");
      navigate("/login", { state: { from: '/checkout' } });
      return;
    }
    navigate("/checkout");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  // Layout component to wrap pages with Navbar and Footer
  const Layout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} cartCount={cartItemCount} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={
          <Layout>
            <Home addToCart={addToCart} user={user} />
          </Layout>
        } />
        
        <Route path="/explore" element={
          <Layout>
            <Explore products={allProducts} onAddToCart={addToCart} user={user} />
          </Layout>
        } />

        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />

        <Route path="/profile" element={
          <Layout>
            <ProfilePage user={user} onLogout={handleLogout} />
          </Layout>
        } />

        <Route path="/product/:id" element={
          <Layout>
            <ProductDetailWrapper products={allProducts} onAddToCart={addToCart} user={user} />
          </Layout>
        } />

        <Route path="/customize/:id" element={
          <Layout>
            <CustomizeWrapper products={allProducts} onAddToCart={addToCart} user={user} />
          </Layout>
        } />

        {/* Pages without layout */}
        <Route path="/login" element={
          <LoginPage 
            onLogin={handleLogin} 
            onBack={() => window.history.back()}
            user={user}
          />
        } />

        <Route path="/cart" element={
          <Cart 
            cart={cart} 
            updateCartQuantity={updateCartQuantity} 
            removeFromCart={removeFromCart} 
            user={user} 
            onCheckout={handleCheckout}
          />
        } />

        <Route path="/checkout" element={
          <Checkout cart={cart} user={user} />
        } />

        <Route path="/orders" element={
          <Layout>
            <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
              <p>No orders found.</p>
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

// Product Detail Route Wrapper
function ProductDetailWrapper({ products, onAddToCart, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Product not found.</p>
          <button 
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetail 
      product={product} 
      onBack={() => navigate(-1)} 
      onAddToCart={onAddToCart} 
      user={user} 
    />
  );
}

// Customize Route Wrapper
function CustomizeWrapper({ products, onAddToCart, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Product not found.</p>
          <button 
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Customize 
      product={product} 
      onBack={() => navigate(-1)} 
      onAddToCart={onAddToCart} 
      user={user} 
    />
  );
}
