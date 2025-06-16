import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create a shared axios instance with credentials enabled
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ needed to send session cookies
});


// ✅ Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
