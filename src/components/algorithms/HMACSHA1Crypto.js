import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Container,
    CircularProgress,
    Divider
} from '@mui/material';
import { HMACSHA1 } from '../../api/hmacsha1';

const HMACSHA1Crypto = () => {
    const [key, setKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [encoding, setEncoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);

    const handleOperation = async () => {
        try {
            setIsLoading(true);
            const response = await HMACSHA1(key, plaintext, encoding);

            if (response.data.status !== 0) {
                alert(response.data.message);
                return;
            }
            setCiphertext(response.data.result);
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
                HMACSHA1 加密
            </Typography>

            <TextField
                label="密钥"
                fullWidth
                multiline
                rows={3}
                value={key}
                onChange={(e) => setKey(e.target.value)}
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
                label="明文"
                fullWidth
                multiline
                rows={4}
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

            <Box sx={{ mt: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleOperation}
                    sx={{ px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    加密
                </Button>
            </Box>

            <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                <RadioGroup row value={encoding} onChange={(e) => setEncoding(e.target.value)}>
                    <FormControlLabel value="hex" control={<Radio />} label="Hex" />
                    <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                </RadioGroup>
                <Box ml={2}>
                    <Typography>（密文格式）</Typography>
                </Box>
            </Box>

            <TextField
                label="密文"
                fullWidth
                multiline
                rows={2}
                value={ciphertext}
                margin="normal"
                InputProps={{
                    readOnly: true,
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
        </Container>
    );
};

export default HMACSHA1Crypto;