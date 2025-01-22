'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { useRouter } from 'next/navigation';
import CategorySelector from '@/components/categorySelector/category';
import styles from "./history.module.css";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Card,
  CardContent,
  Box,
} from '@mui/material';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ category: '', type: '', startDate: '', search: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      let query = supabase.from('transactions').select('*').eq('user_id', user.id);

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.startDate) query = query.gte('date', filters.startDate);
      if (filters.search) query = query.ilike('notes', `%${filters.search}%`);

      const { data, error } = await query;

      if (error) setMessage(error.message);
      else setTransactions(data);
    };

    fetchTransactions();
  }, [filters, router]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.historyContainer}>
      <Box className={styles.historyLeftSection}>
        <Typography variant="h4" gutterBottom className={styles.historyHeading}>
          Transaction History
        </Typography>

        {/* Filters */}
        <Box className={styles.historyFiltersBox} sx={inputStyles}>
        <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={filters.startDate || ''}
            onChange={handleFilterChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            label="Search Notes"
            name="search"
            value={filters.search || ''}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
          />
          <CategorySelector             
            value={filters.category || ''}
            onSelectCategory={(category) => setFilters({ ...filters, category })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            
            <Select name="type" value={filters.type || ''} onChange={handleFilterChange}>
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
         
          <Button
            onClick={() => setFilters({ category: '', type: '', startDate: '', search: '' })}
            variant="outlined"
            fullWidth
            className={styles.historyButton}
          >
            Clear Filters
          </Button>
        </Box>
      </Box>

      <Box className={styles.historyRightSection}>
        <Typography variant="h5" gutterBottom className={styles.rightSectionHeading}>
          All Transactions
        </Typography>
        <div className={styles.historyTransactionGrid}>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <Card key={transaction.id} className={styles.historyCard}>
                <CardContent>
                <Typography variant="body1" className={styles.historyText}>
                    Date: {transaction.date}
                  </Typography>
                  <Typography variant="body1" className={styles.historyText}>
                    Category: {transaction.category}
                  </Typography>
                  <Typography variant="body1" className={styles.historyText}>
                    Type: {transaction.type}
                  </Typography>
                  <Typography variant="body1" className={styles.historyText}>
                    Amount: <strong>{transaction.amount}</strong>
                  </Typography>
                  <Typography variant="body1" className={styles.historyText}>
                    Notes: {transaction.notes}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" className={styles.noHistoryText}>
              No transactions found.
            </Typography>
          )}
        </div>
        {message && (
          <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </div>
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
