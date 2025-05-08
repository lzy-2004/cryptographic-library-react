import React, { useState } from 'react';
import { Box, Alert, Paper, Typography, Tabs, Tab, Chip } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from '@mui/icons-material/School';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NewAESCrypto from './algorithms/NewAESCrypto';
import NewSM4Crypto from './algorithms/NewSM4Crypto';
import NewRC6Crypto from './algorithms/NewRC6Crypto';
import NewSHA1Crypto from './algorithms/NewSHA1Crypto';
import NewSHA256Crypto from './algorithms/NewSHA256Crypto';
import NewSHA3_512Crypto from './algorithms/NewSHA3_512Crypto';
import NewMD5Crypto from './algorithms/NewMD5Crypto';
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
import NewHEXCrypto from './algorithms/NewHEXCrypto';

const algorithmInfo = {
  'AES': {
    fullName: '高级加密标准 (Advanced Encryption Standard)',
    type: '对称加密算法',
    description: 'AES是美国联邦政府采用的一种区块加密标准，支持128位、192位和256位密钥长度。AES使用了替代-置换网络设计，比DES更快、更安全，已被广泛应用于各种安全协议中。',
    keyLength: '128位、192位或256位',
    blockSize: '128位',
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
    description: 'SM4是中国国家密码管理局发布的分组密码标准，密钥长度和分组长度均为128位。它是中国商用密码算法标准，已在金融、政务和商业领域广泛应用，提供了与AES相当的安全强度。',
    keyLength: '128位',
    blockSize: '128位',
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
  'RC6': {
    fullName: 'Rivest Cipher 6',
    type: '对称加密算法',
    description: 'RC6是由Ron Rivest设计的对称分组密码，具有可变的分组大小、密钥大小和轮数。它基于RC5的设计，但增加了乘法操作和四个工作寄存器，提高了安全性。曾作为AES候选算法之一。',
    keyLength: '可变，通常128位、192位或256位',
    blockSize: '128位',
    features: [
      '支持可变密钥长度',
      '基于简单的运算（加、异或、位移和乘法）',
      '参数化设计，灵活性高',
      '增强的混淆和扩散特性'
    ],
    applications: [
      '数据加密',
      '安全通信',
      '文件保护',
      '商业应用中的数据保护'
    ],
    strengths: [
      '设计简洁，实现高效',
      '可针对不同平台优化',
      '支持多种密钥长度，安全性可调'
    ],
    weaknesses: [
      '部分专利限制（现已过期）',
      '相比AES，使用范围较窄',
      '需要注意选择适当的参数'
    ],
    securityLevel: '高',
    standardization: '非标准化，但被广泛研究和分析'
  },
  'SHA1': {
    fullName: '安全哈希算法1 (Secure Hash Algorithm 1)',
    type: '哈希算法',
    description: 'SHA1生成160位的哈希值，已被发现存在碰撞攻击风险，不推荐用于安全应用。它曾广泛应用于TLS、SSL、PGP等安全协议中，但现代系统已逐渐迁移到SHA-2和SHA-3系列算法。',
    outputLength: '160位',
    features: [
      '生成160位（20字节）的哈希值',
      '基于MD4/MD5设计理念',
      '使用Merkle–Damgård结构',
      '处理速度较快'
    ],
    applications: [
      '历史上用于数字签名',
      '版本控制系统（如Git）',
      '数据完整性验证',
      '旧版SSL/TLS协议'
    ],
    strengths: [
      '实现简单，计算效率高',
      '被广泛部署和使用',
      '仍可用于非安全关键应用'
    ],
    weaknesses: [
      '2005年被发现理论上的弱点',
      '2017年实现了完整的碰撞攻击',
      '不再推荐用于安全应用',
      '对长度扩展攻击敏感'
    ],
    securityLevel: '低（不推荐用于安全应用）',
    standardization: '美国联邦信息处理标准(FIPS 180-4)'
  },
  'SHA256': {
    fullName: '安全哈希算法256 (Secure Hash Algorithm 256)',
    type: '哈希算法',
    description: 'SHA256是SHA-2家族的一部分，生成256位的哈希值，广泛用于安全应用。它提供了更高的安全性，被用于比特币区块链以及许多现代密码协议中，目前尚未发现有效的攻击方法。',
    outputLength: '256位',
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
  'SHA3-512': {
    fullName: '安全哈希算法3-512 (Secure Hash Algorithm 3-512)',
    type: '哈希算法',
    description: 'SHA3-512是SHA-3家族的一部分，生成512位哈希值，基于KECCAK算法。SHA-3是最新的哈希标准，采用海绵结构设计，在抵抗量子计算攻击方面提供了更好的安全保障。',
    outputLength: '512位',
    features: [
      '基于KECCAK算法的海绵结构设计',
      '提供强大的抗碰撞性能和单向性',
      '抵抗量子计算攻击的能力优于SHA-2',
      '设计灵活，可配置不同输出长度'
    ],
    applications: [
      '高安全性要求的哈希存储',
      '区块链和分布式账本技术',
      '数字签名和证书验证',
      '长期数据完整性校验'
    ],
    strengths: [
      '采用创新的海绵构造',
      '抵抗所有已知的攻击方法',
      '设计考虑了抗量子计算攻击',
      '可扩展性好，适应不同安全需求'
    ],
    weaknesses: [
      '计算速度稍慢于SHA-2系列',
      '在某些低性能设备上可能受到资源限制',
      '实现相对复杂，需要注意代码质量'
    ],
    securityLevel: '极高',
    standardization: '美国联邦信息处理标准(FIPS 202)'
  },
  'MD5': {
    fullName: '消息摘要算法5 (Message Digest Algorithm 5)',
    type: '哈希算法',
    description: 'MD5生成128位的哈希值，广泛用于早期数据完整性校验。由于已被证实存在严重的碰撞漏洞，现不推荐用于任何安全相关场景。其前身包括MD4和MD2等算法。',
    outputLength: '128位',
    features: [
      '生成128位（16字节）的哈希值',
      '基于Merkle–Damgård结构设计',
      '处理速度快、实现简单',
      '支持任意长度输入消息'
    ],
    applications: [
      '文件完整性验证（如下载校验）',
      '数字签名系统中的非安全用途',
      '数据库中密码存储的旧式加密方式',
      '历史版本控制系统的快照标识'
    ],
    strengths: [
      '计算效率高，适用于非安全场景',
      '广泛部署于老旧系统',
      '适用于快速数据指纹生成'
    ],
    weaknesses: [
      '1996年发现理论碰撞攻击',
      '2004年后可实际构造碰撞',
      '不再适用于身份验证或加密协议',
      '对长度扩展攻击敏感'
    ],
    securityLevel: '极低（不推荐用于安全应用）',
    standardization: 'RFC 1321'
  },
  'RIPEMD160': {
    fullName: 'RACE完整性原语评估消息摘要160',
    type: '哈希算法',
    description: 'RIPEMD160生成160位哈希值，是比特币地址生成过程中使用的哈希函数之一。它由欧洲RACE项目开发，设计独立于NSA，提供了与SHA1相似的安全性但采用不同的设计方法。',
    outputLength: '160位',
    features: [
      '生成160位的哈希值',
      '基于双线并行结构设计',
      '独立于政府机构开发',
      '提供良好的抗碰撞性'
    ],
    applications: [
      '比特币地址生成',
      '数据完整性校验',
      '欧洲地区的一些标准应用',
      '需要政府机构独立算法的场景'
    ],
    strengths: [
      '设计开放透明',
      '与SHA1安全强度相当但结构不同',
      '在比特币等加密货币中得到验证'
    ],
    weaknesses: [
      '输出长度短于当代推荐标准',
      '使用范围相对有限',
      '关注度和分析少于SHA系列'
    ],
    securityLevel: '中等',
    standardization: 'ISO/IEC 10118-3:2004'
  },
  'PBKDF2': {
    fullName: '基于密码的密钥派生函数2 (Password-Based Key Derivation Function 2)',
    type: '密钥派生函数',
    description: 'PBKDF2通过添加盐值和多次迭代来增强密码安全性，广泛用于密码存储。它能够有效抵抗彩虹表攻击和暴力破解，通过可配置的迭代次数来平衡安全性和性能需求。',
    features: [
      '支持可配置的迭代次数',
      '使用盐值防止彩虹表攻击',
      '可生成任意长度的密钥材料',
      '可选择不同的哈希函数作为基础'
    ],
    applications: [
      '安全存储用户密码',
      '从密码生成加密密钥',
      'Wi-Fi安全协议(WPA2)',
      '标准化的密码哈希方案'
    ],
    strengths: [
      '设计简单，易于实现',
      '可调整参数以适应不同的安全需求',
      '广泛部署，经过充分验证'
    ],
    weaknesses: [
      '对GPU/ASIC加速攻击相对脆弱',
      '计算资源要求随迭代次数线性增长',
      '现代推荐使用Argon2等更新的算法'
    ],
    securityLevel: '取决于参数配置',
    standardization: 'PKCS #5 v2.0, RFC 2898'
  },
  'HMACSHA1': {
    fullName: '基于SHA1的哈希消息认证码',
    type: 'HMAC算法',
    description: 'HMACSHA1将HMAC应用于SHA1哈希函数，用于验证消息的完整性和真实性。它结合密钥和消息进行哈希计算，确保消息在传输过程中未被篡改，并验证发送方的身份。',
    features: [
      '组合密钥和消息内容生成认证码',
      '基于SHA1哈希函数',
      '防止中间人篡改信息',
      '提供消息来源验证'
    ],
    applications: [
      'API身份验证',
      '安全通信协议',
      '数据完整性验证',
      '消息认证'
    ],
    strengths: [
      '实现简单，计算高效',
      '被广泛部署和使用',
      'HMAC结构弥补了部分SHA1的缺陷'
    ],
    weaknesses: [
      '基于SHA1，继承了其安全性问题',
      '现代系统推荐使用HMAC-SHA256等更强算法',
      '在高安全性要求场景下已不推荐使用'
    ],
    securityLevel: '中低（由于基于SHA1）',
    standardization: 'FIPS 198-1, RFC 2104'
  },
  'HMACSHA256': {
    fullName: '基于SHA256的哈希消息认证码',
    type: 'HMAC算法',
    description: 'HMACSHA256将HMAC应用于SHA256哈希函数，提供比HMAC-SHA1更强的安全性。它广泛应用于API认证、JWT签名以及其他需要消息认证的安全协议中。',
    features: [
      '使用SHA256作为底层哈希函数',
      '提供消息完整性和认证',
      '结合密钥增强安全性',
      '输出固定长度的认证码'
    ],
    applications: [
      'API认证和授权',
      'JWT(JSON Web Token)签名',
      '安全通信协议',
      '云服务身份验证'
    ],
    strengths: [
      '安全性高，无已知的实用性攻击',
      '计算效率适中',
      '广泛支持和标准化'
    ],
    weaknesses: [
      '计算开销比HMAC-SHA1大',
      '对密钥管理要求高',
      '在资源受限环境可能性能受限'
    ],
    securityLevel: '高',
    standardization: 'FIPS 198-1, RFC 2104, RFC 6234'
  },
  'Base64': {
    fullName: 'Base64编码',
    type: '编码算法',
    description: 'Base64是一种将二进制数据转换为ASCII字符的编码方案，常用于数据传输。它将3字节的二进制数据编码为4个可打印字符，使二进制数据能够在只支持文本的环境中安全传输，如电子邮件和HTTP请求。',
    features: [
      '将二进制数据编码为可打印ASCII字符',
      '编码后数据增大约33%',
      '使用64个不同的字符表示数据',
      '支持填充处理非3字节倍数的数据'
    ],
    applications: [
      '电子邮件附件编码(MIME)',
      'HTTP请求中传输二进制数据',
      'XML和JSON中嵌入二进制数据',
      '数字证书和密钥格式化'
    ],
    strengths: [
      '简单易用，广泛支持',
      '保证二进制数据在文本环境中传输',
      '标准化程度高，兼容性好'
    ],
    weaknesses: [
      '增加数据大小约33%',
      '不提供加密功能，仅是编码',
      '特定字符集可能在不同环境中兼容性有问题'
    ],
    securityLevel: '不适用（非安全算法）',
    standardization: 'RFC 4648'
  },
  'UTF-8': {
    fullName: 'UTF-8编码',
    type: '字符编码',
    description: 'UTF-8是一种可变长度字符编码，能够表示所有Unicode字符，是Web标准编码。它向后兼容ASCII编码，使用1-4个字节表示不同的字符，高效地支持多语言环境，已成为互联网上最常用的字符编码方式。',
    features: [
      '变长编码，使用1-4个字节表示字符',
      '与ASCII兼容，ASCII字符只占1字节',
      '能表示所有Unicode字符（超过130万个字符）',
      '自同步：可从任意位置恢复编码同步'
    ],
    applications: [
      'Web网页编码标准',
      '跨语言文本处理',
      '操作系统和编程语言字符处理',
      '国际化和本地化支持'
    ],
    strengths: [
      '向后兼容ASCII',
      '空间效率高，适合多语言环境',
      '自我同步，错误影响范围有限',
      '全球广泛采用，支持度高'
    ],
    weaknesses: [
      '非固定长度，处理可能复杂',
      '亚洲文字通常需要3字节，比某些专用编码效率低',
      '需要特殊处理字节序标记(BOM)'
    ],
    securityLevel: '不适用（非安全算法）',
    standardization: 'ISO 10646, RFC 3629, Unicode标准'
  },
  'HEX':{
    fullName: '十六进制编码',
    type: '编码算法',
    description: 'HEX是一种将二进制数据转换为十六进制字符的编码方式，常用于表示字节流。它将每个字节（8位）拆分为两个十六进制数字（0-9, A-F），从而将二进制数据转换为纯文本格式，便于显示和传输。',
    features: [
      '将每个字节编码为两个十六进制字符', 
      '编码后数据大小增加一倍', 
      '使用16个字符（0-9, A-F）表示数据', 
      '无填充机制，数据长度固定' 
    ],
    applications: [
      '校验和和哈希值表示（如MD5、SHA系列）', 
      '网络协议中传输字节地址（如MAC地址）',
      '调试时展示原始字节数据', 
      '区块链交易ID和钱包地址表示'
    ],
    strengths: ['结构简单，易于解析', 
      '支持所有字节值的准确表示', 
      '广泛应用于底层系统和协议'
    ],
     weaknesses: ['编码后体积增大一倍', 
      '不提供加密功能，仅是编码', 
      '可读性较差，需工具辅助理解'
    ], 
    securityLevel: '不适用（非安全算法）',
    standardization: 'IEEE, IETF等标准中常见'
  },
  'RSA1024': {
    fullName: 'RSA-1024',
    type: '非对称加密算法',
    description: 'RSA是一种公钥密码算法，1024表示密钥长度，用于加密和数字签名。它基于大数分解的计算难题，虽然目前1024位密钥长度已不再推荐用于高安全性应用，但其仍是非对称加密的重要算法。',
    keyLength: '1024位',
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
  'RSASHA1': {
    fullName: 'RSA-SHA1',
    type: '数字签名算法',
    description: 'RSA-SHA1结合了RSA加密和SHA1哈希，用于生成和验证数字签名。它首先使用SHA1生成消息摘要，然后用RSA私钥对摘要进行加密生成签名。虽然SHA1已不推荐用于新系统，但该方案仍在一些遗留系统中使用。',
    features: [
      '组合RSA和SHA1算法',
      '先哈希后加密的签名方式',
      '用于数字签名和身份验证',
      '使用公钥验证，私钥签名'
    ],
    applications: [
      '数字证书签名(旧版)',
      '代码签名(旧版)',
      '文档签名系统',
      '安全电子邮件协议'
    ],
    strengths: [
      '曾广泛部署和使用',
      '签名机制设计良好',
      '验证过程高效'
    ],
    weaknesses: [
      '使用SHA1，存在碰撞攻击风险',
      '现代应用应升级至RSA-SHA256或更新算法',
      '安全性已不满足当前标准'
    ],
    securityLevel: '低（由于使用SHA1）',
    standardization: 'PKCS#1, RFC 8017'
  },
  'ECC160': {
    fullName: '椭圆曲线密码术160 (Elliptic Curve Cryptography 160)',
    type: '非对称加密算法',
    description: 'ECC是基于椭圆曲线数学的加密技术，160表示密钥长度，比RSA更高效。椭圆曲线密码学提供了与RSA相同的安全级别但使用更短的密钥长度，显著提高了计算效率和减少了资源消耗。',
    keyLength: '160位',
    features: [
      '基于椭圆曲线上的离散对数问题',
      '密钥长度远短于同等安全级别的RSA',
      '适合资源受限环境',
      '支持加密和数字签名'
    ],
    applications: [
      '嵌入式设备和智能卡',
      '物联网安全',
      '移动设备通信',
      '资源受限环境的安全通信'
    ],
    strengths: [
      '更小的密钥长度提供同等安全性',
      '计算效率高，节省带宽和存储',
      '适合低功耗和限制计算能力的设备'
    ],
    weaknesses: [
      '160位ECC密钥在现代已不够安全',
      '某些实现容易受到侧信道攻击',
      '曲线选择对安全性至关重要',
      '实现比RSA更复杂'
    ],
    securityLevel: '中（160位已不推荐用于高安全要求）',
    standardization: 'ANSI X9.62, FIPS 186-4'
  },
  'ECDSA': {
    fullName: '椭圆曲线数字签名算法 (Elliptic Curve Digital Signature Algorithm)',
    type: '数字签名算法',
    description: 'ECDSA是基于椭圆曲线密码术的数字签名算法，提供与RSA相同的安全性但密钥更短。它广泛应用于比特币、以太坊等区块链技术中，以及TLS等安全协议，是现代数字签名的首选算法之一。',
    keyLength: '取决于曲线，通常160-521位',
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
      case 'MD5':
        return <NewMD5Crypto />;
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
      case 'HEX':
        return <NewHEXCrypto />;
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
            {info.keyLength && (
              <Chip 
                icon={<SecurityIcon />} 
                label={`密钥长度: ${info.keyLength}`} 
                sx={{ 
                  bgcolor: '#eeeeee', 
                  color: '#616161', 
                  '& .MuiChip-icon': { color: '#616161' } 
                }}
              />
            )}
            {info.outputLength && (
              <Chip 
                icon={<SecurityIcon />} 
                label={`输出长度: ${info.outputLength}`} 
                sx={{ 
                  bgcolor: '#eeeeee', 
                  color: '#616161', 
                  '& .MuiChip-icon': { color: '#616161' } 
                }}
              />
            )}
            {info.blockSize && (
              <Chip 
                icon={<SecurityIcon />} 
                label={`块大小: ${info.blockSize}`} 
                sx={{ 
                  bgcolor: '#eeeeee', 
                  color: '#616161', 
                  '& .MuiChip-icon': { color: '#616161' } 
                }}
              />
            )}
            {info.securityLevel && (
              <Chip 
                icon={<SecurityIcon />} 
                label={`安全级别: ${info.securityLevel}`} 
                sx={{ 
                  bgcolor: '#e0e0e0', 
                  color: '#424242', 
                  '& .MuiChip-icon': { color: '#424242' } 
                }}
              />
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
    const features = algorithmInfo[algo]?.features || [];
    return (
      <>
        {features.map((feature, index) => (
          <Typography component="li" key={index} sx={{ mb: 1, color: '#616161' }}>
            {feature}
          </Typography>
        ))}
      </>
    );
  };

  const renderLimitations = (algo) => {
    const weaknesses = algorithmInfo[algo]?.weaknesses || [];
    return (
      <>
        {weaknesses.map((weakness, index) => (
          <Typography component="li" key={index} sx={{ mb: 1, color: '#616161' }}>
            {weakness}
          </Typography>
        ))}
      </>
    );
  };

  const renderApplicationScenarios = (algo) => {
    const applications = algorithmInfo[algo]?.applications || [];
    return (
      <>
        {applications.map((application, index) => (
          <Typography component="li" key={index} sx={{ mb: 1, color: '#616161' }}>
            {application}
          </Typography>
        ))}
      </>
    );
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