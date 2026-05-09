// 供应商备选池页面
import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  GitCompare,
  CheckSquare,
  Trash2,
  MapPin,
  Building2,
  X,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  ArrowUpDown,
  // @ts-ignore - 保留以备后用
  Star,
  ArrowRight
} from 'lucide-react'
import CompanyDetailDrawer from '../../components/CompanyDetailDrawer'
import {
  getPoolSuppliers,
  removeFromPool,
  batchPromoteToOfficial,
  Supplier,
  initSampleData
} from '../../services/supplierStorage'

// 行业分类选项
const industryOptions = ['全部', '电子元器件', '机械设备', '五金制品', '包装材料', '半导体设备', '更多']

// 地区选项
const regionOptions = ['全部', '珠三角', '长三角', '京津冀', '成渝', '更多']

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
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
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

// 供应商对比弹窗
function CompareModal({ 
  isOpen, 
  onClose, 
  suppliers 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  suppliers: Supplier[] 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-[90%] max-w-5xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">供应商对比</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {/* 对比项标题 */}
            <div className="space-y-4 text-sm text-slate-500">
              <div className="h-16"></div>
              <div className="h-10 flex items-center">匹配度</div>
              <div className="h-10 flex items-center">成立时间</div>
              <div className="h-10 flex items-center">员工规模</div>
              <div className="h-10 flex items-center">月产能</div>
              <div className="h-10 flex items-center">认证资质</div>
              <div className="h-20 flex items-center">核心优势</div>
            </div>
            {/* 供应商数据 */}
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="space-y-4 text-sm">
                <div className="h-16">
                  <div className={`w-12 h-12 ${supplier.logoColor} rounded-lg flex items-center justify-center mb-2`}>
                    <span className="text-white font-bold">{supplier.logo}</span>
                  </div>
                  <p className="font-medium text-slate-800 truncate">{supplier.name}</p>
                </div>
                <div className="h-10 flex items-center text-green-600 font-medium">{supplier.matchScore}%</div>
                <div className="h-10 flex items-center">{supplier.foundedYear}年</div>
                <div className="h-10 flex items-center">{supplier.employeeCount}</div>
                <div className="h-10 flex items-center">{supplier.monthlyCapacity}</div>
                <div className="h-10 flex items-center">
                  {supplier.certifications.join(', ')}
                </div>
                <div className="h-20 flex items-start">{supplier.coreAdvantage}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-slate-200 space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
          >
            关闭
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            导出对比报告
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SupplierPool() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('全部')
  const [selectedRegion, setSelectedRegion] = useState('全部')
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(new Set())
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [, setOpenMenuId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'matchScore' | 'addedAt'>('matchScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const menuRef = useRef<HTMLDivElement>(null)

  // 初始化时加载数据
  useEffect(() => {
    initSampleData()
    setSuppliers(getPoolSuppliers())
  }, [])

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
    setSuppliers(getPoolSuppliers())
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

    // 行业筛选
    if (selectedIndustry !== '全部') {
      result = result.filter(s => s.industry === selectedIndustry)
    }

    // 地区筛选
    if (selectedRegion !== '全部') {
      result = result.filter(s => {
        if (selectedRegion === '珠三角') return ['深圳', '东莞', '佛山', '广州', '中山'].includes(s.location)
        if (selectedRegion === '长三角') return ['上海', '苏州', '杭州', '宁波', '无锡'].includes(s.location)
        if (selectedRegion === '京津冀') return ['北京', '天津', '石家庄'].includes(s.location)
        return true
      })
    }

    // 排序
    result.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'matchScore') {
        comparison = a.matchScore - b.matchScore
      } else {
        comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [suppliers, searchValue, selectedIndustry, selectedRegion, sortBy, sortOrder])

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedSuppliers.size === filteredSuppliers.length) {
      setSelectedSuppliers(new Set())
    } else {
      setSelectedSuppliers(new Set(filteredSuppliers.map(s => s.id)))
    }
  }

  // 选择单个供应商
  const handleSelectSupplier = (id: string) => {
    const newSet = new Set(selectedSuppliers)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedSuppliers(newSet)
  }

  // 查看详情 - 打开抽屉
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const handleOpenDetail = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setDetailDrawerOpen(true)
  }

  // 将 Supplier 转换为 Company 格式（适配 CompanyDetailDrawer）
  const getCompanyFromSupplier = (supplier: Supplier | null) => {
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
      fullAddress: supplier.fullAddress || '',
      contactPhone: supplier.contactPhone || '',
      contactEmail: supplier.contactEmail || '',
      website: supplier.website || '',
      foundedYear: supplier.foundedYear,
      employeeCount: supplier.employeeCount,
      annualRevenue: supplier.annualRevenue || '',
      businessScope: supplier.businessScope || [],
      certifications: supplier.certifications,
      riskFactors: [],
      cooperationHistory: {
        totalOrders: 0,
        completedOrders: 0,
        totalAmount: '',
        lastCooperation: ''
      },
      financialStatus: {
        creditRating: '',
        paymentTerms: '',
        financialHealth: 'excellent'
      },
      mainProducts: supplier.mainProducts || [],
      productionCapacity: supplier.productionCapacity || '',
      deliveryTime: supplier.deliveryTime || '',
      ratings: {
        quality: 0,
        delivery: 0,
        service: 0,
        price: 0,
        overall: 0
      }
    }
  }

  // 批量转正
  const handleBatchApprove = () => {
    if (selectedSuppliers.size === 0) {
      addToast('请先选择供应商', 'error')
      return
    }
    
    const count = batchPromoteToOfficial([...selectedSuppliers])
    if (count > 0) {
      addToast(`已成功将 ${count} 家供应商转为正式供应商`, 'success')
      refreshSuppliers()
      setSelectedSuppliers(new Set())
    } else {
      addToast('转正失败，请重试', 'error')
    }
  }

  // 批量移除
  const handleBatchRemove = () => {
    if (selectedSuppliers.size === 0) {
      addToast('请先选择供应商', 'error')
      return
    }
    if (confirm(`确定要移除选中的 ${selectedSuppliers.size} 家供应商吗？`)) {
      let count = 0
      selectedSuppliers.forEach(id => {
        if (removeFromPool(id)) {
          count++
        }
      })
      refreshSuppliers()
      setSelectedSuppliers(new Set())
      addToast(`已成功移除 ${count} 家供应商`, 'success')
    }
  }

  // 单个转正
  const handlePromoteSingle = (supplier: Supplier) => {
    if (batchPromoteToOfficial([supplier.id]) > 0) {
      addToast(`已将 ${supplier.name} 转为正式供应商`, 'success')
      refreshSuppliers()
    } else {
      addToast('转正失败', 'error')
    }
  }

  // 打开对比
  const handleCompare = () => {
    if (selectedSuppliers.size < 2) {
      addToast('请至少选择2家供应商进行对比', 'error')
      return
    }
    if (selectedSuppliers.size > 3) {
      addToast('最多只能选择3家供应商进行对比', 'error')
      return
    }
    // 获取选中的供应商完整数据
    const selectedData = suppliers.filter(s => selectedSuppliers.has(s.id))
    // 存储到 sessionStorage
    sessionStorage.setItem('compareSuppliers', JSON.stringify(selectedData))
    // 跳转到对比页面
    navigate('/sourcing/compare')
  }

  // 导出数据
  const handleExport = () => {
    addToast('正在导出备选池数据...', 'info')
    setTimeout(() => {
      addToast('导出成功', 'success')
    }, 1500)
  }

  // 切换排序
  const handleSort = (field: 'matchScore' | 'addedAt') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // 获取选中的供应商数据
  const selectedSuppliersData = useMemo(() => {
    return suppliers.filter(s => selectedSuppliers.has(s.id))
  }, [suppliers, selectedSuppliers])

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Toast 提示 */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* 对比弹窗 */}
      <CompareModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
        suppliers={selectedSuppliersData}
      />

      {/* 顶部导航 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 面包屑 */}
          <div className="flex items-center text-sm">
            <span className="text-slate-500">采购寻源</span>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-800 font-medium">供应商备选池</span>
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

            {/* 对比按钮 */}
            <button 
              onClick={handleCompare}
              disabled={selectedSuppliers.size < 2}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                selectedSuppliers.size >= 2
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              供应商对比
              {selectedSuppliers.size > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  {selectedSuppliers.size}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="w-full">
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">供应商备选池</h1>
              <p className="text-sm text-slate-500 mt-1">
                共 {filteredSuppliers.length} 家供应商
                {selectedSuppliers.size > 0 && (
                  <span className="ml-2 text-blue-600">（已选择 {selectedSuppliers.size} 家）</span>
                )}
              </p>
            </div>

            {/* 批量操作 */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBatchApprove}
                disabled={selectedSuppliers.size === 0}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSuppliers.size > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                批量转正
              </button>
              <button 
                onClick={handleBatchRemove}
                disabled={selectedSuppliers.size === 0}
                className={`flex items-center px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                  selectedSuppliers.size > 0
                    ? 'border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                    : 'border border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                批量移除
              </button>
            </div>
          </div>

          {/* 筛选区域 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
            {/* 行业分类 */}
            <div className="flex items-center mb-4">
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

            {/* 地区 */}
            <div className="flex items-center">
              <span className="text-sm text-slate-600 w-20 flex-shrink-0">地区</span>
              <div className="flex items-center flex-wrap gap-2">
                {regionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedRegion(option)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedRegion === option
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
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={filteredSuppliers.length > 0 && selectedSuppliers.size === filteredSuppliers.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-4">供应商信息</div>
              <div className="col-span-2 cursor-pointer hover:text-blue-600" onClick={() => handleSort('matchScore')}>
                <div className="flex items-center">
                  核心优势
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                </div>
              </div>
              <div className="col-span-2">月产能</div>
              <div className="col-span-2">合作客户</div>
              <div className="col-span-1 text-right">操作</div>
            </div>

            {/* 列表内容 */}
            <div className="divide-y divide-slate-100">
              {filteredSuppliers.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">暂无符合条件的供应商</p>
                  <button 
                    onClick={() => {
                      setSearchValue('')
                      setSelectedIndustry('全部')
                      setSelectedRegion('全部')
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    清除筛选条件
                  </button>
                </div>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className={`grid grid-cols-12 gap-4 px-6 py-5 transition-colors items-center ${
                      selectedSuppliers.has(supplier.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* 复选框 */}
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.has(supplier.id)}
                        onChange={() => handleSelectSupplier(supplier.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {/* 供应商信息 */}
                    <div className="col-span-4">
                      <div className="flex items-start">
                        {/* Logo */}
                        <div className={`w-10 h-10 ${supplier.logoColor} rounded-lg flex items-center justify-center flex-shrink-0 mr-3`}>
                          <span className="text-white font-bold">{supplier.logo}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* 名称和匹配度 */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 
                              className="font-medium text-slate-800 truncate cursor-pointer hover:text-blue-600"
                              onClick={() => handleOpenDetail(supplier)}
                            >
                              {supplier.name}
                            </h3>
                            <span className="text-green-600 text-sm font-medium">匹配度 {supplier.matchScore}%</span>
                          </div>

                          {/* 认证标签 */}
                          <div className="flex items-center gap-1 mb-1">
                            {supplier.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>

                          {/* 基本信息 */}
                          <div className="flex items-center text-xs text-slate-500">
                            <span>成立于{supplier.foundedYear}年</span>
                            <span className="mx-1">·</span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-0.5" />
                              {supplier.location}
                            </span>
                            <span className="mx-1">·</span>
                            <span className="flex items-center">
                              <Building2 className="w-3 h-3 mr-0.5" />
                              员工{supplier.employeeCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 核心优势 */}
                    <div className="col-span-2">
                      <p className="text-sm text-slate-600 line-clamp-2">{supplier.coreAdvantage}</p>
                    </div>

                    {/* 月产能 */}
                    <div className="col-span-2">
                      <p className="text-sm text-slate-600">{supplier.monthlyCapacity}</p>
                    </div>

                    {/* 合作客户 */}
                    <div className="col-span-2">
                      <p className="text-sm text-slate-600 line-clamp-2">{supplier.customers}</p>
                    </div>

                    {/* 操作 */}
                    <div className="col-span-1 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePromoteSingle(supplier)}
                          className="flex items-center px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="转为正式供应商"
                        >
                          <ArrowRight className="w-3.5 h-3.5 mr-1" />
                          转正
                        </button>
                        <button 
                          onClick={() => handleOpenDetail(supplier)}
                          className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          详情
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
