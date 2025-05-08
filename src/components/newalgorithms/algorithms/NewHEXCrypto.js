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
  Tab
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { hexEncode, hexDecode } from '../../../api/hex';

const NewHEXCrypto = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState(0); // 0=encode， 1=decode
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);

  const handleModeChange = (event, newValue) => {
    setMode(newValue);
    setResult('');
    setError('');
  };

  const handleProcess = async () => {
    setLoading(true);
    setError("");
    
    try {
      let response;
      
      if (mode === 0) {
        response = await hexEncode(input);
      } else {
        response = await hexDecode(input);
      }
      
      if (response && response.data) {
        if (response.data.status !== undefined && response.data.status !== 0) {
          throw new Error(response.data.message || (mode === 0 ? '编码失败' : '解码失败'));
        }
        setResult(response.data.result);
      } else {
        setError(response.data?.message || (mode === 0 ? "编码失败" : "解码失败"));
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
                HEX是一种编码方式，可以将二进制数据转换为十六进制字符。
            </Typography>
            <Typography variant="body2" color="text.secondary">
                HEX常用于在调试、网络协议和区块链等场景中表示字节数据，通过将每个字节转换为两位十六进制字符来便于查看和传输。
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
        <TextField
          label={mode === 0 ? "输入文本" : "十六进制字符串"}
          multiline
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 0 ? "输入需要编码为十六进制的文本" : "输入需要解码的十六进制字符串"}
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
          {loading ? (mode === 0 ? '编码中...' : '解码中...') : (mode === 0 ? '十六进制编码' : '十六进制解码')}
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#424242' }}>
          <ContentCopyIcon sx={{ mr: 1, color: '#616161' }} />
          {mode === 0 ? '十六进制编码结果' : '十六进制解码结果'}
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
                  fontFamily: mode === 0 ? 'monospace' : 'inherit',
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
                    {mode === 0 ? '编码结果将显示在此处' : '解码结果将显示在此处'}
                </Typography>
            </Box>
        )}
      </Paper>

      <Snackbar
        open={showCopiedSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="已复制到剪贴板"
      />
    </Box>
  );
};

export default NewHEXCrypto;