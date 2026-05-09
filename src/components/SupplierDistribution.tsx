import { Building2, Factory, Truck, Cpu, ShoppingBag } from 'lucide-react'

const categories = [
  { name: '制造业', count: 128, percentage: 35, icon: Factory, color: 'bg-blue-500', textColor: 'text-blue-500' },
  { name: '贸易公司', count: 96, percentage: 26, icon: ShoppingBag, color: 'bg-green-500', textColor: 'text-green-500' },
  { name: '物流运输', count: 64, percentage: 18, icon: Truck, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  { name: 'IT科技', count: 48, percentage: 13, icon: Cpu, color: 'bg-purple-500', textColor: 'text-purple-500' },
  { name: '其他', count: 29, percentage: 8, icon: Building2, color: 'bg-slate-400', textColor: 'text-slate-400' },
]

export default function SupplierDistribution() {
  // 计算环形图的进度
  let currentDeg = 0
  const segments = categories.map((category) => {
    const startDeg = currentDeg
    const endDeg = currentDeg + (category.percentage / 100) * 360
    currentDeg = endDeg
    return {
      ...category,
      startDeg,
      endDeg
    }
  })

  return (
    <div className="bg-white rounded-xl border border-slate-100">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">供应商分布</h3>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-800">365</div>
            <div className="text-xs text-slate-500 mt-1">供应商总数</div>
          </div>
          
          {/* CSS 环形图 */}
          <div className="relative w-32 h-32">
            {/* 背景圆环 */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            
            {/* 数据段 - 使用SVG确保正确显示 */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* 背景圆 */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="8"
              />
              {/* 数据段 */}
              {segments.map((segment, index) => {
                const radius = 46
                const circumference = 2 * Math.PI * radius
                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`
                const rotation = (segments.slice(0, index).reduce((sum, s) => sum + s.percentage, 0) / 100) * 360
                
                const colorMap: Record<string, string> = {
                  'bg-blue-500': '#3b82f6',
                  'bg-green-500': '#22c55e',
                  'bg-yellow-500': '#eab308',
                  'bg-purple-500': '#a855f7',
                  'bg-slate-400': '#94a3b8',
                }
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={colorMap[segment.color]}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="butt"
                    transform={`rotate(${rotation} 50 50)`}
                  />
                )
              })}
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                <category.icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{category.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-800">{category.count}</span>
                <span className="text-xs text-slate-400 w-10 text-right">{category.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
