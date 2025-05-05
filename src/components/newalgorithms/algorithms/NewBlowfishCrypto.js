import React from 'react';
import { Box, Alert, Typography } from '@mui/material';

const NewBlowfishCrypto = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Blowfish加密算法组件正在开发中，敬请期待。
      </Alert>
      <Typography variant="body1">
        Blowfish是一种对称密钥分组密码，由Bruce Schneier于1993年设计，提供快速加密速度和高安全性。它使用可变长度的密钥，从32位到448位不等。
      </Typography>
    </Box>
  );
};

export default NewBlowfishCrypto; 