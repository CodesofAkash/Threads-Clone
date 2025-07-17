// API utility for making authenticated requests
import { API_BASE_URL } from '../config/api';
import tokenManager from './tokenManager';

export const apiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: tokenManager.getAuthHeaders(),
    credentials: "include",
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
  
  // Handle unauthorized responses
  if (response.status === 401) {
    tokenManager.removeToken();
    localStorage.removeItem("user-threads");
    window.location.href = '/auth';
    return null;
  }
  
  return response;
};

export default apiRequest;
