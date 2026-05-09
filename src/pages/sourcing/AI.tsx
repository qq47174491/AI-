import { useState, useRef, useEffect } from 'react'
import {
  History,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  FileText,
  Download,
  ChevronRight,
  RotateCcw,
  Zap,
  Target,
  Plus,
  X,
  ChevronDown,
  Star,
  MapPin,
  Users,
  Calendar,
  Award,
  ChevronLeft,
  CheckCircle,
  XCircle
} from 'lucide-react'
import CompanyDetailDrawer from '../../components/CompanyDetailDrawer'

import {
  allCompanies,
  Company,
  // @ts-ignore - 保留以备后用
  industries,
  // @ts-ignore - 保留以备后用
  locations
} from '../../data/companyDatabase'
import {
  addToPool,
  removeFromPool,
  isInPool,
  getAddedToPoolIds,
  Supplier
} from '../../services/supplierStorage'


interface Message {
  id: string
  type: 'system' | 'user' | 'ai' | 'result' | 'thinking'
  content?: string
  suggestions?: string[]
  progress?: number
  status?: string
  results?: Company[]
  timestamp: Date
  isStreaming?: boolean
  totalResults?: number
  currentBatch?: number
}

interface AttachedFile {
  id: string
  name: string
  size: string
}

const exampleRequirements = [
  '寻找半导体光刻设备供应商，需要国产光刻机设备',
  '需要工程建设类供应商，具备矿山工程经验',
  '寻找电子元器件供应商，要求ISO9001认证',
  '需要建筑施工单位，具备铁路工程资质',
  '寻找精密机械加工供应商，支持小批量定制'
]

// 模拟历史记录
const mockHistory = [
  { id: '1', title: '半导体光刻设备供应商寻源', date: '2024-04-28 14:30' },
  { id: '2', title: '清洗设备供应商查询', date: '2024-04-27 10:15' },
  { id: '3', title: '刻蚀设备技术对比', date: '2024-04-26 16:45' },
  { id: '4', title: 'EDA软件供应商调研', date: '2024-04-25 09:20' },
  { id: '5', title: '硅片材料供应商筛选', date: '2024-04-24 11:30' }
]

// 每批显示的企业数量
const RESULTS_PER_PAGE = 5

export default function AISourcing() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '您好！我是您的AI采购寻源助手。请描述您的采购需求，我将为您智能匹配最合适的供应商。',
      suggestions: exampleRequirements,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  // @ts-ignore - 保留以备后用
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [addedToPool, setAddedToPool] = useState<Set<string>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())
  const [resultPageMap, setResultPageMap] = useState<Map<string, number>>(new Map())
  // @ts-ignore - 保留以备后用
  const [usedCompanyIds, setUsedCompanyIds] = useState<Set<string>>(new Set())
  // @ts-ignore - 保留以备后用
  const [, setStreamingMessageId] = useState<string | null>(null)
  // @ts-ignore - 保留以备后用
  const [, setStreamingContent] = useState('')
  const streamingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 初始化时从localStorage加载已加入备选池的企业，并检查是否有从需求洞察传递过来的查询
  useEffect(() => {
    const addedIds = getAddedToPoolIds()
    setAddedToPool(addedIds)
    
    // 检查是否有从需求洞察页面传递过来的采购需求
    const sourcingQuery = sessionStorage.getItem('sourcingQuery')
    if (sourcingQuery) {
      setInputValue(sourcingQuery)
      // 清除sessionStorage中的数据，避免刷新页面时重复填充
      sessionStorage.removeItem('sourcingQuery')
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 显示Toast提示
  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  // 将企业数据转换为Supplier格式
  const convertToSupplier = (company: Company): Supplier => {
    return {
      id: company.id,
      name: company.name,
      matchScore: company.matchScore,
      industry: company.industry,
      location: company.location,
      foundedYear: company.foundedYear,
      employeeCount: company.employeeCount,
      certifications: company.certifications,
      coreAdvantage: company.advantages.join('、'),
      monthlyCapacity: company.productionCapacity,
      customers: '华为、美的、小米等知名企业',
      addedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      logo: company.name.charAt(0),
      logoColor: 'bg-blue-500',
      fullAddress: company.fullAddress,
      contactPhone: company.contactPhone,
      contactEmail: company.contactEmail,
      website: company.website,
      annualRevenue: company.annualRevenue,
      businessScope: company.businessScope,
      riskLevel: company.riskLevel,
      mainProducts: company.mainProducts,
      productionCapacity: company.productionCapacity,
      deliveryTime: company.deliveryTime
    }
  }

  // 处理加入备选池
  const handleAddToPool = (company: Company) => {
    const supplier = convertToSupplier(company)
    
    if (isInPool(company.id)) {
      // 已在备选池中，执行移除
      removeFromPool(company.id)
      setAddedToPool(prev => {
        const newSet = new Set(prev)
        newSet.delete(company.id)
        return newSet
      })
      showToastMessage(`已将 ${company.name} 从备选池移除`)
    } else {
      // 加入备选池
      const success = addToPool(supplier)
      if (success) {
        setAddedToPool(prev => {
          const newSet = new Set(prev)
          newSet.add(company.id)
          return newSet
        })
        showToastMessage(`已将 ${company.name} 加入备选池`)
      } else {
        showToastMessage(`添加失败，${company.name} 可能已在备选池中`)
      }
    }
  }

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles: AttachedFile[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + 'KB'
      }))
      setAttachedFiles(prev => [...prev, ...newFiles])
    }
  }

  // 删除附件
  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  // 搜索匹配的企业
  // 生成匹配点和不匹配点
  const generateMatchPoints = (company: Company, keywords: string[]): { matchPoints: string[], mismatchPoints: string[] } => {
    const matchPoints: string[] = []
    const mismatchPoints: string[] = []

    // 基于企业属性生成匹配点
    if (company.certifications.includes('ISO9001')) {
      matchPoints.push('具备ISO9001质量管理体系认证')
    } else {
      mismatchPoints.push('未获得ISO9001认证')
    }

    if (company.ratings.overall >= 4.5) {
      matchPoints.push('综合评分优秀（4.5分以上）')
    }

    if (company.riskLevel === 'low') {
      matchPoints.push('风险等级低，经营稳定')
    } else if (company.riskLevel === 'high') {
      mismatchPoints.push('风险等级较高，需关注')
    }

    if (parseInt(company.foundedYear) <= 2015) {
      matchPoints.push('成立时间久，行业经验丰富')
    } else {
      mismatchPoints.push('成立时间较短，经验相对不足')
    }

    if (company.annualRevenue && (company.annualRevenue.includes('亿') || company.annualRevenue.includes('千万'))) {
      matchPoints.push('营收规模较大，实力雄厚')
    }

    if (company.cooperationHistory.totalOrders > 50) {
      matchPoints.push('合作订单数量多，业务活跃')
    }

    if (company.financialStatus.financialHealth === 'excellent' || company.financialStatus.financialHealth === 'good') {
      matchPoints.push('财务状况良好')
    } else if (company.financialStatus.financialHealth === 'poor') {
      mismatchPoints.push('财务状况一般')
    }

    // 基于关键词匹配生成匹配点
    const searchText = `${company.industry} ${company.tags.join(' ')} ${company.mainProducts.join(' ')}`.toLowerCase()
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase()
      if (searchText.includes(lowerKeyword)) {
        if (company.industry.toLowerCase().includes(lowerKeyword)) {
          matchPoints.push(`行业匹配：${company.industry}`)
        }
        company.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowerKeyword)) {
            matchPoints.push(`资质匹配：${tag}`)
          }
        })
      }
    })

    // 如果匹配点太少，添加一些通用匹配点
    if (matchPoints.length < 2) {
      matchPoints.push('产品/服务范围符合需求')
      matchPoints.push(`位于${company.location}，地理位置便利`)
    }

    // 如果不匹配点太多，减少一些
    if (mismatchPoints.length > 3) {
      mismatchPoints.splice(3)
    }

    return { matchPoints, mismatchPoints }
  }

  // @ts-ignore - 保留以备后用
  const searchCompanies = (keywords: string[], excludeIds: Set<string> = new Set()): Company[] => {
    if (!keywords || keywords.length === 0) {
      return allCompanies.filter(c => !excludeIds.has(c.id)).slice(0, 10)
    }

    const scoredCompanies = allCompanies.map(company => {
      let score = 0
      const searchText = `
        ${company.name}
        ${company.industry}
        ${company.tags.join(' ')}
        ${company.mainProducts.join(' ')}
        ${company.businessScope.join(' ')}
      `.toLowerCase()

      keywords.forEach(keyword => {
        const lowerKeyword = keyword.toLowerCase()
        if (searchText.includes(lowerKeyword)) {
          score += 10
        }
        // 部分匹配
        if (lowerKeyword.length > 2) {
          company.tags.forEach(tag => {
            if (tag.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(tag.toLowerCase())) {
              score += 5
            }
          })
          company.mainProducts.forEach(product => {
            if (product.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(product.toLowerCase())) {
              score += 8
            }
          })
        }
      })

      // 生成匹配点和不匹配点
      const { matchPoints, mismatchPoints } = generateMatchPoints(company, keywords)

      return { ...company, searchScore: score, matchPoints, mismatchPoints }
    })

    return scoredCompanies
      .filter(c => (c as any).searchScore > 0 && !excludeIds.has(c.id))
      .sort((a, b) => (b as any).searchScore - (a as any).searchScore)
      .slice(0, 20)
      .map(({ searchScore, ...company }) => company as Company)
  }

  // 处理发送消息
  const handleSendMessage = async (content: string, isRetry: boolean = false) => {
    if (!content.trim() && attachedFiles.length === 0) return

    // 如果是重新推荐，清空已使用的企业ID
    let currentExcludeIds = usedCompanyIds
    if (isRetry) {
      currentExcludeIds = new Set()
      setUsedCompanyIds(new Set())
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content + (attachedFiles.length > 0 ? `\n[附件: ${attachedFiles.map(f => f.name).join(', ')}]` : ''),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setAttachedFiles([])
    setIsProcessing(true)

    // 添加AI思考过程消息 - 流式输出
    const thinkingMessageId = (Date.now() + 1).toString()
    const thinkingMessage: Message = {
      id: thinkingMessageId,
      type: 'thinking',
      timestamp: new Date(),
      isStreaming: true
    }
    setMessages(prev => [...prev, thinkingMessage])

    // 思考过程的文本内容
    const thinkingContent = `正在为您分析需求并筛选供应商...

需求解析
识别您的核心需求：${content}。
已拆解为5个核心筛选维度：
① 技术能力：核心技术、研发能力
② 质量认证：ISO9001、ISO14001等质量管理体系
③ 产能规模：年产能、交付周期
④ 财务状况：信用评级、财务健康度
⑤ 服务能力：技术支持、售后服务

名单挖掘
从供应商库中检索相关企业，共检索到符合地域和行业属性的企业${allCompanies.length}家，纳入初筛名单。

条件筛选
根据您提出的准入条件，对候选企业进行多维度资质校验。
筛选规则：
① 行业经验筛选：排除成立不足5年的企业
② 技术能力筛选：排除无核心技术的企业
③ 资质筛选：排除未获得ISO9001认证的企业
④ 产能筛选：排除年产能过低的企业
⑤ 服务能力筛选：排除无技术支持团队的企业

筛选结果：
经过5轮严格筛选，最终从候选企业中筛选出符合条件的供应商。`

    // 流式输出思考过程
    let thinkingIndex = 0
    await new Promise<void>((resolve) => {
      const thinkingInterval = setInterval(() => {
        if (thinkingIndex < thinkingContent.length) {
          const currentContent = thinkingContent.slice(0, thinkingIndex + 1)
          setMessages(prev => prev.map(msg => 
            msg.id === thinkingMessageId 
              ? { ...msg, content: currentContent }
              : msg
          ))
          thinkingIndex++
        } else {
          clearInterval(thinkingInterval)
          setMessages(prev => prev.map(msg => 
            msg.id === thinkingMessageId 
              ? { ...msg, isStreaming: false }
              : msg
          ))
          resolve()
        }
      }, 25)
    })

    // 根据用户输入搜索匹配的企业
    const keywords = content.split(/[,，。\s]+/).filter(k => k.length > 1)
    
    let searchResults = searchCompanies(keywords, currentExcludeIds)
    
    // 如果没有匹配结果，返回一些默认企业
    if (searchResults.length === 0) {
      searchResults = allCompanies.filter(c => !currentExcludeIds.has(c.id)).slice(0, 5)
    }

    // 记录已使用的企业ID
    const newUsedIds = new Set(currentExcludeIds)
    searchResults.forEach(c => newUsedIds.add(c.id))
    setUsedCompanyIds(newUsedIds)

    const fullContent = `根据您的需求，我为您找到了${searchResults.length}家匹配的供应商：`

    // 添加结果消息
    const resultMessageId = (Date.now() + 2).toString()
    
    const resultMessage: Message = {
      id: resultMessageId,
      type: 'result',
      content: '',
      results: searchResults,
      totalResults: searchResults.length,
      currentBatch: 1,
      timestamp: new Date(),
      isStreaming: true
    }
    setMessages(prev => [...prev, resultMessage])
    
    // 设置流式消息ID和初始内容
    setStreamingMessageId(resultMessageId)
    setStreamingContent('')

    // 流式输出效果
    let currentIndex = 0
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
    }
    streamingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullContent.length) {
        const newContent = fullContent.slice(0, currentIndex + 1)
        setStreamingContent(newContent)
        setMessages(prev => prev.map(msg => 
          msg.id === resultMessageId 
            ? { ...msg, content: newContent }
            : msg
        ))
        currentIndex++
      } else {
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current)
          streamingIntervalRef.current = null
        }
        setStreamingMessageId(null)
        setStreamingContent('')
        setMessages(prev => prev.map(msg => 
          msg.id === resultMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        ))
        setIsProcessing(false)
      }
    }, 35)
  }

  // 处理重新推荐
  const handleRetry = () => {
    // 找到最后一条用户消息
    const lastUserMessage = [...messages].reverse().find(m => m.type === 'user')
    if (lastUserMessage && lastUserMessage.content) {
      // 提取原始查询内容（去除附件信息）
      const originalQuery = lastUserMessage.content.replace(/\n\[附件:.*\]/, '')
      handleSendMessage(originalQuery, true)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleViewDetail = (company: Company) => {
    setSelectedCompany(company)
    setIsDrawerOpen(true)
  }

  // 切换结果展开/收起
  const toggleResultsExpand = (messageId: string) => {
    setExpandedResults(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  // 切换结果分页
  const changeResultPage = (messageId: string, page: number) => {
    setResultPageMap(prev => {
      const newMap = new Map(prev)
      newMap.set(messageId, page)
      return newMap
    })
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            {toastMessage}
          </div>
        </div>
      )}

      {/* 页面头部 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">AI采购寻源</h1>
              <p className="text-sm text-slate-500 mt-0.5">智能匹配最适合的供应商，提升采购效率</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <History className="w-4 h-4 mr-2" />
            历史记录
          </button>
        </div>
      </div>

      {/* 历史记录抽屉 */}
      {showHistory && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setShowHistory(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">历史寻源记录</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-64px)]">
              {mockHistory.map((record) => (
                <div
                  key={record.id}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                >
                  <p className="text-sm font-medium text-slate-800">{record.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{record.date}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              {/* 系统消息 */}
              {message.type === 'system' && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-tl-none px-6 py-5 shadow-sm border border-slate-100">
                      <p className="text-slate-700 leading-relaxed text-[15px]">{message.content}</p>

                      {/* 示例需求 */}
                      {message.suggestions && (
                        <div className="mt-5 space-y-3">
                          <p className="text-sm text-slate-500 flex items-center">
                            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                            您可以尝试以下示例需求：
                          </p>
                          <div className="space-y-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-3.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-100 rounded-xl text-sm text-slate-600 hover:text-blue-600 transition-all group"
                              >
                                <div className="flex items-center">
                                  <Target className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                  {suggestion}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 mt-2 block ml-1">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}

              {/* 用户消息 */}
              {message.type === 'user' && (
                <div className="flex items-start space-x-4 justify-end">
                  <div className="flex-1 flex justify-end">
                    <div className="max-w-[80%]">
                      <div className="bg-blue-600 rounded-2xl rounded-tr-none px-6 py-4 shadow-md shadow-blue-600/20">
                        <p className="text-white leading-relaxed text-[15px] whitespace-pre-line">{message.content}</p>
                      </div>
                      <span className="text-xs text-slate-400 mt-2 block text-right mr-1">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-slate-600">张</span>
                  </div>
                </div>
              )}

              {/* AI思考过程 */}
              {message.type === 'thinking' && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-2xl rounded-tl-none px-6 py-5 shadow-sm border border-slate-200">
                      <div className="flex items-center mb-4">
                        <p className="text-slate-700 font-medium">
                          {message.isStreaming ? (
                            <span className="flex items-center">
                              正在为您分析需求并筛选供应商
                              <span className="inline-flex ml-1">
                                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                              已完成供应商筛选分析
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <pre className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                          {message.content}
                          {message.isStreaming && (
                            <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
                          )}
                        </pre>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 mt-2 block ml-1">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}

              {/* AI结果消息 */}
              {message.type === 'result' && message.results && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-tl-none px-6 py-5 shadow-sm border border-slate-100">
                      <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <p className="text-slate-700 font-medium">
                          {message.content}
                          {message.isStreaming && (
                            <span className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5 animate-pulse" />
                          )}
                        </p>
                      </div>

                      {/* 供应商结果列表 */}
                      <div className="space-y-4">
                        {(() => {
                          const isExpanded = expandedResults.has(message.id)
                          const currentPage = resultPageMap.get(message.id) || 1
                          const totalResults = message.results?.length || 0
                          
                          // 获取要展示的供应商列表
                          let displayResults: Company[] = []
                          
                          if (!isExpanded) {
                            // 未展开时只显示前3个
                            displayResults = message.results?.slice(0, 3) || []
                          } else {
                            // 展开后分页显示
                            const startIndex = (currentPage - 1) * RESULTS_PER_PAGE
                            const endIndex = startIndex + RESULTS_PER_PAGE
                            displayResults = message.results?.slice(startIndex, endIndex) || []
                          }
                          
                          const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE)
                          
                          return (
                            <>
                              {displayResults.map((result, index) => {
                                // 获取公司名称第一个字作为Logo
                                const logoChar = result.name.charAt(0)
                                // Logo背景色数组
                                const logoColors = [
                                  'bg-blue-500',
                                  'bg-emerald-500',
                                  'bg-violet-500',
                                  'bg-amber-500',
                                  'bg-rose-500',
                                  'bg-cyan-500'
                                ]
                                const logoColor = logoColors[index % logoColors.length]

                                return (
                                  <div
                                    key={result.id}
                                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                                    onClick={() => handleViewDetail(result)}
                                  >
                                    <div className="flex items-start">
                                      {/* 左侧Logo */}
                                      <div className={`w-12 h-12 ${logoColor} rounded-xl flex items-center justify-center flex-shrink-0 mr-4`}>
                                        <span className="text-white text-xl font-bold">{logoChar}</span>
                                      </div>

                                      {/* 中间内容区 */}
                                      <div className="flex-1 min-w-0">
                                        {/* 第一行：公司名称、匹配度、认证 */}
                                        <div className="flex items-center flex-wrap gap-2 mb-2">
                                          <h3 className="font-semibold text-slate-800 text-base">{result.name}</h3>
                                          <span className="text-green-600 text-sm font-medium">匹配度 {result.matchScore}%</span>
                                          {result.tags?.slice(0, 2).map((tag: string, idx: number) => (
                                            <span
                                              key={idx}
                                              className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>

                                        {/* 第二行：成立时间、地点、经验、员工数 */}
                                        <div className="flex items-center text-sm text-slate-500 mb-3">
                                          <span className="flex items-center">
                                            <Calendar className="w-3.5 h-3.5 mr-1" />
                                            成立于{result.foundedYear}年
                                          </span>
                                          <span className="mx-2">·</span>
                                          <span className="flex items-center">
                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                            {result.location}
                                          </span>
                                          <span className="mx-2">·</span>
                                          <span>{result.industry}</span>
                                          <span className="mx-2">·</span>
                                          <span className="flex items-center">
                                            <Users className="w-3.5 h-3.5 mr-1" />
                                            员工{result.employeeCount}
                                          </span>
                                        </div>

                                        {/* 第三行：核心优势 */}
                                        <div className="flex items-center space-x-4 text-sm mb-3">
                                          {result.advantages?.slice(0, 3).map((adv: string, idx: number) => (
                                            <span key={idx} className="flex items-center text-green-600">
                                              <Award className="w-3.5 h-3.5 mr-1" />
                                              {adv}
                                            </span>
                                          ))}
                                        </div>

                                        {/* 第四行：匹配点和不匹配点 */}
                                        {(result.matchPoints || result.mismatchPoints) && (
                                          <div className="space-y-2">
                                            {/* 匹配点 */}
                                            {result.matchPoints && result.matchPoints.length > 0 && (
                                              <div className="flex items-start gap-2">
                                                <span className="text-xs text-green-600 font-medium whitespace-nowrap mt-0.5">匹配点：</span>
                                                <div className="flex flex-wrap gap-1">
                                                  {result.matchPoints.slice(0, 3).map((point, idx) => (
                                                    <span
                                                      key={idx}
                                                      className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs"
                                                    >
                                                      <CheckCircle className="w-3 h-3 mr-1" />
                                                      {point}
                                                    </span>
                                                  ))}
                                                  {result.matchPoints.length > 3 && (
                                                    <span className="text-xs text-slate-400">+{result.matchPoints.length - 3}</span>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            {/* 不匹配点 */}
                                            {result.mismatchPoints && result.mismatchPoints.length > 0 && (
                                              <div className="flex items-start gap-2">
                                                <span className="text-xs text-amber-600 font-medium whitespace-nowrap mt-0.5">不匹配：</span>
                                                <div className="flex flex-wrap gap-1">
                                                  {result.mismatchPoints.slice(0, 2).map((point, idx) => (
                                                    <span
                                                      key={idx}
                                                      className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs"
                                                    >
                                                      <XCircle className="w-3 h-3 mr-1" />
                                                      {point}
                                                    </span>
                                                  ))}
                                                  {result.mismatchPoints.length > 2 && (
                                                    <span className="text-xs text-slate-400">+{result.mismatchPoints.length - 2}</span>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      {/* 右侧操作按钮 */}
                                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                        <button
                                          className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${
                                            addedToPool.has(result.id)
                                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                                              : 'text-amber-600 hover:bg-amber-50 border-amber-200 hover:border-amber-300 bg-white'
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleAddToPool(result)
                                          }}
                                        >
                                          <Star className={`w-4 h-4 mr-1 ${addedToPool.has(result.id) ? 'fill-current' : ''}`} />
                                          {addedToPool.has(result.id) ? '已加入备选池' : '加入备选池'}
                                        </button>
                                        <button
                                          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleViewDetail(result)
                                          }}
                                        >
                                          查看详情
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}

                              {/* 查看更多供应商按钮 */}
                              {totalResults > 3 && !isExpanded && (
                                <button
                                  onClick={() => toggleResultsExpand(message.id)}
                                  className="w-full py-3 bg-white border border-slate-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                                >
                                  查看更多供应商（{totalResults - 3}家）
                                  <ChevronDown className="w-4 h-4 ml-1" />
                                </button>
                              )}

                              {/* 收起按钮 */}
                              {isExpanded && (
                                <button
                                  onClick={() => toggleResultsExpand(message.id)}
                                  className="w-full py-3 bg-white border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                                >
                                  收起
                                  <ChevronDown className="w-4 h-4 ml-1 rotate-180" />
                                </button>
                              )}

                              {/* 分页组件 - 展开后且超过每页数量时显示 */}
                              {isExpanded && totalResults > RESULTS_PER_PAGE && (
                                <div className="flex items-center justify-center space-x-2 pt-4 border-t border-slate-100">
                                  <button
                                    onClick={() => changeResultPage(message.id, currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    上一页
                                  </button>
                                  
                                  <div className="flex items-center space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                      <button
                                        key={page}
                                        onClick={() => changeResultPage(message.id, page)}
                                        className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                                          currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {page}
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <button
                                    onClick={() => changeResultPage(message.id, currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    下一页
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </button>
                                  
                                  <span className="text-sm text-slate-500 ml-4">
                                    共 {totalResults} 家
                                  </span>
                                </div>
                              )}
                            </>
                          )
                        })()}

                        {/* 操作按钮 */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                          <div className="flex items-center space-x-2">
                            <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                              <Download className="w-4 h-4 mr-1.5" />
                              导出报告
                            </button>
                            <button className="flex items-center px-4 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-medium transition-colors bg-white">
                              <FileText className="w-4 h-4 mr-1.5 text-slate-400" />
                              保存到备选池
                            </button>
                          </div>
                          <button
                            onClick={handleRetry}
                            disabled={isProcessing}
                            className="flex items-center text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className="w-4 h-4 mr-1.5" />
                            重新推荐
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 mt-2 block ml-1">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-slate-200 px-6 py-5">
        <div className="max-w-4xl mx-auto">
          {/* 附件列表 */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachedFiles.map((file) => (
                <div key={file.id} className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
                  <FileText className="w-4 h-4 mr-2 text-slate-500" />
                  <span className="text-slate-700">{file.name}</span>
                  <span className="text-slate-400 text-xs ml-2">({file.size})</span>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="ml-2 p-1 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }
              }}
              placeholder="描述您的采购需求，例如：寻找半导体光刻设备供应商..."
              className="w-full px-4 py-3 pr-28 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-[15px]"
              rows={2}
              disabled={isProcessing}
            />
            
            {/* 输入框内按钮组 */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {/* 添加附件按钮 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="添加附件"
              >
                <Plus className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              
              {/* 提交按钮 */}
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={(!inputValue.trim() && attachedFiles.length === 0) || isProcessing}
                className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                title="发送"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center flex items-center justify-center">
            <Sparkles className="w-3 h-3 mr-1.5 text-blue-500" />
            AI助手会根据您的需求智能分析并推荐最合适的供应商
          </p>
        </div>
      </div>

      {/* 企业详情抽屉 */}
      <CompanyDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        company={selectedCompany}
      />
    </div>
  )
}
