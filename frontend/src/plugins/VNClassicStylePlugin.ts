/**
 * 视觉小说经典风格插件
 * 职责：传统Galgame对话框样式，半透明黑底
 */

import { PluginBase } from '../../../shared/plugin/PluginBase.js';
import type { PluginMetadata } from '../../../shared/plugin/types.js';

export class VNClassicStylePlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'vn-style.classic',
    name: '视觉小说经典风格',
    version: '1.0.0',
    author: '墨水官方',
    description: '传统Galgame对话框样式，半透明黑底，适合大部分作品',
    icon: 'VN',
    category: 'enhance',
    tags: ['视觉小说', '风格', '经典'],
    conflicts: ['vn-style.modern', 'vn-style.pixel'],
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
    const styleId = 'vn-style-classic';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      /* 经典视觉小说风格 */
      .vn-dialogue-box {
        background: rgba(0, 0, 0, 0.85) !important;
        backdrop-filter: blur(15px) !important;
        border-radius: 12px !important;
        border: 2px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
      }
      
      .vn-text {
        color: #ffffff !important;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
      }
      
      .vn-choice-button {
        background: rgba(255, 255, 255, 0.95) !important;
        border: 2px solid rgba(255, 215, 0, 0.3) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }
      
      .vn-choice-button:hover {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
        border-color: #FFD700 !important;
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5) !important;
      }
      
      .vn-character-image {
        filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.5)) !important;
      }
    `;
  }

  private removeStyle(): void {
    const styleEl = document.getElementById('vn-style-classic');
    if (styleEl) {
      styleEl.remove();
    }
  }

  public getCSS(): string {
    return `
.vn-dialogue-box {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

.vn-text {
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.vn-choice-button {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.vn-choice-button:hover {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-color: #FFD700;
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}

.vn-character-image {
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.5));
}`;
  }
}

