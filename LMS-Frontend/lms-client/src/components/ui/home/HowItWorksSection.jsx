import { useState, useEffect, useRef } from "react";
import styles from "./HowItWorksSection.module.css";
import { Search, BookOpen, Award, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Import images from assets folder
import how1 from "../../../assets/images/how1.jpg";
import how2 from "../../../assets/images/study.jpg";
import how3 from "../../../assets/images/certi.jpg";

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Find Your Course",
      description:
        "Browse our extensive library of expert-led courses and choose the perfect one for your learning goals.",
      color: "#7f56da",
      features: [
        "Filter by category or skill level",
        "Read detailed course descriptions",
        "Preview course curriculum",
      ],
      image: how1, // Using imported image
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Learn at Your Pace",
      description:
        "Access course content anytime, anywhere. Learn at your own convenience with our flexible online platform.",
      color: "#56c2da",
      features: [
        "Self-paced learning environment",
        "Mobile-friendly interface",
        "Downloadable resources",
      ],
      image: how2, // Using imported image
    },
    {
      id: 3,
      icon: Award,
      title: "Get Certified",
      description:
        "Complete your coursework, pass assessments, and earn a verified certificate to showcase your new skills.",
      color: "#ea6fb8",
      features: [
        "Industry-recognized certificates",
        "Share directly to LinkedIn",
        "Verify your achievements",
      ],
      image: how3, // Using imported image
    },
  ];
  // Intersection Observer to detect when section is in view for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    // Store the current value of the ref in a variable inside the effect
    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Use that same variable in the cleanup function
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Auto-cycle through steps
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % steps.length;
      });
    }, 5000);

    // Start with the first step
    if (activeStep === null) {
      setActiveStep(0);
    }

    return () => clearInterval(interval);
  }, [isInView, steps.length, activeStep]);

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.backgroundShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <span
            className={`${styles.badge} ${isInView ? styles.animateBadge : ""}`}
          >
            SIMPLE PROCESS
          </span>
          <h2
            className={`${styles.title} ${isInView ? styles.animateTitle : ""}`}
          >
            How Khatwa Works
          </h2>
          <p
            className={`${styles.subtitle} ${
              isInView ? styles.animateSubtitle : ""
            }`}
          >
            Our learning platform makes it easy to enhance your skills and
            achieve your goals
          </p>
        </div>

        <div className={styles.stepsNavigation}>
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`${styles.stepButton} ${
                activeStep === index ? styles.activeStepButton : ""
              }`}
              onClick={() => handleStepClick(index)}
              style={{
                "--step-color": step.color,
                "--step-delay": `${index * 0.2}s`,
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
              }}
              aria-label={`View step ${step.id}: ${step.title}`}
            >
              <div className={styles.stepNumber}>{step.id}</div>
              <div className={styles.stepLabel}>{step.title}</div>
            </button>
          ))}
        </div>

        <div className={styles.stepsContent}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
                background:
                  activeStep !== null
                    ? steps[activeStep].color
                    : steps[0].color,
              }}
            ></div>
          </div>

          <div className={styles.stepsCarousel}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.stepCard} ${
                  activeStep === index ? styles.activeStep : ""
                }`}
                style={{
                  "--step-color": step.color,
                  transform: `translateX(${
                    (index - (activeStep || 0)) * 100
                  }%)`,
                }}
              >
                <div className={styles.stepContent}>
                  <div
                    className={styles.iconWrapper}
                    style={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                    }}
                  >
                    <step.icon size={32} />
                  </div>

                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>

                  <ul className={styles.featuresList}>
                    {step.features.map((feature, i) => (
                      <li key={i} className={styles.featureItem}>
                        <Check size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {index === steps.length - 1 && (
                    <Link to="/register" className={styles.cta}>
                      Get Started <ArrowRight size={16} />
                    </Link>
                  )}
                </div>

                <div className={styles.visualContent}>
                  <img
                    src={step.image}
                    alt={step.title}
                    className={styles.stepImage}
                  />

                  <div
                    className={styles.stepIcon}
                    style={{ backgroundColor: step.color }}
                  >
                    <step.icon size={32} color="white" />
                  </div>

                  <div className={styles.decorativeElement}>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={styles.decorativeDot}
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          background: step.color,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.stepIndicators}>
            {steps.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  activeStep === index ? styles.activeIndicator : ""
                }`}
                onClick={() => handleStepClick(index)}
                aria-label={`Go to step ${index + 1}`}
                style={{
                  backgroundColor:
                    activeStep === index ? steps[index].color : "#ddd",
                }}
              />
            ))}
          </div>
        </div>

        <div
          className={`${styles.actionContainer} ${
            isInView ? styles.animateAction : ""
          }`}
        >
          <Link to="/register" className={styles.actionBtn}>
            Start Your Learning Journey{" "}
            <ArrowRight size={18} className={styles.btnIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
