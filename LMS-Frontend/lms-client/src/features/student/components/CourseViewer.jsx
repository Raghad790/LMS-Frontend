import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import styles from "./CourseViewer.module.css";

const CourseViewer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await api.get(`/courses/${courseId}`);
        setCourse(courseRes.data);

        const modulesRes = await api.get(`/courses/${courseId}/modules`);
        const fetchedModules = modulesRes.data;
        setModules(fetchedModules);

        const lessonsMap = {};
        for (const module of fetchedModules) {
          const lessonsRes = await api.get(`/modules/${module.id}/lessons`);
          lessonsMap[module.id] = lessonsRes.data;
        }
        setLessons(lessonsMap);
      } catch (err) {
        console.error("Failed to load course details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) return <div className={styles.loading}>Loading course...</div>;
  if (!course) return <div className={styles.error}>Course not found</div>;

  return (
    <div className={styles.courseContainer}>
      <div className={styles.header}>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>

      {modules.map((mod) => (
        <div key={mod.id} className={styles.module}>
          <h3 className={styles.moduleTitle}>{mod.title}</h3>
          <ul className={styles.lessonList}>
            {(lessons[mod.id] || []).map((lesson) => (
              <li key={lesson.id} className={styles.lessonItem}>
                {lesson.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CourseViewer;
