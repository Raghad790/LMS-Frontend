import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>403 - Unauthorized</h2>
      <p className={styles.message}>
        You do not have permission to access this page.
      </p>
      <Link to="/login" className={styles.button}>
        Return to Login
      </Link>
    </div>
  );
};

export default Unauthorized;
