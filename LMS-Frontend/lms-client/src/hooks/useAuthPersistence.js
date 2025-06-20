// src/hooks/useAuthPersistence.js
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAuthPersistence = () => {
  const { checkAuthStatus } = useAuth();
  
  useEffect(() => {
    console.log("🔄 Auth persistence hook initialized");
    
    // Check auth status on mount
    checkAuthStatus();
    
    // Set up event listener for storage changes
    // This helps sync auth state across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log("🔑 Token changed in another tab");
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Optional: periodic token validation
    // Helpful for session timeout detection
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log("🔄 Periodic auth check");
        checkAuthStatus();
      }
    }, 30 * 60 * 1000); // Check every 30 minutes
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [checkAuthStatus]);
  
  return null;
};