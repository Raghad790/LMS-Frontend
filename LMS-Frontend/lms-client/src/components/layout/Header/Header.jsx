import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../../assets/images/logo.png";
import { Menu, X, Search, Phone, Mail, ChevronDown, User } from "lucide-react"; 
import useAuth from "../../../hooks/useAuth"; 

const Header = () => {
  const { user } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.contactInfo}>
            <a href="tel:+18001234567" className={styles.contactLink}>
              <Phone size={16} /> Call us: +1(800) 123 4567
            </a>
            <a href="mailto:support@khatwa.com" className={styles.contactLink}>
              <Mail size={16} /> Email us: support@khatwa.com
            </a>
          </div>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIcon}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className={styles.socialIcon}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className={styles.socialIcon}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className={styles.socialIcon}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    
      {/* Main Header */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo + Name */}
          <div className={styles.brand}>
            <img src={logo} alt="Khatwa" className={styles.logo} />
            <span className={styles.name}>Khatwa</span>
          </div>

          {/* Toggle Button */}
          <button className={styles.toggle} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links */}
          <nav className={`${styles.nav} ${isOpen ? styles.active : ""}`}>
            <Link to="/" className={styles.link} onClick={() => setIsOpen(false)}>
              Home <ChevronDown size={16} className={styles.dropdownIcon} />
            </Link>

            <Link to="/courses" className={styles.link} onClick={() => setIsOpen(false)}>
              Courses <ChevronDown size={16} className={styles.dropdownIcon} />
            </Link>

            <Link to="/about" className={styles.link} onClick={() => setIsOpen(false)}>
              About
            </Link>

            <Link to="/contact" className={styles.link} onClick={() => setIsOpen(false)}>
              Contact
            </Link>

            <div className={styles.actionButtons}>
              <button className={styles.iconBtn} aria-label="Search">
                <Search size={20} />
              </button>

              {!user ? (
                <Link to="/login" className={styles.loginBtn} onClick={() => setIsOpen(false)}>
                  <User size={18} /> Log in / Sign up
                </Link>
              ) : (
                <Link to="/dashboard" className={styles.dashboardBtn} onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              )}

              <Link to={user ? "/dashboard/courses" : "/register"} className={styles.btn} onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;