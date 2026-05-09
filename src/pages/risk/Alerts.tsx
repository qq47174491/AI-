import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, AlertTriangle, Shield, TrendingUp, TrendingDown, Bell, Building2, AlertCircle, Calendar, Sparkles, X, Loader2 } from 'lucide-react'
// @ts-ignore - CompanyDetailDrawer保留以备后用
import CompanyDetailDrawer from '../../components/CompanyDetailDrawer'

interface RiskAlert {
  id: string
  companyName: string
  riskType: 'financial' | 'legal' | 'operation' | 'credit'
  riskLevel: 'high' | 'medium' | 'low'
  alertTitle: string
  alertDescription: string
  alertTime: string
  status: 'unread' | 'read' | 'handled'
  source: string
  riskIndicator?: string
  updateTime?: string
  // 风险详情字段
  caseNumber?: string
  court?: string
  caseDate?: string
  caseType?: string
  plaintiff?: string
  defendant?: string
  caseReason?: string
  relatedCases?: {
    id: string
    caseName: string
    caseType: string
    caseReason: string
    caseNumber: string
    court: string
    status: string
  }[]
}

const mockAlerts: RiskAlert[] = [
  {
    id: '1',
    companyName: '北方华创科技集团股份有限公司',
    riskType: 'financial',
    riskLevel: 'high',
    alertTitle: '股权质押风险',
    alertDescription: '公司股东近期质押股份比例上升至35%，存在控制权变更风险',
    alertTime: '2024-01-15 09:30',
    status: 'unread',
    source: '工商信息监控',
    riskIndicator: '股权质押率',
    updateTime: '2024-01-15 09:30',
    caseNumber: '（2024）京01民初123号',
    court: '北京市第一中级人民法院',
    caseDate: '2024-01-15',
    caseType: '民事案件',
    plaintiff: '北京华创投资有限公司',
    defendant: '北方华创科技集团股份有限公司',
    caseReason: '股权质押纠纷',
    relatedCases: [
      {
        id: 'rc1',
        caseName: '北方华创科技集团股份有限公司股权质押纠纷案',
        caseType: '民事案件',
        caseReason: '股权质押纠纷',
        caseNumber: '（2024）京01民初123号',
        court: '北京市第一中级人民法院',
        status: '审理中'
      }
    ]
  },
  {
    id: '2',
    companyName: '中微半导体设备（上海）股份有限公司',
    riskType: 'legal',
    riskLevel: 'medium',
    alertTitle: '诉讼案件提醒',
    alertDescription: '公司涉及一起知识产权纠纷案件，涉案金额约500万元',
    alertTime: '2024-01-14 16:45',
    status: 'unread',
    source: '司法信息监控',
    riskIndicator: '涉诉案件数',
    updateTime: '2024-01-14 16:45',
    caseNumber: '（2024）沪01知民初45号',
    court: '上海市第一中级人民法院',
    caseDate: '2024-01-14',
    caseType: '知识产权案件',
    plaintiff: '应用材料公司',
    defendant: '中微半导体设备（上海）股份有限公司',
    caseReason: '侵害发明专利权纠纷',
    relatedCases: [
      {
        id: 'rc2',
        caseName: '应用材料公司诉中微半导体专利侵权案',
        caseType: '知识产权案件',
        caseReason: '侵害发明专利权纠纷',
        caseNumber: '（2024）沪01知民初45号',
        court: '上海市第一中级人民法院',
        status: '一审'
      }
    ]
  },
  {
    id: '3',
    companyName: '盛美半导体设备（上海）股份有限公司',
    riskType: 'operation',
    riskLevel: 'low',
    alertTitle: '经营异常提示',
    alertDescription: '公司近期工商信息发生变更，经营范围有所调整',
    alertTime: '2024-01-13 11:20',
    status: 'read',
    source: '工商信息监控',
    riskIndicator: '工商变更次数',
    updateTime: '2024-01-13 11:20'
  },
  {
    id: '4',
    companyName: '拓荆科技股份有限公司',
    riskType: 'credit',
    riskLevel: 'high',
    alertTitle: '被执行人信息',
    alertDescription: '公司被列入失信被执行人名单，执行标的金额约200万元',
    alertTime: '2024-01-12 14:30',
    status: 'unread',
    source: '信用信息监控',
    riskIndicator: '失信记录',
    updateTime: '2024-01-12 14:30',
    caseNumber: '（2024）辽01执89号',
    court: '辽宁省沈阳市中级人民法院',
    caseDate: '2024-01-12',
    caseType: '执行案件',
    plaintiff: '沈阳银行股份有限公司',
    defendant: '拓荆科技股份有限公司',
    caseReason: '借款合同纠纷',
    relatedCases: [
      {
        id: 'rc3',
        caseName: '沈阳银行诉拓荆科技借款合同纠纷执行案',
        caseType: '执行案件',
        caseReason: '借款合同纠纷',
        caseNumber: '（2024）辽01执89号',
        court: '辽宁省沈阳市中级人民法院',
        status: '执行中'
      }
    ]
  },
  {
    id: '5',
    companyName: '华海清科股份有限公司',
    riskType: 'financial',
    riskLevel: 'medium',
    alertTitle: '财务指标异常',
    alertDescription: '公司最新季度财报显示应收账款周转天数增加至85天',
    alertTime: '2024-01-11 10:15',
    status: 'handled',
    source: '财务数据监控',
    riskIndicator: '应收账款周转天数',
    updateTime: '2024-01-11 10:15'
  },
  {
    id: '6',
    companyName: '芯源微电子设备（上海）股份有限公司',
    riskType: 'legal',
    riskLevel: 'low',
    alertTitle: '行政处罚记录',
    alertDescription: '公司因环保问题被处以5万元罚款',
    alertTime: '2024-01-10 09:00',
    status: 'read',
    source: '行政处罚监控',
    riskIndicator: '行政处罚金额',
    updateTime: '2024-01-10 09:00',
    caseNumber: '沪环罚〔2024〕12号',
    court: '上海市生态环境局',
    caseDate: '2024-01-10',
    caseType: '行政处罚',
    plaintiff: '上海市生态环境局',
    defendant: '芯源微电子设备（上海）股份有限公司',
    caseReason: '违反环境保护法'
  },
]

// @ts-ignore - riskFilters保留以备后用
const riskFilters = [
  { key: 'all', label: '全部' },
  { key: 'high', label: '高风险' },
  { key: 'medium', label: '中风险' },
  { key: 'low', label: '低风险' },
]

const riskLevelMap: Record<string, { label: string; color: string; bgColor: string; icon: typeof AlertTriangle }> = {
  high: { label: '高风险', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertTriangle },
  medium: { label: '中风险', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: AlertCircle },
  low: { label: '低风险', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Bell },
}

const riskTypeMap: Record<string, { label: string; color: string }> = {
  financial: { label: '财务风险', color: 'text-purple-600' },
  legal: { label: '法律风险', color: 'text-red-600' },
  operation: { label: '经营风险', color: 'text-blue-600' },
  credit: { label: '信用风险', color: 'text-orange-600' },
}

const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  unread: { label: '未读', color: 'text-red-600', bgColor: 'bg-red-50' },
  read: { label: '已读', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  handled: { label: '已处理', color: 'text-green-600', bgColor: 'bg-green-50' },
}

export default function RiskAlerts() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  // @ts-ignore - 保留以备后用
  const [activeFilter, setActiveFilter] = useState('all')
  // @ts-ignore - 保留以备后用
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null)
  // @ts-ignore - 保留以备后用
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [alerts, setAlerts] = useState<RiskAlert[]>(mockAlerts)
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false)
  const [aiAnalysisContent, setAiAnalysisContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedRiskAlert, setSelectedRiskAlert] = useState<RiskAlert | null>(null)
  // 新增筛选条件
  const [selectedRiskType, setSelectedRiskType] = useState<'all' | 'financial' | 'legal' | 'operation' | 'credit'>('all')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all')
  // 风险动态详情弹窗
  const [isRiskDetailOpen, setIsRiskDetailOpen] = useState(false)
  const [viewingRiskAlert, setViewingRiskAlert] = useState<RiskAlert | null>(null)

  // 跳转到正式供应商管理页面
  const handleAddMonitorCompany = () => {
    navigate('/suppliers/official')
  }

  const stats = useMemo(() => {
    const total = alerts.length
    const high = alerts.filter(a => a.riskLevel === 'high').length
    const medium = alerts.filter(a => a.riskLevel === 'medium').length
    const low = alerts.filter(a => a.riskLevel === 'low').length
    const unread = alerts.filter(a => a.status === 'unread').length
    return { total, high, medium, low, unread }
  }, [alerts])

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.alertTitle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = activeFilter === 'all' || alert.riskLevel === activeFilter
      // 风险类型筛选
      const matchesRiskType = selectedRiskType === 'all' || alert.riskType === selectedRiskType
      // 风险等级筛选
      const matchesRiskLevel = selectedRiskLevel === 'all' || alert.riskLevel === selectedRiskLevel
      // 时间区间筛选
      let matchesDateRange = true
      if (dateRange !== 'all') {
        const alertDate = new Date(alert.alertTime)
        const now = new Date()
        const diffTime = now.getTime() - alertDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        if (dateRange === 'today') {
          matchesDateRange = diffDays === 0
        } else if (dateRange === 'week') {
          matchesDateRange = diffDays <= 7
        } else if (dateRange === 'month') {
          matchesDateRange = diffDays <= 30
        }
      }
      return matchesSearch && matchesFilter && matchesRiskType && matchesRiskLevel && matchesDateRange
    })
  }, [searchQuery, activeFilter, alerts, selectedRiskType, selectedRiskLevel, dateRange])

  const handleMarkAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, status: 'read' as const } : alert
    ))
  }

  const handleMarkAsHandled = (id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, status: 'handled' as const } : alert
    ))
  }

  const handleViewDetail = (alert: RiskAlert) => {
    setViewingRiskAlert(alert)
    setIsRiskDetailOpen(true)
    if (alert.status === 'unread') {
      handleMarkAsRead(alert.id)
    }
  }

  // AI解读分析
  const handleAIAnalysis = async (alert: RiskAlert) => {
    setSelectedRiskAlert(alert)
    setIsAIAnalysisOpen(true)
    setIsAnalyzing(true)
    setAiAnalysisContent('')

    // 模拟AI分析过程
    const analysisSteps = [
      '正在分析风险数据...',
      '评估供应链影响...',
      '生成应对建议...',
    ]

    for (const step of analysisSteps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setAiAnalysisContent(prev => prev + step + '\n')
    }

    // 生成完整分析结果
    const analysisResult = generateAIAnalysis(alert)
    setAiAnalysisContent(analysisResult)
    setIsAnalyzing(false)
  }

  // 生成AI分析内容
  const generateAIAnalysis = (alert: RiskAlert): string => {
    const impactAnalysis = getImpactAnalysis(alert)
    const suggestions = getSuggestions(alert)

    return `## 风险分析

**风险类型：** ${riskTypeMap[alert.riskType].label}
**风险等级：** ${riskLevelMap[alert.riskLevel].label}
**风险指标：** ${alert.riskIndicator || alert.alertTitle}

### 风险概述
${alert.alertDescription}

### 供应链影响分析
${impactAnalysis}

### 应对建议
${suggestions}

### 监控建议
建议持续关注该企业的风险动态，定期评估其对供应链的影响，并考虑建立备选供应商方案以降低风险。`
  }

  // 获取影响分析
  const getImpactAnalysis = (alert: RiskAlert): string => {
    const analyses: Record<string, string> = {
      financial: `该财务风险可能对供应链产生以下影响：
1. **资金流动性风险**：企业财务状况恶化可能影响其履约能力
2. **交付延迟风险**：资金链紧张可能导致生产受阻，影响交付周期
3. **价格波动风险**：财务压力可能传导至产品定价，增加采购成本
4. **合作稳定性风险**：长期财务问题可能导致合作关系不稳定`,
      legal: `该法律风险可能对供应链产生以下影响：
1. **声誉风险**：涉诉信息可能影响企业形象，间接影响合作方信心
2. **经营限制风险**：法律纠纷可能导致资产冻结或经营受限
3. **赔偿风险**：败诉可能导致大额赔偿，影响企业财务状况
4. **合规风险**：暴露合规管理漏洞，需评估其他潜在法律风险`,
      operation: `该经营风险可能对供应链产生以下影响：
1. **业务连续性风险**：经营范围调整可能影响核心产品供应
2. **合作关系风险**：业务方向变化可能影响长期合作稳定性
3. **适配性风险**：需重新评估调整后的业务是否符合采购需求
4. **转型风险**：业务转型期间可能出现服务质量波动`,
      credit: `该信用风险可能对供应链产生以下影响：
1. **履约能力风险**：失信记录表明企业履约能力存在问题
2. **合作信任风险**：信用问题可能影响双方合作信任基础
3. **付款风险**：需加强付款节点管控，防范资金风险
4. **替代风险**：建议尽快寻找备选供应商，降低依赖度`,
    }
    return analyses[alert.riskType] || '建议进一步评估该风险对供应链的具体影响。'
  }

  // 获取应对建议
  const getSuggestions = (alert: RiskAlert): string => {
    const suggestions: Record<string, string> = {
      financial: `1. **加强财务监控**：要求企业提供近期财务报表，评估偿债能力
2. **调整付款条款**：考虑采用更保守的付款方式，如预付款或分期付款
3. **建立备选方案**：启动备选供应商筛选流程，降低单一依赖风险
4. **合同保护**：在合同中增加财务恶化触发条款，保护采购方权益`,
      legal: `1. **法律评估**：咨询法务团队，评估案件对企业经营的实质影响
2. **风险隔离**：审查现有合同，确保法律风险不会传导至采购方
3. **持续跟踪**：关注案件进展，及时调整合作策略
4. **合规审查**：要求企业提供合规改进计划，防范类似风险`,
      operation: `1. **业务评估**：了解经营范围调整的具体内容和原因
2. **能力确认**：确认调整后的企业是否仍能满足采购需求
3. **合同审查**：审查现有合同条款，评估是否需要调整
4. **沟通机制**：加强日常沟通，及时掌握企业经营动态`,
      credit: `1. **严格准入**：将该企业列入重点关注名单，加强准入审核
2. **担保措施**：要求提供履约担保或保函，降低信用风险
3. **缩短账期**：调整付款账期，减少资金占用风险
4. **寻找替代**：优先寻找替代供应商，逐步降低依赖程度`,
    }
    return suggestions[alert.riskType] || '建议根据具体情况制定针对性应对措施。'
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">风险预警</h1>
          <p className="text-sm text-slate-500 mt-1">监控供应商风险状态，及时预警潜在风险</p>
        </div>
        <button
          onClick={handleAddMonitorCompany}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>添加监控企业</span>
        </button>
      </div>

      {/* 数据概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 监控企业总数 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">监控企业总数</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
            <span className="text-sm text-slate-400">家</span>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-0.5" />
              <span>+5.2%</span>
            </div>
            <span className="text-xs text-slate-400">较上月</span>
          </div>
        </div>

        {/* 高风险预警 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">高风险预警</span>
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{stats.high}</span>
            <span className="text-sm text-slate-400">条</span>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <div className="flex items-center text-red-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-0.5" />
              <span>+2</span>
            </div>
            <span className="text-xs text-slate-400">较昨日</span>
          </div>
        </div>

        {/* 中风险预警 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">中风险预警</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{stats.medium}</span>
            <span className="text-sm text-slate-400">条</span>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <div className="flex items-center text-green-600 text-sm">
              <TrendingDown className="w-4 h-4 mr-0.5" />
              <span>-1</span>
            </div>
            <span className="text-xs text-slate-400">较昨日</span>
          </div>
        </div>

        {/* 未读预警 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">未读预警</span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{stats.unread}</span>
            <span className="text-sm text-slate-400">条</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            请及时处理
          </div>
        </div>
      </div>

      {/* 筛选区 */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex items-center gap-6">
          {/* 风险类型筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">风险类型：</span>
            <select
              value={selectedRiskType}
              onChange={(e) => setSelectedRiskType(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">全部</option>
              <option value="financial">财务风险</option>
              <option value="legal">法律风险</option>
              <option value="operation">经营风险</option>
              <option value="credit">信用风险</option>
            </select>
          </div>

          {/* 风险等级筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">风险等级：</span>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">全部</option>
              <option value="high">高风险</option>
              <option value="medium">中风险</option>
              <option value="low">低风险</option>
            </select>
          </div>

          {/* 时间区间筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">时间区间：</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">全部时间</option>
              <option value="today">今天</option>
              <option value="week">近7天</option>
              <option value="month">近30天</option>
            </select>
          </div>

          {/* 搜索框 */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-slate-500">企业名称：</span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索企业名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 风险预警列表 */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">企业名称</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">风险等级</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">风险指标</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">风险内容</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">更新时间</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map((alert) => {
                const RiskIcon = riskLevelMap[alert.riskLevel].icon
                return (
                  <tr
                    key={alert.id}
                    className={`hover:bg-slate-50/50 transition-colors ${alert.status === 'unread' ? 'bg-red-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{alert.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${riskLevelMap[alert.riskLevel].color}`}>
                        <div className={`w-8 h-8 rounded-lg ${riskLevelMap[alert.riskLevel].bgColor} flex items-center justify-center`}>
                          <RiskIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{riskLevelMap[alert.riskLevel].label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${riskTypeMap[alert.riskType].color}`}>
                        {alert.riskIndicator || alert.alertTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm text-slate-600 line-clamp-2">{alert.alertDescription}</div>
                        <button
                          onClick={() => handleAIAnalysis(alert)}
                          className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI解读
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{alert.updateTime || alert.alertTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[alert.status].bgColor} ${statusMap[alert.status].color}`}>
                        {statusMap[alert.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(alert)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          详情
                        </button>
                        {alert.status !== 'handled' && (
                          <button
                            onClick={() => handleMarkAsHandled(alert.id)}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            去处理
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredAlerts.length === 0 && (
          <div className="py-12 text-center">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无风险预警</p>
          </div>
        )}
      </div>

      {/* 风险动态详情弹窗 */}
      {isRiskDetailOpen && viewingRiskAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${riskLevelMap[viewingRiskAlert.riskLevel].bgColor} flex items-center justify-center`}>
                  {(() => {
                    const RiskIcon = riskLevelMap[viewingRiskAlert.riskLevel].icon
                    return <RiskIcon className={`w-5 h-5 ${riskLevelMap[viewingRiskAlert.riskLevel].color}`} />
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{viewingRiskAlert.alertTitle}</h3>
                  <p className="text-sm text-slate-500">{viewingRiskAlert.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsRiskDetailOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 基本信息表格 */}
              <div className="bg-slate-50 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="px-4 py-3 text-slate-500 w-32 bg-slate-100">案由</td>
                      <td className="px-4 py-3 text-slate-800">{viewingRiskAlert.caseReason || viewingRiskAlert.alertDescription}</td>
                    </tr>
                    {viewingRiskAlert.caseNumber && (
                      <tr className="border-b border-slate-200">
                        <td className="px-4 py-3 text-slate-500 bg-slate-100">案号</td>
                        <td className="px-4 py-3">
                          <span className="text-blue-600 hover:underline cursor-pointer">{viewingRiskAlert.caseNumber}</span>
                        </td>
                      </tr>
                    )}
                    {viewingRiskAlert.caseDate && (
                      <tr className="border-b border-slate-200">
                        <td className="px-4 py-3 text-slate-500 bg-slate-100">立案时间</td>
                        <td className="px-4 py-3 text-slate-800">{viewingRiskAlert.caseDate}</td>
                      </tr>
                    )}
                    {viewingRiskAlert.court && (
                      <tr className="border-b border-slate-200">
                        <td className="px-4 py-3 text-slate-500 bg-slate-100">法院/机构</td>
                        <td className="px-4 py-3 text-slate-800">{viewingRiskAlert.court}</td>
                      </tr>
                    )}
                    {viewingRiskAlert.caseType && (
                      <tr className="border-b border-slate-200">
                        <td className="px-4 py-3 text-slate-500 bg-slate-100">案件类型</td>
                        <td className="px-4 py-3 text-slate-800">{viewingRiskAlert.caseType}</td>
                      </tr>
                    )}
                    {(viewingRiskAlert.plaintiff || viewingRiskAlert.defendant) && (
                      <tr>
                        <td className="px-4 py-3 text-slate-500 bg-slate-100">当事人</td>
                        <td className="px-4 py-3">
                          {viewingRiskAlert.plaintiff && (
                            <div className="text-slate-800">
                              <span className="text-slate-500">原告：</span>
                              <span className="text-blue-600 hover:underline cursor-pointer">{viewingRiskAlert.plaintiff}</span>
                            </div>
                          )}
                          {viewingRiskAlert.defendant && (
                            <div className="text-slate-800 mt-1">
                              <span className="text-slate-500">被告：</span>
                              <span className="text-blue-600 hover:underline cursor-pointer">{viewingRiskAlert.defendant}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 风险描述 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">风险描述</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 leading-relaxed">{viewingRiskAlert.alertDescription}</p>
                </div>
              </div>

              {/* 风险指标 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">风险类型</div>
                  <div className={`text-sm font-medium ${riskTypeMap[viewingRiskAlert.riskType].color}`}>
                    {riskTypeMap[viewingRiskAlert.riskType].label}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">风险等级</div>
                  <div className={`text-sm font-medium ${riskLevelMap[viewingRiskAlert.riskLevel].color}`}>
                    {riskLevelMap[viewingRiskAlert.riskLevel].label}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">风险指标</div>
                  <div className="text-sm font-medium text-slate-700">
                    {viewingRiskAlert.riskIndicator || '-'}
                  </div>
                </div>
              </div>

              {/* 关联案件 */}
              {viewingRiskAlert.relatedCases && viewingRiskAlert.relatedCases.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">关联案件</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-slate-200 rounded-lg">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">序号</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">案件名称</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">案件类型</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">案由</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">案号</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">法院</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {viewingRiskAlert.relatedCases.map((caseItem, index) => (
                          <tr key={caseItem.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                            <td className="px-4 py-3">
                              <span className="text-blue-600 hover:underline cursor-pointer">{caseItem.caseName}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{caseItem.caseType}</td>
                            <td className="px-4 py-3 text-slate-600">{caseItem.caseReason}</td>
                            <td className="px-4 py-3">
                              <span className="text-blue-600 hover:underline cursor-pointer">{caseItem.caseNumber}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{caseItem.court}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{caseItem.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setIsRiskDetailOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                关闭
              </button>
              {viewingRiskAlert.status !== 'handled' && (
                <button
                  onClick={() => {
                    handleMarkAsHandled(viewingRiskAlert.id)
                    setIsRiskDetailOpen(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  标记已处理
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI解读弹窗 */}
      {isAIAnalysisOpen && selectedRiskAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">AI风险解读</h3>
                  <p className="text-sm text-slate-500">{selectedRiskAlert.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAIAnalysisOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">AI正在分析风险数据...</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-slate-500">风险等级：</span>
                      <span className={`text-sm font-medium ${riskLevelMap[selectedRiskAlert.riskLevel].color}`}>
                        {riskLevelMap[selectedRiskAlert.riskLevel].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">风险指标：</span>
                      <span className="text-sm font-medium text-slate-700">
                        {selectedRiskAlert.riskIndicator || selectedRiskAlert.alertTitle}
                      </span>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                    {aiAnalysisContent.split('\n').map((line, index) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-lg font-semibold text-slate-800 mt-6 mb-3">{line.replace('## ', '')}</h2>
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-base font-medium text-slate-700 mt-4 mb-2">{line.replace('### ', '')}</h3>
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={index} className="font-medium text-slate-800 my-2">{line.replace(/\*\*/g, '')}</p>
                      }
                      if (line.match(/^\d+\./)) {
                        return <p key={index} className="ml-4 my-1 text-slate-600">{line}</p>
                      }
                      if (line.startsWith('- ')) {
                        return <li key={index} className="ml-4 my-1 text-slate-600">{line.replace('- ', '')}</li>
                      }
                      if (line.trim() === '') {
                        return <div key={index} className="h-2" />
                      }
                      return <p key={index} className="my-2 text-slate-700">{line}</p>
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setIsAIAnalysisOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                关闭
              </button>
              {!isAnalyzing && (
                <button
                  onClick={() => handleAIAnalysis(selectedRiskAlert)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Loader2 className="w-4 h-4" />
                  重新分析
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
