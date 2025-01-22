import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { Box, Typography, LinearProgress, CircularProgress } from '@mui/material';
import styles from './ProgressBar.module.css';

export default function BudgetProgressBar({ category, budget }) {
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpent = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('category', category);

      if (error) {
        console.error('Error fetching transactions:', error);
        setSpent(0);
      } else {
        const totalSpent = transactions.reduce((acc, txn) => acc + txn.amount, 0);
        setSpent(totalSpent);
      }

      setLoading(false);
    };

    fetchSpent();
  }, [category]);

  const safeBudget = budget && !isNaN(budget) ? budget : 0;
  const safeSpent = spent && !isNaN(spent) ? spent : 0;

  const progress = safeBudget > 0 ? (safeSpent / safeBudget) * 100 : 0;

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        {category}
      </Typography>
      <Typography variant="body2" className={styles.budgetInfo}>
        Spent: {safeSpent.toFixed(2)} / {safeBudget.toFixed(2)}
      </Typography>
      {loading ? (
        <CircularProgress size={28} className={styles.circularProgress} />
      ) : (
        <LinearProgress
          variant="determinate"
          value={Math.min(progress, 100)}
          className={styles.linearProgress}
          sx={{
            '& .MuiLinearProgress-bar': {
              backgroundColor: progress >= 100 ? '#ff6f61' : '#00c853',
            },
          }}
        />
      )}
      <Typography
        variant="caption"
        className={`${styles.statusText} ${
          progress >= 100 ? styles.overBudget : styles.underBudget
        }`}
      >
        {progress >= 100
          ? 'Budget exceeded!'
          : 'Good job! You are within budget.'}
      </Typography>
    </Box>
  );
}
