// 企业名单数据库 - 用于AI采购寻源模拟数据
import { constructionCompanies } from './constructionCompanies'

export interface Company {
  id: string
  name: string
  matchScore: number
  location: string
  industry: string
  tags: string[]
  advantages: string[]
  riskLevel: 'low' | 'medium' | 'high'
  // 详细信息
  fullAddress: string
  contactPhone: string
  contactEmail: string
  website: string
  foundedYear: string
  employeeCount: string
  annualRevenue: string
  businessScope: string[]
  certifications: string[]
  riskFactors: string[]
  cooperationHistory: {
    totalOrders: number
    completedOrders: number
    totalAmount: string
    lastCooperation: string
  }
  financialStatus: {
    creditRating: string
    paymentTerms: string
    financialHealth: 'excellent' | 'good' | 'fair' | 'poor'
  }
  // 产品/服务信息
  mainProducts: string[]
  productionCapacity: string
  deliveryTime: string
  // 评分信息
  ratings: {
    quality: number
    delivery: number
    service: number
    price: number
    overall: number
  }
  // 匹配分析
  matchPoints?: string[]
  mismatchPoints?: string[]
}

// 行业分类
export const industries = [
  '电子元器件',
  '精密加工',
  '电子制造',
  '机械制造',
  '塑料制品',
  '包装材料',
  '五金加工',
  '化工材料',
  '纺织服装',
  '汽车零部件',
  '工程建设',
  '工程设计',
  '矿山工程',
  '冶金建设',
  '铁路工程',
  '水利水电',
  '核工程',
  '电力工程',
  '路桥工程',
  '爆破工程',
  '地质勘察',
  '环保工程'
]

// 地区分布
export const locations = [
  '广东深圳',
  '广东东莞',
  '广东广州',
  '江苏苏州',
  '江苏无锡',
  '浙江宁波',
  '浙江杭州',
  '上海',
  '北京',
  '天津',
  '福建厦门',
  '山东青岛',
  '四川成都',
  '湖北武汉',
  '湖南长沙',
  '安徽合肥',
  '山西太原',
  '陕西西安',
  '河南郑州',
  '河北石家庄',
  '辽宁沈阳',
  '辽宁大连',
  '辽宁本溪',
  '吉林长春',
  '黑龙江哈尔滨',
  '云南昆明',
  '贵州贵阳',
  '广西南宁',
  '江西南昌',
  '甘肃兰州',
  '宁夏银川',
  '新疆乌鲁木齐',
  '内蒙古呼和浩特',
  '重庆',
  '浙江温州',
  '江苏南京',
  '江苏徐州',
  '安徽淮北',
  '四川攀枝花',
  '吉林珲春',
  '新疆哈密',
  '浙江瑞安'
]

// 认证类型
export const certificationTypes = [
  'ISO9001质量管理体系认证',
  'ISO14001环境管理体系认证',
  'ISO45001职业健康安全管理体系',
  'IATF16949汽车行业质量管理体系',
  'ISO13485医疗器械质量管理体系',
  '高新技术企业认证',
  '国家级专精特新小巨人企业',
  '省级专精特新企业',
  '绿色工厂认证',
  '智能制造示范企业'
]

// 企业名录数据库
export const companyDatabase: Company[] = [
  {
    id: '1',
    name: '深圳市华星电子科技有限公司',
    matchScore: 98,
    location: '广东深圳',
    industry: '电子元器件',
    tags: ['ISO9001', '年产能500万', '高新技术企业'],
    advantages: ['产能充足', '质量稳定', '响应快速'],
    riskLevel: 'low',
    fullAddress: '深圳市南山区科技园南区高新南一道001号',
    contactPhone: '0755-88888888',
    contactEmail: 'contact@huaxing-tech.com',
    website: 'www.huaxing-tech.com',
    foundedYear: '2010',
    employeeCount: '500-1000人',
    annualRevenue: '5-10亿元',
    businessScope: [
      '电子元器件研发与生产',
      '半导体器件制造',
      '集成电路设计',
      '电子材料销售',
      '技术咨询与服务'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      'IATF16949汽车行业质量管理体系',
      '高新技术企业认证',
      '国家级专精特新小巨人企业'
    ],
    riskFactors: [
      '近期有1起合同纠纷案件',
      '法人代表变更记录（2023年）'
    ],
    cooperationHistory: {
      totalOrders: 15,
      completedOrders: 14,
      totalAmount: '2,580万元',
      lastCooperation: '2024-03-15'
    },
    financialStatus: {
      creditRating: 'AA+',
      paymentTerms: '月结30天',
      financialHealth: 'excellent'
    },
    mainProducts: ['电阻器', '电容器', '电感器', '集成电路', '半导体器件'],
    productionCapacity: '年产能500万件',
    deliveryTime: '7-15天',
    ratings: {
      quality: 4.8,
      delivery: 4.6,
      service: 4.7,
      price: 4.2,
      overall: 4.6
    }
  },
  {
    id: '2',
    name: '东莞市精密制造有限公司',
    matchScore: 95,
    location: '广东东莞',
    industry: '精密加工',
    tags: ['ISO14001', '年产能300万', '绿色工厂'],
    advantages: ['设备先进', '工艺成熟', '价格合理'],
    riskLevel: 'low',
    fullAddress: '东莞市长安镇振安西路工业园B区',
    contactPhone: '0769-88886666',
    contactEmail: 'sales@dgjingmi.com',
    website: 'www.dgjingmi.com',
    foundedYear: '2008',
    employeeCount: '300-500人',
    annualRevenue: '3-5亿元',
    businessScope: [
      '精密机械加工',
      'CNC数控加工',
      '模具设计与制造',
      '金属表面处理',
      '自动化设备制造'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      '绿色工厂认证',
      '省级专精特新企业'
    ],
    riskFactors: [],
    cooperationHistory: {
      totalOrders: 8,
      completedOrders: 8,
      totalAmount: '1,200万元',
      lastCooperation: '2024-02-20'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '月结45天',
      financialHealth: 'excellent'
    },
    mainProducts: ['精密零部件', 'CNC加工件', '模具配件', '自动化夹具', '工装治具'],
    productionCapacity: '年产能300万件',
    deliveryTime: '10-20天',
    ratings: {
      quality: 4.6,
      delivery: 4.5,
      service: 4.4,
      price: 4.5,
      overall: 4.5
    }
  },
  {
    id: '3',
    name: '苏州工业园区电子厂',
    matchScore: 92,
    location: '江苏苏州',
    industry: '电子制造',
    tags: ['IATF16949', '年产能200万', '自动化生产'],
    advantages: ['自动化程度高', '交货准时', '服务优质'],
    riskLevel: 'medium',
    fullAddress: '苏州工业园区星龙街428号',
    contactPhone: '0512-66668888',
    contactEmail: 'business@suzhou-electric.com',
    website: 'www.suzhou-electric.com',
    foundedYear: '2015',
    employeeCount: '200-300人',
    annualRevenue: '2-3亿元',
    businessScope: [
      '电子产品组装',
      'SMT贴片加工',
      'PCBA代工',
      '电子整机制造',
      '产品测试与包装'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'IATF16949汽车行业质量管理体系',
      'ISO45001职业健康安全管理体系'
    ],
    riskFactors: [
      '成立时间较短，经营稳定性待观察',
      '近期有2起劳动争议案件'
    ],
    cooperationHistory: {
      totalOrders: 5,
      completedOrders: 4,
      totalAmount: '680万元',
      lastCooperation: '2024-01-10'
    },
    financialStatus: {
      creditRating: 'A+',
      paymentTerms: '预付30%，月结70%',
      financialHealth: 'good'
    },
    mainProducts: ['PCBA板', '电子模组', '智能控制器', '传感器模块', '电源适配器'],
    productionCapacity: '年产能200万件',
    deliveryTime: '15-25天',
    ratings: {
      quality: 4.4,
      delivery: 4.7,
      service: 4.5,
      price: 4.0,
      overall: 4.4
    }
  },
  {
    id: '4',
    name: '宁波宏达五金制品有限公司',
    matchScore: 89,
    location: '浙江宁波',
    industry: '五金加工',
    tags: ['ISO9001', '年产能800万', '出口资质'],
    advantages: ['产能大', '价格竞争力强', '出口经验丰富'],
    riskLevel: 'low',
    fullAddress: '宁波市北仑区大碶街道庐山西路',
    contactPhone: '0574-88889999',
    contactEmail: 'export@hongdahardware.com',
    website: 'www.hongdahardware.com',
    foundedYear: '2005',
    employeeCount: '800-1200人',
    annualRevenue: '8-12亿元',
    businessScope: [
      '五金冲压加工',
      '精密铸造',
      '金属表面处理',
      '五金配件制造',
      '进出口贸易'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      '高新技术企业认证'
    ],
    riskFactors: [
      '外贸依赖度高，受国际市场波动影响'
    ],
    cooperationHistory: {
      totalOrders: 0,
      completedOrders: 0,
      totalAmount: '0万元',
      lastCooperation: '无合作记录'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '预付50%，发货前付清',
      financialHealth: 'good'
    },
    mainProducts: ['五金冲压件', '精密铸件', '紧固件', '连接件', '金属配件'],
    productionCapacity: '年产能800万件',
    deliveryTime: '20-30天',
    ratings: {
      quality: 4.3,
      delivery: 4.2,
      service: 4.0,
      price: 4.6,
      overall: 4.3
    }
  },
  {
    id: '5',
    name: '上海新材料科技有限公司',
    matchScore: 87,
    location: '上海',
    industry: '化工材料',
    tags: ['ISO9001', '研发能力强', '定制化服务'],
    advantages: ['技术研发强', '定制化能力', '品质高端'],
    riskLevel: 'medium',
    fullAddress: '上海市浦东新区张江高科技园区',
    contactPhone: '021-58888888',
    contactEmail: 'tech@shnewmaterial.com',
    website: 'www.shnewmaterial.com',
    foundedYear: '2012',
    employeeCount: '150-250人',
    annualRevenue: '2-4亿元',
    businessScope: [
      '高分子材料研发',
      '特种化学品生产',
      '新材料技术服务',
      '材料性能测试',
      '技术咨询与转让'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      '高新技术企业认证'
    ],
    riskFactors: [
      '产品价格较高',
      '最小起订量要求高'
    ],
    cooperationHistory: {
      totalOrders: 3,
      completedOrders: 3,
      totalAmount: '450万元',
      lastCooperation: '2023-12-05'
    },
    financialStatus: {
      creditRating: 'A+',
      paymentTerms: '预付50%，月结50%',
      financialHealth: 'good'
    },
    mainProducts: ['工程塑料', '特种橡胶', '复合材料', '功能性涂层', '粘合剂'],
    productionCapacity: '年产能100万件',
    deliveryTime: '15-30天',
    ratings: {
      quality: 4.7,
      delivery: 4.0,
      service: 4.5,
      price: 3.5,
      overall: 4.2
    }
  },
  {
    id: '6',
    name: '青岛海洋包装制品有限公司',
    matchScore: 85,
    location: '山东青岛',
    industry: '包装材料',
    tags: ['ISO9001', '环保材料', '大批量生产'],
    advantages: ['环保材料', '价格优惠', '大批量供应'],
    riskLevel: 'low',
    fullAddress: '青岛市城阳区棘洪滩街道锦盛二路',
    contactPhone: '0532-88887777',
    contactEmail: 'sales@qdpackaging.com',
    website: 'www.qdpackaging.com',
    foundedYear: '2008',
    employeeCount: '400-600人',
    annualRevenue: '3-6亿元',
    businessScope: [
      '纸质包装材料生产',
      '塑料包装制品',
      '环保包装材料',
      '包装设计与印刷',
      '包装解决方案'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      'FSC森林认证'
    ],
    riskFactors: [],
    cooperationHistory: {
      totalOrders: 12,
      completedOrders: 12,
      totalAmount: '1,800万元',
      lastCooperation: '2024-03-01'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '月结60天',
      financialHealth: 'excellent'
    },
    mainProducts: ['纸箱', '纸盒', '塑料袋', '缓冲材料', '标签印刷'],
    productionCapacity: '年产能1000万件',
    deliveryTime: '5-10天',
    ratings: {
      quality: 4.4,
      delivery: 4.6,
      service: 4.3,
      price: 4.5,
      overall: 4.5
    }
  },
  {
    id: '7',
    name: '武汉汽车零部件有限公司',
    matchScore: 83,
    location: '湖北武汉',
    industry: '汽车零部件',
    tags: ['IATF16949', '主机厂配套', '质量稳定'],
    advantages: ['主机厂配套经验', '质量稳定', '技术成熟'],
    riskLevel: 'medium',
    fullAddress: '武汉市经济技术开发区东风大道',
    contactPhone: '027-88886666',
    contactEmail: 'auto@wuhanparts.com',
    website: 'www.wuhanparts.com',
    foundedYear: '2006',
    employeeCount: '600-900人',
    annualRevenue: '5-8亿元',
    businessScope: [
      '汽车零部件制造',
      '汽车电子生产',
      '精密机械加工',
      '汽车配件销售',
      '售后服务支持'
    ],
    certifications: [
      'IATF16949汽车行业质量管理体系',
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证'
    ],
    riskFactors: [
      '受汽车行业周期性影响',
      '客户集中度较高'
    ],
    cooperationHistory: {
      totalOrders: 6,
      completedOrders: 6,
      totalAmount: '960万元',
      lastCooperation: '2024-02-28'
    },
    financialStatus: {
      creditRating: 'A+',
      paymentTerms: '月结90天',
      financialHealth: 'good'
    },
    mainProducts: ['汽车传感器', '发动机配件', '底盘零件', '电子控制单元', '线束组件'],
    productionCapacity: '年产能400万件',
    deliveryTime: '15-30天',
    ratings: {
      quality: 4.5,
      delivery: 4.3,
      service: 4.2,
      price: 3.8,
      overall: 4.2
    }
  },
  {
    id: '8',
    name: '厦门纺织服装有限公司',
    matchScore: 80,
    location: '福建厦门',
    industry: '纺织服装',
    tags: ['ISO9001', '出口欧美', '快反能力'],
    advantages: ['快反能力强', '设计能力强', '出口经验丰富'],
    riskLevel: 'low',
    fullAddress: '厦门市集美区杏林湾路',
    contactPhone: '0592-88885555',
    contactEmail: 'fashion@xiamen-textile.com',
    website: 'www.xiamen-textile.com',
    foundedYear: '2010',
    employeeCount: '500-800人',
    annualRevenue: '4-7亿元',
    businessScope: [
      '服装设计与生产',
      '纺织品加工',
      '面料研发',
      '服装贸易',
      '品牌代工'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      'OEKO-TEX环保认证'
    ],
    riskFactors: [
      '劳动力成本上升压力',
      '汇率波动风险'
    ],
    cooperationHistory: {
      totalOrders: 0,
      completedOrders: 0,
      totalAmount: '0万元',
      lastCooperation: '无合作记录'
    },
    financialStatus: {
      creditRating: 'A',
      paymentTerms: '预付30%，发货前付清',
      financialHealth: 'good'
    },
    mainProducts: ['针织服装', '梭织服装', '功能性面料', '家用纺织品', '服装辅料'],
    productionCapacity: '年产能600万件',
    deliveryTime: '20-45天',
    ratings: {
      quality: 4.3,
      delivery: 4.4,
      service: 4.3,
      price: 4.0,
      overall: 4.3
    }
  },
  {
    id: '9',
    name: '成都智能制造装备有限公司',
    matchScore: 78,
    location: '四川成都',
    industry: '机械制造',
    tags: ['智能制造', '非标定制', '技术先进'],
    advantages: ['技术先进', '非标定制能力强', '自动化程度高'],
    riskLevel: 'medium',
    fullAddress: '成都市高新区西芯大道',
    contactPhone: '028-88884444',
    contactEmail: 'sales@cdsmartmanu.com',
    website: 'www.cdsmartmanu.com',
    foundedYear: '2014',
    employeeCount: '200-350人',
    annualRevenue: '2-4亿元',
    businessScope: [
      '智能装备制造',
      '自动化生产线',
      '工业机器人集成',
      '非标设备定制',
      '智能制造解决方案'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      '高新技术企业认证',
      '智能制造示范企业'
    ],
    riskFactors: [
      '成立时间较短',
      '项目交付周期较长'
    ],
    cooperationHistory: {
      totalOrders: 2,
      completedOrders: 2,
      totalAmount: '380万元',
      lastCooperation: '2023-11-15'
    },
    financialStatus: {
      creditRating: 'A',
      paymentTerms: '预付40%，验收后付60%',
      financialHealth: 'fair'
    },
    mainProducts: ['自动化设备', '智能生产线', '机器人工作站', '检测设备', '工装夹具'],
    productionCapacity: '年产能50套设备',
    deliveryTime: '60-120天',
    ratings: {
      quality: 4.4,
      delivery: 3.8,
      service: 4.5,
      price: 3.5,
      overall: 4.1
    }
  },
  {
    id: '10',
    name: '天津塑料制品有限公司',
    matchScore: 76,
    location: '天津',
    industry: '塑料制品',
    tags: ['ISO9001', '注塑成型', '大批量生产'],
    advantages: ['产能大', '成本低', '交货快'],
    riskLevel: 'low',
    fullAddress: '天津市滨海新区经济技术开发区',
    contactPhone: '022-88883333',
    contactEmail: 'sales@tjplastic.com',
    website: 'www.tjplastic.com',
    foundedYear: '2003',
    employeeCount: '300-500人',
    annualRevenue: '3-5亿元',
    businessScope: [
      '注塑成型加工',
      '塑料制品生产',
      '模具设计与制造',
      '塑料原料贸易',
      '产品组装服务'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证'
    ],
    riskFactors: [
      '环保政策趋严影响',
      '原材料价格波动'
    ],
    cooperationHistory: {
      totalOrders: 9,
      completedOrders: 9,
      totalAmount: '1,350万元',
      lastCooperation: '2024-01-20'
    },
    financialStatus: {
      creditRating: 'A',
      paymentTerms: '月结30天',
      financialHealth: 'good'
    },
    mainProducts: ['注塑件', '塑料外壳', '塑料配件', '包装材料', '日用品'],
    productionCapacity: '年产能1200万件',
    deliveryTime: '7-15天',
    ratings: {
      quality: 4.0,
      delivery: 4.5,
      service: 4.0,
      price: 4.4,
      overall: 4.2
    }
  },
  {
    id: '11',
    name: '杭州电子连接器有限公司',
    matchScore: 94,
    location: '浙江杭州',
    industry: '电子元器件',
    tags: ['ISO9001', '连接器专家', '军工品质'],
    advantages: ['专业性强', '品质高端', '技术领先'],
    riskLevel: 'low',
    fullAddress: '杭州市余杭区仓前街道',
    contactPhone: '0571-88882222',
    contactEmail: 'sales@hzconnector.com',
    website: 'www.hzconnector.com',
    foundedYear: '2007',
    employeeCount: '250-400人',
    annualRevenue: '4-6亿元',
    businessScope: [
      '电子连接器研发',
      '精密连接器制造',
      '线束组件生产',
      '连接器测试服务',
      '定制化解决方案'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'IATF16949汽车行业质量管理体系',
      '军工产品质量体系认证',
      '高新技术企业认证'
    ],
    riskFactors: [],
    cooperationHistory: {
      totalOrders: 7,
      completedOrders: 7,
      totalAmount: '1,050万元',
      lastCooperation: '2024-03-10'
    },
    financialStatus: {
      creditRating: 'AA',
      paymentTerms: '月结30天',
      financialHealth: 'excellent'
    },
    mainProducts: ['板对板连接器', '线对板连接器', '圆形连接器', '射频连接器', '光纤连接器'],
    productionCapacity: '年产能350万件',
    deliveryTime: '10-20天',
    ratings: {
      quality: 4.8,
      delivery: 4.5,
      service: 4.6,
      price: 3.8,
      overall: 4.4
    }
  },
  {
    id: '12',
    name: '无锡半导体材料有限公司',
    matchScore: 91,
    location: '江苏无锡',
    industry: '电子制造',
    tags: ['高新技术企业', '进口替代', '研发实力强'],
    advantages: ['技术壁垒高', '进口替代', '品质稳定'],
    riskLevel: 'medium',
    fullAddress: '无锡市新吴区太湖国际科技园',
    contactPhone: '0510-88881111',
    contactEmail: 'tech@wxsemiconductor.com',
    website: 'www.wxsemiconductor.com',
    foundedYear: '2016',
    employeeCount: '150-250人',
    annualRevenue: '2-4亿元',
    businessScope: [
      '半导体材料研发',
      '晶圆制造材料',
      '封装测试材料',
      '电子化学品',
      '材料技术咨询'
    ],
    certifications: [
      'ISO9001质量管理体系认证',
      'ISO14001环境管理体系认证',
      '高新技术企业认证',
      '省级专精特新企业'
    ],
    riskFactors: [
      '成立时间较短',
      '技术迭代风险',
      '客户验证周期长'
    ],
    cooperationHistory: {
      totalOrders: 4,
      completedOrders: 4,
      totalAmount: '520万元',
      lastCooperation: '2024-02-05'
    },
    financialStatus: {
      creditRating: 'A',
      paymentTerms: '预付50%，月结50%',
      financialHealth: 'good'
    },
    mainProducts: ['硅片', '光刻胶', '电子特气', 'CMP材料', '封装基板'],
    productionCapacity: '年产能80万件',
    deliveryTime: '15-30天',
    ratings: {
      quality: 4.6,
      delivery: 4.2,
      service: 4.4,
      price: 3.6,
      overall: 4.2
    }
  }
]

// 根据关键词搜索企业（搜索所有企业数据）
export function searchCompanies(keywords: string[]): Company[] {
  if (!keywords || keywords.length === 0) {
    return allCompanies.slice(0, 5)
  }

  const scoredCompanies = allCompanies.map(company => {
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

// 根据行业筛选企业
export function filterByIndustry(industry: string): Company[] {
  return allCompanies.filter(company => 
    company.industry === industry || company.industry.includes(industry)
  )
}

// 根据地区筛选企业
export function filterByLocation(location: string): Company[] {
  return allCompanies.filter(company => 
    company.location === location || company.location.includes(location)
  )
}

// 根据风险等级筛选企业
export function filterByRiskLevel(riskLevel: 'low' | 'medium' | 'high'): Company[] {
  return allCompanies.filter(company => company.riskLevel === riskLevel)
}

// 获取推荐企业（匹配度最高的）
export function getRecommendedCompanies(count: number = 5): Company[] {
  return allCompanies
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, count)
}

// 获取随机企业（用于模拟AI推荐）
export function getRandomCompanies(count: number = 3): Company[] {
  const shuffled = [...allCompanies].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// 根据ID获取企业详情
export function getCompanyById(id: string): Company | undefined {
  return allCompanies.find(company => company.id === id)
}

// 合并所有企业数据（原有企业 + 工程建设类企业）
export const allCompanies: Company[] = [...companyDatabase, ...constructionCompanies]

// 导出统计数据
export const companyStats = {
  total: allCompanies.length,
  byIndustry: industries.map(industry => ({
    name: industry,
    count: allCompanies.filter(c => c.industry === industry).length
  })).filter(i => i.count > 0),
  byLocation: locations.map(location => ({
    name: location,
    count: allCompanies.filter(c => c.location === location).length
  })).filter(l => l.count > 0),
  byRiskLevel: {
    low: allCompanies.filter(c => c.riskLevel === 'low').length,
    medium: allCompanies.filter(c => c.riskLevel === 'medium').length,
    high: allCompanies.filter(c => c.riskLevel === 'high').length
  }
}
