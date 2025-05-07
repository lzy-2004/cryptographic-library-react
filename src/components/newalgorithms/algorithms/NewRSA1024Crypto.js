import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Paper, 
  Typography, 
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InfoIcon from '@mui/icons-material/Info';
import { rsa1024Encrypt, rsa1024Decrypt, rsa1024GenerateKey } from '../../../api/rsa1024';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rsa-tabpanel-${index}`}
      aria-labelledby={`rsa-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const NewRSA1024Crypto = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // 加密状态
  const [plaintext, setPlaintext] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [encryptModulus, setEncryptModulus] = useState("")
  const [encryptedText, setEncryptedText] = useState("");
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [encryptError, setEncryptError] = useState("");
  
  // 解密状态
  const [ciphertext, setCiphertext] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [decryptModulus, setDecryptModulus] = useState("")
  const [decryptedText, setDecryptedText] = useState("");
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [decryptError, setDecryptError] = useState("");
  
  // 密钥生成状态
  const [generatedPublicKey, setGeneratedPublicKey] = useState("");
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
  const [generatedModulus, setGeneratedModulus] = useState("")
  const [keyGenLoading, setKeyGenLoading] = useState(false);
  const [keyGenError, setKeyGenError] = useState("");
  
  // 输出编码
  const [outputEncoding, setOutputEncoding] = useState("base64");
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEncrypt = async () => {
    if (!plaintext || !publicKey||!encryptModulus) {
      setEncryptError("请输入待加密文本、公钥和模数");
      return;
    }
    
    setEncryptLoading(true);
    setEncryptError("");
    
    try {
      const response = await rsa1024Encrypt(plaintext, publicKey, encryptModulus, outputEncoding);
      
      if (response && response.data) {
        if (response.data.status !== undefined && response.data.status !== 0) {
          throw new Error(response.data.message || '加密失败');
        }
        setEncryptedText(response.data.result);
      } else {
        setEncryptError(response.data?.message || "加密失败");
      }
    } catch (error) {
      setEncryptError("加密过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setEncryptLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !privateKey||!decryptModulus) {
      setDecryptError("请输入待解密文本、私钥和模数");
      return;
    }
    
    setDecryptLoading(true);
    setDecryptError("");
    
    try {
      const response = await rsa1024Decrypt(ciphertext, privateKey, decryptModulus, outputEncoding);
      
      if (response && response.data) {
        if (response.data.status !== undefined && response.data.status !== 0) {
          throw new Error(response.data.message || '解密失败');
        }
        setDecryptedText(response.data.result);
      } else {
        setDecryptError(response.data?.message || "解密失败");
      }
    } catch (error) {
      setDecryptError("解密过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setDecryptLoading(false);
    }
  };

  const handleGenerateKeyPair = async () => {
    setKeyGenLoading(true);
    setKeyGenError("");
    
    try {
      const response = await rsa1024GenerateKey();
      
      if (response && response.data) {
        setGeneratedPublicKey(response.data.publicKey);
        setGeneratedPrivateKey(response.data.privateKey);
        setGeneratedModulus(response.data.modulus);
      } else {
        setKeyGenError(response.data?.message || "密钥生成失败");
      }
    } catch (error) {
      setKeyGenError("密钥生成过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setKeyGenLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowCopiedSnackbar(true);
        setTimeout(() => setShowCopiedSnackbar(false), 2000);
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  const handleUseGeneratedKey = (type) => {
    if (type === 'encrypt') {
      setPublicKey(generatedPublicKey);
      setEncryptModulus(generatedModulus);
    } else {
      setPrivateKey(generatedPrivateKey);
      setDecryptModulus(generatedModulus);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <InfoIcon sx={{ color: '#757575', mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: '#424242' }}>
              RSA-1024是一种非对称加密算法，使用1024位密钥长度。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              RSA算法基于大数分解的困难性，广泛用于数据加密和数字签名。RSA-1024每次最多只能加密约117字节，对于更长的数据，应使用混合加密方案。
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#757575',
            },
          }}
        >
          <Tab 
            icon={<LockIcon />} 
            label="加密" 
            id="rsa-tab-0" 
            aria-controls="rsa-tabpanel-0"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
          <Tab 
            icon={<LockOpenIcon />} 
            label="解密" 
            id="rsa-tab-1" 
            aria-controls="rsa-tabpanel-1"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
          <Tab 
            icon={<VpnKeyIcon />} 
            label="密钥对生成" 
            id="rsa-tab-2" 
            aria-controls="rsa-tabpanel-2"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
        </Tabs>
      </Box>
      
      
      
      
      <TabPanel value={tabValue} index={0}>
        {/* <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}> */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
            <InfoIcon sx={{ mr: 1, color: '#616161' }} />
            RSA公钥加密
          </Typography>
          
          <TextField
            label="待加密文本"
            multiline
            rows={4}
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="输入需要加密的明文"
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#9e9e9e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#757575',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 500,
                color: '#000000',
                fontSize: '1rem',
              }
            }}
          />
          
          <TextField
            label="RSA公钥"
            multiline
            rows={4}
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="输入RSA公钥"
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#9e9e9e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#757575',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 500,
                color: '#000000',
                fontSize: '1rem',
                fontFamily: 'monospace',
              }
            }}
            InputProps={{
              endAdornment: generatedPublicKey ? (
                <Tooltip title="使用生成的公钥">
                  <IconButton 
                    onClick={() => handleUseGeneratedKey('encrypt')}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              ) : null
            }}
          />
          <TextField
            label="模数"
            multiline
            rows={4}
            value={encryptModulus}
            onChange={(e) => setEncryptModulus(e.target.value)}
            placeholder="输入模数"
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#9e9e9e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#757575',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 500,
                color: '#000000',
                fontSize: '1rem',
                fontFamily: 'monospace',
              }
            }}
          />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <InputLabel id="rsa-encoding-label">密文格式</InputLabel>
                <Select
                  labelId="rsa-encoding-label"
                  id="rsa-encoding"
                  value={outputEncoding}
                  label="输出编码"
                  onChange={(e) => setOutputEncoding(e.target.value)}
                  sx={{
                    '& .MuiSelect-select': {
                      fontWeight: 500,
                      color: '#000000',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#424242',
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  <MenuItem value="base64">Base64</MenuItem>
                  <MenuItem value="hex">十六进制</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            onClick={handleEncrypt}
            disabled={encryptLoading}
            startIcon={encryptLoading ? <CircularProgress size={20} /> : <LockIcon />}
            sx={{
              mb: 3,
              bgcolor: '#616161',
              '&:hover': {
                bgcolor: '#424242',
              },
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {encryptLoading ? '加密中...' : '使用公钥加密数据'}
          </Button>
          
          {encryptError && (
            <Alert severity="error" sx={{ mb: 3 }}>{encryptError}</Alert>
          )}

          <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
            <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
            加密结果 ({outputEncoding === 'base64' ? 'Base64' : outputEncoding === 'hex' ? '十六进制' : '二进制'})
          </Typography>
          
          {encryptedText ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={4}
                value={encryptedText}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { 
                  fontFamily: 'monospace',
                  bgcolor: '#f5f5f5',
                  wordBreak: 'break-all',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                    borderWidth: '1px',
                  },
                  '& textarea': {
                    fontWeight: 500,
                    color: '#000000',
                    fontSize: '1rem',
                  }
                }
              }}
            />
            <IconButton 
              onClick={() => copyToClipboard(encryptedText)}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8,
                color: '#616161'
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 8,
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              RSA1024加密结果将显示在此处
            </Typography>
          </Box>
        )}

        {/* </Paper>   */}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {/* <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}> */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
            <InfoIcon sx={{ mr: 1, color: '#616161' }} />
            RSA私钥解密
          </Typography>
          
          <TextField
            label="待解密文本"
            multiline
            rows={4}
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            placeholder={`输入${outputEncoding === 'base64' ? 'Base64' : outputEncoding === 'hex' ? '十六进制' : '二进制'}编码的加密数据`}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#9e9e9e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#757575',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 500,
                color: '#000000',
                fontSize: '1rem',
                fontFamily: 'monospace',
              }
            }}
          />
          
          <TextField
            label="RSA私钥"
            multiline
            rows={4}
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="输入RSA私钥"
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#9e9e9e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#757575',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 500,
                color: '#000000',
                fontSize: '1rem',
                fontFamily: 'monospace',
              }
            }}
            InputProps={{
              endAdornment: generatedPrivateKey ? (
                <Tooltip title="使用生成的私钥">
                  <IconButton 
                    onClick={() => handleUseGeneratedKey('decrypt')}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              ) : null
            }}
          />
          <TextField
            label="模数"
            multiline
            rows={4}
            value={decryptModulus}
            onChange={(e) => setDecryptModulus(e.target.value)}
            placeholder="输入模数"
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#9e9e9e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#757575',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 500,
                color: '#000000',
                fontSize: '1rem',
                fontFamily: 'monospace',
              }
            }}
          />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <InputLabel id="rsa-encoding-label">密文格式</InputLabel>
                <Select
                  labelId="rsa-encoding-label"
                  id="rsa-encoding"
                  value={outputEncoding}
                  label="输出编码"
                  onChange={(e) => setOutputEncoding(e.target.value)}
                  sx={{
                    '& .MuiSelect-select': {
                      fontWeight: 500,
                      color: '#000000',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#424242',
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  <MenuItem value="base64">Base64</MenuItem>
                  <MenuItem value="hex">十六进制</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            onClick={handleDecrypt}
            disabled={decryptLoading}
            startIcon={decryptLoading ? <CircularProgress size={20} /> : <LockOpenIcon />}
            sx={{
              mb: 3,
              bgcolor: '#616161',
              '&:hover': {
                bgcolor: '#424242',
              },
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {decryptLoading ? '解密中...' : '使用私钥解密数据'}
          </Button>
          
          {decryptError && (
            <Alert severity="error" sx={{ mb: 3 }}>{decryptError}</Alert>
          )}
        
        
        {/* <Paper elevation={1} sx={{ p: 3, position: 'relative', bgcolor: 'white' }}> */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
            <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
            解密结果
          </Typography>
          
        {decryptedText ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={4}
              value={decryptedText}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { 
                  fontFamily: 'monospace',
                  bgcolor: '#f5f5f5',
                  wordBreak: 'break-all',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                    borderWidth: '1px',
                  },
                  '& textarea': {
                    fontWeight: 500,
                    color: '#000000',
                    fontSize: '1rem',
                  }
                }
              }}
            />
            <IconButton 
              onClick={() => copyToClipboard(decryptedText)}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8,
                color: '#616161'
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 8,
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              RSA1024解密结果将显示在此处
            </Typography>
          </Box>
        )}
        {/* </Paper> */}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {/* <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}> */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
            <InfoIcon sx={{ mr: 1, color: '#616161' }} />
            RSA密钥对生成
          </Typography>
          
          <Button
            variant="contained"
            fullWidth
            onClick={handleGenerateKeyPair}
            disabled={keyGenLoading}
            startIcon={keyGenLoading ? <CircularProgress size={20} /> : <VpnKeyIcon />}
            sx={{
              mb: 3,
              bgcolor: '#616161',
              '&:hover': {
                bgcolor: '#424242',
              },
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {keyGenLoading ? '生成中...' : '生成RSA-1024密钥对'}
          </Button>
          
          {keyGenError && (
            <Alert severity="error" sx={{ mb: 3 }}>{keyGenError}</Alert>
          )}
        {/* </Paper> */}
        
        {generatedPublicKey ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              label="生成的公钥"
              multiline
              rows={4}
              value={generatedPublicKey}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { 
                  fontFamily: 'monospace',
                  bgcolor: '#f5f5f5',
                  wordBreak: 'break-all',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                    borderWidth: '1px',
                  },
                  '& textarea': {
                    fontWeight: 500,
                    color: '#000000',
                    fontSize: '1rem',
                  }
                }
              }}
              sx={{ mb: 2 }}
            />
            <IconButton 
              onClick={() => copyToClipboard(generatedPublicKey)}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8,
                color: '#616161'
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 8,
            mt: 2
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              RSA公钥将显示在此处
            </Typography>
          </Box>
        )}

        {generatedPrivateKey ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={4}
              label="生成的私钥"
              value={generatedPrivateKey}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  fontFamily: 'monospace',
                  bgcolor: '#f5f5f5',
                  wordBreak: 'break-all',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                    borderWidth: '1px',
                  },
                  '& textarea': {
                    fontWeight: 500,
                    color: '#000000',
                    fontSize: '1rem',
                  }
                }
              }}
              sx={{ mb: 2 }}
            />
            <IconButton
              onClick={() => copyToClipboard(generatedPrivateKey)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#616161'
              }}
            >
              <ContentCopyIcon />
            </IconButton>

          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 8,
            mt: 2
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              RSA私钥将显示在此处
            </Typography>
          </Box>
        )}

        {generatedModulus ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={4}
              label="生成的模数"
              value={generatedModulus}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  fontFamily: 'monospace',
                  bgcolor: '#f5f5f5',
                  wordBreak: 'break-all',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                    borderWidth: '1px',
                  },
                  '& textarea': {
                    fontWeight: 500,
                    color: '#000000',
                    fontSize: '1rem',
                  }
                }
              }}
              sx={{ mb: 2 }}
            />
            <IconButton
              onClick={() => copyToClipboard(generatedModulus)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#616161'
              }}
            >
              <ContentCopyIcon />
            </IconButton>

          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 8,
            mt: 2
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              RSA模数将显示在此处
            </Typography>
          </Box>
        )}
      </TabPanel>
      
      <Snackbar
        open={showCopiedSnackbar}
        autoHideDuration={2000}
        message="已复制到剪贴板"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default NewRSA1024Crypto;