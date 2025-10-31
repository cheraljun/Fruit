/**
 * 邮箱配置文件
 * 职责：集中管理邮件发送配置
 * 
 * 使用说明：
 * 1. QQ邮箱需要开启SMTP服务并获取授权码（不是QQ密码）
 * 2. 在.env文件中配置：
 *    EMAIL_USER=your-qq-email@qq.com
 *    EMAIL_AUTH_CODE=your-smtp-authorization-code
 *    EMAIL_FROM="mo" <your-qq-email@qq.com>
 * 3. QQ邮箱SMTP服务器：smtp.qq.com，端口：465（SSL）
 */

export interface EmailConfig {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

/**
 * 邮箱配置
 * 从环境变量读取，如未配置则使用占位符（需要用户自行配置）
 */
export const emailConfig: EmailConfig = {
  service: 'qq',
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // 使用SSL
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_AUTH_CODE || '',
  },
  from: process.env.EMAIL_FROM || '"mo" <noreply@example.com>',
};

/**
 * 验证邮箱配置是否完整
 */
export function isEmailConfigured(): boolean {
  return !!(emailConfig.auth.user && emailConfig.auth.pass);
}

