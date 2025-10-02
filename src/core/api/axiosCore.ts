import axios from 'axios';

// Base API URL - update this with your actual API base URL
export const api = process.env.REACT_APP_API_URL || 'http://localhost:5000';

if (!process.env.REACT_APP_API_URL) {
  console.warn('REACT_APP_API_URL environment variable is not set. Using default: http://localhost:5000');
}

// Get auth token from localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.token || '';
};

// Axios instance with default config
export const axiosInstance = axios.create({
  baseURL: api,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove Content-Type header for FormData to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const bearerHeader = {
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
};

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
