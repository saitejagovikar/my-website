// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBoxOpen, FaMapMarkerAlt, FaCreditCard, FaSignOutAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/client';

export default function Profile({ user: propUser, onLogout }) {
  const user = propUser || {};
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "orders");
  const [isLoading, setIsLoading] = useState(true);
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'home',
    isDefault: false,
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false,
  });

  const menuItems = [
    { key: "orders", icon: <FaBoxOpen />, label: "My Orders" },
    { key: "address", icon: <FaMapMarkerAlt />, label: "Saved Addresses" },
    { key: "cards", icon: <FaCreditCard />, label: "Payment Methods" },
    { key: "shop", icon: <FaShoppingCart />, label: "Continue Shopping" },
    { key: "logout", icon: <FaSignOutAlt />, label: "Logout" },
  ];

  useEffect(() => {
    if (!user || !user.email) {
      navigate('/login');
    } else {
      setIsLoading(false);
      if (activeTab === 'orders') {
        loadOrders();
      } else if (activeTab === 'address') {
        loadAddresses();
      } else if (activeTab === 'cards') {
        loadPaymentMethods();
      }
    }
  }, [user, navigate, activeTab]);

  const loadOrders = async () => {
    if (!user.email) return;
    setLoadingOrders(true);
    try {
      const data = await apiGet(`/api/orders?email=${encodeURIComponent(user.email)}`);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadAddresses = async () => {
    if (!user.email) return;
    try {
      const data = await apiGet(`/api/user/addresses?email=${encodeURIComponent(user.email)}`);
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setAddresses([]);
    }
  };

  const loadPaymentMethods = async () => {
    if (!user.email) return;
    try {
      const data = await apiGet(`/api/user/payment-methods?email=${encodeURIComponent(user.email)}`);
      setPaymentMethods(data);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      setPaymentMethods([]);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!user.email) return;

    try {
      if (editingAddress) {
        await apiPut(`/api/user/addresses/${editingAddress._id}`, {
          ...addressForm,
          email: user.email,
        });
      } else {
        await apiPost('/api/user/addresses', {
          ...addressForm,
          email: user.email,
        });
      }
      await loadAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        addressType: 'home',
        isDefault: false,
      });
    } catch (error) {
      alert('Failed to save address: ' + error.message);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!user.email) return;

    try {
      if (editingPayment) {
        await apiPut(`/api/user/payment-methods/${editingPayment._id}`, {
          ...paymentForm,
          email: user.email,
        });
      } else {
        await apiPost('/api/user/payment-methods', {
          ...paymentForm,
          email: user.email,
        });
      }
      await loadPaymentMethods();
      setShowPaymentForm(false);
      setEditingPayment(null);
      setPaymentForm({
        cardNumber: '',
        cardHolderName: '',
        expiryMonth: '',
        expiryYear: '',
        isDefault: false,
      });
    } catch (error) {
      alert('Failed to save payment method: ' + error.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    if (!user.email) return;

    try {
      await apiDelete(`/api/user/addresses/${id}?email=${encodeURIComponent(user.email)}`);
      await loadAddresses();
    } catch (error) {
      alert('Failed to delete address: ' + error.message);
    }
  };

  const handleDeletePayment = async (id) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    if (!user.email) return;

    try {
      await apiDelete(`/api/user/payment-methods/${id}?email=${encodeURIComponent(user.email)}`);
      await loadPaymentMethods();
    } catch (error) {
      alert('Failed to delete payment method: ' + error.message);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || 'India',
      addressType: address.addressType || 'home',
      isDefault: address.isDefault || false,
    });
    setShowAddressForm(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setPaymentForm({
      cardNumber: '', // Don't show full card number for security
      cardHolderName: payment.cardHolderName,
      expiryMonth: payment.expiryMonth,
      expiryYear: payment.expiryYear,
      isDefault: payment.isDefault || false,
    });
    setShowPaymentForm(true);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
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
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Marcellus SC, serif' }}>Your Orders</h2>
              <p className="text-gray-300">Track and manage your orders</p>
            </div>
            
            {loadingOrders ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                  <FaBoxOpen className="text-gray-800 text-4xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">Your order history will appear here</p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">₹{order.pricing.total.toLocaleString('en-IN')}</p>
                        <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="space-y-2 mb-4">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-600 text-center">
                            +{order.items.length - 3} more item(s)
                          </p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Payment: 
                            <span className={`ml-1 font-medium ${
                              order.paymentStatus === 'paid' ? 'text-green-600' :
                              order.paymentStatus === 'pending' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {order.paymentStatus === 'paid' ? 'Paid' :
                               order.paymentStatus === 'pending' ? 'Pending' :
                               'Failed'}
                            </span>
                          </p>
                          {order.trackingNumber && (
                            <p className="text-sm text-gray-600 mt-1">
                              Tracking: <span className="font-medium">{order.trackingNumber}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/orders?orderId=${order._id}`)}
                            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                          {['pending', 'confirmed'].includes(order.status) && (
                            <button
                              onClick={async () => {
                                if (!confirm('Are you sure you want to cancel this order?')) return;
                                try {
                                  await apiPost(`/api/orders/${order._id}/cancel`, { email: user.email });
                                  await loadOrders();
                                  alert('Order cancelled successfully');
                                } catch (error) {
                                  alert('Failed to cancel order: ' + error.message);
                                }
                              }}
                              className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'address':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Marcellus SC, serif' }}>Saved Addresses</h2>
              <p className="text-gray-300">Manage your delivery addresses</p>
              </div>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setAddressForm({
                    name: '',
                    phone: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India',
                    addressType: 'home',
                    isDefault: false,
                  });
                  setShowAddressForm(true);
                }}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <FaPlus /> Add New
              </button>
            </div>
            
            {showAddressForm && (
              <div className="p-6 border-b">
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                      <select
                        value={addressForm.addressType}
                        onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Set as default address</span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="p-6">
              {addresses.length === 0 ? (
                <div className="text-center py-12">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                <FaMapMarkerAlt className="text-gray-800 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved addresses</h3>
              <p className="text-gray-600 mb-6">Add your first delivery address</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address._id} className={`border rounded-lg p-4 ${address.isDefault ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {address.isDefault && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-900 text-white rounded mb-2">Default</span>
                          )}
                          <p className="font-semibold text-gray-900">{address.name}</p>
                          <p className="text-gray-600">{address.phone}</p>
                          <p className="text-gray-700 mt-2">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-gray-700">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">{address.country}</p>
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize">
                            {address.addressType}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          >
                            <FaEdit />
                          </button>
              <button 
                            onClick={() => handleDeleteAddress(address._id)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
              >
                            <FaTrash />
              </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'cards':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Marcellus SC, serif' }}>Payment Methods</h2>
              <p className="text-gray-300">Manage your payment options</p>
              </div>
              <button
                onClick={() => {
                  setEditingPayment(null);
                  setPaymentForm({
                    cardNumber: '',
                    cardHolderName: '',
                    expiryMonth: '',
                    expiryYear: '',
                    isDefault: false,
                  });
                  setShowPaymentForm(true);
                }}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <FaPlus /> Add New
              </button>
            </div>
            
            {showPaymentForm && (
              <div className="p-6 border-b">
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                        setPaymentForm({ ...paymentForm, cardNumber: formatted });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name *</label>
                    <input
                      type="text"
                      required
                      value={paymentForm.cardHolderName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardHolderName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Month *</label>
                      <select
                        required
                        value={paymentForm.expiryMonth}
                        onChange={(e) => setPaymentForm({ ...paymentForm, expiryMonth: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = String(i + 1).padStart(2, '0');
                          return <option key={month} value={month}>{month}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Year *</label>
                      <select
                        required
                        value={paymentForm.expiryYear}
                        onChange={(e) => setPaymentForm({ ...paymentForm, expiryYear: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 20 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return <option key={year} value={String(year)}>{year}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={paymentForm.isDefault}
                      onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Set as default payment method</span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {editingPayment ? 'Update Card' : 'Save Card'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setEditingPayment(null);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="p-6">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-12">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                <FaCreditCard className="text-gray-800 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No payment methods</h3>
              <p className="text-gray-600 mb-6">Add your first payment method</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((payment) => (
                    <div key={payment._id} className={`border rounded-lg p-4 ${payment.isDefault ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {payment.isDefault && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-900 text-white rounded mb-2">Default</span>
                          )}
                          <p className="font-semibold text-gray-900">{payment.cardHolderName}</p>
                          <p className="text-gray-600 mt-2">
                            <span className="text-2xl">••••</span> <span className="ml-2">{payment.cardNumber}</span>
                          </p>
                          <p className="text-gray-700 mt-2">
                            Expires: {payment.expiryMonth}/{payment.expiryYear}
                          </p>
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize">
                            {payment.cardType}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPayment(payment)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          >
                            <FaEdit />
                          </button>
              <button 
                            onClick={() => handleDeletePayment(payment._id)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
              >
                            <FaTrash />
              </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'shop':
        navigate('/');
        return null;
      case 'logout':
        handleLogout();
        return null;
      default:
        return (
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Marcellus SC, serif' }}>
              {menuItems.find(item => item.key === activeTab)?.label || 'Page'}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-28">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4 border-4 border-white shadow-md">
                  <FaUser className="text-gray-700 text-4xl" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Marcellus SC, serif' }}>
                  {user.name || 'User'}
                </h2>
                <p className="text-sm text-gray-500">{user.email || 'user@example.com'}</p>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (item.key === 'logout') {
                        handleLogout();
                      } else if (item.key === 'shop') {
                        navigate('/');
                      } else {
                        setActiveTab(item.key);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                      activeTab === item.key 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`text-lg ${
                      activeTab === item.key ? 'text-white' : 'text-gray-500'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
              {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
