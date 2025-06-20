import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // Skip adding token for login/register endpoints
    if (config.url?.includes('/login') || config.url?.includes('/register')) {
      return config;
    }
    
    const token = localStorage.getItem("token");
    if (token) {
      console.log(`Adding token to request: ${config.url}`);
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.log(`No token for request: ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and normalize them
// Handle API errors in api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle API errors
    if (error.response) {
      console.error(`API Error [${error.config?.method}] ${error.config?.url}:`);
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
      
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        console.error("Permission denied error");
      }
    } else if (error.request) {
      console.error("Request was made but no response received", error.request);
    } else {
      console.error("Error setting up request", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;



// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });

// // Add request interceptor for auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Handle responses and normalize them
// api.interceptors.response.use(
//   (response) => {
//     // Log successful responses in development
//     if (import.meta.env.MODE !== 'production') {
//       console.log(`API Success: ${response.config.url}`);
//     }
//     return response;
//   },
//   (error) => {
//     // Handle API errors
//     if (error.response) {
//       console.error(`API Error [${error.config?.method}] ${error.config?.url}:`, error.response.status);
      
//       if (error.response.status === 401) {
//         localStorage.removeItem("token");
//         // Only redirect if not already on login page
//         if (!window.location.pathname.includes('/login')) {
//           window.location.href = '/login';
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;