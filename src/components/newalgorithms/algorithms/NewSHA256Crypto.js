import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Paper, 
  Typography, 
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import { sha256Hash } from '../../../api/sha256';

const NewSHA256Crypto = () => {
  const [input, setInput] = useState("");
  const [outputFormat, setOutputFormat] = useState("hex");
  const [hashResult, setHashResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError('');
  };
  const handleOutputFormatChange = (e) => {
    setOutputFormat(e.target.value);
  };
  const handleHash = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await sha256Hash(input, outputFormat);
      
      if (response && response.data) {
        if (response.data.status !== undefined && response.data.status !== 0) {
          throw new Error(response.data.message || '哈希计算失败');
        }
        setHashResult(response.data.result || '');
      } else {
        setError(response.data.message || "哈希计算失败");
      }
      setLoading(false);
    } catch (error) {
      setError("哈希计算过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('文本已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
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
              SHA-256是安全哈希算法2(SHA-2)家族的一部分，它会生成256位(32字节)的哈希值，通常表示为64个十六进制字符。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SHA-256常用于验证数据完整性、数字签名和密码存储。
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
          value={input}
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
          onClick={handleHash}
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
          {loading ? '哈希计算中...' : '计算SHA256哈希'}
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          SHA256哈希结果
        </Typography>

        {hashResult ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={4}
              value={hashResult}
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
                • SHA256哈希是256位（32字节）固定长度
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 结果以{outputFormat === 'hex' ? '64位十六进制字符' : 'Base64编码'}表示
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
              SHA256哈希结果将显示在此处
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

export default NewSHA256Crypto; 