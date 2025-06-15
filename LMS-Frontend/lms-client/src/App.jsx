import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/LoginPage/Login";
import Register from "./pages/Auth/RegisterPage/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout";

// Dashboards
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import InstructorDashboard from "./pages/Dashboard/InstructorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UsersPage from "./pages/Admin/UsersPage";

function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Student Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        {/* add more nested routes for student here if needed */}
      </Route>

      {/* Instructor Dashboard */}
      <Route
        path="/dashboard/instructor"
        element={
          <ProtectedRoute role="instructor">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InstructorDashboard />} />
        {/* Instructor-specific routes */}
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
