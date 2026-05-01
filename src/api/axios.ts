import axios from 'axios';

// Since the whole app runs together in the full-stack pattern, 
// the API root is just /api relative to the current host.
const api = axios.create({
  baseURL: '/api'
});

// Request interceptor to add the auth token header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle unauthenticated scenarios
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Ensure we redirect but without full page reload if possible, 
      // though simple window location works.
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
