import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-black mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>
                    404
                </h1>
                <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
                <h2 className="text-2xl font-medium text-gray-800 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Go Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border-2 border-black text-black rounded-md hover:bg-black hover:text-white transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
