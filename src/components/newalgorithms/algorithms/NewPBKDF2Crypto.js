import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Divider
} from '@mui/material';
import { pbkdf2Encrypt } from '../../../api/pbkdf2';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
const NewPBKDF2Crypto = () => {
  const [password, setPassword] = useState('');
  const [outputFormat, setOutputFormat] = useState("hex");
  const [salt, setSalt] = useState('');
  const [iterations, setIterations] = useState(10000);
  const [keyLength, setKeyLength] = useState(64);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);
  const handleOutputFormatChange = (e) => {
    setOutputFormat(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSaltChange = (e) => {
    setSalt(e.target.value);
  };
  const handleIterationsChange = (e) => {
    setIterations(e.target.value);
  };
  const handleKeyLengthChange = (e) => {
    setKeyLength(e.target.value);
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
  const handleHash = async () => {
      setLoading(true);
      setError("");
  
      try {
        const response = await pbkdf2Encrypt(password, salt, iterations, keyLength, outputFormat);
        
        if (response && response.data) {
          if (response.data.status !== undefined && response.data.status !== 0) {
            throw new Error(response.data.message || '哈希计算失败');
          }
          setResult(response.data.result || '');
        } else {
          setError(response.data.message || "哈希计算失败");
        }
      } catch (error) {
        setError("哈希计算过程发生错误: " + (error.message || "未知错误"));
      } finally {
        setLoading(false);
      }
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
              PBKDF2是一种密钥派生函数，通过对密码添加盐值并多次迭代哈希来增强安全性。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PBKDF2常用于密码存储、密钥派生、文件加密、区块链技术、身份验证系统中，由于其良好的安全性，PBKDF2被广泛推荐作为密码哈希算法之一。
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          参数设置
        </Typography>

        <TextField
          label="密码（password）"
          multiline
          rows={4}
          value={password}
          onChange={handlePasswordChange}
          placeholder="在此输入密码..."
          fullWidth
          variant="outlined"
          margin="normal"
          sx={{
            mb: 1,
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
        <TextField
          label="盐值（salt）"
          multiline
          rows={4}
          value={salt}
          onChange={handleSaltChange}
          placeholder="在此输入盐值..."
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
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 2, 
          mb: 3,
          width: '100%'
        }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="迭代次数（iterations）"
              value={iterations}
              onChange={handleIterationsChange}
              type="number"
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  height: '56px'
                },
                '& .MuiInputBase-input': {
                  fontWeight: 500,
                  color: '#000000',
                  fontSize: '1rem',
                },
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
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <TextField
              label="生成密钥长度（keyLength）以字节为单位"
              value={keyLength}
              onChange={handleKeyLengthChange}
              type="number"
              inputProps={{ min: 16, max: 512 }}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  height: '56px'
                },
                '& .MuiInputBase-input': {
                  fontWeight: 500,
                  color: '#000000',
                  fontSize: '1rem',
                },
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
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth variant="outlined" sx={{
              '& .MuiInputBase-root': {
                height: '56px'
              }
            }}>
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
                    borderColor: '#e0e0e0',
                    borderWidth: '1px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9e9e9e',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#757575',
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
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                  },
                }}
              >
                <MenuItem value="hex">十六进制</MenuItem>
                <MenuItem value="base64">Base64</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

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
          {loading ? '哈希计算中...' : '生成PBKDF2密钥'}
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          PBKDF2 密钥结果
        </Typography>

        {result ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
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
              PBKDF2密钥结果将显示在此处
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

export default NewPBKDF2Crypto;