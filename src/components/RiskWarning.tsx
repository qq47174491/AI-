import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, TrendingUp, Shield, Eye, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Risk {
  id: number
  supplier: string
  risk: string
  level: 'high' | 'medium' | 'low'
  date: string
  description: string
  expanded?: boolean
}

const initialRisks: Risk[] = [
  {
    id: 1,
    supplier: '广州贸易有限公司',
    risk: '经营异常',
    level: 'high',
    date: '2024-01-15',
    description: '工商信息显示经营地址异常',
    expanded: false
  },
  {
    id: 2,
    supplier: '深圳电子科技有限公司',
    risk: '股权变更',
    level: 'medium',
    date: '2024-01-14',
    description: '近期发生大股东变更',
    expanded: false
  }
]

const levelClasses: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-red-50', text: 'text-red-600', label: '高风险' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-600', label: '中风险' },
  low: { bg: 'bg-blue-50', text: 'text-blue-600', label: '低风险' },
}

export default function RiskWarning() {
  const navigate = useNavigate()
  const [risks, setRisks] = useState<Risk[]>(initialRisks)

  const handleExpand = (id: number) => {
    setRisks(prev => prev.map(risk => 
      risk.id === id ? { ...risk, expanded: !risk.expanded } : { ...risk, expanded: false }
    ))
  }

  const handleViewSupplier = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/suppliers/detail/${id}`)
  }

  const handleMarkAsProcessed = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定要将此预警标记为已处理吗？')) {
      setRisks(prev => prev.filter(risk => risk.id !== id))
    }
  }

  const handleIgnore = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定要忽略此预警吗？')) {
      setRisks(prev => prev.filter(risk => risk.id !== id))
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-slate-800">风险预警</h3>
        </div>
        <button 
          onClick={() => navigate('/risk/alerts')}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          查看全部
        </button>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          {risks.map((risk) => (
            <div 
              key={risk.id} 
              className="rounded-lg border border-slate-100 overflow-hidden"
            >
              {/* 主要信息 */}
              <div 
                onClick={() => handleExpand(risk.id)}
                className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-800">{risk.supplier}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${levelClasses[risk.level].bg} ${levelClasses[risk.level].text}`}>
                      {levelClasses[risk.level].label}
                    </span>
                    {risk.expanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-600">{risk.risk}</span>
                </div>
                <p className="text-xs text-slate-500">{risk.description}</p>
                <div className="mt-2 text-xs text-slate-400">{risk.date}</div>
              </div>

              {/* 展开的操作按钮 */}
              {risk.expanded && (
                <div className="px-3 pb-3 border-t border-slate-100 pt-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleViewSupplier(risk.id, e)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      查看供应商
                    </button>
                    <button
                      onClick={(e) => handleMarkAsProcessed(risk.id, e)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      标记已处理
                    </button>
                    <button
                      onClick={(e) => handleIgnore(risk.id, e)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      忽略
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {risks.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无风险预警</p>
          </div>
        )}
        
        {risks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">本周风险趋势</span>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="font-medium">-15%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
