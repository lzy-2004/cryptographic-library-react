import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box
} from '@mui/material';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { aesEncrypt, aesDecrypt } from '../../api/aes';

const AESCrypto = () => {
    const [key, setKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [encoding, setEncoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);

    const handleOperation = async (operation) => {
        try {
            setIsLoading(true);
            const response = operation === 'encrypt'
                ? await aesEncrypt(key, plaintext, encoding)
                : await aesDecrypt(key, ciphertext, encoding);

            if (response.data.status !== 0) {
                alert(response.data.message);
                return;
            }

            operation === 'encrypt'
                ? setCiphertext(response.data.result)
                : setPlaintext(response.data.result);
        } catch (error) {
            alert(`操作失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <Container sx={{ py: 4, maxWidth: '100%' }} className="container">


            <Typography variant="h5" gutterBottom>
                AES 加密/解密
            </Typography>

            <TextField
                label="密钥（16/24/32字节）"
                InputProps={{
                    sx: {
                        backgroundColor: '#f9f9f9',
                        '&:hover fieldset': { borderColor: 'primary.main' }
                    }
                }}
                fullWidth
                value={key}
                onChange={(e) => setKey(e.target.value)}
                margin="normal"
                inputProps={{ maxLength: 32 }}
                variant="outlined"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1
                    }
                }}
            />

            <TextField
                label="明文"
                InputProps={{
                    sx: {
                        backgroundColor: '#f9f9f9',
                        '&:hover fieldset': { borderColor: 'primary.main' }
                    }
                }}
                fullWidth
                multiline
                rows={4}
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                margin="normal"
                variant="outlined"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1
                    }
                }}
            />

            <Box display="flex" alignItems="center">
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
                InputProps={{
                    sx: {
                        backgroundColor: '#f9f9f9',
                        '&:hover fieldset': { borderColor: 'primary.main' }
                    }
                }}
                fullWidth
                multiline
                rows={4}
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                margin="normal"
                variant="outlined"
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
                    onClick={() => handleOperation('encrypt')}
                    sx={{
                        px: 4,
                        borderRadius: 20
                    }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    加密
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOperation('decrypt')}
                    sx={{
                        px: 4,
                        borderRadius: 20
                    }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    解密
                </Button>
            </Box>

        </Container>

    );
};

export default AESCrypto;