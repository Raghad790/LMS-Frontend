import styles from "./RegisterForm.module.css";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";

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

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        login(res.data.user);
        const redirectByRole = (role) => {
  switch (role) {
    case 'admin':
      return navigate('/dashboard/admin');
    case 'instructor':
      return navigate('/dashboard/instructor');
    case 'student':
    default:
      return navigate('/dashboard');
  }
};

redirectByRole(res.data.user.role);

      } else {
        alert(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Validation failed");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.registerCard}>
        <h2 className={styles.title}>Create Your Account</h2>
        <p className={styles.subtitle}>Sign up with Google or your email</p>

        <GoogleLoginButton />

        <p className={styles.orText}>Or sign up with email</p>

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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm((prev) => !prev)} edge="end">
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
                  control={<Checkbox {...field} color="primary" />}
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
          >
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

export default RegisterForm;
