'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import styles from "./summary.module.css";

export default function MonthlySummary() {
  const [data, setData] = useState({ income: 0, expenses: 0, savings: 0, categorySpending: {} });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', start)
        .lt('date', end);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      let income = 0, expenses = 0, categorySpending = {};
      transactions.forEach(({ type, amount, category }) => {
        type === 'income' ? (income += amount) : (expenses += amount);
        categorySpending[category] = (categorySpending[category] || 0) + amount;
      });

      setData({ income, expenses, savings: income - expenses, categorySpending });
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const exportCSV = () => {
    const csv = [
      ['Date', 'Category', 'Amount', 'Type', 'Description'],
      ...Object.entries(data.categorySpending).map(([cat, amt]) => [cat, amt])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  return (
    <Box className={styles.monthlyContainer}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className={styles.contentWrapper}>
          <Box className={styles.leftSection}>
            <Typography variant="h4" className={styles.monthlyHeading}>Monthly Summary</Typography>
            <Box className={styles.summaryPaper}>
              <Typography className={styles.incomeText}>Income: {data.income}</Typography>
              <Typography className={styles.expensesText}>Expenses: {data.expenses}</Typography>
              <Typography className={styles.savingsText}>Savings: {data.savings}</Typography>
            </Box>
            <Button variant="contained" className={styles.exportButton} onClick={exportCSV}>
              Export CSV
            </Button>
          </Box>

          <Box className={styles.rightSection}>
            <Typography variant="h5" className={styles.monthlyCategoryHeading}>Category Spending</Typography>
            <Box className={styles.monthlyCategoryGrid}>
              {Object.entries(data.categorySpending).slice(0, 2).map(([category, amount]) => (
                <Paper className={styles.monthlyCategoryBox} key={category}>
                  <Typography className={styles.categoryName}>{category}</Typography>
                  <Typography className={styles.categoryAmount}>{amount}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
