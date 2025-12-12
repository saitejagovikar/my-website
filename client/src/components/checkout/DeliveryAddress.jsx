import React from 'react';

export default function DeliveryAddress({
    savedAddresses,
    selectedAddressId,
    useSavedAddress,
    formData,
    formErrors,
    user,
    onAddressSelect,
    onUseDifferentAddress,
    onInputChange
}) {
    return (
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg md:text-xl font-medium mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>Delivery Address</h2>

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-900">
                            Select Delivery Address
                        </h3>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                        {savedAddresses.map((address) => (
                            <div
                                key={address._id}
                                onClick={() => onAddressSelect(address._id)}
                                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddressId === address._id
                                    ? 'border-black bg-black/5 shadow-md'
                                    : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Radio Button */}
                                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === address._id
                                        ? 'border-black bg-black'
                                        : 'border-gray-300'
                                        }`}>
                                        {selectedAddressId === address._id && (
                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                        )}
                                    </div>

                                    {/* Address Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900">{address.name}</span>
                                            {address.isDefault && (
                                                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Default</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                                        <p className="text-sm text-gray-700">
                                            {address.addressLine1}
                                            {address.addressLine2 && `, ${address.addressLine2}`}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {address.city}, {address.state} - {address.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onUseDifferentAddress}
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Use a different address
                        </button>
                    </div>
                </div>
            )}

            {/* Show form only if no saved addresses OR user clicked "Use different address" */}
            {(savedAddresses.length === 0 || (!useSavedAddress && selectedAddressId === null)) && (
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onInputChange}
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
                                onChange={onInputChange}
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
                            onChange={onInputChange}
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
                            onChange={onInputChange}
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
                                onChange={onInputChange}
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
                                onChange={onInputChange}
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
                                onChange={onInputChange}
                                className={`w-full px-3 py-2 border ${formErrors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black`}
                                placeholder="500001"
                            />
                            {formErrors.pincode && <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>}
                        </div>
                    </div>

                    {user && (
                        <div className="flex items-center">
                            <input
                                id="saveAddress"
                                type="checkbox"
                                name="saveAddress"
                                checked={formData.saveAddress}
                                onChange={onInputChange}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="saveAddress" className="ml-2 block text-sm text-gray-700">
                                Save this address for future orders
                            </label>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}
