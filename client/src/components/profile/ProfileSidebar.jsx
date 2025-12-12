import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaCreditCard, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';

export default function ProfileSidebar({ user, activeTab, setActiveTab, onLogout }) {
    const navigate = useNavigate();

    const menuItems = [
        { key: "orders", icon: <FaBoxOpen />, label: "My Orders" },
        { key: "address", icon: <FaMapMarkerAlt />, label: "Saved Addresses" },
        { key: "cards", icon: <FaCreditCard />, label: "Payment Methods" },
        { key: "shop", icon: <FaShoppingCart />, label: "Continue Shopping" },
        { key: "logout", icon: <FaSignOutAlt />, label: "Logout" },
    ];

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:sticky lg:top-28 flex flex-row lg:flex-col items-center lg:items-stretch gap-6 lg:gap-0">
                <div className="text-center shrink-0 lg:shrink lg:mb-8 w-1/3 lg:w-auto border-r lg:border-r-0 border-gray-100 lg:border-none pr-6 lg:pr-0">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                        <FaUser className="text-gray-400 text-2xl lg:text-3xl" />
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="text-sm lg:text-base font-medium text-gray-900 mb-0.5 tracking-wide truncate" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            {user.name || 'User'}
                        </h2>
                        <p className="text-[10px] lg:text-xs text-gray-500 font-light tracking-wide truncate">{user.email || 'user@example.com'}</p>
                    </div>
                </div>

                <nav className="space-y-1 flex-1 min-w-0">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => {
                                if (item.key === 'logout') {
                                    handleLogout();
                                } else if (item.key === 'shop') {
                                    navigate('/');
                                } else {
                                    setActiveTab(item.key);
                                }
                            }}
                            className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-md text-xs lg:text-sm transition-all duration-200 ${activeTab === item.key
                                ? 'bg-black text-white'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <span className={`text-sm lg:text-base ${activeTab === item.key ? 'text-white' : 'text-gray-400'
                                }`}>
                                {item.icon}
                            </span>
                            <span className={`tracking-wide truncate ${activeTab === item.key ? 'font-medium' : 'font-light'}`}>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
