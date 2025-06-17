import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./CourseDetailsView.module.css";
import api from "../../../services/api";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";

const CourseDetailsView = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        const courseData = {
          ...res.data.course,
          instructor: { name: res.data.course.instructor_name },
          category: { name: res.data.course.category_name },
        };
        setCourse(courseData);

        // Check if enrolled
        if (user?.id) {
          const statusRes = await api.get(
            `/courses/${courseId}/enrollments/${user.id}/status`
          );
          setEnrolled(statusRes.data?.enrolled === true);
        }
      } catch (err) {
        console.error("Course fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, user]);

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${courseId}/enroll/${user.id}`);
      alert("Enrolled successfully!");
      setEnrolled(true);
      navigate(`/dashboard/courses/${courseId}`);
    } catch (err) {
      console.log(err);
      alert("Enrollment failed or already enrolled.");
    }
  };

  if (loading) return <div className={styles.loading}><CircularProgress /></div>;

  if (!course) return <div className={styles.error}>Course not found.</div>;

  return (
    <div className={styles.container}>
      <img src={course.thumbnail_url || "/images/default-course.jpg"} alt={course.title} className={styles.thumbnail} />

      <div className={styles.info}>
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.instructor}>Instructor: <strong>{course.instructor?.name}</strong></p>
        <p className={styles.category}>Category: <span>{course.category?.name}</span></p>
        <p className={styles.description}>{course.description}</p>

        {!enrolled && user?.role === "student" && (
          <button className={styles.enrollBtn} onClick={handleEnroll}>
            Enroll Now
          </button>
        )}

        {enrolled && (
          <button className={styles.continueBtn} onClick={() => navigate(`/dashboard/courses/${courseId}`)}>
            Continue Course →
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsView;
