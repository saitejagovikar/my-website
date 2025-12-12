import React from 'react';

export default function SuccessModal({ show, orderNumber }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-300 scale-100 animate-fadeIn">
                {/* Success Icon */}
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                    <svg className="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Success Message */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-6">
                    Your order has been confirmed and will be processed shortly.
                </p>

                {/* Order Number */}
                {orderNumber && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Order Number</p>
                        <p className="text-lg font-semibold text-gray-900">#{orderNumber}</p>
                    </div>
                )}

                {/* Redirect Message */}
                <p className="text-sm text-gray-500">
                    Redirecting to order details...
                </p>

                {/* Loading Spinner */}
                <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
            </div>
        </div>
    );
}
