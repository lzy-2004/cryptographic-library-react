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
  Divider,
  IconButton,
  Snackbar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import { sha1Hash } from '../../../api/sha1';

const NewSHA1Crypto = () => {
  const [inputText, setInputText] = useState('');
  const [outputFormat, setOutputFormat] = useState('hex');
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
    
    // 使用API调用
    sha1Hash(inputText, outputFormat)
      .then(response => {
        console.log('SHA1 API响应:', response);
        
        if (response && response.data) {
          if (response.data.status !== undefined && response.data.status !== 0) {
            throw new Error(response.data.message || '哈希计算失败');
          }
          setResult(response.data.result || '');
        } else {
          throw new Error('哈希API返回了空数据');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('SHA1 API请求错误:', err);
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
              SHA1是一种密码散列函数，生成160位（20字节）的哈希值。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              虽然SHA1已被证明存在碰撞漏洞，不再推荐用于安全应用，但了解其工作原理仍然很重要。
              现代应用应考虑使用SHA-2或SHA-3系列哈希函数。
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
          {loading ? '哈希计算中...' : '计算SHA1哈希'}
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          SHA1哈希结果
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
                • SHA1哈希是160位（20字节）固定长度
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 结果以{outputFormat === 'hex' ? '40位十六进制字符' : 'Base64编码'}表示
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 即使输入发生微小变化，输出也会完全不同
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
              SHA1哈希结果将显示在此处
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

export default NewSHA1Crypto; 