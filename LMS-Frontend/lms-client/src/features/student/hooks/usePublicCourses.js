// usePublicCourses.js
import { useEffect, useState } from "react";
import api from "../../../services/api";

export const usePublicCourses = (limit = null) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses", {
          params: limit ? { limit } : {},
        });

        const normalized = res.data.courses.map((c) => ({
          ...c,
          instructor: { name: c.instructor_name },
          category: { name: c.category_name, id: c.category_id },
        }));

        setCourses(normalized);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [limit]);

  return { courses, loading };
};
