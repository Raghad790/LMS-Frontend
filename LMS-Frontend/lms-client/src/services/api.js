import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create a shared axios instance with credentials enabled
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ needed to send session cookies
});


export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
