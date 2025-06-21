import { useState, useEffect, useRef } from "react";
import styles from "./TestimonialsSection.module.css";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import pic1 from "../../../assets/images/omar.jpg";
import pic2 from "../../../assets/images/lelia.jpg";
import pic3 from "../../../assets/images/faisel.jpg";

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Omar Al-Farsi",
      role: "Full-stack Developer",
      company: "Tech Innovate",
      image: pic1,
      text: "The web development courses on Khatwa completely transformed my career. The instructors explain complex concepts in a way that's easy to understand, and the hands-on projects prepared me for real-world challenges.",
      rating: 5,
      course: "Advanced React & Node.js Bootcamp",
    },
    {
      id: 2,
      name: "Leila Nasser",
      role: "UX Designer",
      company: "Creative Solutions",
      image: pic2,
      text: "The UX/UI design courses on Khatwa helped me transition from graphic design to UX. The curriculum is comprehensive and up-to-date with industry standards. I especially appreciated the portfolio projects and personalized feedback from instructors.",
      rating: 5,
      course: "Complete UX/UI Design Masterclass",
    },
    {
      id: 3,
      name: "Faisal Ibrahim",
      role: "Data Analyst",
      company: "Data Metrics",
      image: pic3,
      text: "As someone with zero background in data science, I was worried the content would be over my head. But Khatwa's step-by-step approach made the learning process accessible and engaging. The instructors are responsive and supportive.",
      rating: 4,
      course: "Data Science Fundamentals",
    },
  ];

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.2 }
    );

    // Store the ref value in a variable inside the effect
    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      // Use the stored reference value in the cleanup function
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Add animation class when changing testimonials
  useEffect(() => {
    setAnimationClass("fadeIn");
    const timer = setTimeout(() => {
      setAnimationClass("");
    }, 500);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Auto-rotate testimonials when in view
  useEffect(() => {
    if (isInView && autoplayEnabled) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 8000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isInView, autoplayEnabled, testimonials.length]);

  const handlePrevious = () => {
    setAutoplayEnabled(false);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

    // Re-enable autoplay after user interaction
    setTimeout(() => {
      setAutoplayEnabled(true);
    }, 10000);
  };

  const handleNext = () => {
    setAutoplayEnabled(false);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

    // Re-enable autoplay after user interaction
    setTimeout(() => {
      setAutoplayEnabled(true);
    }, 10000);
  };

  const handleIndicatorClick = (index) => {
    if (index === activeIndex) return;

    setAutoplayEnabled(false);
    setActiveIndex(index);

    // Re-enable autoplay after user interaction
    setTimeout(() => {
      setAutoplayEnabled(true);
    }, 10000);
  };

  // Calculate animation progress for the progress bar
  useEffect(() => {
    if (isInView && autoplayEnabled) {
      const interval = setInterval(() => {
        setProgressWidth((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 0.5;
        });
      }, 40); // 8000ms / 100 = 80ms per 1%, but we use 0.5% increments

      return () => clearInterval(interval);
    } else {
      setProgressWidth(0);
    }
  }, [isInView, autoplayEnabled, activeIndex]);

  // Reset progress when active index changes
  useEffect(() => {
    setProgressWidth(0);
  }, [activeIndex]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.gradientBackground}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.patternOverlay}></div>
        <div className={styles.glowCircle}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.testimonialHeader}>
          <div
            className={`${styles.headerContent} ${
              isInView ? styles.animateIn : ""
            }`}
          >
            <span className={styles.badge}>STUDENT VOICES</span>
            <h2 className={styles.title}>What Our Students Say</h2>
            <p className={styles.subtitle}>
              Read authentic reviews from our community of learners
            </p>
          </div>
        </div>

        <div className={styles.testimonialWrapper}>
          <div
            key={activeIndex}
            className={`${styles.testimonialCardWrapper} ${animationClass}`}
          >
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialCardInner}>
                <div className={styles.quoteIconWrapper}>
                  <Quote size={24} />
                </div>

                <div className={styles.testimonialRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < testimonials[activeIndex].rating
                          ? "#FFD700"
                          : "none"
                      }
                      stroke={
                        i < testimonials[activeIndex].rating
                          ? "#FFD700"
                          : "#e0e0e0"
                      }
                      className={styles.starIcon}
                    />
                  ))}
                </div>

                <blockquote className={styles.testimonialText}>
                  "{testimonials[activeIndex].text}"
                </blockquote>

                <div className={styles.courseInfo}>
                  <div className={styles.courseChip}>
                    Course: {testimonials[activeIndex].course}
                  </div>
                </div>

                <div className={styles.testimonialFooter}>
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className={styles.authorAvatar}
                  />

                  <div className={styles.authorInfo}>
                    <h3 className={styles.authorName}>
                      {testimonials[activeIndex].name}
                    </h3>
                    <p className={styles.authorTitle}>
                      {testimonials[activeIndex].role} at{" "}
                      {testimonials[activeIndex].company}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialDecor}>
                <div className={styles.decorCircle1}></div>
                <div className={styles.decorCircle2}></div>
                <div className={styles.decorLine}></div>
              </div>
            </div>
          </div>

          <div className={styles.testimonialControls}>
            <div className={styles.navigationButtons}>
              <button
                className={styles.navButton}
                onClick={handlePrevious}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className={styles.navButton}
                onClick={handleNext}
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className={styles.indicators}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${
                    index === activeIndex ? styles.activeIndicator : ""
                  }`}
                  onClick={() => handleIndicatorClick(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === activeIndex}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
