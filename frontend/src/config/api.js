// API Configuration for deployment
// In production, API calls will be made to the Railway backend URL
// In development, they'll use the proxy to localhost backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? "https://your-railway-app.railway.app" : "");

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (import.meta.env.PROD ? "https://your-railway-app.railway.app" : "http://localhost:5000");

export { API_BASE_URL, SOCKET_URL };
