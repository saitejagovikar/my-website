import React from 'react';

const PaymentIcons = {
    razorpay: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#2D8FF0" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#2D8FF0" />
            <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#2D8FF0" />
        </svg>
    ),
    cod: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="#4CAF50" />
        </svg>
    )
};

export default function PaymentMethod({
    activeTab,
    total,
    isSubmitting,
    formErrors,
    onTabChange,
    onSubmit
}) {
    return (
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg md:text-xl font-medium mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>Payment Method</h2>

            <div className="space-y-4">
                {/* Razorpay Option */}
                <div
                    className={`p-3 md:p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${activeTab === 'razorpay' ? 'border-black bg-gray-50' : 'border-gray-200'
                        }`}
                    onClick={() => onTabChange('razorpay')}
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-700">
                            {PaymentIcons.razorpay}
                        </div>
                        <div>
                            <div className="font-medium text-sm md:text-base">Pay with Razorpay</div>

                            {/* Payment method badges - Minimal text list */}
                            <div className="flex flex-wrap gap-1 mt-0.5">
                                <span className="text-[10px] text-gray-500">
                                    Cards, UPI, QR, NetBanking
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-2 ${activeTab === 'razorpay' ? 'border-black bg-black' : 'border-gray-300'
                        }`}>
                        {activeTab === 'razorpay' && (
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
                        )}
                    </div>
                </div>

                {/* COD Option */}
                <div
                    className={`p-3 md:p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${activeTab === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200'
                        }`}
                    onClick={() => onTabChange('cod')}
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-700">
                            {PaymentIcons.cod}
                        </div>
                        <div>
                            <div className="font-medium text-sm md:text-base">Cash on Delivery</div>
                            <p className="text-[10px] text-gray-500">Pay cash upon delivery</p>
                        </div>
                    </div>

                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-2 ${activeTab === 'cod' ? 'border-black bg-black' : 'border-gray-300'
                        }`}>
                        {activeTab === 'cod' && (
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
                        )}
                    </div>
                </div>

                {/* Payment Button and Info */}
                <div className="mt-6">
                    {activeTab === 'razorpay' ? (
                        <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">Secure Payment Gateway</p>
                                        <p className="text-xs text-gray-600">You will be redirected to Razorpay's secure payment page. Choose from UPI, Cards, Net Banking, Wallets, or scan QR code to complete your purchase.</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onSubmit}
                                disabled={isSubmitting || Object.keys(formErrors).length > 0}
                                className={`w-full bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl ${isSubmitting || Object.keys(formErrors).length > 0 ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    `Pay ₹${total.toLocaleString('en-IN')}`
                                )}
                            </button>
                            <p className="text-xs text-center text-gray-500">
                                🔒 Secured by Razorpay • SSL Encrypted
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">Cash on Delivery Available</p>
                                        <p className="text-xs text-gray-600">Pay in cash when your order is delivered to your doorstep.</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onSubmit}
                                disabled={isSubmitting}
                                className={`w-full bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    `Place Order - ₹${total.toLocaleString('en-IN')}`
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
