import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage/Login";
import RegisterPage from "./pages/Auth/RegisterPage/Register";
import { checkHealth } from "./services/api";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StudentDashboard from "./pages/Student/Dashboard/Dashboard/Dashboard";

function App() {
  useEffect(() => {
    checkHealth()
      .then((data) => console.log("✅ Backend is OK:", data))
      .catch((err) => console.error("❌ Backend not reachable:", err));
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
