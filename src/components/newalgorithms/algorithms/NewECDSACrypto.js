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
const ecdsaSign = async (message, privateKey, curve, encoding) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 模拟ECDSA签名
        const rValue = Array(32).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        const sValue = Array(32).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        const mockSignature = {
          r: rValue,
          s: sValue,
          formatted: `${rValue}${sValue}`
        };
        
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

const ecdsaVerify = async (message, signature, publicKey, curve, encoding) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 模拟ECDSA验证
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

const NewECDSACrypto = () => {
  const [mode, setMode] = useState("sign"); // sign 或 verify
  const [message, setMessage] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState("");
  const [encoding, setEncoding] = useState("UTF8");
  const [curve, setCurve] = useState("secp256k1");
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
      setError("请输入EC私钥");
      return;
    }
    
    if (mode === "verify") {
      if (!signature.trim()) {
        setError("请输入签名");
        return;
      }
      if (!publicKey.trim()) {
        setError("请输入EC公钥");
        return;
      }
    }
    
    setLoading(true);
    setError("");
    
    try {
      let response;
      
      if (mode === "sign") {
        response = await ecdsaSign(message, privateKey, curve, encoding);
      } else {
        response = await ecdsaVerify(message, signature, publicKey, curve, encoding);
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

  const generateKeyPair = () => {
    // 模拟生成密钥对
    setPublicKey("-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE7Ee8TlNaDxGELvibQ8eGF3Gobwo6\nXM3K3w2vWxqOY9vFAqWskiOJXjGwyVj0y1WyiOr8tPAv7xAzuxW59f8p+Q==\n-----END PUBLIC KEY-----");
    setPrivateKey("-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgPp4XBkdj61lYLbf1\nxRIGSR4aoIfwjg8RHwsj4pVJfB+hRANCAATsR7xOU1oPEYQu+JtDx4YXcahvCjpc\nzcrf2a9bGo5j28UCpayS4I4lfMbDJWPTLVbKI6vy08C/vEDO7Fbn3/yn\n-----END PRIVATE KEY-----");
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
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="ecdsa-curve-label">椭圆曲线</InputLabel>
              <Select
                labelId="ecdsa-curve-label"
                id="ecdsa-curve"
                value={curve}
                label="椭圆曲线"
                onChange={(e) => setCurve(e.target.value)}
              >
                <MenuItem value="secp256k1">secp256k1 (比特币)</MenuItem>
                <MenuItem value="prime256v1">prime256v1 (P-256)</MenuItem>
                <MenuItem value="secp384r1">secp384r1 (P-384)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="ecdsa-encoding-label">消息编码</InputLabel>
              <Select
                labelId="ecdsa-encoding-label"
                id="ecdsa-encoding"
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
          <Grid item xs={12} sm={2}>
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
              label="EC私钥"
              multiline
              rows={4}
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              variant="outlined"
              placeholder="输入椭圆曲线私钥 (PEM格式)"
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ECDSA签名"
                multiline
                rows={3}
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                variant="outlined"
                placeholder="输入ECDSA签名 (r和s值的十六进制表示)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="EC公钥"
                multiline
                rows={3}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                variant="outlined"
                placeholder="输入椭圆曲线公钥 (PEM格式)"
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            ECDSA (椭圆曲线数字签名算法) 是一种使用椭圆曲线密码学的数字签名算法。
            {mode === "sign" ? 
              " 它使用私钥生成签名，相比RSA提供相同安全性但密钥长度更短。" : 
              " 验证过程使用公钥，能够确认消息的完整性和来源真实性。"}
            常用于比特币、以太坊等加密货币交易的签名验证。
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
            {loading ? (mode === "sign" ? '生成中...' : '验证中...') : (mode === "sign" ? '生成ECDSA签名' : '验证ECDSA签名')}
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
                ECDSA签名结果:
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  r值 (十六进制):
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
                      color: '#3498db'
                    }}
                  >
                    {result.r}
                  </Typography>
                  <Tooltip title="复制r值">
                    <IconButton 
                      sx={{ position: 'absolute', top: -8, right: -8 }}
                      onClick={() => copyToClipboard(result.r)}
                      size="small"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  s值 (十六进制):
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
                      color: '#3498db'
                    }}
                  >
                    {result.s}
                  </Typography>
                  <Tooltip title="复制s值">
                    <IconButton 
                      sx={{ position: 'absolute', top: -8, right: -8 }}
                      onClick={() => copyToClipboard(result.s)}
                      size="small"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  完整签名 (合并格式):
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
                      color: '#3498db'
                    }}
                  >
                    {result.formatted}
                  </Typography>
                  <Tooltip title="复制完整签名">
                    <IconButton 
                      sx={{ position: 'absolute', top: -8, right: -8 }}
                      onClick={() => copyToClipboard(result.formatted)}
                      size="small"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>提示：</strong> ECDSA签名由r值和s值组成，在不同系统中可能以不同格式表示。
                该签名可以与对应的公钥一起使用，验证消息的完整性和来源真实性。
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
                {result ? 'ECDSA签名验证成功' : 'ECDSA签名验证失败'}
              </Typography>
              <Typography variant="body1">
                {result ? 
                  '该消息的ECDSA签名有效，内容未被篡改，且来自于预期的发送者。' : 
                  '该消息的ECDSA签名无效，可能内容已被篡改或签名不是由预期的发送者生成的。'}
              </Typography>
            </Paper>
            
            {result && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>注意：</strong> 成功验证的ECDSA签名表明消息是由持有对应私钥的实体签署的，
                  并且自签名生成后未被修改。这是确保数字消息真实性和完整性的关键机制。
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NewECDSACrypto; 