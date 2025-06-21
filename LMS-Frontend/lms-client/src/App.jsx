import { Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useAuthPersistence } from "./hooks/useAuthPersistence";
// Public Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/LoginPage/Login";
import Register from "./pages/Auth/RegisterPage/Register";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import OAuthRedirect from "./pages/Auth/OAuthRedirect";
import Contact from "./pages/Contact/Contact";

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

//Instructor
// At the top of App.jsx, add these imports
import InstructorCourseManager from "./features/instructor/components/InstructorCourseManager";
import CourseEditor from "./features/instructor/components/CourseEditor";
import ModuleManager from "./features/instructor/components/ModuleManager";
import LessonEditor from "./features/instructor/components/LessonEditor";
import CourseStudents from "./features/instructor/components/CourseStudents";
import QuizBuilder from "./features/instructor/components/QuizBuilder";
import QuizManagement from "./features/instructor/components/QuizManagement";
import CourseAnalytics from "./features/instructor/components/CourseAnalytics";
import AssignmentList from "./features/instructor/components/AssignmentList";
import SubmissionList from "./features/instructor/components/SubmissionList";
import SubmissionGrading from "./features/instructor/components/SubmissionGrading";

function App() {
  const { loading, user } = useAuth();

  // Initialize auth persistence to maintain login state
  useAuthPersistence();

  // Debug auth state in App component
  console.log(
    `🔍 App rendering - Auth state: ${
      user ? "Authenticated" : "Not authenticated"
    }`
  );
  console.log(`🔍 Loading state: ${loading ? "Loading" : "Ready"}`);

  if (loading) return <div>Loading authentication...</div>;

  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/oauth-redirect" element={<OAuthRedirect />} />{" "}
      <Route path="/contact" element={<Contact />}  />
      {/* 🔐 Student Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute role="student">
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="courses" element={<BrowseCourses />} />
                <Route path="lessons/:lessonId" element={<LessonViewer />} />
                <Route path="courses/:courseId" element={<CourseLearning />} />
              </Route>
            </Routes>
          </ProtectedRoute>
        }
      />
      {/* 🔓 Public course preview route */}
      <Route path="/courses/:courseId" element={<CourseDetails />} />
      {/* 🔐 Instructor Routes */}
      <Route
        path="/dashboard/instructor/*"
        element={
          <ProtectedRoute role="instructor">
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<InstructorDashboard />} />
                <Route path="courses" element={<InstructorCourseManager />} />
                <Route path="courses/create" element={<CourseEditor />} />
                <Route
                  path="courses/edit/:courseId"
                  element={<CourseEditor />}
                />
                <Route
                  path="courses/:courseId/analytics"
                  element={<CourseAnalytics />}
                />
                <Route
                  path="courses/:courseId/students"
                  element={<CourseStudents />}
                />
                <Route
                  path="courses/:courseId/modules"
                  element={<ModuleManager />}
                />
                <Route
                  path="modules/:moduleId/lessons/create"
                  element={<LessonEditor />}
                />
                <Route
                  path="lessons/:lessonId/edit"
                  element={<LessonEditor />}
                />
                <Route
                  path="courses/:courseId/quizzes"
                  element={<QuizManagement />}
                />
                <Route
                  path="courses/:courseId/quizzes/create"
                  element={<QuizBuilder />}
                />
                <Route
                  path="courses/:courseId/quizzes/:quizId/edit"
                  element={<QuizBuilder />}
                />
                <Route
                  path="courses/:courseId/assignments"
                  element={<AssignmentList />}
                />
                <Route
                  path="assignments/:assignmentId/submissions"
                  element={<SubmissionList />}
                />
                <Route
                  path="submissions/:submissionId/grade"
                  element={<SubmissionGrading />}
                />
              </Route>
            </Routes>
          </ProtectedRoute>
        }
      />{" "}
      {/* 🔐 Admin Routes */}
      <Route
        path="/dashboard/admin/*"
        element={
          <ProtectedRoute role="admin">
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
            </Routes>
          </ProtectedRoute>
        }
      />{" "}
    </Routes>
  );
}

export default App;
