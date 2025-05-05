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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { rsa1024Encrypt, rsa1024Decrypt, rsa1024GenerateKey } from '../../../api/rsa1024';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rsa-tabpanel-${index}`}
      aria-labelledby={`rsa-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const NewRSA1024Crypto = () => {
  const [tabValue, setTabValue] = useState(0);
  const [padding, setPadding] = useState("PKCS1");
  
  // 加密状态
  const [plaintext, setPlaintext] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [encryptError, setEncryptError] = useState("");
  
  // 解密状态
  const [ciphertext, setCiphertext] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [decryptError, setDecryptError] = useState("");
  
  // 密钥生成状态
  const [generatedPublicKey, setGeneratedPublicKey] = useState("");
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
  const [keyGenLoading, setKeyGenLoading] = useState(false);
  const [keyGenError, setKeyGenError] = useState("");
  
  // 高级选项
  const [outputEncoding, setOutputEncoding] = useState("base64");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEncrypt = async () => {
    if (!plaintext || !publicKey) {
      setEncryptError("请输入待加密文本和公钥");
      return;
    }
    
    setEncryptLoading(true);
    setEncryptError("");
    
    try {
      const response = await rsa1024Encrypt(plaintext, publicKey, "", outputEncoding);
      
      if (response.data && response.data.success) {
        setEncryptedText(response.data.data);
      } else {
        setEncryptError(response.data?.message || "加密失败");
      }
    } catch (error) {
      setEncryptError("加密过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setEncryptLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !privateKey) {
      setDecryptError("请输入待解密文本和私钥");
      return;
    }
    
    setDecryptLoading(true);
    setDecryptError("");
    
    try {
      const response = await rsa1024Decrypt(ciphertext, privateKey, "", outputEncoding);
      
      if (response.data && response.data.success) {
        setDecryptedText(response.data.data);
      } else {
        setDecryptError(response.data?.message || "解密失败");
      }
    } catch (error) {
      setDecryptError("解密过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setDecryptLoading(false);
    }
  };

  const handleGenerateKeyPair = async () => {
    setKeyGenLoading(true);
    setKeyGenError("");
    
    try {
      const response = await rsa1024GenerateKey();
      
      if (response.data && response.data.success) {
        setGeneratedPublicKey(response.data.data.publicKey);
        setGeneratedPrivateKey(response.data.data.privateKey);
      } else {
        setKeyGenError(response.data?.message || "密钥生成失败");
      }
    } catch (error) {
      setKeyGenError("密钥生成过程发生错误: " + (error.message || "未知错误"));
    } finally {
      setKeyGenLoading(false);
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

  const handleUseGeneratedKey = (type) => {
    if (type === 'encrypt') {
      setPublicKey(generatedPublicKey);
    } else {
      setPrivateKey(generatedPrivateKey);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          aria-label="RSA操作选项卡"
        >
          <Tab icon={<LockIcon />} label="加密" id="rsa-tab-0" aria-controls="rsa-tabpanel-0" />
          <Tab icon={<LockOpenIcon />} label="解密" id="rsa-tab-1" aria-controls="rsa-tabpanel-1" />
          <Tab icon={<VpnKeyIcon />} label="密钥对生成" id="rsa-tab-2" aria-controls="rsa-tabpanel-2" />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={showAdvancedOptions} 
              onChange={(e) => setShowAdvancedOptions(e.target.checked)}
              color="primary"
            />
          }
          label="显示高级选项"
        />
      </Box>
      
      {showAdvancedOptions && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'background.default' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="rsa-padding-label">填充方式</InputLabel>
                <Select
                  labelId="rsa-padding-label"
                  id="rsa-padding"
                  value={padding}
                  label="填充方式"
                  onChange={(e) => setPadding(e.target.value)}
                >
                  <MenuItem value="PKCS1">PKCS#1</MenuItem>
                  <MenuItem value="OAEP">OAEP</MenuItem>
                  <MenuItem value="NoPadding">无填充</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="rsa-encoding-label">输出编码</InputLabel>
                <Select
                  labelId="rsa-encoding-label"
                  id="rsa-encoding"
                  value={outputEncoding}
                  label="输出编码"
                  onChange={(e) => setOutputEncoding(e.target.value)}
                >
                  <MenuItem value="base64">Base64</MenuItem>
                  <MenuItem value="hex">十六进制</MenuItem>
                  <MenuItem value="binary">二进制</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              使用RSA公钥加密数据。请注意，RSA1024每次最多只能加密约117字节(取决于填充方式)。对于更长的数据，应使用混合加密方案。
            </Alert>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="待加密文本"
              multiline
              rows={4}
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              variant="outlined"
              placeholder="输入需要加密的明文"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="RSA公钥"
              multiline
              rows={4}
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              variant="outlined"
              placeholder="输入PEM格式的RSA公钥"
              InputProps={{
                endAdornment: generatedPublicKey ? (
                  <Tooltip title="使用生成的公钥">
                    <IconButton 
                      onClick={() => handleUseGeneratedKey('encrypt')}
                      sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                ) : null
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleEncrypt}
              disabled={encryptLoading}
              startIcon={encryptLoading ? <CircularProgress size={20} /> : <LockIcon />}
              sx={{ py: 1.5 }}
            >
              {encryptLoading ? '加密中...' : '使用公钥加密数据'}
            </Button>
          </Grid>
          
          {encryptError && (
            <Grid item xs={12}>
              <Alert severity="error">{encryptError}</Alert>
            </Grid>
          )}
          
          {encryptedText && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  加密结果 ({outputEncoding === 'base64' ? 'Base64' : outputEncoding === 'hex' ? '十六进制' : '二进制'}):
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflowWrap: 'break-word', 
                    wordBreak: 'break-word',
                    pr: 4 
                  }}
                >
                  {encryptedText}
                </Typography>
                <Tooltip title="复制到剪贴板">
                  <IconButton 
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => copyToClipboard(encryptedText)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              使用RSA私钥解密数据。解密操作需要与加密时使用相同的填充方式和编码格式。
            </Alert>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="待解密文本"
              multiline
              rows={4}
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              variant="outlined"
              placeholder={`输入${outputEncoding === 'base64' ? 'Base64' : outputEncoding === 'hex' ? '十六进制' : '二进制'}编码的加密数据`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="RSA私钥"
              multiline
              rows={4}
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              variant="outlined"
              placeholder="输入PEM格式的RSA私钥"
              InputProps={{
                endAdornment: generatedPrivateKey ? (
                  <Tooltip title="使用生成的私钥">
                    <IconButton 
                      onClick={() => handleUseGeneratedKey('decrypt')}
                      sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                ) : null
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleDecrypt}
              disabled={decryptLoading}
              startIcon={decryptLoading ? <CircularProgress size={20} /> : <LockOpenIcon />}
              sx={{ py: 1.5 }}
            >
              {decryptLoading ? '解密中...' : '使用私钥解密数据'}
            </Button>
          </Grid>
          
          {decryptError && (
            <Grid item xs={12}>
              <Alert severity="error">{decryptError}</Alert>
            </Grid>
          )}
          
          {decryptedText && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  解密结果:
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflowWrap: 'break-word', 
                    wordBreak: 'break-word',
                    pr: 4
                  }}
                >
                  {decryptedText}
                </Typography>
                <Tooltip title="复制到剪贴板">
                  <IconButton 
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => copyToClipboard(decryptedText)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              RSA密钥对由公钥和私钥组成。公钥用于加密数据，私钥用于解密。私钥必须妥善保管，而公钥可以安全地分享。
              <br /><br />
              <strong>注意:</strong> 现代应用中，RSA1024被认为安全性不足，对于敏感数据建议使用2048位或更高的密钥长度。
            </Alert>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleGenerateKeyPair}
              disabled={keyGenLoading}
              startIcon={keyGenLoading ? <CircularProgress size={20} /> : <VpnKeyIcon />}
              sx={{ py: 1.5 }}
            >
              {keyGenLoading ? '生成中...' : '生成RSA-1024密钥对'}
            </Button>
          </Grid>
          
          {keyGenError && (
            <Grid item xs={12}>
              <Alert severity="error">{keyGenError}</Alert>
            </Grid>
          )}
          
          {generatedPublicKey && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, position: 'relative', mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  RSA公钥 (PEM格式):
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflowWrap: 'break-word', 
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    pr: 4,
                    fontSize: '0.75rem'
                  }}
                >
                  {generatedPublicKey}
                </Typography>
                <Tooltip title="复制到剪贴板">
                  <IconButton 
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => copyToClipboard(generatedPublicKey)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Grid>
          )}
          
          {generatedPrivateKey && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, position: 'relative', bgcolor: 'rgba(255, 0, 0, 0.03)' }}>
                <Typography variant="subtitle2" gutterBottom color="error">
                  RSA私钥 (PEM格式) - 请妥善保管:
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    overflowWrap: 'break-word', 
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    pr: 4,
                    fontSize: '0.75rem'
                  }}
                >
                  {generatedPrivateKey}
                </Typography>
                <Tooltip title="复制到剪贴板">
                  <IconButton 
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => copyToClipboard(generatedPrivateKey)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Paper>
              
              <Alert severity="warning" sx={{ mt: 2 }}>
                警告: 私钥应当保密存储，不应泄露或在不安全的环境中传输。
              </Alert>
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default NewRSA1024Crypto; 