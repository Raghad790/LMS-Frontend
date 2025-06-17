import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Public Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/LoginPage/Login";
import Register from "./pages/Auth/RegisterPage/Register";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import OAuthRedirect from "./pages/Auth/OAuthRedirect";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayoutV2";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Dashboards
import StudentDashboard from "./pages/Dashboard/StudentDashboard/Dashboard";
import InstructorDashboard from "./pages/Dashboard/InstructorDashboard/InstructorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard/AdminDashboard";

// Admin Panel
import UsersPage from "./pages/Dashboard/AdminDashboard/UsersPage";

// Courses
import BrowseCourses from "./pages/Course/BrowseCourses";
import CourseDetails from "./pages/Course/CourseDetails"; // 🔍 public preview
import CourseLearning from "./pages/Course/CourseLearning"; // 📚 student-only learning route

// Lessons
import LessonViewer from "./features/student/components/LessonViewer"; // ⬅ correct path

function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/oauth-redirect" element={<OAuthRedirect />} />

      {/* 🔐 Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<BrowseCourses />} />
        <Route path="lessons/:lessonId" element={<LessonViewer />} />
        <Route path="courses/:courseId" element={<CourseLearning />} />
      </Route>

      {/* 🔓 Public course preview route */}
      <Route path="/courses/:courseId" element={<CourseDetails />} />

      {/* 🔐 Instructor Routes */}
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

      {/* 🔐 Admin Routes */}
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
