// 流式文本输出组件
import { useState, useEffect } from 'react'

interface StreamingTextProps {
  text: string
  speed?: number // 每个字符的间隔时间（毫秒）
  onComplete?: () => void
}

export default function StreamingText({ text, speed = 30, onComplete }: StreamingTextProps) {
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

  // 当text变化时重置
  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
  }, [text])

  return (
    <span className="inline">
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5 animate-pulse" />
      )}
    </span>
  )
}
