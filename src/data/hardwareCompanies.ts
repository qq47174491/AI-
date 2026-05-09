// 五金制品企业数据库 - 用于AI采购寻源模拟数据
import { Company } from './companyDatabase'

export interface HardwareCompany extends Company {
  monthlyCapacity: string
  coreAdvantage: string
  customers: string
  experience: string
}

export const hardwareCompanies: HardwareCompany[] = [
  {
    id: 'hw001',
    name: '东莞市鸿远五金制品有限公司',
    matchScore: 98,
    location: '东莞',
    industry: '五金制品',
    tags: ['ISO9001', 'ISO14001'],
    advantages: ['清洗设备领先', '技术创新强', '客户资源好'],
    riskLevel: 'low',
    fullAddress: '东莞市长安镇振安西路工业园',
    contactPhone: '0769-88886666',
    contactEmail: 'sales@hongyuan.com',
    website: 'www.hongyuan.com',
    foundedYear: '2008',
    employeeCount: '300+人',
    annualRevenue: '3-5亿元',
    businessScope: [
      '五金冲压加工',
      '精密零件制造',
      '表面处理加工',
      '模具设计与制造'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证'
    ],
    riskFactors: [],
    cooperationHistory: {
      totalOrders: 28,
      completedOrders: 28,
      totalAmount: '3,200万元',
      lastCooperation: '2024-04-15'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '月结30天',
      financialHealth: 'excellent'
    },
    mainProducts: ['五金冲压件', '精密零件', '钣金件', '紧固件'],
    productionCapacity: '年产能500万件',
    deliveryTime: '7-15天',
    ratings: {
      quality: 4.8,
      delivery: 4.6,
      service: 4.7,
      price: 4.2,
      overall: 4.6
    },
    monthlyCapacity: '800万件/月，可满足大规模订单需求',
    coreAdvantage: '自主开模、精密冲压、表面处理一体化，50人研发团队',
    customers: '华为、美的、小米等知名企业，行业口碑良好',
    experience: '15年五金制品生产经验'
  },
  {
    id: 'hw002',
    name: '深圳市盛达五金科技有限公司',
    matchScore: 95,
    location: '深圳',
    industry: '五金制品',
    tags: ['ISO9001', 'ISO14001'],
    advantages: ['技术先进', '质量稳定', '响应快速'],
    riskLevel: 'low',
    fullAddress: '深圳市宝安区松岗街道',
    contactPhone: '0755-88885555',
    contactEmail: 'sales@shengda.com',
    website: 'www.shengda.com',
    foundedYear: '2010',
    employeeCount: '200+人',
    annualRevenue: '2-4亿元',
    businessScope: [
      '精密五金加工',
      'CNC加工',
      '表面处理',
      '五金配件制造'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证'
    ],
    riskFactors: [],
    cooperationHistory: {
      totalOrders: 22,
      completedOrders: 22,
      totalAmount: '2,800万元',
      lastCooperation: '2024-03-20'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '月结45天',
      financialHealth: 'excellent'
    },
    mainProducts: ['精密五金件', 'CNC加工件', '冲压件', '紧固件'],
    productionCapacity: '年产能400万件',
    deliveryTime: '10-20天',
    ratings: {
      quality: 4.7,
      delivery: 4.5,
      service: 4.6,
      price: 4.3,
      overall: 4.5
    },
    monthlyCapacity: '600万件/月，支持小批量多品种生产',
    coreAdvantage: '专注于精密五金零件加工，支持复杂结构定制，快速打样',
    customers: '大疆、TCL、创维等科技企业，交期准确率98%以上',
    experience: '14年行业经验'
  },
  {
    id: 'hw003',
    name: '佛山市鑫源五金制品有限公司',
    matchScore: 92,
    location: '佛山',
    industry: '五金制品',
    tags: ['ISO9001', 'ISO14001'],
    advantages: ['产能充足', '价格竞争力强', '出口经验丰富'],
    riskLevel: 'low',
    fullAddress: '佛山市南海区里水镇',
    contactPhone: '0757-88884444',
    contactEmail: 'sales@xinyuan.com',
    website: 'www.xinyuan.com',
    foundedYear: '2005',
    employeeCount: '400+人',
    annualRevenue: '4-6亿元',
    businessScope: [
      '大型五金冲压',
      '钣金加工',
      'CNC加工',
      '表面处理'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证'
    ],
    riskFactors: [],
    cooperationHistory: {
      totalOrders: 35,
      completedOrders: 35,
      totalAmount: '4,500万元',
      lastCooperation: '2024-04-01'
    },
    financialStatus: {
      creditRating: 'AA+',
      paymentTerms: '月结30天',
      financialHealth: 'excellent'
    },
    mainProducts: ['大型冲压件', '钣金件', 'CNC零件', '五金配件'],
    productionCapacity: '年产能800万件',
    deliveryTime: '15-25天',
    ratings: {
      quality: 4.6,
      delivery: 4.4,
      service: 4.5,
      price: 4.5,
      overall: 4.5
    },
    monthlyCapacity: '1200万件/月，可承接超大批量订单',
    coreAdvantage: '大型五金冲压、钣金加工，拥有30台进口CNC加工中心',
    customers: '格力、美的、海尔等家电企业，具备较强的成本优势',
    experience: '19年行业经验'
  }
]

// 获取五金制品企业
export function getHardwareCompanies(): HardwareCompany[] {
  return hardwareCompanies
}

// 搜索五金制品企业
export function searchHardwareCompanies(keywords: string[]): HardwareCompany[] {
  if (!keywords || keywords.length === 0) {
    return hardwareCompanies
  }

  return hardwareCompanies.filter(company => {
    const searchText = `${company.name} ${company.location} ${company.industry} ${company.tags.join(' ')}`.toLowerCase()
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  })
}
