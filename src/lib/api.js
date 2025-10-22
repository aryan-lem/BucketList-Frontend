// lib/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing the token to prevent multiple refreshes
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401/403 and we haven't tried refreshing yet
    if ((error.response?.status === 401 || error.response?.status === 403) && 
        !originalRequest._retry) {
      
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      // Mark that we're refreshing and have retried this request
      originalRequest._retry = true;
      isRefreshing = true;
      // Try to refresh the token
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // No refresh token, redirect to login
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
      
      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${API_URL}/auth/refresh?token=${refreshToken}`, 
          {}, 
          { skipAuthRefresh: true }
        );
        
        // If successful, update tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update headers for the original request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Process any queued requests
        processQueue(null, accessToken);
        
        // Reset refreshing flag
        isRefreshing = false;
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear tokens and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/auth/login?expired=true';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const refreshToken = async (token) => {
  const response = await api.post(`/auth/refresh?token=${token}`);
  return response.data;
};

// Todo APIs
export const fetchTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await api.post('/todos', todo);
  return response.data;
};

export const updateTodo = async (id, todo) => {
  const response = await api.put(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

export default api;