import React from 'react';

function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
            {message && (
                <p className="mt-4 text-gray-600 text-sm">{message}</p>
            )}
        </div>
    );
}

export default LoadingSpinner;
