import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { CourseContext } from "./CourseContextCore";
import api from "../services/api";

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wrap MOCK_INSTRUCTOR_COURSES in useMemo to avoid re-creation on every render
  const MOCK_INSTRUCTOR_COURSES = useMemo(
    () => [
      {
        id: 1,
        title: "Introduction to React",
        description: "Learn React basics",
        thumbnail_url: "/images/default-course.jpg",
        enrollment_count: 12,
        approved: true,
      },
      {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master JavaScript patterns and best practices",
        thumbnail_url: "/images/default-course.jpg",
        enrollment_count: 8,
        approved: false,
      },
    ],
    []
  );

  const fetchPublicCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      console.log("Public courses response:", response.data);

      let coursesData = [];
      if (response.data?.courses) {
        coursesData = response.data.courses;
      } else if (response.data?.data) {
        coursesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      }

      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching public courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) {
      setEnrolledCourses([]);
      return;
    }

    try {
      setLoading(true);

      try {
        const response = await api.get("/enrollments/my-courses");
        console.log("Enrolled courses response:", response.data);

        let enrolledData = [];
        if (response.data?.enrollments) {
          enrolledData = response.data.enrollments;
        } else if (response.data?.data) {
          enrolledData = response.data.data;
        } else if (Array.isArray(response.data)) {
          enrolledData = response.data;
        }

        setEnrolledCourses(enrolledData);
      } catch (error) {
        console.error("Error with my-courses endpoint:", error.message);

        if (user.id) {
          try {
            const response = await api.get(`/enrollments/user/${user.id}`);
            console.log(
              "Alternative enrolled courses response:",
              response.data
            );

            let enrolledData = [];
            if (response.data?.enrollments) {
              enrolledData = response.data.enrollments;
            } else if (response.data?.data) {
              enrolledData = response.data.data;
            } else if (Array.isArray(response.data)) {
              enrolledData = response.data;
            }

            setEnrolledCourses(enrolledData);
          } catch (innerError) {
            console.error(
              "Error with user-specific enrollments:",
              innerError.message
            );
            setEnrolledCourses([]);
          }
        } else {
          setEnrolledCourses([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user]);
const fetchInstructorCourses = useCallback(async () => {
  if (!user || user.role !== "instructor") {
    setInstructorCourses([]);
    return;
  }

  try {
    setLoading(true);
    console.log("Fetching instructor courses for user ID:", user.id);
    
    const response = await api.get("/courses/me/mine");
    console.log("Instructor courses response:", response.data);
    
    let instructorData = [];
    if (response.data?.courses) {
      instructorData = response.data.courses;
    } else if (response.data?.data) {
      instructorData = response.data.data;
    } else if (Array.isArray(response.data)) {
      instructorData = response.data;
    }
    
    setInstructorCourses(instructorData.length > 0 ? instructorData : []);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    setInstructorCourses([]);
  } finally {
    setLoading(false);
  }
}, [user]);

  const enrollInCourse = async (courseId) => {
    if (!user) {
      toast.error("Please log in to enroll in courses");
      return;
    }

    try {
      await api.post(`/courses/${courseId}/enroll/${user.id}`);
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
      if (user.role === "student") {
        fetchEnrolledCourses();
      } else if (user.role === "instructor") {
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
    enrollInCourse,
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};
