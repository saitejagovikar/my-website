import React, { useState, useEffect } from 'react';
import { apiGet } from '../../api/client';

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topProducts: [],
        revenueByPaymentMethod: { cod: 0, razorpay: 0 },
        ordersByStatus: { pending: 0, confirmed: 0, shipped: 0, delivered: 0 },
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const ordersResponse = await apiGet('/api/admin/orders');
            const products = await apiGet('/api/admin/products');

            // Extract orders array from response
            const orders = ordersResponse.orders || [];

            // Calculate analytics
            const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
            const totalOrders = orders.length;
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            // Revenue by payment method
            const revenueByPaymentMethod = {
                cod: orders
                    .filter(o => o.paymentMethod?.method === 'cod')
                    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
                razorpay: orders
                    .filter(o => o.paymentMethod?.method === 'razorpay')
                    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0)
            };

            // Orders by status
            const ordersByStatus = {
                pending: orders.filter(o => o.status === 'pending').length,
                confirmed: orders.filter(o => o.status === 'confirmed').length,
                shipped: orders.filter(o => o.status === 'shipped').length,
                delivered: orders.filter(o => o.status === 'delivered').length
            };

            // Top products (by quantity sold)
            const productSales = {};
            orders.forEach(order => {
                order.items?.forEach(item => {
                    const productId = item.productId || item.productName;
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            name: item.productName,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    productSales[productId].quantity += item.quantity || 1;
                    productSales[productId].revenue += item.price * (item.quantity || 1);
                });
            });

            const topProducts = Object.values(productSales)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

            // Recent orders
            const recentOrders = orders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setAnalytics({
                totalRevenue,
                totalOrders,
                averageOrderValue,
                topProducts,
                revenueByPaymentMethod,
                ordersByStatus,
                recentOrders
            });
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                    Business Analytics
                </h1>

                {loading ? (
                    <div className="text-center py-12 text-gray-600">Loading analytics...</div>
                ) : (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                                <div className="text-sm opacity-90 mb-1">Total Revenue</div>
                                <div className="text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                                <div className="text-sm opacity-90 mb-1">Total Orders</div>
                                <div className="text-3xl font-bold">{analytics.totalOrders}</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                                <div className="text-sm opacity-90 mb-1">Average Order Value</div>
                                <div className="text-3xl font-bold">{formatCurrency(analytics.averageOrderValue)}</div>
                            </div>
                        </div>

                        {/* Revenue by Payment Method */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Revenue by Payment Method</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                                        <div>
                                            <div className="text-sm text-gray-600">Cash on Delivery</div>
                                            <div className="text-2xl font-bold text-orange-600">
                                                {formatCurrency(analytics.revenueByPaymentMethod.cod)}
                                            </div>
                                        </div>
                                        <div className="text-3xl">💵</div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                        <div>
                                            <div className="text-sm text-gray-600">Online Payment</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {formatCurrency(analytics.revenueByPaymentMethod.razorpay)}
                                            </div>
                                        </div>
                                        <div className="text-3xl">💳</div>
                                    </div>
                                </div>
                            </div>

                            {/* Orders by Status */}
                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Orders by Status</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Pending</span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                                            {analytics.ordersByStatus.pending}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Confirmed</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                                            {analytics.ordersByStatus.confirmed}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Shipped</span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                                            {analytics.ordersByStatus.shipped}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Delivered</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
                                            {analytics.ordersByStatus.delivered}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-xl shadow p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
                            {analytics.topProducts.length === 0 ? (
                                <p className="text-gray-600">No sales data available</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {analytics.topProducts.map((product, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {product.quantity} units
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                        {formatCurrency(product.revenue)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                            {analytics.recentOrders.length === 0 ? (
                                <p className="text-gray-600">No recent orders</p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics.recentOrders.map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-semibold">Order #{order.orderNumber}</div>
                                                <div className="text-sm text-gray-600">{order.shippingAddress?.name}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">{formatCurrency(order.pricing?.total || 0)}</div>
                                                <div className="text-sm text-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
