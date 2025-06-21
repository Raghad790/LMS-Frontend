// src/hooks/useAuthPersistence.js
import { useEffect } from "react";
import useAuth from "./useAuth";

// Consistent token key
const TOKEN_KEY = "lms_auth_token";

export const useAuthPersistence = () => {
  // Fix import to match the actual export in useAuth.js
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    console.log("🔄 Auth persistence hook initialized");

    // Check auth status on mount
    if (typeof checkAuthStatus === "function") {
      checkAuthStatus();
    } else {
      console.warn("⚠️ checkAuthStatus is not available in auth context");
    }

    // Set up event listener for storage changes
    // This helps sync auth state across tabs
    const handleStorageChange = (e) => {
      // Check for both token keys
      if (e.key === TOKEN_KEY || e.key === "token") {
        console.log(`🔑 Token changed in another tab (key: ${e.key})`);
        if (typeof checkAuthStatus === "function") {
          checkAuthStatus();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Optional: periodic token validation
    // Helpful for session timeout detection
    const intervalId = setInterval(() => {
      // Check for token in both possible locations
      const token =
        localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
      if (token && typeof checkAuthStatus === "function") {
        console.log("🔄 Periodic auth check");
        checkAuthStatus();
      }
    }, 30 * 60 * 1000); // Check every 30 minutes

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [checkAuthStatus]);

  return null;
};
