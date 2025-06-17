import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useCourses } from "../../../hooks/useCourses";
import styles from "./InstructorDashboard.module.css";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { instructorCourses, loading } = useCourses();
  
  // Show 3 most recent courses
  const recentCourses = instructorCourses.slice(0, 3);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Instructor Dashboard</h1>
        <p>Welcome back, {user?.name || "Instructor"}!</p>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>My Courses</h3>
          <div className={styles.statValue}>{instructorCourses.length}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Total Students</h3>
          <div className={styles.statValue}>
            {instructorCourses.reduce((total, course) => 
              total + (course.enrollment_count || 0), 0)}
          </div>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Approval</h3>
          <div className={styles.statValue}>
            {instructorCourses.filter(c => !c.approved).length}
          </div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <h2>Quick Actions</h2>
        <div className={styles.actionButtons}>
          <button 
            className={styles.actionButton}
            onClick={() => navigate("/dashboard/instructor/courses/create")}
          >
            Create New Course
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => navigate("/dashboard/instructor/courses")}
          >
            Manage All Courses
          </button>
        </div>
      </div>

      <div className={styles.recentCourses}>
        <div className={styles.sectionHeader}>
          <h2>Recent Courses</h2>
          <button 
            className={styles.viewAllButton}
            onClick={() => navigate("/dashboard/instructor/courses")}
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading courses...</div>
        ) : recentCourses.length === 0 ? (
          <div className={styles.empty}>
            <p>You haven't created any courses yet.</p>
            <button 
              className={styles.createButton}
              onClick={() => navigate("/dashboard/instructor/courses/create")}
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className={styles.courseCards}>
            {recentCourses.map(course => (
              <div key={course.id} className={styles.courseCard}>
                <img 
                  src={course.thumbnail_url || "/images/default-course.jpg"}
                  alt={course.title}
                  className={styles.thumbnail}
                />
                <div className={styles.courseInfo}>
                  <h3>{course.title}</h3>
                  <p className={styles.status}>
                    Status: <span>{course.approved ? "Approved" : "Pending"}</span>
                  </p>
                  <p className={styles.students}>
                    Students: {course.enrollment_count || 0}
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => navigate(`/dashboard/instructor/courses/edit/${course.id}`)}>
                    Edit
                  </button>
                  <button onClick={() => navigate(`/dashboard/instructor/courses/${course.id}/modules`)}>
                    Modules
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;