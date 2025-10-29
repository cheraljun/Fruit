/**
 * 黑色终端风格插件
 * 职责：为播放器提供黑色终端样式（试玩和导出共用）
 */

import { PluginBase } from '../../../shared/plugin/PluginBase.js';
import type { PluginMetadata } from '../../../shared/plugin/types.js';

export class DarkTerminalStylePlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'player-style.dark-terminal',
    name: '黑色终端风格',
    version: '1.0.0',
    author: '系统',
    description: '经典黑色终端，绿色系统信息，适合技术向作品',
    icon: 'DARK',
    category: 'enhance',
    tags: ['播放器', '风格', '暗色', '终端'],
    conflicts: ['player-style.light-clean'],
    compatibleWith: ['terminal']
  };

  config = {
    enabled: true,
    settings: {}
  };

  protected async onInstall(): Promise<void> {
    this.applyStyle();
  }

  protected async onUninstall(): Promise<void> {
    this.removeStyle();
  }

  private applyStyle(): void {
    const styleId = 'player-style-dark-terminal';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      /* 黑色终端风格 - 默认样式已在player.css */
      .player {
        background: #000 !important;
      }
      
      .player-container {
        background: #000 !important;
      }
      
      .terminal-content {
        color: #ccc !important;
      }
      
      .terminal-message.sys { 
        color: #0f0 !important;
      }
      
      .terminal-message.inp { 
        color: #555 !important;
      }
      
      .terminal-message.out {
        color: #aaa !important;
      }
      
      .terminal-message.err { 
        color: #f00 !important;
      }
      
      .terminal-message.prompt {
        color: #fff !important;
      }
      
      .terminal-prompt {
        color: #fff !important;
      }
      
      .terminal-input {
        background: #000 !important;
        color: #fff !important;
      }
      
      .terminal-input::placeholder {
        color: #555 !important;
      }
      
      .choice-link {
        color: #666 !important;
      }
      
      .choice-link:hover {
        color: #5bc0de !important;
        text-shadow: 0 0 8px rgba(91, 192, 222, 0.6) !important;
      }
      
      .terminal-message.out strong {
        color: #fff !important;
      }
      
      .terminal-message.out em {
        color: #bbb !important;
      }
      
      .terminal-message.out code {
        background: #1a1a1a !important;
        color: #0f0 !important;
      }
    `;
  }

  private removeStyle(): void {
    const styleEl = document.getElementById('player-style-dark-terminal');
    if (styleEl) {
      styleEl.remove();
    }
  }

  public getCSS(): string {
    return `
.player {
  background: #000;
}

.player-container {
  background: #000;
}

.terminal-content {
  color: #ccc;
}

.terminal-message.sys { 
  color: #0f0;
}

.terminal-message.inp { 
  color: #555;
}

.terminal-message.out {
  color: #aaa;
}

.terminal-message.err { 
  color: #f00;
}

.terminal-message.prompt {
  color: #fff;
}

.terminal-prompt {
  color: #fff;
}

.terminal-input {
  background: #000;
  color: #fff;
}

.terminal-input::placeholder {
  color: #555;
}

.choice-link {
  color: #666;
}

.choice-link:hover {
  color: #5bc0de;
  text-shadow: 0 0 8px rgba(91, 192, 222, 0.6);
}

.terminal-message.out strong {
  color: #fff;
}

.terminal-message.out em {
  color: #bbb;
}

.terminal-message.out code {
  background: #1a1a1a;
  color: #0f0;
}`;
  }
}

