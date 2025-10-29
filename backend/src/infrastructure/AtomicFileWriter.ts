/**
 * 原子文件写入工具
 * 职责：提供可靠的文件写入操作，防止数据损坏
 * 
 * 原理：
 * 1. 先写入临时文件
 * 2. 原子重命名（操作系统保证原子性）
 * 3. 即使崩溃，原文件不会损坏
 */

import fs from 'fs/promises';

export class AtomicFileWriter {
  /**
   * 原子写入文件
   * @param filePath 目标文件路径
   * @param content 文件内容
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    const tempFile = `${filePath}.tmp.${Date.now()}`;
    
    try {
      // 1. 写入临时文件
      await fs.writeFile(tempFile, content, 'utf-8');
      
      // 2. 原子重命名（要么成功，要么失败，不会损坏）
      await fs.rename(tempFile, filePath);
    } catch (error) {
      // 清理临时文件
      try {
        await fs.unlink(tempFile);
      } catch {
        // 忽略清理失败
      }
      throw error;
    }
  }

  /**
   * 原子写入JSON
   * @param filePath 目标文件路径
   * @param data JSON数据
   */
  async writeJSON(filePath: string, data: any): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    await this.writeFile(filePath, content);
  }
}

