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
import {
    ecdsaSign,
    ecdsaVerify,
    ecdsaGenerateKey
} from '../../api/ecdsa';

const ECDSACrypto = () => {
    const [publicKeyX, setPublicKeyX] = useState('');
    const [publicKeyY, setPublicKeyY] = useState('');
    const [privateKey, setPrivateKey] = useState('');

    const [signMessage, setSignMessage] = useState('');
    const [signPrivateKey, setSignPrivateKey] = useState('');
    const [signatureR, setSignatureR] = useState('');
    const [signatureS, setSignatureS] = useState('');

    const [verifyPublicKeyX, setVerifyPublicKeyX] = useState('');
    const [verifyPublicKeyY, setVerifyPublicKeyY] = useState('');
    const [verifyMessage, setVerifyMessage] = useState('');
    const [verifySignatureR, setVerifySignatureR] = useState('');
    const [verifySignatureS, setVerifySignatureS] = useState('');
    const [verificationResult, setVerificationResult] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateKey = async () => {
        try {
            setIsLoading(true);
            const response = await ecdsaGenerateKey();
            setPublicKeyX(response.data.publicKeyX);
            setPublicKeyY(response.data.publicKeyY);
            setPrivateKey(response.data.privateKey);
        } catch (error) {
            alert(`生成失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSign = async () => {
        try {
            setIsLoading(true);
            const response = await ecdsaSign(privateKey, signMessage);
            setSignatureR(response.data.r);
            setSignatureS(response.data.s);
        } catch (error) {
            alert(`签名失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setIsLoading(true);
            const response = await ecdsaVerify(
                verifyPublicKeyX,
                verifyPublicKeyY,
                verifyMessage,
                verifySignatureR,
                verifySignatureS
            );
            setVerificationResult(response.data.valid ? '验证通过 ✅' : '验证失败 ❌');
        } catch (error) {
            alert(`验证失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }} className="container">
            {/* 密钥生成区域 */}
            <Typography variant="h5" gutterBottom>
                ECDSA 密钥生成
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
                    label="公钥X坐标"
                    fullWidth
                    multiline
                    rows={2}
                    value={publicKeyX}
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
                    label="公钥Y坐标"
                    fullWidth
                    multiline
                    rows={2}
                    value={publicKeyY}
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

            {/* 签名区域 */}
            <Typography variant="h5" gutterBottom>
                消息签名
            </Typography>
            <Box sx={{ mb: 3 }}>
                <TextField
                    label="私钥"
                    fullWidth
                    multiline
                    rows={4}
                    value={signPrivateKey}
                    onChange={(e) => setSignPrivateKey(e.target.value)}
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
                    label="待签名消息"
                    fullWidth
                    multiline
                    rows={4}
                    value={signMessage}
                    onChange={(e) => setSignMessage(e.target.value)}
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
                    onClick={handleSign}
                    sx={{ mt: 2, px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    生成签名
                </Button>
                <TextField
                    label="签名R值"
                    fullWidth
                    multiline
                    rows={2}
                    value={signatureR}
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
                    label="签名S值"
                    fullWidth
                    multiline
                    rows={2}
                    value={signatureS}
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

            {/* 验证区域 */}
            <Typography variant="h5" gutterBottom>
                签名验证
            </Typography>
            <Box sx={{ mb: 3 }}>
                <TextField
                    label="公钥X坐标"
                    fullWidth
                    multiline
                    rows={2}
                    value={verifyPublicKeyX}
                    onChange={(e) => setVerifyPublicKeyX(e.target.value)}
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
                    label="公钥Y坐标"
                    fullWidth
                    multiline
                    rows={2}
                    value={verifyPublicKeyY}
                    onChange={(e) => setVerifyPublicKeyY(e.target.value)}
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
                    label="原始消息"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifyMessage}
                    onChange={(e) => setVerifyMessage(e.target.value)}
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
                    label="签名R值"
                    fullWidth
                    multiline
                    rows={2}
                    value={verifySignatureR}
                    onChange={(e) => setVerifySignatureR(e.target.value)}
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
                    label="签名S值"
                    fullWidth
                    multiline
                    rows={2}
                    value={verifySignatureS}
                    onChange={(e) => setVerifySignatureS(e.target.value)}
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
                    onClick={handleVerify}
                    sx={{ mt: 2, px: 4, borderRadius: 20 }}
                    disabled={isLoading}
                    endIcon={isLoading && <CircularProgress size={20} />}
                >
                    验证签名
                </Button>
                <TextField
                    label="验证结果"
                    fullWidth
                    multiline
                    rows={2}
                    value={verificationResult}
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

export default ECDSACrypto;

