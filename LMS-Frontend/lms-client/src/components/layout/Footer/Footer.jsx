import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../../../assets/images/logo.png';
import googlepay from '../../../assets/images/google pay.jpg';
import appstore from '../../../assets/images/appstore.png';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight } from 'lucide-react';


const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Column 1 - About */}
            <div className={styles.footerCol}>
              <div className={styles.brand}>
                <img src={logo} alt="Khatwa" className={styles.logo} />
                <h3 className={styles.name}>Khatwa</h3>
              </div>
              <p className={styles.description}>
                Guiding Your First Step to Greatness. A modern learning management system designed to help you achieve your educational goals.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                <a href="#" aria-label="Youtube"><Youtube size={18} /></a>
              </div>
            </div>
            
            {/* Column 2 - Explore */}
            <div className={styles.footerCol}>
              <h4>Explore</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <ArrowRight size={14} />
                  <Link to="/courses">All Courses</Link>
                </li>
                <li>
                  <ArrowRight size={14} />
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <ArrowRight size={14} />
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            
            {/* Column 3 - Popular Courses */}
            <div className={styles.footerCol}>
              <h4>Popular Courses</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <ArrowRight size={14} />
                  <Link to="/course/web-development">Web Development</Link>
                </li>
                <li>
                  <ArrowRight size={14} />
                  <Link to="/course/ux-design">UX Design</Link>
                </li>
                <li>
                  <ArrowRight size={14} />
                  <Link to="/course/marketing">Digital Marketing</Link>
                </li>
                <li>
                  <ArrowRight size={14} />
                  <Link to="/course/data-science">Data Science</Link>
                </li>
                <li>
                  <ArrowRight size={14} />
                  <Link to="/course/mobile-apps">Mobile App Development</Link>
                </li>
              </ul>
            </div>
            
            {/* Column 4 - Contact */}
            <div className={styles.footerCol}>
              <h4>Contact Us</h4>
              <ul className={styles.contactList}>
                <li>
                  <MapPin size={18} />
                  <span>123 Education St., Amman, Jordan</span>
                </li>
                <li>
                  <Phone size={18} />
                  <a href="tel:+962123456789">+962-123-456-789</a>
                </li>
                <li>
                  <Mail size={18} />
                  <a href="mailto:support@khatwa.com">support@khatwa.com</a>
                </li>
              </ul>
              
              <div className={styles.appButtons}>
                <a href="#" className={styles.appBtn}>
                  <img src={appstore} alt="App Store" />
                </a>
                <a href="#" className={styles.appBtn}>
                  <img src={googlepay} alt="Google Play" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className={styles.copyrightBar}>
        <div className={styles.container}>
          <p>© {new Date().getFullYear()} Khatwa LMS. All rights reserved.</p>
          <div className={styles.footerNav}>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/help">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;