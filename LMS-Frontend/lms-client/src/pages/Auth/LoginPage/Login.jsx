import styles from './LoginPage.module.css';
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Welcome Back to Khatwa!</h2>
        <p className={styles.subtitle}>Log In To Your Account</p>

        <div className={styles.socialButtons}>
          <Button variant="outlined" fullWidth className={styles.socialBtn}>
            Login with Google
          </Button>
        
        </div>

        <p className={styles.orText}>Or Log In With Email</p>

        <form className={styles.form}>
          <TextField
            label="Your Email"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
          />

        

          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={styles.submitBtn}
          >
            Log In
          </Button>

          <p className={styles.authRedirect}>
            Don’t have an account? <Link to="/register">Sign Up for free</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
