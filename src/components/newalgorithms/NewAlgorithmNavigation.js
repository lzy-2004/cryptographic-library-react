import React from 'react';
import { 
  Box, 
  Divider, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Typography,
  Collapse
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PasswordIcon from '@mui/icons-material/Password';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CodeIcon from '@mui/icons-material/Code';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const NewAlgorithmNavigation = ({ selectedAlgorithm, onAlgorithmChange }) => {
  const [openCategories, setOpenCategories] = React.useState({
    symmetric: true,
    asymmetric: true,
    hash: true,
    hmac: true,
    encoding: true
  });

  const toggleCategory = (category) => {
    setOpenCategories({
      ...openCategories,
      [category]: !openCategories[category]
    });
  };

  // 算法分类
  const algorithmCategories = {
    symmetric: {
      title: '对称加密算法',
      icon: <LockIcon />,
      algorithms: ['AES', 'SM4', 'RC6']
    },
    asymmetric: {
      title: '非对称加密算法',
      icon: <VpnKeyIcon />,
      algorithms: ['RSA1024', 'RSASHA1', 'ECC160', 'ECDSA']
    },
    hash: {
      title: '哈希算法',
      icon: <PasswordIcon />,
      algorithms: ['SHA1', 'SHA256', 'SHA3-512','MD5', 'RIPEMD160', 'PBKDF2','HMACSHA1','HMACSHA256']
    },
    encoding: {
      title: '编码算法',
      icon: <CodeIcon />,
      algorithms: ['Base64', 'UTF-8','HEX']
    }
  };

  return (
    <Paper
      elevation={0}
      square
      sx={{
        width: 250,
        minHeight: '100%',
        backgroundColor: 'background.left',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflow: 'auto',
        flexShrink: 0,
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <Box sx={{ 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          算法分类
        </Typography>
      </Box>
      
      <Divider />
      
      <List component="nav" sx={{ pt: 0 }}>
        {Object.entries(algorithmCategories).map(([category, { title, icon, algorithms }]) => (
          <React.Fragment key={category}>
            <ListItemButton 
              onClick={() => toggleCategory(category)}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                {icon}
              </ListItemIcon>
              <ListItemText 
                primary={title} 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }} 
              />
              {openCategories[category] ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
            </ListItemButton>
            
            <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {algorithms.map((algo) => (
                  <ListItemButton
                    key={algo}
                    selected={selectedAlgorithm === algo}
                    onClick={() => onAlgorithmChange(algo)}
                    sx={{
                      pl: 4,
                      py: 0.75,
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderRight: '4px solid',
                        borderColor: 'primary.main',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(52, 152, 219, 0.05)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary={algo} 
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem',
                        color: selectedAlgorithm === algo ? 'primary.main' : 'text.secondary',
                        fontWeight: selectedAlgorithm === algo ? 600 : 400,
                      }} 
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            
            <Divider variant="middle" sx={{ my: 0.5 }} />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default NewAlgorithmNavigation; 