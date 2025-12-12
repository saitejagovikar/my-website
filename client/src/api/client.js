// Use environment variable or localhost for development
const getApiBase = () => {
  // If VITE_API_BASE is set, use it (highest priority)
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }

  // Use localhost for development (default)
  return 'http://localhost:3000';
};

const API_BASE = getApiBase();

// Simple in-memory cache for API requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get JWT token from localStorage
 */
const getAuthToken = () => {
  // First try to get token directly
  const token = localStorage.getItem('token');
  if (token) {
    return token;
  }

  // Fallback: try to get from user object (old structure)
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token;
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Handle authentication errors
 */
const handleAuthError = () => {
  // Clear auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirect to login if not already there
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

/**
 * Get headers with authentication
 */
const getHeaders = (includeContentType = true) => {
  const headers = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export async function apiGet(path, useCache = true) {
  // Check cache first if enabled
  if (useCache && cache.has(path)) {
    const cached = cache.get(path);
    const now = Date.now();

    // Return cached data if still valid
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    } else {
      // Remove stale cache entry
      cache.delete(path);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(false)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || `GET ${path} failed`;

    // Handle authentication errors (but not for login/register endpoints)
    if (res.status === 401) {
      // Don't auto-logout for auth endpoints - they have their own error messages
      const authEndpoints = ['/api/user/login', '/api/user/register', '/api/user/google-login'];
      if (!authEndpoints.includes(path)) {
        handleAuthError();
        throw new Error('Authentication required. Please login again.');
      }
    }

    throw new Error(errorMessage);
  }

  const data = await res.json();

  // Store in cache if enabled
  if (useCache) {
    cache.set(path, {
      data,
      timestamp: Date.now()
    });
  }

  return data;
}

// Function to invalidate cache for a specific path or all cache
export function invalidateCache(path = null) {
  if (path) {
    cache.delete(path);
  } else {
    cache.clear();
  }
}

export async function apiPost(path, body) {
  // Check if the body is FormData
  const isFormData = body instanceof FormData;

  // Prepare headers
  const headers = getHeaders(!isFormData);

  // Prepare the request options
  const options = {
    method: 'POST',
    headers,
    body: isFormData ? body : JSON.stringify(body),
    credentials: 'include'
  };

  const res = await fetch(`${API_BASE}${path}`, options);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `POST ${path} failed with status ${res.status}`;

    // Log detailed error information for debugging
    console.error('API POST Error:', {
      path,
      status: res.status,
      errorData,
      errorMessage
    });

    // Handle authentication errors (but not for login/register/password reset endpoints)
    if (res.status === 401 || res.status === 404) {
      // Don't auto-logout for auth endpoints - they have their own error messages
      const authEndpoints = ['/api/user/login', '/api/user/register', '/api/user/google-login', '/api/user/forgot-password', '/api/user/verify-otp', '/api/user/reset-password'];
      if (!authEndpoints.includes(path)) {
        if (res.status === 401) {
          handleAuthError();
          throw new Error('Authentication required. Please login again.');
        }
      }
    }

    throw new Error(errorMessage);
  }

  // Invalidate related cache entries after successful POST
  const basePath = path.split('?')[0]; // Remove query params
  invalidateCache(basePath);

  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // Handle authentication errors
    if (res.status === 401) {
      handleAuthError();
      throw new Error('Authentication required. Please login again.');
    }

    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || `PUT ${path} failed`;
    throw new Error(errorMessage);
  }

  // Invalidate related cache entries after successful PUT
  const basePath = path.split('?')[0];
  invalidateCache(basePath);

  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!res.ok) {
    // Handle authentication errors
    if (res.status === 401) {
      handleAuthError();
      throw new Error('Authentication required. Please login again.');
    }

    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `DELETE ${path} failed with status ${res.status}`;
    throw new Error(errorMessage);
  }

  // Invalidate related cache entries after successful DELETE
  const basePath = path.split('?')[0];
  invalidateCache(basePath);

  return true;
}

export async function uploadFile(path, file) {
  const formData = new FormData();
  formData.append('image', file);

  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `File upload to ${path} failed with status ${res.status}`;
    throw new Error(errorMessage);
  }

  return res.json();
}
