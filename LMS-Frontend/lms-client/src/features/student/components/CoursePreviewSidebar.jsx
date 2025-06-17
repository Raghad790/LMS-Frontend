import styles from "./CoursePreviewSidebar.module.css";

const CoursePreviewSidebar = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <aside className={styles.sidebar}>
      <button onClick={onClose} className={styles.closeBtn}>×</button>
      <img src={course.thumbnail_url} alt={course.title} className={styles.image} />
      <h3 className={styles.title}>{course.title}</h3>
      <p className={styles.description}>{course.description}</p>

      <div className={styles.details}>
        <p><strong>Progress:</strong> {course.progress || 0}%</p>
        <p><strong>Lessons:</strong> {course.lessonsCount || "?"}</p>
        <p><strong>Level:</strong> {course.level || "N/A"}</p>
      </div>
    </aside>
  );
};

export default CoursePreviewSidebar;
