import { useState, useEffect } from "react";
import styles from "./LoginForm.module.css";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api";
import { Mail, Lock, ArrowRight } from "lucide-react";
import logo from "../../../assets/images/logo.png";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateIn(true);
  }, []);

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
      // CRITICAL: Force clear any existing tokens before login attempt
      localStorage.removeItem("token");
      localStorage.removeItem("lms_auth_token");
      console.log("🧹 Cleared all existing tokens before login attempt");

      // Use api service for login
      console.log("🔄 Sending login request with:", {
        email: data.email,
        password: "********",
      });
      const res = await api.post("/auth/login", data);

      console.log("📥 Login response received:", res.data);

      if (res.data.success) {
        console.log("✅ Login successful");

        // Store JWT token in localStorage with the correct key
        if (res.data.token) {
          const tokenValue = res.data.token;
          console.log(
            "🔑 Token received from server:",
            tokenValue.substring(0, 10) + "..."
          );

          // Store with the key the API is looking for
          localStorage.setItem("lms_auth_token", tokenValue);

          // ALSO store with legacy key as backup
          localStorage.setItem("token", tokenValue);

          // Verify both tokens were stored correctly
          const primaryToken = localStorage.getItem("lms_auth_token");
          const backupToken = localStorage.getItem("token");

          console.log("✅ Primary token stored:", !!primaryToken);
          console.log("✅ Backup token stored:", !!backupToken);

          // Check if the API can access the token
          setTimeout(() => {
            try {
              const apiCheck = api.getToken
                ? api.getToken()
                : "API has no getToken method";
              console.log(
                "🔍 API token check:",
                apiCheck ? "Token found" : "No token found"
              );
            } catch (e) {
              console.error("❌ API token check failed:", e);
            }
          }, 100);
        } else {
          console.warn("⚠️ No token received from server response.");
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
          setError(
            "Server endpoint not found. Please check API configuration."
          );
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
      <div
        className={`${styles.authWrapper} ${animateIn ? styles.animateIn : ""}`}
      >
        {/* Left Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="Khatwa" className={styles.logo} />
            <h3 className={styles.logoText}>Khatwa</h3>
          </div>

          <div className={styles.loginCard}>
            <h2 className={styles.title}>Welcome Back!</h2>
            <p className={styles.subtitle}>
              Log in to continue your learning journey
            </p>

            {error && (
              <Alert
                severity="error"
                className={styles.alert}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.form}
              noValidate
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Mail size={18} />
                  <span>Email</span>
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
                      disabled={isLoading}
                      className={styles.textField}
                      InputProps={{
                        classes: {
                          root: styles.input,
                          focused: styles.focusedInput,
                        },
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
                      disabled={isLoading}
                      className={styles.textField}
                      InputProps={{
                        classes: {
                          root: styles.input,
                          focused: styles.focusedInput,
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            {" "}
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              disabled={isLoading}
                              className={styles.visibilityIcon}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              title={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <Visibility className={styles.icon} />
                              ) : (
                                <VisibilityOff className={styles.icon} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <Button
                variant="contained"
                type="submit"
                fullWidth
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    className={styles.loadingSpinner}
                  />
                ) : (
                  <>
                    Log In <ArrowRight size={18} className={styles.btnIcon} />
                  </>
                )}
              </Button>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <GoogleLoginButton className={styles.googleButton} />

              <p className={styles.authRedirect}>
                Don't have an account yet?{" "}
                <Link to="/register">Create an account</Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side - Image/Design */}
        <div className={styles.imageSide}>
          <div className={styles.contentWrapper}>
            <h2 className={styles.welcomeTitle}>Welcome to Khatwa!</h2>
            <p className={styles.welcomeText}>
              Your journey to new skills and knowledge starts here. Log in to
              continue learning or create an account to get started.
            </p>
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>Expert-led courses</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>Interactive learning</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>Flexible study plans</div>
              </div>
            </div>
          </div>
          <div className={styles.shapesContainer}>
            <div className={styles.shape1}></div>
            <div className={styles.shape2}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
