import { usePublicCourses } from "../../../features/student/hooks/usePublicCourses";
import styles from "./HomeCoursesSection.module.css";
import CourseCard from "../../../features/student/components/CourseCard";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Star, Users } from "lucide-react";

const HomeCoursesSection = () => {
  const { courses, loading } = usePublicCourses(4);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleWrapper}>
            <span className={styles.badge}>FEATURED COURSES</span>
            <h2 className={styles.heading}>✨ Popular Courses</h2>
            <p className={styles.subtitle}>
              Boost your skills with our expert-led online courses designed to help you succeed
            </p>
          </div>
          
          <Link to="/dashboard/courses" className={styles.browseLink}>
            Browse All Courses <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className={styles.loader}>
            <CircularProgress style={{ color: '#7f56da' }} />
          </div>
        ) : (
          <div className={styles.grid}>
            {courses.map((course) => (
              <div className={styles.courseCard} key={course.id}>
                <CourseCard course={course} actionLabel="Enroll Now →" />
                
                <div className={styles.cardOverlay}>
                  <Link to={`/dashboard/courses/${course.id}`} className={styles.overlayButton}>
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.footer}>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <BookOpen size={24} />
              <div>
                <h4>250+</h4>
                <p>Total Courses</p>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <Users size={24} />
              <div>
                <h4>10K+</h4>
                <p>Active Students</p>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <Clock size={24} />
              <div>
                <h4>1,200+</h4>
                <p>Hours of Content</p>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <Star size={24} />
              <div>
                <h4>4.9</h4>
                <p>Average Rating</p>
              </div>
            </div>
          </div>
          
          <Link to="/dashboard/courses" className={styles.viewAllBtn}>
            Explore All Courses <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCoursesSection;