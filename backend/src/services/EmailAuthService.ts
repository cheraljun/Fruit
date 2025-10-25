/**
 * 邮箱认证服务
 * 职责：处理邮箱验证码的生成、验证、邮箱绑定和邮箱登录
 * 
 * 设计原则：
 * - 单一职责：只处理邮箱认证相关逻辑
 * - 验证码存储在内存中（服务器重启会丢失，但对用户影响小）
 * - 限流保护：同一邮箱1分钟内只能发送1次验证码
 */

import type { IAuthorRepository } from '../repositories/interfaces/IStoryRepository.js';
import { EmailSender } from '../infrastructure/EmailSender.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../errors/AppError.js';
import { generateToken } from '../middleware/authMiddleware.js';

interface VerificationCode {
  code: string;
  expiresAt: number;
  attempts: number; // 剩余尝试次数
}

interface RateLimitRecord {
  lastSentAt: number;
}

interface EmailLoginResult {
  success: boolean;
  username: string;
  token: string;
}

export class EmailAuthService {
  // 验证码存储（邮箱 -> 验证码信息）
  private verificationCodes = new Map<string, VerificationCode>();
  
  // 限流记录（邮箱 -> 最后发送时间）
  private rateLimits = new Map<string, RateLimitRecord>();
  
  private emailSender: EmailSender;
  
  // 每日发送量限制
  private dailyCount = 0;
  private dailyLimitResetTime = Date.now();
  private lastGlobalSendTime = 0;
  
  // 配置常量
  private readonly CODE_EXPIRY_MS = 30 * 60 * 1000; // 30分钟
  private readonly RATE_LIMIT_MS = 60 * 1000; // 1分钟
  private readonly MAX_ATTEMPTS = 5; // 最多尝试5次
  private readonly DAILY_LIMIT = 200; // 每天最多200封
  private readonly GLOBAL_INTERVAL_MS = 10 * 1000; // 全局10秒间隔

  constructor(
    private authorRepo: IAuthorRepository,
    emailSender?: EmailSender
  ) {
    this.emailSender = emailSender || new EmailSender();
    
    // 定期清理过期验证码（每10分钟）
    setInterval(() => this.cleanupExpiredCodes(), 10 * 60 * 1000);
  }

  /**
   * 生成6位数字验证码
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 验证邮箱格式
   */
  private validateEmail(email: string): void {
    if (!email || email.trim() === '') {
      throw new ValidationError('邮箱不能为空');
    }

    // 基本邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('邮箱格式不正确');
    }

    // 长度限制
    if (email.length > 100) {
      throw new ValidationError('邮箱长度不能超过100个字符');
    }
  }

  /**
   * 检查每日发送总量限制
   */
  private checkDailyLimit(): void {
    const now = Date.now();
    
    // 每天0点重置计数（检查是否过了24小时）
    if (now - this.dailyLimitResetTime > 24 * 60 * 60 * 1000) {
      this.dailyCount = 0;
      this.dailyLimitResetTime = now;
    }
    
    if (this.dailyCount >= this.DAILY_LIMIT) {
      throw new ValidationError('今日邮件发送已达上限，请明天再试或使用用户名密码登录');
    }
  }

  /**
   * 检查全局发送间隔（防止短时间大量发送）
   */
  private checkGlobalInterval(): void {
    const now = Date.now();
    const timeSinceLastSend = now - this.lastGlobalSendTime;
    
    if (timeSinceLastSend < this.GLOBAL_INTERVAL_MS) {
      const waitSeconds = Math.ceil((this.GLOBAL_INTERVAL_MS - timeSinceLastSend) / 1000);
      throw new ValidationError(`系统繁忙，请等待${waitSeconds}秒后重试`);
    }
  }

  /**
   * 检查限流
   */
  private checkRateLimit(email: string): void {
    const record = this.rateLimits.get(email);
    if (record) {
      const timeSinceLastSent = Date.now() - record.lastSentAt;
      if (timeSinceLastSent < this.RATE_LIMIT_MS) {
        const waitSeconds = Math.ceil((this.RATE_LIMIT_MS - timeSinceLastSent) / 1000);
        throw new ValidationError(`发送验证码过于频繁，请等待${waitSeconds}秒后重试`);
      }
    }
  }

  /**
   * 更新限流记录
   */
  private updateRateLimit(email: string): void {
    this.rateLimits.set(email, { lastSentAt: Date.now() });
  }

  /**
   * 清理过期验证码
   */
  private cleanupExpiredCodes(): void {
    const now = Date.now();
    for (const [email, record] of this.verificationCodes.entries()) {
      if (now > record.expiresAt) {
        this.verificationCodes.delete(email);
      }
    }
  }

  /**
   * 发送验证码到邮箱
   * 用途：邮箱绑定、邮箱登录
   */
  async sendVerificationCode(email: string): Promise<void> {
    // 验证邮箱格式
    this.validateEmail(email);

    // 检查邮件服务是否可用
    if (!this.emailSender.isAvailable()) {
      throw new ValidationError('邮件服务未配置，暂时无法使用邮箱功能');
    }

    // 检查每日发送总量
    this.checkDailyLimit();

    // 检查全局发送间隔
    this.checkGlobalInterval();

    // 限流检查（单个邮箱）
    this.checkRateLimit(email);

    // 生成验证码
    const code = this.generateCode();
    const expiresAt = Date.now() + this.CODE_EXPIRY_MS;

    // 存储验证码
    this.verificationCodes.set(email, {
      code,
      expiresAt,
      attempts: this.MAX_ATTEMPTS,
    });

    // 更新限流记录
    this.updateRateLimit(email);

    // 发送邮件
    await this.emailSender.sendVerificationCode(email, code);

    // 更新全局发送时间和每日计数
    this.lastGlobalSendTime = Date.now();
    this.dailyCount++;
    
    // 接近限额时预警
    if (this.dailyCount > this.DAILY_LIMIT * 0.8) {
      console.warn(`警告：今日邮件发送量已达80% (${this.dailyCount}/${this.DAILY_LIMIT})`);
    }
  }

  /**
   * 验证验证码
   */
  private verifyCode(email: string, code: string): boolean {
    const record = this.verificationCodes.get(email);

    if (!record) {
      throw new ValidationError('验证码不存在或已过期，请重新获取');
    }

    // 检查是否过期
    if (Date.now() > record.expiresAt) {
      this.verificationCodes.delete(email);
      throw new ValidationError('验证码已过期，请重新获取');
    }

    // 减少尝试次数
    record.attempts--;

    // 检查验证码是否正确
    if (record.code !== code) {
      if (record.attempts <= 0) {
        this.verificationCodes.delete(email);
        throw new ValidationError('验证码错误次数过多，请重新获取');
      }
      throw new ValidationError(`验证码错误，还剩${record.attempts}次尝试机会`);
    }

    // 验证成功，删除验证码
    this.verificationCodes.delete(email);
    return true;
  }

  /**
   * 绑定邮箱（需要验证验证码）
   */
  async bindEmail(username: string, email: string, code: string): Promise<void> {
    // 验证邮箱格式
    this.validateEmail(email);

    // 验证验证码
    this.verifyCode(email, code);

    // 检查用户是否存在
    const author = await this.authorRepo.findByUsername(username);
    if (!author) {
      throw new NotFoundError('用户不存在');
    }

    // 检查邮箱是否已被其他用户绑定
    const existingAuthor = await this.authorRepo.findByEmail(email);
    if (existingAuthor && existingAuthor.username !== username) {
      throw new ValidationError('该邮箱已被其他用户绑定');
    }

    // 更新邮箱信息
    await this.authorRepo.updateEmail(username, email);

    // 发送绑定成功通知
    await this.emailSender.sendBindingSuccessNotification(email, username);

    console.log(`用户 ${username} 绑定邮箱: ${email}`);
  }

  /**
   * 解绑邮箱
   */
  async unbindEmail(username: string): Promise<void> {
    // 检查用户是否存在
    const author = await this.authorRepo.findByUsername(username);
    if (!author) {
      throw new NotFoundError('用户不存在');
    }

    // 检查是否已绑定邮箱
    if (!author.email) {
      throw new ValidationError('您尚未绑定邮箱');
    }

    // 清除邮箱信息（传入空字符串表示解绑）
    await this.authorRepo.updateEmail(username, '');

    console.log(`用户 ${username} 解绑邮箱`);
  }

  /**
   * 邮箱登录（验证码登录）
   */
  async loginWithEmail(email: string, code: string): Promise<EmailLoginResult> {
    // 验证邮箱格式
    this.validateEmail(email);

    // 验证验证码
    this.verifyCode(email, code);

    // 查找绑定该邮箱的用户
    const author = await this.authorRepo.findByEmail(email);
    if (!author) {
      throw new UnauthorizedError('该邮箱未绑定任何账户');
    }

    // 生成token
    const token = generateToken(author.username);

    console.log(`用户 ${author.username} 邮箱登录`);

    return {
      success: true,
      username: author.username,
      token,
    };
  }

  /**
   * 检查邮箱是否已绑定
   */
  async isEmailBound(email: string): Promise<boolean> {
    this.validateEmail(email);
    const author = await this.authorRepo.findByEmail(email);
    return author !== null;
  }

  /**
   * 获取用户绑定的邮箱
   */
  async getUserEmail(username: string): Promise<string | null> {
    const author = await this.authorRepo.findByUsername(username);
    return author?.email || null;
  }
}

