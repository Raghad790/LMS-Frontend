import React from 'react';
import styles from './ContactHero.module.css';
import { Typography, Container, Box } from '@mui/material';
import { motion } from 'framer-motion';

const ContactHero = () => {
  return (
    <Box component="section" className={styles.heroSection}>
      <div className={styles.heroBackground}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.patternOverlay}></div>
      </div>
      
      <Container maxWidth="lg" className={styles.container}>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            component="span" 
            variant="caption" 
            className={styles.badge}
          >
            GET IN TOUCH
          </Typography>
          
          <Typography 
            component="h1" 
            variant="h1" 
            className={styles.title}
          >
            How Can We Help You?
          </Typography>
          
          <Typography 
            component="p" 
            variant="subtitle1" 
            className={styles.subtitle}
          >
            Our dedicated team is ready to assist you with any questions about our platform, courses, or support needs.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ContactHero;