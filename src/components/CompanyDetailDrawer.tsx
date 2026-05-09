import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  FileText,
  Award,
  CheckCircle2,
  Clock,
  Star,
  BarChart3,
  Briefcase,
  Package,
  Factory,
  Trophy,
  ExternalLink
} from 'lucide-react'

interface BidInfo {
  id: string
  projectName: string
  bidAmount: string
  bidDate: string
  purchaser: string
  bidType: '中标' | '成交' | '入围'
  region: string
}

interface CompanyDetail {
  name: string
  industry?: string
  mainProducts?: string[]
  address?: string
  fullAddress?: string
  location?: string
  matchScore?: number
  contact?: {
    name?: string
    phone?: string
    email?: string
  }
  contactPhone?: string
  contactEmail?: string
  website?: string
  foundedYear?: string
  employeeCount?: string
  annualRevenue?: string
  financial?: {
    revenue?: string
    profit?: string
    employees?: string
    foundedYear?: string
  }
  business?: {
    customers?: string[]
    partners?: string[]
    certifications?: string[]
  }
  certifications?: string[]
  riskLevel?: 'low' | 'medium' | 'high'
  riskFactors?: string[]
  cooperationHistory?: {
    totalOrders?: number
    completedOrders?: number
    totalAmount?: string
    lastCooperation?: string
  }
  financialStatus?: {
    creditRating?: string
    paymentTerms?: string
    financialHealth?: 'excellent' | 'good' | 'fair' | 'poor' | string
  }
  ratings?: {
    quality?: number
    delivery?: number
    service?: number
    price?: number
    overall?: number
  }
  businessScope?: string[]
  productionCapacity?: string
  deliveryTime?: string
  bidInfos?: BidInfo[]
}

interface CompanyDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  company: CompanyDetail | null
}

export default function CompanyDetailDrawer({ isOpen, onClose, company }: CompanyDetailDrawerProps) {
  if (!isOpen || !company) return null

  const detail = company

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return '低风险'
      case 'medium': return '中风险'
      case 'high': return '高风险'
      default: return '未知'
    }
  }

  const getFinancialHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  const getFinancialHealthText = (health: string) => {
    switch (health) {
      case 'excellent': return '优秀'
      case 'good': return '良好'
      case 'fair': return '一般'
      case 'poor': return '较差'
      default: return '未知'
  }
  }

  // 生成模拟标讯数据
  const generateMockBidInfos = (companyName: string): BidInfo[] => {
    const currentYear = new Date().getFullYear()
    const bidTypes: ('中标' | '成交' | '入围')[] = ['中标', '成交', '入围']
    const regions = ['北京市', '上海市', '广东省', '江苏省', '浙江省', '四川省', '湖北省']
    const purchasers = [
      '中国电子科技集团有限公司',
      '华为技术有限公司',
      '中兴通讯股份有限公司',
      '中国移动通信集团有限公司',
      '中国联合网络通信集团有限公司',
      '中国电信集团有限公司',
      '国家电网有限公司',
      '中国南方电网有限责任公司',
      '中国石油天然气集团有限公司',
      '中国中车集团有限公司'
    ]

    const projectPrefixes = [
      '2024年度设备采购项目',
      '智能制造产线建设项目',
      '信息化系统升级项目',
      '研发中心设备采购',
      '生产基地扩建项目',
      '供应链管理系统建设',
      '质量检测设备采购',
      '环保设备升级改造',
      '物流仓储系统建设',
      '安全防护设备采购'
    ]

    // 根据公司名称生成固定的随机种子
    const seed = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const random = (min: number, max: number) => {
      const x = Math.sin(seed + max) * 10000
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min
    }

    const bidCount = random(5, 12)
    const bids: BidInfo[] = []

    for (let i = 0; i < bidCount; i++) {
      const year = currentYear - random(0, 2)
      const month = random(1, 12).toString().padStart(2, '0')
      const day = random(1, 28).toString().padStart(2, '0')
      const amount = (random(50, 5000) / 10).toFixed(1)

      bids.push({
        id: `bid_${i}_${seed}`,
        projectName: `${projectPrefixes[random(0, projectPrefixes.length - 1)]}（${String.fromCharCode(65 + i)}包）`,
        bidAmount: `${amount}万元`,
        bidDate: `${year}-${month}-${day}`,
        purchaser: purchasers[random(0, purchasers.length - 1)],
        bidType: bidTypes[random(0, bidTypes.length - 1)],
        region: regions[random(0, regions.length - 1)]
      })
    }

    return bids.sort((a, b) => new Date(b.bidDate).getTime() - new Date(a.bidDate).getTime())
  }

  // 获取标讯数据
  const bidInfos = detail.bidInfos || generateMockBidInfos(detail.name)

  // 统计标讯数据
  const bidStats = {
    total: bidInfos.length,
    totalAmount: bidInfos.reduce((sum, bid) => sum + parseFloat(bid.bidAmount.replace('万元', '')), 0),
    thisYear: bidInfos.filter(bid => bid.bidDate.startsWith(new Date().getFullYear().toString())).length
  }

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* 抽屉 */}
      <div 
        className={`fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">企业详情</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {/* 企业基本信息 */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-slate-800">{detail.name}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(detail.riskLevel || 'low')}`}>
                    {getRiskLevelText(detail.riskLevel || 'low')}
                  </span>
                  <span className="text-sm text-slate-500">{detail.industry || '-'}</span>
                </div>
              </div>
              {detail.matchScore !== undefined && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{detail.matchScore}%</div>
                  <div className="text-xs text-slate-400">匹配度</div>
                </div>
              )}
            </div>

            {/* 联系信息 */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                {detail.location || detail.address || '-'}
              </div>
              {detail.contactPhone && (
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" />
                  {detail.contactPhone}
                </div>
              )}
              {detail.contactEmail && (
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  {detail.contactEmail}
                </div>
              )}
              {detail.website && (
                <div className="flex items-center text-sm text-slate-600">
                  <Globe className="w-4 h-4 mr-2 text-slate-400" />
                  {detail.website}
                </div>
              )}
            </div>

            {/* 企业规模 */}
            <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-slate-100">
              {detail.foundedYear && (
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  成立时间：{detail.foundedYear}
                </div>
              )}
              {detail.employeeCount && (
                <div className="flex items-center text-sm text-slate-600">
                  <Users className="w-4 h-4 mr-2 text-slate-400" />
                  员工规模：{detail.employeeCount}
                </div>
              )}
              {detail.annualRevenue && (
                <div className="flex items-center text-sm text-slate-600">
                  <TrendingUp className="w-4 h-4 mr-2 text-slate-400" />
                  年营收：{detail.annualRevenue}
                </div>
              )}
            </div>
          </div>

          {/* 合作历史 */}
          {detail.cooperationHistory && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                合作历史
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-slate-800">{detail.cooperationHistory.totalOrders}</div>
                  <div className="text-xs text-slate-500">总订单数</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{detail.cooperationHistory.completedOrders}</div>
                  <div className="text-xs text-slate-500">已完成</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">{detail.cooperationHistory.totalAmount}</div>
                  <div className="text-xs text-slate-500">交易总额</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-sm font-bold text-slate-800">{detail.cooperationHistory.lastCooperation}</div>
                  <div className="text-xs text-slate-500">最近合作</div>
                </div>
              </div>
            </div>
          )}

          {/* 财务状况 */}
          {detail.financialStatus && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                财务状况
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">信用评级</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium">
                    {detail.financialStatus.creditRating || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">账期条件</span>
                  <span className="text-sm text-slate-800">{detail.financialStatus.paymentTerms || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">财务健康度</span>
                  <span className={`text-sm font-medium ${getFinancialHealthColor(detail.financialStatus.financialHealth || 'good')}`}>
                    {getFinancialHealthText(detail.financialStatus.financialHealth || 'good')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 经营范围 */}
          {detail.businessScope && detail.businessScope.length > 0 && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                经营范围
              </h3>
              <div className="flex flex-wrap gap-2">
                {detail.businessScope.map((scope, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 资质认证 */}
          {detail.certifications && detail.certifications.length > 0 && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                资质认证
              </h3>
              <div className="space-y-2">
                {detail.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 风险因素 */}
          {detail.riskFactors && detail.riskFactors.length > 0 && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                风险提示
              </h3>
              <div className="space-y-2">
                {detail.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start text-sm text-slate-600">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 近3年标讯信息 */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-amber-500" />
                近3年标讯信息
              </h3>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>累计中标 <span className="font-medium text-slate-700">{bidStats.total}</span> 次</span>
                <span>今年 <span className="font-medium text-slate-700">{bidStats.thisYear}</span> 次</span>
                <span>总金额 <span className="font-medium text-slate-700">{bidStats.totalAmount.toFixed(1)}万元</span></span>
              </div>
            </div>

            {/* 标讯列表 */}
            <div className="space-y-3">
              {bidInfos.slice(0, 5).map((bid) => (
                <div
                  key={bid.id}
                  className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-slate-800 truncate">
                          {bid.projectName}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          bid.bidType === '中标'
                            ? 'bg-green-100 text-green-700'
                            : bid.bidType === '成交'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {bid.bidType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">
                        采购方：{bid.purchaser}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {bid.bidDate}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {bid.region}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-base font-bold text-amber-600">
                        {bid.bidAmount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {bidInfos.length > 5 && (
              <button className="w-full mt-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-dashed border-slate-200 rounded-lg hover:border-slate-300 transition-colors flex items-center justify-center">
                <ExternalLink className="w-4 h-4 mr-1" />
                查看更多标讯（共 {bidInfos.length} 条）
              </button>
            )}

            {/* 经营能力评估 */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">经营能力评估</span>
              </div>
              <p className="text-xs text-blue-600 leading-relaxed">
                该企业近3年累计中标 <span className="font-medium">{bidStats.total}</span> 次，
                中标总金额 <span className="font-medium">{bidStats.totalAmount.toFixed(1)}万元</span>，
                平均单次中标金额 <span className="font-medium">{(bidStats.totalAmount / bidStats.total).toFixed(1)}万元</span>。
                从标讯分布来看，企业业务覆盖多个行业和地区，
                {bidStats.thisYear > 0 ? `今年已有 ${bidStats.thisYear} 次中标记录，业务活跃度良好。` : '今年暂无中标记录，建议关注其最新业务动态。'}
              </p>
            </div>
          </div>

          {/* 主营产品 */}
          {detail.mainProducts && detail.mainProducts.length > 0 && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                主营产品
              </h3>
              <div className="flex flex-wrap gap-2">
                {detail.mainProducts.map((product, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                  >
                    {product}
                  </span>
                ))}
              </div>
              {(detail.productionCapacity || detail.deliveryTime) && (
                <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-slate-100">
                  {detail.productionCapacity && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Factory className="w-4 h-4 mr-2 text-slate-400" />
                      产能：{detail.productionCapacity}
                    </div>
                  )}
                  {detail.deliveryTime && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      交货周期：{detail.deliveryTime}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 企业评分 */}
          {detail.ratings && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                企业评分
              </h3>
              <div className="grid grid-cols-5 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-800">{detail.ratings.quality || 0}</div>
                  <div className="text-xs text-slate-500">产品质量</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(detail.ratings?.quality || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-800">{detail.ratings.delivery || 0}</div>
                  <div className="text-xs text-slate-500">交货能力</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(detail.ratings?.delivery || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-800">{detail.ratings.service || 0}</div>
                  <div className="text-xs text-slate-500">服务响应</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(detail.ratings?.service || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-800">{detail.ratings.price || 0}</div>
                  <div className="text-xs text-slate-500">价格竞争力</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(detail.ratings?.price || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-2">
                  <div className="text-xl font-bold text-blue-600">{detail.ratings.overall || 0}</div>
                  <div className="text-xs text-blue-500">综合评分</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(detail.ratings?.overall || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="p-6 space-y-3">
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" />
              发起合作申请
            </button>
            <div className="flex space-x-3">
              <button className="flex-1 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-colors">
                加入备选池
              </button>
              <button className="flex-1 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-colors">
                下载报告
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
