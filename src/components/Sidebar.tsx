import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  Brain, 
  Archive, 
  Building2, 
  AlertTriangle, 
  Shield, 
  Settings,
  ChevronDown,
  Box,
  Menu,
  User,
  LogOut,
  Bell,
  Lightbulb,
  Network,
  Map
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

interface MenuItem {
  icon: typeof Home
  label: string
  path: string
  badge?: boolean
}

interface MenuGroup {
  title?: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    items: [
      { icon: Home, label: '首页', path: '/dashboard' },
    ]
  },
  {
    title: '采购寻源',
    items: [
      { icon: Lightbulb, label: '需求洞察', path: '/sourcing/insight' },
      { icon: Brain, label: 'AI采购寻源', path: '/sourcing/ai' },
      { icon: Network, label: '产业链分析', path: '/sourcing/chain' },
    ]
  },
  {
    title: '风险监控',
    items: [
      { icon: Map, label: '风险地图', path: '/risk/map' },
      { icon: AlertTriangle, label: '风险预警', path: '/risk/alerts', badge: true },
    ]
  },
  {
    title: '供应商管理',
    items: [
      { icon: Archive, label: '备选供应商', path: '/sourcing/pool' },
      { icon: Building2, label: '正式供应商', path: '/suppliers/official' },
    ]
  },
  {
    title: '系统设置',
    items: [
      { icon: Shield, label: '权限管理', path: '/settings/permissions' },
      { icon: Settings, label: '系统配置', path: '/settings/system' },
    ]
  },
]

const userMenuItems = [
  { icon: User, label: '个人资料', path: '/profile' },
  { icon: Settings, label: '账号设置', path: '/settings/account' },
  { icon: Bell, label: '消息通知设置', path: '/settings/notifications' },
]

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const location = useLocation()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ESC键关闭用户菜单
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
  }

  return (
    <aside 
      className={`bg-white h-full flex flex-col border-r border-slate-200 transition-all duration-300 ease-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo区域 */}
      <div className={`h-16 flex items-center border-b border-slate-100 ${
        isCollapsed ? 'justify-center px-2' : 'px-5'
      }`}>
        {isCollapsed ? (
          <Box className="w-6 h-6 text-primary-600" />
        ) : (
          <>
            <Box className="w-6 h-6 text-primary-600 mr-3" />
            <span className="text-lg font-bold text-slate-800">智采云</span>
          </>
        )}
        {!isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="ml-auto p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 汉堡菜单（收起状态下显示） */}
      {isCollapsed && (
        <button 
          onClick={toggleSidebar}
          className="p-3 text-slate-400 hover:bg-slate-50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* 导航菜单 */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'px-3 py-4'}`}>
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {!isCollapsed && group.title && (
              <div className="px-3 mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {group.title}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="relative"
                  onMouseEnter={(e) => {
                    if (isCollapsed) {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setTooltip({ 
                        text: item.label, 
                        x: rect.right + 8, 
                        y: rect.top + rect.height / 2 
                      })
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      w-full flex items-center rounded-lg text-sm font-medium transition-colors
                      ${isCollapsed ? 'justify-center py-3 px-2' : 'py-2.5 px-3'}
                      ${isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${
                      location.pathname === item.path ? 'text-primary-600' : 'text-slate-500'
                    }`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </>
                    )}
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Tooltip */}
      {tooltip && isCollapsed && (
        <div 
          className="fixed z-50 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap pointer-events-none"
          style={{ 
            left: tooltip.x, 
            top: tooltip.y,
            transform: 'translateY(-50%)'
          }}
        >
          {tooltip.text}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-800"></div>
        </div>
      )}

      {/* 底部用户信息 */}
      <div className={`p-4 border-t border-slate-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div 
          ref={userMenuRef}
          className={`relative ${isCollapsed ? '' : 'flex items-center p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors'}`}
          onClick={() => !isCollapsed && setIsUserMenuOpen(!isUserMenuOpen)}
        >
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
            张
          </div>
          {!isCollapsed && (
            <>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-slate-800">张经理</div>
                <div className="text-xs text-slate-500">采购部总监</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </>
          )}

          {/* 用户下拉菜单 */}
          {isUserMenuOpen && !isCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 animate-fade-in-up">
              {userMenuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 mr-3 text-slate-400" />
                  {item.label}
                </NavLink>
              ))}
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
