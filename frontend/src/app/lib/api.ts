// app/lib/api.ts
import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout for regular requests
});

// Add a request interceptor to include the token from localStorage when available
api.interceptors.request.use(
  (config) => {
    // For file uploads and other operations that set their own Content-Type
    // we don't want to override it
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // If we're in the browser, clear the localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Optionally redirect to login page
        // window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;