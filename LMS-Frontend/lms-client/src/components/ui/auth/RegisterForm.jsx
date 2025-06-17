// src/features/ui/auth/RegisterForm.jsx
import { useState } from "react";
import styles from "./RegisterForm.module.css";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api";

const schema = yup.object().shape({
  name: yup.string().min(2).max(255).required("Full name is required"),
  email: yup.string().email().max(255).required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms & conditions"),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: "student",
    };

    setError("");
    setLoading(true);
    
    try {
      // Use api service instead of direct axios calls
      const res = await api.post("/auth/register", payload);

      if (res.data.success) {
        // Store JWT token in localStorage
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        
        // Update auth context with user data
        login(res.data.user);

        // Role-based redirection
        const role = res.data.user.role;
        if (role === "admin") navigate("/dashboard/admin");
        else if (role === "instructor") navigate("/dashboard/instructor");
        else navigate("/dashboard");
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response) {
        // The server responded with an error
        if (error.response.status === 400) {
          setError(error.response.data?.message || "Invalid registration data");
        } else if (error.response.status === 404) {
          setError("Server endpoint not found. Please check API configuration.");
        } else if (error.response.status === 409) {
          setError("Email already exists. Please use a different email or log in.");
        } else {
          setError(error.response.data?.message || "Registration failed");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("Server not responding. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.registerCard}>
        <h2 className={styles.title}>Create Your Account</h2>
        <p className={styles.subtitle}>Sign up with Google or your email</p>

        <GoogleLoginButton />

        <p className={styles.orText}>Or sign up with email</p>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading}
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
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword((prev) => !prev)} 
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowConfirm((prev) => !prev)} 
                        edge="end"
                        disabled={loading}
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="termsAccepted"
            control={control}
            render={({ field }) => (
              <>
                <FormControlLabel
                  control={<Checkbox {...field} color="primary" disabled={loading} />}
                  label={
                    <Typography variant="body2">
                      I agree to the{" "}
                      <a href="#" className={styles.link}>
                        terms & conditions
                      </a>
                    </Typography>
                  }
                />
                {errors.termsAccepted && (
                  <Typography variant="caption" color="error">
                    {errors.termsAccepted.message}
                  </Typography>
                )}
              </>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className={styles.authRedirect}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;