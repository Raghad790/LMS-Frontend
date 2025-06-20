// src/contexts/CourseContextCore.jsx
import { createContext } from "react";

export const CourseContext = createContext({
  courses: [],
  enrolledCourses: [],
  instructorCourses: [],
  loading: true,
  fetchPublicCourses: () => {},
  fetchEnrolledCourses: () => {},
  fetchInstructorCourses: () => {},
  enrollInCourse: () => {}
});