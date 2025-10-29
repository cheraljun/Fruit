/**
 * JWT认证中间件
 * 职责：验证请求中的JWT token
 * 
 * 设计原则：
 * - 只验证token有效性，不处理业务逻辑
 * - 将用户信息注入到 req.user
 */

import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JWTPayload {
  username: string;
  iat: number;
  exp: number;
}

// 扩展Express Request类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
      };
    }
  }
}

/**
 * 验证JWT token中间件
 * 
 * 从请求头中提取token并验证：
 * Authorization: Bearer <token>
 */
export function authenticateToken(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw new UnauthorizedError('未提供认证令牌');
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = { username: payload.username };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('认证令牌已过期');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('认证令牌无效');
    }
    throw new UnauthorizedError('认证失败');
  }
}

/**
 * 生成JWT token
 */
export function generateToken(username: string): string {
  return jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '7d' } // 7天过期
  );
}

