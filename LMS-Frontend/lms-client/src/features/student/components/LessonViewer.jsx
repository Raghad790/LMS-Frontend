import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../../../services/api";
import styles from "./LessonViewer.module.css";

const LessonViewer = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${lessonId}`);
        setLesson(res.data);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) return <div className={styles.loader}>Loading...</div>;
  if (!lesson) return <div className={styles.error}>Lesson not found.</div>;

  return (
    <div className={styles.viewer}>
      <h1 className={styles.title}>{lesson.title}</h1>

      {lesson.video_url ? (
        <div className={styles.videoWrapper}>
          <iframe
            src={lesson.video_url}
            title="Lesson Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : null}

      {lesson.content && (
        <div className={styles.markdown}>
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
