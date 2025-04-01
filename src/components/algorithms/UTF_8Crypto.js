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
import { UTF_8Encode, UTF_8Decode } from '../../api/utf_8';

const UTF_8Crypto = () => {
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [encoding, setEncoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);

    const handleOperation = async (operation) => {
        try {
            setIsLoading(true);
            const response = operation === 'encode'
                ? await UTF_8Encode(plaintext, encoding)
                : await UTF_8Decode(ciphertext, encoding);

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
                UTF-8 编码/解码
            </Typography>

            <TextField
                label="编码前"
                fullWidth
                multiline
                rows={5}
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

            <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                <RadioGroup row value={encoding} onChange={(e) => setEncoding(e.target.value)}>
                    <FormControlLabel value="hex" control={<Radio />} label="Hex" />
                    <FormControlLabel value="binary" control={<Radio />} label="Binary" />
                    <FormControlLabel value="octal" control={<Radio />} label="Octal" />
                    <FormControlLabel value="decimal" control={<Radio />} label="Decimal" />
                </RadioGroup>
                <Box ml={2}>
                    <Typography>（编码格式）</Typography>
                </Box>
            </Box>

            <TextField
                label="编码后"
                fullWidth
                multiline
                rows={6}
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

export default UTF_8Crypto;
