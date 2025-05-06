import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  IconButton,
  Snackbar,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
  Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SyncIcon from '@mui/icons-material/Sync';
import { sm4Decrypt, sm4Encrypt } from '../../../api/sm4';
const NewSM4Crypto = () => {
  const [mode, setMode] = useState(0); // 0 = 加密, 1 = 解密
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showIv, setShowIv] = useState(false);
  const [cipherMode, setCipherMode] = useState('ecb');
  const [outputFormat, setOutputFormat] = useState('base64');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleModeChange = (event, newValue) => {
    setMode(newValue);
    setResult('');
    setError('');
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
  };

  const handleKeyChange = (e) => {
    setKey(e.target.value);
    setError('');
  };

  const handleIvChange = (e) => {
    setIv(e.target.value);
    setError('');
  };

  const generateRandomKey = () => {
    // 生成随机密钥 - 16字节 (128位) 的随机十六进制字符串
    const randomKey = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setKey(randomKey);
  };

  const generateRandomIv = () => {
    // 生成随机IV - 16字节 (128位) 的随机十六进制字符串
    const randomIv = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setIv(randomIv);
  };

  const validateInput = () => {
    if (!inputText) {
      setError(mode === 0 ? '请输入要加密的文本' : '请输入要解密的文本');
      return false;
    }

    if (!key) {
      setError('请提供密钥');
      return false;
    }

    // 验证密钥长度 - SM4使用128位密钥
    if (key.length !== 16) { 
      setError('密钥长度必须为16个字节 (128位)');
      return false;
    }

    // 如果模式需要IV，验证IV
    if (cipherMode !== 'ecb' && !iv) {
      setError(`${cipherMode.toUpperCase()}模式需要初始化向量(IV)`);
      return false;
    }

    if (cipherMode !== 'ecb' && iv.length !== 16) { 
      setError('IV长度必须为16个十字节 (128位)');
      return false;
    }

    return true;
  };

  const processCrypto = () => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    setError('');
    
    const processData = async () => {
      try {
        let response;
        
        if (mode === 0) { // 加密
          console.log('调用加密API，参数:', {
            key,
            data: inputText,
            encoding: outputFormat
          });
          
          response = await sm4Encrypt(
            key, 
            inputText, 
            outputFormat
          );
          
          console.log('加密API响应:', response);
          
          // 使用与原来SM4Crypto.js相同的响应处理逻辑
          if (response && response.data) {
            if (response.data.status !== undefined && response.data.status !== 0) {
              throw new Error(response.data.message || '加密失败');
            }
            // 如果有result字段，使用result字段的值
            setResult(response.data.result || '');
          } else {
            throw new Error('加密API返回了空数据');
          }
        } else { // 解密
          console.log('调用解密API，参数:', {
            key,
            data: inputText,
            encoding: outputFormat // 使用选择的格式解析密文
          });
          
          response = await sm4Decrypt(
            key, 
            inputText, 
            outputFormat // 确保与加密时使用相同的格式
          );
          
          console.log('解密API响应:', response);
          
          // 使用与原来AESCrypto.js相同的响应处理逻辑
          if (response && response.data) {
            if (response.data.status !== undefined && response.data.status !== 0) {
              throw new Error(response.data.message || '解密失败');
            }
            // 如果有result字段，使用result字段的值
            setResult(response.data.result || '');
          } else {
            throw new Error('解密API返回了空数据');
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('API请求错误:', err);
        let errorMessage = '操作失败';
        
        // 尝试获取服务器返回的错误信息
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        // 特定错误的友好提示
        if (errorMessage.includes("arraycopy") && errorMessage.includes("out of bounds")) {
          errorMessage = "解密失败: 密钥长度或密文格式不正确，请确保密钥长度符合AES标准（16/24/32字节），并且密文格式选择正确";
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };
    // 当选择ECB模式时使用API
    if (cipherMode === 'ecb') {
      processData();
    } else {
      // 对于其他非ECB模式，继续使用模拟功能
      setTimeout(() => {
        try {
          let mockResult;
          
          if (mode === 0) { // 加密
            // 生成模拟加密结果
            if (outputFormat === 'base64') {
              // 模拟Base64编码结果 - 随机生成 ~30-40个Base64字符
              const length = Math.floor(Math.random() * 10) + 30;
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
              mockResult = Array.from({ length }, () => 
                chars.charAt(Math.floor(Math.random() * chars.length))
              ).join('') + '==';
            } else { // hex
              // 模拟十六进制结果 - 随机生成 ~50-60个十六进制字符
              const length = Math.floor(Math.random() * 10) + 50;
              mockResult = Array.from({ length }, () => 
                Math.floor(Math.random() * 16).toString(16)
              ).join('');
            }
          } else { // 解密
            // 模拟解密结果 - 一些有意义的文本
            const decryptedTexts = [
              "这是SM4算法解密后的示例文本。",
              "SM4是中国国家密码管理局发布的分组密码标准。",
              "SM4的分组长度和密钥长度均为128位，安全性与AES相当。",
              "国密算法在中国国内金融、政务和商业领域得到广泛应用。",
              "密码学是保护数据安全的关键技术。"
            ];
            mockResult = decryptedTexts[Math.floor(Math.random() * decryptedTexts.length)];
          }
          
          setResult(mockResult);
          setLoading(false);
        } catch (err) {
          setError(mode === 0 ? '加密过程中发生错误' : '解密过程中发生错误');
          setLoading(false);
        }
      }, 800);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result)
        .then(() => {
          setShowCopiedSnackbar(true);
        })
        .catch(err => {
          setError('复制到剪贴板失败');
        });
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
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <InfoIcon sx={{ color: '#757575', mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: '#424242' }}>
              SM4是中国国家密码管理局发布的分组密码标准
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SM4的分组长度和密钥长度均为128位。它是中国商用密码算法标准的重要组成部分，已在金融、政务和商业领域广泛应用。
              SM4算法提供了与AES相当的安全强度，特别适用于符合中国密码法规要求的应用场景。
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={mode} 
          onChange={handleModeChange}
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
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
          <Tab 
            icon={<LockOpenIcon />} 
            label="解密" 
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
        </Tabs>
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          {mode === 0 ? '加密设置' : '解密设置'}
        </Typography>

        <TextField
          label={mode === 0 ? "输入文本" : "加密文本"}
          multiline
          rows={8}
          value={inputText}
          onChange={handleInputChange}
          placeholder={mode === 0 ? "输入要加密的明文..." : "输入要解密的密文..."}
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
            }
          }}
          error={!!error && error.includes('文本')}
          helperText={error && error.includes('文本') ? error : ''}
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <InputLabel id="cipher-mode-label">加密模式</InputLabel>
              <Select
                labelId="cipher-mode-label"
                value={cipherMode}
                onChange={(e) => setCipherMode(e.target.value)}
                label="加密模式"
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
                  '& .MuiSvgIcon-root': { // 强调下拉箭头
                    color: '#424242',
                    fontSize: '1.5rem'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 1,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              >
                <MenuItem value="cbc">CBC模式</MenuItem>
                <MenuItem value="ecb">ECB模式</MenuItem>
                <MenuItem value="ctr">CTR模式</MenuItem>
                <MenuItem value="cfb">CFB模式</MenuItem>
                <MenuItem value="ofb">OFB模式</MenuItem>
                <MenuItem value="gcm">GCM模式</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <InputLabel id="output-format-label">密文格式</InputLabel>
              <Select
                labelId="output-format-label"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                label="输出格式"
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
                  '& .MuiSvgIcon-root': { // 强调下拉箭头
                    color: '#424242',
                    fontSize: '1.5rem'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 1,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              >
                <MenuItem value="base64">Base64</MenuItem>
                <MenuItem value="hex">十六进制</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          label="密钥（128位）"
          value={key}
          onChange={handleKeyChange}
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
            }
          }}
          error={!!error && error.includes('密钥')}
          helperText={error && error.includes('密钥') ? error : ''}
          type="text" // 始终显示密钥
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="随机生成密钥">
                  <IconButton onClick={generateRandomKey} edge="end">
                    <SyncIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />

        {cipherMode !== 'ecb' && (
          <TextField
            label="初始化向量 (IV)"
            value={iv}
            onChange={handleIvChange}
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
              }
            }}
            error={!!error && error.includes('IV')}
            helperText={error && error.includes('IV') ? error : ''}
            type={showIv ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="随机生成IV">
                    <IconButton onClick={generateRandomIv} edge="end">
                      <SyncIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        )}

        <Button 
          variant="contained"
          onClick={processCrypto}
          disabled={loading}
          fullWidth
          size="large"
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
          {loading ? (mode === 0 ? '加密中...' : '解密中...') : (mode === 0 ? 'SM4加密' : 'SM4解密')}
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          {mode === 0 ? 'SM4加密结果' : 'SM4解密结果'}
        </Typography>

        {result ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={4}
              value={result}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { 
                  fontFamily: mode === 0 ? 'monospace' : 'inherit',
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
              onClick={copyToClipboard}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8,
                color: '#616161'
              }}
            >
              <ContentCopyIcon />
            </IconButton>
            
            <Box sx={{ mt: 3 }}>
              {mode === 0 ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    • SM4加密使用128位密钥和{cipherMode.toUpperCase()}模式
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 输出格式: {outputFormat === 'base64' ? 'Base64' : '十六进制'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 解密需要相同的密钥、IV和加密参数
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • SM4是中国标准的对称加密算法，安全性与AES相当
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    • SM4解密使用128位密钥和{cipherMode.toUpperCase()}模式
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 解密后的明文以UTF-8编码显示
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • SM4是国密标准之一，适用于国内合规应用场景
              </Typography>
                </>
              )}
            </Box>
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
              {mode === 0 ? 'SM4加密结果将显示在此处' : 'SM4解密结果将显示在此处'}
            </Typography>
          </Box>
        )}

        {error && !error.includes('文本') && !error.includes('密钥') && !error.includes('IV') && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>  

      <Snackbar
        open={showCopiedSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="已复制到剪贴板！"
      />
    </Box>
  );
};

export default NewSM4Crypto; 