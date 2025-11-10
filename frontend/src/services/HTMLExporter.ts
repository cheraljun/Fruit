/**
 * HTML导出服务
 * 职责：将故事导出为独立的HTML文件
 * 
 * 流程：
 * 1. 读取预构建的播放器模板
 * 2. 将Story中的图片路径转为base64
 * 3. 注入Story数据到模板
 * 4. 生成最终HTML并触发下载
 */

import type { Story } from '../types/index';
import config from '../config/index';

export class HTMLExporter {
  private templates: Map<string, string> = new Map();
  
  /**
   * 加载播放器模板
   */
  async loadTemplates(): Promise<void> {
    try {
      // 加载Visual Novel模板
      const vnRes = await fetch('/templates/visual-novel-player.html');
      if (vnRes.ok) {
        this.templates.set('visual-novel', await vnRes.text());
      }
      
    } catch (error) {
      console.error('加载播放器模板失败:', error);
      throw new Error('播放器模板未构建，请先运行：node player-standalone/build.js');
    }
  }
  
  /**
   * 导出故事为HTML
   */
  async exportToHTML(story: Story, mode: 'visual-novel', customStyleCSS?: string): Promise<void> {
    const template = this.templates.get(mode);
    if (!template) {
      throw new Error(`${mode}模板未加载`);
    }
    
    // 克隆story，避免修改原始数据
    const storyWithBase64 = JSON.parse(JSON.stringify(story));
    
    // 将所有图片路径转为base64
    await this.convertImagesToBase64(storyWithBase64);
    
    // 注入Story数据到模板
    const storyDataJson = JSON.stringify(storyWithBase64);
    let html = template.replace('{{STORY_DATA}}', storyDataJson);
    html = html.replace('{{STORY_NAME}}', story.meta.title);
    
    // 注入自定义样式CSS
    if (customStyleCSS) {
      const styleTag = `\n  <style id="custom-style">\n${customStyleCSS}\n  </style>`;
      html = html.replace('</head>', `${styleTag}\n</head>`);
    }
    
    // 触发下载
    this.downloadHTML(html, `${story.meta.title}_${mode}.html`);
  }
  
  /**
   * 将Story中的所有图片路径转为base64
   */
  private async convertImagesToBase64(story: Story): Promise<void> {
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) {
      return;
    }
    
    const baseUrl = config.api.baseURL.replace('/api', '');
    
    for (const node of story.nodes) {
      const nodeData = node.data;
      
      // 转换背景图
      if (nodeData.image?.imagePath) {
        const imageUrl = `${baseUrl}/userdata/${currentUsername}/${nodeData.image.imagePath}`;
        const base64 = await this.imageUrlToBase64(imageUrl);
        if (base64) {
          nodeData.image.imagePath = base64;
        }
      }
      
      // 转换角色立绘
      if (nodeData.characterImages) {
        if (nodeData.characterImages.left?.imagePath) {
          const imageUrl = `${baseUrl}/userdata/${currentUsername}/${nodeData.characterImages.left.imagePath}`;
          const base64 = await this.imageUrlToBase64(imageUrl);
          if (base64) {
            nodeData.characterImages.left.imagePath = base64;
          }
        }
        
        if (nodeData.characterImages.center?.imagePath) {
          const imageUrl = `${baseUrl}/userdata/${currentUsername}/${nodeData.characterImages.center.imagePath}`;
          const base64 = await this.imageUrlToBase64(imageUrl);
          if (base64) {
            nodeData.characterImages.center.imagePath = base64;
          }
        }
        
        if (nodeData.characterImages.right?.imagePath) {
          const imageUrl = `${baseUrl}/userdata/${currentUsername}/${nodeData.characterImages.right.imagePath}`;
          const base64 = await this.imageUrlToBase64(imageUrl);
          if (base64) {
            nodeData.characterImages.right.imagePath = base64;
          }
        }
      }
    }
  }
  
  /**
   * 将图片URL转为base64
   */
  private async imageUrlToBase64(url: string): Promise<string | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      
      const blob = await response.blob();
      return await this.blobToBase64(blob);
    } catch (error) {
      console.error('转换图片失败:', url, error);
      return null;
    }
  }
  
  /**
   * Blob转base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  /**
   * 触发HTML文件下载
   */
  private downloadHTML(html: string, filename: string): void {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// 创建单例
export const htmlExporter = new HTMLExporter();

