import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost, apiGet, apiPut } from '../../api/client';
import DeliveryAddress from '../../components/checkout/DeliveryAddress';
import PaymentMethod from '../../components/checkout/PaymentMethod';
import OrderSummary from '../../components/checkout/OrderSummary';
import SuccessModal from '../../components/checkout/SuccessModal';
import BackConfirmModal from '../../components/checkout/BackConfirmModal';
import ErrorModal from '../../components/checkout/ErrorModal';
import { handleRazorpayPayment } from '../../components/checkout/RazorpayHandler';

function Checkout({ cart, user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('razorpay');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successOrderNumber, setSuccessOrderNumber] = useState('');

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
      // Fixed: Remove email query param, use JWT
      const addresses = await apiGet('/api/user/addresses');
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

  // Warn user before leaving checkout page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!showSuccessModal) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showSuccessModal]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(addr => addr._id === addressId);
    if (address) {
      populateFormFromAddress(address);
      setUseSavedAddress(true);
    }
  };

  const handleUseDifferentAddress = () => {
    setUseSavedAddress(false);
    setSelectedAddressId(null);
    setFormData({
      ...formData,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
  };

  // Calculate pricing
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = 0;
  const codCharge = activeTab === 'cod' ? 20 : 0;
  const discount = 0;
  const total = subtotal + shipping + tax + codCharge;
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const pricing = {
    subtotal,
    shipping,
    tax,
    discount,
    codCharge,
    total,
    totalItems
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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
    if (e) e.preventDefault();

    if (!user?.email) {
      setErrorMessage('Please login to place an order');
      setShowErrorModal(true);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty');
      setShowErrorModal(true);
      return;
    }

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
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

      // If Razorpay is selected, use Razorpay handler
      if (activeTab === 'razorpay') {
        handleRazorpayPayment({
          items,
          shippingAddress,
          pricing,
          formData,
          useSavedAddress,
          savedAddresses,
          user,
          onSuccess: (order) => {
            setIsSubmitting(false);
            setSuccessOrderNumber(order.orderNumber);
            setShowSuccessModal(true);
            setTimeout(() => {
              navigate(`/orders?orderId=${order._id}&success=true`);
            }, 2000);
          },
          onError: (error) => {
            setErrorMessage(error.message || 'Payment failed. Please try again.');
            setShowErrorModal(true);
            setIsSubmitting(false);
          }
        });
      } else {
        // Cash on Delivery
        const paymentMethod = {
          method: 'cod',
          transactionId: null,
          paymentId: null,
          cardLast4: null,
        };

        const orderData = {
          items,
          shippingAddress,
          paymentMethod,
          pricing: {
            subtotal,
            shipping,
            tax,
            discount,
            total: total - discount,
          },
          status: 'confirmed',
          paymentStatus: 'pending',
        };

        const order = await apiPost('/api/orders', orderData);

        // Save address if requested
        if (formData.saveAddress && !useSavedAddress) {
          try {
            await apiPost('/api/user/addresses', {
              ...shippingAddress,
              isDefault: savedAddresses.length === 0,
            });
          } catch (error) {
            console.error('Failed to save address:', error);
          }
        }

        // Clear cart
        localStorage.removeItem('cart');
        try {
          await apiPut('/api/user/cart', { cart: [] });
        } catch (error) {
          console.error('Failed to clear backend cart:', error);
        }

        // Show success
        setIsSubmitting(false);
        setSuccessOrderNumber(order.orderNumber);
        setShowSuccessModal(true);

        setTimeout(() => {
          navigate(`/orders?orderId=${order._id}&success=true`);
        }, 2000);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setErrorMessage('Failed to place order: ' + (error.message || 'Please try again'));
      setShowErrorModal(true);
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    setShowBackModal(true);
  };

  const confirmBack = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors z-10"
          >
            <svg
              className="w-5 h-5 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium text-sm md:text-base hidden md:inline">Back to Cart</span>
          </button>

          <h1
            className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-bold text-black md:static md:transform-none"
            style={{ fontFamily: "Marcellus SC, serif" }}
          >
            Checkout
          </h1>

          {/* Spacer to balance the flex layout on desktop/mobile when absolute centering is used/unused */}
          <div className="w-5 md:w-auto h-5 z-10 opacity-0"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Order Summary - Shown last on mobile (order-2), second on desktop (order-2) */}
          <div className="order-2 lg:order-2 lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <OrderSummary cart={cart} pricing={pricing} />
            </div>
          </div>

          {/* Forms - Shown first on mobile (order-1), first on desktop (order-1) */}
          <div className="order-1 lg:order-1 lg:col-span-2 space-y-6">
            <DeliveryAddress
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              useSavedAddress={useSavedAddress}
              formData={formData}
              formErrors={formErrors}
              user={user}
              onAddressSelect={handleAddressSelect}
              onUseDifferentAddress={handleUseDifferentAddress}
              onInputChange={handleInputChange}
            />

            <PaymentMethod
              activeTab={activeTab}
              total={total}
              isSubmitting={isSubmitting}
              formErrors={formErrors}
              onTabChange={setActiveTab}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SuccessModal show={showSuccessModal} orderNumber={successOrderNumber} />
      <BackConfirmModal
        show={showBackModal}
        onConfirm={confirmBack}
        onCancel={() => setShowBackModal(false)}
      />
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
}

export default Checkout;
