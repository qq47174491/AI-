import { useNavigate } from 'react-router-dom'
import { FileText, UserPlus, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'sourcing',
    title: '完成新的采购寻源',
    description: '完成了"办公用品采购项目"的供应商寻源',
    time: '10分钟前',
    icon: FileText,
    color: 'blue',
    path: '/sourcing/detail/1'
  },
  {
    id: 2,
    type: 'supplier',
    title: '新增供应商',
    description: '"深圳市科技有限公司"已通过审核加入备选池',
    time: '1小时前',
    icon: UserPlus,
    color: 'green',
    path: '/suppliers/detail/2'
  },
  {
    id: 3,
    type: 'risk',
    title: '风险预警',
    description: '检测到"广州贸易有限公司"存在经营异常',
    time: '2小时前',
    icon: AlertCircle,
    color: 'red',
    path: '/risk/detail/3'
  },
  {
    id: 4,
    type: 'approval',
    title: '合同审批通过',
    description: '"年度IT设备采购合同"已审批通过',
    time: '3小时前',
    icon: CheckCircle,
    color: 'purple',
    path: '/contracts/detail/4'
  },
  {
    id: 5,
    type: 'sourcing',
    title: '完成新的采购寻源',
    description: '完成了"生产设备采购项目"的供应商寻源',
    time: '5小时前',
    icon: FileText,
    color: 'blue',
    path: '/sourcing/detail/5'
  }
]

const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
  red: { bg: 'bg-red-50', icon: 'text-red-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
}

export default function RecentActivity() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border border-slate-100">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">最近动态</h3>
        <button 
          onClick={() => navigate('/notifications')}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          查看全部
        </button>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              onClick={() => navigate(activity.path)}
              className="flex items-start space-x-3 cursor-pointer hover:bg-slate-50 rounded-lg p-2 -mx-2 transition-colors group"
            >
              <div className={`w-8 h-8 rounded-lg ${colorClasses[activity.color].bg} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-4 h-4 ${colorClasses[activity.color].icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                  <div className="flex items-center">
                    <span className="text-xs text-slate-400">{activity.time}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
