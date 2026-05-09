import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react'

interface Todo {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  deadline: string
  status: 'pending' | 'completing' | 'completed'
  path: string
}

const initialTodos: Todo[] = [
  {
    id: 1,
    title: '审批供应商入驻申请',
    description: '待审批：3个',
    priority: 'high',
    deadline: '今天',
    status: 'pending',
    path: '/suppliers/official'
  },
  {
    id: 2,
    title: '处理风险预警',
    description: '需关注：2条',
    priority: 'high',
    deadline: '今天',
    status: 'pending',
    path: '/risk/alerts'
  },
  {
    id: 3,
    title: '完成月度采购报告',
    description: '截止日期：明天',
    priority: 'medium',
    deadline: '明天',
    status: 'pending',
    path: '/sourcing/list'
  },
  {
    id: 4,
    title: '更新供应商合同',
    description: '待更新：5份',
    priority: 'low',
    deadline: '本周',
    status: 'pending',
    path: '/contracts/list'
  }
]

const priorityClasses: Record<string, string> = {
  high: 'bg-red-50 text-red-600 border-red-100',
  medium: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  low: 'bg-slate-50 text-slate-600 border-slate-100',
}

const priorityLabels: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export default function TodoList() {
  const navigate = useNavigate()
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [, setCompletedId] = useState<number | null>(null)

  const pendingCount = todos.filter(t => t.status === 'pending').length

  const handleComplete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // 设置完成中状态
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, status: 'completing' } : todo
    ))

    // 模拟完成动画
    setTimeout(() => {
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, status: 'completed' } : todo
      ))
      setCompletedId(id)
      
      // 1秒后从列表移除
      setTimeout(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id))
        setCompletedId(null)
        // 显示Toast提示（简化版）
        console.log(`已完成: ${todos.find(t => t.id === id)?.title}`)
      }, 1000)
    }, 500)
  }

  const handleCardClick = (todo: Todo) => {
    if (todo.status === 'pending') {
      navigate(todo.path)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">待办事项</h3>
        <span className="text-xs text-slate-500">{pendingCount} 个待处理</span>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          {todos.map((todo) => (
            <div 
              key={todo.id} 
              onClick={() => handleCardClick(todo)}
              className={`flex items-start space-x-3 p-3 rounded-lg border border-slate-100 transition-all ${
                todo.status === 'completed' 
                  ? 'opacity-50' 
                  : 'hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <div className="mt-0.5" onClick={(e) => todo.status === 'pending' && handleComplete(todo.id, e)}>
                {todo.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : todo.status === 'completing' ? (
                  <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 cursor-pointer" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-medium ${
                    todo.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'
                  }`}>
                    {todo.title}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded border ${priorityClasses[todo.priority]}`}>
                    {priorityLabels[todo.priority]}
                  </span>
                </div>
                <p className={`text-xs ${todo.status === 'completed' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {todo.description}
                </p>
                <div className={`flex items-center mt-2 text-xs ${
                  todo.status === 'completed' ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {todo.deadline}
                </div>
              </div>
            </div>
          ))}
        </div>
        {todos.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">所有待办事项已完成</p>
          </div>
        )}
      </div>
    </div>
  )
}
