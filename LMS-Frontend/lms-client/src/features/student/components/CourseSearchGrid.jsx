import { useEffect, useState } from "react";
import styles from "./CourseSearchGrid.module.css";
import api from "../../../services/api";
import CourseCard from "./CourseCard";
import {
  CircularProgress,
  TextField,
  InputAdornment,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../../hooks/useAuth";

const CourseSearchGrid = () => {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
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

  const fetchCategories = async () => {
  try {
    const res = await api.get("/categories");
    setCategories(res.data.categories || []); // ✅ access the correct array
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }
};


    fetchCourses();
    fetchCategories();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll/${user.id}`);
      alert("Enrolled successfully!");
    } catch (err) {
      console.error(err);
      alert("You might already be enrolled.");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesQuery = course.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      course.category?.id === parseInt(selectedCategory);

    return matchesQuery && matchesCategory;
  });

  return (
    <section className={styles.container}>
      <Typography variant="h4" className={styles.heading}>
        📚 Explore Our Courses
      </Typography>

      <div className={styles.controls}>
        <TextField
          placeholder="Search courses..."
          variant="outlined"
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className={styles.search}
        />

        <FormControl className={styles.categorySelect}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => handleEnroll(course.id)}
              actionLabel="Enroll"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CourseSearchGrid;
