// Token management utility for handling authentication tokens
// This handles both cookies (development) and localStorage (production)

const TOKEN_KEY = 'auth-token';

export const tokenManager = {
  // Set token in localStorage and also send in headers for API calls
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Get headers with token for API calls
  getAuthHeaders: () => {
    const token = tokenManager.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenManager.getToken();
    if (!token) return false;
    
    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }
};

export default tokenManager;
