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
import { sha256Hash } from '../../api/sha256';

const SHA256Crypto = () => {
    const [sha256Input, setSha256Input] = useState('');
    const [sha256Result, setSha256Result] = useState('');
    const [sha256Encoding, setSha256Encoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);

    const handleSha256 = async () => {
        try {
            setIsLoading(true);
            const response = await sha256Hash(sha256Input, sha256Encoding);
            setSha256Result(response.data.result);
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
                SHA256 哈希计算
            </Typography>

            <TextField
                label="输入内容"
                fullWidth
                multiline
                rows={7}
                value={sha256Input}
                onChange={(e) => setSha256Input(e.target.value)}
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
                    onClick={handleSha256}
                    sx={{ px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    计算哈希
                </Button>
            </Box>

            <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                <RadioGroup row value={sha256Encoding} onChange={(e) => setSha256Encoding(e.target.value)}>
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
                value={sha256Result}
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

export default SHA256Crypto;

