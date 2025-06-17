// src/features/ui/auth/LoginForm.jsx
import { useState } from "react";
import styles from './LoginForm.module.css';
import { TextField, Button, InputAdornment, IconButton, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api";

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    
    try {
      // Use api service instead of direct axios calls
      const res = await api.post("/auth/login", data);

      if (res.data.success) {
        // Store JWT token in localStorage
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        
        // Update auth context with user data
        login(res.data.user);

        // Role-based redirection
        const role = res.data.user.role;
        if (role === "admin") navigate("/dashboard/admin");
        else if (role === "instructor") navigate("/dashboard/instructor");
        else navigate("/dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        // The server responded with an error
        if (error.response.status === 401) {
          setError("Invalid email or password");
        } else if (error.response.status === 404) {
          setError("Server endpoint not found. Please check API configuration.");
        } else if (error.response.status === 429) {
          setError("Too many attempts. Please try again later.");
        } else {
          setError(error.response.data?.message || "Login failed");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("Server not responding. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Welcome Back to Khatwa!</h2>
        <p className={styles.subtitle}>Use your email or Google account</p>

        <GoogleLoginButton />
        <p className={styles.orText}>Or log in with email</p>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

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
                disabled={isLoading}
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
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          <p className={styles.authRedirect}>
            Don't have an account? <Link to="/register">Sign up for free</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;