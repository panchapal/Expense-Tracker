'use client';
import { Grid,Container, TextField, Button, Typography, Box, Alert,InputAdornment } from '@mui/material';
import { supabase } from '@/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./password.module.css"
import EmailIcon from '@mui/icons-material/Email';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset email sent. Please check your inbox to set a new password.');
      setIsResetSuccessful(true);
      setTimeout(() => {
        router.push('/auth/new-password');
      }, 3000);
    }
  };

  return (
    <Box className={styles.registerPage}>
      <Grid container className={styles.registerContainer}>
    <Container maxWidth="xs" className={styles.registerForm}>
      <Box className={styles.registerFormBox}>
        <Typography variant="h4" component="h4" gutterBottom>
          Forgot Password
        </Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={inputStyles(email)}
          InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                           <EmailIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
        />
        <Button onClick={handleForgotPassword} variant="contained" color="primary" fullWidth className={styles.registerButton}
>
          Reset Password
        </Button>

        {message && (
          <Box sx={{ mt: 2 }}>
            <Alert severity={isResetSuccessful ? 'success' : 'error'}>{message}</Alert>
          </Box>
        )}
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
