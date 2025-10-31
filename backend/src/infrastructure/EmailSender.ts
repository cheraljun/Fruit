/**
 * 邮件发送基础设施
 * 职责：封装邮件发送逻辑
 * 
 * 设计原则：
 * - 单一职责：只负责发送邮件，不关心业务逻辑
 * - 使用nodemailer库
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { emailConfig, isEmailConfigured } from '../config/email.js';
import { InternalServerError } from '../errors/AppError.js';

export class EmailSender {
  private transporter: Transporter | null = null;

  constructor() {
    if (isEmailConfigured()) {
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
          user: emailConfig.auth.user,
          pass: emailConfig.auth.pass,
        },
      });
    }
  }

  /**
   * 检查邮件服务是否可用
   */
  isAvailable(): boolean {
    return this.transporter !== null;
  }

  /**
   * 发送验证码邮件
   */
  async sendVerificationCode(to: string, code: string): Promise<void> {
    if (!this.transporter) {
      throw new InternalServerError('邮件服务未配置，请联系管理员');
    }

    const mailOptions = {
      from: emailConfig.from,
      to,
      subject: 'mo - 邮箱验证码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">mo邮箱验证</h2>
          <p style="font-size: 16px; color: #666;">您的验证码是：</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #333; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #999;">验证码30分钟内有效，请勿泄露给他人。</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">这是一封自动发送的邮件，请勿回复。</p>
        </div>
      `,
      text: `您的验证码是：${code}（30分钟内有效）`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`验证码邮件已发送至: ${to}`);
    } catch (error) {
      const err = error as Error;
      console.error('邮件发送失败:', err);
      throw new InternalServerError(`邮件发送失败: ${err.message}`);
    }
  }

  /**
   * 发送邮箱绑定成功通知
   */
  async sendBindingSuccessNotification(to: string, username: string): Promise<void> {
    if (!this.transporter) {
      throw new InternalServerError('邮件服务未配置');
    }

    const mailOptions = {
      from: emailConfig.from,
      to,
      subject: 'mo - 邮箱绑定成功',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">邮箱绑定成功</h2>
          <p style="font-size: 16px; color: #666;">您好，${username}！</p>
          <p style="font-size: 14px; color: #666;">您的账户已成功绑定此邮箱。现在您可以使用邮箱+验证码的方式登录。</p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">如果这不是您本人的操作，请立即联系我们。</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">这是一封自动发送的邮件，请勿回复。</p>
        </div>
      `,
      text: `您的账户 ${username} 已成功绑定此邮箱。`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`绑定成功通知已发送至: ${to}`);
    } catch (error) {
      // 绑定成功通知发送失败不影响业务
      const err = error as Error;
      console.error('通知邮件发送失败:', err);
    }
  }
}

