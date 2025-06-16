import { useStudentCourses } from "../../../features/student/hooks/useStudentCourses";
import styles from "./Main.module.css";
import { CircularProgress } from "@mui/material";
import CourseCard from "../../../features/student/components/CourseCard";
import { useAuth } from "../../../hooks/useAuth";

const Main = () => {
  const { courses, loading } = useStudentCourses();
  const { user } = useAuth();
  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          🎓 Welcome back{user?.name ? `, ${user.name}` : ""}!
        </h1>

        <p className={styles.subtitle}>
          Let’s continue learning with your courses below.
        </p>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      ) : courses.length === 0 ? (
        <p className={styles.empty}>You are not enrolled in any courses yet.</p>
      ) : (
        <div className={styles.grid}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Main;
