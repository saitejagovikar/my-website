// Navbar.jsx (clean version)
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiLogOut, FiHome, FiShoppingBag, FiMapPin, FiCreditCard } from 'react-icons/fi';

function Navbar({ cartCount = 0, user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      // Change background after 50px of scroll
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
    } else {
      setIsProfileOpen(!isProfileOpen);
    }
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleCart = () => navigate('/cart');
  const handleLogoClick = () => navigate('/');

  const menuItems = [
    { icon: <FiHome className="mr-3" />, label: 'Dashboard', path: '/profile' },
    { icon: <FiShoppingBag className="mr-3" />, label: 'Orders', path: '/profile?tab=orders' },
    { icon: <FiMapPin className="mr-3" />, label: 'Addresses', path: '/profile?tab=address' },
    { icon: <FiCreditCard className="mr-3" />, label: 'Payment Methods', path: '/profile?tab=cards' },
  ];

  // Check if we're on a product page or other non-home page
  const isProductPage = location.pathname.startsWith('/product') || 
                        location.pathname.startsWith('/customize') || 
                        location.pathname.startsWith('/luxe') || 
                        location.pathname.startsWith('/explore') ||
                        location.pathname.startsWith('/about') ||
                        location.pathname.startsWith('/profile');
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isProductPage
          ? 'bg-black/90 py-4 shadow-lg backdrop-blur-sm text-white' 
          : 'bg-transparent py-6 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 transition-all duration-300">
        <div className="flex flex-col items-center">
          <button 
            onClick={handleLogoClick} 
            className="text-3xl font-bold text-white leading-none transition-all duration-300 transform hover:scale-105 hover:text-red-600" 
            style={{ fontFamily: '"Nosifer", sans-serif', fontWeight: 400 }}
          >
            SLAY
          </button>
          <span 
            className="text-xs text-gray-300 -mt-0.5 tracking-wider"
            style={{ fontFamily: '"Zalando Sans Expanded", sans-serif', fontWeight: 300, fontStyle: 'normal', display: 'block', letterSpacing: '0.15em' }}
          >
            A FASHION TEE BRAND
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative" ref={profileRef}>
            <button 
              onClick={handleProfileClick}
              className="p-3 text-white flex items-center text-lg"
            >
              <FiUser className="h-6 w-6" />
              <span className="hidden sm:inline ml-2">{user ? 'Profile' : 'Login'}</span>
            </button>

            {user && isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleMenuItemClick(item.path)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center border-t border-gray-100"
                >
                  <FiLogOut className="mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={handleCart} 
            className="p-3 text-white relative text-lg"
          >
            <FiShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
