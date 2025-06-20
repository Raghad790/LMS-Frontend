// src/features/students/components/CourseCard.jsx - MODIFIED EXAMPLE
import React from "react";
import { Link } from "react-router-dom";
import styles from "./CourseCard.module.css";

const CourseCard = ({ course }) => {
  return (
    <div className={styles.courseCard}>
      <img 
        src={course.thumbnail_url || "/images/default-course.jpg"} 
        alt={course.title} 
        className={styles.thumbnail} 
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{course.title}</h3>
        <div className={styles.meta}>
          <span className={styles.instructor}>
            By {course.instructor_name || "Unknown Instructor"}
          </span>
          <span className={styles.category}>
            {course.category_name || "Uncategorized"}
          </span>
          <span className={styles.level}>
            {course.level || "All Levels"}
          </span>
        </div>
        <div className={styles.stats}>
          <span className={styles.enrollment}>
            {course.enrollments_count || 0} students enrolled
          </span>
          {/* Price tag replaced with free tag */}
          <span className={styles.freeTag}>Free</span>
        </div>
        <div className={styles.actions}>
          <Link to={`/dashboard/instructor/courses/edit/${course.id}`} className={styles.editButton}>
            Edit Course
          </Link>
          <Link to={`/dashboard/instructor/courses/${course.id}/modules`} className={styles.manageButton}>
            Manage Content
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;