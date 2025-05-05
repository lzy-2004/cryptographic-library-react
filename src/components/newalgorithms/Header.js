import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from '@mui/icons-material/School';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ 
      backgroundColor: 'background.paper', 
      borderBottom: '1px solid rgba(124, 177, 255, 0.15)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    }}>
      <Toolbar>
        <SecurityIcon sx={{ 
          mr: 2, 
          fontSize: '2rem',
          color: 'primary.main' 
        }} />
        
        <Typography 
          variant="h1" 
          component="h1"
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
            fontWeight: 700,
            background: 'linear-gradient(90deg, #3498db, #2ecc71)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
          }}
        >
          CipherGuard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Button
            color={showDocumentation ? 'secondary' : 'primary'}
            variant={showDocumentation ? 'contained' : 'outlined'}
            startIcon={showDocumentation ? <SecurityIcon /> : <MenuBookIcon />}
            onClick={toggleDocumentation}
            sx={{ 
              mr: 2,
              borderRadius: '8px',
              px: 2,
              py: 1,
              fontWeight: 500,
              '&:hover': {
                boxShadow: '0 0 10px rgba(46, 204, 113, 0.5)'
              }
            }}
          >
            {showDocumentation ? '返回加密工具' : '查看算法文档'}
          </Button> */}
          
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            color: 'text.secondary',
            border: '1px solid',
            borderColor: 'divider',
            p: 1,
            borderRadius: 2,
          }}>
            <SchoolIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              专业密码学解决方案
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 