import { useEffect } from "react";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import heroImage from "../../assets/images/Hero-sec.png";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton/ScrollToTopButton";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

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

  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div className={styles.text} data-aos="fade-right">
          <h1>
            Find Your <span>Perfect</span> Courses & Improve Your Skills
          </h1>
          <p>Khatwa — Guiding Your First Step to Greatness</p>
          <div
            className={styles.actions}
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <Link to={getCtaDestination()} className={styles.primary}>
              {getCtaText()}
            </Link>
            {!user && (
              <Link to="/login" className={styles.secondary}>
                Log In
              </Link>
            )}
          </div>
        </div>
        <div className={styles.image} data-aos="fade-left">
          <img src={heroImage} alt="Student" />
        </div>
      </section>
      <Footer />
      <ScrollToTopButton />

      {/* Sticky smart CTA */}
      <Link to={getCtaDestination()} className={styles.stickyCta}>
        {getCtaText()}
      </Link>
    </>
  );
};

export default Home;
