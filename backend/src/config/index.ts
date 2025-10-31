/**
 * 后端配置文件
 * 职责：集中管理所有后端配置项
 * 
 * 配置加载顺序：
 * 1. 尝试读取.env文件
 * 2. 如果不存在，使用默认值
 */

import dotenv from 'dotenv';

// 加载.env文件（如果存在）
dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

interface ServerConfig {
  port: number;
  host: string;
}

interface ApiConfig {
  prefix: string;
}

interface CorsConfig {
  origin: string;
  credentials: boolean;
}

interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  enableStackTrace: boolean;
}

interface AppConfig {
  name: string;
  version: string;
  isDevelopment: boolean;
}

interface Config {
  server: ServerConfig;
  api: ApiConfig;
  cors: CorsConfig;
  logging: LoggingConfig;
  app: AppConfig;
}

const config: Config = {
  // 服务器配置
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || 'localhost',
  },

  // API路由配置
  api: {
    prefix: '/api',
  },

  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  // 日志配置
  logging: {
    level: isDevelopment ? 'debug' : 'info',
    enableStackTrace: isDevelopment,
  },

  // 应用配置
  app: {
    name: 'mo API',
    version: '1.0.0',
    isDevelopment,
  },
};

export default config;

