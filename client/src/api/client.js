// Use environment variable or Render backend
const getApiBase = () => {
  // If VITE_API_BASE is set, use it (highest priority)
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // Default to Render backend (works for both development and production)
  return 'https://my-website-xtht.onrender.com';
};

const API_BASE = getApiBase();

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body) {
  // Check if the body is FormData
  const isFormData = body instanceof FormData;
  
  // Prepare headers - don't set Content-Type for FormData, let the browser set it with the correct boundary
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Prepare the request options
  const options = {
    method: 'POST',
    headers,
    body: isFormData ? body : JSON.stringify(body),
    credentials: 'include' // Include cookies for authentication if needed
  };
  
  const res = await fetch(`${API_BASE}${path}`, options);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `POST ${path} failed with status ${res.status}`;
    throw new Error(errorMessage);
  }
  
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed`);
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, { 
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `DELETE ${path} failed with status ${res.status}`;
    throw new Error(errorMessage);
  }
  return true;
}

export async function uploadFile(path, file) {
  const formData = new FormData();
  formData.append('image', file);
  
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
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


