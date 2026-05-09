import { useState } from 'react'
import { Download, ChevronDown, Building2, TrendingUp, Users, FileText, Globe, Layers, Zap, Cpu, Factory } from 'lucide-react'
import CompanyDetailDrawer from '../../components/CompanyDetailDrawer'
import IndustryChainMap from '../../components/IndustryChainMap'

interface Tab {
  key: string
  label: string
}

const tabs: Tab[] = [
  { key: 'overview', label: '产业链总览' },
  { key: 'map', label: '产业链图谱' },
  { key: 'companies', label: '企业库' },
  { key: 'policy', label: '产业政策' },
  { key: 'news', label: '行业新闻' },
]

interface ChainNode {
  id: string
  name: string
  category: string
  companies: number
  growth: number
}

const chainNodes: ChainNode[] = [
  { id: '1', name: '原材料', category: '上游', companies: 45, growth: 8.5 },
  { id: '2', name: '设备制造', category: '中游', companies: 128, growth: 15.2 },
  { id: '3', name: '晶圆制造', category: '中游', companies: 32, growth: 12.3 },
  { id: '4', name: '封装测试', category: '下游', companies: 89, growth: 10.8 },
  { id: '5', name: '终端应用', category: '下游', companies: 256, growth: 18.6 },
]

interface Company {
  id: string
  name: string
  category: string
  revenue: string
  employees: string
  products: string[]
}

const companies: Company[] = [
  { id: '1', name: '北方华创科技集团', category: '设备制造', revenue: '85.6亿', employees: '8,500+', products: ['刻蚀设备', '薄膜沉积'] },
  { id: '2', name: '中微半导体', category: '设备制造', revenue: '62.3亿', employees: '3,200+', products: ['刻蚀设备', 'MOCVD'] },
  { id: '3', name: '盛美半导体', category: '设备制造', revenue: '38.9亿', employees: '1,800+', products: ['清洗设备', '电镀设备'] },
  { id: '4', name: '拓荆科技', category: '设备制造', revenue: '28.5亿', employees: '1,200+', products: ['薄膜沉积'] },
  { id: '5', name: '华海清科', category: '设备制造', revenue: '22.1亿', employees: '950+', products: ['CMP设备'] },
]

interface Policy {
  id: string
  title: string
  issuer: string
  date: string
  type: string
}

const policies: Policy[] = [
  { id: '1', title: '关于促进集成电路产业高质量发展的若干政策', issuer: '国务院', date: '2024-01-10', type: '国家政策' },
  { id: '2', title: '半导体设备进口税收优惠政策延续通知', issuer: '财政部', date: '2024-01-08', type: '财税政策' },
  { id: '3', title: '集成电路产业投资引导基金管理办法', issuer: '工信部', date: '2024-01-05', type: '产业政策' },
]

interface News {
  id: string
  title: string
  source: string
  date: string
  views: number
}

const news: News[] = [
  { id: '1', title: '国产刻蚀设备取得重大突破，5nm工艺实现量产', source: '半导体行业观察', date: '2024-01-15', views: 12580 },
  { id: '2', title: '2024年全球半导体设备市场规模预计增长8.2%', source: '国际电子商情', date: '2024-01-14', views: 8920 },
  { id: '3', title: '国内主要晶圆厂扩产计划公布，设备需求持续增长', source: '芯智讯', date: '2024-01-13', views: 7650 },
]

export default function IndustryChain() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory] = useState('半导体设备')
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company)
    setIsDetailOpen(true)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 产业链简介 */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-3">产业链简介</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          半导体产业链是一个高度复杂且技术密集的产业体系，涵盖从原材料供应、设备制造、芯片设计、晶圆制造到封装测试及终端应用的完整环节。
          当前，我国半导体产业正处于快速发展期，在政策支持、市场需求和技术创新的多重驱动下，产业链各环节都在加速国产替代进程。
        </p>
      </div>

      {/* 产业链关键环节 */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">产业链关键环节</h3>
        <div className="grid grid-cols-5 gap-4">
          {chainNodes.map((node, index) => (
            <div key={node.id} className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                  {index === 0 && <Layers className="w-5 h-5 text-blue-600" />}
                  {index === 1 && <Factory className="w-5 h-5 text-blue-600" />}
                  {index === 2 && <Cpu className="w-5 h-5 text-blue-600" />}
                  {index === 3 && <Zap className="w-5 h-5 text-blue-600" />}
                  {index === 4 && <Globe className="w-5 h-5 text-blue-600" />}
                </div>
                <h4 className="text-sm font-medium text-slate-800">{node.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{node.category}</p>
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <p className="text-lg font-bold text-blue-600">{node.companies}</p>
                  <p className="text-xs text-slate-400">家企业</p>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-green-600 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{node.growth}%</span>
                </div>
              </div>
              {index < chainNodes.length - 1 && (
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-slate-300">
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 重要企业结构 */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">重要企业结构</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 mb-3">龙头企业</h4>
            <div className="space-y-2">
              {['北方华创', '中微半导体', '盛美半导体'].map((name) => (
                <div key={name} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 mb-3">成长型企业</h4>
            <div className="space-y-2">
              {['拓荆科技', '华海清科', '芯源微'].map((name) => (
                <div key={name} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 mb-3">新兴企业</h4>
            <div className="space-y-2">
              {['微导纳米', '至纯科技', '正帆科技'].map((name) => (
                <div key={name} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCompanies = () => (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">企业名称</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">所属环节</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">主营产品</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">年营收</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">员工规模</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-800">{company.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-600">{company.category}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {company.products.map((product, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                      {product}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-slate-700">{company.revenue}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-600">{company.employees}</span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleViewCompany(company)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  详情
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderPolicy = () => (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">政策标题</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">发布机构</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">政策类型</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">发布日期</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {policies.map((policy) => (
            <tr key={policy.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-800">{policy.title}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-600">{policy.issuer}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                  {policy.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-500">{policy.date}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderNews = () => (
    <div className="space-y-4">
      {news.map((item) => (
        <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow cursor-pointer">
          <h4 className="text-base font-medium text-slate-800 mb-2">{item.title}</h4>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{item.source}</span>
            <span>{item.date}</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {item.views.toLocaleString()} 阅读
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">产业链分析</h1>
            <p className="text-sm text-slate-500 mt-1">深入了解半导体产业链结构与发展趋势</p>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <span>{selectedCategory}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          <span>导出报告</span>
        </button>
      </div>

      {/* 页签导航 */}
      <div className="bg-white rounded-xl border border-slate-100 p-1">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'companies' && renderCompanies()}
      {activeTab === 'policy' && renderPolicy()}
      {activeTab === 'news' && renderNews()}
      {activeTab === 'map' && <IndustryChainMap />}

      {/* 企业详情抽屉 */}
      <CompanyDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        company={selectedCompany ? {
          name: selectedCompany.name,
          industry: '半导体设备',
          mainProducts: selectedCompany.products,
          address: '北京市朝阳区',
          contact: {
            name: '王经理',
            phone: '010-66665555',
            email: 'wang@naura.com'
          },
          financial: {
            revenue: selectedCompany.revenue,
            profit: '2.3亿',
            employees: selectedCompany.employees,
            foundedYear: '2008'
          },
          business: {
            customers: ['中芯国际', '长江存储', '华虹集团'],
            partners: ['应用材料', '泛林集团', '东京电子'],
            certifications: ['ISO9001', 'ISO14001', '高新技术企业']
          }
        } : null}
      />
    </div>
  )
}
