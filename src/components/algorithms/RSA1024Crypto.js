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
import { rsa1024Encrypt, rsa1024Decrypt, rsa1024GenerateKey } from '../../api/rsa1024';

const RSA1024Crypto = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [modulus, setModulus] = useState('');

    const [encryptData, setEncryptData] = useState('');
    const [encryptPublicKey, setEncryptPublicKey] = useState('');
    const [encryptModulus, setEncryptModulus] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [encryptEncoding, setEncryptEncoding] = useState('base64');

    const [decryptData, setDecryptData] = useState('');
    const [decryptPrivateKey, setDecryptPrivateKey] = useState('');
    const [decryptModulus, setDecryptModulus] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [decryptEncoding, setDecryptEncoding] = useState('base64');

    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateKey = async () => {
        try {
            setIsLoading(true);
            const response = await rsa1024GenerateKey();
            setPublicKey(response.data.publicKey);
            setPrivateKey(response.data.privateKey);
            setModulus(response.data.modulus);
        } catch (error) {
            alert(`生成失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEncrypt = async () => {
        try {
            setIsLoading(true);
            const response = await rsa1024Encrypt(
                encryptData,
                publicKey,
                encryptModulus,
                encryptEncoding
            );
            setCiphertext(response.data.result);
        } catch (error) {
            alert(`加密失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecrypt = async () => {
        try {
            setIsLoading(true);
            const response = await rsa1024Decrypt(
                decryptData,
                privateKey,
                decryptModulus,
                decryptEncoding
            );
            setPlaintext(response.data.result);
        } catch (error) {
            alert(`解密失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }} className="container">
            <Typography variant="h5" gutterBottom>
                RSA 1024 密钥生成
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleGenerateKey}
                    // sx={{ mb: 2 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                    fullWidth
                    sx={{ mt: 2, px: 4, borderRadius: 20 }}
                >
                    生成密钥对
                </Button>
                <TextField
                    label="公钥"
                    fullWidth
                    multiline
                    rows={4}
                    value={publicKey}
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
                <TextField
                    label="私钥"
                    fullWidth
                    multiline
                    rows={4}
                    value={privateKey}
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
                <TextField
                    label="模数"
                    fullWidth
                    multiline
                    rows={4}
                    value={modulus}
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
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
                公钥加密
            </Typography>
            <Box sx={{ mb: 3 }}>
                <TextField
                    label="公钥"
                    fullWidth
                    multiline
                    rows={4}
                    value={encryptPublicKey}
                    onChange={(e) => setEncryptPublicKey(e.target.value)}
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
                    label="模数"
                    fullWidth
                    multiline
                    rows={4}
                    value={encryptModulus}
                    onChange={(e) => setEncryptModulus(e.target.value)}
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
                    value={encryptData}
                    onChange={(e) => setEncryptData(e.target.value)}
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
                <Box display="flex" alignItems="center">
                    <RadioGroup row value={encryptEncoding} onChange={(e) => setEncryptEncoding(e.target.value)}>
                        <FormControlLabel value="hex" control={<Radio />} label="Hex" />
                        <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                    </RadioGroup>
                    <Box ml={2}>
                        <Typography>（密文格式）</Typography>
                    </Box>
                </Box>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleEncrypt}
                    sx={{ mt: 2, px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    加密
                </Button>
                <TextField
                    label="加密结果"
                    fullWidth
                    multiline
                    rows={4}
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
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
                私钥解密
            </Typography>
            <Box sx={{ mb: 3 }}>
                <TextField
                    label="私钥"
                    fullWidth
                    multiline
                    rows={4}
                    value={decryptPrivateKey}
                    onChange={(e) => setDecryptPrivateKey(e.target.value)}
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
                    label="模数"
                    fullWidth
                    multiline
                    rows={4}
                    value={decryptModulus}
                    onChange={(e) => setDecryptModulus(e.target.value)}
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
                <Box display="flex" alignItems="center">
                    <RadioGroup row value={decryptEncoding} onChange={(e) => setDecryptEncoding(e.target.value)}>
                        <FormControlLabel value="hex" control={<Radio />} label="Hex" />
                        <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                    </RadioGroup>
                    <Box ml={2}> {/* 添加左边距 */}
                        <Typography>（密文格式）</Typography>
                    </Box>
                </Box>
                <TextField
                    label="密文"
                    fullWidth
                    multiline
                    rows={4}
                    value={decryptData}
                    onChange={(e) => setDecryptData(e.target.value)}
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
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleDecrypt}
                    sx={{ mt: 2, px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    解密
                </Button>
                <TextField
                    label="解密结果"
                    fullWidth
                    multiline
                    rows={4}
                    value={plaintext}
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
            </Box>
        </Container>
    );
};

export default RSA1024Crypto;