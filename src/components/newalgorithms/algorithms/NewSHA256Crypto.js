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
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { sha256Hash } from '../../../api/sha256';

const NewSHA256Crypto = () => {
  const [input, setInput] = useState("");
  const [encoding, setEncoding] = useState("UTF8");
  const [outputFormat, setOutputFormat] = useState("hex");
  const [hashResult, setHashResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleHash = async () => {
    if (!input.trim()) {
      setError("请输入要计算哈希值的文本");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await sha256Hash(input, encoding);
      
      if (response.data && response.data.success) {
        setHashResult(response.data.data);
      } else {
        setError(response.data?.message || "哈希计算失败");
      }
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

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="sha256-encoding-label">输入编码</InputLabel>
              <Select
                labelId="sha256-encoding-label"
                id="sha256-encoding"
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
              <InputLabel id="sha256-output-format-label">输出格式</InputLabel>
              <Select
                labelId="sha256-output-format-label"
                id="sha256-output-format"
                value={outputFormat}
                label="输出格式"
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <MenuItem value="hex">十六进制</MenuItem>
                <MenuItem value="base64">Base64</MenuItem>
                <MenuItem value="buffer">字节数组</MenuItem>
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
              label="输入文本"
              multiline
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              placeholder="输入需要计算SHA-256哈希值的文本"
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
                      setInput(event.target.result);
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
            SHA-256是安全哈希算法2(SHA-2)家族的一部分，它会生成256位(32字节)的哈希值，通常表示为64个十六进制字符。
            SHA-256常用于验证数据完整性、数字签名和密码存储。
          </Alert>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleHash}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <FingerprintIcon />}
            sx={{ py: 1.5 }}
          >
            {loading ? '计算中...' : '计算SHA-256哈希值'}
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
                SHA-256哈希结果 ({outputFormat === 'hex' ? '十六进制' : outputFormat === 'base64' ? 'Base64' : '字节数组'}):
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
                <strong>注意：</strong> SHA-256是单向哈希函数，不可逆。相同的输入总是产生相同的输出，但从输出无法推导出原始输入。
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NewSHA256Crypto; 