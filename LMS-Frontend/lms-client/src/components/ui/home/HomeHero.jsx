import { useEffect } from "react";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import styles from "./HomeHero.module.css";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../../../assets/images/Hero-sec.png";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../../../hooks/useAuth";
import { ArrowRight, BookOpen, Users, Star, Award } from "lucide-react";

const HomeHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const getCtaDestination = () => {
    if (!user) return "/register";
    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "instructor":
        return "/dashboard/instructor";
      default:
        return "/dashboard";
    }
  };

  const getCtaText = () => (user ? "Go to Dashboard" : "Explore Courses");
  
  // Handler for login button click
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <Header />
      <div className={styles.heroWrapper}>
        <div className={styles.shapesContainer}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
        </div>
        
        <section className={styles.hero}>
          <div className={styles.content}>
            <div className={styles.text} data-aos="fade-right">
              <div className={styles.badge}>
                <span>🔥 Trusted by 10,000+ students worldwide</span>
              </div>
              
              <h1>
                Find Your <span className={styles.highlight}>Perfect</span> Courses & Improve Your Skills
              </h1>
              
              <p>
                Khatwa offers expert-led courses across tech, business, and personal development. 
                Start your journey to excellence with our guided learning paths.
              </p>
              
              <div className={styles.actions} data-aos="zoom-in" data-aos-delay="200">
                <Link to={getCtaDestination()} className={styles.primary}>
                  {getCtaText()} <ArrowRight size={18} />
                </Link>
                {!user && (
                  <button 
                    onClick={handleLoginClick} 
                    className={styles.secondary}
                  >
                    Log In
                  </button>
                )}
              </div>
              
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4>250+</h4>
                    <p>Online Courses</p>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h4>10K+</h4>
                    <p>Active Students</p>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <Star size={24} />
                  </div>
                  <div>
                    <h4>4.9</h4>
                    <p>Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.image} data-aos="fade-left">
              <div className={styles.imageWrapper}>
                <img src={heroImage} alt="Student Learning" />
                <div className={styles.floatingBadge}>
                  <Award size={20} />
                  <p>Certified Courses</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.wave}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#f9f9ff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,224C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeHero;