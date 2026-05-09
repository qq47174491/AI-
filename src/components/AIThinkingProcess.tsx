// AI思考过程组件 - 流式输出版本
import { useState, useEffect } from 'react'
import { Sparkles, CheckCircle2 } from 'lucide-react'

interface ThinkingStep {
  id: number
  title: string
  content: string
  details?: string[]
}

interface AIThinkingProcessProps {
  steps?: ThinkingStep[]
  isComplete?: boolean
  isStreaming?: boolean // 是否正在流式输出
}

const defaultSteps: ThinkingStep[] = [
  {
    id: 1,
    title: '需求解析',
    content: '识别您的核心需求：半导体设备供应商，要求技术先进、质量稳定、国产替代。',
    details: [
      '已拆解为5个核心筛选维度：',
      '① 技术能力：光刻机、刻蚀机、清洗设备等核心技术',
      '② 质量认证：ISO9001、ISO14001等质量管理体系',
      '③ 产能规模：年产能、交付周期',
      '④ 财务状况：信用评级、财务健康度',
      '⑤ 服务能力：技术支持、售后服务'
    ]
  },
  {
    id: 2,
    title: '名单挖掘',
    content: '从供应商库中检索半导体设备相关企业，共检索到符合地域和行业属性的企业8家，纳入初筛名单。'
  },
  {
    id: 3,
    title: '条件筛选',
    content: '根据您提出的准入条件，对8家候选企业进行多维度资质校验。',
    details: [
      '筛选规则：',
      '① 行业经验筛选：排除成立不足5年的企业',
      '② 技术能力筛选：排除无核心技术的企业',
      '③ 资质筛选：排除未获得ISO9001认证的企业',
      '④ 产能筛选：排除年产能低于100台套的企业',
      '⑤ 服务能力筛选：排除无技术支持团队的企业',
      '',
      '筛选结果：',
      '经过5轮严格筛选，最终从8家企业中筛选出5家完全符合条件的供应商，筛选淘汰率37.5%。'
    ]
  }
]

// 流式文本组件
function StreamingText({ text, speed = 30, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      onComplete?.()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
  }, [text])

  return (
    <span className="inline">
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
      )}
    </span>
  )
}

export default function AIThinkingProcess({ 
  steps = defaultSteps, 
  isComplete = false,
  isStreaming = true 
}: AIThinkingProcessProps) {
  const [visibleStepIndex, setVisibleStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [currentStreamingStep, setCurrentStreamingStep] = useState(0)

  useEffect(() => {
    if (!isStreaming) {
      setVisibleStepIndex(steps.length)
      setCompletedSteps(new Set(steps.map(s => s.id)))
      return
    }

    // 流式显示步骤
    const showNextStep = () => {
      if (visibleStepIndex < steps.length) {
        setCurrentStreamingStep(visibleStepIndex)
        
        // 计算当前步骤内容显示完成所需时间
        const currentStep = steps[visibleStepIndex]
        const contentLength = currentStep.content.length
        const detailsLength = currentStep.details?.reduce((sum, d) => sum + d.length, 0) || 0
        const totalLength = contentLength + detailsLength
        const displayTime = Math.max(1500, totalLength * 30) // 最少1.5秒，或按字符计算

        setTimeout(() => {
          setCompletedSteps(prev => new Set([...prev, currentStep.id]))
          setVisibleStepIndex(prev => prev + 1)
        }, displayTime)
      }
    }

    if (visibleStepIndex < steps.length && !completedSteps.has(steps[visibleStepIndex].id)) {
      const timer = setTimeout(showNextStep, visibleStepIndex === 0 ? 500 : 800)
      return () => clearTimeout(timer)
    }
  }, [visibleStepIndex, steps, isStreaming, completedSteps])

  return (
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="bg-slate-50 rounded-2xl rounded-tl-none px-6 py-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-700 font-medium">
              {isComplete ? (
                <span className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  已完成供应商筛选分析
                </span>
              ) : (
                <span className="flex items-center">
                  正在为您分析需求并筛选供应商
                  <span className="inline-flex ml-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </span>
              )}
            </p>
          </div>
          
          {/* 思考步骤 - 流式展示 */}
          <div className="space-y-4">
            {steps.slice(0, visibleStepIndex).map((step, index) => (
              <div key={step.id} className="border-l-2 border-blue-200 pl-4">
                {/* 步骤标题 */}
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    {step.id}
                  </div>
                  <span className="font-semibold text-slate-800">
                    {index === currentStreamingStep && isStreaming && !completedSteps.has(step.id) ? (
                      <StreamingText text={step.title} speed={40} />
                    ) : (
                      step.title
                    )}
                  </span>
                  {completedSteps.has(step.id) && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  )}
                </div>
                
                {/* 步骤内容 - 流式显示 */}
                <div className="mt-3 ml-9">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {index === currentStreamingStep && isStreaming && !completedSteps.has(step.id) ? (
                        <StreamingText text={step.content} speed={25} />
                      ) : (
                        step.content
                      )}
                    </p>
                    
                    {/* 详细内容 - 流式显示 */}
                    {step.details && step.details.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {step.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-slate-500 leading-relaxed">
                            {index === currentStreamingStep && isStreaming && !completedSteps.has(step.id) ? (
                              <StreamingText 
                                text={detail} 
                                speed={20} 
                              />
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <span className="text-xs text-slate-400 mt-2 block ml-1">
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
