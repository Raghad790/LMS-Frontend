import CourseViewer from "../../features/student/components/CourseViewer";
import styles from "./CourseLearning.module.css";

const CourseLearning = () => {
  return (
    <div className={styles.container}>
      <CourseViewer />
    </div>
  );
};

export default CourseLearning;