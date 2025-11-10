/**
 * 文件系统实现的Repository
 * 职责：将业务操作映射到文件系统操作
 * 
 * 设计原则：
 * - 封装所有路径拼接逻辑
 * - 使用原子写入保证数据安全
 * - Service层不需要知道文件系统结构
 */

import fs from 'fs/promises';
import path from 'path';
import type { Story } from '../types/index.js';
import type { 
  IStoryRepository, 
  IAuthorRepository, 
  IFileSystemRepository,
  AuthorCredentials 
} from './interfaces/IStoryRepository.js';
import { InternalServerError } from '../errors/AppError.js';
import { AtomicFileWriter } from '../infrastructure/AtomicFileWriter.js';

/**
 * 文件系统故事存储实现
 */
export class FileSystemStoryRepository implements IStoryRepository {
  private baseDir: string;
  private writer: AtomicFileWriter;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.writer = new AtomicFileWriter();
  }

  // ========== 私有方法：路径映射 ==========
  
  private getDraftPath(username: string, storyId: string): string {
    return path.join(this.baseDir, username, 'drafts', `${storyId}.json`);
  }

  private getDraftsDir(username: string): string {
    return path.join(this.baseDir, username, 'drafts');
  }

  private getPublishedPath(username: string, storyId: string): string {
    return path.join(this.baseDir, username, 'published', `${storyId}.json`);
  }

  private getPublishedDir(username: string): string {
    return path.join(this.baseDir, username, 'published');
  }

  // ========== 草稿操作 ==========

  async saveDraft(username: string, story: Story): Promise<void> {
    try {
      const filePath = this.getDraftPath(username, story.id);
      await this.writer.writeJSON(filePath, story);
    } catch (error) {
      const err = error as Error;
      throw new InternalServerError(`保存草稿失败: ${err.message}`);
    }
  }

  async findDraft(username: string, storyId: string): Promise<Story | null> {
    try {
      const filePath = this.getDraftPath(username, storyId);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as Story;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      const err = error as Error;
      throw new InternalServerError(`读取草稿失败: ${err.message}`);
    }
  }

  async findAllDrafts(username: string): Promise<Story[]> {
    try {
      const dir = this.getDraftsDir(username);
      const files = await fs.readdir(dir);
      const stories: Story[] = [];

      for (const file of files) {
        if (file.endsWith('.json') && !file.startsWith('.')) {
          const filePath = path.join(dir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          stories.push(JSON.parse(content) as Story);
        }
      }

      return stories;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      const err = error as Error;
      throw new InternalServerError(`读取草稿列表失败: ${err.message}`);
    }
  }

  async deleteDraft(username: string, storyId: string): Promise<void> {
    try {
      const filePath = this.getDraftPath(username, storyId);
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return; // 文件不存在，不报错
      }
      const err = error as Error;
      throw new InternalServerError(`删除草稿失败: ${err.message}`);
    }
  }

  // ========== 发布操作 ==========

  async savePublished(username: string, story: Story): Promise<void> {
    try {
      const filePath = this.getPublishedPath(username, story.id);
      await this.writer.writeJSON(filePath, story);
    } catch (error) {
      const err = error as Error;
      throw new InternalServerError(`保存发布失败: ${err.message}`);
    }
  }

  async findPublished(username: string, storyId: string): Promise<Story | null> {
    try {
      const filePath = this.getPublishedPath(username, storyId);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as Story;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      const err = error as Error;
      throw new InternalServerError(`读取发布失败: ${err.message}`);
    }
  }

  async findAllPublished(): Promise<Story[]> {
    const stories: Story[] = [];

    try {
      const authors = await fs.readdir(this.baseDir);

      for (const author of authors) {
        const publishedDir = this.getPublishedDir(author);
        try {
          const files = await fs.readdir(publishedDir);
          
          for (const file of files) {
            if (file.endsWith('.json') && !file.startsWith('.')) {
              const filePath = path.join(publishedDir, file);
              const content = await fs.readFile(filePath, 'utf-8');
              stories.push(JSON.parse(content) as Story);
            }
          }
        } catch (error: any) {
          if (error.code !== 'ENOENT') {
            console.error(`读取作者 ${author} 的发布目录失败:`, error);
          }
        }
      }

      return stories;
    } catch {
      return [];
    }
  }

  async deletePublished(username: string, storyId: string): Promise<void> {
    try {
      const filePath = this.getPublishedPath(username, storyId);
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return;
      }
      const err = error as Error;
      throw new InternalServerError(`删除发布失败: ${err.message}`);
    }
  }
}

/**
 * 文件系统作者存储实现
 */
export class FileSystemAuthorRepository implements IAuthorRepository {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  private getAuthorFilePath(username: string): string {
    return path.join(this.baseDir, username, '.author.json');
  }

  private getUserDir(username: string): string {
    return path.join(this.baseDir, username);
  }

  async save(author: AuthorCredentials): Promise<void> {
    try {
      const filePath = this.getAuthorFilePath(author.username);
      
      // 使用 wx 标志：文件不存在时才创建（原子操作，防止竞态）
      await fs.writeFile(
        filePath, 
        JSON.stringify(author, null, 2), 
        { encoding: 'utf-8', flag: 'wx' }
      );
    } catch (error: any) {
      if (error.code === 'EEXIST') {
        throw new InternalServerError('用户已存在');
      }
      const err = error as Error;
      throw new InternalServerError(`保存作者信息失败: ${err.message}`);
    }
  }

  async findByUsername(username: string): Promise<AuthorCredentials | null> {
    try {
      const filePath = this.getAuthorFilePath(username);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as AuthorCredentials;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      const err = error as Error;
      throw new InternalServerError(`读取作者信息失败: ${err.message}`);
    }
  }

  async exists(username: string): Promise<boolean> {
    try {
      const filePath = this.getAuthorFilePath(username);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async delete(username: string): Promise<void> {
    try {
      const userDir = this.getUserDir(username);
      await fs.rm(userDir, { recursive: true, force: true });
    } catch (error) {
      const err = error as Error;
      throw new InternalServerError(`删除作者失败: ${err.message}`);
    }
  }

  async findByEmail(email: string): Promise<AuthorCredentials | null> {
    try {
      // 遍历所有用户目录，查找匹配的邮箱
      const users = await fs.readdir(this.baseDir);
      
      for (const username of users) {
        try {
          const author = await this.findByUsername(username);
          if (author && author.email === email) {
            return author;
          }
        } catch {
          // 忽略读取失败的目录（可能不是用户目录）
          continue;
        }
      }
      
      return null;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      const err = error as Error;
      throw new InternalServerError(`通过邮箱查找作者失败: ${err.message}`);
    }
  }

  async updateEmail(username: string, email: string): Promise<void> {
    try {
      const filePath = this.getAuthorFilePath(username);
      
      // 读取现有数据
      const content = await fs.readFile(filePath, 'utf-8');
      const author = JSON.parse(content) as AuthorCredentials;
      
      // 更新邮箱信息
      if (email === '') {
        // 空字符串表示解绑，删除邮箱字段
        delete author.email;
        delete author.emailVerifiedAt;
      } else {
        // 绑定或更换邮箱
        author.email = email;
        author.emailVerifiedAt = new Date().toISOString();
      }
      
      // 写回文件
      await fs.writeFile(filePath, JSON.stringify(author, null, 2), 'utf-8');
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new InternalServerError('用户不存在');
      }
      const err = error as Error;
      throw new InternalServerError(`更新邮箱失败: ${err.message}`);
    }
  }
}

/**
 * 文件系统基础操作实现
 */
export class FileSystemOperations implements IFileSystemRepository {
  async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      const err = error as Error;
      throw new InternalServerError(`创建目录失败: ${err.message}`);
    }
  }

  async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  async ensureDirectory(dirPath: string): Promise<void> {
    const exists = await this.directoryExists(dirPath);
    if (!exists) {
      await this.createDirectory(dirPath);
    }
  }

  async deleteDirectory(dirPath: string): Promise<void> {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch (error) {
      const err = error as Error;
      throw new InternalServerError(`删除目录失败: ${err.message}`);
    }
  }
}

