import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Upload, FileText, X, History, Sparkles, Lightbulb, 
  Clock,
  Search, FileSpreadsheet, FileImage, CheckCircle2,
  Download,
  Zap, AlertCircle, CheckCircle, AlertTriangle,
  FileSearch, Shield, DollarSign
} from 'lucide-react'

interface HistoryItem {
  id: string
  query: string
  timestamp: string
  hasAttachment: boolean
  status: 'completed' | 'analyzing'
}

const mockHistory: HistoryItem[] = [
  { id: '1', query: '分析半导体设备采购需求', timestamp: '2024-01-15 10:30', hasAttachment: true, status: 'completed' },
  { id: '2', query: '2024年Q1采购预算规划', timestamp: '2024-01-14 16:45', hasAttachment: false, status: 'completed' },
  { id: '3', query: '刻蚀设备供应商对比分析', timestamp: '2024-01-13 09:20', hasAttachment: true, status: 'completed' },
]

// 需求结构化拆解数据
const requirementStructure = {
  category: { label: '采购品类', value: '办公笔记本电脑、台式计算机、打印机、办公桌椅' },
  quantity: { label: '采购数量', value: '笔记本电脑100台、台式机50台、打印机20台、办公桌椅60套' },
  budget: { label: '预算范围', value: '总预算：1,200,000元，其中电脑类预算占比75%' },
  qualifications: { 
    label: '资质要求', 
    value: '供应商需具备IT设备经销资质、近3年同类项目经验、ISO9001认证'
  },
  quality: { 
    label: '质量要求', 
    value: '所有设备需提供原厂正品证明，整机保修至少3年，7*24小时技术支持'
  },
  delivery: { 
    label: '交付要求', 
    value: '合同签订后15天内完成所有设备的配送、安装与调试，交付地点为公司总部及3个分公司'
  }
}

// 需求合理性校验数据
const validationResults = {
  price: {
    label: '价格合理性',
    status: 'pass' as const,
    title: '符合市场行情',
    description: '本次采购预算单价与近6个月同类产品市场平均价格偏差在±5%以内，价格设定合理。'
  },
  quantity: {
    label: '数量合理性',
    status: 'pass' as const,
    title: '匹配人员编制',
    description: '采购数量与公司现有员工规模及新入职计划匹配，没有明显的过量或不足情况。'
  },
  delivery: {
    label: '交付周期合理性',
    status: 'warning' as const,
    title: '存在一定压力',
    description: '15天的交付周期包含多地点配送安装，相对紧张，建议与供应商明确约定分批次交付节点，避免整体延误。'
  },
  qualification: {
    label: '资质要求合理性',
    status: 'pass' as const,
    title: '符合行业标准',
    description: '要求的供应商资质与项目规模匹配，不会导致合格供应商过少或过多，有利于充分竞争。'
  },
  overallScore: 4.8,
  overallComment: '需求整体较为合理，仅交付周期存在轻微风险，可进入下一环节。'
}

// 需求待优化点数据
const optimizationPoints = [
  {
    icon: 'tech',
    title: '技术参数描述不够具体',
    description: '需求中对电脑的具体配置参数描述较为模糊，建议明确CPU、内存、硬盘等核心参数的数量要求，避免供应商报价差异过大。'
  },
  {
    icon: 'standard',
    title: '缺少验收标准条款',
    description: '需求中未明确设备到货后的验收流程和标准，建议补充开箱检验、性能测试、试运行等验收环节的具体要求。'
  },
  {
    icon: 'payment',
    title: '付款方式可进一步优化',
    description: '当前付款方式为预付30%，建议调整为预付10%+到货验收合格后付80%+质保期满付10%，降低公司资金风险。'
  }
]

// 采购策略推荐数据
const procurementStrategies = {
  supplier: {
    title: '供应商选择策略',
    items: [
      '优先选择同时具备电脑和办公家具供应能力的集成供应商，减少供应商管理成本',
      '优先考虑本地供应商，保障售后服务响应速度',
      '要求供应商提供近3年同类项目案例不少于3个，且客户评价良好'
    ]
  },
  price: {
    title: '价格谈判策略',
    items: [
      '批量采购可争取12%-15%的价格优惠，预期可节省预算约15-18万元',
      '可与供应商协商将质保期从3年延长至5年，增加采购价值',
      '要求供应商免费提供1次全员设备使用培训服务'
    ]
  },
  risk: {
    title: '风险应对策略',
    items: [
      '针对交付周期紧张的问题，可与供应商约定分批次交付，首批设备到货时间不晚于合同签订后7天',
      '合同中明确延迟交付违约金条款，每延迟1天扣除合同总金额的0.1%',
      '选择1-2家备选供应商，应对主供应商可能出现的供应问题'
    ]
  }
}

export default function DemandInsight() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory)
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'result'>('upload')
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 构建采购需求文本
  const buildSourcingQuery = () => {
    const parts = [
      `采购品类：${requirementStructure.category.value}`,
      `采购数量：${requirementStructure.quantity.value}`,
      `预算范围：${requirementStructure.budget.value}`,
      `资质要求：${requirementStructure.qualifications.value}`,
      `质量要求：${requirementStructure.quality.value}`,
      `交付要求：${requirementStructure.delivery.value}`
    ]
    return parts.join('；')
  }

  // 处理开始寻源
  const handleStartSourcing = () => {
    const sourcingQuery = buildSourcingQuery()
    // 将需求存储到 sessionStorage，以便在AI采购寻源页面读取
    sessionStorage.setItem('sourcingQuery', sourcingQuery)
    // 跳转到AI采购寻源页面
    navigate('/sourcing/ai')
  }

  // 模拟分析进度
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 2
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isAnalyzing])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!query.trim() && files.length === 0) return

    setIsAnalyzing(true)
    setCurrentStep('analyzing')
    setAnalysisProgress(0)
    
    await new Promise(resolve => setTimeout(resolve, 5000))

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      query: query || '文件分析',
      timestamp: new Date().toLocaleString('zh-CN'),
      hasAttachment: files.length > 0,
      status: 'completed'
    }
    setHistory(prev => [newHistoryItem, ...prev])

    setIsAnalyzing(false)
    setCurrentStep('result')
    setFiles([])
    setQuery('')
  }

  const handleHistoryClick = (item: HistoryItem) => {
    setQuery(item.query)
    setShowHistory(false)
    if (item.status === 'completed') {
      setCurrentStep('result')
    }
  }

  const handleNewAnalysis = () => {
    setCurrentStep('upload')
    setQuery('')
    setFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['pdf'].includes(ext || '')) return <FileText className="w-5 h-5 text-red-500" />
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-5 h-5 text-blue-500" />
    if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="w-5 h-5 text-green-500" />
    if (['png', 'jpg', 'jpeg'].includes(ext || '')) return <FileImage className="w-5 h-5 text-purple-500" />
    return <FileText className="w-5 h-5 text-slate-500" />
  }

  const getValidationIcon = (status: 'pass' | 'warning' | 'error') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getOptimizationIcon = (type: string) => {
    switch (type) {
      case 'tech':
        return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><FileSearch className="w-5 h-5 text-blue-600" /></div>
      case 'standard':
        return <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"><Shield className="w-5 h-5 text-purple-600" /></div>
      case 'payment':
        return <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-600" /></div>
      default:
        return <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Lightbulb className="w-5 h-5 text-slate-600" /></div>
    }
  }

  // 初始状态 - 文件上传
  const renderUploadState = () => (
    <div className="flex-1 flex flex-col">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">需求洞察</h1>
          <p className="text-sm text-slate-500 mt-1">上传采购需求文档，AI智能解析并推荐供应商</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <History className="w-4 h-4" />
          <span>历史记录</span>
        </button>
      </div>

      {/* 上传区域 */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-8">
        <div className="max-w-3xl mx-auto">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
          >
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">点击或拖拽文件到此处上传</h3>
            <p className="text-sm text-slate-500 mb-6">支持 PDF、Word、Excel、图片格式，单个文件不超过 50MB</p>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-full flex items-center gap-1">
                <FileText className="w-3 h-3" /> PDF
              </span>
              <span className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-full flex items-center gap-1">
                <FileText className="w-3 h-3" /> Word
              </span>
              <span className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-full flex items-center gap-1">
                <FileSpreadsheet className="w-3 h-3" /> Excel
              </span>
              <span className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-full flex items-center gap-1">
                <FileImage className="w-3 h-3" /> 图片
              </span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />

          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="text-sm font-medium text-slate-700">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="补充描述您的采购需求（可选），例如：需要采购什么设备、预算范围、交付时间要求等..."
              className="w-full p-4 text-sm text-slate-700 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px]"
              rows={4}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={files.length === 0 && !query.trim()}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            <span>开始智能解析</span>
          </button>
        </div>
      </div>
    </div>
  )

  // 解析中状态
  const renderAnalyzingState = () => (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
            style={{ animationDuration: '1s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-2">AI正在解析您的需求...</h3>
        <p className="text-sm text-slate-500 mb-8">预计需要 10-30 秒，请稍候</p>

        <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
        <p className="text-sm text-slate-400">{analysisProgress}%</p>

        <div className="mt-8 space-y-3 text-left">
          {[
            { label: '识别文档内容', threshold: 20 },
            { label: '提取关键需求信息', threshold: 40 },
            { label: '分析市场行情', threshold: 60 },
            { label: '匹配推荐供应商', threshold: 80 }
          ].map((step, index) => (
            <div key={index} className={`flex items-center gap-3 ${analysisProgress >= step.threshold ? 'text-slate-700' : 'text-slate-400'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${analysisProgress >= step.threshold ? 'bg-green-100 text-green-600' : 'bg-slate-100'}`}>
                {analysisProgress >= step.threshold ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
              </div>
              <span className="text-sm">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 解析结果状态 - 严格按照设计稿
  const renderResultState = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 页面头部 - 严格按照设计稿 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">AI需求洞察</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">解析成功</span>
          </div>
          <span className="text-sm text-slate-500">解析完成时间：2024-05-20 15:32</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>导出分析报告</span>
          </button>
          <button 
            onClick={handleStartSourcing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>开始寻源</span>
          </button>
        </div>
      </div>

      {/* 文件信息提示 */}
      <div className="mb-6 text-sm text-slate-600">
        基于上传的《2024年第二季度办公设备采购需求》文件，AI已完成需求分析与策略推荐
      </div>

      {/* 结果内容区域 */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-6">
          
          {/* 需求结构化拆解模块 - 严格按照设计稿 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-base font-semibold text-slate-800">需求结构化拆解</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* 采购品类 */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">{requirementStructure.category.label}</p>
                <p className="text-sm font-medium text-slate-800">{requirementStructure.category.value}</p>
              </div>
              
              {/* 采购数量 */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">{requirementStructure.quantity.label}</p>
                <p className="text-sm font-medium text-slate-800">{requirementStructure.quantity.value}</p>
              </div>
              
              {/* 预算范围 */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">{requirementStructure.budget.label}</p>
                <p className="text-sm font-medium text-slate-800">{requirementStructure.budget.value}</p>
              </div>
              
              {/* 资质要求 */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">{requirementStructure.qualifications.label}</p>
                <p className="text-sm font-medium text-slate-800">{requirementStructure.qualifications.value}</p>
              </div>
              
              {/* 质量要求 */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">{requirementStructure.quality.label}</p>
                <p className="text-sm font-medium text-slate-800">{requirementStructure.quality.value}</p>
              </div>
              
              {/* 交付要求 */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">{requirementStructure.delivery.label}</p>
                <p className="text-sm font-medium text-slate-800">{requirementStructure.delivery.value}</p>
              </div>
            </div>
          </div>

          {/* 需求合理性校验模块 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-base font-semibold text-slate-800">需求合理性校验</h3>
            </div>
            
            <div className="space-y-4">
              {/* 价格合理性 */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                {getValidationIcon(validationResults.price.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-800">{validationResults.price.label}：</span>
                    <span className="text-sm font-medium text-green-600">{validationResults.price.title}</span>
                  </div>
                  <p className="text-sm text-slate-500">{validationResults.price.description}</p>
                </div>
              </div>

              {/* 数量合理性 */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                {getValidationIcon(validationResults.quantity.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-800">{validationResults.quantity.label}：</span>
                    <span className="text-sm font-medium text-green-600">{validationResults.quantity.title}</span>
                  </div>
                  <p className="text-sm text-slate-500">{validationResults.quantity.description}</p>
                </div>
              </div>

              {/* 交付周期合理性 */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                {getValidationIcon(validationResults.delivery.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-800">{validationResults.delivery.label}：</span>
                    <span className="text-sm font-medium text-amber-600">{validationResults.delivery.title}</span>
                  </div>
                  <p className="text-sm text-slate-500">{validationResults.delivery.description}</p>
                </div>
              </div>

              {/* 资质要求合理性 */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                {getValidationIcon(validationResults.qualification.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-800">{validationResults.qualification.label}：</span>
                    <span className="text-sm font-medium text-green-600">{validationResults.qualification.title}</span>
                  </div>
                  <p className="text-sm text-slate-500">{validationResults.qualification.description}</p>
                </div>
              </div>
            </div>

            {/* 整体合理性评分 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">整体合理性评分：</span>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= Math.round(validationResults.overallScore) ? 'text-amber-400' : 'text-slate-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg font-bold text-blue-600">{validationResults.overallScore}</span>
                    <span className="text-sm text-slate-400">/5.0</span>
                  </div>
                </div>
                <div className="flex-1 text-sm text-slate-600">
                  {validationResults.overallComment}
                </div>
              </div>
            </div>
          </div>

          {/* 需求待优化点模块 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-base font-semibold text-slate-800">需求待优化点</h3>
            </div>
            
            <div className="space-y-4">
              {optimizationPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  {getOptimizationIcon(point.icon)}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-800 mb-1">{point.title}</h4>
                    <p className="text-sm text-slate-500">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 采购策略推荐模块 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-base font-semibold text-slate-800">采购策略推荐</h3>
            </div>
            
            <div className="space-y-6">
              {/* 供应商选择策略 */}
              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-3">{procurementStrategies.supplier.title}</h4>
                <ul className="space-y-2">
                  {procurementStrategies.supplier.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 价格谈判策略 */}
              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-3">{procurementStrategies.price.title}</h4>
                <ul className="space-y-2">
                  {procurementStrategies.price.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 风险应对策略 */}
              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-3">{procurementStrategies.risk.title}</h4>
                <ul className="space-y-2">
                  {procurementStrategies.risk.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="flex items-center justify-between pt-4 pb-2">
            <button
              onClick={handleNewAnalysis}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>重新上传文件</span>
            </button>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>导出分析报告</span>
              </button>
              <button 
                onClick={handleStartSourcing}
                className="flex items-center gap-2 px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>开始寻源</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-[calc(100vh-120px)] flex">
      <div className="flex-1 flex flex-col min-w-0">
        {currentStep === 'upload' && renderUploadState()}
        {currentStep === 'analyzing' && renderAnalyzingState()}
        {currentStep === 'result' && renderResultState()}
      </div>

      {/* 右侧历史记录面板 */}
      {showHistory && (
        <div className="w-80 ml-6 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-medium text-slate-800">历史记录</h3>
              <button 
                onClick={() => setShowHistory(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100%-60px)]">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleHistoryClick(item)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-start gap-2">
                    {item.hasAttachment ? (
                      <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Search className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{item.query}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
