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
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// 模拟API调用
const rsaSha1Sign = async (message, privateKey, encoding) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 模拟RSA-SHA1签名
        const mockSignature = Array(128).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        resolve({
          data: {
            success: true,
            data: mockSignature
          }
        });
      } catch (error) {
        resolve({
          data: {
            success: false,
            message: "签名生成失败：" + (error.message || "未知错误")
          }
        });
      }
    }, 800);
  });
};

const rsaSha1Verify = async (message, signature, publicKey, encoding) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 模拟RSA-SHA1验证
        // 为了演示，我们假设有80%的概率验证成功
        const isValid = Math.random() < 0.8;
        
        resolve({
          data: {
            success: true,
            data: isValid
          }
        });
      } catch (error) {
        resolve({
          data: {
            success: false,
            message: "签名验证失败：" + (error.message || "未知错误")
          }
        });
      }
    }, 800);
  });
};

const NewRSASHA1Crypto = () => {
  const [mode, setMode] = useState("sign"); // sign 或 verify
  const [message, setMessage] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState("");
  const [encoding, setEncoding] = useState("UTF8");
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
    if (!message.trim()) {
      setError("请输入消息内容");
      return;
    }
    
    if (mode === "sign" && !privateKey.trim()) {
      setError("请输入RSA私钥");
      return;
    }
    
    if (mode === "verify") {
      if (!signature.trim()) {
        setError("请输入签名");
        return;
      }
      if (!publicKey.trim()) {
        setError("请输入RSA公钥");
        return;
      }
    }
    
    setLoading(true);
    setError("");
    
    try {
      let response;
      
      if (mode === "sign") {
        response = await rsaSha1Sign(message, privateKey, encoding);
      } else {
        response = await rsaSha1Verify(message, signature, publicKey, encoding);
      }
      
      if (response.data && response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data?.message || (mode === "sign" ? "签名生成失败" : "签名验证失败"));
      }
    } catch (error) {
      setError(`${mode === "sign" ? "签名生成" : "签名验证"}过程发生错误: ` + (error.message || "未知错误"));
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
              aria-label="签名或验证模式"
              fullWidth
              size="small"
            >
              <ToggleButton value="sign" aria-label="签名">
                <DriveFileRenameOutlineIcon sx={{ mr: 1 }} />
                生成签名
              </ToggleButton>
              <ToggleButton value="verify" aria-label="验证">
                <VerifiedUserIcon sx={{ mr: 1 }} />
                验证签名
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="rsasha1-encoding-label">消息编码</InputLabel>
              <Select
                labelId="rsasha1-encoding-label"
                id="rsasha1-encoding"
                value={encoding}
                label="消息编码"
                onChange={(e) => setEncoding(e.target.value)}
              >
                <MenuItem value="UTF8">UTF-8</MenuItem>
                <MenuItem value="ASCII">ASCII</MenuItem>
                <MenuItem value="Base64">Base64</MenuItem>
                <MenuItem value="Hex">十六进制</MenuItem>
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
              label="消息内容"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              placeholder="输入需要签名或验证的消息内容"
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
                    reader.readAsText(file);
                  }
                }}
              />
            </Button>
          </Box>
        </Grid>
        
        {mode === "sign" ? (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="RSA私钥"
              multiline
              rows={4}
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              variant="outlined"
              placeholder="输入RSA私钥 (PEM格式)"
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="签名"
                multiline
                rows={3}
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                variant="outlined"
                placeholder="输入RSA-SHA1签名 (十六进制格式)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="RSA公钥"
                multiline
                rows={3}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                variant="outlined"
                placeholder="输入RSA公钥 (PEM格式)"
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            RSA-SHA1是一种数字签名算法，结合了RSA加密和SHA1哈希函数。
            {mode === "sign" ? 
              " 使用私钥生成签名，可用于证明数据的完整性和来源。" : 
              " 使用公钥验证签名，确认数据未被篡改并来自预期的发送者。"}
          </Alert>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleProcess}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : (mode === "sign" ? <DriveFileRenameOutlineIcon /> : <VerifiedUserIcon />)}
            sx={{ py: 1.5 }}
          >
            {loading ? (mode === "sign" ? '生成中...' : '验证中...') : (mode === "sign" ? '生成RSA-SHA1签名' : '验证RSA-SHA1签名')}
          </Button>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        
        {result !== null && mode === "sign" && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, position: 'relative', mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                RSA-SHA1签名结果 (十六进制):
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
                  color: '#3498db'
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
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>提示：</strong> 该签名可以与对应的公钥一起使用，验证消息的完整性和来源真实性。
                但请注意，SHA1哈希算法已被发现存在安全漏洞，对于高安全性需求，建议使用RSA-SHA256等更安全的算法。
              </Typography>
            </Box>
          </Grid>
        )}
        
        {result !== null && mode === "verify" && (
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                position: 'relative', 
                mt: 2,
                borderLeft: '4px solid',
                borderColor: result ? 'success.main' : 'error.main'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: result ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                {result ? '签名验证成功' : '签名验证失败'}
              </Typography>
              <Typography variant="body1">
                {result ? 
                  '该消息的签名有效，内容未被篡改，且来自于预期的发送者。' : 
                  '该消息的签名无效，可能内容已被篡改或签名不是由预期的发送者生成的。'}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NewRSASHA1Crypto; 