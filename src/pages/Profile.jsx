// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBoxOpen, FaMapMarkerAlt, FaCreditCard, FaSignOutAlt, FaHome } from 'react-icons/fa';

export default function Profile({ user: propUser, onLogout }) {
  // For debugging - log the user object
  console.log('Profile user prop:', propUser);
  
  // Use the user prop with a fallback to an empty object
  const user = propUser || {};
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [isLoading, setIsLoading] = useState(true);

  const menuItems = [
    { key: "orders", icon: <FaBoxOpen />, label: "My Orders" },
    { key: "address", icon: <FaMapMarkerAlt />, label: "Saved Addresses" },
    { key: "cards", icon: <FaCreditCard />, label: "Payment Methods" },
    { key: "shop", icon: <FaShoppingCart />, label: "Continue Shopping" },
    { key: "logout", icon: <FaSignOutAlt />, label: "Logout" },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-900 p-6 text-white">
              <h2 className="text-2xl font-bold">Your Orders</h2>
              <p className="text-gray-300">Track and manage your orders</p>
            </div>
            <div className="p-8 text-center">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                <FaBoxOpen className="text-gray-800 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Your order history will appear here</p>
              <button 
                onClick={() => setActiveTab('shop')}
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
              >
                Start Shopping
              </button>
            </div>
          </div>
        );
      case 'address':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-900 p-6 text-white">
              <h2 className="text-2xl font-bold">Saved Addresses</h2>
              <p className="text-gray-300">Manage your delivery addresses</p>
            </div>
            <div className="p-8 text-center">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                <FaMapMarkerAlt className="text-gray-800 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved addresses</h3>
              <p className="text-gray-600 mb-6">Add your first delivery address</p>
              <button 
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
              >
                Add New Address
              </button>
            </div>
          </div>
        );
      case 'cards':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-900 p-6 text-white">
              <h2 className="text-2xl font-bold">Payment Methods</h2>
              <p className="text-gray-300">Manage your payment options</p>
            </div>
            <div className="p-8 text-center">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                <FaCreditCard className="text-gray-800 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No payment methods</h3>
              <p className="text-gray-600 mb-6">Add your first payment method</p>
              <button 
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
              >
                Add Payment Method
              </button>
            </div>
          </div>
        );
      case 'logout':
        handleLogout();
        return null;
      default:
        return (
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{menuItems.find(item => item.key === activeTab)?.label || 'Page'}</h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <div className="text-center mb-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3 border-2 border-gray-200">
                  <FaUser className="text-gray-800 text-4xl" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{user.name || 'User'}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => item.key === 'logout' ? handleLogout() : setActiveTab(item.key)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === item.key 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-lg ${
                      activeTab === item.key ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
