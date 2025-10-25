/**
 * 定时清理服务
 * 职责：每天0:00自动清理未引用图片
 */

import { ImageService } from './ImageService.js';

export class CleanupService {
  private imageService: ImageService;
  private timer: NodeJS.Timeout | null = null;

  constructor(imageService: ImageService) {
    this.imageService = imageService;
  }

  /**
   * 计算到下一个0:00的毫秒数
   */
  private getMillisecondsUntilMidnight(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  }

  /**
   * 执行清理任务
   */
  private async performCleanup(): Promise<void> {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 开始执行未引用图片清理任务...`);
    
    try {
      const result = await this.imageService.cleanAllOrphanImages();
      
      if (result.totalDeleted > 0) {
        console.log(`[${timestamp}] 清理完成: 共删除 ${result.totalDeleted} 张未引用图片`);
        console.log(`[${timestamp}] 详细信息:`, result.userResults);
      } else {
        console.log(`[${timestamp}] 清理完成: 未发现未引用图片`);
      }
    } catch (error) {
      console.error(`[${timestamp}] 清理任务失败:`, error);
    }
  }

  /**
   * 调度下一次清理任务
   */
  private scheduleNextCleanup(): void {
    const msUntilMidnight = this.getMillisecondsUntilMidnight();
    
    this.timer = setTimeout(async () => {
      await this.performCleanup();
      this.scheduleNextCleanup(); // 递归调度下一次
    }, msUntilMidnight);
    
    const nextRun = new Date(Date.now() + msUntilMidnight);
    console.log(`下一次未引用图片清理任务将在: ${nextRun.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  }

  /**
   * 启动定时清理服务
   */
  start(): void {
    console.log('未引用图片定时清理服务已启动');
    this.scheduleNextCleanup();
  }

  /**
   * 停止定时清理服务
   */
  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      console.log('未引用图片定时清理服务已停止');
    }
  }
}

