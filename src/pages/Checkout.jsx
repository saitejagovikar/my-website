import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost, apiGet } from '../api/client';

// Payment method icons
const PaymentIcons = {
  razorpay: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#2D8FF0"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#2D8FF0"/>
      <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#2D8FF0"/>
    </svg>
  ),
  cod: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="#4CAF50"/>
    </svg>
  )
};

function Checkout({ cart, user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('razorpay');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: false
  });

  // Load saved addresses if user is logged in
  useEffect(() => {
    if (user?.email) {
      loadSavedAddresses();
    }
  }, [user]);

  const loadSavedAddresses = async () => {
    if (!user?.email) return;
    try {
      const addresses = await apiGet(`/api/user/addresses?email=${encodeURIComponent(user.email)}`);
      setSavedAddresses(addresses);
      // Auto-select default address if available
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setUseSavedAddress(true);
        populateFormFromAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const populateFormFromAddress = (address) => {
    setFormData({
      name: address.name || address.fullName || '',
      email: user?.email || '',
      phone: address.phone || '',
      address: address.addressLine1 || address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || address.zip || '',
      saveAddress: false
    });
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(addr => addr._id === addressId);
    if (address) {
      populateFormFromAddress(address);
      setUseSavedAddress(true);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.email) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to the first error
      const firstError = Object.keys(errors)[0];
      document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order items
      const items = cart.map(item => ({
        productId: item.id || item._id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        size: item.size,
        image: item.image,
        customizations: item.customizations || undefined,
      }));

      // Use already calculated pricing from component level
      const discount = 0; // Can be added later for coupons

      // Prepare shipping address
      const shippingAddress = {
        name: formData.name,
        phone: formData.phone,
        addressLine1: formData.address,
        addressLine2: '',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: 'India',
      };

      // Prepare payment method info
      const paymentMethod = {
        method: activeTab === 'razorpay' ? 'razorpay' : 'cod',
        transactionId: null,
        paymentId: null,
        cardLast4: null,
      };

      // Create order
      const orderData = {
        email: user.email,
        items,
        shippingAddress,
        paymentMethod,
        pricing: {
          subtotal,
          shipping,
          tax,
          discount,
          total: total - discount, // Apply discount if any (currently 0)
        },
        status: activeTab === 'cod' ? 'confirmed' : 'pending',
        paymentStatus: activeTab === 'cod' ? 'pending' : 'pending',
      };

      const order = await apiPost('/api/orders', orderData);

      // Save address if requested
      if (formData.saveAddress && !useSavedAddress) {
        try {
          await apiPost('/api/user/addresses', {
            email: user.email,
            ...shippingAddress,
            isDefault: savedAddresses.length === 0, // Set as default if first address
          });
        } catch (error) {
          console.error('Failed to save address:', error);
          // Don't fail the order if address save fails
        }
      }

      // Clear cart from localStorage
      localStorage.removeItem('cart');

      // Redirect to order confirmation
      navigate(`/orders?orderId=${order._id}&success=true`);
      
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to place order: ' + (error.message || 'Please try again'));
      setIsSubmitting(false);
    }
  };

  const renderPaymentMethod = () => {
    return (
      <div className="space-y-4">
        <div 
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'razorpay' ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('razorpay')}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center mr-3">
              {PaymentIcons.razorpay}
            </div>
            <div className="flex-1">
              <div className="font-medium">Pay with Razorpay</div>
              <p className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              activeTab === 'razorpay' ? 'border-black bg-black' : 'border-gray-300'
            }`}></div>
          </div>
        </div>

        <div 
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'cod' ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('cod')}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center mr-3">
              {PaymentIcons.cod}
            </div>
            <div className="flex-1">
              <div className="font-medium">Cash on Delivery</div>
              <p className="text-sm text-gray-600">Pay in cash when your order is delivered</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              activeTab === 'cod' ? 'border-black bg-black' : 'border-gray-300'
            }`}></div>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'razorpay' ? (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <p className="text-sm text-gray-600">You will be redirected to Razorpay's secure payment page to complete your purchase.</p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(formErrors).length > 0}
                className={`w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors ${
                  isSubmitting || Object.keys(formErrors).length > 0 ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <p className="text-sm text-gray-600">Pay in cash when your order is delivered.</p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render order summary with custom design preview
  const renderOrderSummary = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-medium mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start">
                <div className="relative w-20 h-24 mr-4 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                  {item.customizations && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      Custom
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.customizations?.text && (
                    <p className="text-sm text-gray-600">Custom Text: {item.customizations.text}</p>
                  )}
                  {item.customizations?.size && (
                    <p className="text-sm text-gray-600">Size: {item.customizations.size}</p>
                  )}
                  <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price * (item.quantity || 1)}</p>
                  </div>
                </div>
              </div>
              
              {/* Custom Design Preview */}
              {item.customizations && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h4 className="text-sm font-medium mb-2">Your Custom Design:</h4>
                  <div className="relative bg-gray-50 rounded-lg p-4">
                    <div className="relative mx-auto" style={{ maxWidth: '200px' }}>
                      {/* Base T-shirt image */}
                      <img
                        src={item.image}
                        alt="T-shirt base"
                        className="w-full h-auto"
                      />

                      {/* Custom Text */}
                      {item.customizations?.text && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
                          style={{
                            fontFamily: item.customizations.fontFamily || 'sans-serif',
                            color: item.customizations.textColor || '#000000',
                            fontSize: `${item.customizations.fontSize || 18}px`,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            transform: `translate(${item.customizations.textPosition?.x || 0}px, ${item.customizations.textPosition?.y || 0}px)`,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                            zIndex: 10
                          }}
                        >
                          {item.customizations.text}
                        </div>
                      )}

                      {/* Custom Image Upload */}
                      {item.customizations.design?.preview && item.customizations.designType === 'image' && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          style={{
                            transform: `translate(${item.customizations.imagePosition?.x || 0}px, ${item.customizations.imagePosition?.y || 0}px)`,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 5
                          }}
                        >
                          <img
                            src={item.customizations.design.preview}
                            alt="Custom design"
                            className="max-w-[80%] max-h-[80%] object-contain"
                            style={{
                              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
                            }}
                          />
                        </div>
                      )}

                      {/* Template Design */}
                      {item.customizations.design?.preview && item.customizations.designType === 'template' && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          style={{
                            transform: `translate(${item.customizations.imagePosition?.x || 0}px, ${item.customizations.imagePosition?.y || 0}px)`,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 5
                          }}
                        >
                          <img
                            src={item.customizations.design.preview}
                            alt="Template design"
                            className="max-w-[90%] max-h-[90%] object-contain"
                            style={{
                              filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="pt-4">
            <div className="flex justify-between py-2">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600" : ""}>
                {shipping === 0 ? 'Free' : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax (GST)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 font-medium text-lg mt-2 border-t pt-2">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Marcellus SC, serif' }}>
            Checkout
          </h1>
          <div className="w-20 h-1 bg-black mx-auto mt-2"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Delivery Information */}
          <div className="lg:flex-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">Delivery Information</h2>
              
              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Use Saved Address
                  </label>
                  <div className="space-y-2">
                    {savedAddresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === address._id
                            ? 'border-black bg-black/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleAddressSelect(address._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{address.name}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            <p className="text-sm text-gray-700">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-gray-700">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAddressId === address._id
                              ? 'border-black bg-black'
                              : 'border-gray-300'
                          }`}>
                            {selectedAddressId === address._id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUseSavedAddress(false);
                      setSelectedAddressId(null);
                    }}
                    className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Use different address
                  </button>
                </div>
              )}

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black`}
                      placeholder="your@email.com"
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black`}
                    placeholder="+91 9876543210"
                  />
                  {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black`}
                    placeholder="Your full address"
                  ></textarea>
                  {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black`}
                      placeholder="Mumbai"
                    />
                    {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black`}
                      placeholder="Maharashtra"
                    />
                    {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      id="pincode"
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black`}
                      placeholder="400001"
                    />
                    {formErrors.pincode && <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="saveAddress"
                    name="saveAddress"
                    type="checkbox"
                    checked={formData.saveAddress}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="saveAddress" className="ml-2 block text-sm text-gray-700">
                    Save this address for future use
                  </label>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">Payment Method</h2>
              {renderPaymentMethod()}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:w-96 space-y-6">
            {renderOrderSummary()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
