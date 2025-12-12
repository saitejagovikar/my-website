import React from 'react';

export default function BackConfirmModal({ show, onConfirm, onCancel }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                {/* Warning Icon */}
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Message */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Leave Checkout?</h2>
                <p className="text-gray-600 mb-8 text-center">
                    Your cart items will be saved, but you'll need to fill in your details again.
                </p>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                        Stay
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}
