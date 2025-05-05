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
  MenuItem,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';

// 模拟API调用
const base64Encode = async (input, encoding) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 模拟Base64编码
        const encoded = window.btoa(input);
        resolve({
          data: {
            success: true,
            data: encoded
          }
        });
      } catch (error) {
        resolve({
          data: {
            success: false,
            message: "编码失败：输入包含无效字符"
          }
        });
      }
    }, 300);
  });
};

const base64Decode = async (input) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 模拟Base64解码
        const decoded = window.atob(input);
        resolve({
          data: {
            success: true,
            data: decoded
          }
        });
      } catch (error) {
        resolve({
          data: {
            success: false,
            message: "解码失败：无效的Base64字符串"
          }
        });
      }
    }, 300);
  });
};

const NewBase64Crypto = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode"); // encode 或 decode
  const [encoding, setEncoding] = useState("UTF8");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setResult("");
      setError("");
    }
  };

  const handleProcess = async () => {
    if (!input.trim()) {
      setError(mode === "encode" ? "请输入要编码的文本" : "请输入要解码的Base64字符串");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      let response;
      
      if (mode === "encode") {
        response = await base64Encode(input, encoding);
      } else {
        response = await base64Decode(input);
      }
      
      if (response.data && response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data?.message || (mode === "encode" ? "编码失败" : "解码失败"));
      }
    } catch (error) {
      setError(`${mode === "encode" ? "编码" : "解码"}过程发生错误: ` + (error.message || "未知错误"));
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
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="编码或解码模式"
              fullWidth
              size="small"
            >
              <ToggleButton value="encode" aria-label="编码">
                <EnhancedEncryptionIcon sx={{ mr: 1 }} />
                编码
              </ToggleButton>
              <ToggleButton value="decode" aria-label="解码">
                <NoEncryptionIcon sx={{ mr: 1 }} />
                解码
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            {mode === "encode" && (
              <FormControl fullWidth size="small">
                <InputLabel id="base64-encoding-label">输入编码</InputLabel>
                <Select
                  labelId="base64-encoding-label"
                  id="base64-encoding"
                  value={encoding}
                  label="输入编码"
                  onChange={(e) => setEncoding(e.target.value)}
                >
                  <MenuItem value="UTF8">UTF-8</MenuItem>
                  <MenuItem value="ASCII">ASCII</MenuItem>
                  <MenuItem value="ISO-8859-1">ISO-8859-1</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              label={mode === "encode" ? "输入文本" : "Base64字符串"}
              multiline
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              placeholder={mode === "encode" ? "输入需要编码为Base64的文本" : "输入需要解码的Base64字符串"}
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
                    
                    if (mode === "encode") {
                      reader.readAsText(file);
                    } else {
                      reader.readAsText(file);
                    }
                  }
                }}
              />
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Base64是一种编码方式，可以将二进制数据转换为可打印的ASCII字符，常用于在HTTP传输、电子邮件等环境中传输二进制数据。
            {mode === "decode" && " 解码时请确保输入有效的Base64字符串，否则可能会导致错误。"}
          </Alert>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleProcess}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : (mode === "encode" ? <EnhancedEncryptionIcon /> : <NoEncryptionIcon />)}
            sx={{ py: 1.5 }}
          >
            {loading ? (mode === "encode" ? '编码中...' : '解码中...') : (mode === "encode" ? 'Base64编码' : 'Base64解码')}
          </Button>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        
        {result && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, position: 'relative', mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                {mode === "encode" ? 'Base64编码结果:' : 'Base64解码结果:'}
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
                  color: mode === "encode" ? '#3498db' : '#2ecc71'
                }}
              >
                {result}
              </Typography>
              <Tooltip title="复制到剪贴板">
                <IconButton 
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => copyToClipboard(result)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Paper>
            
            {mode === "encode" && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>提示：</strong> Base64编码后的字符串仅包含A-Z、a-z、0-9、+、/和=（用于填充）。
                  该编码常用于在不支持二进制传输的环境中传递数据。
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NewBase64Crypto; 