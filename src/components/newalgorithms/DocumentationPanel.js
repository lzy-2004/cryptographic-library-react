import React from 'react';
import { Box, Paper, Typography, Divider, Chip, Grid } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const algorithmsDocumentation = {
  'AES': {
    fullName: '高级加密标准 (Advanced Encryption Standard)',
    type: '对称加密算法',
    keyLength: '128位、192位或256位',
    blockSize: '128位',
    description: 'AES是美国联邦政府采用的一种区块加密标准，由比利时密码学家Joan Daemen和Vincent Rijmen设计，最初称为Rijndael加密法。',
    features: [
      '替代DES成为现代对称加密的主流标准',
      '支持多种密钥长度：128位、192位和256位',
      '基于替代-置换网络设计，采用SP网络结构',
      '抵抗已知的所有密码分析攻击'
    ],
    applications: [
      '保护敏感政府信息',
      '金融交易数据加密',
      'VPN隧道加密',
      '安全通信协议如TLS/SSL',
      '硬盘和文件加密'
    ],
    strengths: [
      '计算效率高，适合硬件和软件实现',
      '经过广泛密码分析，被认为是安全的',
      '支持多种模式：ECB、CBC、CFB、OFB、CTR等'
    ],
    weaknesses: [
      'ECB模式下存在模式识别问题',
      '需要安全地管理和存储密钥',
      '用于认证时，应配合MAC或HMAC使用'
    ],
    securityLevel: '非常高（使用256位密钥）',
    standardization: '美国联邦信息处理标准(FIPS 197)'
  },
  'SM4': {
    fullName: '国密SM4加密算法',
    type: '对称加密算法',
    keyLength: '128位',
    blockSize: '128位',
    description: 'SM4是中国国家密码管理局发布的分组密码标准，前身为SMS4，主要用于无线局域网产品。它是中国自主知识产权的商用密码算法。',
    features: [
      '采用32轮非线性迭代结构',
      '使用固定的128位密钥长度和128位分组长度',
      '基于替代-置换网络设计',
      '符合中国商用密码标准'
    ],
    applications: [
      '中国政府和企业网络安全',
      '金融支付系统',
      '电子政务系统',
      '无线网络安全(WAPI)'
    ],
    strengths: [
      '针对中国应用场景优化',
      '计算效率高，适合硬件和软件实现',
      '与国际标准算法安全性相当'
    ],
    weaknesses: [
      '国际上认可度不如AES等算法',
      '需要安全地管理和存储密钥',
      '相关分析工具和文档相对较少'
    ],
    securityLevel: '高',
    standardization: '中国国家标准(GB/T 32907-2016)'
  },
  'SHA256': {
    fullName: '安全哈希算法256 (Secure Hash Algorithm 256)',
    type: '哈希算法',
    outputLength: '256位',
    description: 'SHA-256是SHA-2家族中的一员，由美国国家安全局(NSA)设计，作为SHA-1的继任者。它生成256位的哈希值，通常表示为64个十六进制字符。',
    features: [
      '输出固定长度的256位摘要',
      '单向函数，无法从哈希值逆向推导原始数据',
      '具有雪崩效应，输入的微小变化会导致输出的显著变化',
      '抗碰撞性：难以找到产生相同哈希值的两个不同输入'
    ],
    applications: [
      '数据完整性验证',
      '数字签名',
      '密码存储',
      '区块链和加密货币',
      '随机数生成'
    ],
    strengths: [
      '目前没有发现实用的攻击方法',
      '计算速度适中，安全性高',
      '广泛应用于各种安全系统'
    ],
    weaknesses: [
      '计算速度比MD5和SHA-1慢',
      '不适合直接用于密码存储（应配合加盐和迭代）',
      '量子计算发展可能威胁其安全性'
    ],
    securityLevel: '高',
    standardization: '美国联邦信息处理标准(FIPS 180-4)'
  },
  'RSA1024': {
    fullName: 'RSA-1024加密算法',
    type: '非对称加密算法',
    keyLength: '1024位',
    description: 'RSA是由Ron Rivest、Adi Shamir和Leonard Adleman在1977年提出的非对称加密算法，1024表示密钥长度。RSA的安全性基于大整数因数分解的困难性。',
    features: [
      '基于公钥和私钥对的密码系统',
      '公钥可公开分享，私钥需保密',
      '可用于加密和数字签名',
      '基于大整数因数分解的数学难题'
    ],
    applications: [
      '安全通信',
      '数字签名',
      'PKI基础设施',
      '安全密钥交换',
      '身份验证'
    ],
    strengths: [
      '成熟且广泛部署',
      '支持加密和签名功能',
      '数学原理简单易懂'
    ],
    weaknesses: [
      '计算成本高，操作速度慢',
      '1024位密钥长度在现代已不再视为安全',
      '对量子计算攻击脆弱',
      '实现不当易受侧信道攻击'
    ],
    securityLevel: '中（1024位已不推荐用于敏感数据）',
    standardization: 'PKCS#1, RFC 8017'
  },
  'ECDSA': {
    fullName: '椭圆曲线数字签名算法 (Elliptic Curve Digital Signature Algorithm)',
    type: '数字签名算法',
    keyLength: '取决于曲线，通常160-521位',
    description: 'ECDSA是基于椭圆曲线密码术的数字签名算法，是DSA(数字签名算法)应用椭圆曲线密码学的变体。它利用椭圆曲线上的离散对数问题提供安全性。',
    features: [
      '比RSA使用更小的密钥提供相同的安全级别',
      '签名生成和验证速度快',
      '基于椭圆曲线离散对数问题',
      '支持多种标准化曲线'
    ],
    applications: [
      '比特币和其他加密货币',
      '安全通信协议',
      '证书签名',
      '物联网设备认证',
      '智能卡应用'
    ],
    strengths: [
      '密钥、签名和计算复杂度都比RSA小',
      '在资源受限设备上效率高',
      '多项国际标准支持'
    ],
    weaknesses: [
      '实现复杂度高',
      '曲线选择对安全性影响大',
      '对随机数生成器质量要求高',
      '部分实现容易受侧信道攻击'
    ],
    securityLevel: '高',
    standardization: 'ANSI X9.62, FIPS 186-4, IEEE 1363'
  }
};

// 默认文档，当选中的算法没有详细文档时显示
const defaultDocumentation = {
  description: '该算法的详细文档正在完善中，请稍后查看。',
  features: ['文档完善中'],
  applications: ['文档完善中'],
  strengths: ['文档完善中'],
  weaknesses: ['文档完善中'],
  securityLevel: '未评估',
  standardization: '未知'
};

const DocumentationPanel = ({ algorithm }) => {
  const doc = algorithmsDocumentation[algorithm] || {
    ...defaultDocumentation,
    fullName: algorithm,
    type: '未知类型'
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 0,
        backgroundColor: 'background.paper',
        borderLeft: '4px solid',
        borderColor: 'secondary.main',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon sx={{ fontSize: 30, color: 'secondary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'secondary.main' }}>
            {doc.fullName}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Chip 
              icon={<CodeIcon />} 
              label={`类型: ${doc.type}`} 
              variant="outlined" 
              color="primary"
              sx={{ mb: 1, mr: 1 }}
            />
          </Grid>
          {doc.keyLength && (
            <Grid item xs={12} sm={6} md={4}>
              <Chip 
                icon={<VpnKeyIcon />} 
                label={`密钥长度: ${doc.keyLength}`} 
                variant="outlined" 
                color="primary"
                sx={{ mb: 1, mr: 1 }}
              />
            </Grid>
          )}
          {doc.outputLength && (
            <Grid item xs={12} sm={6} md={4}>
              <Chip 
                icon={<VpnKeyIcon />}
                label={`输出长度: ${doc.outputLength}`} 
                variant="outlined" 
                color="primary"
                sx={{ mb: 1, mr: 1 }}
              />
            </Grid>
          )}
          {doc.blockSize && (
            <Grid item xs={12} sm={6} md={4}>
              <Chip 
                icon={<VpnKeyIcon />}
                label={`块大小: ${doc.blockSize}`} 
                variant="outlined" 
                color="primary"
                sx={{ mb: 1, mr: 1 }}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <Chip 
              icon={<SecurityIcon />} 
              label={`安全级别: ${doc.securityLevel}`} 
              variant="outlined" 
              color={doc.securityLevel.includes('高') ? 'success' : 'warning'}
              sx={{ mb: 1, mr: 1 }}
            />
          </Grid>
        </Grid>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'text.primary', fontWeight: 600 }}>
          算法描述
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
          {doc.description}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  主要特点
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                {doc.features.map((feature, index) => (
                  <Typography component="li" key={index} variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                    {feature}
                  </Typography>
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mb: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VerifiedUserIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  优势
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                {doc.strengths.map((strength, index) => (
                  <Typography component="li" key={index} variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                    {strength}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  局限性
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                {doc.weaknesses.map((weakness, index) => (
                  <Typography component="li" key={index} variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                    {weakness}
                  </Typography>
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mb: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  应用场景
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                {doc.applications.map((application, index) => (
                  <Typography component="li" key={index} variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                    {application}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 2 }}>
            标准化:
          </Typography>
          <Chip label={doc.standardization} color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default DocumentationPanel; 