import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../../assets/images/logo.png";
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src={logo} alt="Khatwa Logo" className={styles.logo} />
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/courses" className={styles.link}>
            Courses
          </Link>
          <Link to="/about" className={styles.link}>
            About
          </Link>
          <Link to="/login" className={styles.link}>
            Login
          </Link>
          <Link to="/register" className={styles.btn}>
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
