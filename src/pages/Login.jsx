// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Login({ onLogin, user, onBack }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) navigate('/', { replace: true }); // Redirect if already logged in
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        alert('Please enter email and password');
        return;
      }
      onLogin({ name: 'User', email: formData.email });
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        alert('Please fill all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      onLogin({ name: formData.name, email: formData.email });
    }

    setShowSuccess(true);
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 relative">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 text-center transform transition-all duration-300 scale-100">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-black">{isLogin ? 'Logged in successfully' : 'Account created successfully'}</p>
            <p className="text-sm text-gray-600 mt-1">Redirecting to home...</p>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Marcellus SC, serif' }}>
            {isLogin ? 'Welcome to PrakriTee' : 'Sign Up'}
          </h2>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium"
              style={{ fontFamily: 'Marcellus SC, serif' }}
            >
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
              <GoogleLogin
                onSuccess={credentialResponse => {
                  console.log('Google login successful:', credentialResponse);
                  // Decode the JWT token to get user info
                  try {
                    const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
                    onLogin({ 
                      name: decoded.name, 
                      email: decoded.email,
                      picture: decoded.picture
                    });
                    setShowSuccess(true);
                    setTimeout(() => navigate('/'), 1200);
                  } catch (error) {
                    console.error('Error decoding Google token:', error);
                  }
                }}
                onError={() => {
                  console.log('Google login failed');
                }}
                useOneTap
                auto_select
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                logo_alignment="left"
                width="100%"
              />
            </GoogleOAuthProvider>
          </div>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-medium hover:text-gray-600 transition-colors mt-1"
              style={{ fontFamily: 'Marcellus SC, serif' }}
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600">Admin access</p>
              <button
                onClick={() => navigate('/admin')}
                className="text-blue-600 font-medium hover:text-gray-600 transition-colors mt-1"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                Go to Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
