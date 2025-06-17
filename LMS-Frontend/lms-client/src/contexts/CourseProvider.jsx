// LMS-Frontend/lms-client/src/contexts/CourseProvider.jsx
// This file ONLY exports a component
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { CourseContext } from "./CourseContextCore";

// Provider component only
export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/courses");
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching public courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axios.get("/api/enrollments/my-courses");
      setEnrolledCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchInstructorCourses = useCallback(async () => {
    if (!user || user.role !== "instructor") return;
    
    try {
      setLoading(true);
      const response = await axios.get("/api/courses/me/mine");
      setInstructorCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const enrollInCourse = async (courseId) => {
    try {
      await axios.post(`/api/courses/${courseId}/enroll/${user.id}`);
      toast.success("Successfully enrolled in course!");
      await fetchEnrolledCourses();
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in course");
    }
  };

  useEffect(() => {
    fetchPublicCourses();
    if (user) {
      fetchEnrolledCourses();
      if (user.role === "instructor") {
        fetchInstructorCourses();
      }
    }
  }, [user, fetchPublicCourses, fetchEnrolledCourses, fetchInstructorCourses]);

  const contextValue = {
    courses,
    enrolledCourses,
    instructorCourses,
    loading,
    fetchPublicCourses,
    fetchEnrolledCourses,
    fetchInstructorCourses,
    enrollInCourse
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};