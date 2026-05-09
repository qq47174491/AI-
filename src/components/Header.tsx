import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, HelpCircle, Settings, CheckCircle } from 'lucide-react'

const notifications = [
  {
    id: 1,
    title: '供应商入驻申请待审批',
    description: '深圳市科技有限公司提交了入驻申请',
    time: '10分钟前',
    type: 'business',
    unread: true,
  },
  {
    id: 2,
    title: '月度报告已生成',
    description: '您的月度采购报告已生成，请及时查看',
    time: '2小时前',
    type: 'system',
    unread: false,
  },
  {
    id: 3,
    title: '风险预警提醒',
    description: '检测到供应商存在经营异常风险',
    time: '3小时前',
    type: 'risk',
    unread: true,
  },
]

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'system', label: '系统' },
  { id: 'business', label: '业务' },
  { id: 'risk', label: '风险' },
]

export default function Header() {
  const navigate = useNavigate()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => n.unread).length

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab)

  // 点击外部关闭通知弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    // 标记已读逻辑
    console.log('标记已读:', id)
  }

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // 标记已读并跳转
    console.log('点击通知:', notification)
    setIsNotificationOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchFocused(false)
    }
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="text-sm font-medium text-slate-800">
        首页
      </div>

      <div className="flex items-center space-x-4">
        {/* 搜索框 */}
        <div className="relative">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索供应商、采购订单..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-72 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </form>

          {/* 搜索建议下拉 */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-100 py-2 z-50">
              <div className="px-3 py-1.5 text-xs text-slate-400 uppercase">最近搜索</div>
              <button 
                onClick={() => { setSearchQuery('办公用品'); navigate('/search?q=办公用品') }}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                办公用品采购
              </button>
              <button 
                onClick={() => { setSearchQuery('深圳科技'); navigate('/search?q=深圳科技') }}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                深圳科技有限公司
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <div className="px-3 py-1.5 text-xs text-slate-400 uppercase">热门搜索</div>
              <button 
                onClick={() => { setSearchQuery('年度采购'); navigate('/search?q=年度采购') }}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
              >
                <span className="text-orange-500 mr-2">🔥</span> 年度采购计划
              </button>
            </div>
          )}
        </div>

        {/* 通知图标 */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* 通知中心弹窗 */}
          {isNotificationOpen && (
            <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-100 z-50 origin-top-right animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-slate-800">通知中心</h3>
                  <span className="text-xs text-slate-500">({unreadCount})</span>
                </div>
                <button 
                  onClick={() => navigate('/settings/notifications')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* 标签筛选 */}
              <div className="flex border-b border-slate-100">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id 
                        ? 'text-primary-600 border-b-2 border-primary-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 通知列表 */}
              <div className="max-h-80 overflow-y-auto">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-b-0 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.unread ? 'bg-primary-500' : 'bg-transparent border border-slate-300'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                          {notification.unread && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-primary-600 transition-opacity"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 truncate">{notification.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-slate-100">
                <button 
                  onClick={() => { navigate('/notifications'); setIsNotificationOpen(false) }}
                  className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  查看全部通知
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
