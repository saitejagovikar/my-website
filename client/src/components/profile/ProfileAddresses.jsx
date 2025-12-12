import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client';

export default function ProfileAddresses({ user, showNotification }) {
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

    useEffect(() => {
        loadAddresses();
    }, [user]);

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
            showNotification(editingAddress ? 'Address updated successfully' : 'Address added successfully', 'success');
        } catch (error) {
            showNotification('Failed to save address: ' + error.message, 'error');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        if (!user.email) return;

        try {
            await apiDelete(`/api/user/addresses/${id}?email=${encodeURIComponent(user.email)}`);
            await loadAddresses();
            showNotification('Address deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete address: ' + error.message, 'error');
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

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
                <div>
                    <h2 className="text-xl font-medium tracking-wide" style={{ fontFamily: 'Marcellus SC, serif' }}>Saved Addresses</h2>
                    <p className="text-gray-400 text-sm font-light mt-1">Manage your delivery addresses</p>
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
                    className="px-4 py-2 bg-white text-gray-900 rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-medium"
                >
                    <FaPlus /> Add New
                </button>
            </div>

            {showAddressForm && (
                <div className="p-6 border-b border-gray-100">
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.name}
                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    required
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address Line 1 *</label>
                            <input
                                type="text"
                                required
                                value={addressForm.addressLine1}
                                onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address Line 2</label>
                            <input
                                type="text"
                                value={addressForm.addressLine2}
                                onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">City *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">State *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.state}
                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Pincode *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.pincode}
                                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address Type</label>
                                <select
                                    value={addressForm.addressType}
                                    onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                                    className="px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm bg-white"
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 mt-6 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                />
                                <span className="text-sm text-gray-600 font-light">Set as default address</span>
                            </label>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors text-xs uppercase tracking-wider font-medium"
                            >
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddressForm(false);
                                    setEditingAddress(null);
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
                {addresses.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                            <FaMapMarkerAlt className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No saved addresses</h3>
                        <p className="text-sm text-gray-500 font-light mb-6">Add your first delivery address to speed up checkout.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                            <div key={address._id} className={`border rounded-lg p-5 transition-colors ${address.isDefault ? 'border-gray-900 bg-gray-50/30' : 'border-gray-100 hover:border-gray-300'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {address.isDefault && (
                                                <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gray-900 text-white rounded-sm">Default</span>
                                            )}
                                            <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 rounded-sm">
                                                {address.addressType}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-900">{address.name}</p>
                                        <p className="text-sm text-gray-500 font-light mt-1">{address.phone}</p>
                                        <div className="text-sm text-gray-600 font-light mt-3 leading-relaxed">
                                            <p>{address.addressLine1}</p>
                                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                                            <p>{address.city}, {address.state} - {address.pincode}</p>
                                            <p>{address.country}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 ml-4">
                                        <button
                                            onClick={() => handleEditAddress(address)}
                                            className="p-2 text-gray-400 hover:text-gray-900 rounded transition-colors"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(address._id)}
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
