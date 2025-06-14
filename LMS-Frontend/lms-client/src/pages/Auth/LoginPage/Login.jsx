import styles from './LoginPage.module.css';
import {
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import GoogleLoginButton from '../../../components/auth/GoogleLoginButton';
import { useAuth } from "../../../hooks/useAuth";
const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', data, {
        withCredentials: true,
      });

      if (res.data.success) {
        login(res.data.user); // Save to AuthContext

        const role = res.data.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'instructor') navigate('/instructor');
        else navigate('/dashboard'); // student
      } else {
        alert(res.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Welcome Back to Khatwa!</h2>
        <p className={styles.subtitle}>Use your email or Google account</p>

        <GoogleLoginButton />

        <p className={styles.orText}>Or log in with email</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Your Email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            className={styles.submitBtn}
          >
            Log In
          </Button>

          <p className={styles.authRedirect}>
            Don’t have an account? <Link to="/register">Sign up for free</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
