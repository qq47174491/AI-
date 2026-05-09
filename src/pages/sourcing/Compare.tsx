// 供应商对比页面
import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  CheckCircle,
  X,
  Building2,
  Award,
  Package,
  Star,
  ChevronRight,
  BarChart3,
  Shield,
  Zap,
  Wallet,
  HeartHandshake
} from 'lucide-react'

// 对比的供应商数据接口
interface CompareSupplier {
  id: string
  name: string
  logo: string
  logoColor: string
  matchScore: number
  industry: string
  location: string
  foundedYear: string
  employeeCount: string
  certifications: string[]
  coreAdvantage: string
  monthlyCapacity: string
  customers: string[]
  annualRevenue: string
  businessScope: string[]
  riskLevel: 'low' | 'medium' | 'high'
  mainProducts: string[]
  productionCapacity: string
  deliveryTime: string
  qualityScore: number
  deliveryScore: number
  serviceScore: number
  priceScore: number
  creditRating: string
  paymentTerms: string
  rdInvestment: string
  patentCount: string
  factoryArea: string
  equipmentCount: string
  passRate: string
  returnRate: string
  complaintRate: string
}

// 从备选池传递过来的数据接口
interface PoolSupplier {
  id: string
  name: string
  logo: string
  logoColor: string
  matchScore: number
  industry: string
  location: string
  foundedYear: string
  employeeCount: string
  certifications: string[]
  coreAdvantage: string
  monthlyCapacity: string
  customers: string
  annualRevenue?: string
  businessScope?: string[]
  riskLevel?: 'low' | 'medium' | 'high'
  mainProducts?: string[]
  productionCapacity?: string
  deliveryTime?: string
}

// 将 PoolSupplier 转换为 CompareSupplier
const convertToCompareSupplier = (poolSupplier: PoolSupplier): CompareSupplier => {
  // 解析客户字符串为数组
  const customersList = poolSupplier.customers 
    ? poolSupplier.customers.split(/[,，、]/).map(c => c.trim()).filter(c => c)
    : []
  
  return {
    id: poolSupplier.id,
    name: poolSupplier.name,
    logo: poolSupplier.logo,
    logoColor: poolSupplier.logoColor,
    matchScore: poolSupplier.matchScore,
    industry: poolSupplier.industry,
    location: poolSupplier.location,
    foundedYear: poolSupplier.foundedYear,
    employeeCount: poolSupplier.employeeCount,
    certifications: poolSupplier.certifications,
    coreAdvantage: poolSupplier.coreAdvantage,
    monthlyCapacity: poolSupplier.monthlyCapacity,
    customers: customersList.length > 0 ? customersList : ['暂无'],
    annualRevenue: poolSupplier.annualRevenue || '未知',
    businessScope: poolSupplier.businessScope || [],
    riskLevel: poolSupplier.riskLevel || 'low',
    mainProducts: poolSupplier.mainProducts || [],
    productionCapacity: poolSupplier.productionCapacity || '',
    deliveryTime: poolSupplier.deliveryTime || '',
    // 模拟评分数据（实际应从后端获取）
    qualityScore: 4.5 + Math.random() * 0.5,
    deliveryScore: 4.3 + Math.random() * 0.6,
    serviceScore: 4.4 + Math.random() * 0.5,
    priceScore: 4.2 + Math.random() * 0.6,
    creditRating: 'AA+',
    paymentTerms: '月结30天',
    rdInvestment: '5%',
    patentCount: '20+项',
    factoryArea: '30000㎡',
    equipmentCount: '100+台',
    passRate: '99.0%',
    returnRate: '0.5%',
    complaintRate: '0.2%'
  }
}

// 对比维度配置
const compareDimensions = [
  {
    category: '基本信息',
    icon: Building2,
    items: [
      { key: 'industry', label: '所属行业', type: 'text' },
      { key: 'foundedYear', label: '成立时间', type: 'text', suffix: '年' },
      { key: 'employeeCount', label: '员工规模', type: 'text' },
      { key: 'location', label: '所在地区', type: 'text' },
      { key: 'annualRevenue', label: '年营业额', type: 'text' },
    ]
  },
  {
    category: '资质认证',
    icon: Award,
    items: [
      { key: 'certifications', label: '认证体系', type: 'tags' },
      { key: 'creditRating', label: '信用评级', type: 'badge' },
    ]
  },
  {
    category: '生产能力',
    icon: Package,
    items: [
      { key: 'factoryArea', label: '厂房面积', type: 'text' },
      { key: 'equipmentCount', label: '设备数量', type: 'text' },
      { key: 'monthlyCapacity', label: '月产能', type: 'text' },
      { key: 'productionCapacity', label: '年产能', type: 'text' },
      { key: 'deliveryTime', label: '交付周期', type: 'text' },
    ]
  },
  {
    category: '技术实力',
    icon: Zap,
    items: [
      { key: 'rdInvestment', label: '研发投入占比', type: 'text' },
      { key: 'patentCount', label: '专利数量', type: 'text' },
      { key: 'mainProducts', label: '主营产品', type: 'list' },
    ]
  },
  {
    category: '质量水平',
    icon: Shield,
    items: [
      { key: 'passRate', label: '产品合格率', type: 'text' },
      { key: 'returnRate', label: '退货率', type: 'text' },
      { key: 'complaintRate', label: '客户投诉率', type: 'text' },
    ]
  },
  {
    category: '商务条件',
    icon: Wallet,
    items: [
      { key: 'paymentTerms', label: '付款方式', type: 'text' },
    ]
  },
  {
    category: '综合评价',
    icon: Star,
    items: [
      { key: 'qualityScore', label: '质量评分', type: 'score' },
      { key: 'deliveryScore', label: '交付评分', type: 'score' },
      { key: 'serviceScore', label: '服务评分', type: 'score' },
      { key: 'priceScore', label: '价格评分', type: 'score' },
    ]
  },
]

export default function SupplierCompare() {
  const navigate = useNavigate()
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<CompareSupplier | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 从 sessionStorage 获取选中的供应商数据
  const suppliers = useMemo(() => {
    const stored = sessionStorage.getItem('compareSuppliers')
    if (stored) {
      try {
        const poolSuppliers: PoolSupplier[] = JSON.parse(stored)
        return poolSuppliers.map(convertToCompareSupplier)
      } catch {
        return []
      }
    }
    return []
  }, [])

  // 监听滚动事件 - 直接响应避免延迟
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const shouldBeScrolled = container.scrollTop > 80
      setIsScrolled(prev => {
        // 只在状态真正需要改变时才更新，避免不必要的渲染
        if (prev !== shouldBeScrolled) {
          return shouldBeScrolled
        }
        return prev
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // 处理转正
  const handlePromote = (supplier: CompareSupplier) => {
    setSelectedSupplier(supplier)
    setShowPromoteModal(true)
  }

  // 确认转正
  const confirmPromote = () => {
    if (selectedSupplier) {
      alert(`已将 ${selectedSupplier.name} 转为正式供应商`)
      setShowPromoteModal(false)
      setSelectedSupplier(null)
    }
  }

  // 处理移除
  const handleRemove = (supplier: CompareSupplier) => {
    if (confirm(`确定要将 ${supplier.name} 从备选池中移除吗？`)) {
      alert('已移除供应商')
    }
  }

  // 导出报告
  const handleExport = () => {
    alert('正在导出对比报告...')
  }

  // 渲染对比值
  const renderCompareValue = (supplier: CompareSupplier, item: any) => {
    const value = supplier[item.key as keyof CompareSupplier]
    
    switch (item.type) {
      case 'text':
        const textValue = value as string
        const isBest = item.key === 'matchScore' || 
          (item.key === 'passRate' && textValue === Math.max(...suppliers.map(s => parseFloat(s.passRate))).toFixed(1) + '%') ||
          (item.key === 'monthlyCapacity' && textValue === suppliers.reduce((max, s) => 
            parseInt(s.monthlyCapacity) > parseInt(max.monthlyCapacity) ? s : max
          ).monthlyCapacity)
        return (
          <span className={`text-sm ${isBest ? 'text-green-600 font-medium' : 'text-slate-700'}`}>
            {textValue}{item.suffix || ''}
          </span>
        )
      
      case 'tags':
        return (
          <div className="flex flex-wrap gap-1">
            {(value as string[]).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )
      
      case 'list':
        return (
          <div className="space-y-1">
            {(value as string[]).slice(0, 3).map((item, idx) => (
              <div key={idx} className="text-sm text-slate-700 flex items-center">
                <div className="w-1 h-1 bg-slate-400 rounded-full mr-2" />
                {item}
              </div>
            ))}
          </div>
        )
      
      case 'badge':
        return (
          <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            {value as string}
          </span>
        )
      
      case 'score':
        const score = value as number
        const maxScore = Math.max(...suppliers.map(s => s[item.key as keyof CompareSupplier] as number))
        const isHighest = score === maxScore
        return (
          <div className="flex items-center">
            <div className={`flex items-center ${isHighest ? 'text-green-600' : 'text-slate-700'}`}>
              <Star className={`w-4 h-4 mr-1 ${isHighest ? 'fill-green-600' : 'fill-amber-400 text-amber-400'}`} />
              <span className={`text-sm font-medium ${isHighest ? 'text-green-600' : ''}`}>{score.toFixed(1)}</span>
            </div>
            <div className="ml-2 w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isHighest ? 'bg-green-500' : 'bg-amber-400'}`}
                style={{ width: `${(score / 5) * 100}%` }}
              />
            </div>
          </div>
        )
      
      default:
        return <span className="text-sm text-slate-700">{value as string}</span>
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 面包屑 */}
          <div className="flex items-center text-sm">
            <span className="text-slate-500">采购寻源</span>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
            <span className="text-slate-500">供应商备选池</span>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
            <span className="text-slate-800 font-medium">供应商对比</span>
          </div>

          {/* 导出报告按钮 */}
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </button>
        </div>
      </div>

      {/* 页面内容 */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* 页面头部 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-semibold text-slate-800">供应商对比</h1>
              <button 
                onClick={() => navigate('/sourcing/pool')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回备选池
              </button>
            </div>
            <p className="text-sm text-slate-500">
              正在对比 {suppliers.length} 家供应商，帮助您做出最佳采购决策
            </p>
          </div>

          {/* 空状态提示 */}
          {suppliers.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">未选择供应商</h3>
              <p className="text-sm text-slate-500 mb-4">请返回备选池选择2-3家供应商进行对比</p>
              <button 
                onClick={() => navigate('/sourcing/pool')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                去选供应商
              </button>
            </div>
          )}

          {/* 供应商头部卡片 - 置顶冻结 */}
          <div className="sticky top-0 z-20 bg-slate-50 pb-4">
            <div className={`grid gap-4 ${suppliers.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* 滚动后只显示简化信息 */}
                  <div className={`${isScrolled ? 'p-3' : 'p-5 border-b border-slate-100'}`}>
                    <div className="flex items-center">
                      <div className={`${isScrolled ? 'w-10 h-10' : 'w-14 h-14'} ${supplier.logoColor} rounded-xl flex items-center justify-center mr-3 transition-[width,height] duration-200`}>
                        <span className={`text-white font-bold ${isScrolled ? 'text-base' : 'text-xl'}`}>{supplier.logo}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-slate-800 truncate ${isScrolled ? 'text-sm' : 'text-base mb-1'}`}>{supplier.name}</h3>
                        {!isScrolled && (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-medium">
                              匹配度 {supplier.matchScore}%
                            </span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                              {supplier.certifications[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 完整信息 - 仅在未滚动时显示 */}
                    {!isScrolled && (
                      <div className="grid grid-cols-3 gap-3 text-center mt-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">成立时间</div>
                          <div className="text-sm font-medium text-slate-700">{supplier.foundedYear}年</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">员工规模</div>
                          <div className="text-sm font-medium text-slate-700">{supplier.employeeCount}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">所在地区</div>
                          <div className="text-sm font-medium text-slate-700">{supplier.location}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 - 仅在未滚动时显示 */}
                  {!isScrolled && (
                    <div className="p-4 flex items-center justify-between bg-slate-50">
                      <button 
                        onClick={() => handlePromote(supplier)}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        转正
                      </button>
                      <button 
                        onClick={() => handleRemove(supplier)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 对比表格 */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {compareDimensions.map((dimension, dimIndex) => (
              <div key={dimension.category} className={dimIndex > 0 ? 'border-t border-slate-100' : ''}>
                {/* 分类标题 */}
                <div className="px-6 py-4 bg-slate-50 flex items-center">
                  <dimension.icon className="w-5 h-5 text-blue-600 mr-3" />
                  <h3 className="font-semibold text-slate-800">{dimension.category}</h3>
                </div>

                {/* 对比项 */}
                <div className="divide-y divide-slate-100">
                  {dimension.items.map((item) => (
                    <div key={item.key} className={`grid gap-4 px-6 py-4 items-center ${suppliers.length === 2 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                      <div className="text-sm text-slate-500">{item.label}</div>
                      {suppliers.map((supplier) => (
                        <div key={supplier.id} className="text-sm">
                          {renderCompareValue(supplier, item)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 核心优势对比 */}
          <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 flex items-center">
              <HeartHandshake className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="font-semibold text-slate-800">核心优势</h3>
            </div>
            <div className="p-6">
              <div className={`grid gap-6 ${suppliers.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed">{supplier.coreAdvantage}</p>
                    
                    {/* 主要客户 */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500 mb-2">主要客户</div>
                      <div className="flex flex-wrap gap-1">
                        {supplier.customers.slice(0, 4).map((customer, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            {customer}
                          </span>
                        ))}
                        {supplier.customers.length > 4 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs">
                            +{supplier.customers.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 综合评分雷达图区域 */}
          <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-3" />
                <h3 className="font-semibold text-slate-800">综合评分对比</h3>
              </div>
            </div>
            <div className="p-6">
              <div className={`grid gap-6 ${suppliers.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="text-center">
                    <div className="mb-4">
                      <div className="text-sm text-green-600 font-medium">综合评分 {((supplier.qualityScore + supplier.deliveryScore + supplier.serviceScore + supplier.priceScore) / 4).toFixed(1)}</div>
                    </div>

                    {/* 评分项 */}
                    <div className="space-y-3">
                      {[
                        { label: '质量', score: supplier.qualityScore, color: 'bg-blue-500' },
                        { label: '交付', score: supplier.deliveryScore, color: 'bg-green-500' },
                        { label: '服务', score: supplier.serviceScore, color: 'bg-amber-500' },
                        { label: '价格', score: supplier.priceScore, color: 'bg-purple-500' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center">
                          <span className="text-xs text-slate-500 w-10">{item.label}</span>
                          <div className="flex-1 mx-3">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{ width: `${(item.score / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-medium text-slate-700 w-8">{item.score.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 转正确认弹窗 */}
      {showPromoteModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-[480px] p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">确认转正</h3>
                <p className="text-sm text-slate-500">将该供应商转为正式供应商</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${selectedSupplier.logoColor} rounded-lg flex items-center justify-center mr-3`}>
                  <span className="text-white font-bold">{selectedSupplier.logo}</span>
                </div>
                <div>
                  <div className="font-medium text-slate-800">{selectedSupplier.name}</div>
                  <div className="text-sm text-slate-500">匹配度 {selectedSupplier.matchScore}% · {selectedSupplier.industry}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowPromoteModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button 
                onClick={confirmPromote}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                确认转正
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
