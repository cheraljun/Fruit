/**
 * 故事服务
 * 职责：处理故事的业务逻辑（草稿、发布）
 * 
 * 设计原则：
 * - 单一职责：只处理故事相关逻辑
 * - 用户身份验证由路由层的JWT中间件负责
 * - Service层专注于业务逻辑，不处理认证
 */

import type { Story } from '../types/index.js';
import type { IStoryRepository } from '../repositories/interfaces/IStoryRepository.js';
import { NotFoundError } from '../errors/AppError.js';

interface PublishResult {
  success: boolean;
  shareUrl: string;
}

export class StoryService {
  constructor(
    private storyRepo: IStoryRepository
  ) {}

  // ========== 草稿操作 ==========

  async saveDraft(username: string, story: Story): Promise<void> {
    await this.storyRepo.saveDraft(username, story);
  }

  async getDraft(username: string, storyId: string): Promise<Story> {
    const story = await this.storyRepo.findDraft(username, storyId);
    
    if (!story) {
      throw new NotFoundError('草稿不存在');
    }
    
    return story;
  }

  async getAllDrafts(username: string): Promise<Story[]> {
    return await this.storyRepo.findAllDrafts(username);
  }

  /**
   * 删除草稿（JWT认证已验证用户身份）
   * 注：路由层的authenticateToken中间件已验证用户身份，无需再次验证密码
   */
  async deleteDraft(username: string, storyId: string): Promise<void> {
    // 同时删除草稿和发布版本
    await this.storyRepo.deleteDraft(username, storyId);
    await this.storyRepo.deletePublished(username, storyId);
  }

  // ========== 发布操作 ==========

  /**
   * 发布游戏（JWT认证已验证用户身份）
   * 注：路由层的authenticateToken中间件已验证用户身份，无需再次验证密码
   */
  async publish(username: string, storyId: string): Promise<PublishResult> {
    // 读取草稿
    const draft = await this.storyRepo.findDraft(username, storyId);
    if (!draft) {
      throw new NotFoundError('草稿不存在');
    }

    // 保存到发布区
    const publishedStory: Story = {
      ...draft,
      meta: {
        ...draft.meta,
        author: username
      },
      updatedAt: new Date().toISOString()
    };

    await this.storyRepo.savePublished(username, publishedStory);

    return {
      success: true,
      shareUrl: `/play/published/${username}/${storyId}`
    };
  }

  async getPublished(username: string, storyId: string): Promise<Story> {
    const story = await this.storyRepo.findPublished(username, storyId);
    
    if (!story) {
      throw new NotFoundError('游戏不存在');
    }
    
    return story;
  }

  async getAllPublished(): Promise<Story[]> {
    return await this.storyRepo.findAllPublished();
  }
}

