import React, { useState } from 'react';
import styles from './ContactForm.module.css';
import { 
  TextField, 
  Button, 
  MenuItem, 
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { Send } from '@mui/icons-material';

const inquiryTypes = [
  'Course Information',
  'Technical Support',
  'Billing & Payment',
  'Instructor Inquiry',
  'Partnership Opportunities',
  'Other'
];

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inquiryType: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;
    
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Name is required";
      formIsValid = false;
    }
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      formIsValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      tempErrors.email = "Email address is invalid";
      formIsValid = false;
    }
    
    if (!formData.inquiryType) {
      tempErrors.inquiryType = "Please select an inquiry type";
      formIsValid = false;
    }
    
    if (!formData.subject.trim()) {
      tempErrors.subject = "Subject is required";
      formIsValid = false;
    }
    
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
      formIsValid = false;
    } else if (formData.message.trim().length < 20) {
      tempErrors.message = "Message should be at least 20 characters";
      formIsValid = false;
    }
    
    setErrors(tempErrors);
    return formIsValid;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully! We will get back to you soon.',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        inquiryType: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'There was an error sending your message. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Paper elevation={0} className={styles.formContainer}>
      <Typography variant="h5" component="h2" className={styles.formTitle}>
        Send Us a Message
      </Typography>
      
      <Typography variant="body2" color="textSecondary" className={styles.formSubtitle}>
        Fill out the form below, and we'll get back to you as soon as possible.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.formField}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
          />
        </div>
        
        <div className={styles.formField}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </div>
        
        <div className={styles.formField}>
          <FormControl fullWidth error={!!errors.inquiryType}>
            <InputLabel id="inquiry-type-label">Inquiry Type</InputLabel>
            <Select
              labelId="inquiry-type-label"
              id="inquiry-type"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              label="Inquiry Type"
              required
            >
              <MenuItem value="" disabled>
                <em>Select an inquiry type</em>
              </MenuItem>
              {inquiryTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.inquiryType && (
              <FormHelperText>{errors.inquiryType}</FormHelperText>
            )}
          </FormControl>
        </div>
        
        <div className={styles.formField}>
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.subject}
            helperText={errors.subject}
            required
          />
        </div>
        
        <div className={styles.formField}>
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={5}
            error={!!errors.message}
            helperText={errors.message}
            required
          />
        </div>
        
        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            className={styles.submitButton}
            endIcon={<Send />}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ContactForm;