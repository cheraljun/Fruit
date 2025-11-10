/**
 * 自定义错误类
 * 职责：统一错误处理，支持HTTP状态码
 */

/**
 * 应用错误基类
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // 维护正确的堆栈跟踪
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - 验证错误
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * 401 - 未授权
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权') {
    super(message, 401);
  }
}

/**
 * 403 - 禁止访问
 */
export class ForbiddenError extends AppError {
  constructor(message: string = '禁止访问') {
    super(message, 403);
  }
}

/**
 * 404 - 未找到
 */
export class NotFoundError extends AppError {
  constructor(message: string = '资源不存在') {
    super(message, 404);
  }
}

/**
 * 409 - 冲突
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * 500 - 服务器内部错误
 */
export class InternalServerError extends AppError {
  constructor(message: string = '服务器内部错误') {
    super(message, 500, false); // 非操作性错误，需要报警
  }
}

