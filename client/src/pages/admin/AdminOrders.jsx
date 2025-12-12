import React, { useState, useEffect } from 'react';
import { apiGet } from '../../api/client';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        cod: 0,
        paid: 0,
        confirmed: 0,
        pending: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await apiGet('/api/admin/orders');

            // API returns { orders, total, limit, skip }
            const ordersData = response.orders || [];
            setOrders(ordersData);

            // Calculate stats
            const stats = {
                total: ordersData.length,
                cod: ordersData.filter(o => o.paymentMethod?.method === 'cod').length,
                paid: ordersData.filter(o => o.paymentStatus === 'completed').length,
                confirmed: ordersData.filter(o => o.status === 'confirmed').length,
                pending: ordersData.filter(o => o.status === 'pending').length,
                totalRevenue: ordersData
                    .filter(o => o.status === 'confirmed' || o.paymentStatus === 'completed')
                    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0)
            };
            setStats(stats);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <button
                        onClick={() => window.location.href = '/admin'}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </button>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ fontFamily: 'Marcellus SC, serif' }}>
                    Orders Management
                </h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-lg md:rounded-xl shadow p-4 md:p-6">
                        <div className="text-xs md:text-sm text-gray-600 mb-1">Total Orders</div>
                        <div className="text-2xl md:text-3xl font-bold">{stats.total}</div>
                    </div>

                    <div className="bg-white rounded-lg md:rounded-xl shadow p-4 md:p-6">
                        <div className="text-xs md:text-sm text-gray-600 mb-1">COD Orders</div>
                        <div className="text-2xl md:text-3xl font-bold text-orange-600">{stats.cod}</div>
                    </div>

                    <div className="bg-white rounded-lg md:rounded-xl shadow p-4 md:p-6">
                        <div className="text-xs md:text-sm text-gray-600 mb-1">Paid Orders</div>
                        <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.paid}</div>
                    </div>

                    <div className="bg-white rounded-lg md:rounded-xl shadow p-4 md:p-6">
                        <div className="text-xs md:text-sm text-gray-600 mb-1">Confirmed</div>
                        <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.confirmed}</div>
                    </div>
                </div>

                {/* Orders Summary */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Orders Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Pending Orders</div>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Confirmed Orders</div>
                            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Total Revenue</div>
                            <div className="text-2xl font-bold text-blue-600">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold">All Orders</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">No orders found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <React.Fragment key={order._id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.orderNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.shippingAddress?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.paymentStatus === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.paymentMethod?.method === 'cod'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {order.paymentStatus === 'completed' ? 'Paid' : order.paymentMethod?.method === 'cod' ? 'COD' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ₹{order.pricing?.total?.toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => toggleOrderDetails(order._id)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expanded Order Details */}
                                            {expandedOrder === order._id && (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-4 bg-gray-50">
                                                        <div className="space-y-4">
                                                            {/* Products List */}
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-3">Ordered Products:</h3>
                                                                <div className="space-y-2">
                                                                    {order.items?.map((item, index) => (
                                                                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                                            <div className="flex items-center space-x-4">
                                                                                {item.image && (
                                                                                    <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                                                                                )}
                                                                                <div>
                                                                                    <div className="font-medium text-gray-900">{item.productName}</div>
                                                                                    <div className="text-sm text-gray-600">Size: {item.size}</div>
                                                                                    {item.customizations && (
                                                                                        <div className="text-xs text-gray-500">Custom design included</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <div className="font-medium">₹{item.price} × {item.quantity}</div>
                                                                                <div className="text-sm text-gray-600">= ₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Shipping Address */}
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address:</h3>
                                                                <div className="p-3 bg-white rounded-lg text-sm text-gray-700">
                                                                    <div>{order.shippingAddress?.name}</div>
                                                                    <div>{order.shippingAddress?.addressLine1}</div>
                                                                    <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</div>
                                                                    <div>Phone: {order.shippingAddress?.phone}</div>
                                                                </div>
                                                            </div>

                                                            {/* Pricing Breakdown */}
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-2">Pricing:</h3>
                                                                <div className="p-3 bg-white rounded-lg text-sm space-y-1">
                                                                    <div className="flex justify-between">
                                                                        <span>Subtotal:</span>
                                                                        <span>₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span>Shipping:</span>
                                                                        <span>₹{order.pricing?.shipping?.toLocaleString('en-IN')}</span>
                                                                    </div>
                                                                    {order.pricing?.discount > 0 && (
                                                                        <div className="flex justify-between text-green-600">
                                                                            <span>Discount:</span>
                                                                            <span>-₹{order.pricing?.discount?.toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                                                                        <span>Total:</span>
                                                                        <span>₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
