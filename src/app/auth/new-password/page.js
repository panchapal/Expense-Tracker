'use client';

import { useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button, Alert,InputAdornment } from '@mui/material';
import { supabase } from '@/supabase';
import { useRouter } from 'next/navigation';
import styles from "./newpass.module.css";
import HttpsIcon from '@mui/icons-material/Https';

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  const handleSetNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Password has been updated successfully.');
        router.push('/auth/login'); 
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Box className={styles.registerPage}>
      <Grid container className={styles.registerContainer}>
    <Container maxWidth="xs" className={styles.registerForm}>
      <Box className={styles.registerFormBox}>
        <Typography variant="h4" component="h4" gutterBottom>
          Set Password
        </Typography>
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={inputStyles(newPassword)}
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
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={inputStyles(confirmPassword)}
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
        <Button onClick={handleSetNewPassword} variant="contained" color="primary" fullWidth className={styles.registerButton}>
          Set New Password
        </Button>
</Grid>
        {message && (
          <Box sx={{ mt: 2 }}>
            <Alert severity={message === 'Password has been updated successfully.' ? 'success' : 'error'}>
              {message}
            </Alert>
          </Box>
        )}
        </Grid>
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
