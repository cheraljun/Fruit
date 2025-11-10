/**
 * 声明页面
 * 职责：展示重要声明和使用说明
 */

import { useNavigate } from 'react-router-dom'
import MarkdownViewer from '../components/MarkdownViewer'
import '../styles/statement.css'

function StatementPage(): JSX.Element {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/')
  }

  return (
    <div className="statement-page">
      <div className="statement-container">
        <div className="statement-header">
          <button className="back-link" onClick={handleGoBack}>
            返回首页
          </button>
        </div>

        <MarkdownViewer 
          contentPath="/content/statement.md"
          className="statement-content"
        />
      </div>
    </div>
  )
}

export default StatementPage

