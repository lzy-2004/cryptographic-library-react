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
import { ripemd160Hash } from '../../api/ripemd160';

const Ripemd160Crypto = () => {
    const [ripemd160Input, setRipemd160Input] = useState('');
    const [ripemd160Result, setRipemd160Result] = useState('');
    const [ripemd160Encoding, setRipemd160Encoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);

    const handleRipemd160 = async () => {
        try {
            setIsLoading(true);
            const response = await ripemd160Hash(ripemd160Input, ripemd160Encoding);
            setRipemd160Result(response.data.result);
        } catch (error) {
            alert(`哈希计算失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container sx={{ py: 4 }} className="container">
            {/* 哈希计算区域 */}
            <Typography variant="h5" gutterBottom>
                RIPEMD160 哈希计算
            </Typography>

            <TextField
                label="输入内容"
                fullWidth
                multiline
                rows={7}
                value={ripemd160Input}
                onChange={(e) => setRipemd160Input(e.target.value)}
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
                    onClick={handleRipemd160}
                    sx={{ px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    计算哈希
                </Button>
            </Box>

            <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                <RadioGroup row value={ripemd160Encoding} onChange={(e) => setRipemd160Encoding(e.target.value)}>
                    <FormControlLabel value="hex" control={<Radio />} label="Hex" />
                    <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                </RadioGroup>
                <Box ml={2}>
                    <Typography>（哈希格式）</Typography>
                </Box>
            </Box>

            <TextField
                label="哈希结果"
                fullWidth
                multiline
                rows={4}
                value={ripemd160Result}
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

export default Ripemd160Crypto;
