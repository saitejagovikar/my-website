import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';
import { apiGet, apiPost } from '../../api/client';

export default function ProfileOrders({ user, showNotification }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [cancelModal, setCancelModal] = useState({ show: false, orderId: null });

    useEffect(() => {
        loadOrders();
    }, [user]);

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

    const handleCancelOrder = async (orderId) => {
        try {
            await apiPost(`/api/orders/${orderId}/cancel`, { email: user.email });
            setCancelModal({ show: false, orderId: null });
            await loadOrders();
            showNotification('Order cancelled successfully', 'success');
        } catch (error) {
            console.error('Cancel order error:', error);
            const errorMessage = error.message || 'Failed to cancel order';
            showNotification(errorMessage, 'error');
            setCancelModal({ show: false, orderId: null });
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-900 p-6 text-white">
                    <h2 className="text-xl font-medium tracking-wide" style={{ fontFamily: 'Marcellus SC, serif' }}>Your Orders</h2>
                    <p className="text-gray-400 text-sm font-light mt-1">Track and manage your orders</p>
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
                            <div key={order._id} className="border border-gray-100 rounded-lg p-5 hover:border-gray-300 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 border-b border-gray-50 pb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-base font-medium text-gray-900 tracking-wide">Order #{order.orderNumber}</h3>
                                            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm ${order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                                                order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                                                    order.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                                                        order.status === 'pending' ? 'bg-orange-50 text-orange-700' :
                                                            order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                                'bg-gray-50 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-light">
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end">
                                        <p className="text-base font-medium text-gray-900">₹{order.pricing.total.toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-gray-500 font-light">{order.items.length} item(s)</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="w-12 h-16 bg-gray-50 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 truncate">{item.productName}</p>
                                                <p className="text-xs text-gray-500 font-light mt-0.5">
                                                    Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-900 font-light">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <p className="text-xs text-gray-500 text-center pt-2">
                                            +{order.items.length - 3} more item(s)
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-50 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <span>Payment:</span>
                                            <span className={`uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'text-green-600' :
                                                order.paymentStatus === 'pending' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {order.paymentStatus === 'paid' ? 'Paid' :
                                                    order.paymentStatus === 'pending' ? 'Pending' :
                                                        'Failed'}
                                            </span>
                                        </div>
                                        {order.trackingNumber && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Tracking: <span className="text-gray-900">{order.trackingNumber}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => navigate(`/orders?orderId=${order._id}`)}
                                            className="flex-1 sm:flex-none px-4 py-2 text-xs uppercase tracking-wider border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors"
                                        >
                                            View Details
                                        </button>
                                        {['pending', 'confirmed'].includes(order.status) && (
                                            <button
                                                onClick={() => setCancelModal({ show: true, orderId: order._id })}
                                                className="flex-1 sm:flex-none px-4 py-2 text-xs uppercase tracking-wider border border-red-100 text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {cancelModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-scale-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>
                                Cancel Order?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to cancel this order? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCancelModal({ show: false, orderId: null })}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={() => handleCancelOrder(cancelModal.orderId)}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
