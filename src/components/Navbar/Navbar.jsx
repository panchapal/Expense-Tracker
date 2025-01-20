'use client';

import { useState } from 'react';
import { supabase } from '@/supabase';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Drawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const navigateTo = (path) => {
    router.push(path);
    setDrawerOpen(false); 
  };

  const menuItems = ['Dashboard'];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1}}>
           Track Flow
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },        
              justifyContent: 'center',                    
              alignItems: 'center',                        
              width: '100%',                             
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item}
                color="inherit"
                onClick={() => navigateTo(`/${item.toLowerCase()}`)}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" onClick={() => navigateTo('/auth/register')}>
              Register
            </Button>
            <Button color="inherit" onClick={() => navigateTo('/auth/login')}>
              Login
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => toggleDrawer(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1, 
          }}
        >
          {menuItems.map((item) => (
            <Button
              key={item}
              fullWidth
              variant="outlined"
              onClick={() => navigateTo(`/${item.toLowerCase()}`)}
            >
              {item}
            </Button>
          ))}
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigateTo('/auth/register')}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigateTo('/auth/login')}
          >
            Login
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
