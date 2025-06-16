import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Public Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/LoginPage/Login";
import Register from "./pages/Auth/RegisterPage/Register";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Dashboards
import StudentDashboard from "./pages/Dashboard/StudentDashboard/Dashboard";
import InstructorDashboard from "./pages/Dashboard/InstructorDashboard/InstructorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard/AdminDashboard";

// Admin Panel
import UsersPage from "./pages/Dashboard/AdminDashboard/UsersPage";

// Student Course Detail Page
import CourseDetails from "./pages/Dashboard/StudentDashboard/CourseDetails";

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
        <Route path="courses/:courseId" element={<CourseDetails />} />
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
