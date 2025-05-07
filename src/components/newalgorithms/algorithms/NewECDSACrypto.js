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
import { ecdsaSign, ecdsaVerify, ecdsaGenerateKey } from '../../../api/ecdsa';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ecdsa-tabpanel-${index}`}
      aria-labelledby={`ecdsa-tab-${index}`}
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

const NewECDSACrypto = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // 签名状态
  const [signMessage, setSignMessage] = useState("");
  const [signPrivateKey, setSignPrivateKey] = useState("");
  const [signature, setSignature] = useState({r: "", s: ""});
  const [signLoading, setSignLoading] = useState(false);
  const [signError, setSignError] = useState("");
  
  // 验签状态
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifySignatureR, setVerifySignatureR] = useState("");
  const [verifySignatureS, setVerifySignatureS] = useState("");
  const [verifyPublicKeyX, setVerifyPublicKeyX] = useState("");
  const [verifyPublicKeyY, setVerifyPublicKeyY] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  
  // 密钥生成状态
  const [generatedPublicKeyX, setGeneratedPublicKeyX] = useState("");
  const [generatedPublicKeyY, setGeneratedPublicKeyY] = useState("");
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
  const [keyGenLoading, setKeyGenLoading] = useState(false);
  const [keyGenError, setKeyGenError] = useState("");
  
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSign = async () => {
    if (!signMessage || !signPrivateKey) {
      setSignError("请输入消息内容和私钥");
      return;
    }
    
    setSignLoading(true);
    setSignError("");
    
    try {
      const response = await ecdsaSign(signPrivateKey, signMessage);
      
      if (response && response.data) {
        setSignature({
          r: response.data.r,
          s: response.data.s
        });
      } else {
        setSignError("签名生成失败");
      }
    } catch (error) {
      setSignError("签名生成过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setSignLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyMessage || !verifySignatureR || !verifySignatureS || !verifyPublicKeyX || !verifyPublicKeyY) {
      setVerifyError("请输入消息内容、签名R值、签名S值、公钥X坐标和公钥Y坐标");
      return;
    }
    
    setVerifyLoading(true);
    setVerifyError("");
    
    try {
      const response = await ecdsaVerify(
        verifyPublicKeyX, 
        verifyPublicKeyY, 
        verifyMessage, 
        verifySignatureR, 
        verifySignatureS
      );
      
      if (response && response.data) {
        setVerifyResult(response.data.valid);
      } else {
        setVerifyError("验证失败");
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
      const response = await ecdsaGenerateKey();
      
      if (response && response.data) {
        setGeneratedPublicKeyX(response.data.publicKeyX);
        setGeneratedPublicKeyY(response.data.publicKeyY);
        setGeneratedPrivateKey(response.data.privateKey);
      } else {
        setKeyGenError("密钥生成失败");
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
    } else if (type === 'verify') {
      setVerifyPublicKeyX(generatedPublicKeyX);
      setVerifyPublicKeyY(generatedPublicKeyY);
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
              ECDSA是一种数字签名算法，基于椭圆曲线密码学。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ECDSA (椭圆曲线数字签名算法) 用于生成和验证数字签名，确保数据的完整性和来源真实性。相比RSA，ECDSA在相同安全强度下需要更短的密钥长度，常用于比特币、以太坊等加密货币交易的签名验证。
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
            id="ecdsa-tab-0" 
            aria-controls="ecdsa-tabpanel-0"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
          <Tab 
            icon={<VerifiedUserIcon />} 
            label="验签" 
            id="ecdsa-tab-1" 
            aria-controls="ecdsa-tabpanel-1"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
          <Tab 
            icon={<VpnKeyIcon />} 
            label="密钥对生成" 
            id="ecdsa-tab-2" 
            aria-controls="ecdsa-tabpanel-2"
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
          ECDSA签名生成
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
          label="ECDSA私钥"
          multiline
          rows={4}
          value={signPrivateKey}
          onChange={(e) => setSignPrivateKey(e.target.value)}
          placeholder="输入ECDSA私钥"
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
                  onClick={() => handleUseGeneratedKey('sign')}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            ) : null
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
          {signLoading ? '签名中...' : '生成ECDSA签名'}
        </Button>
        
        {signError && (
          <Alert severity="error" sx={{ mb: 3 }}>{signError}</Alert>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          签名结果
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontSize: '1.1rem', color: '#000000' }}>
            R值:
          </Typography>
          {signature.r ? (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <TextField
                multiline
                rows={2}
                value={signature.r}
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
                onClick={() => copyToClipboard(signature.r)}
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
              mb: 2
            }}>
              <Typography variant="body1" color="text.secondary" align="center">
                ECDSA签名R值将显示在此处
              </Typography>
            </Box>
          )}
          
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontSize: '1.1rem', color: '#000000' }}>
            S值:
          </Typography>
          {signature.s ? (
            <Box sx={{ position: 'relative' }}>
              <TextField
                multiline
                rows={2}
                value={signature.s}
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
                onClick={() => copyToClipboard(signature.s)}
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
                ECDSA签名S值将显示在此处
              </Typography>
            </Box>
          )}
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          ECDSA签名验证
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
          label="签名R值"
          multiline
          rows={2}
          value={verifySignatureR}
          onChange={(e) => setVerifySignatureR(e.target.value)}
          placeholder="输入ECDSA签名R值"
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
          label="签名S值"
          multiline
          rows={2}
          value={verifySignatureS}
          onChange={(e) => setVerifySignatureS(e.target.value)}
          placeholder="输入ECDSA签名S值"
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
          label="公钥X坐标"
          multiline
          rows={2}
          value={verifyPublicKeyX}
          onChange={(e) => setVerifyPublicKeyX(e.target.value)}
          placeholder="输入ECDSA公钥X坐标"
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
            endAdornment: generatedPublicKeyX ? (
              <Tooltip title="使用生成的公钥X坐标">
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
          label="公钥Y坐标"
          multiline
          rows={2}
          value={verifyPublicKeyY}
          onChange={(e) => setVerifyPublicKeyY(e.target.value)}
          placeholder="输入ECDSA公钥Y坐标"
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
          {verifyLoading ? '验证中...' : '验证ECDSA签名'}
        </Button>
        
        {verifyError && (
          <Alert severity="error" sx={{ mb: 3 }}>{verifyError}</Alert>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          验证结果
        </Typography>

        {verifyResult !== null ? (
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
              ECDSA验签结果将显示在此处
            </Typography>
          </Box>
        )}
        {/* {verifyResult !== null && (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              borderLeft: '4px solid', 
              borderColor: verifyResult ? 'success.main' : 'error.main',
              bgcolor: verifyResult ? 'success.light' : 'error.light',
              opacity: 0.8
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: verifyResult ? 'success.dark' : 'error.dark' }}>
              {verifyResult ? '✓ 签名验证成功' : '✗ 签名验证失败'}
            </Typography>
            <Typography variant="body1" sx={{ color: verifyResult ? 'success.dark' : 'error.dark' }}>
              {verifyResult 
                ? '该消息的ECDSA签名有效，内容未被篡改，且来自于预期的发送者。' 
                : '该消息的ECDSA签名无效，可能内容已被篡改或签名不是由预期的发送者生成的。'}
            </Typography>
          </Paper>
        )} */}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          ECDSA密钥对生成
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
          {keyGenLoading ? '生成中...' : '生成ECDSA密钥对'}
        </Button>
        
        {keyGenError && (
          <Alert severity="error" sx={{ mb: 3 }}>{keyGenError}</Alert>
        )}
        
        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          生成的密钥对
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: '#424242' }}>
          公钥X坐标
        </Typography>

        {generatedPublicKeyX ? (
          <Box sx={{ position: 'relative', mt: 1, mb: 3 }}>
            <TextField
              multiline
              rows={4}
              value={generatedPublicKeyX}
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
              onClick={() => copyToClipboard(generatedPublicKeyX)}
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
              生成的公钥X坐标将显示在此处
            </Typography>
          </Box>
        )}

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: '#424242' }}>
          公钥Y坐标
        </Typography>

        {generatedPublicKeyY ? (
          <Box sx={{ position: 'relative', mt: 1, mb: 3 }}>
            <TextField
              multiline
              rows={4}
              value={generatedPublicKeyY}
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
              onClick={() => copyToClipboard(generatedPublicKeyY)}
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
              生成的公钥Y坐标将显示在此处
            </Typography>
          </Box>
        )}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: '#424242' }}>
          私钥坐标
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
      </TabPanel>
      
      <Snackbar
        open={showCopiedSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="已复制到剪贴板"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default NewECDSACrypto;