import { useNavigate } from "react-router-dom";
import styles from "./CourseCard.module.css";

const CourseCard = ({ course, onClick, actionLabel = "Continue →" }) => {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.stopPropagation(); // prevent sidebar trigger
    navigate(`/dashboard/courses/${course.id}`);
  };

  return (
    <div className={styles.card} onClick={() => onClick?.(course)}>
      <div className={styles.thumbnailWrapper}>
        <img
          src={course.thumbnail_url || "/images/default-course.jpg"}
          alt={course.title}
          className={styles.thumbnail}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{course.title}</h3>

        {course.instructor && (
          <p className={styles.tags}>
            Instructor: <span>{course.instructor.name}</span>
          </p>
        )}

        {course.category && (
          <p className={styles.tags}>
            Category: <span>{course.category.name}</span>
          </p>
        )}

        {course.level && (
          <p className={styles.tags}>
            Level: <span>{course.level}</span>
          </p>
        )}

        <p className={styles.description}>
          {course.description?.slice(0, 100) || "No description provided."}
        </p>

        {course.progress !== undefined && (
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        )}

        <button className={styles.viewButton} onClick={handleNavigate}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
