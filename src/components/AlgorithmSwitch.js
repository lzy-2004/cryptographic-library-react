import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const AlgorithmSwitch = ({ selectedAlgorithm, onAlgorithmChange }) => {
    const algorithms = ['AES', 'SM4', 'RC6', 'RSA1024', 'RSASHA1', 'ECC160', 'ECDSA', 'SHA1', 'SHA256', 'SHA3-512', 'RIPEMD160', 'PBKDF2', 'HMACSHA1', 'HMACSHA256', 'Base64', 'UTF-8'];

    return (
        <Box sx={{
            width: 150,
            minHeight: '100vh',
            padding: 3,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            borderRight: '1px solid rgba(255,255,255,0.2)',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <Typography variant="h6" sx={{
                color: '#00ff9d',
                mb: 3,
                textAlign: 'center',
                textShadow: '0 0 10px rgba(0,255,255,0.5)'
            }}>
                算法选择
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                overflowY: 'auto',
                maxHeight: '90vh'
            }}>
                {algorithms.map((algo) => (
                    <Button
                        key={algo}
                        onClick={() => onAlgorithmChange(algo)}
                        sx={{
                            justifyContent: 'flex-start',
                            color: selectedAlgorithm === algo ? '#00ffff' : '#ffffff99',
                            backgroundColor: selectedAlgorithm === algo
                                ? 'rgba(0,255,255,0.1)'
                                : 'transparent',
                            border: selectedAlgorithm === algo
                                ? '1px solid rgba(0,255,255,0.5)'
                                : '1px solid transparent',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            padding: '8px 16px',
                            transition: 'all 0.3s',
                            '&:hover': {
                                backgroundColor: 'rgba(0,255,255,0.05)',
                                transform: 'translateX(5px)',
                                boxShadow: '0 0 15px rgba(0,255,255,0.2)'
                            },
                            '&::before': selectedAlgorithm === algo ? {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 3,
                                background: 'linear-gradient(#00ffff, #0080ff)'
                            } : {}
                        }}
                    >
                        <Box component="span" sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: selectedAlgorithm === algo ? '#00ffff' : '#ffffff33',
                            marginRight: 2,
                            boxShadow: selectedAlgorithm === algo ? '0 0 8px #00ffff' : 'none'
                        }} />
                        {algo}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default AlgorithmSwitch;

// import React from 'react';
// import { Box, ButtonGroup, Button } from '@mui/material';

// const AlgorithmSwitch = ({ selectedAlgorithm, onAlgorithmChange }) => {
//     const algorithms = ['AES', 'SM4', 'RC6', 'RSA1024', 'RSASHA1', 'ECC160', 'ECDSA', 'SHA1', 'SHA256', 'SHA3-512', 'RIPEMD160', 'PBKDF2', 'HMACSHA1', 'HMACSHA256', 'Base64', 'UTF-8'];

//     return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
//             <ButtonGroup variant="contained" aria-label="algorithm switch">
//                 {algorithms.map((algo) => (
//                     <Button
//                         key={algo}
//                         onClick={() => onAlgorithmChange(algo)}
//                         style={{ backgroundColor: selectedAlgorithm === algo ? '#007bff' : '#6c757d' }}
//                     >
//                         {algo}
//                     </Button>
//                 ))}
//             </ButtonGroup>
//         </Box>
//     );
// };

// export default AlgorithmSwitch;
