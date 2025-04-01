import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Container,
    CircularProgress,
    Divider
} from '@mui/material';
import { base64Encode, base64Decode } from '../../api/base64';

const Base64Crypto = () => {
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOperation = async (operation) => {
        try {
            setIsLoading(true);
            const response = operation === 'encode'
                ? await base64Encode(plaintext)
                : await base64Decode(ciphertext);

            if (response.data.status !== 0) {
                alert(response.data.message);
                return;
            }

            operation === 'encode'
                ? setCiphertext(response.data.result)
                : setPlaintext(response.data.result);
        } catch (error) {
            alert(`操作失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container sx={{ py: 4 }} className="container">
            {/* 哈希计算区域 */}
            <Typography variant="h5" gutterBottom>
                Base64 编码/解码
            </Typography>

            <TextField
                label="编码前"
                fullWidth
                multiline
                rows={6}
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                margin="normal"
                InputProps={{
                    sx: {
                        backgroundColor: '#f9f9f9',
                        '&:hover fieldset': { borderColor: 'primary.main' }
                    }
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1
                    }
                }}
            />

            <TextField
                label="编码后"
                fullWidth
                multiline
                rows={7}
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                margin="normal"
                InputProps={{
                    sx: {
                        backgroundColor: '#f9f9f9',
                        '&:hover fieldset': { borderColor: 'primary.main' }
                    }
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1
                    }
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOperation('encode')}
                    sx={{ px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    编码
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOperation('decode')}
                    sx={{ px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    解码
                </Button>
            </Box>
        </Container>
    );
};

export default Base64Crypto;

