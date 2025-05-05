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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// 模拟API调用
const hmacSha256 = async (message, key, encoding) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟HMAC-SHA256结果
      const mockHash = Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      resolve({
        data: {
          success: true,
          data: mockHash
        }
      });
    }, 500);
  });
};

const NewHMACSHA256Crypto = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [encoding, setEncoding] = useState("UTF8");
  const [outputFormat, setOutputFormat] = useState("hex");
  const [hashResult, setHashResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleHmac = async () => {
    if (!message.trim()) {
      setError("请输入消息内容");
      return;
    }
    
    if (!key.trim()) {
      setError("请输入密钥");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await hmacSha256(message, key, encoding);
      
      if (response.data && response.data.success) {
        setHashResult(response.data.data);
      } else {
        setError(response.data?.message || "HMAC计算失败");
      }
    } catch (error) {
      setError("HMAC计算过程发生错误: " + (error.message || "未知错误"));
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

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="hmacsha256-encoding-label">输入编码</InputLabel>
              <Select
                labelId="hmacsha256-encoding-label"
                id="hmacsha256-encoding"
                value={encoding}
                label="输入编码"
                onChange={(e) => setEncoding(e.target.value)}
              >
                <MenuItem value="UTF8">UTF-8</MenuItem>
                <MenuItem value="ASCII">ASCII</MenuItem>
                <MenuItem value="Base64">Base64</MenuItem>
                <MenuItem value="Hex">十六进制</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="hmacsha256-output-format-label">输出格式</InputLabel>
              <Select
                labelId="hmacsha256-output-format-label"
                id="hmacsha256-output-format"
                value={outputFormat}
                label="输出格式"
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <MenuItem value="hex">十六进制</MenuItem>
                <MenuItem value="base64">Base64</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              label="密钥"
              multiline
              rows={2}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              variant="outlined"
              placeholder="输入HMAC-SHA256计算所需的密钥"
            />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ 
                position: 'absolute', 
                right: 8, 
                bottom: 8,
                minWidth: 0,
                width: 36,
                height: 36,
                borderRadius: '50%'
              }}
              component="label"
            >
              <UploadFileIcon fontSize="small" />
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setKey(event.target.result);
                    };
                    
                    if (encoding === 'UTF8' || encoding === 'ASCII') {
                      reader.readAsText(file);
                    } else if (encoding === 'Base64') {
                      reader.readAsDataURL(file);
                    } else {
                      reader.readAsArrayBuffer(file);
                    }
                  }
                }}
              />
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              label="消息"
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              placeholder="输入需要计算HMAC-SHA256值的消息文本"
            />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ 
                position: 'absolute', 
                right: 8, 
                bottom: 8,
                minWidth: 0,
                width: 36,
                height: 36,
                borderRadius: '50%'
              }}
              component="label"
            >
              <UploadFileIcon fontSize="small" />
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setMessage(event.target.result);
                    };
                    
                    if (encoding === 'UTF8' || encoding === 'ASCII') {
                      reader.readAsText(file);
                    } else if (encoding === 'Base64') {
                      reader.readAsDataURL(file);
                    } else {
                      reader.readAsArrayBuffer(file);
                    }
                  }
                }}
              />
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            HMAC-SHA256是基于SHA256哈希函数的消息认证码，提供比HMAC-SHA1更强的安全性，产生256位(32字节)的哈希值。
            常用于安全性要求较高的API认证、数字签名等场景。
          </Alert>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleHmac}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
            sx={{ py: 1.5 }}
          >
            {loading ? '计算中...' : '计算HMAC-SHA256值'}
          </Button>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        
        {hashResult && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, position: 'relative', mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                HMAC-SHA256结果 ({outputFormat === 'hex' ? '十六进制' : 'Base64'}):
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  overflowWrap: 'break-word', 
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  pr: 4,
                  fontSize: '1rem',
                  color: outputFormat === 'hex' ? '#2ecc71' : '#3498db'
                }}
              >
                {hashResult}
              </Typography>
              <Tooltip title="复制到剪贴板">
                <IconButton 
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => copyToClipboard(hashResult)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Paper>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>注意：</strong> HMAC-SHA256提供了256位的输出长度，比HMAC-SHA1更加安全，适用于需要高安全性的环境。
                它结合了密钥和消息，能够有效防止消息被篡改。
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NewHMACSHA256Crypto; 