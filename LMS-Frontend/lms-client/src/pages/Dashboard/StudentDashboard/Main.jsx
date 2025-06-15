import styles from "./Main.module.css";
import { useStudentCourses } from "../../../features/student/hooks/useStudentCourses";
import CourseCard from "../../../features/student/components/CourseCard";
import { CircularProgress, Typography } from "@mui/material";

const Main = () => {
  const { courses, loading } = useStudentCourses();

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Welcome Back! 🎓</h2>
      <p className={styles.subtitle}>Here are your enrolled courses:</p>

      {loading ? (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      ) : courses.length === 0 ? (
        <Typography variant="body1">You are not enrolled in any courses yet.</Typography>
      ) : (
        <div className={styles.grid}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;
