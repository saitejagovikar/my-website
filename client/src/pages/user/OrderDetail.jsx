import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { apiGet } from '../../api/client';

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
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-800 text-sm font-medium">Order placed successfully!</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm tracking-wide"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO ORDERS
          </button>
        </div>

        <div className="border border-gray-100 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-xl font-medium tracking-wide mb-1" style={{ fontFamily: 'Marcellus SC, serif' }}>
                  Order #{order.orderNumber}
                </h1>
                <p className="text-gray-400 text-xs font-light tracking-wide">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-sm self-start ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-b border-gray-100">
            {/* Shipping Address */}
            <div className="p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Shipping To
              </h2>
              <div className="text-sm text-gray-900 font-light space-y-1">
                <p className="font-medium text-black">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2 text-gray-500">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Payment Info
              </h2>
              <div className="space-y-3 text-sm font-light">
                <div>
                  <span className="block text-gray-500 text-xs mb-0.5">Method</span>
                  <span className="capitalize text-gray-900">{order.paymentMethod.method}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs mb-0.5">Status</span>
                  <span className={`uppercase text-xs tracking-wider ${order.paymentStatus === 'paid' ? 'text-green-600' :
                    order.paymentStatus === 'pending' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentMethod.transactionId && (
                  <div>
                    <span className="block text-gray-500 text-xs mb-0.5">Transaction ID</span>
                    <span className="font-mono text-xs text-gray-600">{order.paymentMethod.transactionId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 bg-gray-50/50">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Summary
              </h2>
              <div className="space-y-2 text-sm font-light">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.pricing.shipping === 0 ? 'Free' : `₹${order.pricing.shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST</span>
                  <span>₹{order.pricing.tax.toLocaleString('en-IN')}</span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium text-gray-900 pt-3 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>₹{order.pricing.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 md:p-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Items ({order.items.length})
            </h2>
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 md:gap-6">
                  <div className="w-16 h-20 md:w-20 md:h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 truncate pr-4">{item.productName}</h3>
                        <p className="text-xs text-gray-500 font-light mt-1">
                          QTY: {item.quantity} {item.size && <span className="mx-2">|</span>} {item.size && `SIZE: ${item.size}`}
                        </p>
                        {item.customizations && (
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-2">Customized</p>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Tracking Number</p>
                  <p className="text-sm font-mono text-gray-900 mt-0.5">{order.trackingNumber}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

