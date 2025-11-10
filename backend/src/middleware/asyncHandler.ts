/**
 * 异步路由处理器包装器
 * 职责：捕获async函数中的错误，传递给错误处理中间件
 * 
 * 使用方式：
 * router.get('/path', asyncHandler(async (req, res) => {
 *   // 不需要写 try-catch
 *   throw new ValidationError('错误信息'); // 会自动被捕获
 * }));
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * 包装异步路由处理器，自动捕获错误
 * 支持泛型参数以匹配Express的Request类型
 */
export const asyncHandler = <P = any, ResBody = any, ReqBody = any>(
  fn: (req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFunction) => Promise<void | Response>
): RequestHandler<P, ResBody, ReqBody> => {
  return (req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

