import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';

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
import OrderDetail from './pages/OrderDetail.jsx';
import AnnouncementBanner from './components/AnnouncementBanner';
import AdminPage from './pages/Admin.jsx';
import { apiGet } from './api/client';

function AppContent() {
  const navigate = useNavigate();
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
      alert("Please login to proceed to checkout");
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
  const Layout = ({ children, onViewProduct }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    
    // If onViewProduct is a function that returns a function (like handleViewProduct),
    // call it with navigate and use the result as the new onViewProduct
    const enhancedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          onViewProduct: typeof child.props.onViewProduct === 'function' ? 
            child.props.onViewProduct(navigate) : 
            child.props.onViewProduct
        });
      }
      return child;
    });
    
    return (
      <div className="min-h-screen flex flex-col">
        <div className="relative z-50">
          {/* Announcement banner only on home page */}
          {isHome && <AnnouncementBanner />}
          {/* Navbar - fixed to top */}
          <Navbar user={user} cartCount={cartItemCount} onLogout={handleLogout} />
        </div>

        {/* Main content - no top padding as navbar is positioned absolutely over content */}
        <div className="relative z-10">
          <main className="flex-grow">
            {enhancedChildren}
          </main>
          <Footer />
        </div>
      </div>
    );
  };

  // Handle view product
  const handleViewProduct = (product) => {
    if (!product) return;
    // Normalize product ID - handle both _id (from API) and id (from static data)
    const productId = product._id || product.id;
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={
          <Layout>
            <Home 
              addToCart={addToCart} 
              user={user} 
              onViewProduct={handleViewProduct}
            />
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

        <Route path="/orders/:orderId?" element={
          <Layout>
            <OrderDetail user={user} />
          </Layout>
        } />

        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Product Detail Route Wrapper
function ProductDetailWrapper({ products, onAddToCart, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProduct = async () => {
      // Include Limited Edition products
      const limitedEditionProducts = [
        {
          id: 'dragon-tee',
          name: 'Dragon Design Tee',
          image: '/images/dragon.png',
          alt: 'Dragon Limited Edition',
          description: 'Exclusive dragon design t-shirt, limited edition',
          price: 999,
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
          price: 899,
          sizes: ['S', 'M', 'L'],
          colors: ['Black', 'Gray'],
          details: 'Vibrant anime artwork on soft cotton blend. Limited stock available.',
          category: 'limited-edition',
          inStock: true,
          rating: 4.9,
          reviews: 98,
          material: 'Cotton Blend',
          care: 'Machine wash cold, tumble dry low'
        }
      ];

      // Combine regular products with limited edition products
      const allProducts = [...products, ...limitedEditionProducts];
      
      // First, try to find in static products (check both id and _id)
      let foundProduct = allProducts.find(p => {
        const productId = p._id || p.id;
        return productId == id; // Use loose equality to handle string/number mismatches
      });

      // If not found in static products, try fetching from API
      if (!foundProduct) {
        try {
          const apiProduct = await apiGet(`/api/products/${id}`);
          if (apiProduct) {
            // Normalize API product to have both id and _id for consistency
            foundProduct = {
              ...apiProduct,
              id: apiProduct._id || apiProduct.id,
              _id: apiProduct._id
            };
          }
        } catch (err) {
          console.error('Error fetching product from API:', err);
          if (isMounted) {
            setError('Product not found');
            setLoading(false);
          }
          return;
        }
      }

      if (isMounted) {
        setProduct(foundProduct);
        setLoading(false);
      }
    };

    fetchProduct();
    
    return () => { isMounted = false; };
  }, [id, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Product with ID {id} not found.</p>
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
    <div className="min-h-screen bg-gray-50">
      <ProductDetail 
        product={product} 
        onBack={() => navigate(-1)}
        onAddToCart={onAddToCart}
        user={user}
      />
    </div>
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
