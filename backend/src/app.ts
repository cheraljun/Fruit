/**
 * Express 应用入口
 * 职责：启动服务器，配置中间件
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import config from './config/index.js';
import authorRouter, { imageService } from './routes/author.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { CleanupService } from './services/CleanupService.js';

const app = express();

// 中间件
app.use(cors(config.cors));
app.use(express.json({ limit: '50mb' })); // 增加请求体大小限制支持图片数据
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 静态文件服务：提供用户图片访问
app.use('/userdata', express.static(path.join(process.cwd(), 'userdata')));

// 路由（作者工作区系统）
app.use(`${config.api.prefix}`, authorRouter);

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    service: config.app.name,
    version: config.app.version,
    联系: '微信号：yes_smile_peace',
    邀请:'欢迎一起维护这个项目！'
  });
});

// 404处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

// 启动时初始化
async function bootstrap() {
  try {
    // 确保用户数据目录存在
    await fs.mkdir('userdata', { recursive: true });
    console.log('用户数据目录已就绪');
    
    // 启动定时清理服务
    const cleanupService = new CleanupService(imageService);
    cleanupService.start();
    
    // 优雅关闭
    process.on('SIGTERM', () => {
      console.log('收到SIGTERM信号，准备关闭...');
      cleanupService.stop();
      process.exit(0);
    });
    
    process.on('SIGINT', () => {
      console.log('收到SIGINT信号，准备关闭...');
      cleanupService.stop();
      process.exit(0);
    });
    
    // 启动服务器
    app.listen(config.server.port, () => {
      console.log(`后端服务运行在 http://${config.server.host}:${config.server.port}`);
      console.log(`API: http://${config.server.host}:${config.server.port}${config.api.prefix}`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

// 执行启动
bootstrap();

