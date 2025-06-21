import axios from "axios";

// Use environment variables for configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "lms_auth_token";

// List of public routes that don't need token logging
const PUBLIC_ROUTES = ["/courses", "/categories", "/health"];

// List of auth routes that don't need tokens
const AUTH_ROUTES = ["/login", "/register", "/auth/google", "/refresh-token"];

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get the full URL for better logging
    const fullUrl = config.url || "";

    // Skip token for auth endpoints
    if (AUTH_ROUTES.some((route) => fullUrl.includes(route))) {
      console.log(`🔓 Skipping token for auth route: ${fullUrl}`);
      return config;
    }

    // ALWAYS use our utility method to get the token
    // This ensures consistent token handling across the app
    const token = apiUtils.getToken();

    // Force token synchronization on every request
    apiUtils.syncTokens();

    // Only log non-public requests to reduce console noise
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      fullUrl.includes(route)
    );

    if (!isPublicRoute) {
      // In development, log request details for debugging
      if (import.meta.env.DEV) {
        console.log(`🔄 ${config.method?.toUpperCase()} ${fullUrl}`);

        if (token) {
          // Mask most of the token for security in logs
          const maskedToken =
            token.length > 10
              ? `${token.substring(0, 5)}...${token.substring(
                  token.length - 5
                )}`
              : "[SECURED]";
          console.log(`🔑 Using token: ${maskedToken}`);
        } else {
          console.warn(`⚠️ No token for request: ${fullUrl}`);
        }
      }
    }

    // Add token to headers if available - ALWAYS use Bearer format
    if (token) {
      // Always use the format "Bearer [token]" - exactly as expected by JWT standards
      config.headers.Authorization = `Bearer ${token}`;

      // Set a flag we can check in response interceptor
      config.tokenUsed = true;
    } else if (!isPublicRoute) {
      console.warn(`⚠️ Unauthenticated request to protected route: ${fullUrl}`);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request preparation failed:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common patterns
api.interceptors.response.use(
  (response) => {
    // Auto-store token if present in response
    if (response.data?.token) {
      // First remove any old tokens
      localStorage.removeItem("token");
      // Then store with the correct key
      localStorage.setItem(TOKEN_KEY, response.data.token);

      if (import.meta.env.DEV) {
        console.log("🔒 Token received and saved to localStorage");
        // Verify token was stored correctly
        const storedToken = localStorage.getItem(TOKEN_KEY);
        console.log(
          "✅ Token storage verification:",
          storedToken === response.data.token ? "Success" : "Failed"
        );
      }
    }

    // Return just the data part by default to simplify consumer code
    return response;
  },
  (error) => {
    // Comprehensive error handling
    if (error.response) {
      const { status, data, config } = error.response;

      // Group error handling by status code
      switch (status) {
        case 401: // Unauthorized
          console.error("🚫 Authentication error: Token invalid or expired");
          localStorage.removeItem(TOKEN_KEY);

          // Don't redirect for login attempts
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login?session_expired=true";
          }
          break;

        case 403: // Forbidden
          console.error("🔒 Permission denied: Insufficient privileges");
          break;

        case 404: // Not Found
          console.error(`❓ Resource not found: ${config.url}`);
          break;

        case 429: // Rate Limited
          console.error("⏱️ Too many requests: Rate limit exceeded");
          break;

        case 500: // Server Error
        case 502: // Bad Gateway
        case 503: // Service Unavailable
          console.error(
            `🔥 Server error (${status}): ${data?.message || "Unknown error"}`
          );
          break;

        default:
          console.error(
            `❌ API Error [${status}] ${config.method?.toUpperCase()} ${
              config.url
            }`
          );
          console.error("Response:", data);
      }
    } else if (error.request) {
      console.error("📡 Network error: No response received", error.request);
    } else {
      console.error("⚙️ Request configuration error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Utility methods to work with API
const apiUtils = {
  setToken: (token) => {
    if (token) {
      // Always set both token locations for maximum compatibility
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem("token", token);
      console.log("🔑 Token set in both storage locations");
      return true;
    }
    return false;
  },

  getToken: () => {
    // Try to get token from primary key first
    let token = localStorage.getItem(TOKEN_KEY);

    // If not found, try legacy key
    if (!token) {
      token = localStorage.getItem("token");

      // If found in legacy key, migrate it
      if (token) {
        console.log("🔄 Found token in legacy storage, migrating...");
        localStorage.setItem(TOKEN_KEY, token);
      }
    }

    if (!token) {
      console.warn("⚠️ No auth token found in any storage location");
    }

    return token;
  },

  // Sync tokens between both storage locations
  syncTokens: () => {
    const lmsToken = localStorage.getItem(TOKEN_KEY);
    const legacyToken = localStorage.getItem("token");

    if (lmsToken && !legacyToken) {
      localStorage.setItem("token", lmsToken);
      console.log("✓ Synced: Copied lms_auth_token to token");
      return true;
    } else if (!lmsToken && legacyToken) {
      localStorage.setItem(TOKEN_KEY, legacyToken);
      console.log("✓ Synced: Copied token to lms_auth_token");
      return true;
    } else if (lmsToken && legacyToken && lmsToken !== legacyToken) {
      // Prefer the lms_auth_token version
      localStorage.setItem("token", lmsToken);
      console.log(
        "⚠️ Synced: Tokens were different! Synchronized to lms_auth_token value"
      );
      return true;
    }
    return false;
  },

  clearToken: () => {
    // Clear both possible token locations
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("token");
    console.log("🧹 All tokens cleared from storage");
  },

  // Useful for handling common API patterns
  handleApiError: (error, defaultMessage = "An error occurred") => {
    const message =
      error.response?.data?.message || error.message || defaultMessage;

    return {
      error: true,
      message,
      status: error.response?.status || 0,
    };
  },
};

// Add utility methods to api object
Object.assign(api, apiUtils);

export default api;
