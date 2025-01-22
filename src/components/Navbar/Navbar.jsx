'use client';

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { supabase } from '@/supabase';
export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Transaction', path: '/dashboard/add-transaction' },
    { label: 'History', path: '/dashboard/transHistory' },
    { label: 'Budget', path: '/dashboard/budget-setting' },
    // { label: 'Monthly', path: '/dashboard/monthly-summary' },

  ];

  const handleNavigate = (path) => {
    router.push(path);
    setDrawerOpen(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    router.push("/auth/login");
  };
  return (
    <>
      <AppBar position="fixed" sx={{ backgroundImage: "linear-gradient( 110.3deg,  rgba(73,93,109,1) 4.3%, rgba(49,55,82,1) 96.7% )" }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexShrink: 0 ,fontFamily:"kanit, serif",fontWeight:"bold"}}>
            Track<span style={{
              fontStyle:"italic",
              color:"#fe6a0b"
            }}>
              Flow.
            </span>
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            {isAuthenticated &&
              menuItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    color: 'white',
                    fontFamily: 'kanit, serif',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#1565C0' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
          </Box>

          {isAuthenticated ? (
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              display: { xs: "none", md: "inline-flex" },
              color: 'white',
                fontFamily:"raleway, serif",
                fontWeight:"bold",
                backgroundColor: '#42A5F5',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#64B5F6' },
            }}
          >
            Logout
          </Button>
        ) : (
          <>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button
              onClick={() => handleNavigate('/auth/register')}
              sx={{
                color: 'white',
                fontFamily:"raleway, serif",
                fontWeight:"bold",
                backgroundColor: '#42A5F5',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#64B5F6' },
              }}
              variant="contained"
            >
              Register
            </Button>
            <Button
              onClick={() => handleNavigate('/auth/login')}
              sx={{
                color: 'white',
                fontFamily:"raleway, serif",
                fontWeight:"bold",
                backgroundColor: '#42A5F5',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#64B5F6' },
              }}
              variant="contained"
            >
              Login
            </Button>
          </Box>
</>
 )}
          {/* Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
  <Box sx={{ width: 250, padding: 2 ,}}>
    <List>
    {isAuthenticated &&
              menuItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton onClick={() => handleNavigate(item.path)}>
                    <ListItemText primary={item.label} primaryTypographyProps={{
                        fontFamily: 'raleway, serif',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }} />
                  </ListItemButton>
                </ListItem>
              ))}
    
    </List>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
    {isAuthenticated ? (
            <Button
            
            onClick={handleLogout}
            sx={{
              color: 'white',
          fontFamily:"kanit, serif",
          fontWeight:"bold",
          backgroundColor: '#42A5F5',
          textTransform: 'none',
          '&:hover': { backgroundColor: '#64B5F6' },
            }}
          >
            Logout
          </Button>
          ) : (
            <>
      <Button
        onClick={() => handleNavigate('/auth/register')}
        sx={{
          color: 'white',
          fontFamily:"kanit, serif",
          fontWeight:"bold",
          backgroundColor: '#42A5F5',
          textTransform: 'none',
          '&:hover': { backgroundColor: '#64B5F6' },
        }}
        variant="contained"
      >
        Register
      </Button>
      <Button
        onClick={() => handleNavigate('/auth/login')}
        sx={{
          color: 'white',
          fontFamily:"kanit, serif",
          fontWeight:"bold",
          backgroundColor: '#42A5F5',
          textTransform: 'none',
          '&:hover': { backgroundColor: '#64B5F6' },
        }}
        variant="contained"
      >
        Login
      </Button>
      </>
    )}
    </Box>
  </Box>
</Drawer>
    </>
  );
}
