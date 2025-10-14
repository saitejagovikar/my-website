import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiChevronDown, FiLogOut, FiUser as FiProfile, FiShoppingBag, FiHome, FiMapPin, FiCreditCard } from 'react-icons/fi';

function Navbar({ cartCount = 0, user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Close dropdown when clicking outside
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
      navigate('/profile');
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

  return (
    <div className="w-full">
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-black text-white px-4 transition-all duration-300 ${isScrolled ? 'py-1 shadow-md' : 'py-1'}`}>
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
          <button 
            onClick={handleLogoClick} 
            className="text-2xl font-bold flex items-center" 
            style={{ fontFamily: '"Marcellus SC", serif', color: 'white' }}
          >
            PrakriTee
          </button>

          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="relative" ref={profileRef}>
              <div className="flex items-center">
                {user && (
                  <span className="text-xs sm:text-sm text-gray-300 mr-2 sm:mr-3 whitespace-nowrap">
                    Welcome, {user.name || 'User'}
                  </span>
                )}
                <button 
                  onClick={handleProfileClick}
                  className="p-2 hover:text-gray-300 transition-colors duration-200 flex items-center relative"
                  aria-label={user ? 'Profile Menu' : 'Login'}
                >
                  <FiUser className="h-5 w-5" />
                  <span className="hidden sm:inline ml-1">{user ? 'Profile' : 'Login'}</span>
                </button>
              </div>
              
              {user && isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-900 font-medium">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleMenuItemClick(item.path)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={handleCart} 
                className="p-2 hover:text-gray-300 transition-colors duration-200 relative"
                aria-label="Cart"
              >
                <FiShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Math.min(cartCount, 9)}{cartCount > 9 ? '+' : ''}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className={`w-full ${isScrolled ? 'h-14' : 'h-16'}`}></div>
    </div>
  );
}

export default Navbar;
