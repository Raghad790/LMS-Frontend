import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import heroImage from "../../assets/images/Hero-sec.png";

const Home = () => {
  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div className={styles.text}>
          <h1>
            Find Your <span>Perfect</span> Courses & Improve Your Skills
          </h1>
          <p>Khatwa — Guiding Your First Step to Greatness</p>
          <div className={styles.actions}>
            <Link to="/register" className={styles.primary}>
              Explore Courses
            </Link>
            <Link to="/login" className={styles.secondary}>
              Log In
            </Link>
          </div>
        </div>
        <div className={styles.image}>
          <img src={heroImage} alt="Student" />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
