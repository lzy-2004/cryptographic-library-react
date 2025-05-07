import React, { useState } from 'react';
import { 
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
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
import { ecc160Encrypt, ecc160Decrypt, ecc160GenerateKey } from '../../../api/ecc160'

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ecc160-tabpanel-${index}`}
      aria-labelledby={`ecc160-tab-${index}`}
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
const NewECC160Crypto = () => {
  const [tabValue, setTabValue] = useState(0);
    
  // 加密状态
  const [plaintext, setPlaintext] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [encryptError, setEncryptError] = useState("");
  
  // 解密状态
  const [ciphertext, setCiphertext] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [decryptError, setDecryptError] = useState("");
  
  // 密钥生成状态
  const [generatedPublicKey, setGeneratedPublicKey] = useState("");
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
  const [keyGenLoading, setKeyGenLoading] = useState(false);
  const [keyGenError, setKeyGenError] = useState("");
  
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEncrypt = async () => {
    if (!plaintext || !publicKey ) {
      setEncryptError("请输入待加密文本和公钥");
      return;
    }
    
    setEncryptLoading(true);
    setEncryptError("");
    
    try {
      const response = await ecc160Encrypt(publicKey,plaintext);
      if (response && response.data) {
        setEncryptedText(response.data.data);
      } 
    } catch (error) {
      setEncryptError("加密过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setEncryptLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !privateKey) {
      setDecryptError("请输入待解密文本和私钥");
      return;
    }
    setDecryptLoading(true);
    setDecryptError("");
    
    try {
      const response = await ecc160Decrypt(privateKey, ciphertext);
      if (response && response.data) {
        setDecryptedText(response.data.data);
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
      const response = await ecc160GenerateKey();
      if (response && response.data) {
        setGeneratedPublicKey(response.data.publicKey);
        setGeneratedPrivateKey(response.data.privateKey);
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
    } else {
      setPrivateKey(generatedPrivateKey);
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
              ECC-160是一种非对称加密算法，使用160位密钥长度。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ECC算法基于椭圆曲线上的离散对数问题，相比RSA，在相同安全强度下需要更短的密钥长度。ECC-160提供约80位的安全强度，适用于轻量级加密应用场景。
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
          ECC公钥加密
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
          label="ECC公钥"
          multiline
          rows={4}
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          placeholder="输入ECC公钥"
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
        
        {/* <Grid container spacing={2} sx={{ mb: 3 }}>
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
        </Grid> */}

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
          加密结果 
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
              ECC160加密结果将显示在此处
            </Typography>
          </Box>
        )}

        {/* </Paper>   */}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}> */}
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          ECC私钥解密
        </Typography>

        <TextField
          label="待解密文本"
          multiline
          rows={4}
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          placeholder={`输入加密数据`}
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
          label="ECC私钥"
          multiline
          rows={4}
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="输入ECC私钥"
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
        
        {/* <Grid container spacing={2} sx={{ mb: 3 }}>
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
        </Grid> */}
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
              ECC160解密结果将显示在此处
            </Typography>
          </Box>
        )}
        {/* </Paper> */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}> */}
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          ECC密钥对生成
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
          {keyGenLoading ? '生成中...' : '生成ECC-160密钥对'}
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
              ECC公钥将显示在此处
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
              ECC私钥将显示在此处
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

export default NewECC160Crypto; 