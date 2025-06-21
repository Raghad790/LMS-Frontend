import React from 'react';
import styles from './ContactInfo.module.css';
import { Paper, Typography, Box, Button, Link } from '@mui/material';
import { 
  Phone, 
  Email, 
  LocationOn, 
  AccessTime,
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  Instagram
} from '@mui/icons-material';
import { ChatBubble } from '@mui/icons-material';

const ContactInfo = () => {
  return (
    <Paper elevation={0} className={styles.infoContainer}>
      <Typography variant="h5" component="h2" className={styles.infoTitle}>
        Contact Information
      </Typography>
      
      <Box className={styles.contactItems}>
        <Box className={styles.contactItem}>
          <div className={styles.iconWrapper}>
            <Phone fontSize="small" />
          </div>
          <div>
            <Typography variant="subtitle2" className={styles.contactLabel}>
              Call Us
            </Typography>
            <Typography variant="body1" className={styles.contactValue}>
              +1 (555) 123-4567
            </Typography>
          </div>
        </Box>
        
        <Box className={styles.contactItem}>
          <div className={styles.iconWrapper}>
            <Email fontSize="small" />
          </div>
          <div>
            <Typography variant="subtitle2" className={styles.contactLabel}>
              Email Us
            </Typography>
            <Typography variant="body1" className={styles.contactValue}>
              support@khatwa.com
            </Typography>
          </div>
        </Box>
        
        <Box className={styles.contactItem}>
          <div className={styles.iconWrapper}>
            <LocationOn fontSize="small" />
          </div>
          <div>
            <Typography variant="subtitle2" className={styles.contactLabel}>
              Visit Our Office
            </Typography>
            <Typography variant="body1" className={styles.contactValue}>
              123 Learning Street, Suite 400<br />
              San Francisco, CA 94103
            </Typography>
          </div>
        </Box>
        
        <Box className={styles.contactItem}>
          <div className={styles.iconWrapper}>
            <AccessTime fontSize="small" />
          </div>
          <div>
            <Typography variant="subtitle2" className={styles.contactLabel}>
              Business Hours
            </Typography>
            <Typography variant="body1" className={styles.contactValue}>
              Monday - Friday: 9AM - 6PM<br />
              Saturday - Sunday: Closed
            </Typography>
          </div>
        </Box>
      </Box>
      
      <Box className={styles.liveChat}>
        <Box className={styles.liveChatContent}>
          <div className={styles.liveChatIcon}>
            <ChatBubble />
          </div>
          <div>
            <Typography variant="subtitle1" className={styles.liveChatTitle}>
              Need immediate help?
            </Typography>
            <Typography variant="body2" className={styles.liveChatText}>
              Our support team is available now
            </Typography>
          </div>
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          className={styles.chatButton} 
          startIcon={<ChatBubble fontSize="small" />}
        >
          Start Live Chat
        </Button>
      </Box>
      
      <Box className={styles.socialSection}>
        <Typography variant="subtitle2" className={styles.socialTitle}>
          Connect With Us
        </Typography>
        
        <Box className={styles.socialIcons}>
          <Link href="#" className={styles.socialIcon} aria-label="Facebook">
            <Facebook fontSize="small" />
          </Link>
          <Link href="#" className={styles.socialIcon} aria-label="Twitter">
            <Twitter fontSize="small" />
          </Link>
          <Link href="#" className={styles.socialIcon} aria-label="LinkedIn">
            <LinkedIn fontSize="small" />
          </Link>
          <Link href="#" className={styles.socialIcon} aria-label="Instagram">
            <Instagram fontSize="small" />
          </Link>
          <Link href="#" className={styles.socialIcon} aria-label="YouTube">
            <YouTube fontSize="small" />
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default ContactInfo;