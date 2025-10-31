/**
 * Markdown渲染插件
 * 职责：将Markdown文本转换为HTML
 */

import { PluginBase } from '../../plugin/PluginBase.js';
import type { PluginMetadata, PluginHook, PluginHookHandler } from '../../plugin/types.js';

declare const marked: any;

export class MarkdownPlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'tool.markdown',
    name: 'Markdown渲染',
    version: '1.0.0',
    author: '系统',
    description: '支持Markdown语法和自定义标签渲染',
    icon: 'MD',
    category: 'tool',
    tags: ['工具', 'content', 'render']
  };

  hooks: Partial<Record<PluginHook, PluginHookHandler>> = {
    'content:render': (data, _context) => {
      const { text, story } = data;
      const rendered = this.renderMarkdown(text, story);
      return { ...data, renderedHTML: rendered };
    }
  };

  /**
   * 渲染Markdown为HTML
   */
  private renderMarkdown(text: string, story?: any): string {
    let processed = text;
    
    // 角色对话处理（最先处理，在所有其他渲染之前）
    // 支持 @角色名：对话内容 或 @角色名:对话内容
    if (story && story.meta && story.meta.characters) {
      const characters = story.meta.characters;
      processed = processed.replace(/@([\u4e00-\u9fa5\w]+)[:：](.+?)(?=\n|$)/gm, (match, charName, dialogue) => {
        const character = characters.find((c: any) => c.name === charName);
        if (character) {
          const color = character.nameColor || '#5bc0de';
          
          // 如果角色有头像，注入头像HTML
          let avatarHTML = '';
          if (character.avatar && character.avatar.imagePath) {
            // 在线版和独立版的图片路径处理不同
            // 在线版需要构建完整URL，独立版已经是base64
            const isStandalone = character.avatar.imagePath.startsWith('data:');
            let avatarSrc: string;
            
            if (isStandalone) {
              avatarSrc = character.avatar.imagePath;
            } else {
              // 在线版：使用baseURL + userdata路径
              const baseURL = (story as any)._baseURL || '';
              const imageOwner = (story as any)._imageOwner || story.meta.author;
              avatarSrc = `${baseURL}/userdata/${encodeURIComponent(imageOwner)}/${character.avatar.imagePath}`;
            }
            
            avatarHTML = `<img class="character-avatar" src="${avatarSrc}" alt="${character.name}" />`;
          }
          
          return `<div class="dialogue">${avatarHTML}<span class="character-name" style="color:${color}">${character.name}</span>${dialogue}</div>`;
        }
        return match;
      });
    } else {
      console.log('[MarkdownPlugin] No story or characters:', story);
    }
    
    // 自定义标签处理（先处理自定义标签，避免被Markdown转义）
    processed = processed.replace(/\[color=([^\]]+)\](.+?)\[\/color\]/gs, '<span style="color:$1">$2</span>');
    processed = processed.replace(/\[big\](.+?)\[\/big\]/gs, '<span style="font-size:1.3em;font-weight:bold">$1</span>');
    processed = processed.replace(/\[small\](.+?)\[\/small\]/gs, '<span style="font-size:0.85em;opacity:0.8">$1</span>');
    processed = processed.replace(/\[bg=([^\]]+)\](.+?)\[\/bg\]/gs, '<span style="background-color:$1;padding:2px 4px;border-radius:2px">$2</span>');
    processed = processed.replace(/\[center\](.+?)\[\/center\]/gs, '<div style="text-align:center">$1</div>');
    processed = processed.replace(/\[right\](.+?)\[\/right\]/gs, '<div style="text-align:right">$1</div>');
    processed = processed.replace(/\[glow\](.+?)\[\/glow\]/gs, '<span style="color:#5bc0de;text-shadow:0 0 10px rgba(91,192,222,0.8)">$1</span>');
    
    // 使用marked处理标准Markdown
    let html: string;
    if (typeof marked !== 'undefined' && marked.parse) {
      marked.setOptions({
        breaks: true,
        gfm: true
      });
      html = marked.parse(processed);
    } else {
      html = processed.replace(/\n/g, '<br>');
    }
    
    html = html.replace(/<p>/g, '').replace(/<\/p>/g, '');
    
    return html;
  }

  protected async onInstall(): Promise<void> {
    console.log('[MarkdownPlugin] Installed');
  }
}

