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
const utf8Encode = async (input, fromEncoding) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 这里只是模拟，实际应用中需要处理不同编码的转换
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(input);
        
        // 将Uint8Array转为十六进制字符串
        const hexString = Array.from(uint8Array)
          .map(b => b.toString(16).padStart(2, '0'))
          .join(' ');
        
        resolve({
          data: {
            success: true,
            data: {
              hex: hexString,
              decimal: Array.from(uint8Array).join(' '),
              binary: Array.from(uint8Array)
                .map(b => b.toString(2).padStart(8, '0'))
                .join(' ')
            }
          }
        });
      } catch (error) {
        resolve({
          data: {
            success: false,
            message: "UTF-8编码失败：" + (error.message || "未知错误")
          }
        });
      }
    }, 300);
  });
};

const utf8Decode = async (input, format) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        let uint8Array;
        
        // 根据输入格式解析为Uint8Array
        if (format === 'hex') {
          const values = input.trim().split(/\s+/);
          uint8Array = new Uint8Array(values.map(hex => parseInt(hex, 16)));
        } else if (format === 'decimal') {
          const values = input.trim().split(/\s+/);
          uint8Array = new Uint8Array(values.map(dec => parseInt(dec, 10)));
        } else { // binary
          const values = input.trim().split(/\s+/);
          uint8Array = new Uint8Array(values.map(bin => parseInt(bin, 2)));
        }
        
        // 解码为字符串
        const decoder = new TextDecoder();
        const text = decoder.decode(uint8Array);
        
        resolve({
          data: {
            success: true,
            data: text
          }
        });
      } catch (error) {
        resolve({
          data: {
            success: false,
            message: "UTF-8解码失败：输入格式无效或包含非法值"
          }
        });
      }
    }, 300);
  });
};

const NewUTF8Crypto = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode"); // encode 或 decode
  const [fromEncoding, setFromEncoding] = useState("ASCII");
  const [decodeFormat, setDecodeFormat] = useState("hex"); // hex, decimal, or binary
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setResult(null);
      setError("");
    }
  };

  const handleProcess = async () => {
    if (!input.trim()) {
      setError(mode === "encode" ? "请输入要编码的文本" : "请输入要解码的UTF-8字节值");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      let response;
      
      if (mode === "encode") {
        response = await utf8Encode(input, fromEncoding);
      } else {
        response = await utf8Decode(input, decodeFormat);
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
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            {mode === "encode" ? (
              <FormControl fullWidth size="small">
                <InputLabel id="utf8-from-encoding-label">源编码</InputLabel>
                <Select
                  labelId="utf8-from-encoding-label"
                  id="utf8-from-encoding"
                  value={fromEncoding}
                  label="源编码"
                  onChange={(e) => setFromEncoding(e.target.value)}
                >
                  <MenuItem value="ASCII">ASCII</MenuItem>
                  <MenuItem value="ISO-8859-1">ISO-8859-1</MenuItem>
                  <MenuItem value="UTF-16">UTF-16</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth size="small">
                <InputLabel id="utf8-decode-format-label">输入格式</InputLabel>
                <Select
                  labelId="utf8-decode-format-label"
                  id="utf8-decode-format"
                  value={decodeFormat}
                  label="输入格式"
                  onChange={(e) => setDecodeFormat(e.target.value)}
                >
                  <MenuItem value="hex">十六进制</MenuItem>
                  <MenuItem value="decimal">十进制</MenuItem>
                  <MenuItem value="binary">二进制</MenuItem>
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
              label={mode === "encode" ? "输入文本" : `UTF-8字节值 (${decodeFormat === 'hex' ? '十六进制' : decodeFormat === 'decimal' ? '十进制' : '二进制'})`}
              multiline
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              placeholder={mode === "encode" 
                ? "输入需要转换为UTF-8编码的文本" 
                : `输入UTF-8编码的${decodeFormat === 'hex' ? '十六进制' : decodeFormat === 'decimal' ? '十进制' : '二进制'}字节值，用空格分隔`}
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
                    reader.readAsText(file);
                  }
                }}
              />
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            UTF-8是一种可变长度的字符编码，能够表示Unicode标准中的任何字符。它是Web和电子邮件等环境中最常用的编码方式。
            {mode === "decode" && ` 解码时请确保输入正确的${decodeFormat === 'hex' ? '十六进制' : decodeFormat === 'decimal' ? '十进制' : '二进制'}UTF-8字节值，多个字节请用空格分隔。`}
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
            {loading ? (mode === "encode" ? '编码中...' : '解码中...') : (mode === "encode" ? 'UTF-8编码' : 'UTF-8解码')}
          </Button>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        
        {result && mode === "encode" && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, position: 'relative', mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                UTF-8编码结果:
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                十六进制表示:
              </Typography>
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflowWrap: 'break-word', 
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    pr: 4,
                    fontSize: '1rem',
                    color: '#3498db'
                  }}
                >
                  {result.hex}
                </Typography>
                <Tooltip title="复制到剪贴板">
                  <IconButton 
                    sx={{ position: 'absolute', top: -8, right: -8 }}
                    onClick={() => copyToClipboard(result.hex)}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                十进制表示:
              </Typography>
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflowWrap: 'break-word', 
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    pr: 4,
                    fontSize: '1rem',
                    color: '#e74c3c'
                  }}
                >
                  {result.decimal}
                </Typography>
                <Tooltip title="复制到剪贴板">
                  <IconButton 
                    sx={{ position: 'absolute', top: -8, right: -8 }}
                    onClick={() => copyToClipboard(result.decimal)}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                二进制表示:
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflowWrap: 'break-word', 
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    pr: 4,
                    fontSize: '1rem',
                    color: '#2ecc71'
                  }}
                >
                  {result.binary}
                </Typography>
                <Tooltip title="复制到剪贴板">
                  <IconButton 
                    sx={{ position: 'absolute', top: -8, right: -8 }}
                    onClick={() => copyToClipboard(result.binary)}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>提示：</strong> UTF-8是一种可变长度编码，常用字符通常占用1-4个字节。英文字母和数字占用1个字节，
                而中文字符通常占用3个字节。
              </Typography>
            </Box>
          </Grid>
        )}
        
        {result && mode === "decode" && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, position: 'relative', mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                UTF-8解码结果:
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  overflowWrap: 'break-word', 
                  wordBreak: 'break-word',
                  pr: 4,
                  fontSize: '1rem',
                  color: '#2ecc71'
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
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NewUTF8Crypto; 