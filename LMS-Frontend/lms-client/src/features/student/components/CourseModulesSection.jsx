import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import styles from "./CourseModulesSection.module.css";

const CourseModulesSection = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      try {
        const [courseRes, modulesRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/courses/${courseId}/modules`),
        ]);
        setCourse(courseRes.data);
        setModules(modulesRes.data);
      } catch (err) {
        console.error("Failed to fetch course/modules", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndModules();
  }, [courseId]);

  const toggleModule = (moduleId) => {
    setExpanded((prev) => (prev === moduleId ? null : moduleId));
  };

  if (loading) return <p className={styles.loading}>Loading course details...</p>;
  if (!course) return <p className={styles.error}>Course not found.</p>;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.subtitle}>{course.description}</p>
      </header>

      <div className={styles.moduleList}>
        {modules.map((module) => (
          <div key={module.id} className={styles.moduleBox}>
            <button
              className={styles.moduleHeader}
              onClick={() => toggleModule(module.id)}
            >
              <span>{module.title}</span>
              <span className={styles.toggleIcon}>
                {expanded === module.id ? "-" : "+"}
              </span>
            </button>
            {expanded === module.id && (
              <ul className={styles.lessons}>
                {module.lessons?.map((lesson) => (
                  <li key={lesson.id} className={styles.lessonItem}>
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                    <span className={styles.type}>{lesson.type}</span>
                  </li>
                )) || <li className={styles.noLessons}>No lessons found.</li>}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseModulesSection;
