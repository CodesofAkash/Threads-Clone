// API Configuration for deployment
// In production, API calls will be relative to the same domain
// In development, they'll point to localhost backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? "" : "http://localhost:5000");

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (import.meta.env.PROD ? "" : "http://localhost:5000");

export { API_BASE_URL, SOCKET_URL };
