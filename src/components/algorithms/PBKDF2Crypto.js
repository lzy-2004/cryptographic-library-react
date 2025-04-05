import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Grid
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
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
        <Box sx={{
            color: '#fff',
            minHeight: '100vh',
            p: 4,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                opacity: 0.2
            }
        }}>
            {/* 标题 */}
            <Typography variant="h3" sx={{
                textAlign: 'center',
                mb: 2,
                textShadow: '0 0 5px #00ffff',
                animation: 'glow 2s ease-in-out infinite',
                '@keyframes glow': {
                    '0%': { textShadow: '0 0 10px #00ffff' },
                    '50%': { textShadow: '0 0 20px #00ffff, 0 0 30px #00ffff' },
                    '100%': { textShadow: '0 0 10px #00ffff' }
                }
            }}>
                PBKDF2 密钥生成
            </Typography>

            <Grid container spacing={4} sx={{
                maxWidth: 1400,
                margin: '0 auto',
                justifyContent: 'center',
                '@media (max-width: 600px)': {
                    '& > .MuiGrid-item': {
                        width: '100%',
                        maxWidth: 'none',
                        marginBottom: 2
                    }
                }
            }}>
                {/* 参数输入区 */}
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        mb: 2,
                        height: 310,
                        width: 450,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        p: 3,
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,255,255,0.2)'
                        }
                    }}>
                        <Typography variant="h5" sx={{
                            color: '#00ff9d',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            ⚙️ 参数设置
                        </Typography>

                        <Grid container direction="column" spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="密码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={inputStyle}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="盐值"
                                    value={salt}
                                    onChange={(e) => setSalt(e.target.value)}
                                    sx={inputStyle}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="迭代次数"
                                    type="number"
                                    value={iterations}
                                    onChange={(e) => setIterations(e.target.value)}
                                    sx={inputStyle}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="密钥长度（字节）"
                                    type="number"
                                    value={keyLength}
                                    onChange={(e) => setKeyLength(e.target.value)}
                                    inputProps={{ min: 16, max: 512 }}
                                    sx={inputStyle}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* 结果输出区 */}
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        height: 310,
                        width: 450,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        p: 3,
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,255,255,0.2)'
                        }
                    }}>
                        <Typography variant="h5" sx={{
                            color: '#00ff9d',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            🔑 生成结果
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            value={result}
                            InputProps={{ readOnly: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    '& fieldset': {
                                        borderColor: '#4a4a4a',
                                        transition: 'all 0.3s'
                                    },
                                    '&:hover fieldset': { borderColor: '#00ffff' },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00ffff',
                                        boxShadow: '0 0 15px rgba(0,255,255,0.3)'
                                    }
                                }
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* 控制区域 */}
            <Box sx={{
                mt: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                flexWrap: 'wrap',
                maxWidth: 1400,
                margin: '0 auto'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    p: 2,
                    backdropFilter: 'blur(10px)'
                }}>
                    <RadioGroup row value={outputEncoding} onChange={(e) => setOutputEncoding(e.target.value)}>
                        <FormControlLabel
                            value="hex"
                            control={<Radio sx={{ color: '#00ffff!important' }} />}
                            label={<Typography sx={{ color: '#fff' }}>Hex</Typography>}
                        />
                        <FormControlLabel
                            value="base64"
                            control={<Radio sx={{ color: '#ff00ff!important' }} />}
                            label={<Typography sx={{ color: '#fff' }}>Base64</Typography>}
                        />
                    </RadioGroup>
                    <Typography variant="body1" sx={{
                        color: '#00ff9d',
                        fontSize: '0.9rem'
                    }}>
                        输出格式
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    sx={{
                        background: 'linear-gradient(45deg, #00ffff 30%, #0080ff 90%)',
                        color: '#000',
                        px: 6,
                        minWidth: 200,
                        borderRadius: 25,
                        fontSize: '1.1rem',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 25px rgba(0,255,255,0.6)'
                        },
                        transition: 'all 0.3s'
                    }}
                    endIcon={isLoading && <CircularProgress size={24} sx={{ color: '#000' }} />}
                >
                    生成密钥
                </Button>
            </Box>
        </Box>
    );
};

// 统一输入框样式
const inputStyle = {
    '& .MuiOutlinedInput-root': {
        color: '#fff',
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        '& fieldset': {
            borderColor: '#4a4a4a',
            transition: 'all 0.3s'
        },
        '&:hover fieldset': { borderColor: '#00ffff' },
        '&.Mui-focused fieldset': {
            borderColor: '#00ffff',
            boxShadow: '0 0 15px rgba(0,255,255,0.3)'
        }
    },
    '& .MuiInputLabel-root': {
        color: '#00ffff!important'
    }
};

export default PBKDF2Crypto;

// import React, { useState } from 'react';
// import {
//     TextField,
//     Button,
//     Typography,
//     RadioGroup,
//     FormControlLabel,
//     Radio,
//     Box,
//     Container,
//     CircularProgress,
//     Divider
// } from '@mui/material';
// import { pbkdf2Encrypt } from '../../api/pbkdf2';

// const PBKDF2Crypto = () => {
//     const [password, setPassword] = useState('');
//     const [salt, setSalt] = useState('');
//     const [iterations, setIterations] = useState(10000);
//     const [keyLength, setKeyLength] = useState(64);
//     const [outputEncoding, setOutputEncoding] = useState('hex');
//     const [result, setResult] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const handleGenerate = async () => {
//         try {
//             setIsLoading(true);
//             const response = await pbkdf2Encrypt(
//                 password,
//                 salt,
//                 parseInt(iterations),
//                 parseInt(keyLength),
//                 outputEncoding
//             );

//             if (response.data.result) {
//                 setResult(response.data.result);
//             } else {
//                 alert(response.data.message || '生成失败');
//             }
//         } catch (error) {
//             alert(`请求失败: ${error.response?.data?.message || error.message}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Container sx={{ py: 4 }} className="container">
//             {/* 哈希计算区域 */}
//             <Typography variant="h5" gutterBottom>
//                 PBKDF2 密钥生成
//             </Typography>

//             {/* 第一部分：密码输入 */}
//             <TextField
//                 label="密码"
//                 fullWidth
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 margin="normal"
//                 InputProps={{
//                     sx: {
//                         backgroundColor: '#f9f9f9',
//                         '&:hover fieldset': { borderColor: 'primary.main' }
//                     }
//                 }}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: 1
//                     }
//                 }}
//             />

//             {/* 第二部分：盐值输入 */}
//             <TextField
//                 label="盐值"
//                 fullWidth
//                 value={salt}
//                 onChange={(e) => setSalt(e.target.value)}
//                 margin="normal"
//                 InputProps={{
//                     sx: {
//                         backgroundColor: '#f9f9f9',
//                         '&:hover fieldset': { borderColor: 'primary.main' }
//                     }
//                 }}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: 1
//                     }
//                 }}
//             />

//             {/* 第三部分：迭代次数 */}
//             <TextField
//                 label="迭代次数"
//                 type="number"
//                 fullWidth
//                 value={iterations}
//                 onChange={(e) => setIterations(e.target.value)}
//                 margin="normal"
//                 InputProps={{
//                     sx: {
//                         backgroundColor: '#f9f9f9',
//                         '&:hover fieldset': { borderColor: 'primary.main' }
//                     }
//                 }}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: 1
//                     }
//                 }}
//             />

//             {/* 第四部分：密钥长度 */}
//             <TextField
//                 label="密钥长度（字节）"
//                 type="number"
//                 fullWidth
//                 value={keyLength}
//                 onChange={(e) => setKeyLength(e.target.value)}
//                 margin="normal"
//                 inputProps={{ min: 16, max: 512 }}
//                 InputProps={{
//                     sx: {
//                         backgroundColor: '#f9f9f9',
//                         '&:hover fieldset': { borderColor: 'primary.main' }
//                     }
//                 }}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: 1
//                     }
//                 }}
//             />

//             {/* 第五部分：输出格式 */}
//             <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
//                 <RadioGroup row value={outputEncoding} onChange={(e) => setOutputEncoding(e.target.value)}>
//                     <FormControlLabel value="hex" control={<Radio />} label="Hex" />
//                     <FormControlLabel value="base64" control={<Radio />} label="Base64" />
//                 </RadioGroup>
//                 <Box ml={2}>
//                     <Typography>（生成密钥格式）</Typography>
//                 </Box>
//             </Box>

//             <Button
//                 fullWidth
//                 variant="contained"
//                 color="primary"
//                 onClick={handleGenerate}
//                 sx={{ px: 4, borderRadius: 20, mt: 3 }}
//                 disabled={isLoading}
//                 endIcon={isLoading && <CircularProgress size={20} />}
//             >
//                 生成密钥
//             </Button>

//             <TextField
//                 label="生成结果"
//                 fullWidth
//                 multiline
//                 rows={4}
//                 value={result}
//                 margin="normal"
//                 InputProps={{
//                     readOnly: true,
//                     style: { fontFamily: 'monospace' },
//                     sx: {
//                         backgroundColor: '#f9f9f9',
//                         '&:hover fieldset': { borderColor: 'primary.main' }
//                     }
//                 }}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: 1
//                     }
//                 }}
//             />
//         </Container>
//     );
// };

// export default PBKDF2Crypto;
