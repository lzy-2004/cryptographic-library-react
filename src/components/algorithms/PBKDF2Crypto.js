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
import { pbkdf2Encrypt } from '../../api/pbkdf2';

const PBKDF2Crypto = () => {
    const [password, setPassword] = useState('');
    const [salt, setSalt] = useState('');
    const [iterations, setIterations] = useState(10000);
    const [keyLength, setKeyLength] = useState(64);
    const [outputEncoding, setOutputEncoding] = useState('hex');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        try {
            setIsLoading(true);
            const response = await pbkdf2Encrypt(
                password,
                salt,
                parseInt(iterations),
                parseInt(keyLength),
                outputEncoding
            );

            if (response.data.result) {
                setResult(response.data.result);
            } else {
                alert(response.data.message || '生成失败');
            }
        } catch (error) {
            alert(`请求失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container sx={{ py: 4 }} className="container">
            {/* 哈希计算区域 */}
            <Typography variant="h5" gutterBottom>
                PBKDF2 密钥生成
            </Typography>

            {/* 第一部分：密码输入 */}
            <TextField
                label="密码"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* 第二部分：盐值输入 */}
            <TextField
                label="盐值"
                fullWidth
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
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

            {/* 第三部分：迭代次数 */}
            <TextField
                label="迭代次数"
                type="number"
                fullWidth
                value={iterations}
                onChange={(e) => setIterations(e.target.value)}
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

            {/* 第四部分：密钥长度 */}
            <TextField
                label="密钥长度（字节）"
                type="number"
                fullWidth
                value={keyLength}
                onChange={(e) => setKeyLength(e.target.value)}
                margin="normal"
                inputProps={{ min: 16, max: 512 }}
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

            {/* 第五部分：输出格式 */}
            <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                <RadioGroup row value={outputEncoding} onChange={(e) => setOutputEncoding(e.target.value)}>
                    <FormControlLabel value="hex" control={<Radio />} label="Hex" />
                    <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                </RadioGroup>
                <Box ml={2}>
                    <Typography>（生成密钥格式）</Typography>
                </Box>
            </Box>

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                sx={{ px: 4, borderRadius: 20, mt: 3 }}
                disabled={isLoading}
                endIcon={isLoading && <CircularProgress size={20} />}
            >
                生成密钥
            </Button>

            <TextField
                label="生成结果"
                fullWidth
                multiline
                rows={4}
                value={result}
                margin="normal"
                InputProps={{
                    readOnly: true,
                    style: { fontFamily: 'monospace' },
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

export default PBKDF2Crypto;
