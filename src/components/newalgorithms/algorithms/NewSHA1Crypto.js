import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Alert, 
  Typography, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  IconButton,
  Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';

const NewSHA1Crypto = () => {
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
        // 简单模拟SHA1哈希结果，实际应用中应使用真实的SHA1函数
        // 这里生成一个格式类似SHA1哈希的固定长度字符串
        const mockHash = Array.from({ length: 40 }, () => 
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
              SHA1是一种密码散列函数，生成160位（20字节）的哈希值。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              虽然SHA1已被证明存在碰撞漏洞，不再推荐用于安全应用，但了解其工作原理仍然很重要。
              现代应用应考虑使用SHA-2或SHA-3系列哈希函数。
            </Typography>
          </Box>
        </Box>
      </Paper>

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
              <LockIcon sx={{ mr: 1, color: '#4299E1' }} />
              输入
            </Typography>
            
            <TextField
              label="输入文本"
              multiline
              rows={6}
              value={inputText}
              onChange={handleInputChange}
              placeholder="在此输入要哈希的文本..."
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{ mb: 3 }}
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
                mt: 'auto',
                bgcolor: '#3182CE',
                '&:hover': {
                  bgcolor: '#2B6CB0',
                }
              }}
            >
              {loading ? '哈希计算中...' : '计算SHA1哈希'}
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
              SHA1哈希结果
            </Typography>

            {result ? (
              <Box sx={{ position: 'relative', mt: 2, flex: 1 }}>
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
                      bgcolor: '#F7FAFC' 
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
                  <Typography variant="body2" color="text.secondary">
                    • SHA1哈希是160位（20字节）固定长度
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 结果以40位十六进制字符表示
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
                bgcolor: '#F7FAFC',
                border: '1px dashed #CBD5E0',
                borderRadius: 1,
                p: 4,
                flex: 1
              }}>
                <Typography variant="body1" color="text.secondary" align="center">
                  计算后的SHA1哈希将显示在此处
                </Typography>
              </Box>
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

export default NewSHA1Crypto; 