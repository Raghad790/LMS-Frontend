// src/services/api.js
import axios from "axios";
import { logoutAndRedirect } from "../utils/logoutHandler";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ⛔ Automatically logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logoutAndRedirect(); // ⬅ call logout + navigate
    }
    return Promise.reject(err);
  }
);

export default api;
