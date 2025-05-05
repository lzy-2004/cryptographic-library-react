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
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// 模拟API调用
const eccEncrypt = async (plaintext, publicKey, encoding) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 模拟ECC加密结果
        const mockCiphertext = Array(64).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        resolve({
          data: {
            success: true,
            data: mockCiphertext
          }
        });
      } catch (error) {
        resolve({
          data: {
            success: false,
            message: "加密失败：" + (error.message || "未知错误")
          }
        });
      }
    }, 600);
  });
};

const eccDecrypt = async (ciphertext, privateKey) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 模拟ECC解密结果
        const mockPlaintext = "解密后的原始消息内容示例";
        
        resolve({
          data: {
            success: true,
            data: mockPlaintext
          }
        });
      } catch (error) {
        resolve({
          data: {
            success: false,
            message: "解密失败：" + (error.message || "未知错误")
          }
        });
      }
    }, 600);
  });
};

const NewECC160Crypto = () => {
  const [mode, setMode] = useState("encrypt"); // encrypt 或 decrypt
  const [input, setInput] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
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
      setError(mode === "encrypt" ? "请输入要加密的明文" : "请输入要解密的密文");
      return;
    }
    
    if (mode === "encrypt" && !publicKey.trim()) {
      setError("请输入ECC公钥");
      return;
    }
    
    if (mode === "decrypt" && !privateKey.trim()) {
      setError("请输入ECC私钥");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      let response;
      
      if (mode === "encrypt") {
        response = await eccEncrypt(input, publicKey, encoding);
      } else {
        response = await eccDecrypt(input, privateKey);
      }
      
      if (response.data && response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data?.message || (mode === "encrypt" ? "加密失败" : "解密失败"));
      }
    } catch (error) {
      setError(`${mode === "encrypt" ? "加密" : "解密"}过程发生错误: ` + (error.message || "未知错误"));
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

  const generateKeyPair = () => {
    // 模拟生成密钥对
    setPublicKey("-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE7Ee8TlNaDxGELvibQ8eGF3Gobwo6\nXM3K3w2vWxqOY9vFAqWskiOJXjGwyVj0y1WyiOr8tPAv7xAzuxW59f8p+Q==\n-----END PUBLIC KEY-----");
    setPrivateKey("-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgPp4XBkdj61lYLbf1\nxRIGSR4aoIfwjg8RHwsj4pVJfB+hRANCAATsR7xOU1oPEYQu+JtDx4YXcahvCjpc\nzcrf2a9bGo5j28UCpayS4I4lfMbDJWPTLVbKI6vy08C/vEDO7Fbn3/yn\n-----END PRIVATE KEY-----");
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="加密或解密模式"
              fullWidth
              size="small"
            >
              <ToggleButton value="encrypt" aria-label="加密">
                <LockIcon sx={{ mr: 1 }} />
                加密
              </ToggleButton>
              <ToggleButton value="decrypt" aria-label="解密">
                <LockOpenIcon sx={{ mr: 1 }} />
                解密
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={4}>
            {mode === "encrypt" && (
              <FormControl fullWidth size="small">
                <InputLabel id="ecc-encoding-label">输入编码</InputLabel>
                <Select
                  labelId="ecc-encoding-label"
                  id="ecc-encoding"
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
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              size="small"
              onClick={generateKeyPair}
            >
              生成密钥对
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              label={mode === "encrypt" ? "明文" : "密文"}
              multiline
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              placeholder={mode === "encrypt" ? "输入需要加密的明文" : "输入需要解密的密文"}
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
                    
                    if (mode === "encrypt") {
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
        
        {mode === "encrypt" ? (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ECC公钥"
              multiline
              rows={4}
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              variant="outlined"
              placeholder="输入ECC公钥 (PEM格式)"
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ECC私钥"
              multiline
              rows={4}
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              variant="outlined"
              placeholder="输入ECC私钥 (PEM格式)"
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            ECC-160是基于椭圆曲线密码学的加密算法，提供与RSA同等安全级别但密钥长度更短的加密方案。
            {mode === "encrypt" 
              ? " 加密过程使用接收者的公钥，只有拥有对应私钥的人才能解密。" 
              : " 解密过程需要使用与加密公钥对应的私钥。"}
          </Alert>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleProcess}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : (mode === "encrypt" ? <LockIcon /> : <LockOpenIcon />)}
            sx={{ py: 1.5 }}
          >
            {loading ? (mode === "encrypt" ? '加密中...' : '解密中...') : (mode === "encrypt" ? 'ECC-160加密' : 'ECC-160解密')}
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
                {mode === "encrypt" ? 'ECC-160加密结果:' : 'ECC-160解密结果:'}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  overflowWrap: 'break-word', 
                  wordBreak: 'break-word',
                  fontFamily: mode === "encrypt" ? 'monospace' : 'inherit',
                  pr: 4,
                  fontSize: '1rem',
                  color: mode === "encrypt" ? '#3498db' : '#2ecc71'
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
                <strong>注意：</strong> {mode === "encrypt" 
                  ? "ECC加密的密文只能使用对应的私钥解密，请确保安全保存私钥。" 
                  : "解密成功完成。请记住ECC密钥对是配对使用的，需要妥善保管私钥。"}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NewECC160Crypto; 