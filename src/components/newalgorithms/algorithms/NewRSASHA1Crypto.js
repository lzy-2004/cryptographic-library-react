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
  Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InfoIcon from '@mui/icons-material/Info';
import { rsasha1Sign, rsasha1Verify, rsasha1GenerateKey } from '../../../api/rsasha1';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rsasha1-tabpanel-${index}`}
      aria-labelledby={`rsasha1-tab-${index}`}
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

const NewRSASHA1Crypto = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // 签名状态
  const [signMessage, setSignMessage] = useState("");
  const [signPrivateKey, setSignPrivateKey] = useState("");
  const [signModulus, setSignModulus] = useState("");
  const [signature, setSignature] = useState("");
  const [signLoading, setSignLoading] = useState(false);
  const [signError, setSignError] = useState("");
  
  // 验签状态
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [verifyPublicKey, setVerifyPublicKey] = useState("");
  const [verifyModulus, setVerifyModulus] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  
  // 密钥生成状态
  const [generatedPublicKey, setGeneratedPublicKey] = useState("");
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
  const [generatedModulus, setGeneratedModulus] = useState("");
  const [keyGenLoading, setKeyGenLoading] = useState(false);
  const [keyGenError, setKeyGenError] = useState("");
  
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSign = async () => {
    if (!signMessage || !signPrivateKey || !signModulus) {
      setSignError("请输入消息内容、私钥和模数");
      return;
    }
    
    setSignLoading(true);
    setSignError("");
    
    try {
      const response = await rsasha1Sign(signMessage, signPrivateKey, signModulus);
      
      if (response && response.data) {
        if (response.data.status !== undefined && response.data.status !== 0) {
          throw new Error(response.data.message || '签名生成失败');
        }
        setSignature(response.data.result);
      } else {
        setSignError(response.data?.message || "签名生成失败");
      }
    } catch (error) {
      setSignError("签名生成过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setSignLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyMessage || !verifySignature || !verifyPublicKey || !verifyModulus) {
      setVerifyError("请输入消息内容、签名、公钥和模数");
      return;
    }
    
    setVerifyLoading(true);
    setVerifyError("");
    
    try {
      const response = await rsasha1Verify(verifyMessage, verifySignature, verifyPublicKey, verifyModulus);
      
      if (response && response.data) {
        if (response.data.status !== undefined && response.data.status !== 0) {
          throw new Error(response.data.message || '验证失败');
        }
        setVerifyResult(response.data.result);
      } else {
        setVerifyError(response.data?.message || "验证失败");
      }
    } catch (error) {
      setVerifyError("验证过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleGenerateKeyPair = async () => {
    setKeyGenLoading(true);
    setKeyGenError("");
    
    try {
      const response = await rsasha1GenerateKey();
      
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
    if (type === 'sign') {
      setSignPrivateKey(generatedPrivateKey);
      setSignModulus(generatedModulus);
    } else if (type === 'verify') {
      setVerifyPublicKey(generatedPublicKey);
      setVerifyModulus(generatedModulus);
    }
  };

  const handleCloseSnackbar = () => {
    setShowCopiedSnackbar(false);
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
              RSA-SHA1是一种数字签名算法，结合了RSA加密和SHA1哈希函数。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              RSA-SHA1用于生成和验证数字签名，确保数据的完整性和来源真实性。但请注意，SHA1哈希算法已被发现存在安全漏洞，对于高安全性需求，建议使用RSA-SHA256等更安全的算法。
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
            icon={<DriveFileRenameOutlineIcon />} 
            label="签名" 
            id="rsasha1-tab-0" 
            aria-controls="rsasha1-tabpanel-0"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
          <Tab 
            icon={<VerifiedUserIcon />} 
            label="验签" 
            id="rsasha1-tab-1" 
            aria-controls="rsasha1-tabpanel-1"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
          <Tab 
            icon={<VpnKeyIcon />} 
            label="密钥对生成" 
            id="rsasha1-tab-2" 
            aria-controls="rsasha1-tabpanel-2"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          RSA-SHA1签名生成
        </Typography>
        
        <TextField
          label="消息内容"
          multiline
          rows={4}
          value={signMessage}
          onChange={(e) => setSignMessage(e.target.value)}
          placeholder="输入需要签名的消息内容"
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
          label="RSA私钥"
          multiline
          rows={4}
          value={signPrivateKey}
          onChange={(e) => setSignPrivateKey(e.target.value)}
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
                  onClick={() => handleUseGeneratedKey('sign')}
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
          value={signModulus}
          onChange={(e) => setSignModulus(e.target.value)}
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

        <Button
          variant="contained"
          fullWidth
          onClick={handleSign}
          disabled={signLoading}
          startIcon={signLoading ? <CircularProgress size={20} /> : <DriveFileRenameOutlineIcon />}
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
          {signLoading ? '签名中...' : '生成RSA-SHA1签名'}
        </Button>
        
        {signError && (
          <Alert severity="error" sx={{ mb: 3 }}>{signError}</Alert>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          签名结果
        </Typography>
        
        {signature ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={4}
              value={signature}
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
              onClick={() => copyToClipboard(signature)}
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
              RSA-SHA1签名结果将显示在此处
            </Typography>
          </Box>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          RSA-SHA1签名验证
        </Typography>
        
        <TextField
          label="消息内容"
          multiline
          rows={4}
          value={verifyMessage}
          onChange={(e) => setVerifyMessage(e.target.value)}
          placeholder="输入需要验证的消息内容"
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
          label="签名"
          multiline
          rows={4}
          value={verifySignature}
          onChange={(e) => setVerifySignature(e.target.value)}
          placeholder="输入RSA-SHA1签名"
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
          label="RSA公钥"
          multiline
          rows={4}
          value={verifyPublicKey}
          onChange={(e) => setVerifyPublicKey(e.target.value)}
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
                  onClick={() => handleUseGeneratedKey('verify')}
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
          value={verifyModulus}
          onChange={(e) => setVerifyModulus(e.target.value)}
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

        <Button
          variant="contained"
          fullWidth
          onClick={handleVerify}
          disabled={verifyLoading}
          startIcon={verifyLoading ? <CircularProgress size={20} /> : <VerifiedUserIcon />}
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
          {verifyLoading ? '验证中...' : '验证RSA-SHA1签名'}
        </Button>
        
        {verifyError && (
          <Alert severity="error" sx={{ mb: 3 }}>{verifyError}</Alert>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          验证结果
        </Typography>

        {verifyResult!== null ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={4}
              value={verifyResult ? '签名验证成功' : '签名验证失败'}
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
              onClick={() => copyToClipboard(verifyResult)}
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
              RSA-SHA1验签结果将显示在此处
            </Typography>
          </Box>
        )}

        {/* {verifyResult !== null && (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              position: 'relative', 
              mt: 2,
              borderLeft: '4px solid',
              borderColor: verifyResult ? 'success.main' : 'error.main'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: verifyResult ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
              {verifyResult ? '签名验证成功' : '签名验证失败'}
            </Typography>
            <Typography variant="body1">
              {verifyResult ? 
                '该消息的签名有效，内容未被篡改，且来自于预期的发送者。' : 
                '该消息的签名无效，可能内容已被篡改或签名不是由预期的发送者生成的。'}
            </Typography>
          </Paper>
        )} */}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          RSA-SHA1密钥对生成
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
          {keyGenLoading ? '生成中...' : '生成RSA密钥对'}
        </Button>
        
        {keyGenError && (
          <Alert severity="error" sx={{ mb: 3 }}>{keyGenError}</Alert>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          生成的密钥对
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: '#424242' }}>
          公钥
        </Typography>
        
        {generatedPublicKey ? (
          <Box sx={{ position: 'relative', mt: 1, mb: 3 }}>
            <TextField
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
            p: 4,
            mb: 3
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              生成的公钥将显示在此处
            </Typography>
          </Box>
        )}
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: '#424242' }}>
          私钥
        </Typography>
        
        {generatedPrivateKey ? (
          <Box sx={{ position: 'relative', mt: 1, mb: 3 }}>
            <TextField
              multiline
              rows={4}
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
            p: 4,
            mb: 3
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              生成的私钥将显示在此处
            </Typography>
          </Box>
        )}
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: '#424242' }}>
          模数
        </Typography>
        
        {generatedModulus ? (
          <Box sx={{ position: 'relative', mt: 1 }}>
            <TextField
              multiline
              rows={4}
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
            p: 4
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              生成的模数将显示在此处
            </Typography>
          </Box>
        )}
        
      </TabPanel>
      
      <Snackbar
        open={showCopiedSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowCopiedSnackbar(false)}
        message="已复制到剪贴板"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default NewRSASHA1Crypto;