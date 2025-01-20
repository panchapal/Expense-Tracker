"use client";

import { useState } from "react";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import CategorySelector from "@/components/categorySelector/category";
import styles from "./add.module.css";

export default function AddTransaction() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("income");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAddTransaction = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage("You need to be logged in to add a transaction.");
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      amount: parseFloat(amount),
      category,
      type,
      notes,
      date,
    });

    if (error) setMessage(error.message);
    else {
      setMessage("Transaction added successfully!");
      router.push("/dashboard");
    }
  };

  return (
    <Box className={styles.registerPage}>
      <Grid container className={styles.registerContainer}>
        <Container maxWidth="sm" className={styles.registerForm}>
          <Box className={styles.registerFormBox}>
            <Typography variant="h4" component="h4">
              Add Transaction
            </Typography>

            <Grid container spacing={2}>
              {/* Amount */}
              <Grid item xs={12}>
                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  variant="outlined"
                  sx={inputStyles(amount)}
                />
              </Grid>

              {/* Category Selector */}
              <Grid item xs={12} sx={inputStyles(category)}>
                <CategorySelector
                  onSelectCategory={(selectedCategory) =>
                    setCategory(selectedCategory)
                  }
                />
              </Grid>

              {/* Type Selector */}
              <Grid item xs={12} sx={inputStyles(category)}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    label="Type"
                    // sx={inputStyles(category)}
                  >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  multiline
                  rows={4}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  variant="outlined"
                  sx={inputStyles(notes)}
                />
              </Grid>

              {/* Date */}
              <Grid item xs={12}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  variant="outlined"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={inputStyles(date)}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleAddTransaction}
                  className={styles.registerButton}
                >
                  Add Transaction
                </Button>
              </Grid>

              {/* Message */}
              {message && (
                <Grid item xs={12}>
                  <Alert
                    severity={message.includes("error") ? "error" : "success"}
                  >
                    {message}
                  </Alert>
                </Grid>
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
