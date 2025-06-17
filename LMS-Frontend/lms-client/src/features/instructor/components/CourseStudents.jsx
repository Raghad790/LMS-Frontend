import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./CourseStudents.module.css";

const CourseStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get course info
        const courseResponse = await axios.get(`/api/courses/${courseId}`);
        setCourse(courseResponse.data.data);
        
        // Get course enrollments
        const enrollmentsResponse = await axios.get(`/api/courses/${courseId}/enrollments`);
        setEnrollments(enrollmentsResponse.data.data || []);
      } catch (error) {
        toast.error("Failed to load student data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return <div className={styles.loading}>Loading student data...</div>;
  }

  return (
    <div className={styles.courseStudents}>
      <div className={styles.header}>
        <h1>Students Enrolled in "{course?.title}"</h1>
        <button 
          className={styles.backButton}
          onClick={() => navigate("/dashboard/instructor")}
        >
          Back to Courses
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div className={styles.empty}>
          <p>No students are currently enrolled in this course.</p>
        </div>
      ) : (
        <div className={styles.studentTable}>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Enrolled Date</th>
                <th>Progress</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enrollment => (
                <tr key={enrollment.id}>
                  <td>{enrollment.user?.name || "Unknown"}</td>
                  <td>{enrollment.user?.email || "Unknown"}</td>
                  <td>{new Date(enrollment.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progress}
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                      <span>{enrollment.progress || 0}%</span>
                    </div>
                  </td>
                  <td>{enrollment.completed ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseStudents;