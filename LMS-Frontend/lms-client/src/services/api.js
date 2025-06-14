import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const checkHealth = async () => {
  const response = await axios.get(`${API_BASE}/health`);
  return response.data;
};
