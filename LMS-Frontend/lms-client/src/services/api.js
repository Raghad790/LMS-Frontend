// src/services/api.js
import axios from "axios";

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend API URL
  withCredentials: true, // Important for cookies if you're using them alongside JWT
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear token on auth errors
      localStorage.removeItem("token");
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login") && 
          !window.location.pathname.includes("/register") && 
          !window.location.pathname === "/") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;