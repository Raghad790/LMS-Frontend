import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/LoginPage/Login';
import Register from './pages/Auth/RegisterPage/Register';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import InstructorDashboard from './pages/Dashboard/InstructorDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout/DashboardLayout';
import Home from './pages/Home/Home';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Home />} />

      {/* Student Dashboard (with layout + nested routing) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        {/* Future nested routes for student */}
        {/* <Route path="courses" element={<StudentCourses />} /> */}
        {/* <Route path="assignments" element={<StudentAssignments />} /> */}
      </Route>

      {/* Instructor dashboard */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute role="instructor">
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
