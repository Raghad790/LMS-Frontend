// src/components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Fixed ProtectedRoute component to accept both role and children props
const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();

  console.log(
    "🔒 ProtectedRoute check - User:",
    user?.name || "None",
    "Role:",
    user?.role || "None"
  );

  if (loading) {
    return <div>Loading protected route...</div>;
  }

  // Check if user is authenticated
  if (!user) {
    console.warn("⚠️ Access to protected route denied: No user");
    return <Navigate to="/login" />;
  }

  // Check if user has required role (if specified)
  if (role && user.role !== role) {
    console.warn(
      `⚠️ Access to protected route denied: Required role ${role}, user has ${user.role}`
    );
    return <Navigate to="/unauthorized" />;
  }

  console.log("✅ Protected route access granted");
  return children;
};

export default ProtectedRoute;
