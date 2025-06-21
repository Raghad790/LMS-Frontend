import { useState } from "react";
import { useStudentCourses } from "../../../features/student/hooks/useStudentCourses";
import styles from "./Main.module.css";
import { CircularProgress } from "@mui/material";
import CourseCard from "../../../features/student/components/CourseCard";
import  useAuth from "../../../hooks/useAuth";
import CoursePreviewSidebar from "../../../features/student/components/CoursePreviewSidebar";

const Main = () => {
  const { user } = useAuth();
  const { courses, loading } = useStudentCourses();
  const [activeTab, setActiveTab] = useState("active");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const userName =
    user?.name || user?.fullName || user?.email?.split("@")[0] || "Learner";

  const activeCourses = courses.filter((c) => !c.completed);
  const completedCourses = courses.filter((c) => c.completed);
  const displayedCourses =
    activeTab === "active" ? activeCourses : completedCourses;

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎓 Welcome back, {userName}!</h1>
        <p className={styles.subtitle}>
          Let’s continue learning with your courses below.
        </p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "active" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "completed" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      ) : displayedCourses.length === 0 ? (
        <p className={styles.empty}>No courses found.</p>
      ) : (
        <div className={styles.grid}>
          {displayedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => setSelectedCourse(course)}
            />
          ))}
        </div>
      )}

      {/* Course Preview Sidebar */}
      <CoursePreviewSidebar
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </section>
  );
};

export default Main;
