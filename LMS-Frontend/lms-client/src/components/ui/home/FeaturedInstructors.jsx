import { useState, useEffect } from "react";
import styles from "./FeaturedInstructors.module.css";
import { Star, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedInstructors = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const instructors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Web Development Expert",
      image: "https://via.placeholder.com/300x300",
      rating: 4.9,
      students: 5240,
      courses: 12,
      bio: "Full-stack developer with 10+ years of industry experience",
    },
    {
      id: 2,
      name: "Prof. Ahmed Hassan",
      title: "UX Design Specialist",
      image: "https://via.placeholder.com/300x300",
      rating: 4.8,
      students: 4100,
      courses: 8,
      bio: "Award-winning designer with expertise in user experience",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      title: "Data Science Instructor",
      image: "https://via.placeholder.com/300x300",
      rating: 4.9,
      students: 6300,
      courses: 10,
      bio: "Data scientist with experience at top tech companies",
    },
    {
      id: 4,
      name: "Dr. Michael Chen",
      title: "AI & Machine Learning",
      image: "https://via.placeholder.com/300x300",
      rating: 4.7,
      students: 3850,
      courses: 6,
      bio: "PhD in Computer Science specializing in artificial intelligence",
    },
    {
      id: 5,
      name: "Laila Mahmoud",
      title: "Mobile App Development",
      image: "https://via.placeholder.com/300x300",
      rating: 4.8,
      students: 4700,
      courses: 9,
      bio: "iOS and Android developer with 8+ years of experience",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVisibleCount = () => {
    if (windowWidth >= 1200) return 4;
    if (windowWidth >= 992) return 3;
    if (windowWidth >= 576) return 2;
    return 1;
  };

  const visibleCount = getVisibleCount();
  const maxSlide = Math.max(0, instructors.length - visibleCount);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < maxSlide ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <span className={styles.badge}>OUR EXPERT INSTRUCTORS</span>
            <h2 className={styles.title}>Learn from the Best in the Field</h2>
            <p className={styles.subtitle}>
              Our instructors are industry experts with years of practical
              experience
            </p>
          </div>

          <div className={styles.controls}>
            <button
              className={`${styles.controlBtn} ${
                currentSlide === 0 ? styles.disabled : ""
              }`}
              onClick={prevSlide}
              disabled={currentSlide === 0}
              aria-label="Previous instructors"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              className={`${styles.controlBtn} ${
                currentSlide === maxSlide ? styles.disabled : ""
              }`}
              onClick={nextSlide}
              disabled={currentSlide === maxSlide}
              aria-label="Next instructors"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div
          className={styles.instructorsTrack}
          style={{
            transform: `translateX(-${currentSlide * (100 / visibleCount)}%)`,
            width: `${(instructors.length / visibleCount) * 100}%`,
          }}
        >
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className={styles.instructorCard}
              style={{ width: `${(100 / instructors.length) * visibleCount}%` }}
            >
              <div className={styles.cardInner}>
                <div className={styles.imageWrapper}>
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className={styles.instructorImage}
                  />
                </div>

                <div className={styles.instructorInfo}>
                  <h3 className={styles.instructorName}>{instructor.name}</h3>
                  <p className={styles.instructorTitle}>{instructor.title}</p>
                  <p className={styles.instructorBio}>{instructor.bio}</p>

                  <div className={styles.ratingWrapper}>
                    <div className={styles.rating}>
                      <Star size={16} className={styles.starIcon} />
                      <span>{instructor.rating}</span>
                    </div>
                    <div className={styles.statsDivider}></div>
                    <div className={styles.courseCount}>
                      <span>{instructor.courses}</span> Courses
                    </div>
                  </div>

                  <div className={styles.stats}>
                    <div className={styles.studentsCount}>
                      <span>{instructor.students.toLocaleString()}</span>{" "}
                      Students
                    </div>
                  </div>

                  <Link
                    to={`/instructors/${instructor.id}`}
                    className={styles.viewProfileBtn}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.allInstructorsBtn}>
          <Link to="/instructors" className={styles.viewAllBtn}>
            View All Instructors{" "}
            <ArrowRight size={16} className={styles.btnIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedInstructors;
