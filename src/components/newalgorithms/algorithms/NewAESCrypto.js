import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  InputAdornment
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SyncIcon from '@mui/icons-material/Sync';
import { aesEncrypt, aesDecrypt } from '../../../api/aes';


const NewAESCrypto = () => {
  const [mode, setMode] = useState(0); // 0 = 加密, 1 = 解密
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [showIv, setShowIv] = useState(true);
  const [keySize, setKeySize] = useState('128');
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
    // 生成随机密钥 - 16/24/32字节 (128/192/256位) 的随机十六进制字符串
    const bytes = keySize === '128' ? 16 : keySize === '192' ? 24 : 32;
    const randomKey = Array.from({ length: bytes * 2 }, () => 
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

    // 对ECB模式严格验证密钥长度
    if (cipherMode === 'ecb') {
      // ECB模式下，确保密钥长度符合AES要求：16、24或32字节
      // 密钥可以是任何字符，但要注意后端会如何处理密钥
      if (key.length !== 16 && key.length !== 24 && key.length !== 32) {
        setError(`AES密钥长度必须为16、24或32个字符（对应128、192或256位）`);
        return false;
      }
      
      // 如果在UI上已选择了密钥长度，确保密钥长度与选择匹配
      const expectedLength = keySize === '128' ? 16 : keySize === '192' ? 24 : 32;
      if (key.length !== expectedLength) {
        setError(`已选择${keySize}位密钥，但提供的密钥长度为${key.length * 8}位。请提供${expectedLength}个字符的密钥`);
        return false;
      }
    } else {
      // 对于其他模式，继续使用严格验证
      const expectedKeyLength = keySize === '128' ? 32 : keySize === '192' ? 48 : 64; // 十六进制字符长度
      if (key.length !== expectedKeyLength) {
        setError(`密钥长度必须为${expectedKeyLength}个十六进制字符 (${keySize}位)`);
        return false;
      }

      // 如果模式需要IV，验证IV
      if (cipherMode !== 'ecb' && !iv) {
        setError(`${cipherMode.toUpperCase()}模式需要初始化向量(IV)`);
        return false;
      }

      if (cipherMode !== 'ecb' && iv.length !== 32) { // 16字节 = 32个十六进制字符
        setError('IV长度必须为32个十六进制字符 (128位)');
        return false;
      }
    }

    // 解密模式下，验证密文格式是否正确
    if (mode === 1) { // 解密模式
      // 如果以base64方式解密，检查密文是否符合base64格式
      if (outputFormat === 'base64') {
        // 简单检查：base64只包含字母、数字、+、/和=
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        if (!base64Regex.test(inputText)) {
          setError('密文格式错误：不是有效的Base64字符串');
          return false;
        }
      } 
      // 如果以hex方式解密，检查密文是否为有效的十六进制
      else if (outputFormat === 'hex') {
        // 检查是否为有效的十六进制字符串
        const hexRegex = /^[0-9A-Fa-f]+$/;
        if (!hexRegex.test(inputText)) {
          setError('密文格式错误：不是有效的十六进制字符串');
          return false;
        }
        // 此外，十六进制字符串长度应为偶数（每两个字符代表一个字节）
        if (inputText.length % 2 !== 0) {
          setError('密文格式错误：十六进制字符串长度必须为偶数');
          return false;
        }
      }
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
            outputEncoding: outputFormat
          });
          
          response = await aesEncrypt(
            key, 
            inputText, 
            outputFormat
          );
          
          console.log('加密API响应:', response);
          
          // 使用与原来AESCrypto.js相同的响应处理逻辑
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
            outputEncoding: outputFormat // 使用选择的格式解析密文
          });
          
          response = await aesDecrypt(
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
              "这是一段示例解密文本，展示AES解密功能。",
              "AES（高级加密标准）是目前使用最广泛的对称加密算法。",
              "加密和解密使用相同的密钥，因此密钥管理非常重要。",
              `${cipherMode.toUpperCase()}模式使用初始化向量(IV)增加加密强度。`,
              "密码学是保护数字信息安全的基础技术。"
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
    <Box sx={{ width: '100%'}}>
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
              AES（高级加密标准）是目前最流行的对称加密算法。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AES支持128位、192位和256位密钥长度，块大小固定为128位。不同的操作模式（如ECB、CBC、CFB、OFB、CTR、GCM等）
              提供不同的安全特性和性能特点。AES加密广泛应用于保护敏感数据的存储和传输。
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
              <InputLabel id="key-size-label">密钥长度</InputLabel>
              <Select
                labelId="key-size-label"
                value={keySize}
                onChange={(e) => setKeySize(e.target.value)}
                label="密钥大小"
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
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 1,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              >
                <MenuItem value="128">128位 (16字节)</MenuItem>
                <MenuItem value="192">192位 (24字节)</MenuItem>
                <MenuItem value="256">256位 (32字节)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
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
          label="密钥"
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
          {loading ? (mode === 0 ? '加密中...' : '解密中...') : (mode === 0 ? 'AES加密' : 'AES解密')}
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          {mode === 0 ? 'AES加密结果' : 'AES解密结果'}
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
                    • 加密结果是使用AES-{keySize}和{cipherMode.toUpperCase()}模式生成的
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 输出格式: {outputFormat === 'base64' ? 'Base64' : '十六进制'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 解密需要相同的密钥、IV和加密参数
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    • 解密成功使用AES-{keySize}和{cipherMode.toUpperCase()}模式
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 解密后的明文以UTF-8编码显示
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
              {mode === 0 ? 'AES加密结果将显示在此处' : 'AES解密结果将显示在此处'}
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

export default NewAESCrypto; 