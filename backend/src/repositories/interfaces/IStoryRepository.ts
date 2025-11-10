/**
 * 故事存储接口定义
 * 职责：定义故事数据访问的抽象接口（业务层视角）
 * 
 * 设计原则：
 * - 接口应该使用业务概念（username, storyId），不暴露存储细节（path）
 * - 便于替换实现（JSON -> MySQL -> S3）
 */

import type { Story } from '../../types/index.js';

/**
 * 故事存储接口（业务层视角）
 */
export interface IStoryRepository {
  // ========== 草稿操作 ==========
  saveDraft(username: string, story: Story): Promise<void>;
  findDraft(username: string, storyId: string): Promise<Story | null>;
  findAllDrafts(username: string): Promise<Story[]>;
  deleteDraft(username: string, storyId: string): Promise<void>;

  // ========== 发布操作 ==========
  savePublished(username: string, story: Story): Promise<void>;
  findPublished(username: string, storyId: string): Promise<Story | null>;
  findAllPublished(): Promise<Story[]>;
  deletePublished(username: string, storyId: string): Promise<void>;
}

/**
 * 作者认证数据
 */
export interface AuthorCredentials {
  username: string;
  passwordHash: string;
  createdAt: string;
  email?: string; // 可选，用户可以选择绑定邮箱
  emailVerifiedAt?: string; // 邮箱绑定时间
}

/**
 * 作者认证存储接口
 */
export interface IAuthorRepository {
  save(author: AuthorCredentials): Promise<void>;
  findByUsername(username: string): Promise<AuthorCredentials | null>;
  findByEmail(email: string): Promise<AuthorCredentials | null>; // 新增：通过邮箱查找用户
  exists(username: string): Promise<boolean>;
  updateEmail(username: string, email: string): Promise<void>; // 新增：更新邮箱
  delete(username: string): Promise<void>;
}

/**
 * 文件系统操作接口（基础设施）
 */
export interface IFileSystemRepository {
  createDirectory(path: string): Promise<void>;
  directoryExists(path: string): Promise<boolean>;
  ensureDirectory(path: string): Promise<void>;
  deleteDirectory(path: string): Promise<void>;
}
