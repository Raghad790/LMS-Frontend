import React, { useState } from 'react';
import styles from './ContactFAQ.module.css';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Box,
  Button
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your registered email address to create a new password."
  },
  {
    question: "Can I get a refund for a course I purchased?",
    answer: "Yes, we offer a 30-day money-back guarantee for most courses. If you're unsatisfied with your purchase, you can request a refund within 30 days through your account dashboard or by contacting customer support."
  },
  {
    question: "How do I become an instructor?",
    answer: "To become an instructor on our platform, visit the 'Teach on Khatwa' page and submit an application with your qualifications and proposed course outline. Our team will review your application and respond within 5-7 business days."
  },
  {
    question: "How do I access my course certificates?",
    answer: "Course certificates are available in your user dashboard under the 'My Certificates' section. They become available once you've completed all required course components with passing grades."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes, we have mobile apps available for both iOS and Android devices. You can download them from the App Store or Google Play Store to access your courses on the go, with the option for offline viewing."
  },
  {
    question: "How can I report a technical issue?",
    answer: "To report a technical issue, navigate to the Help Center from your dashboard and select 'Report a Problem.' Provide as much detail as possible about the issue, including screenshots if applicable, to help our team resolve it quickly."
  }
];

const ContactFAQ = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box component="section" className={styles.faqSection}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.faqHeader}
        >
          <Typography variant="body1" component="span" className={styles.faqBadge}>
            COMMON QUESTIONS
          </Typography>
          <Typography variant="h3" component="h2" className={styles.faqTitle}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" className={styles.faqDescription}>
            Find quick answers to common questions about our platform and services
          </Typography>
        </motion.div>

        <Grid container spacing={3} className={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.1 }}
              >
                <Accordion
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                  className={styles.accordion}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    className={styles.accordionSummary}
                  >
                    <Typography className={styles.accordionQuestion}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={styles.accordionDetails}>
                    <Typography className={styles.accordionAnswer}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box className={styles.moreHelp}>
          <Typography variant="h5" className={styles.moreHelpTitle}>
            Still have questions?
          </Typography>
          <Typography variant="body1" className={styles.moreHelpDescription}>
            Our support team is always ready to help you with any specific questions
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            className={styles.moreHelpButton}
            href="mailto:support@khatwa.com"
          >
            Contact Support
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactFAQ;