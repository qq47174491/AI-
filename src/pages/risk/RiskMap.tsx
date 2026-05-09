import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Search, 
  Filter,
  MapPin,
  Clock,
  ChevronRight,
  X
} from 'lucide-react'

// 事件类型
interface RiskEvent {
  id: string
  title: string
  type: 'natural' | 'accident' | 'health' | 'security'
  level: 'red' | 'orange' | 'yellow' | 'blue'
  location: string
  time: string
  description: string
  affectedSuppliers: number
  status: 'active' | 'resolved'
  lng: number
  lat: number
}

// 模拟事件数据（添加经纬度坐标）
const mockEvents: RiskEvent[] = [
  {
    id: '1',
    title: '台风"海葵"登陆福建沿海',
    type: 'natural',
    level: 'red',
    location: '福建省厦门市',
    time: '2024-01-15 14:30',
    description: '台风中心附近最大风力14级，可能影响当地供应商正常生产和物流运输',
    affectedSuppliers: 12,
    status: 'active',
    lng: 118.0894,
    lat: 24.4798
  },
  {
    id: '2',
    title: '化工厂爆炸事故',
    type: 'accident',
    level: 'orange',
    location: '江苏省南京市',
    time: '2024-01-14 09:15',
    description: '某化工园区发生爆炸，已造成周边道路封闭，建议关注原料供应',
    affectedSuppliers: 5,
    status: 'active',
    lng: 118.7969,
    lat: 32.0603
  },
  {
    id: '3',
    title: '流感疫情扩散',
    type: 'health',
    level: 'yellow',
    location: '广东省深圳市',
    time: '2024-01-13 16:00',
    description: '季节性流感病例增加，部分工厂出现人员短缺',
    affectedSuppliers: 8,
    status: 'active',
    lng: 114.0579,
    lat: 22.5431
  },
  {
    id: '4',
    title: '交通管制措施',
    type: 'security',
    level: 'blue',
    location: '浙江省杭州市',
    time: '2024-01-12 08:00',
    description: '重大活动期间实施交通管制，物流运输可能延迟',
    affectedSuppliers: 3,
    status: 'active',
    lng: 120.1551,
    lat: 30.2741
  },
  {
    id: '5',
    title: '暴雨洪涝灾害',
    type: 'natural',
    level: 'orange',
    location: '湖北省武汉市',
    time: '2024-01-10 11:20',
    description: '持续暴雨导致部分地区积水，影响生产和配送',
    affectedSuppliers: 7,
    status: 'active',
    lng: 114.3054,
    lat: 30.5928
  }
]

// 事件类型配置
const eventTypeConfig = {
  all: { label: '全部', color: 'bg-slate-100 text-slate-600' },
  natural: { label: '自然灾害', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  accident: { label: '事故灾难', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  health: { label: '公共卫生', color: 'bg-green-50 text-green-600 border-green-200' },
  security: { label: '社会安全', color: 'bg-purple-50 text-purple-600 border-purple-200' }
}

// 事件等级配置
const eventLevelConfig: Record<string, { label: string; color: string; bg?: string; colorHex?: string }> = {
  all: { label: '全部', color: 'bg-slate-100 text-slate-600' },
  red: { label: '红色', color: 'bg-red-50 text-red-600 border-red-200', bg: 'bg-red-500', colorHex: '#ef4444' },
  orange: { label: '橙色', color: 'bg-orange-50 text-orange-600 border-orange-200', bg: 'bg-orange-500', colorHex: '#f97316' },
  yellow: { label: '黄色', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', bg: 'bg-yellow-500', colorHex: '#eab308' },
  blue: { label: '蓝色', color: 'bg-blue-50 text-blue-600 border-blue-200', bg: 'bg-blue-500', colorHex: '#3b82f6' }
}

// 高德地图 Key
const AMAP_KEY = '46cf6dd66570a343f4024d3739c36e0e'
const AMAP_SECURITY = 'ec926ebeebba37e87599791523ca5fdb'

export default function RiskMap() {
  const [selectedEventType, setSelectedEventType] = useState<string>('all')
  const [selectedEventLevel, setSelectedEventLevel] = useState<string>('all')
  const [selectedEvent, setSelectedEvent] = useState<RiskEvent | null>(mockEvents[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const isInitializedRef = useRef(false)

  // 筛选事件
  const filteredEvents = mockEvents.filter(event => {
    if (selectedEventType !== 'all' && event.type !== selectedEventType) return false
    if (selectedEventLevel !== 'all' && event.level !== selectedEventLevel) return false
    if (searchQuery && !event.title.includes(searchQuery) && !event.location.includes(searchQuery)) return false
    return true
  })

  // 初始化地图
  const initMap = useCallback(() => {
    if (!mapRef.current || !(window as any).AMap || isInitializedRef.current) return

    try {
      const AMap = (window as any).AMap
      
      // 创建地图实例
      const map = new AMap.Map(mapRef.current, {
        zoom: 5,
        center: [116.4074, 39.9042], // 北京中心
        viewMode: '2D',
        mapStyle: 'amap://styles/normal',
      })

      mapInstanceRef.current = map
      isInitializedRef.current = true
      setMapLoaded(true)
      setLoadError(null)

      // 添加标记点
      addMarkers(map)
    } catch (error) {
      console.error('地图初始化失败:', error)
      setLoadError('地图初始化失败，请刷新页面重试')
    }
  }, [])

  // 加载高德地图脚本
  useEffect(() => {
    // 设置安全密钥
    if (typeof window !== 'undefined') {
      (window as any)._AMapSecurityConfig = {
        securityJsCode: AMAP_SECURITY,
      }
    }

    // 检查是否已加载
    if ((window as any).AMap) {
      initMap()
      return
    }

    // 加载高德地图脚本 (使用 1.4 版本更稳定)
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${AMAP_KEY}&callback=initAMap`
    script.async = true
    
    // 错误处理
    script.onerror = () => {
      setLoadError('地图脚本加载失败，请检查网络连接')
    }
    
    document.head.appendChild(script)

    // 全局回调函数
    ;(window as any).initAMap = () => {
      // 使用 setTimeout 确保 DOM 已准备好
      setTimeout(() => {
        initMap()
      }, 100)
    }

    return () => {
      // 清理
      isInitializedRef.current = false
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy()
        } catch (e) {
          console.error('销毁地图失败:', e)
        }
        mapInstanceRef.current = null
      }
    }
  }, [initMap])

  // 添加标记点
  const addMarkers = (map: any) => {
    const AMap = (window as any).AMap
    if (!AMap || !map) return

    // 清除现有标记
    markersRef.current.forEach(marker => {
      try {
        marker.setMap(null)
      } catch (e) {
        // 忽略已移除的标记错误
      }
    })
    markersRef.current = []

    filteredEvents.forEach(event => {
      // 创建标记内容
      const markerContent = document.createElement('div')
      markerContent.className = 'risk-marker'
      const isSelected = selectedEvent?.id === event.id
      markerContent.innerHTML = `
        <div style="
          width: ${isSelected ? '24px' : '16px'};
          height: ${isSelected ? '24px' : '16px'};
          background-color: ${eventLevelConfig[event.level].colorHex};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 ${eventLevelConfig[event.level].colorHex}80; }
            70% { box-shadow: 0 0 0 10px ${eventLevelConfig[event.level].colorHex}00; }
            100% { box-shadow: 0 0 0 0 ${eventLevelConfig[event.level].colorHex}00; }
          }
        </style>
      `

      try {
        // 创建标记
        const marker = new AMap.Marker({
          position: [event.lng, event.lat],
          content: markerContent,
          offset: new AMap.Pixel(-12, -12),
          extData: event
        })

        // 点击事件
        marker.on('click', () => {
          setSelectedEvent(event)
          // 移动地图中心到标记位置
          map.setCenter([event.lng, event.lat])
          map.setZoom(8)
        })

        marker.setMap(map)
        markersRef.current.push(marker)
      } catch (e) {
        console.error('创建标记失败:', e)
      }
    })
  }

  // 当筛选条件或选中事件改变时，更新标记
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      addMarkers(mapInstanceRef.current)
    }
  }, [filteredEvents, selectedEvent, mapLoaded])

  // 处理事件列表点击
  const handleEventClick = (event: RiskEvent) => {
    setSelectedEvent(event)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter([event.lng, event.lat])
      mapInstanceRef.current.setZoom(10)
    }
  }

  return (
    <div className="h-[calc(100vh-64px-48px)] flex -m-6">
      {/* 左侧事件列表面板 */}
      <div className="w-[360px] bg-white border-r border-slate-200 flex flex-col z-10">
        {/* 面板头部 */}
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">风险事件列表</h2>
          
          {/* 事件类型筛选 */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(eventTypeConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedEventType(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    selectedEventType === key 
                      ? 'bg-primary-50 text-primary-600 border-primary-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* 事件等级筛选 */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(eventLevelConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedEventLevel(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    selectedEventLevel === key 
                      ? 'bg-primary-50 text-primary-600 border-primary-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* 时间范围筛选 */}
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="开始时间"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date" 
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="结束时间"
            />
          </div>
        </div>

        {/* 事件列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${
                selectedEvent?.id === event.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${eventLevelConfig[event.level].color}`}>
                    {eventLevelConfig[event.level].label}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${eventTypeConfig[event.type].color}`}>
                    {eventTypeConfig[event.type].label}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-800 mb-1">{event.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {event.time}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">{event.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  影响供应商: <span className="font-medium text-slate-700">{event.affectedSuppliers}</span> 家
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧地图区域 */}
      <div className="flex-1 relative">
        {/* 顶部搜索栏 */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-3">
          <div className="flex-1 max-w-md bg-white rounded-lg shadow-sm border border-slate-200 flex items-center px-4 py-2">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索事件、供应商、物料名称"
              className="flex-1 ml-3 text-sm outline-none bg-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>

        {/* 高德地图容器 */}
        <div 
          ref={mapRef}
          className="w-full h-full"
          style={{ background: '#f0f2f5' }}
        >
          {!mapLoaded && !loadError && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500">地图加载中...</p>
              </div>
            </div>
          )}
          
          {loadError && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-500 text-lg mb-2">⚠️</div>
                <p className="text-slate-600">{loadError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  刷新页面
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 选中事件的信息卡片 - 悬浮在地图上 */}
        {selectedEvent && mapLoaded && (
          <div className="absolute top-20 left-4 z-10 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-4 animate-fade-in-up">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${eventLevelConfig[selectedEvent.level].color}`}>
                  {eventLevelConfig[selectedEvent.level].label}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${eventTypeConfig[selectedEvent.type].color}`}>
                  {eventTypeConfig[selectedEvent.type].label}
                </span>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-base font-semibold text-slate-800 mb-2">{selectedEvent.title}</h4>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedEvent.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedEvent.time}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-3">{selectedEvent.description}</p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                影响 <span className="font-semibold text-slate-700">{selectedEvent.affectedSuppliers}</span> 家供应商
              </span>
              <button className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
                查看详情
              </button>
            </div>
          </div>
        )}

        {/* 图例 */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-sm border border-slate-200 p-3 z-10">
          <h4 className="text-xs font-medium text-slate-700 mb-2">风险等级</h4>
          <div className="space-y-1.5">
            {Object.entries(eventLevelConfig).filter(([key]) => key !== 'all').map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.colorHex }}
                ></span>
                <span className="text-xs text-slate-600">{config.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm border border-slate-200 p-3 z-10">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-slate-500">活跃事件</p>
              <p className="text-lg font-semibold text-slate-800">{mockEvents.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">受影响供应商</p>
              <p className="text-lg font-semibold text-slate-800">
                {mockEvents.reduce((sum, e) => sum + e.affectedSuppliers, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">高风险事件</p>
              <p className="text-lg font-semibold text-red-600">
                {mockEvents.filter(e => e.level === 'red' || e.level === 'orange').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
