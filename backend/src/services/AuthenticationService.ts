/**
 * 认证服务
 * 职责：处理用户注册、登录、账户管理
 * 
 * 设计原则：
 * - 单一职责：只处理认证相关逻辑
 * - 使用Repository抽象存储细节
 */

import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware.js';
import type { IAuthorRepository, IFileSystemRepository, AuthorCredentials } from '../repositories/interfaces/IStoryRepository.js';
import type { StoryService } from './StoryService.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../errors/AppError.js';
import { SURVIVAL_GAME_TEMPLATE, FOG_MYSTERY_TEMPLATE } from '../constants/templates/index.js';

interface LoginResult {
  success: boolean;
  username: string;
  token: string;
}

export class AuthenticationService {
  constructor(
    private authorRepo: IAuthorRepository,
    private fsRepo: IFileSystemRepository,
    private userDataBasePath: string,
    private storyService?: StoryService
  ) {}

  /**
   * 登录或注册
   * 
   * 逻辑：
   * 1. 先尝试作为登录处理
   * 2. 如果用户不存在，则注册新用户
   * 3. 使用原子操作防止并发注册冲突
   */
  async login(username: string, password: string): Promise<LoginResult> {
    // 验证用户名
    this.validateUsername(username);
    
    // 验证密码
    this.validatePassword(password);

    // 尝试登录
    const existingAuthor = await this.authorRepo.findByUsername(username);
    
    if (existingAuthor) {
      // 用户存在 -> 验证密码
      const isValid = await bcrypt.compare(password, existingAuthor.passwordHash);
      if (!isValid) {
        throw new UnauthorizedError('密码错误');
      }
      const token = generateToken(username);
      return { success: true, username, token };
    }

    // 用户不存在 -> 注册新用户
    await this.register(username, password);
    const token = generateToken(username);
    return { success: true, username, token };
  }

  /**
   * 注册新用户
   * 
   * 使用原子操作防止竞态条件：
   * - fsRepo.save() 使用 'wx' 标志，确保文件创建的原子性
   * - 如果并发创建，第二个请求会收到 EEXIST 错误
   * 
   * 自动创建模板故事：
   * - 为新用户提供示例模板，帮助快速了解编辑器功能
   */
  private async register(username: string, password: string): Promise<void> {
    const userDir = `${this.userDataBasePath}/${username}`;
    
    // 创建用户目录结构
    await this.fsRepo.ensureDirectory(userDir);
    await this.fsRepo.ensureDirectory(`${userDir}/drafts`);
    await this.fsRepo.ensureDirectory(`${userDir}/published`);

    // 创建认证信息（原子操作）
    const passwordHash = await bcrypt.hash(password, 10);
    const authorData: AuthorCredentials = {
      username,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    try {
      await this.authorRepo.save(authorData);
    } catch (error: any) {
      // 如果是并发创建导致的冲突，重新尝试登录
      if (error.message.includes('用户已存在')) {
        // 递归调用，这次会走登录逻辑
        return;
      }
      throw error;
    }

    console.log(`用户注册: ${username}`);

    // 为新用户自动创建模板故事
    await this.createTemplateStory(username);
  }

  /**
   * 为新用户创建模板故事
   */
  private async createTemplateStory(username: string): Promise<void> {
    if (!this.storyService) {
      console.warn('[AuthService] StoryService未注入，跳过模板创建');
      return;
    }

    try {
      // 创建所有模板故事
      const templates = [SURVIVAL_GAME_TEMPLATE, FOG_MYSTERY_TEMPLATE];
      
      for (const template of templates) {
        const templateStory = {
          ...template,
          id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await this.storyService.saveDraft(username, templateStory);
        // 添加小延迟确保ID唯一
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      console.log(`[AuthService] 已为用户 ${username} 创建${templates.length}个模板故事`);
    } catch (error) {
      // 模板创建失败不影响注册流程
      console.error(`[AuthService] 创建模板故事失败:`, error);
    }
  }

  /**
   * 验证密码（删除账户、发布时需要）
   */
  async verifyPassword(username: string, password: string): Promise<boolean> {
    const author = await this.authorRepo.findByUsername(username);
    
    if (!author) {
      throw new NotFoundError('用户不存在');
    }

    return await bcrypt.compare(password, author.passwordHash);
  }

  /**
   * 删除账户
   */
  async deleteAccount(username: string): Promise<void> {
    // 直接删除用户
    await this.authorRepo.delete(username);
    console.log(`用户 ${username} 删除账户`);
  }

  // ========== 验证方法 ==========

  private validateUsername(username: string): void {
    if (!username || username.trim() === '') {
      throw new ValidationError('用户名不能为空');
    }

    // 防止路径遍历攻击
    if (username.includes('/') || username.includes('\\') || username.includes('..')) {
      throw new ValidationError('用户名包含非法字符');
    }

    // 允许中文、英文字母和数字，不允许空格和特殊符号
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(username)) {
      throw new ValidationError('用户名只能包含中文、英文字母和数字，不能包含空格或特殊符号');
    }

    // 长度限制
    if (username.length < 1 || username.length > 32) {
      throw new ValidationError('用户名长度必须在1-32个字符之间');
    }
  }

  private validatePassword(password: string): void {
    if (!password || password.length === 0) {
      throw new ValidationError('密码不能为空');
    }

    // 允许数字、英文字母、特殊符号（可打印ASCII字符，不包括空格）
    // 排除空格和其他不可见字符
    const validPasswordPattern = /^[\x21-\x7E]+$/;
    if (!validPasswordPattern.test(password)) {
      throw new ValidationError('密码只能包含英文字母、数字和特殊符号（不能包含空格）');
    }

    // 不限制密码长度（可以是1个字符）
  }
}

