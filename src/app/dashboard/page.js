'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import { useRouter } from 'next/navigation';
import { Typography, Button, Paper, Card, CardContent, Box } from '@mui/material';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        // .limit(3);

      if (!error && data) {
        setTransactions(data);
        calculateSummary(data);
      }
    };

    fetchData();
  }, [router]);

  const calculateSummary = (transactions) => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    setSummary({ income, expense, balance: income - expense });
  };

  return (
    <Box className={styles.dashboard}>
      <Box className={styles.leftSection}>
        {user && (
          <Card className={styles.userCard}>
            <CardContent>
              <Typography variant="h6" className={styles.dashboardHead}>User Details</Typography>
              <Typography variant="body1" className={styles.dashboardTitle}>Email: {user.email}</Typography>
            </CardContent>
          </Card>
        )}
        <Box className={styles.summary}>
          <Paper className={`${styles.summaryItem} ${styles.income}`}>
            <Typography variant="h6" className={styles.summaryHead}>Total Income</Typography>
            <Typography variant="h5" className={styles.summaryTitle}>${summary.income.toFixed(2)}</Typography>
          </Paper>
          <Paper className={`${styles.summaryItem} ${styles.expense}`}>
            <Typography variant="h6" className={styles.summaryHead}>Total Expenses</Typography>
            <Typography variant="h5" className={styles.summaryTitle}>${summary.expense.toFixed(2)}</Typography>
          </Paper>
          <Paper className={`${styles.summaryItem} ${styles.balance}`}>
            <Typography variant="h6" className={styles.summaryHead}>Balance</Typography>
            <Typography variant="h5" className={styles.summaryTitle}>${summary.balance.toFixed(2)}</Typography>
          </Paper>
        </Box>
      </Box>

      <Box className={styles.rightSection}>
        <Typography variant="h6" gutterBottom className={styles.rightHead}>
          Recent Transactions
        </Typography>
        {transactions.length > 0 ? (
          <Box className={styles.recentTransactions}>
            {transactions.map((transaction) => (
              <Paper key={transaction.id} className={styles.transaction}>
              <Typography variant="body1" className={styles.rightTitle}>Date: {transaction.date}</Typography>
              <Typography variant="body2" className={styles.rightTitle}>Category: {transaction.category}</Typography>
              <Typography variant="body2" className={styles.rightTitle}>Type: {transaction.type}</Typography>
                <Typography variant="body2" className={styles.rightTitle}>
                  Amount: ${transaction.amount}
                </Typography>
                <Typography variant="body2" className={styles.rightTitle}>Notes: {transaction.notes}</Typography>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" className={styles.noTransaction}>
            No transactions found.
          </Typography>
        )}
        <Box textAlign="center" marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            href="/dashboard/add-transaction"
            className={styles.addTransactionButton}
          >
            Add New Transaction
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
