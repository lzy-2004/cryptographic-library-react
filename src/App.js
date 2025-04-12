import React, { useState } from 'react';
import AlgorithmSwitch from './components/AlgorithmSwitch';
import CryptoForm from './components/CryptoForm';
import { Typography, Box } from '@mui/material';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('SM4');

  return (
    <div id="root">
      <div id="background-image"></div>
      <Box sx={{ display: 'flex' }}>
        <AlgorithmSwitch
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
        />

        {/* 主内容区需要添加左边距 */}
        <Box sx={{
          flex: 1,
          marginLeft: '160px', // 与侧边栏宽度一致
          padding: 4
        }}>
          <Box sx={{
            width: '100vw',
            minHeight: '100vh',
            padding: '10px',
            background: 'rgba(0,0,0,0.9)', // 确保深色背景
            textAlign: 'center'
          }}>
            <Typography variant="h1" sx={{
              position: 'relative',
              display: 'inline-block',
              margin: '0 0',
              fontSize: '3.5rem',
              textAlign: 'center',

              // 文字样式
              background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 15px rgba(0,255,255,0.7)',

              // 主边框层
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                background: 'linear-gradient(45deg, #00ffff, #ff00ff, #00ffff)',
                zIndex: -1,
                animation: 'borderGlow 3s linear infinite',
                borderRadius: '10px',
                backgroundSize: '400% 400%',
                filter: 'brightness(1.2)'
              },

              // 光晕扩散层
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-12px',
                left: '-12px',
                right: '-12px',
                bottom: '-12px',
                background: 'linear-gradient(45deg, #00ffff40, #ff00ff40)',
                zIndex: -2,
                animation: 'borderGlow 5s linear infinite',
                borderRadius: '16px',
                backgroundSize: '400% 400%',
                filter: 'blur(20px)',
                opacity: 0.8
              }
            }}>
              Cryptographic Library
            </Typography>

            <Box sx={{
              width: '100%',
              maxWidth: 1600,
              margin: '0 auto',
              padding: 4,
              background: 'rgba(0,0,0,0.5)',
              borderRadius: 4,
              overflowY: 'auto',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <CryptoForm algorithm={selectedAlgorithm} />
            </Box>
          </Box>
        </Box>
      </Box>
    </div >
  );
}


export default App;
