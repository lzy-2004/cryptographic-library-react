import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  Divider,
  IconButton,
  Snackbar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { UTF_8Encode, UTF_8Decode } from '../../../api/utf_8';

const NewUTF8Crypto = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState(0); // 0=encode， 1=decode
  const [outputFormat, setOutputFormat] = useState("hex"); // hex, binary, octal, decimal
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleModeChange = (event, newValue) => {
    setMode(newValue);
    setResult('');
    setError('');
  };

  const handleOutputFormatChange = (e) => {
    setOutputFormat(e.target.value);
  };

  const handleProcess = async () => {
    if (!input.trim()) {
      setError(mode === 0 ? "请输入要编码的文本" : "请输入要解码的UTF-8字节值");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      let response;
      
      if (mode === 0) {
        response = await UTF_8Encode(input, outputFormat);
        
        if (response.data.status !== 0) {
          throw new Error(response.data.message || 'UTF-8编码失败');
        }
        setResult(response.data.result);
      } else {
        response = await UTF_8Decode(input, outputFormat);
        
        if (response.data.status !== 0) {
          throw new Error(response.data.message || 'UTF-8解码失败');
        }
        setResult(response.data.result);
      }
    } catch (error) {
      setError(`${mode === 0 ? "编码" : "解码"}过程发生错误: ` + (error.message || "未知错误"));
    } finally {
      setLoading(false);
    }
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
              UTF-8是一种可变长度的字符编码，能够表示Unicode标准中的任何字符。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              UTF-8是Web和电子邮件等环境中最常用的编码方式，通过将字符转换为一组可变长度的字节序列来表示文本。
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={mode}
          onChange={handleModeChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#757575',
            },
          }}
        >
          <Tab
            icon={<LockIcon />}
            label="编码"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
          <Tab
            icon={<LockOpenIcon />}
            label="解码"
            sx={{
              '&.Mui-selected': {
                color: '#424242',
              },
            }}
          />
        </Tabs>
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <InfoIcon sx={{ mr: 1, color: '#616161' }} />
          参数设置
        </Typography>

        <TextField
          label={mode === 0 ? "输入文本" : `UTF-8字节值`}
          multiline
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 0 
            ? "输入需要转换为UTF-8编码的文本" 
            : `输入UTF-8编码的字节值（按照所选格式）`
          }
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

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <InputLabel id="output-format-label">编码格式</InputLabel>
              <Select
                labelId="output-format-label"
                value={outputFormat}
                onChange={handleOutputFormatChange}
                label="编码格式"
                sx={{
                  '& .MuiSelect-select': {
                    fontWeight: 500,
                    color: '#000000',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
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
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              >
                <MenuItem value="hex">十六进制</MenuItem>
                <MenuItem value="binary">二进制</MenuItem>
                <MenuItem value="octal">八进制</MenuItem>
                <MenuItem value="decimal">十进制</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleProcess}
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
          {loading ? (mode === 0 ? '编码中...' : '解码中...') : (mode === 0 ? 'UTF-8编码' : 'UTF-8解码')}
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          {mode === 0 ? 'UTF-8编码结果' : 'UTF-8解码结果'}
        </Typography>

        {result ? (
          <Box sx={{ position: 'relative', mt: 2 }}>
            <TextField
              multiline
              rows={6}
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
              {mode === 0 ? 'UTF-8编码结果将显示在此处' : 'UTF-8解码结果将显示在此处'}
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

export default NewUTF8Crypto;