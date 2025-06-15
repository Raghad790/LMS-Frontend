import styles from './Footer.module.css';

const Footer = () => {
  return (

    <footer className={styles.footer} data-aos="fade-up">
      <div className={styles.grid}>
        <div>
          <h3>Khatwa LMS</h3>
          <p>Guiding Your First Step to Greatness.</p>
        </div>
        <div>
          <h4>Courses</h4>
          <ul>
            <li>Web Dev</li>
            <li>Design</li>
            <li>Marketing</li>
          </ul>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Login</li>
            <li>Register</li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: support@khatwa.com</p>
          <p>Phone: +962-123-456</p>
        </div>
      </div>
      <p className={styles.copy}>© 2025 Khatwa LMS. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
