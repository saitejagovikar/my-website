// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { apiPost } from '../../api/client';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';
import Particles from '../../components/effects/Particles';

export default function Login({ onLogin, user, onBack }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) navigate('/', { replace: true }); // Redirect if already logged in

    // Check if redirected from forgot password for signup
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [user, navigate, searchParams]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError('Please enter email and password');
          setIsLoading(false);
          return;
        }

        // Login API call
        const response = await apiPost('/api/user/login', {
          email: formData.email,
          password: formData.password,
        });

        // Store token and user separately
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        onLogin(response.user);
        setShowSuccess(true);
        setTimeout(() => navigate('/'), 1200);
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill all fields');
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        // Register API call
        const response = await apiPost('/api/user/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        // Store token and user separately
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        onLogin(response.user);
        setShowSuccess(true);
        setTimeout(() => navigate('/'), 1200);
      }
    } catch (error) {
      // Check if it's an unregistered email error during login
      if (isLogin && error.message && error.message.includes('not registered')) {
        setError(
          <div>
            <p className="mb-2">{error.message}</p>
            <button
              onClick={() => setIsLogin(false)}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Sign up here
            </button>
          </div>
        );
      } else {
        setError(error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!adminFormData.email || !adminFormData.password) {
        setError('Please enter email and password');
        setIsLoading(false);
        return;
      }

      // Admin login API call
      const response = await apiPost('/api/user/login', {
        email: adminFormData.email,
        password: adminFormData.password,
      });

      // Check if user is admin
      if (response.user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      // Store token and user
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      onLogin(response.user);
      setShowAdminModal(false);
      setShowSuccess(true);
      setTimeout(() => navigate('/admin'), 1200);
    } catch (error) {
      setError(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 relative">
      {/* Particles Background */}
      <div className="fixed inset-0 z-0">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
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

      <div className="max-w-md mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-white hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Marcellus SC, serif' }}>
            {isLogin ? 'Welcome to SLAY' : 'Sign Up'}
          </h2>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 placeholder-white/50"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 placeholder-white/50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 placeholder-white/50"
                placeholder="Enter your password"
              />
              {isLogin && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 placeholder-white/50"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-4 rounded-xl hover:bg-white/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Marcellus SC, serif' }}
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
            </button>
          </form>

          {/* Divider - Only show if Google login is available */}
          {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-white/70">Or continue with</span>
              </div>
            </div>
          )}

          {/* Google Login - Only show if client ID is configured */}
          {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    setIsLoading(true);
                    setError('');
                    try {
                      // Send credential to backend for verification
                      const response = await apiPost('/api/user/google-login', {
                        credential: credentialResponse.credential,
                      });

                      // Store token and user
                      localStorage.setItem('token', response.token);
                      localStorage.setItem('user', JSON.stringify(response.user));

                      onLogin(response.user);
                      setShowSuccess(true);
                      setTimeout(() => navigate('/'), 1200);
                    } catch (error) {
                      setError(error.message || 'Google login failed');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  onError={() => {
                    setError('Google login failed');
                  }}
                  useOneTap={false}
                  shape="rectangular"
                  logo_alignment="left"
                  width="100%"
                />
              </GoogleOAuthProvider>
            </div>
          )}

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-white/70">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 font-medium hover:text-blue-400 transition-colors mt-1"
              style={{ fontFamily: 'Marcellus SC, serif' }}
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/70">Admin access</p>
              <button
                onClick={() => setShowAdminModal(true)}
                className="text-blue-500 font-medium hover:text-blue-400 transition-colors mt-1"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                Admin Panel Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowAdminModal(false);
                setError('');
                setAdminFormData({ email: '', password: '' });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Marcellus SC, serif' }}>
                Admin Login
              </h2>
              <p className="text-sm text-gray-600 mt-2">Enter your admin credentials</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Admin Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="admin-email"
                  value={adminFormData.email}
                  onChange={(e) => {
                    setAdminFormData({ ...adminFormData, email: e.target.value });
                    setError('');
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@slay.com"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="admin-password"
                  value={adminFormData.password}
                  onChange={(e) => {
                    setAdminFormData({ ...adminFormData, password: e.target.value });
                    setError('');
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login as Admin'}
              </button>
            </form>

            {/* Admin Credentials Hint */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p className="font-semibold mb-1">Default Admin Credentials:</p>
              <p>Email: admin@slay.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
