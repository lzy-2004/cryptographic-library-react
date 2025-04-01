import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Divider,
    RadioGroup,
    FormControlLabel,
    Radio,
    Container,
    CircularProgress
} from '@mui/material';
import { rsasha1Sign, rsasha1Verify, rsasha1GenerateKey } from '../../api/rsasha1';

const RSASHA1Crypto = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [modulus, setModulus] = useState('');

    const [signData, setSignData] = useState('');
    const [signPrivateKey, setSignPrivateKey] = useState('');
    const [signModulus, setSignModulus] = useState('');
    const [signature, setSignature] = useState('');

    const [verifyData, setVerifyData] = useState('');
    const [verifySignature, setVerifySignature] = useState('');
    const [verifyPublicKey, setVerifyPublicKey] = useState('');
    const [verifyModulus, setVerifyModulus] = useState('');
    const [verificationResult, setVerificationResult] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateKey = async () => {
        try {
            setIsLoading(true);
            const response = await rsasha1GenerateKey();
            setPublicKey(response.data.publicKey);
            setPrivateKey(response.data.privateKey);
            setModulus(response.data.modulus);
        } catch (error) {
            alert(`生成失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSign = async () => {
        try {
            setIsLoading(true);
            const response = await rsasha1Sign(
                signData,
                signPrivateKey,
                signModulus
            );
            setSignature(response.data.result);
        } catch (error) {
            alert(`签名失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setIsLoading(true);
            const response = await rsasha1Verify(
                verifyData,
                verifySignature,
                verifyPublicKey,
                verifyModulus
            );
            setVerificationResult(response.data.result ? '验证通过 ✅' : '验证失败 ❌');
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
                RSA-SHA1 密钥生成
            </Typography>
            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleGenerateKey}
                    fullWidth
                    sx={{
                        mt: 2,
                        px: 4,
                        borderRadius: 20
                    }}
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
                    label="模数"
                    fullWidth
                    multiline
                    rows={4}
                    value={signModulus}
                    onChange={(e) => setSignModulus(e.target.value)}
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
                    label="原始数据"
                    fullWidth
                    multiline
                    rows={4}
                    value={signData}
                    onChange={(e) => setSignData(e.target.value)}
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
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSign}
                        sx={{ px: 4, borderRadius: 20 }}
                        disabled={isLoading}
                        endIcon={isLoading && <CircularProgress size={20} />}
                    >
                        生成签名
                    </Button>
                </Box>
                <TextField
                    label="签名结果"
                    fullWidth
                    multiline
                    rows={4}
                    value={signature}
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
                    label="公钥"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifyPublicKey}
                    onChange={(e) => setVerifyPublicKey(e.target.value)}
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
                    value={verifyModulus}
                    onChange={(e) => setVerifyModulus(e.target.value)}
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
                    label="原始数据"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifyData}
                    onChange={(e) => setVerifyData(e.target.value)}
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
                    label="待验证签名"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifySignature}
                    onChange={(e) => setVerifySignature(e.target.value)}
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
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2
                }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleVerify}
                        sx={{
                            mt: 2,
                            px: 4,
                            borderRadius: 20
                        }}
                        disabled={isLoading}
                        endIcon={isLoading && <CircularProgress size={20} />}
                    >
                        验证签名
                    </Button>
                </Box>
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

export default RSASHA1Crypto;


