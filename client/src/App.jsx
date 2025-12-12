import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';

import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home.jsx';
// Info pages
import About from './pages/info/About.jsx';
import Contact from './pages/info/Contact.jsx';
import Privacy from './pages/info/Privacy.jsx';
import Terms from './pages/info/Terms.jsx';
import Shipping from './pages/info/Shipping.jsx';
import Returns from './pages/info/Returns.jsx';
// Shop pages
import Explore from './pages/shop/Explore.jsx';
import Luxe from './pages/shop/Luxe.jsx';
import ProductDetail from './pages/shop/ProductDetail.jsx';
// Checkout pages
import Cart from './pages/checkout/Cart.jsx';
import Checkout from './pages/checkout/Checkout.jsx';
import Customize from './pages/Customize.jsx';
import { allProducts } from './data/products.js';
// Auth pages
import LoginPage from './pages/auth/Login.jsx';
// User pages
import ProfilePage from './pages/user/Profile.jsx';
import OrderDetail from './pages/user/OrderDetail.jsx';
import AnnouncementBanner from './components/banners/AnnouncementBanner';
// Admin pages
import AdminPage from './pages/admin/Admin.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';
import NotFound from './pages/NotFound.jsx';
import { apiGet, apiPut } from './api/client';
import LoadingSpinner from './components/common/LoadingSpinner';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Page transition loading effect
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 300); // Short delay for smooth transition

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Ref to track pending cart save operations
  const saveCartTimeoutRef = React.useRef(null);
  const isSavingCartRef = React.useRef(false);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Load cart from backend when user is logged in
  useEffect(() => {
    const loadCartFromBackend = async () => {
      if (user?.email) {
        try {
          // Use JWT token - no need to pass email in query
          const backendCart = await apiGet('/api/user/cart');
          const normalizedCart = backendCart.map(item => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size,
            quantity: item.quantity,
            customizations: item.customizations
          }));

          setCart(normalizedCart);
          localStorage.setItem('cart', JSON.stringify(normalizedCart));
        } catch (error) {
          console.error('Failed to load cart from backend:', error);
          // If 401, user will be auto-logged out by API client
        }
      }
    };

    loadCartFromBackend();
  }, [user?.email]);

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      // Handle both _id (from API) and id (from static data)
      const productId = product._id || product.id;

      // Create a clean product object with only necessary fields
      const cleanProduct = {
        id: productId,
        name: product.name,
        price: product.price,
        // Handle both images array and single image
        image: product.images?.[0] || product.image,
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

      // Save to backend if user is logged in (debounced)
      saveCartToBackend();

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

      // Save to backend if user is logged in (debounced)
      saveCartToBackend();

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

      // Save to backend if user is logged in (debounced)
      saveCartToBackend();

      return updated;
    });
  };

  // User functions
  const handleLogin = async (responseData) => {
    // Check if this is a different user
    const previousUser = user;
    const isDifferentUser = previousUser && previousUser.email &&
      responseData.user?.email !== previousUser.email;

    // If switching users, clear the cart first
    if (isDifferentUser) {
      localStorage.removeItem('cart');
      setCart([]);
    }

    // Handle new JWT response structure: { user, token }
    let userToStore;

    if (responseData.user && responseData.token) {
      // New JWT structure from backend
      userToStore = responseData.user;
      // Store token separately
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
    } else {
      // Fallback for old structure (shouldn't happen after fixes)
      userToStore = {
        ...responseData,
        id: responseData._id || Date.now().toString()
      };
      localStorage.setItem('user', JSON.stringify(userToStore));
    }

    setUser(userToStore);

    // Sync cart with backend if user has email
    if (userToStore.email) {
      await syncCartWithBackend(userToStore.email, isDifferentUser);
    }
  };

  // Sync local cart with backend cart
  const syncCartWithBackend = async (userEmail, isDifferentUser = false) => {
    try {
      // Use JWT token - no need to pass email in query
      const backendCart = await apiGet('/api/user/cart');

      // Normalize backend cart to frontend format
      const normalizedCart = backendCart.map(item => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
        customizations: item.customizations
      }));

      if (isDifferentUser) {
        // Different user - use only backend cart, don't merge
        setCart(normalizedCart);
        localStorage.setItem('cart', JSON.stringify(normalizedCart));
      } else {
        // Same user or first login - merge local cart with backend cart
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const mergedCart = [...normalizedCart];

        // Add local cart items that aren't in backend cart
        localCart.forEach(localItem => {
          const existsInBackend = mergedCart.some(backendItem =>
            backendItem.id === localItem.id &&
            backendItem.size === localItem.size
          );
          if (!existsInBackend) {
            mergedCart.push(localItem);
          }
        });

        // Update local cart state with merged cart
        setCart(mergedCart);
        localStorage.setItem('cart', JSON.stringify(mergedCart));

        // Save merged cart back to backend if we added local items
        if (mergedCart.length > normalizedCart.length) {
          await saveCartToBackendNow(mergedCart);
        }
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
      // Continue with local cart if sync fails
    }
  };

  // Save cart to backend immediately (for sync operations)
  const saveCartToBackendNow = async (cartToSave) => {
    if (!user?.email) return;

    try {
      const backendCart = cartToSave.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
        customizations: item.customizations
      }));

      // Use JWT token - no need to pass email in body
      await apiPut('/api/user/cart', { cart: backendCart });
    } catch (error) {
      console.error('Failed to save cart to backend:', error);
    }
  };

  // Save cart to backend when user is logged in (debounced to prevent race conditions)
  const saveCartToBackend = async () => {
    if (!user?.email) return;

    // Clear any pending save operations
    if (saveCartTimeoutRef.current) {
      clearTimeout(saveCartTimeoutRef.current);
    }

    // Debounce the save operation to prevent multiple simultaneous requests
    saveCartTimeoutRef.current = setTimeout(async () => {
      // Prevent concurrent saves
      if (isSavingCartRef.current) {
        return;
      }

      isSavingCartRef.current = true;

      try {
        const backendCart = cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          customizations: item.customizations
        }));

        // Use JWT token - no need to pass email in body
        await apiPut('/api/user/cart', { cart: backendCart });
      } catch (error) {
        console.error('Failed to save cart to backend:', error);
        // Don't throw error - cart is still saved locally
      } finally {
        isSavingCartRef.current = false;
      }
    }, 500); // 500ms debounce delay
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
    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);

    // Clear cart on logout
    localStorage.removeItem('cart');
    setCart([]);

    // Navigate to home
    navigate('/');
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

      {/* Page Transition Loader */}
      {isPageLoading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )}

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

        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />

        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />

        <Route path="/privacy" element={
          <Layout>
            <Privacy />
          </Layout>
        } />

        <Route path="/terms" element={
          <Layout>
            <Terms />
          </Layout>
        } />

        <Route path="/shipping" element={
          <Layout>
            <Shipping />
          </Layout>
        } />

        <Route path="/returns" element={
          <Layout>
            <Returns />
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
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        {/* 404 Not Found - Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
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
        <LoadingSpinner message="Loading product..." />
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
