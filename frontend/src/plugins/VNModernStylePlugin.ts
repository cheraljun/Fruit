/**
 * 视觉小说现代风格插件
 * 职责：现代玻璃态设计，渐变色彩，科技感
 */

import { PluginBase } from '../../../shared/plugin/PluginBase.js';
import type { PluginMetadata } from '../../../shared/plugin/types.js';

export class VNModernStylePlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'vn-style.modern',
    name: '视觉小说现代风格',
    version: '1.0.0',
    author: '系统',
    description: '现代玻璃态设计，渐变色彩，适合科幻/现代题材',
    icon: 'VN',
    category: 'enhance',
    tags: ['视觉小说', '风格', '现代', '玻璃态'],
    conflicts: ['vn-style.classic', 'vn-style.pixel'],
    compatibleWith: ['visual-novel']
  };

  config = {
    enabled: false,
    settings: {}
  };

  protected async onInstall(): Promise<void> {
    this.applyStyle();
  }

  protected async onUninstall(): Promise<void> {
    this.removeStyle();
  }

  private applyStyle(): void {
    const styleId = 'vn-style-modern';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      /* 现代玻璃态风格 */
      .vn-dialogue-box {
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.1) 0%, 
          rgba(255, 255, 255, 0.05) 100%) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        border-radius: 20px !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
      }
      
      .vn-text {
        color: #f0f0f0 !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
      }
      
      .vn-choice-button {
        background: linear-gradient(135deg, 
          rgba(0, 212, 255, 0.2) 0%, 
          rgba(138, 43, 226, 0.2) 100%) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(0, 212, 255, 0.4) !important;
        border-radius: 12px !important;
        color: #ffffff !important;
        box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2) !important;
      }
      
      .vn-choice-button:hover {
        background: linear-gradient(135deg, 
          rgba(0, 212, 255, 0.4) 0%, 
          rgba(138, 43, 226, 0.4) 100%) !important;
        border-color: rgba(0, 212, 255, 0.8) !important;
        box-shadow: 0 6px 25px rgba(0, 212, 255, 0.5) !important;
      }
      
      .vn-character-image {
        filter: drop-shadow(0 0 30px rgba(0, 212, 255, 0.3)) !important;
      }
      
      .vn-game-over-text {
        background: linear-gradient(135deg, #00d4ff 0%, #8a2be2 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
      }
    `;
  }

  private removeStyle(): void {
    const styleEl = document.getElementById('vn-style-modern');
    if (styleEl) {
      styleEl.remove();
    }
  }

  public getCSS(): string {
    return `
.vn-dialogue-box {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.vn-text {
  color: #f0f0f0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.vn-choice-button {
  background: linear-gradient(135deg, 
    rgba(0, 212, 255, 0.2) 0%, 
    rgba(138, 43, 226, 0.2) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.4);
  border-radius: 12px;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
}

.vn-choice-button:hover {
  background: linear-gradient(135deg, 
    rgba(0, 212, 255, 0.4) 0%, 
    rgba(138, 43, 226, 0.4) 100%);
  border-color: rgba(0, 212, 255, 0.8);
  box-shadow: 0 6px 25px rgba(0, 212, 255, 0.5);
}

.vn-character-image {
  filter: drop-shadow(0 0 30px rgba(0, 212, 255, 0.3));
}

.vn-game-over-text {
  background: linear-gradient(135deg, #00d4ff 0%, #8a2be2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`;
  }
}

