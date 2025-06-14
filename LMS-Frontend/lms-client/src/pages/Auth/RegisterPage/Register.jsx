
import styles from './Register.module.css';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.registerCard}>
        <h2 className={styles.title}>Create Your Account</h2>
        <p className={styles.subtitle}>Sign up to start learning on Khatwa</p>

        <form className={styles.form}>
          <TextField label="Full Name" variant="outlined" fullWidth margin="normal" />
          <TextField label="Email Address" variant="outlined" fullWidth margin="normal" />
          <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
          <TextField label="Confirm Password" type="password" variant="outlined" fullWidth margin="normal" />

          <FormControlLabel
            control={<Checkbox color="primary" />}
            label={
              <span>
                I agree to the <a href="#" className={styles.link}>terms & conditions</a>
              </span>
            }
          />

          <Button type="submit" variant="contained" fullWidth className={styles.submitBtn}>
            Sign Up
          </Button>

          <p className={styles.authRedirect}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
