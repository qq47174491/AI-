import { useState, useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react'

// 产业链数据结构 - 半导体设备产业链
interface ChainItem {
  id: string
  name: string
  children?: ChainItem[]
}

interface ChainCategory {
  id: string
  name: string
  items: ChainItem[]
}

const chainData: ChainCategory[] = [
  {
    id: 'material',
    name: '半导体材料工艺设备',
    items: [
      {
        id: 'wafer-production',
        name: '晶圆生产设备',
        children: [
          { id: 'crystal-growth', name: '晶体生长炉' },
          { id: 'grinding', name: '单晶硅滚磨机' },
          { id: 'polishing', name: '单晶硅抛光机' },
          { id: 'slicing', name: '单晶硅拉制设备' },
          { id: 'plasma', name: '等离子去胶机' }
        ]
      },
      { id: 'silicon-manufacturing', name: '硅片制造设备' },
      { id: 'polysilicon', name: '多晶硅生产设备' },
      { id: 'sapphire', name: '蓝宝石专用设备' },
      { id: 'sputtering', name: '溅射台' },
      { id: 'other-material', name: '其他半导体材料生产设备' }
    ]
  },
  {
    id: 'manufacturing',
    name: '半导体制造设备',
    items: [
      { id: 'etching', name: '刻蚀设备' },
      { id: 'deposition', name: '薄膜沉积设备' },
      { id: 'growth', name: '薄膜生长设备' },
      { id: 'oxidation', name: '氧化扩散设备' },
      { id: 'lithography', name: '光刻机' },
      { id: 'implantation', name: '离子注入机' },
      { id: 'high-purity', name: '高纯工艺系统' },
      { id: 'cmp', name: 'CMP设备' },
      { id: 'electroplating', name: '半导体电镀设备' },
      {
        id: 'wet-process',
        name: '半导体湿法工艺设备',
        children: [
          { id: 'coating', name: '涂胶显影设备' },
          { id: 'cleaning', name: '半导体清洗设备' }
        ]
      },
      { id: 'panel', name: '面板制造设备' },
      { id: 'production-line', name: '半导体生产线设备' },
      { id: 'other-manufacturing', name: '其他半导体制造设备' }
    ]
  },
  {
    id: 'packaging',
    name: '半导体封测设备',
    items: [
      { id: 'testing-equipment', name: '半导体检测设备' },
      {
        id: 'packaging-equipment',
        name: '半导体封装设备',
        children: [
          { id: 'led-bonding', name: 'LED固晶机' },
          { id: 'uv-curing', name: '紫外固化设备' },
          { id: 'thinning', name: '晶片减薄机' },
          { id: 'dicing', name: '晶圆划片机' },
          { id: 'wire-bonding', name: '引线键合机' },
          { id: 'molding', name: '半导体塑封机' },
          { id: 'ic-forming', name: 'IC切筋成型机' },
          { id: 'mounting', name: '贴片机' },
          { id: 'ball-planting', name: '植球机' }
        ]
      },
      {
        id: 'test-equipment',
        name: '半导体测试设备',
        children: [
          { id: 'tester', name: '半导体测试机' },
          { id: 'sorter', name: '半导体测试分选机' },
          { id: 'probe-card', name: '探针卡' },
          { id: 'probe-station', name: '探针台' }
        ]
      },
      { id: 'other-packaging', name: '其他半导体封测设备' }
    ]
  },
  {
    id: 'other',
    name: '其他半导体设备',
    items: [
      { id: 'vacuum', name: '半导体真空设备' },
      { id: 'exhaust', name: '半导体尾气处理设备' }
    ]
  }
]

export default function IndustryChainMap() {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // 放大
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2))
  }

  // 缩小
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5))
  }

  // 重置
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // 全屏
  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  // 鼠标拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)))
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
    >
      {/* 控制按钮 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="放大"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="缩小"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="重置"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={handleFullscreen}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="全屏"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      {/* 缩放比例显示 */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 bg-white rounded-lg shadow-md text-sm text-slate-600">
        {Math.round(scale * 100)}%
      </div>

      {/* 图谱内容 */}
      <div
        ref={contentRef}
        className="w-full h-full flex items-start justify-center pt-8 cursor-move"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div className="flex gap-8">
          {chainData.map((category, categoryIndex) => (
            <div key={category.id} className="flex flex-col">
              {/* 分类标题 */}
              <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg text-center min-w-[180px]">
                <h3 className="text-sm font-medium">{category.name}</h3>
              </div>
              
              {/* 连接线 */}
              {categoryIndex < chainData.length - 1 && (
                <div className="absolute right-[-16px] top-6 w-8 h-[2px] bg-slate-300" />
              )}
              
              {/* 项目列表 */}
              <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg p-3 min-w-[180px]">
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div key={item.id}>
                      {/* 主项目 */}
                      <div className={`
                        px-3 py-2 rounded text-sm text-center cursor-pointer transition-colors
                        ${item.children 
                          ? 'bg-blue-100 text-blue-700 font-medium hover:bg-blue-200' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}
                      `}>
                        {item.name}
                      </div>
                      
                      {/* 子项目 */}
                      {item.children && (
                        <div className="mt-1 ml-2 space-y-1 border-l-2 border-blue-200 pl-2">
                          {item.children.map((child) => (
                            <div
                              key={child.id}
                              className="px-2 py-1.5 rounded text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors text-center"
                            >
                              {child.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 提示文字 */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400">
        滚动鼠标滚轮缩放，拖拽移动图谱
      </div>
    </div>
  )
}
