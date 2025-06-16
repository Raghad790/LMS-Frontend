import { useEffect, useState } from "react";
// import api from "../../../services/api"; // ✅ Your axios instance

export const useStudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Comment out the API call for now and use mock data
        // const { data } = await api.get("/enrollments/my-courses");
        // setCourses(data);
        
        // Mock data for development
        const mockCourses = [
          {
            id: 1,
            title: "UI/UX Design Fundamentals",
            description: "Learn the core principles of beautiful and functional UI design.",
            thumbnail_url: "https://via.placeholder.com/400x200.png?text=UI+Design",
          },
          {
            id: 2,
            title: "JavaScript Essentials",
            description: "Master the basics of JavaScript programming from scratch.",
            thumbnail_url: "https://via.placeholder.com/400x200.png?text=JavaScript",
          },
          {
            id: 3,
            title: "React for Beginners",
            description: "Build interactive UIs using React and its core concepts.",
            thumbnail_url: "https://via.placeholder.com/400x200.png?text=React",
          },
        ];
        
        setCourses(mockCourses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading };
};