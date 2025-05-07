import React, { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import NewAlgorithmNavigation from './components/newalgorithms/NewAlgorithmNavigation';
import NewCryptoForm from './components/newalgorithms/NewCryptoForm';
import Header from './components/newalgorithms/Header';

// 创建自定义主题
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2ecc71',
    },
    background: {
      default: '#0a192f',
      paper: '#112240',
      left: '#130c0e'
    },
    text: {
      primary: '#e6f1ff',
      secondary: '#8892b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        // * {
        //   border-radius: 0 !important;
        // }
        hr, .MuiDivider-root, .MuiTableCell-root {
          display: none !important;
          //height: 0 !important;
          border: none !important;
        }
        .MuiBox-root, .MuiPaper-root, .MuiContainer-root {
          //margin: -1px !important;
          border: none !important;
        }
        .main-content-container {
          margin-top: -1px !important;
          margin-bottom: -1px !important;
        }
      `
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          display: 'none',
          visibility: 'hidden',
          margin: 0,
          padding: 0,
          height: 0,
          border: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          "& > hr": {
            display: "none"
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
  },
});

function NewApp() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('AES');
  

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'background.default',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}>
        <Header />
        <Box sx={{ 
          display: 'flex', 
          flex: 1,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }}>
          <NewAlgorithmNavigation 
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={setSelectedAlgorithm}
          />
          
          <Box component="main" sx={{ 
            flexGrow: 1, 
            p: 0,
            position: 'relative',
            display: 'flex',
          }}>
            <Container maxWidth={false} disableGutters sx={{ 
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: 0,
              margin: 0,
              width: '100%',
            }}>
              <NewCryptoForm algorithm={selectedAlgorithm} />
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default NewApp;