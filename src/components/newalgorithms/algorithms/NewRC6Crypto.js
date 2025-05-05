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

const NewRC6Crypto = () => {
  const [mode, setMode] = useState(0); // 0 = 加密, 1 = 解密
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [numRounds, setNumRounds] = useState('20');
  const [wordSize, setWordSize] = useState('32');
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

  const generateRandomKey = () => {
    // 生成随机密钥 - 16/24/32字节 的随机十六进制字符串
    const bytes = 32; // 标准使用256位密钥
    const randomKey = Array.from({ length: bytes * 2 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setKey(randomKey);
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

    // 验证密钥长度
    if (key.length !== 64) { // 32字节 = 64个十六进制字符
      setError('密钥长度必须为64个十六进制字符 (256位)');
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
            "这是RC6算法解密后的示例文本。",
            "RC6是Rivest Cipher 6的缩写，由Ron Rivest等人设计。",
            "RC6是AES竞赛的候选算法之一，它扩展了RC5的设计。",
            "RC6增加了整数乘法和四个工作寄存器，提高了安全性。",
            "密码学是信息安全的基础，算法设计需要平衡性能和安全性。"
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
              RC6是由Ron Rivest设计的对称分组密码，具有可变的分组大小、密钥大小和轮数。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              RC6是AES竞赛的候选算法之一，它扩展了RC5的设计，增加了整数乘法和四个工作寄存器。
              RC6的灵活性使其适用于各种安全需求，可根据性能和安全性要求调整参数。
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
              {mode === 0 ? 'RC6加密设置' : 'RC6解密设置'}
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

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="word-size-label">字长</InputLabel>
                  <Select
                    labelId="word-size-label"
                    value={wordSize}
                    onChange={(e) => setWordSize(e.target.value)}
                    label="字长"
                  >
                    <MenuItem value="16">16位</MenuItem>
                    <MenuItem value="32">32位</MenuItem>
                    <MenuItem value="64">64位</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="num-rounds-label">轮数</InputLabel>
                  <Select
                    labelId="num-rounds-label"
                    value={numRounds}
                    onChange={(e) => setNumRounds(e.target.value)}
                    label="轮数"
                  >
                    <MenuItem value="12">12轮</MenuItem>
                    <MenuItem value="16">16轮</MenuItem>
                    <MenuItem value="20">20轮 (推荐)</MenuItem>
                    <MenuItem value="24">24轮</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="密钥 (十六进制，256位)"
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
              {loading ? (mode === 0 ? '加密中...' : '解密中...') : (mode === 0 ? 'RC6加密' : 'RC6解密')}
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
              {mode === 0 ? 'RC6加密结果' : 'RC6解密结果'}
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
                        • RC6配置: w={wordSize}位, r={numRounds}轮
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • 使用256位密钥进行加密
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • 输出格式: {outputFormat === 'base64' ? 'Base64' : '十六进制'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • 解密需要相同的密钥和参数设置
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        • 解密使用相同的配置: w={wordSize}位, r={numRounds}轮
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • 使用256位密钥解密
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
                bgcolor: '#F7FAFC',
                border: '1px dashed #CBD5E0',
                borderRadius: 1,
                p: 4,
                flex: 1
              }}>
                <Typography variant="body1" color="text.secondary" align="center">
                  {mode === 0 ? 'RC6加密结果将显示在此处' : 'RC6解密结果将显示在此处'}
                </Typography>
              </Box>
            )}

            {error && !error.includes('文本') && !error.includes('密钥') && (
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

export default NewRC6Crypto; 