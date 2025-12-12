import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client';

export default function ProfilePaymentMethods({ user, showNotification }) {
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

    useEffect(() => {
        loadPaymentMethods();
    }, [user]);

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
            showNotification(editingPayment ? 'Payment method updated successfully' : 'Payment method added successfully', 'success');
        } catch (error) {
            showNotification('Failed to save payment method: ' + error.message, 'error');
        }
    };

    const handleDeletePayment = async (id) => {
        if (!confirm('Are you sure you want to delete this payment method?')) return;
        if (!user.email) return;

        try {
            await apiDelete(`/api/user/payment-methods/${id}?email=${encodeURIComponent(user.email)}`);
            await loadPaymentMethods();
            showNotification('Payment method deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete payment method: ' + error.message, 'error');
        }
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

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
                <div>
                    <h2 className="text-xl font-medium tracking-wide" style={{ fontFamily: 'Marcellus SC, serif' }}>Payment Methods</h2>
                    <p className="text-gray-400 text-sm font-light mt-1">Manage your payment options</p>
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
                    className="px-4 py-2 bg-white text-gray-900 rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-medium"
                >
                    <FaPlus /> Add New
                </button>
            </div>

            {showPaymentForm && (
                <div className="p-6 border-b border-gray-100">
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Card Number *</label>
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
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Card Holder Name *</label>
                            <input
                                type="text"
                                required
                                value={paymentForm.cardHolderName}
                                onChange={(e) => setPaymentForm({ ...paymentForm, cardHolderName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Expiry Month *</label>
                                <select
                                    required
                                    value={paymentForm.expiryMonth}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, expiryMonth: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm bg-white"
                                >
                                    <option value="">Month</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = String(i + 1).padStart(2, '0');
                                        return <option key={month} value={month}>{month}</option>;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Expiry Year *</label>
                                <select
                                    required
                                    value={paymentForm.expiryYear}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, expiryYear: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm bg-white"
                                >
                                    <option value="">Year</option>
                                    {Array.from({ length: 20 }, (_, i) => {
                                        const year = new Date().getFullYear() + i;
                                        return <option key={year} value={String(year)}>{year}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={paymentForm.isDefault}
                                onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
                                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                            />
                            <span className="text-sm text-gray-600 font-light">Set as default payment method</span>
                        </label>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors text-xs uppercase tracking-wider font-medium"
                            >
                                {editingPayment ? 'Update Card' : 'Save Card'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPaymentForm(false);
                                    setEditingPayment(null);
                                }}
                                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50 transition-colors text-xs uppercase tracking-wider font-medium"
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
                        <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                            <FaCreditCard className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No payment methods</h3>
                        <p className="text-sm text-gray-500 font-light mb-6">Add your first payment method to check out faster.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paymentMethods.map((payment) => (
                            <div key={payment._id} className={`border rounded-lg p-5 transition-colors ${payment.isDefault ? 'border-gray-900 bg-gray-50/30' : 'border-gray-100 hover:border-gray-300'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {payment.isDefault && (
                                                <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gray-900 text-white rounded-sm">Default</span>
                                            )}
                                            <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 rounded-sm capitalize">
                                                {payment.cardType}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-900">{payment.cardHolderName}</p>
                                        <p className="text-gray-900 mt-2 font-mono tracking-wide">
                                            <span className="text-xl tracking-tighter">••••</span> <span className="ml-1 text-sm">{payment.cardNumber}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 font-light mt-1">
                                            Expires: {payment.expiryMonth}/{payment.expiryYear}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 ml-4">
                                        <button
                                            onClick={() => handleEditPayment(payment)}
                                            className="p-2 text-gray-400 hover:text-gray-900 rounded transition-colors"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePayment(payment._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded transition-colors"
                                        >
                                            <FaTrash size={14} />
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
}
