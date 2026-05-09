// 半导体设备企业数据库 - 基于真实企业信息
import { Company as SCCompany } from './companyDatabase'

export type Company = SCCompany

export const semiconductorCompanies: Company[] = [
  {
    id: 'sme',
    name: '上海微电子装备（集团）股份有限公司',
    matchScore: 99,
    location: '上海浦东',
    industry: '半导体设备',
    tags: ['光刻机', '国有控股', '高新技术企业'],
    advantages: ['国内光刻机龙头', '技术领先', '国产替代'],
    riskLevel: 'low',
    fullAddress: '中国（上海）自由贸易试验区张东路1525号',
    contactPhone: '021-5080-8000',
    contactEmail: 'contact@sme.com.cn',
    website: 'www.sme.com.cn',
    foundedYear: '2002',
    employeeCount: '1000-1999人',
    annualRevenue: '50-100亿元',
    businessScope: [
      '半导体装备开发、设计、制造',
      '泛半导体装备制造',
      '高端智能装备制造',
      '光刻机研发与生产',
      '技术服务与进出口'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      '高新技术企业认证',
      '国家重大技术装备企业'
    ],
    riskFactors: [
      '受国际技术封锁影响',
      '高端光刻机技术攻关难度大'
    ],
    cooperationHistory: {
      totalOrders: 25,
      completedOrders: 23,
      totalAmount: '15,800万元',
      lastCooperation: '2024-03-20'
    },
    financialStatus: {
      creditRating: 'AAA',
      paymentTerms: '月结30天',
      financialHealth: 'excellent'
    },
    mainProducts: ['光刻机', '刻蚀机', '薄膜沉积设备', '清洗设备', '检测设备'],
    productionCapacity: '年产能100台套',
    deliveryTime: '180-365天',
    ratings: {
      quality: 4.9,
      delivery: 4.5,
      service: 4.8,
      price: 4.0,
      overall: 4.6
    }
  },
  {
    id: 'amec',
    name: '中微半导体设备（上海）股份有限公司',
    matchScore: 98,
    location: '上海浦东',
    industry: '半导体设备',
    tags: ['刻蚀机', '上市公司', '外商投资'],
    advantages: ['刻蚀机国际领先', '技术实力强', '市场份额高'],
    riskLevel: 'low',
    fullAddress: '上海市浦东新区金桥出口加工区（南区）泰华路188号',
    contactPhone: '021-6100-1111',
    contactEmail: 'info@amec-inc.com',
    website: 'www.amec-inc.com',
    foundedYear: '2004',
    employeeCount: '2000+人',
    annualRevenue: '60-80亿元',
    businessScope: [
      '集成电路设备研发组装',
      '泛半导体设备制造',
      '微观加工设备制造',
      '刻蚀设备生产',
      '技术咨询与服务'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      '高新技术企业认证',
      '科创板上市公司'
    ],
    riskFactors: [
      '国际市场波动影响',
      '技术竞争加剧'
    ],
    cooperationHistory: {
      totalOrders: 32,
      completedOrders: 31,
      totalAmount: '22,500万元',
      lastCooperation: '2024-04-10'
    },
    financialStatus: {
      creditRating: 'AA+',
      paymentTerms: '预付30%，月结70%',
      financialHealth: 'excellent'
    },
    mainProducts: ['等离子体刻蚀设备', '化学薄膜设备', 'MOCVD设备', '清洗设备', '检测设备'],
    productionCapacity: '年产能300台套',
    deliveryTime: '90-180天',
    ratings: {
      quality: 4.9,
      delivery: 4.7,
      service: 4.8,
      price: 3.8,
      overall: 4.8
    }
  },
  {
    id: 'acmr',
    name: '盛美半导体设备（上海）股份有限公司',
    matchScore: 96,
    location: '上海浦东',
    industry: '半导体设备',
    tags: ['清洗设备', '上市公司', '外商投资'],
    advantages: ['清洗设备领先', '技术创新强', '客户资源好'],
    riskLevel: 'low',
    fullAddress: '中国（上海）自由贸易试验区丹桂路999弄5、6、7、8号全幢',
    contactPhone: '021-5080-1888',
    contactEmail: 'info@acmr.com',
    website: 'www.acmr.com',
    foundedYear: '2005',
    employeeCount: '1500+人',
    annualRevenue: '40-60亿元',
    businessScope: [
      '半导体器件专用设备制造',
      '电子专用设备制造',
      '清洗设备研发生产',
      '专用设备修理',
      '技术服务与进出口'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      '科创板上市公司',
      '高新技术企业认证'
    ],
    riskFactors: [
      '海外业务占比高',
      '汇率波动风险'
    ],
    cooperationHistory: {
      totalOrders: 28,
      completedOrders: 27,
      totalAmount: '18,200万元',
      lastCooperation: '2024-03-28'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '月结30天',
      financialHealth: 'excellent'
    },
    mainProducts: ['单片清洗设备', '槽式清洗设备', '电镀设备', '炉管设备', '先进封装设备'],
    productionCapacity: '年产能250台套',
    deliveryTime: '60-120天',
    ratings: {
      quality: 4.8,
      delivery: 4.6,
      service: 4.7,
      price: 4.0,
      overall: 4.8
    }
  },
  {
    id: 'pnc',
    name: '上海至纯洁净系统科技股份有限公司',
    matchScore: 94,
    location: '上海闵行',
    industry: '半导体设备',
    tags: ['高纯工艺系统', '上市公司', '湿法设备'],
    advantages: ['高纯工艺系统龙头', '湿法设备突破', '系统集成能力'],
    riskLevel: 'low',
    fullAddress: '上海市闵行区紫海路170号',
    contactPhone: '021-6127-9999',
    contactEmail: 'info@pnctech.com',
    website: 'www.pnctech.com',
    foundedYear: '2000',
    employeeCount: '800+人',
    annualRevenue: '30-50亿元',
    businessScope: [
      '高纯工艺系统设计安装',
      '湿法设备研发生产',
      '洁净室厂房设计',
      '电子专用材料制造',
      '特种设备销售'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      '特种设备制造许可证',
      '科创板上市公司',
      '高新技术企业认证'
    ],
    riskFactors: [
      '业务多元化风险',
      '市场竞争加剧'
    ],
    cooperationHistory: {
      totalOrders: 18,
      completedOrders: 17,
      totalAmount: '9,800万元',
      lastCooperation: '2024-02-15'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '预付40%，验收后付60%',
      financialHealth: 'excellent'
    },
    mainProducts: ['高纯工艺系统', '湿法清洗设备', '晶圆再生设备', '特种气体系统', '化学品供应系统'],
    productionCapacity: '年产能150台套',
    deliveryTime: '90-150天',
    ratings: {
      quality: 4.7,
      delivery: 4.5,
      service: 4.6,
      price: 4.2,
      overall: 4.5
    }
  },
  {
    id: 'sinyang',
    name: '上海新阳半导体材料股份有限公司',
    matchScore: 92,
    location: '上海松江',
    industry: '半导体材料',
    tags: ['光刻胶', '上市公司', '材料龙头'],
    advantages: ['半导体材料龙头', '光刻胶突破', '产品品类全'],
    riskLevel: 'medium',
    fullAddress: '上海市松江区思贤路3600号',
    contactPhone: '021-5785-0000',
    contactEmail: 'info@sinyang.com.cn',
    website: 'www.sinyang.com.cn',
    foundedYear: '2004',
    employeeCount: '500+人',
    annualRevenue: '15-25亿元',
    businessScope: [
      '电子专用材料制造',
      '半导体器件专用设备制造',
      '光刻胶研发生产',
      '电子化学品生产',
      '技术服务与进出口'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      '创业板上市公司',
      '高新技术企业认证'
    ],
    riskFactors: [
      '光刻胶验证周期长',
      '原材料价格波动'
    ],
    cooperationHistory: {
      totalOrders: 15,
      completedOrders: 14,
      totalAmount: '6,500万元',
      lastCooperation: '2024-01-20'
    },
    financialStatus: {
      creditRating: 'A+',
      paymentTerms: '月结30天',
      financialHealth: 'good'
    },
    mainProducts: ['光刻胶', '电子化学品', '封装材料', '晶圆制造材料', '配套试剂'],
    productionCapacity: '年产能500吨',
    deliveryTime: '30-60天',
    ratings: {
      quality: 4.8,
      delivery: 4.4,
      service: 4.5,
      price: 3.8,
      overall: 4.6
    }
  },
  {
    id: 'primarius',
    name: '上海概伦电子股份有限公司',
    matchScore: 90,
    location: '上海浦东',
    industry: 'EDA软件',
    tags: ['EDA工具', '上市公司', '设计软件'],
    advantages: ['EDA工具国产替代', '技术壁垒高', '客户粘性强'],
    riskLevel: 'medium',
    fullAddress: '中国（上海）自由贸易试验区临港新片区环湖西二路888号C楼',
    contactPhone: '021-6160-8888',
    contactEmail: 'info@primarius.com',
    website: 'www.primarius.com',
    foundedYear: '2010',
    employeeCount: '300+人',
    annualRevenue: '3-5亿元',
    businessScope: [
      'EDA软件开发',
      '集成电路设计',
      '电子测量仪器销售',
      '半导体器件建模',
      '技术服务与咨询'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      '科创板上市公司',
      '软件企业认证',
      '高新技术企业认证'
    ],
    riskFactors: [
      '与国际巨头竞争激烈',
      '研发投入大',
      '客户验证周期长'
    ],
    cooperationHistory: {
      totalOrders: 8,
      completedOrders: 8,
      totalAmount: '2,800万元',
      lastCooperation: '2023-12-10'
    },
    financialStatus: {
      creditRating: 'A',
      paymentTerms: '预付50%，验收后付50%',
      financialHealth: 'good'
    },
    mainProducts: ['器件建模工具', '电路仿真工具', 'PDK开发', '存储器EDA', '射频EDA'],
    productionCapacity: '软件授权不限量',
    deliveryTime: '即时交付',
    ratings: {
      quality: 4.7,
      delivery: 4.8,
      service: 4.6,
      price: 3.5,
      overall: 4.4
    }
  },
  {
    id: 'ast',
    name: '上海超硅半导体股份有限公司',
    matchScore: 88,
    location: '上海松江',
    industry: '半导体材料',
    tags: ['硅片', '大尺寸硅片', '材料制造'],
    advantages: ['大尺寸硅片生产', '技术突破', '国产替代'],
    riskLevel: 'medium',
    fullAddress: '上海市松江区鼎松路150弄1-15号',
    contactPhone: '021-3774-8888',
    contactEmail: 'info@ast-silicon.com',
    website: 'www.ast-silicon.com',
    foundedYear: '2008',
    employeeCount: '800+人',
    annualRevenue: '20-40亿元',
    businessScope: [
      '半导体材料研发制造',
      '大尺寸硅片生产',
      '晶圆制造材料',
      '硅材料切削加工',
      '进出口业务'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      '高新技术企业认证'
    ],
    riskFactors: [
      '与国际硅片巨头竞争激烈',
      '设备依赖进口',
      '技术迭代风险'
    ],
    cooperationHistory: {
      totalOrders: 12,
      completedOrders: 11,
      totalAmount: '5,200万元',
      lastCooperation: '2024-02-28'
    },
    financialStatus: {
      creditRating: 'A+',
      paymentTerms: '预付30%，月结70%',
      financialHealth: 'good'
    },
    mainProducts: ['12英寸硅片', '8英寸硅片', '抛光片', '外延片', '测试片'],
    productionCapacity: '年产能300万片',
    deliveryTime: '30-60天',
    ratings: {
      quality: 4.6,
      delivery: 4.3,
      service: 4.4,
      price: 4.0,
      overall: 4.3
    }
  },
  {
    id: 'gentech',
    name: '上海正帆科技股份有限公司',
    matchScore: 86,
    location: '上海闵行',
    industry: '半导体设备',
    tags: ['工艺介质系统', '上市公司', '气体系统'],
    advantages: ['工艺介质系统龙头', '气体系统专业', '工程经验丰富'],
    riskLevel: 'low',
    fullAddress: '上海市闵行区春永路55号2幢',
    contactPhone: '021-6127-6666',
    contactEmail: 'info@gentech.com.cn',
    website: 'www.gentech.com.cn',
    foundedYear: '2009',
    employeeCount: '800+人',
    annualRevenue: '25-40亿元',
    businessScope: [
      '工艺介质系统设计安装',
      '电子专用材料制造',
      '气体液体分离设备',
      '半导体器件专用设备',
      '特种设备销售'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      '特种设备制造许可证',
      '科创板上市公司',
      '高新技术企业认证'
    ],
    riskFactors: [
      '工程项目周期长',
      '原材料价格波动'
    ],
    cooperationHistory: {
      totalOrders: 20,
      completedOrders: 19,
      totalAmount: '8,500万元',
      lastCooperation: '2024-03-05'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '预付40%，验收后付60%',
      financialHealth: 'excellent'
    },
    mainProducts: ['高纯气体系统', '化学品供应系统', '工艺介质设备', '生物制药设备', '电子材料'],
    productionCapacity: '年产能200套系统',
    deliveryTime: '60-120天',
    ratings: {
      quality: 4.7,
      delivery: 4.4,
      service: 4.6,
      price: 4.1,
      overall: 4.5
    }
  }
]

// 获取半导体设备企业列表
export function getSemiconductorCompanies(): Company[] {
  return semiconductorCompanies
}

// 根据关键词搜索半导体设备企业
export function searchSemiconductorCompanies(keywords: string[]): Company[] {
  if (!keywords || keywords.length === 0) {
    return semiconductorCompanies.slice(0, 5)
  }

  const scoredCompanies = semiconductorCompanies.map(company => {
    let score = 0
    const searchText = `
      ${company.name} 
      ${company.industry} 
      ${company.tags.join(' ')} 
      ${company.mainProducts.join(' ')} 
      ${company.businessScope.join(' ')}
    `.toLowerCase()

    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase()
      if (searchText.includes(lowerKeyword)) {
        score += 10
      }
      // 部分匹配
      if (lowerKeyword.length > 2) {
        company.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(tag.toLowerCase())) {
            score += 5
          }
        })
        company.mainProducts.forEach(product => {
          if (product.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(product.toLowerCase())) {
            score += 8
          }
        })
      }
    })

    return { ...company, searchScore: score }
  })

  return scoredCompanies
    .filter(c => (c as any).searchScore > 0)
    .sort((a, b) => (b as any).searchScore - (a as any).searchScore)
    .slice(0, 5)
    .map(({ searchScore, ...company }) => company as Company)
}

// 根据ID获取半导体设备企业详情
export function getSemiconductorCompanyById(id: string): Company | undefined {
  return semiconductorCompanies.find(company => company.id === id)
}

// 导出统计数据
export const semiconductorStats = {
  total: semiconductorCompanies.length,
  byLocation: {
    '上海浦东': semiconductorCompanies.filter(c => c.location === '上海浦东').length,
    '上海闵行': semiconductorCompanies.filter(c => c.location === '上海闵行').length,
    '上海松江': semiconductorCompanies.filter(c => c.location === '上海松江').length
  },
  byRiskLevel: {
    low: semiconductorCompanies.filter(c => c.riskLevel === 'low').length,
    medium: semiconductorCompanies.filter(c => c.riskLevel === 'medium').length,
    high: semiconductorCompanies.filter(c => c.riskLevel === 'high').length
  },
  byIndustry: {
    '半导体设备': semiconductorCompanies.filter(c => c.industry === '半导体设备').length,
    '半导体材料': semiconductorCompanies.filter(c => c.industry === '半导体材料').length,
    'EDA软件': semiconductorCompanies.filter(c => c.industry === 'EDA软件').length
  }
}
