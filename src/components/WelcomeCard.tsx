import { useNavigate } from 'react-router-dom'
import { Sparkles, AlertCircle } from 'lucide-react'

export default function WelcomeCard() {
  const navigate = useNavigate()

  return (
    <div 
      className="rounded-xl p-6 text-white"
      style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-2">欢迎回来，张经理</h1>
          <p className="text-blue-100 text-sm">
            今天是 2026年4月27日 星期一，您有 3 条待处理的风险预警和 5 个待审核的供应商申请
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/sourcing/ai')}
            className="flex items-center px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            开始AI寻源
          </button>
          <button 
            onClick={() => navigate('/risk/alerts')}
            className="flex items-center px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            查看风险预警
          </button>
        </div>
      </div>
    </div>
  )
}
