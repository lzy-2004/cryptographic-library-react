import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
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
import { sha3_512Hash } from '../../../api/sha3_512';
const NewSHA3_512Crypto = () => {
  const [inputText, setInputText] = useState('');
  const [outputFormat, setOutputFormat] = useState("hex");
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
  };

  const handleOutputFormatChange = (e) => {
    setOutputFormat(e.target.value);
  };

  const generateHash = () => {
    setLoading(true);
    setError('');
    
    sha3_512Hash(inputText, outputFormat)
      .then(response => {
        console.log('SHA3-512 API响应:', response);
    
        if (response && response.data) {
          if (response.data.status !== undefined && response.data.status !== 0) {
            throw new Error(response.data.message || '哈希计算失败');
          }
          // 如果有result字段，使用result字段的值
          setResult(response.data.result || '');
        } else {
          throw new Error('哈希API返回了空数据');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('SHA3-512 API请求错误:', err);
        let errorMessage = '哈希计算失败';
        
        // 尝试获取服务器返回的错误信息
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setLoading(false);
      });
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
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          哈希设置
        </Typography>

        <TextField
          label="输入文本"
          multiline
          rows={8}
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
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <InputLabel id="output-format-label">输出格式</InputLabel>
              <Select
                labelId="output-format-label"
                value={outputFormat}
                onChange={handleOutputFormatChange}
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
                <MenuItem value="hex">十六进制</MenuItem>
                <MenuItem value="base64">Base64</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={generateHash}
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
              <Typography variant="body2" color="text.secondary">
                • SHA3-512哈希是512位（64字节）固定长度
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 结果以{outputFormat === 'hex' ? '128位十六进制字符' : 'Base64编码'}表示
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
            p: 8,
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              SHA3-512哈希结果将显示在此处
            </Typography>
          </Box>
        )}

        {error && !error.includes('文本') && (
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

export default NewSHA3_512Crypto; 