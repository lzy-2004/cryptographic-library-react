import React, { useState } from 'react';
import { Box, Alert, Paper, Typography, Divider, Tabs, Tab, Button, Chip } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NewAESCrypto from './algorithms/NewAESCrypto';
import NewSM4Crypto from './algorithms/NewSM4Crypto';
import NewRC6Crypto from './algorithms/NewRC6Crypto';
import NewSHA1Crypto from './algorithms/NewSHA1Crypto';
import NewSHA256Crypto from './algorithms/NewSHA256Crypto';
import NewSHA3_512Crypto from './algorithms/NewSHA3_512Crypto';
import NewPBKDF2Crypto from './algorithms/NewPBKDF2Crypto';
import NewRIPEMD160Crypto from './algorithms/NewRIPEMD160Crypto';
import NewHMACSHA1Crypto from './algorithms/NewHMACSHA1Crypto';
import NewHMACSHA256Crypto from './algorithms/NewHMACSHA256Crypto';
import NewBase64Crypto from './algorithms/NewBase64Crypto';
import NewUTF8Crypto from './algorithms/NewUTF8Crypto';
import NewRSA1024Crypto from './algorithms/NewRSA1024Crypto';
import NewRSASHA1Crypto from './algorithms/NewRSASHA1Crypto';
import NewECC160Crypto from './algorithms/NewECC160Crypto';
import NewECDSACrypto from './algorithms/NewECDSACrypto';

const algorithmInfo = {
  'AES': {
    fullName: '高级加密标准 (Advanced Encryption Standard)',
    type: '对称加密算法',
    description: 'AES是美国联邦政府采用的一种区块加密标准，支持128位、192位和256位密钥长度。AES使用了替代-置换网络设计，比DES更快、更安全，已被广泛应用于各种安全协议中。'
  },
  'SM4': {
    fullName: '国密SM4加密算法',
    type: '对称加密算法',
    description: 'SM4是中国国家密码管理局发布的分组密码标准，密钥长度和分组长度均为128位。它是中国商用密码算法标准，已在金融、政务和商业领域广泛应用，提供了与AES相当的安全强度。'
  },
  'RC6': {
    fullName: 'Rivest Cipher 6',
    type: '对称加密算法',
    description: 'RC6是由Ron Rivest设计的对称分组密码，具有可变的分组大小、密钥大小和轮数。它基于RC5的设计，但增加了乘法操作和四个工作寄存器，提高了安全性。曾作为AES候选算法之一。'
  },
  'SHA1': {
    fullName: '安全哈希算法1 (Secure Hash Algorithm 1)',
    type: '哈希算法',
    description: 'SHA1生成160位的哈希值，已被发现存在碰撞攻击风险，不推荐用于安全应用。它曾广泛应用于TLS、SSL、PGP等安全协议中，但现代系统已逐渐迁移到SHA-2和SHA-3系列算法。'
  },
  'SHA256': {
    fullName: '安全哈希算法256 (Secure Hash Algorithm 256)',
    type: '哈希算法',
    description: 'SHA256是SHA-2家族的一部分，生成256位的哈希值，广泛用于安全应用。它提供了更高的安全性，被用于比特币区块链以及许多现代密码协议中，目前尚未发现有效的攻击方法。'
  },
  'SHA3-512': {
    fullName: '安全哈希算法3-512 (Secure Hash Algorithm 3-512)',
    type: '哈希算法',
    description: 'SHA3-512是SHA-3家族的一部分，生成512位哈希值，基于KECCAK算法。SHA-3是最新的哈希标准，采用海绵结构设计，在抵抗量子计算攻击方面提供了更好的安全保障。'
  },
  'RIPEMD160': {
    fullName: 'RACE完整性原语评估消息摘要160',
    type: '哈希算法',
    description: 'RIPEMD160生成160位哈希值，是比特币地址生成过程中使用的哈希函数之一。它由欧洲RACE项目开发，设计独立于NSA，提供了与SHA1相似的安全性但采用不同的设计方法。'
  },
  'PBKDF2': {
    fullName: '基于密码的密钥派生函数2 (Password-Based Key Derivation Function 2)',
    type: '密钥派生函数',
    description: 'PBKDF2通过添加盐值和多次迭代来增强密码安全性，广泛用于密码存储。它能够有效抵抗彩虹表攻击和暴力破解，通过可配置的迭代次数来平衡安全性和性能需求。'
  },
  'HMACSHA1': {
    fullName: '基于SHA1的哈希消息认证码',
    type: 'HMAC算法',
    description: 'HMACSHA1将HMAC应用于SHA1哈希函数，用于验证消息的完整性和真实性。它结合密钥和消息进行哈希计算，确保消息在传输过程中未被篡改，并验证发送方的身份。'
  },
  'HMACSHA256': {
    fullName: '基于SHA256的哈希消息认证码',
    type: 'HMAC算法',
    description: 'HMACSHA256将HMAC应用于SHA256哈希函数，提供比HMAC-SHA1更强的安全性。它广泛应用于API认证、JWT签名以及其他需要消息认证的安全协议中。'
  },
  'BASE64': {
    fullName: 'Base64编码',
    type: '编码算法',
    description: 'Base64是一种将二进制数据转换为ASCII字符的编码方案，常用于数据传输。它将3字节的二进制数据编码为4个可打印字符，使二进制数据能够在只支持文本的环境中安全传输，如电子邮件和HTTP请求。'
  },
  'UTF-8': {
    fullName: 'UTF-8编码',
    type: '字符编码',
    description: 'UTF-8是一种可变长度字符编码，能够表示所有Unicode字符，是Web标准编码。它向后兼容ASCII编码，使用1-4个字节表示不同的字符，高效地支持多语言环境，已成为互联网上最常用的字符编码方式。'
  },
  'RSA1024': {
    fullName: 'RSA-1024',
    type: '非对称加密算法',
    description: 'RSA是一种公钥密码算法，1024表示密钥长度，用于加密和数字签名。它基于大数分解的计算难题，虽然目前1024位密钥长度已不再推荐用于高安全性应用，但其仍是非对称加密的重要算法。'
  },
  'RSASHA1': {
    fullName: 'RSA-SHA1',
    type: '数字签名算法',
    description: 'RSA-SHA1结合了RSA加密和SHA1哈希，用于生成和验证数字签名。它首先使用SHA1生成消息摘要，然后用RSA私钥对摘要进行加密生成签名。虽然SHA1已不推荐用于新系统，但该方案仍在一些遗留系统中使用。'
  },
  'ECC160': {
    fullName: '椭圆曲线密码术160 (Elliptic Curve Cryptography 160)',
    type: '非对称加密算法',
    description: 'ECC是基于椭圆曲线数学的加密技术，160表示密钥长度，比RSA更高效。椭圆曲线密码学提供了与RSA相同的安全级别但使用更短的密钥长度，显著提高了计算效率和减少了资源消耗。'
  },
  'ECDSA': {
    fullName: '椭圆曲线数字签名算法 (Elliptic Curve Digital Signature Algorithm)',
    type: '数字签名算法',
    description: 'ECDSA是基于椭圆曲线密码术的数字签名算法，提供与RSA相同的安全性但密钥更短。它广泛应用于比特币、以太坊等区块链技术中，以及TLS等安全协议，是现代数字签名的首选算法之一。'
  }
};

// 界面模式枚举
const VIEW_MODES = {
  TOOL: 0,
  DOCUMENT: 1
};

const NewCryptoForm = ({ algorithm }) => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.TOOL);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const renderAlgorithmInterface = () => {
    switch (algorithm.toUpperCase()) {
      case 'AES':
        return <NewAESCrypto />;
      case 'SM4':
        return <NewSM4Crypto />;
      case 'RC6':
        return <NewRC6Crypto />;
      case 'RSA1024':
        return <NewRSA1024Crypto />;
      case 'RSASHA1':
        return <NewRSASHA1Crypto />;
      case 'ECC160':
        return <NewECC160Crypto />;
      case 'ECDSA':
        return <NewECDSACrypto />;
      case 'SHA1':
        return <NewSHA1Crypto />;
      case 'SHA256':
        return <NewSHA256Crypto />;
      case 'SHA3-512':
        return <NewSHA3_512Crypto />;
      case 'PBKDF2':
        return <NewPBKDF2Crypto />;
      case 'RIPEMD160':
        return <NewRIPEMD160Crypto />;
      case 'HMACSHA1':
        return <NewHMACSHA1Crypto />;
      case 'HMACSHA256':
        return <NewHMACSHA256Crypto />;
      case 'BASE64':
        return <NewBase64Crypto />;
      case 'UTF-8':
        return <NewUTF8Crypto />;
      default:
        return <Alert severity="error">未知算法: {algorithm}</Alert>;
    }
  };

  const renderAlgorithmDocument = () => {
    const info = algorithmInfo[algorithm] || {
      fullName: algorithm,
      type: '未知类型',
      description: '暂无描述'
    };

    return (
      <Box sx={{ height: '100%' }}>
        <Paper 
          elevation={1} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            bgcolor: '#f5f5f5',
            color: '#333',
            mb: 3,
            borderLeft: '4px solid #757575',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ArticleIcon sx={{ fontSize: 28, mr: 2, color: '#616161' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#424242' }}>
              {info.fullName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Chip 
              icon={<CodeIcon />} 
              label={`类型: ${info.type}`} 
              sx={{ 
                bgcolor: '#eeeeee', 
                color: '#616161', 
                '& .MuiChip-icon': { color: '#616161' } 
              }}
            />
            {algorithm === 'AES' && (
              <>
                <Chip 
                  icon={<SecurityIcon />} 
                  label="密钥长度: 128位、192位或256位" 
                  sx={{ 
                    bgcolor: '#eeeeee', 
                    color: '#616161', 
                    '& .MuiChip-icon': { color: '#616161' } 
                  }}
                />
                <Chip 
                  icon={<SecurityIcon />} 
                  label="块大小: 128位" 
                  sx={{ 
                    bgcolor: '#eeeeee', 
                    color: '#616161', 
                    '& .MuiChip-icon': { color: '#616161' } 
                  }}
                />
                <Chip 
                  icon={<SecurityIcon />} 
                  label="安全级别: 非常高（使用256位密钥）" 
                  sx={{ 
                    bgcolor: '#e0e0e0', 
                    color: '#424242', 
                    '& .MuiChip-icon': { color: '#424242' } 
                  }}
                />
              </>
            )}
            {algorithm === 'SHA3-512' && (
              <>
                <Chip 
                  icon={<SecurityIcon />} 
                  label="输出长度: 512位" 
                  sx={{ 
                    bgcolor: '#eeeeee', 
                    color: '#616161', 
                    '& .MuiChip-icon': { color: '#616161' } 
                  }}
                />
                <Chip 
                  icon={<SecurityIcon />} 
                  label="安全级别: 极高" 
                  sx={{ 
                    bgcolor: '#e0e0e0', 
                    color: '#424242', 
                    '& .MuiChip-icon': { color: '#424242' } 
                  }}
                />
              </>
            )}
          </Box>
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
            算法描述
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#616161' }}>
            {info.description}
          </Typography>
        </Paper>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'white',
              color: '#333',
              borderLeft: '4px solid #4caf50'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 24, mr: 2, color: '#4caf50' }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#424242' }}>
                主要特点
              </Typography>
            </Box>
            <Box component="ul" sx={{ pl: 4, mb: 0 }}>
              {renderMainFeatures(algorithm)}
            </Box>
          </Paper>
          
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'white',
              color: '#333',
              borderLeft: '4px solid #ff9800'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PriorityHighIcon sx={{ fontSize: 24, mr: 2, color: '#ff9800' }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#424242' }}>
                局限性
              </Typography>
            </Box>
            <Box component="ul" sx={{ pl: 4, mb: 0 }}>
              {renderLimitations(algorithm)}
            </Box>
          </Paper>
          
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'white',
              color: '#333',
              borderLeft: '4px solid #2196f3'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 24, mr: 2, color: '#2196f3' }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#424242' }}>
                应用场景
              </Typography>
            </Box>
            <Box component="ul" sx={{ pl: 4, mb: 0 }}>
              {renderApplicationScenarios(algorithm)}
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  };

  const renderMainFeatures = (algo) => {
    switch(algo.toUpperCase()) {
      case 'AES':
        return (
          <>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              替代DES成为现代对称加密的主流标准
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              支持多种密钥长度：128位、192位和256位
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              基于替代-置换网络设计，采用SP网络结构
            </Typography>
            <Typography component="li" sx={{ color: '#616161' }}>
              抵抗已知的所有密码分析攻击
            </Typography>
          </>
        );
      case 'SHA3-512':
        return (
          <>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              基于KECCAK算法的海绵结构设计
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              提供强大的抗碰撞性能和单向性
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              抵抗量子计算攻击的能力优于SHA-2
            </Typography>
            <Typography component="li" sx={{ color: '#616161' }}>
              设计灵活，可配置不同输出长度
            </Typography>
          </>
        );
      default:
        return (
          <Typography component="li" sx={{ color: '#616161' }}>
            暂无特点信息
          </Typography>
        );
    }
  };

  const renderLimitations = (algo) => {
    switch(algo.toUpperCase()) {
      case 'AES':
        return (
          <>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              ECB模式下存在模式识别问题
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              需要安全地管理和存储密钥
            </Typography>
            <Typography component="li" sx={{ color: '#616161' }}>
              用于认证时，应配合MAC或HMAC使用
            </Typography>
          </>
        );
      case 'SHA3-512':
        return (
          <>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              计算速度稍慢于SHA-2系列
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              在某些低性能设备上可能受到资源限制
            </Typography>
            <Typography component="li" sx={{ color: '#616161' }}>
              实现相对复杂，需要注意代码质量
            </Typography>
          </>
        );
      default:
        return (
          <Typography component="li" sx={{ color: '#616161' }}>
            暂无局限性信息
          </Typography>
        );
    }
  };

  const renderApplicationScenarios = (algo) => {
    switch(algo.toUpperCase()) {
      case 'AES':
        return (
          <>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              保护敏感政府信息
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              金融交易数据加密
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              VPN隧道加密
            </Typography>
            <Typography component="li" sx={{ color: '#616161' }}>
              安全通信协议如TLS/SSL
            </Typography>
          </>
        );
      case 'SHA3-512':
        return (
          <>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              高安全性要求的哈希存储
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              区块链和分布式账本技术
            </Typography>
            <Typography component="li" sx={{ mb: 1, color: '#616161' }}>
              数字签名和证书验证
            </Typography>
            <Typography component="li" sx={{ color: '#616161' }}>
              长期数据完整性校验
            </Typography>
          </>
        );
      default:
        return (
          <Typography component="li" sx={{ color: '#616161' }}>
            暂无应用场景信息
          </Typography>
        );
    }
  };

  const info = algorithmInfo[algorithm] || {
    fullName: algorithm,
    type: '未知类型',
    description: '暂无描述'
  };

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'white' }}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          borderRadius: 0,
          borderLeft: '4px solid',
          borderColor: '#757575',
          bgcolor: 'white',
          color: '#424242',
          mb: 0
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#424242' }}>
              {info.fullName}
            </Typography>
            
            <Typography variant="subtitle1" sx={{ color: '#757575' }}>
              <strong>类型:</strong> {info.type}
            </Typography>
          </Box>
          
          <Box>
            <Tabs 
              value={viewMode} 
              onChange={handleModeChange} 
              variant="standard"
              textColor="inherit"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#757575"
                }
              }}
            >
              <Tab icon={<CodeIcon />} label="加解密工具" />
              <Tab icon={<ArticleIcon />} label="算法文档" />
            </Tabs>
          </Box>
        </Box>
      </Paper>
      
      <Box 
        sx={{ 
          height: 'calc(100% - 130px)',
          overflow: 'auto'
        }}
      >
        {viewMode === VIEW_MODES.TOOL ? renderAlgorithmInterface() : renderAlgorithmDocument()}
      </Box>
    </Box>
  );
};

export default NewCryptoForm; 