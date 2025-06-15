import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../../assets/images/logo.png';
import { Menu, X } from 'lucide-react'; // or use MUI/Iconify if preferred

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo + Name */}
       <div className={styles.brand}>
  <img src={logo} alt="Khatwa" className={styles.logo} />
  <span className={styles.name}>Khatwa</span>
</div>

        {/* Toggle Button */}
        <button className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <nav className={`${styles.nav} ${isOpen ? styles.active : ''}`}>
          <Link to="/" className={styles.link} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/courses" className={styles.link} onClick={() => setIsOpen(false)}>Courses</Link>
          <Link to="/about" className={styles.link} onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/login" className={styles.link} onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/register" className={styles.btn} onClick={() => setIsOpen(false)}>Get Started</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
