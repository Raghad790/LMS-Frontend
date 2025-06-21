import styles from "./FeaturedInstructors.module.css";
import { Star, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import instru1 from "../../../assets/images/instructor01.jpg";
import instru2 from "../../../assets/images/instructor02.jpg";
import instru3 from "../../../assets/images/instructor03.jpg";
const FeaturedInstructors = () => {
  const instructors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Web Development Expert",

      image: instru1,
      rating: 4.9,
      students: 5240,
      courses: 12,
      expertise: ["React", "Node.js", "JavaScript"],
    },
    {
      id: 2,
      name: "Prof. Ahmed Hassan",
      title: "UX Design Specialist",
      image: instru2,
      rating: 4.8,
      students: 4100,
      courses: 8,
      expertise: ["UI/UX", "Figma", "User Research"],
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      title: "AI & Machine Learning",
      image: instru3,
      rating: 4.7,
      students: 3850,
      courses: 6,
      expertise: ["AI", "Deep Learning", "TensorFlow"],
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.badge}>OUR EXPERT INSTRUCTORS</span>
            <h2 className={styles.title}>Learn from Industry Leaders</h2>
            <p className={styles.subtitle}>
              Our instructors are experienced professionals who bring real-world
              expertise to every course, helping you master in-demand skills
            </p>
          </div>
        </div>

        <div className={styles.instructorsGrid}>
          {instructors.map((instructor) => (
            <div key={instructor.id} className={styles.instructorCard}>
              <div className={styles.cardContent}>
                <div className={styles.profileSection}>
                  <div className={styles.profileImageWrapper}>
                    {/* Fallback in case image doesn't load */}
                    <div className={styles.profileImageFallback}>
                      {instructor.name.charAt(0)}
                    </div>
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className={styles.profileImage}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.previousSibling.style.display = "flex";
                      }}
                    />
                  </div>

                  <div className={styles.instructorMeta}>
                    <h3 className={styles.instructorName}>{instructor.name}</h3>
                    <p className={styles.instructorTitle}>{instructor.title}</p>
                  </div>
                </div>
                <div className={styles.statsSection}>
                  <div className={styles.statItem}>
                    <Star size={18} className={styles.statIcon} />
                    <span className={styles.statValue}>
                      {instructor.rating}
                    </span>
                  </div>

                  <div className={styles.statItem}>
                    <BookOpen size={18} className={styles.statIcon} />
                    <span className={styles.statValue}>
                      {instructor.courses} Courses
                    </span>
                  </div>

                  <div className={styles.statItem}>
                    <Users size={18} className={styles.statIcon} />
                    <span className={styles.statValue}>
                      {instructor.students.toLocaleString()} Students
                    </span>
                  </div>
                </div>
                <div className={styles.expertiseSection}>
                  <div className={styles.expertiseTags}>
                    {instructor.expertise.map((skill, i) => (
                      <span key={i} className={styles.expertiseTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>{" "}
                <div className={styles.cardFooter}>
                  <Link to="/courses" className={styles.coursesButton}>
                    <span className={styles.coursesButtonText}>
                      Explore Courses
                    </span>
                    <span className={styles.coursesButtonIcon}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedInstructors;
