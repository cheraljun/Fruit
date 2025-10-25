/**
 * 游客模式存储服务
 * 职责：管理游客模式下的故事数据（使用sessionStorage）
 * 
 * 设计原则：
 * - 单一职责：只处理游客模式的数据存储
 * - 接口一致：提供与api.drafts相同的接口，便于复用
 * - 会话隔离：使用sessionStorage，关闭浏览器自动清空
 */

import type { Story } from '../../../shared/types/index.ts'

class GuestStorageService {
  private readonly PREFIX = 'guest_story_'
  private readonly LIST_KEY = 'guest_story_list'

  /**
   * 保存故事
   */
  save(story: Story): void {
    try {
      const key = this.getStoryKey(story.id)
      sessionStorage.setItem(key, JSON.stringify(story))
      
      // 更新故事列表
      this.addToList(story.id)
      
      console.log(`[游客模式] 已保存到sessionStorage: ${story.meta.title}`)
    } catch (error) {
      console.error('[游客模式] 保存失败:', error)
      throw new Error('游客模式存储空间不足')
    }
  }

  /**
   * 获取单个故事
   */
  getById(id: string): Story | null {
    try {
      const key = this.getStoryKey(id)
      const data = sessionStorage.getItem(key)
      
      if (!data) return null
      
      return JSON.parse(data) as Story
    } catch (error) {
      console.error('[游客模式] 读取失败:', error)
      return null
    }
  }

  /**
   * 获取所有故事
   */
  getAll(): Story[] {
    const stories: Story[] = []
    const list = this.getList()
    
    for (const id of list) {
      const story = this.getById(id)
      if (story) {
        stories.push(story)
      }
    }
    
    return stories
  }

  /**
   * 删除故事
   */
  delete(id: string): void {
    const key = this.getStoryKey(id)
    sessionStorage.removeItem(key)
    this.removeFromList(id)
    console.log(`[游客模式] 已删除: ${id}`)
  }

  /**
   * 清空所有游客数据
   */
  clearAll(): void {
    const list = this.getList()
    for (const id of list) {
      const key = this.getStoryKey(id)
      sessionStorage.removeItem(key)
    }
    sessionStorage.removeItem(this.LIST_KEY)
    console.log('[游客模式] 已清空所有数据')
  }

  // ========== 私有方法 ==========

  private getStoryKey(id: string): string {
    return `${this.PREFIX}${id}`
  }

  private getList(): string[] {
    try {
      const data = sessionStorage.getItem(this.LIST_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  private addToList(id: string): void {
    const list = this.getList()
    if (!list.includes(id)) {
      list.push(id)
      sessionStorage.setItem(this.LIST_KEY, JSON.stringify(list))
    }
  }

  private removeFromList(id: string): void {
    const list = this.getList()
    const filtered = list.filter(item => item !== id)
    sessionStorage.setItem(this.LIST_KEY, JSON.stringify(filtered))
  }
}

// 单例模式
export const guestStorage = new GuestStorageService()

