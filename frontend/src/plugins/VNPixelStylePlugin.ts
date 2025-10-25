/**
 * 视觉小说像素风格插件
 * 职责：复古像素艺术风格，8-bit美学
 */

import { PluginBase } from '../../../shared/plugin/PluginBase.js';
import type { PluginMetadata } from '../../../shared/plugin/types.js';

export class VNPixelStylePlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'vn-style.pixel',
    name: '视觉小说像素风格',
    version: '1.0.0',
    author: '系统',
    description: '复古像素艺术风格，8-bit美学，适合复古/像素游戏',
    icon: 'VN',
    category: 'enhance',
    tags: ['视觉小说', '风格', '像素', '复古'],
    conflicts: ['vn-style.classic', 'vn-style.modern'],
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
    const styleId = 'vn-style-pixel';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      /* 像素复古风格 */
      .vn-dialogue-box {
        background: #2c2c2c !important;
        backdrop-filter: none !important;
        border-radius: 0 !important;
        border: 4px solid #ffffff !important;
        box-shadow: 
          8px 8px 0 rgba(0, 0, 0, 0.8),
          inset 0 0 0 2px #1a1a1a !important;
        image-rendering: pixelated !important;
      }
      
      .vn-text {
        color: #ffffff !important;
        text-shadow: 2px 2px 0 #000000 !important;
        font-family: 'Courier New', monospace !important;
        line-height: 1.6 !important;
      }
      
      .vn-choice-button {
        background: #444444 !important;
        backdrop-filter: none !important;
        border: 3px solid #ffffff !important;
        border-radius: 0 !important;
        color: #ffffff !important;
        font-family: 'Courier New', monospace !important;
        font-weight: 700 !important;
        box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5) !important;
        image-rendering: pixelated !important;
      }
      
      .vn-choice-button:hover {
        background: #00ff00 !important;
        color: #000000 !important;
        border-color: #00ff00 !important;
        box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.7) !important;
        transform: translate(-2px, -2px) !important;
      }
      
      .vn-character-image {
        filter: none !important;
        image-rendering: pixelated !important;
      }
      
      .vn-background {
        image-rendering: pixelated !important;
      }
      
      .vn-input-area {
        background: #2c2c2c !important;
        backdrop-filter: none !important;
        border: 3px solid #ffffff !important;
        border-radius: 0 !important;
      }
      
      .vn-prompt {
        color: #00ff00 !important;
        font-family: 'Courier New', monospace !important;
      }
      
      .vn-input {
        font-family: 'Courier New', monospace !important;
        color: #ffffff !important;
      }
      
      .vn-game-over-text {
        color: #ff0000 !important;
        text-shadow: 3px 3px 0 #000000 !important;
        font-family: 'Courier New', monospace !important;
      }
    `;
  }

  private removeStyle(): void {
    const styleEl = document.getElementById('vn-style-pixel');
    if (styleEl) {
      styleEl.remove();
    }
  }

  public getCSS(): string {
    return `
.vn-dialogue-box {
  background: #2c2c2c;
  backdrop-filter: none;
  border-radius: 0;
  border: 4px solid #ffffff;
  box-shadow: 
    8px 8px 0 rgba(0, 0, 0, 0.8),
    inset 0 0 0 2px #1a1a1a;
  image-rendering: pixelated;
}

.vn-text {
  color: #ffffff;
  text-shadow: 2px 2px 0 #000000;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}

.vn-choice-button {
  background: #444444;
  backdrop-filter: none;
  border: 3px solid #ffffff;
  border-radius: 0;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
  image-rendering: pixelated;
}

.vn-choice-button:hover {
  background: #00ff00;
  color: #000000;
  border-color: #00ff00;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.7);
  transform: translate(-2px, -2px);
}

.vn-character-image {
  filter: none;
  image-rendering: pixelated;
}

.vn-background {
  image-rendering: pixelated;
}

.vn-input-area {
  background: #2c2c2c;
  backdrop-filter: none;
  border: 3px solid #ffffff;
  border-radius: 0;
}

.vn-prompt {
  color: #00ff00;
  font-family: 'Courier New', monospace;
}

.vn-input {
  font-family: 'Courier New', monospace;
  color: #ffffff;
}

.vn-game-over-text {
  color: #ff0000;
  text-shadow: 3px 3px 0 #000000;
  font-family: 'Courier New', monospace;
}`;
  }
}

