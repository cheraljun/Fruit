/**
 * 项目首页 / Landing Page
 * 职责：Twine风格的简洁首页
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MarkdownViewer from '../components/MarkdownViewer'
import wechatQR from '../assets/wechat-qr.png'
import '../styles/landing.css'

function LandingPage(): JSX.Element {
  const navigate = useNavigate()
  const [showQRCode, setShowQRCode] = useState<boolean>(false)

  const handleOnlineCreate = () => {
    navigate('/app')
  }

  const handleShowQRCode = () => {
    setShowQRCode(true)
  }

  const handleCloseQRCode = () => {
    setShowQRCode(false)
  }

  const handleViewStatement = () => {
    navigate('/statement')
  }

  return (
    <div className="landing-twine">
      <div className="landing-twine-container">
        <div className="landing-twine-logo">
          <div className="logo-text">墨水</div>
        </div>

        <MarkdownViewer 
          contentPath="/content/home.md"
          className="landing-twine-description"
        />

        <div className="landing-twine-buttons">
          <button 
            className="twine-button twine-button-primary"
            onClick={handleShowQRCode}
          >
            本地版本
          </button>
          
          <button 
            className="twine-button twine-button-secondary"
            onClick={handleOnlineCreate}
          >
            在线使用
          </button>

          <button 
            className="twine-button twine-button-tertiary"
            onClick={handleViewStatement}
          >
            重要声明
          </button>
        </div>

        <MarkdownViewer 
          contentPath="/content/version.md"
          className="landing-twine-version"
        />
      </div>

      {showQRCode && (
        <div className="qr-modal-overlay" onClick={handleCloseQRCode}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={handleCloseQRCode}>×</button>
            <h2 className="qr-modal-title">扫码加入微信群</h2>
            <p className="qr-modal-subtitle">获取本地版和技术支持</p>
            <img 
              src={wechatQR} 
              alt="微信群二维码" 
              className="qr-modal-image"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage

