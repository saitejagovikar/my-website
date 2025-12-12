import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileOrders from '../../components/profile/ProfileOrders';
import ProfileAddresses from '../../components/profile/ProfileAddresses';
import ProfilePaymentMethods from '../../components/profile/ProfilePaymentMethods';

export default function Profile({ user: propUser, onLogout }) {
  const user = propUser || {};
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "orders");
  const [isLoading, setIsLoading] = useState(true);

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000); // 5 seconds
  };

  useEffect(() => {
    if (!user || !user.email) {
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <ProfileOrders user={user} showNotification={showNotification} />;
      case 'address':
        return <ProfileAddresses user={user} showNotification={showNotification} />;
      case 'cards':
        return <ProfilePaymentMethods user={user} showNotification={showNotification} />;
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium tracking-wide text-gray-900 mb-1" style={{ fontFamily: 'Marcellus SC, serif' }}>
              Welcome back, {user.name?.split(' ')[0]}
            </h2>
            <p className="text-sm text-gray-500 font-light">Select an option from the menu to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <ProfileSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={onLogout}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
          <div className={`rounded-sm shadow-lg p-4 min-w-[300px] max-w-md border ${notification.type === 'success'
            ? 'bg-white border-green-100'
            : 'bg-white border-red-100'
            }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <p className={`text-sm font-medium flex-1 ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{notification.message}</p>
              <button
                onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                className="ml-2 hover:opacity-75 transition-opacity text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
