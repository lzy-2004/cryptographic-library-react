import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Container,
    CircularProgress,
    Divider,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import {
    ecc160Encrypt,
    ecc160Decrypt,
    ecc160GenerateKey
} from '../../api/ecc160';

const ECC160Crypto = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');

    const [encryptPublicKey, setEncryptPublicKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');

    const [decryptPrivateKey, setDecryptPrivateKey] = useState('');
    const [ciphertextInput, setCiphertextInput] = useState('');
    const [decryptedText, setDecryptedText] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateKey = async () => {
        try {
            setIsLoading(true);
            const response = await ecc160GenerateKey();
            setPublicKey(response.data.publicKey);
            setPrivateKey(response.data.privateKey);
        } catch (error) {
            alert(`生成失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEncrypt = async () => {
        try {
            setIsLoading(true);
            const response = await ecc160Encrypt(
                encryptPublicKey,
                plaintext
            );
            setCiphertext(response.data.data);
        } catch (error) {
            alert(`加密失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecrypt = async () => {
        try {
            setIsLoading(true);
            const response = await ecc160Decrypt(
                decryptPrivateKey,
                ciphertextInput
            );
            setDecryptedText(response.data.data);
        } catch (error) {
            alert(`解密失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }} className="container">
            {/* 密钥对生成区域 */}
            <Typography variant="h5" gutterBottom>
                ECC-160 密钥生成
            </Typography>
            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleGenerateKey}
                    fullWidth
                    sx={{ mt: 2, px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
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
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 加密区域 */}
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
                    label="明文（要求必须是Base64格式）"
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

            {/* 解密区域 */}
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
                    label="密文（要求必须是Base64格式）"
                    fullWidth
                    multiline
                    rows={4}
                    value={ciphertextInput}
                    onChange={(e) => setCiphertextInput(e.target.value)}
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
                    value={decryptedText}
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

export default ECC160Crypto;

