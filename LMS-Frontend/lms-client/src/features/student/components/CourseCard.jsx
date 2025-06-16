import { useNavigate } from "react-router-dom";
import styles from "./CourseCard.module.css";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img
          src={course.thumbnail_url || "/images/default-course.jpg"}
          alt={course.title}
          className={styles.thumbnail}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>
          {course.description?.slice(0, 120) || "No description provided."}
        </p>
        <button
          className={styles.viewButton}
          onClick={() => navigate(`/dashboard/courses/${course.id}`)}
        >
          Continue Learning →
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
