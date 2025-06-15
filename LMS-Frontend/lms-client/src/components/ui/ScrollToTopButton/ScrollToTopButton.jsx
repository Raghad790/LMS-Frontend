import  { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react'; 
import styles from './ScrollToTopButton.module.css';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return visible ? (
    <button onClick={scrollToTop} className={styles.scrollBtn}>
      <ArrowUp size={18} />
    </button>
  ) : null;
};

export default ScrollToTopButton;
