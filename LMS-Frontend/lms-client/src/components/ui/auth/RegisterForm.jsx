// src/features/ui/auth/RegisterForm.jsx
import { useState, useEffect } from "react";
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
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api";
import { Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import logo from "../../../assets/images/logo.png";

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
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateIn(true);
  }, []);

  const {
    handleSubmit,
    control,
    watch,
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

  const password = watch("password", "");
  
  // Password strength indicators
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const hasMinLength = password.length >= 8;

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
      <div className={`${styles.authWrapper} ${animateIn ? styles.animateIn : ''}`}>
        {/* Left Side - Image/Design */}
        <div className={styles.imageSide}>
          <div className={styles.contentWrapper}>
            <h2 className={styles.welcomeTitle}>Join Khatwa Today!</h2>
            <p className={styles.welcomeText}>
              Create an account to start your learning journey with us. 
              Access our library of courses and expand your knowledge.
            </p>
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>Free account creation</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>Access to premium courses</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>Track your learning progress</div>
              </div>
            </div>
          </div>
          <div className={styles.shapesContainer}>
            <div className={styles.shape1}></div>
            <div className={styles.shape2}></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="Khatwa" className={styles.logo} />
            <h3 className={styles.logoText}>Khatwa</h3>
          </div>

          <div className={styles.registerCard}>
            <h2 className={styles.title}>Create Your Account</h2>
            <p className={styles.subtitle}>Sign up in seconds to start learning</p>

            {error && (
              <Alert 
                severity="error" 
                className={styles.alert}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <User size={18} />
                  <span>Full Name</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="John Doe"
                      fullWidth
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={loading}
                      className={styles.textField}
                      InputProps={{
                        classes: {
                          root: styles.input,
                          focused: styles.focusedInput,
                        }
                      }}
                    />
                  )}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Mail size={18} />
                  <span>Email Address</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="your.email@example.com"
                      fullWidth
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={loading}
                      className={styles.textField}
                      InputProps={{
                        classes: {
                          root: styles.input,
                          focused: styles.focusedInput,
                        }
                      }}
                    />
                  )}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Lock size={18} />
                  <span>Password</span>
                </label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      variant="outlined"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={loading}
                      className={styles.textField}
                      InputProps={{
                        classes: {
                          root: styles.input,
                          focused: styles.focusedInput,
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              disabled={loading}
                              className={styles.visibilityIcon}
                            >
                              {showPassword ? 
                                <VisibilityOff className={styles.icon} /> : 
                                <Visibility className={styles.icon} />
                              }
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                
                {/* Password strength indicators */}
                {password && (
                  <div className={styles.passwordStrength}>
                    <div className={`${styles.strengthItem} ${hasMinLength ? styles.valid : ''}`}>
                      <Check size={14} /> Min. 8 characters
                    </div>
                    <div className={`${styles.strengthItem} ${hasUpperCase ? styles.valid : ''}`}>
                      <Check size={14} /> Uppercase letter
                    </div>
                    <div className={`${styles.strengthItem} ${hasLowerCase ? styles.valid : ''}`}>
                      <Check size={14} /> Lowercase letter
                    </div>
                    <div className={`${styles.strengthItem} ${hasNumber ? styles.valid : ''}`}>
                      <Check size={14} /> Number
                    </div>
                    <div className={`${styles.strengthItem} ${hasSpecialChar ? styles.valid : ''}`}>
                      <Check size={14} /> Special character
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Lock size={18} />
                  <span>Confirm Password</span>
                </label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="••••••••"
                      type={showConfirm ? "text" : "password"}
                      fullWidth
                      variant="outlined"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      disabled={loading}
                      className={styles.textField}
                      InputProps={{
                        classes: {
                          root: styles.input,
                          focused: styles.focusedInput,
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setShowConfirm((prev) => !prev)}
                              edge="end"
                              disabled={loading}
                              className={styles.visibilityIcon}
                            >
                              {showConfirm ? 
                                <VisibilityOff className={styles.icon} /> : 
                                <Visibility className={styles.icon} />
                              }
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <div className={styles.termsGroup}>
                <Controller
                  name="termsAccepted"
                  control={control}
                  render={({ field }) => (
                    <>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            {...field} 
                            color="primary" 
                            disabled={loading} 
                            className={styles.checkbox}
                          />
                        }
                        label={
                          <Typography variant="body2" className={styles.termsText}>
                            I agree to the{" "}
                            <a href="#" className={styles.link}>
                              terms & conditions
                            </a>
                          </Typography>
                        }
                      />
                      {errors.termsAccepted && (
                        <FormHelperText error>
                          {errors.termsAccepted.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} className={styles.loadingSpinner} />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} className={styles.btnIcon} />
                  </>
                )}
              </Button>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <GoogleLoginButton className={styles.googleButton} />

              <p className={styles.authRedirect}>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;