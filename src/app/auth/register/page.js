"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/supabase";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Box,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Register.module.css";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setIsError(true);
      setMessage(error.message);
    } else {
      setIsError(false);
      setMessage(
        "Registration successful. Check your email to confirm your account."
      );
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000); 
    }
  };

  return (
    <Box className={styles.registerPage}>
      <Grid container className={styles.registerContainer}>
        <Container maxWidth="sm" className={styles.registerForm}>
          <Box className={styles.registerFormBox}>
            <Typography variant="h4" component="h4" gutterBottom>
              Register
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    sx={inputStyles(errors.email)}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    sx={inputStyles(errors.password)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HttpsIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    error={!!errors.confirmPassword}
                    sx={inputStyles(errors.password)}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HttpsIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={styles.registerButton}
                  >
                    Sign Up
                  </Button>
                </Grid>
                {message && (
                  <Grid item xs={12}>
                    <Alert severity={isError ? "error" : "success"}>
                      {message}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      textAlign: "center",
                      fontFamily: "Raleway, serif",
                    }}
                  >
                    Already have an account?{" "}
                    <Link href="/auth/login" className={styles.loginLink}>
                      Log in
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Container>
      </Grid>
    </Box>
  );
}

const inputStyles = (error) => ({
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "#757575",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#3f51b5",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d3d3d3",
    },
    "&:hover fieldset": {
      borderColor: "#757575",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3f51b5",
      boxShadow: "0 0 4px rgba(63, 81, 181, 0.5)",
    },
  },
  "& .MuiFormHelperText-root": {
    color: error ? "#d32f2f" : "white",
  },
});
