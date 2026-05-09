// 正式供应商管理页面
import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Filter,
  Plus,
  Star,
  Phone,
  Mail,
  MapPin,
  Building2,
  // @ts-ignore - 保留以备后用
  MoreHorizontal,
  // @ts-ignore - 保留以备后用
  ChevronDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  X,
  Download,
  FileText,
  ArrowUpDown,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import CompanyDetailDrawer from '../../components/CompanyDetailDrawer'
import {
  getOfficialSuppliers,
  removeFromOfficial,
  toggleMonitorStatus,
  Supplier as StorageSupplier,
  initSampleData
} from '../../services/supplierStorage'

// Toast 提示组件
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center px-4 py-3 rounded-lg shadow-lg animate-fade-in ${
            toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 mr-2" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 mr-2" />}
          {toast.type === 'info' && <FileText className="w-5 h-5 mr-2" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

// 供应商状态标签
function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { text: string; className: string }> = {
    active: { text: '合作中', className: 'bg-green-50 text-green-600' },
    inactive: { text: '暂停合作', className: 'bg-amber-50 text-amber-600' },
    terminated: { text: '已终止', className: 'bg-red-50 text-red-600' }
  }
  const { text, className } = statusMap[status] || statusMap.active
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {text}
    </span>
  )
}

// 风险等级标签
function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const levelMap = {
    low: { text: '低风险', className: 'bg-green-50 text-green-600' },
    medium: { text: '中风险', className: 'bg-amber-50 text-amber-600' },
    high: { text: '高风险', className: 'bg-red-50 text-red-600' }
  }
  const { text, className } = levelMap[level] || levelMap.low
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {text}
    </span>
  )
}

// 评分星星
function RatingStars({ score }: { score: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(score)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-200'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-slate-600">{score.toFixed(1)}</span>
    </div>
  )
}

// 将存储的 Supplier 转换为 Company 格式（适配 CompanyDetailDrawer）
const getCompanyFromSupplier = (supplier: StorageSupplier | null) => {
  if (!supplier) return null
  return {
    id: supplier.id,
    name: supplier.name,
    matchScore: supplier.matchScore,
    location: supplier.location,
    industry: supplier.industry,
    tags: supplier.certifications,
    advantages: [supplier.coreAdvantage],
    riskLevel: supplier.riskLevel || 'low',
    fullAddress: supplier.fullAddress || supplier.location,
    contactPhone: supplier.contactPhone || supplier.phone || '',
    contactEmail: supplier.contactEmail || supplier.email || '',
    website: supplier.website || '',
    foundedYear: supplier.foundedYear,
    employeeCount: supplier.employeeCount,
    annualRevenue: supplier.annualRevenue || '',
    businessScope: supplier.businessScope || [],
    certifications: supplier.certifications,
    riskFactors: [],
    cooperationHistory: {
      totalOrders: supplier.cooperationHistory?.totalOrders || supplier.totalOrders || 0,
      completedOrders: supplier.cooperationHistory?.completedOrders || supplier.totalOrders || 0,
      totalAmount: supplier.cooperationHistory?.totalAmount || '',
      lastCooperation: supplier.cooperationHistory?.lastCooperation || supplier.lastOrderDate || ''
    },
    financialStatus: {
      creditRating: supplier.financialStatus?.creditRating || '',
      paymentTerms: supplier.financialStatus?.paymentTerms || '',
      financialHealth: supplier.financialStatus?.financialHealth || 'excellent'
    },
    mainProducts: supplier.mainProducts || [],
    productionCapacity: supplier.productionCapacity || '',
    deliveryTime: supplier.deliveryTime || '',
    ratings: {
      quality: supplier.qualityScore || supplier.ratings?.quality || 0,
      delivery: supplier.ratings?.delivery || 0,
      service: supplier.ratings?.service || 0,
      price: supplier.ratings?.price || 0,
      overall: supplier.qualityScore || supplier.ratings?.overall || 0
    }
  }
}

export default function OfficialSuppliers() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('全部')
  const [selectedIndustry, setSelectedIndustry] = useState('全部')
  const [selectedMonitorStatus, setSelectedMonitorStatus] = useState<'全部' | 'monitored' | 'unmonitored'>('全部')
  const [suppliers, setSuppliers] = useState<StorageSupplier[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [sortBy, setSortBy] = useState<'qualityScore' | 'cooperationYears' | 'monthlyAmount'>('qualityScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<StorageSupplier | null>(null)

  // 初始化时加载数据
  useEffect(() => {
    initSampleData()
    setSuppliers(getOfficialSuppliers())
  }, [])

  // 添加 Toast
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 3000)
  }

  // 移除 Toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // 刷新供应商列表
  const refreshSuppliers = () => {
    setSuppliers(getOfficialSuppliers())
  }

  // 筛选后的供应商列表
  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers]

    // 搜索筛选
    if (searchValue) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        s.industry.toLowerCase().includes(searchValue.toLowerCase()) ||
        s.location.toLowerCase().includes(searchValue.toLowerCase())
      )
    }

    // 状态筛选
    if (selectedStatus !== '全部') {
      result = result.filter(s => s.status === selectedStatus)
    }

    // 行业筛选
    if (selectedIndustry !== '全部') {
      result = result.filter(s => s.industry === selectedIndustry)
    }

    // 监控状态筛选
    if (selectedMonitorStatus !== '全部') {
      if (selectedMonitorStatus === 'monitored') {
        result = result.filter(s => s.isMonitored)
      } else {
        result = result.filter(s => !s.isMonitored)
      }
    }

    // 排序
    result.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'qualityScore') {
        comparison = (a.qualityScore || 0) - (b.qualityScore || 0)
      } else if (sortBy === 'cooperationYears') {
        comparison = (a.cooperationYears || 0) - (b.cooperationYears || 0)
      } else if (sortBy === 'monthlyAmount') {
        comparison = (a.monthlyAmount || 0) - (b.monthlyAmount || 0)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [suppliers, searchValue, selectedStatus, selectedIndustry, selectedMonitorStatus, sortBy, sortOrder])

  // 统计数据
  const stats = useMemo(() => {
    const total = suppliers.length
    // @ts-ignore - status类型兼容处理
    const active = suppliers.filter(s => s.status === 'official' || s.status === 'active').length
    const monitored = suppliers.filter(s => s.isMonitored).length
    const highRisk = suppliers.filter(s => s.riskLevel === 'high').length
    return { total, active, monitored, highRisk }
  }, [suppliers])

  // 导出数据
  const handleExport = () => {
    addToast('正在导出正式供应商数据...', 'info')
    setTimeout(() => {
      addToast('导出成功', 'success')
    }, 1500)
  }

  // 切换排序
  const handleSort = (field: 'qualityScore' | 'cooperationYears' | 'monthlyAmount') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // 查看详情
  const handleOpenDetail = (supplier: StorageSupplier) => {
    setSelectedSupplier(supplier)
    setDetailDrawerOpen(true)
  }

  // 移除供应商
  const handleRemoveSupplier = (supplier: StorageSupplier) => {
    if (confirm(`确定要将 "${supplier.name}" 从正式供应商列表中移除吗？`)) {
      if (removeFromOfficial(supplier.id)) {
        addToast(`已将 "${supplier.name}" 从正式供应商列表移除`, 'success')
        refreshSuppliers()
      } else {
        addToast('移除失败，请重试', 'error')
      }
    }
  }

  // 切换监控状态
  const handleToggleMonitor = (supplier: StorageSupplier) => {
    if (toggleMonitorStatus(supplier.id)) {
      const newStatus = !supplier.isMonitored
      addToast(
        `已${newStatus ? '开启' : '关闭'}对 "${supplier.name}" 的风险监控`,
        'success'
      )
      refreshSuppliers()
    } else {
      addToast('操作失败，请重试', 'error')
    }
  }

  // 状态选项
  const statusOptions = ['全部', 'active', 'inactive', 'terminated']
  const industryOptions = ['全部', '电子元器件', '机械设备', '五金制品', '包装材料', '半导体设备']
  const monitorStatusOptions: { key: '全部' | 'monitored' | 'unmonitored'; label: string }[] = [
    { key: '全部', label: '全部' },
    { key: 'monitored', label: '已监控' },
    { key: 'unmonitored', label: '未监控' }
  ]

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Toast 提示 */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* 顶部导航 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 面包屑 */}
          <div className="flex items-center text-sm">
            <span className="text-slate-500">供应商管理</span>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-800 font-medium">正式供应商</span>
          </div>

          {/* 顶部操作区 */}
          <div className="flex items-center space-x-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索供应商名称..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {searchValue && (
                <button
                  onClick={() => setSearchValue('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 筛选按钮 */}
            <button 
              onClick={() => addToast('筛选功能已打开', 'info')}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>

            {/* 导出按钮 */}
            <button 
              onClick={handleExport}
              className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              导出
            </button>

            {/* 新增供应商按钮 */}
            <button 
              onClick={() => addToast('新增供应商功能开发中', 'info')}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              新增供应商
            </button>
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="w-full">
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">正式供应商总数</p>
                  <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">合作中</p>
                  <p className="text-2xl font-semibold text-green-600 mt-1">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">监控中</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">{stats.monitored}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">高风险供应商</p>
                  <p className="text-2xl font-semibold text-red-600 mt-1">{stats.highRisk}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">正式供应商列表</h1>
              <p className="text-sm text-slate-500 mt-1">
                共 {filteredSuppliers.length} 家正式供应商
              </p>
            </div>
          </div>

          {/* 筛选区域 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
            {/* 合作状态 */}
            <div className="flex items-center mb-4">
              <span className="text-sm text-slate-600 w-20 flex-shrink-0">合作状态</span>
              <div className="flex items-center flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedStatus(option)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedStatus === option
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option === '全部' ? '全部' :
                     option === 'active' ? '合作中' :
                     option === 'inactive' ? '暂停合作' : '已终止'}
                  </button>
                ))}
              </div>
            </div>

            {/* 监控状态 */}
            <div className="flex items-center mb-4">
              <span className="text-sm text-slate-600 w-20 flex-shrink-0">监控状态</span>
              <div className="flex items-center flex-wrap gap-2">
                {monitorStatusOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setSelectedMonitorStatus(option.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedMonitorStatus === option.key
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 行业分类 */}
            <div className="flex items-center">
              <span className="text-sm text-slate-600 w-20 flex-shrink-0">行业分类</span>
              <div className="flex items-center flex-wrap gap-2">
                {industryOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedIndustry(option)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedIndustry === option
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 供应商列表 */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* 表头 */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
              <div className="col-span-3">供应商信息</div>
              <div className="col-span-2">联系人</div>
              <div className="col-span-2">合作情况</div>
              <div className="col-span-1 cursor-pointer hover:text-blue-600" onClick={() => handleSort('qualityScore')}>
                <div className="flex items-center">
                  质量评分
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                </div>
              </div>
              <div className="col-span-1">风险监控</div>
              <div className="col-span-1">合作状态</div>
              <div className="col-span-2 text-right">操作</div>
            </div>

            {/* 列表内容 */}
            <div className="divide-y divide-slate-100">
              {filteredSuppliers.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">暂无正式供应商</p>
                  <p className="text-sm text-slate-400 mt-1">从备选池中将供应商转为正式供应商后，将在此显示</p>
                </div>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 transition-colors items-center"
                  >
                    {/* 供应商信息 */}
                    <div className="col-span-3">
                      <div className="flex items-start">
                        {/* Logo */}
                        <div className={`w-10 h-10 ${supplier.logoColor} rounded-lg flex items-center justify-center flex-shrink-0 mr-3`}>
                          <span className="text-white font-bold">{supplier.logo}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* 名称 */}
                          <h3 
                            className="font-medium text-slate-800 truncate cursor-pointer hover:text-blue-600"
                            onClick={() => handleOpenDetail(supplier)}
                          >
                            {supplier.name}
                          </h3>

                          {/* 行业标签 */}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                              {supplier.industry}
                            </span>
                            <RiskBadge level={supplier.riskLevel || 'low'} />
                          </div>

                          {/* 地址 */}
                          <div className="flex items-center text-xs text-slate-500 mt-1">
                            <MapPin className="w-3 h-3 mr-0.5" />
                            {supplier.address || supplier.fullAddress || supplier.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 联系人 */}
                    <div className="col-span-2">
                      <p className="text-sm text-slate-800">{supplier.contact || '-'}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {supplier.phone || supplier.contactPhone || '-'}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mt-0.5">
                        <Mail className="w-3 h-3 mr-1" />
                        {supplier.email || supplier.contactEmail || '-'}
                      </div>
                    </div>

                    {/* 合作情况 */}
                    <div className="col-span-2">
                      <p className="text-sm text-slate-600">
                        合作 {supplier.cooperationYears || 0} 年
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        累计订单 {supplier.totalOrders || 0} 笔
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        月均采购额 ¥{(supplier.monthlyAmount || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* 质量评分 */}
                    <div className="col-span-1">
                      <RatingStars score={supplier.qualityScore || 4.5} />
                    </div>

                    {/* 风险监控 */}
                    <div className="col-span-1">
                      <button
                        onClick={() => handleToggleMonitor(supplier)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          supplier.isMonitored
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={supplier.isMonitored ? '点击关闭监控' : '点击开启监控'}
                      >
                        {supplier.isMonitored ? (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>已监控</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>未监控</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* 合作状态 */}
                    <div className="col-span-1">
                      <StatusBadge status={supplier.status === 'official' ? 'active' : (supplier.status as string)} />
                    </div>

                    {/* 操作 */}
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(supplier)}
                          className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => handleRemoveSupplier(supplier)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="移出列表"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          移除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 分页 */}
          {filteredSuppliers.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-500">
                显示 1-{filteredSuppliers.length} 条，共 {filteredSuppliers.length} 条
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  上一页
                </button>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 企业详情抽屉 */}
      <CompanyDetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        company={getCompanyFromSupplier(selectedSupplier)}
      />
    </div>
  )
}
