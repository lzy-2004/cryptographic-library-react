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
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SyncIcon from '@mui/icons-material/Sync';

const NewSM4Crypto = () => {
  const [mode, setMode] = useState(0); // 0 = 加密, 1 = 解密
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showIv, setShowIv] = useState(false);
  const [cipherMode, setCipherMode] = useState('cbc');
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
    if (key.length !== 32) { // 16字节 = 32个十六进制字符
      setError('密钥长度必须为32个十六进制字符 (128位)');
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

    return true;
  };

  const processCrypto = () => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    setError('');
    
    // 模拟API调用
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
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderLeft: '4px solid #4299E1',
          bgcolor: '#EBF8FF'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <InfoIcon sx={{ color: '#3182CE', mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
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
              backgroundColor: '#4299E1',
            },
          }}
        >
          <Tab 
            icon={<LockIcon />} 
            label="加密" 
            sx={{
              '&.Mui-selected': {
                color: '#3182CE',
              },
            }}
          />
          <Tab 
            icon={<LockOpenIcon />} 
            label="解密" 
            sx={{
              '&.Mui-selected': {
                color: '#3182CE',
              },
            }}
          />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1, color: '#4299E1' }} />
              {mode === 0 ? 'SM4加密设置' : 'SM4解密设置'}
            </Typography>
            
            <TextField
              label={mode === 0 ? "输入文本" : "加密文本"}
              multiline
              rows={4}
              value={inputText}
              onChange={handleInputChange}
              placeholder={mode === 0 ? "输入要加密的明文..." : "输入要解密的密文..."}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{ mb: 2 }}
              error={!!error && error.includes('文本')}
              helperText={error && error.includes('文本') ? error : ''}
            />

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel id="cipher-mode-label">加密模式</InputLabel>
              <Select
                labelId="cipher-mode-label"
                value={cipherMode}
                onChange={(e) => setCipherMode(e.target.value)}
                label="加密模式"
              >
                <MenuItem value="cbc">CBC模式</MenuItem>
                <MenuItem value="ecb">ECB模式</MenuItem>
                <MenuItem value="cfb">CFB模式</MenuItem>
                <MenuItem value="ofb">OFB模式</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="密钥 (十六进制，128位)"
              value={key}
              onChange={handleKeyChange}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{ mb: 2 }}
              error={!!error && error.includes('密钥')}
              helperText={error && error.includes('密钥') ? error : ''}
              type={showKey ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="随机生成密钥">
                      <IconButton onClick={generateRandomKey} edge="end">
                        <SyncIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={showKey ? "隐藏密钥" : "显示密钥"}>
                      <IconButton onClick={() => setShowKey(!showKey)} edge="end">
                        {showKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            {cipherMode !== 'ecb' && (
              <TextField
                label="初始化向量 (IV) (十六进制，128位)"
                value={iv}
                onChange={handleIvChange}
                fullWidth
                variant="outlined"
                margin="normal"
                sx={{ mb: 2 }}
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
                      <Tooltip title={showIv ? "隐藏IV" : "显示IV"}>
                        <IconButton onClick={() => setShowIv(!showIv)} edge="end">
                          {showIv ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {mode === 0 && (
              <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                <InputLabel id="output-format-label">输出格式</InputLabel>
                <Select
                  labelId="output-format-label"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  label="输出格式"
                >
                  <MenuItem value="base64">Base64</MenuItem>
                  <MenuItem value="hex">十六进制</MenuItem>
                </Select>
              </FormControl>
            )}

            <Button 
              variant="contained"
              onClick={processCrypto}
              disabled={loading}
              sx={{ 
                mt: 'auto',
                bgcolor: '#3182CE',
                '&:hover': {
                  bgcolor: '#2B6CB0',
                }
              }}
            >
              {loading ? (mode === 0 ? '加密中...' : '解密中...') : (mode === 0 ? 'SM4加密' : 'SM4解密')}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ContentCopyIcon sx={{ mr: 1, color: '#4299E1' }} />
              {mode === 0 ? 'SM4加密结果' : 'SM4解密结果'}
            </Typography>

            {result ? (
              <Box sx={{ position: 'relative', mt: 2, flex: 1 }}>
                <TextField
                  multiline
                  rows={5}
                  value={result}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    sx: { 
                      fontFamily: mode === 0 ? 'monospace' : 'inherit',
                      bgcolor: '#F7FAFC',
                      wordBreak: 'break-all'
                    }
                  }}
                />
                <IconButton 
                  onClick={copyToClipboard}
                  sx={{ 
                    position: 'absolute', 
                    right: 8, 
                    top: 8,
                    color: '#4299E1'
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
                bgcolor: '#F7FAFC',
                border: '1px dashed #CBD5E0',
                borderRadius: 1,
                p: 4,
                flex: 1
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
        </Grid>
      </Grid>

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