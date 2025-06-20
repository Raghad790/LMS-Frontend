// src/contexts/AuthContext.jsx - simplified version
import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  // src/contexts/AuthContext.jsx - Check this part
const checkAuthStatus = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("No authentication token found");
      setUser(null);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      
      if (response.data.success || response.data.user) {
        // Make sure we're extracting user data properly
        const userData = response.data.user || response.data.data;
        console.log("Auth check successful, user data:", userData);
        
        // Ensure user has a name property
        if (!userData.name && userData.email) {
          // Extract name from email if missing
          userData.name = userData.email.split('@')[0];
        }
        
        setUser(userData);
      } else {
        console.log("Auth check returned unsuccessful response");
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (apiError) {
      console.error("API error during auth check:", apiError);
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  } finally {
    setLoading(false);
  }
};

  // Simple login function that just updates the user state
  // The actual API call is in the login form
  const login = (userData) => {
    if (!userData) {
      console.error("No user data provided to login function");
      return;
    }
    
    console.log("Setting authenticated user:", userData.email);
    setUser(userData);
    setError(null);
  };

  // Register a new user (just a convenience wrapper)
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register", userData);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      const newUser = response.data.user || response.data.data || response.data;
      setUser(newUser);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = async () => {
    try {
      setLoading(true);
      
      // Try to logout on server but continue even if it fails
      try {
        await api.post("/auth/logout");
      } catch (err) {
 console.warn("Server logout failed, continuing with client logout:", err);      }
      
      localStorage.removeItem("token");
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err.message);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;





// // src/contexts/AuthContext.jsx
// import { createContext, useState, useEffect } from "react";
// import api from "../services/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Check auth status on mount
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Check if user is authenticated
//   const checkAuthStatus = async () => {
//     try {
//       setLoading(true);
//       // Get token from localStorage
//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.log("No authentication token found");
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       console.log("Checking auth status with token");
//       // Use token to get current user
//       const response = await api.get("/auth/me");
//       if (response.data.success) {
//         const userData = response.data.user || response.data.data;
//         console.log("Auth check successful:", userData?.role);
//         setUser(userData);
//       } else {
//         console.log("Auth check returned unsuccessful response");
//         localStorage.removeItem("token");
//         setUser(null);
//       }
//       setError(null);
//     } catch (err) {
//       console.error("Auth check failed:", err.message);
//       // Clear invalid token
//       localStorage.removeItem("token");
//       setUser(null);

//       // Only set error if it's not a 401
//       if (err.response && err.response.status !== 401) {
//         setError(err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login handler with better error and token handling
//   const login = async (credentials) => {
//     try {
//       setLoading(true);
//       console.log("Attempting login with credentials:", {
//         email: credentials.email,
//         passwordProvided: !!credentials.password,
//       });

//       // Make sure we have all required fields
//       if (!credentials.email || !credentials.password) {
//         throw new Error("Email and password are required");
//       }

//       // Try sending the login request with the credentials as expected by your API
//       // Some APIs expect different field names, so let's try a few common ones
//       const loginPayload = {
//         email: credentials.email,
//         password: credentials.password,
//         // Include these if your API might use them instead
//         username: credentials.email,
//       };

//       console.log(
//         "Sending login request with payload structure:",
//         Object.keys(loginPayload)
//       );

//       const response = await api.post("/auth/login", loginPayload);
//       console.log("Login response:", response.data);

//       if (!response.data) {
//         throw new Error("No response data received");
//       }

//       // Extract token from different possible response structures
//       const token =
//         response.data.token ||
//         response.data.accessToken ||
//         response.data.access_token ||
//         (response.data.data && response.data.data.token);

//       // Make sure we have a token
//       if (!token) {
//         console.error("No token found in response:", response.data);
//         throw new Error("No authentication token received");
//       }

//       // Store token
//       localStorage.setItem("token", token);
//       console.log("Token stored successfully");

//       // Extract user data
//       let userData;
//       if (response.data.user) {
//         userData = response.data.user;
//       } else if (response.data.data) {
//         userData = response.data.data;
//       } else {
//         userData = response.data;
//       }

//       console.log(
//         "User authenticated:",
//         userData.email,
//         "Role:",
//         userData.role
//       );
//       setUser(userData);
//       setError(null);

//       return userData;
//     } catch (err) {
//       console.error("Login error details:", err);
//       if (err.response) {
//         console.error("Server response:", err.response.data);
//       }
//       setError(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register a new user (just a convenience wrapper)
//   const register = async (userData) => {
//     try {
//       setLoading(true);
//       console.log("Attempting registration for:", userData.email);

//       const response = await api.post("/auth/register", userData);

//       // Check for token
//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token);
//         console.log("Registration successful, token stored");
//       } else {
//         console.log("Registration successful but no token received");
//       }

//       setUser(response.data.user);
//       setError(null);
//       return response.data;
//     } catch (err) {
//       console.error("Registration error:", err.message);
//       setError(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Log out the current user
//   const logout = async () => {
//     try {
//       setLoading(true);
//       console.log("Attempting logout");

//       // Try to logout on server, but continue even if it fails
//       try {
//         await api.post("/auth/logout");
//         console.log("Server logout successful");
//       } catch (serverErr) {
//         console.warn(
//           "Server logout failed, continuing with client logout:",
//           serverErr
//         );
//       }

//       // Always clear local auth data
//       localStorage.removeItem("token");
//       setUser(null);
//       setError(null);
//       console.log("Logout complete, auth data cleared");
//     } catch (err) {
//       console.error("Logout error:", err.message);

//       // Still remove token and user on logout error
//       localStorage.removeItem("token");
//       setUser(null);
//       setError(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     checkAuthStatus,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthContext;
