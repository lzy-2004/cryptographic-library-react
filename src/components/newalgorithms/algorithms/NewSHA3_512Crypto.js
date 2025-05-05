import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Alert, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  IconButton,
  Snackbar,
  Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';

const NewSHA3_512Crypto = () => {
  const [inputText, setInputText] = useState('');
  const [encoding, setEncoding] = useState('utf8');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
  };

  const handleEncodingChange = (e) => {
    setEncoding(e.target.value);
  };

  const generateHash = () => {
    if (!inputText) {
      setError('请输入要哈希的文本');
      return;
    }

    setLoading(true);
    setError('');
    
    // 模拟API调用
    setTimeout(() => {
      try {
        // 模拟SHA3-512哈希结果 (128个十六进制字符)
        const mockHash = Array.from({ length: 128 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        setResult(mockHash);
        setLoading(false);
      } catch (err) {
        setError('生成哈希时发生错误: ' + err.message);
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
          setError('复制到剪贴板失败: ' + err.message);
        });
    }
  };

  const handleCloseSnackbar = () => {
    setShowCopiedSnackbar(false);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderLeft: '4px solid #e0e0e0',
          bgcolor: '#f9f9f9'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <InfoIcon sx={{ color: '#757575', mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: '#424242' }}>
              SHA3-512是SHA-3家族中的一员，生成512位（64字节）的哈希值。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SHA-3是最新的哈希标准，基于KECCAK算法构建，采用"海绵"结构设计。
              相比SHA-1和SHA-2，SHA-3提供了更强的安全性，特别是在抵抗量子计算攻击方面。
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <LockIcon sx={{ mr: 1, color: '#616161' }} />
          输入
        </Typography>
        
        <TextField
          label="输入文本"
          multiline
          rows={5}
          value={inputText}
          onChange={handleInputChange}
          placeholder="在此输入要哈希的文本..."
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
          }}
          error={!!error}
          helperText={error}
        />

        <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
          <InputLabel id="encoding-label">输入编码</InputLabel>
          <Select
            labelId="encoding-label"
            value={encoding}
            onChange={handleEncodingChange}
            label="输入编码"
          >
            <MenuItem value="utf8">UTF-8</MenuItem>
            <MenuItem value="ascii">ASCII</MenuItem>
            <MenuItem value="base64">Base64</MenuItem>
            <MenuItem value="hex">Hex</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={generateHash}
          disabled={loading}
          sx={{ 
            mb: 3,
            bgcolor: '#616161',
            '&:hover': {
              bgcolor: '#424242',
            }
          }}
        >
          {loading ? '哈希计算中...' : '计算SHA3-512哈希'}
        </Button>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          SHA3-512哈希结果
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
                  fontFamily: 'monospace',
                  bgcolor: '#f5f5f5',
                  wordBreak: 'break-all',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                    borderWidth: '1px',
                  },
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
              <Typography variant="body2" color="text.secondary">
                • SHA3-512哈希是512位（64字节）固定长度
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 结果以128位十六进制字符表示
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 比SHA-2系列提供更强的安全性
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 抵抗量子计算攻击的能力更佳
              </Typography>
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
            p: 4
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              计算后的SHA3-512哈希将显示在此处
            </Typography>
          </Box>
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

export default NewSHA3_512Crypto; 