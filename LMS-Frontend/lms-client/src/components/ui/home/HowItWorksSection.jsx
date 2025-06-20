import styles from "./HowItWorksSection.module.css";
import { Search, BookOpen, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Find Your Course",
      description: "Browse our extensive library of expert-led courses and choose the perfect one for your learning goals.",
      color: "#7f56da"
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Learn at Your Pace",
      description: "Access course content anytime, anywhere. Learn at your own convenience with our flexible online platform.",
      color: "#56c2da"
    },
    {
      id: 3,
      icon: Award,
      title: "Get Certified",
      description: "Complete your coursework, pass assessments, and earn a verified certificate to showcase your new skills.",
      color: "#ea6fb8"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>SIMPLE PROCESS</span>
          <h2 className={styles.title}>How Khatwa Works</h2>
          <p className={styles.subtitle}>
            Our learning platform makes it easy to enhance your skills and achieve your goals
          </p>
        </div>
        
        <div className={styles.stepsWrapper}>
          <div className={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div key={step.id} className={styles.stepCard}>
                <div className={styles.stepNumber} style={{ backgroundColor: step.color }}>
                  {step.id}
                </div>
                
                <div className={styles.stepContent}>
                  <div 
                    className={styles.iconWrapper}
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    <step.icon size={28} />
                  </div>
                  
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={styles.connector}>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.0566 6.00008L13 0.333417L13 11.6667L19.0566 6.00008ZM0.5 7.00008L14 7.00008L14 5.00008L0.5 5.00008L0.5 7.00008Z" fill="#DDD"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.actionContainer}>
          <Link to="/register" className={styles.actionBtn}>
            Get Started Today <ArrowRight size={16} className={styles.btnIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;