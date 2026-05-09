import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Target, Archive, Building2, AlertTriangle } from 'lucide-react'

const stats = [
  {
    title: '寻源总数',
    value: '1,284',
    change: '+12.5%',
    trend: 'up',
    icon: Target,
    color: 'blue',
    subtitle: '本月新增 128 个',
    path: '/sourcing/list'
  },
  {
    title: '备选池总数',
    value: '856',
    change: '+8.2%',
    trend: 'up',
    icon: Archive,
    color: 'green',
    subtitle: '本月新增 64 个',
    path: '/sourcing/pool'
  },
  {
    title: '正式供应商',
    value: '324',
    change: '+5.3%',
    trend: 'up',
    icon: Building2,
    color: 'purple',
    subtitle: '本月新增 18 个',
    path: '/suppliers/official'
  },
  {
    title: '风险预警',
    value: '12',
    change: '-2',
    trend: 'down',
    icon: AlertTriangle,
    color: 'orange',
    subtitle: '较上周减少 2 个',
    path: '/risk/alerts?level=high'
  }
]

const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
}

export default function StatsCards() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-4 gap-6 mt-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          onClick={() => navigate(stat.path)}
          className="bg-white rounded-xl p-5 border border-slate-100 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">{stat.title}</span>
            <div className={`w-10 h-10 rounded-lg ${colorClasses[stat.color].bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${colorClasses[stat.color].icon}`} />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
            <span className={`flex items-center text-xs font-medium ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {stat.change}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  )
}
