// 供应商备选池页面
import { useState } from 'react'
import {
  Search,
  Filter,
  GitCompare,
  CheckSquare,
  Trash2,
  Star,
  MapPin,
  Building2,
  MoreHorizontal
} from 'lucide-react'

// 模拟备选池数据
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
  addedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

const mockPoolSuppliers: PoolSupplier[] = [
  {
    id: '1',
    name: '东莞市鸿远五金制品有限公司',
    logo: '鸿',
    logoColor: 'bg-blue-500',
    matchScore: 98,
    industry: '五金制品',
    location: '东莞',
    foundedYear: '2008',
    employeeCount: '300+人',
    certifications: ['ISO9001', 'ISO14001'],
    coreAdvantage: '自主开模、精密冲压、表面处理一体化，50人研发团队',
    monthlyCapacity: '800万件/月',
    customers: '华为、美的、小米等知名企业',
    addedAt: '2024-04-28',
    status: 'pending'
  },
  {
    id: '2',
    name: '深圳市盛达五金科技有限公司',
    logo: '盛',
    logoColor: 'bg-emerald-500',
    matchScore: 95,
    industry: '五金制品',
    location: '深圳',
    foundedYear: '2010',
    employeeCount: '200+人',
    certifications: ['ISO9001', 'ISO14001'],
    coreAdvantage: '专注于精密五金零件加工，支持复杂结构定制',
    monthlyCapacity: '600万件/月',
    customers: '大疆、TCL、创维等科技企业',
    addedAt: '2024-04-27',
    status: 'pending'
  },
  {
    id: '3',
    name: '佛山市鑫源五金制品有限公司',
    logo: '鑫',
    logoColor: 'bg-violet-500',
    matchScore: 92,
    industry: '五金制品',
    location: '佛山',
    foundedYear: '2005',
    employeeCount: '400+人',
    certifications: ['ISO9001', 'ISO14001'],
    coreAdvantage: '大型五金冲压、钣金加工，拥有30台进口CNC',
    monthlyCapacity: '1200万件/月',
    customers: '格力、美的、海尔等家电企业',
    addedAt: '2024-04-26',
    status: 'pending'
  },
  {
    id: '4',
    name: '深圳市华星电子科技有限公司',
    logo: '华',
    logoColor: 'bg-amber-500',
    matchScore: 94,
    industry: '电子元器件',
    location: '深圳',
    foundedYear: '2010',
    employeeCount: '500-1000人',
    certifications: ['ISO9001', 'IATF16949'],
    coreAdvantage: '电子元器件研发与生产，半导体器件制造',
    monthlyCapacity: '500万件/月',
    customers: '比亚迪、蔚来、小鹏等汽车企业',
    addedAt: '2024-04-25',
    status: 'pending'
  },
  {
    id: '5',
    name: '东莞市精密制造有限公司',
    logo: '精',
    logoColor: 'bg-rose-500',
    matchScore: 91,
    industry: '精密加工',
    location: '东莞',
    foundedYear: '2008',
    employeeCount: '300-500人',
    certifications: ['ISO9001', 'ISO14001'],
    coreAdvantage: '精密机械加工，CNC数控加工，模具设计与制造',
    monthlyCapacity: '300万件/月',
    customers: '富士康、立讯精密等电子企业',
    addedAt: '2024-04-24',
    status: 'pending'
  }
]

// 行业分类选项
const industryOptions = ['全部', '电子元器件', '机械设备', '五金制品', '包装材料', '更多']

// 地区选项
const regionOptions = ['全部', '珠三角', '长三角', '京津冀', '成渝', '更多']

export default function SupplierPool() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('全部')
  const [selectedRegion, setSelectedRegion] = useState('全部')
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(new Set())
  const [suppliers] = useState<PoolSupplier[]>(mockPoolSuppliers)

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedSuppliers.size === suppliers.length) {
      setSelectedSuppliers(new Set())
    } else {
      setSelectedSuppliers(new Set(suppliers.map(s => s.id)))
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

  return (
    <div className="h-full flex flex-col bg-slate-50">
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
            </div>

            {/* 筛选按钮 */}
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>

            {/* 对比按钮 */}
            <button className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium">
              <GitCompare className="w-4 h-4 mr-2" />
              供应商对比
            </button>
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">供应商备选池</h1>
              <p className="text-sm text-slate-500 mt-1">共 {suppliers.length} 家供应商</p>
            </div>

            {/* 批量操作 */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                <CheckSquare className="w-4 h-4 mr-2" />
                批量转正
              </button>
              <button className="flex items-center px-4 h-9 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-medium transition-colors">
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
                  checked={selectedSuppliers.size === suppliers.length && suppliers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-4">供应商信息</div>
              <div className="col-span-2">核心优势</div>
              <div className="col-span-2">月产能</div>
              <div className="col-span-2">合作客户</div>
              <div className="col-span-1 text-right">操作</div>
            </div>

            {/* 列表内容 */}
            <div className="divide-y divide-slate-100">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 transition-colors items-center"
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
                          <h3 className="font-medium text-slate-800 truncate">{supplier.name}</h3>
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
                    <div className="flex items-center justify-end space-x-1">
                      <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-500">
              显示 1-{suppliers.length} 条，共 {suppliers.length} 条
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
        </div>
      </div>
    </div>
  )
}
