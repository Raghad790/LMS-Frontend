import { usePublicCourses } from "../../../features/student/hooks/usePublicCourses";
import styles from "./HomeCoursesSection.module.css";
import CourseCard from "../../../features/student/components/CourseCard";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

const HomeCoursesSection = () => {
  const { courses, loading } = usePublicCourses(4);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>✨ Popular Courses</h2>
      <p className={styles.subtitle}>Boost your skills with expert-led online courses</p>

      {loading ? (
        <div className={styles.loader}><CircularProgress /></div>
      ) : (
        <div className={styles.grid}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} actionLabel="Continue →" />
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <Link to="/dashboard/courses" className={styles.viewAllBtn}>
          View All Courses
        </Link>
      </div>
    </section>
  );
};

export default HomeCoursesSection;
