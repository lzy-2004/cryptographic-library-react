import React from 'react';
import { Box, ButtonGroup, Button } from '@mui/material';

const AlgorithmSwitch = ({ selectedAlgorithm, onAlgorithmChange }) => {
    const algorithms = ['AES', 'SM4', 'RC6', 'RSA1024', 'RSASHA1', 'ECC160', 'ECDSA', 'SHA1', 'SHA256', 'SHA3-512', 'RIPEMD160', 'PBKDF2', 'HMACSHA1', 'HMACSHA256', 'Base64', 'UTF-8'];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <ButtonGroup variant="contained" aria-label="algorithm switch">
                {algorithms.map((algo) => (
                    <Button
                        key={algo}
                        onClick={() => onAlgorithmChange(algo)}
                        style={{ backgroundColor: selectedAlgorithm === algo ? '#007bff' : '#6c757d' }}
                    >
                        {algo}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
};

export default AlgorithmSwitch;
