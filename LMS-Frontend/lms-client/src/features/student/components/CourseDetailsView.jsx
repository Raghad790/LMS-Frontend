import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../services/api";
import styles from "./CourseDetailsView.module.css";
import {
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const CourseDetailsView = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessonsByModule, setLessonsByModule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, modulesRes] = await Promise.all([
          axios.get(`/courses/${courseId}`),
          axios.get(`/courses/${courseId}/modules`)
        ]);
        setCourse(courseRes.data);
        const modules = modulesRes.data;
        setModules(modules);

        const lessonsMap = {};
        await Promise.all(modules.map(async (mod) => {
          const res = await axios.get(`/modules/${mod.id}/lessons`);
          lessonsMap[mod.id] = res.data;
        }));

        setLessonsByModule(lessonsMap);
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) return <div className={styles.loader}><CircularProgress /></div>;

  return (
    <div className={styles.container}>
      <Typography variant="h4">{course?.title}</Typography>
      <Typography variant="body1">{course?.description}</Typography>

      {modules.map((module) => (
        <Accordion key={module.id} className={styles.module}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={styles.moduleTitle}>{module.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{module.description}</Typography>

            <div className={styles.lessonList}>
              {lessonsByModule[module.id]?.map((lesson) => (
                <div key={lesson.id} className={styles.lessonItem}>
                  <div className={styles.lessonTitle}>{lesson.title}</div>
                  <div className={styles.lessonType}>
                    Type: {lesson.content_type} | Duration: {lesson.duration} mins
                  </div>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default CourseDetailsView;