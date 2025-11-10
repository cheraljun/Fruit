/**
 * 图片管理服务
 * 职责：图片上传、哈希去重、未引用图片扫描清理
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { Story } from '../types/index.js';
import { InternalServerError } from '../errors/AppError.js';

export interface UploadedImage {
  imagePath: string;      // 相对路径（如 "pictures/abc123.webp"）
  fileName: string;        // 原始文件名
  fileSize: number;        // 文件大小
  hash: string;            // 文件哈希
  width: number;           // 图片宽度
  height: number;          // 图片高度
  originalFormat: string;  // 原始格式
}

export class ImageService {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  /**
   * 计算文件哈希（SHA256）
   */
  private calculateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * 获取用户的图片目录
   */
  private getUserPicturesDir(username: string): string {
    return path.join(this.baseDir, username, 'pictures');
  }

  /**
   * 确保图片目录存在
   */
  private async ensurePicturesDir(username: string): Promise<void> {
    const dir = this.getUserPicturesDir(username);
    await fs.mkdir(dir, { recursive: true });
  }

  /**
   * 从base64字符串提取图片信息
   */
  private parseBase64Image(base64Data: string): { format: string; buffer: Buffer } {
    // 格式: data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAA...
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error('无效的base64图片格式');
    }
    
    const format = matches[1];
    const base64 = matches[2];
    const buffer = Buffer.from(base64, 'base64');
    
    return { format, buffer };
  }

  /**
   * 上传图片（带去重）
   * @param username 用户名
   * @param base64Data base64编码的图片数据
   * @param fileName 原始文件名
   * @param width 图片宽度
   * @param height 图片高度
   * @param originalFormat 原始格式
   */
  async uploadImage(
    username: string,
    base64Data: string,
    fileName: string,
    width: number,
    height: number,
    originalFormat: string
  ): Promise<UploadedImage> {
    try {
      // 解析base64数据
      const { format, buffer } = this.parseBase64Image(base64Data);
      
      // 计算哈希
      const hash = this.calculateHash(buffer);
      
      // 确保图片目录存在
      await this.ensurePicturesDir(username);
      
      // 检查是否已存在相同哈希的图片
      const picturesDir = this.getUserPicturesDir(username);
      const files = await fs.readdir(picturesDir);
      
      for (const file of files) {
        if (file.startsWith(hash)) {
          // 图片已存在，直接返回
          const existingPath = path.join(picturesDir, file);
          const stats = await fs.stat(existingPath);
          return {
            imagePath: `pictures/${file}`,
            fileName,
            fileSize: stats.size,
            hash,
            width,
            height,
            originalFormat
          };
        }
      }
      
      // 图片不存在，保存新文件
      const extension = format === 'gif' ? 'gif' : 'webp';
      const filename = `${hash}.${extension}`;
      const filePath = path.join(picturesDir, filename);
      
      await fs.writeFile(filePath, buffer);
      
      return {
        imagePath: `pictures/${filename}`,
        fileName,
        fileSize: buffer.length,
        hash,
        width,
        height,
        originalFormat
      };
    } catch (error) {
      const err = error as Error;
      throw new InternalServerError(`图片上传失败: ${err.message}`);
    }
  }

  /**
   * 扫描用户的所有故事，收集所有被引用的图片路径
   */
  private async collectReferencedImages(username: string): Promise<Set<string>> {
    const referencedImages = new Set<string>();
    
    try {
      const draftsDir = path.join(this.baseDir, username, 'drafts');
      const publishedDir = path.join(this.baseDir, username, 'published');
      
      const dirs = [draftsDir, publishedDir];
      
      for (const dir of dirs) {
        try {
          const files = await fs.readdir(dir);
          
          for (const file of files) {
            if (!file.endsWith('.json') || file.startsWith('.')) continue;
            
            const filePath = path.join(dir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const story: Story = JSON.parse(content);
            
            // 遍历所有节点，提取图片路径
            for (const node of story.nodes) {
              // 背景图
              if (node.data.image?.imagePath) {
                const imagePath = node.data.image.imagePath;
                const filename = imagePath.replace('pictures/', '');
                referencedImages.add(filename);
              }
              
              // 角色立绘
              const characterImages = (node.data as any).characterImages;
              if (characterImages) {
                if (characterImages.left?.imagePath) {
                  const filename = characterImages.left.imagePath.replace('pictures/', '');
                  referencedImages.add(filename);
                }
                if (characterImages.center?.imagePath) {
                  const filename = characterImages.center.imagePath.replace('pictures/', '');
                  referencedImages.add(filename);
                }
                if (characterImages.right?.imagePath) {
                  const filename = characterImages.right.imagePath.replace('pictures/', '');
                  referencedImages.add(filename);
                }
              }
            }
          }
        } catch (error: any) {
          // 目录不存在或读取失败，忽略
          if (error.code !== 'ENOENT') {
            console.error(`读取目录 ${dir} 失败:`, error);
          }
        }
      }
    } catch (error) {
      console.error('收集引用图片时出错:', error);
    }
    
    return referencedImages;
  }

  /**
   * 清理用户的未引用图片（未被任何故事引用的图片）
   */
  async cleanOrphanImages(username: string): Promise<{ deletedCount: number; deletedFiles: string[] }> {
    try {
      const picturesDir = this.getUserPicturesDir(username);
      
      // 检查图片目录是否存在
      try {
        await fs.access(picturesDir);
      } catch {
        return { deletedCount: 0, deletedFiles: [] };
      }
      
      // 收集所有被引用的图片
      const referencedImages = await this.collectReferencedImages(username);
      
      // 扫描图片目录
      const files = await fs.readdir(picturesDir);
      const deletedFiles: string[] = [];
      
      for (const file of files) {
        // 跳过非图片文件
        if (!file.match(/\.(webp|gif|jpg|jpeg|png)$/i)) continue;
        
        // 如果图片未被引用，删除它
        if (!referencedImages.has(file)) {
          const filePath = path.join(picturesDir, file);
          await fs.unlink(filePath);
          deletedFiles.push(file);
        }
      }
      
      return {
        deletedCount: deletedFiles.length,
        deletedFiles
      };
    } catch (error) {
      const err = error as Error;
      throw new InternalServerError(`清理未引用图片失败: ${err.message}`);
    }
  }

  /**
   * 清理所有用户的未引用图片
   */
  async cleanAllOrphanImages(): Promise<{ totalDeleted: number; userResults: Record<string, number> }> {
    try {
      const users = await fs.readdir(this.baseDir);
      const userResults: Record<string, number> = {};
      let totalDeleted = 0;
      
      for (const username of users) {
        try {
          const userPath = path.join(this.baseDir, username);
          const stats = await fs.stat(userPath);
          
          if (!stats.isDirectory()) continue;
          
          const result = await this.cleanOrphanImages(username);
          if (result.deletedCount > 0) {
            userResults[username] = result.deletedCount;
            totalDeleted += result.deletedCount;
          }
        } catch (error) {
          console.error(`清理用户 ${username} 的图片时出错:`, error);
        }
      }
      
      return { totalDeleted, userResults };
    } catch (error) {
      const err = error as Error;
      throw new InternalServerError(`批量清理失败: ${err.message}`);
    }
  }
}

