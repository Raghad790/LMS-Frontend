
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // 1. Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but wrong role → redirect to unauthorized page
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Passed ✅
  return children;
};

export default ProtectedRoute;