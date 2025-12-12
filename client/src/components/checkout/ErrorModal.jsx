import React from 'react';

export default function ErrorModal({ show, message, onClose }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                {/* Error Icon */}
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                {/* Error Message */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Oops!</h2>
                <p className="text-gray-600 mb-8 text-center">
                    {message}
                </p>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                    Got it
                </button>
            </div>
        </div>
    );
}
