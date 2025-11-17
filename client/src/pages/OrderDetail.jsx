import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { apiGet } from '../api/client';

export default function OrderDetail({ user }) {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const success = searchParams.get('success') === 'true';

  useEffect(() => {
    const loadOrder = async () => {
      if (!user?.email) {
        navigate('/login');
        return;
      }

      const id = orderId || searchParams.get('orderId');
      if (!id) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        const data = await apiGet(`/api/orders/${id}?email=${encodeURIComponent(user.email)}`);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, searchParams, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-800 font-medium">Order placed successfully!</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>
                  Order #{order.orderNumber}
                </h1>
                <p className="text-gray-300">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Quantity: {item.quantity}
                      {item.size && ` • Size: ${item.size}`}
                    </p>
                    {item.customizations && (
                      <p className="text-xs text-gray-500 mt-1">Customized item</p>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>
              Shipping Address
            </h2>
            <div className="text-gray-700">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-sm">{order.shippingAddress.phone}</p>
              <p className="text-sm mt-2">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
              </p>
              <p className="text-sm">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-sm">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>
              Payment Information
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">{order.paymentMethod.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-green-600' :
                  order.paymentStatus === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Paid' :
                   order.paymentStatus === 'pending' ? 'Pending' :
                   'Failed'}
                </span>
              </div>
              {order.paymentMethod.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">{order.paymentMethod.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span>{order.pricing.shipping === 0 ? 'Free' : `₹${order.pricing.shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (GST):</span>
                <span>₹{order.pricing.tax.toLocaleString('en-IN')}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>₹{order.pricing.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="p-6 border-t">
              <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>
                Tracking Information
              </h2>
              <p className="text-gray-700">
                Tracking Number: <span className="font-mono font-medium">{order.trackingNumber}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

