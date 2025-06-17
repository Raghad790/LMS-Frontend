import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./InstructorCourseManager.module.css";

const InstructorCourseManager = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/courses/me/mine", {
          withCredentials: true,
        });
        setCourses(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch your courses");
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  const handleCreateCourse = () => {
    navigate("/dashboard/instructor/courses/create");
  };

  const handleEditCourse = (courseId) => {
    navigate(`/dashboard/instructor/courses/edit/${courseId}`);
  };

  return (
    <div className={styles.courseManager}>
      <div className={styles.header}>
        <h1>Manage Your Courses</h1>
        <button 
          className={styles.createButton} 
          onClick={handleCreateCourse}
        >
          Create New Course
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading your courses...</div>
      ) : courses.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven't created any courses yet.</p>
          <button 
            className={styles.createButton} 
            onClick={handleCreateCourse}
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className={styles.courseGrid}>
          {courses.map(course => (
            <div key={course.id} className={styles.courseCard}>
              <img 
                src={course.thumbnail_url || "/images/default-course.jpg"} 
                alt={course.title} 
                className={styles.thumbnail}
              />
              <div className={styles.courseInfo}>
                <h3>{course.title}</h3>
                <p className={styles.status}>
                  Status: <span>{course.approved ? "Approved" : "Pending Approval"}</span>
                </p>
                <p className={styles.students}>
                  Enrolled Students: {course.enrollment_count || 0}
                </p>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEditCourse(course.id)}
                  className={styles.editButton}
                >
                  Edit Course
                </button>
                <button
                  onClick={() => navigate(`/dashboard/instructor/courses/${course.id}/students`)}
                  className={styles.viewButton}
                >
                  View Students
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourseManager;