'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { useRouter } from 'next/navigation';
import { Typography, Button, TextField, Select, MenuItem, CircularProgress,Box } from '@mui/material';
import BudgetProgressBar from '@/components/Budget/Budget';
import styles from "./budget.module.css"
import { Category } from '@mui/icons-material';

export default function BudgetSetting() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState({});
  const [transactions, setTransactions] = useState({});
  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const predefinedCategories = ['Food', 'Travel', 'Utilities', 'Shopping'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/login');

      try {
        const [customCategories, budgets, transactions] = await Promise.all([
          fetchCategories(user.id),
          fetchBudgets(user.id),
          fetchTransactions(user.id),
        ]);

        setCategories([...predefinedCategories.map((name) => ({ name })), ...customCategories]);
        setBudget(mapByCategory(budgets));
        setTransactions(groupByCategory(transactions));
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const fetchCategories = async (userId) => {
    const { data, error } = await supabase.from('categories').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  };

  const fetchBudgets = async (userId) => {
    const { data, error } = await supabase.from('budgets').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  };

  const fetchTransactions = async (userId) => {
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  };

  const mapByCategory = (data) => {
    return data.reduce((acc, item) => {
      acc[item.category] = item.amount;
      return acc;
    }, {});
  };

  const groupByCategory = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  const handleSetBudget = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !newBudget.category || !newBudget.amount) {
      setMessage('Please provide valid category and amount.');
      return;
    }

    try {
      await supabase.from('budgets').upsert({
        user_id: user.id,
        category: newBudget.category,
        amount: parseFloat(newBudget.amount),
      });

      setBudget((prev) => ({ ...prev, [newBudget.category]: parseFloat(newBudget.amount) }));
      setNewBudget({ category: '', amount: '' });
      setMessage('Budget set successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.budgetContainer}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
        {/* Right Section: Set New Budget */}
        <div className={styles.budgetRightSection}>
            <Typography variant="h5" className={styles.budgetRightHeading}>Set New Budget</Typography>
            <Box sx={inputStyles}>
            <Select
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              displayEmpty
              className={styles.selectInput}
            >
              <MenuItem value=""><em>Select Category</em></MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.name} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
            </Box>
            <TextField
              type="number"
              placeholder="Amount"
              value={newBudget.amount}
              onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
              className={styles.textField}
              sx={inputStyles}
            />
            <Button variant="contained" className={styles.budgetRightButton} onClick={handleSetBudget}>
              Set Budget
            </Button>
            {message && <Typography className={styles.budgetErrorMessage}>{message}</Typography>}
          </div>

          {/* Left Section: Budgets */}
          <div className={styles.budgetLeftSection}>
            {categories.map((category) => (
              <div key={category.name} className={styles.budgetCard}>
                <Typography className={styles.cardTitle}>{category.name}</Typography>
                <Typography className={styles.cardSubtitle}>Budget: {budget[category.name] || 0}</Typography>
                <BudgetProgressBar category={category.name} budget={budget[category.name] || 0} />
                <Typography className={styles.cardSubtitle}>Transactions: {transactions[category.name]?.length || 0}</Typography>
              </div>
            ))}
          </div>
        </>
      )}
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
