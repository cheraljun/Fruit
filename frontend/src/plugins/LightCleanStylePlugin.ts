/**
 * 白色简洁风格插件
 * 职责：为播放器提供白色简洁样式（试玩和导出共用）
 */

import { PluginBase } from '../../../shared/plugin/PluginBase.js';
import type { PluginMetadata } from '../../../shared/plugin/types.js';

export class LightCleanStylePlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'player-style.light-clean',
    name: '白色简洁风格',
    version: '1.0.0',
    author: '系统',
    description: '明亮白色背景，深色文字，适合阅读向作品',
    icon: 'LIGHT',
    category: 'enhance',
    tags: ['播放器', '风格', '亮色', '简洁'],
    conflicts: ['player-style.dark-terminal'],
    compatibleWith: ['terminal']
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
    const styleId = 'player-style-light-clean';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      /* 白色简洁风格 */
      .player {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%) !important;
      }
      
      .player-container {
        background: #ffffff !important;
      }
      
      .terminal-content {
        color: #212529 !important;
      }
      
      .terminal-message.sys {
        color: #198754 !important;
      }
      
      .terminal-message.inp {
        color: #6c757d !important;
      }
      
      .terminal-message.out {
        color: #212529 !important;
      }
      
      .terminal-message.err {
        color: #dc3545 !important;
      }
      
      .terminal-message.prompt {
        color: #495057 !important;
      }
      
      .terminal-input-area {
        border-top: 1px solid #dee2e6 !important;
      }
      
      .terminal-prompt {
        color: #495057 !important;
      }
      
      .terminal-input {
        background: #ffffff !important;
        color: #212529 !important;
      }
      
      .terminal-input::placeholder {
        color: #adb5bd !important;
      }
      
      .choice-link {
        color: #6c757d !important;
      }
      
      .choice-link:hover {
        color: #0d6efd !important;
        text-shadow: 0 0 8px rgba(13, 110, 253, 0.3) !important;
      }
      
      .terminal-message.out strong {
        color: #000000 !important;
      }
      
      .terminal-message.out em {
        color: #495057 !important;
      }
      
      .terminal-message.out code {
        background: #f8f9fa !important;
        color: #d63384 !important;
        border: 1px solid #dee2e6 !important;
      }
    `;
  }

  private removeStyle(): void {
    const styleEl = document.getElementById('player-style-light-clean');
    if (styleEl) {
      styleEl.remove();
    }
  }

  public getCSS(): string {
    return `
.player {
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.player-container {
  background: #ffffff;
}

.terminal-content {
  color: #212529;
}

.terminal-message.sys {
  color: #198754;
}

.terminal-message.inp {
  color: #6c757d;
}

.terminal-message.out {
  color: #212529;
}

.terminal-message.err {
  color: #dc3545;
}

.terminal-message.prompt {
  color: #495057;
}

.terminal-input-area {
  border-top: 1px solid #dee2e6;
}

.terminal-prompt {
  color: #495057;
}

.terminal-input {
  background: #ffffff;
  color: #212529;
}

.terminal-input::placeholder {
  color: #adb5bd;
}

.choice-link {
  color: #6c757d;
}

.choice-link:hover {
  color: #0d6efd;
  text-shadow: 0 0 8px rgba(13, 110, 253, 0.3);
}

.terminal-message.out strong {
  color: #000000;
}

.terminal-message.out em {
  color: #495057;
}

.terminal-message.out code {
  background: #f8f9fa;
  color: #d63384;
  border: 1px solid #dee2e6;
}`;
  }
}

