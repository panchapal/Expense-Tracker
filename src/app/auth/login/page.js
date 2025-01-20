"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Box,
  Link,
  InputAdornment,
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import "./login.css";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    const { email, password } = data;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.message.includes("invalid password") ||
        error.message.includes("invalid credentials")
      ) {
        setMessage(
          "The password you entered is incorrect. Please try again or reset your password."
        );
      } else {
        setMessage(error.message);
      }
    } else {
      setMessage("");
      router.push("/dashboard");
    }
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  return (
    <Box className="loginPage">
      <Grid container className="loginContainer">
        <Container maxWidth="xs" className="loginFormContainer">
          <Box className="formBox">
            <Typography variant="h4" component="h1" className="loginHeading">
              Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    sx={inputStyles(errors.email)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                           <EmailIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
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
                        message: "Password must be at least 6 characters long",
                      },
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="loginButton"
                  >
                    Login
                  </Button>
                </Grid>
                {message && (
                  <Grid item xs={12}>
                    <Alert severity="error">{message}</Alert>
                  </Grid>
                )}
                <Grid item xs={12} textAlign="center">
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Raleway, serif" }}
                  >
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="registerLink">
                      Register
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleForgotPassword}
                    underline="hover"
                    sx={{ fontFamily: "Raleway, serif" }}
                  >
                    Forgot Password?
                  </Link>
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
