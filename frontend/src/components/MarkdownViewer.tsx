/**
 * Markdown 渲染组件
 * 职责：加载并渲染 markdown 文件内容
 */

import { useState, useEffect } from 'react'
import { marked } from 'marked'
import '../styles/markdown-viewer.css'

interface MarkdownViewerProps {
  contentPath: string
  className?: string
}

export default function MarkdownViewer({ contentPath, className = '' }: MarkdownViewerProps): JSX.Element {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(contentPath)
        
        if (!response.ok) {
          throw new Error(`无法加载内容: ${response.statusText}`)
        }
        
        const text = await response.text()
        const html = await marked.parse(text)
        setContent(html)
      } catch (err) {
        console.error('加载 Markdown 失败:', err)
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    loadMarkdown()
  }, [contentPath])

  if (loading) {
    return <div className={`markdown-viewer ${className}`}>加载中...</div>
  }

  if (error) {
    return <div className={`markdown-viewer ${className}`}>错误: {error}</div>
  }

  return (
    <div 
      className={`markdown-viewer ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

