/**
 * 项目首页 / Landing Page
 * 职责：展示项目介绍、特点、社区入口
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import wechatQR from '../assets/wechat-qr.png'
import '../styles/landing.css'

function LandingPage(): JSX.Element {
  const navigate = useNavigate()

  const handleStartCreating = () => {
    navigate('/app')
  }

  return (
    <div className="landing">
      <div className="landing-container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title-inline">
            免费好用的互动小说编辑器
          </h1>
        </section>

        {/* Community Section */}
        <section className="community-section">
          <div className="qr-container">
            <img 
              src={wechatQR} 
              alt="微信群二维码" 
              className="qr-code"
            />
          </div>
        </section>

        {/* Description Section */}
        <section className="description-section">
          <div className="description-card">
            <p className="description-text">
            免费的在线互动小说编辑器，让创作变得简单的可视化工具。拖拽节点，连线成故事，像搭积木一样连接剧情节点，让想象力自由流动。无论你想写幻想冒险、恋爱养成、互动绘本还是文字AVG，这里都能实现。
            <br/>
            <span style={{ display: 'block', textAlign: 'center', color: '#dc2626', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}><strong>重要声明</strong></span>
            本编辑器完全免费开放使用，由开发者利用业余时间维护更新。由于项目还在持续开发中，功能迭代较快，底层数据结构可能会有较大调整。
            <br/>
            为了避免你的心血白费 (´･ω･`)，<strong>强烈建议只在游客模式下随便玩玩、体验测试功能</strong>，请不要在在线版本投入实际创作。
            <br/>
            如果你想认真写作品，建议扫码加群获取<strong>本地部署的开发版</strong>。本地版的所有数据都存在你自己的电脑里，完全由你掌控，不会因为在线版更新而受影响。关于本地版的使用，群里会提供详细的部署教程和使用指南。遇到任何问题都可以随时在群里反馈，无论是安装配置还是使用过程中的bug，开发者都会认真对待并尽快解决 (๑•̀ㅂ•́)و✧
            <br/>
            另外，本编辑器主要面向PC端设计，涉及大量的拖拽节点、连线、复杂编辑等操作，这些功能在移动端上体验很不好，因此<strong>没有做移动端适配</strong>。强烈建议在电脑上使用，移动端可能会出现各种显示和操作问题。如果一定要在移动端使用，建议使用浏览器的桌面模式。
            <br/>
            <span style={{ display: 'block', textAlign: 'center', color: '#dc2626', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}><strong>更新说明</strong></span>
            编辑器默认采用日间模式主题，插件商店可以切换其他主题风格。传统文本创作使用节点流编辑，若需启用游戏化逻辑系统（变量管理、条件判断等高级功能），可在插件商店激活 Blockly 可视化编程模组。
            </p>
          </div>
          
          <button className="cta-button" onClick={handleStartCreating}>
            开始创作
          </button>
        </section>
      </div>
    </div>
  )
}

export default LandingPage

