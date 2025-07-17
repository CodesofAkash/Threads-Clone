// API Configuration for deployment
// Both development and production URLs are configurable via environment variables
// Fallback to localhost for development if not specified

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export { API_BASE_URL, SOCKET_URL };
