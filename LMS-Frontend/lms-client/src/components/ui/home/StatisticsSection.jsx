import { useState, useEffect, useRef, useMemo } from "react";
import styles from "./StatisticsSection.module.css";
import { BookOpen, Users, Award, Globe } from "lucide-react";

const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Wrap stats array in useMemo to avoid re-creation on every render
  const stats = useMemo(
    () => [
      {
        id: 1,
        icon: BookOpen,
        value: 250,
        suffix: "+",
        label: "Courses",
        color: "#7f56da",
      },
      {
        id: 2,
        icon: Users,
        value: 10000,
        suffix: "+",
        label: "Active Students",
        color: "#ea6fb8",
      },
      {
        id: 3,
        icon: Award,
        value: 15,
        suffix: "+",
        label: "Years Experience",
        color: "#56c2da",
      },
      {
        id: 4,
        icon: Globe,
        value: 120,
        suffix: "+",
        label: "Countries Reached",
        color: "#dac156",
      },
    ],
    []
  );

  const [counts, setCounts] = useState(stats.map(() => 0));

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current; // Copy ref to a stable variable
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const frameRate = 20; // update every 20ms
    const totalFrames = duration / frameRate;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);

      setCounts(stats.map((stat) => Math.floor(progress * stat.value)));

      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isVisible, stats]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.shapesContainer}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>OUR IMPACT</span>
          <h2 className={styles.title}>We're Growing Every Day</h2>
          <p className={styles.subtitle}>
            Join thousands of students from around the world who are already
            learning with Khatwa
          </p>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={stat.id} className={styles.statCard}>
              <div
                className={styles.iconWrapper}
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                <stat.icon size={28} />
              </div>

              <div className={styles.statValue}>
                {isVisible ? (
                  <>
                    <span className={styles.number}>
                      {counts[index].toLocaleString()}
                    </span>
                    <span className={styles.suffix}>{stat.suffix}</span>
                  </>
                ) : (
                  <>
                    <span className={styles.number}>0</span>
                    <span className={styles.suffix}>{stat.suffix}</span>
                  </>
                )}
              </div>

              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
