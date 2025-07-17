// API Configuration for deployment
// In production, set VITE_API_BASE_URL to your Railway backend URL
// In development, proxy handles API calls to localhost

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : "http://localhost:5000");

export { API_BASE_URL, SOCKET_URL };
