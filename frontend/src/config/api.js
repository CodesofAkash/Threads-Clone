// API Configuration for deployment
export const API_BASE_URL = import.meta.env.PROD 
    ? "https://threads-clone-backend-codesofakashs-projects.vercel.app" 
    : "http://localhost:5000";

export const SOCKET_URL = import.meta.env.PROD 
    ? "https://threads-clone-backend-codesofakashs-projects.vercel.app" 
    : "http://localhost:5000";
