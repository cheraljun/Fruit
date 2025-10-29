/**
 * 错误处理中间件
 * 职责：统一处理错误响应
 */

import type { Request, Response, NextFunction } from 'express';
import config from '../config/index.js';
import { AppError } from '../errors/AppError.js';

/**
 * 全局错误处理
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  // 记录错误日志
  if (err instanceof AppError) {
    // 操作性错误（预期的错误，如验证失败）
    if (err.isOperational) {
      console.log(`[${err.statusCode}] ${err.message}`);
    } else {
      // 非操作性错误（意外错误，需要报警）
      console.error('严重错误:', err);
    }
  } else {
    // 未知错误
    console.error('未知错误:', err);
  }

  // 返回错误响应
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    error: message,
    statusCode,
    ...(config.logging.enableStackTrace && { stack: err.stack })
  });
}

/**
 * 404处理
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: `路径未找到: ${req.originalUrl}`
  });
}

