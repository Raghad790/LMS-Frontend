// LMS-Frontend/lms-client/src/hooks/useCourses.js
// This file ONLY exports a hook function
import { useContext } from "react";
import { CourseContext } from "../contexts/CourseContextCore";

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
}