/**
 * mo 桌面版启动脚本
 * 功能：
 * 1. 检测端口占用
 * 2. 设置环境变量
 * 3. 启动后端服务
 * 4. 打开浏览器
 */

import { createServer } from 'net';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const PORT = 3001;
const HOST = 'localhost';
const URL = `http://${HOST}:${PORT}`;

// 路径配置
const FRONTEND_PATH = path.join(__dirname, 'frontend', 'dist');
const USER_DATA_PATH = path.join(__dirname, '..', 'userdata');
const PID_FILE = path.join(__dirname, '..', 'app.pid');

// 设置环境变量
process.env.NODE_ENV = 'production';
process.env.PORT = String(PORT);
process.env.HOST = HOST;
process.env.DESKTOP_MODE = 'true';
process.env.CORS_ORIGIN = URL;
process.env.FRONTEND_PATH = FRONTEND_PATH;
process.env.USER_DATA_PATH = USER_DATA_PATH;

// 确保用户数据目录存在
if (!fs.existsSync(USER_DATA_PATH)) {
  fs.mkdirSync(USER_DATA_PATH, { recursive: true });
}

// 写入 PID 文件
fs.writeFileSync(PID_FILE, String(process.pid));

console.log('');
console.log('mo 互动小说编辑器 - 桌面版');
console.log('');
console.log('正在启动服务...');
console.log('');

/**
 * 检测端口是否被占用
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // 端口被占用
      } else {
        resolve(true);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true); // 端口可用
    });
    
    server.listen(port, HOST);
  });
}

/**
 * 打开浏览器
 */
function openBrowser(url) {
  console.log(`正在打开浏览器: ${url}`);
  console.log('');
  
  // Windows 使用 start 命令
  exec(`start ${url}`, (error) => {
    if (error) {
      console.error('无法自动打开浏览器，请手动访问:', url);
    }
  });
}

/**
 * 等待服务器就绪
 */
function waitForServer(url, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const check = () => {
      attempts++;
      
      fetch(url + '/health')
        .then(res => {
          if (res.ok) {
            resolve();
          } else {
            retry();
          }
        })
        .catch(() => {
          retry();
        });
    };
    
    const retry = () => {
      if (attempts >= maxAttempts) {
        reject(new Error('服务器启动超时'));
      } else {
        setTimeout(check, 500);
      }
    };
    
    check();
  });
}

/**
 * 主启动流程
 */
async function main() {
  try {
    // 1. 检测端口
    console.log(`[1/4] 检测端口 ${PORT}...`);
    const isPortAvailable = await checkPort(PORT);
    
    if (!isPortAvailable) {
      console.error('');
      console.error(`错误: 端口 ${PORT} 已被占用！`);
      console.error('');
      console.error('可能的原因：');
      console.error('  1. mo 已经在运行');
      console.error('  2. 其他程序占用了该端口');
      console.error('');
      console.error('解决方法：');
      console.error('  1. 关闭已有的命令行窗口');
      console.error('  2. 或直接访问: ' + URL);
      console.error('');
      process.exit(1);
    }
    
    console.log('      端口可用 ✓');
    console.log('');
    
    // 2. 配置环境
    console.log('[2/4] 配置环境变量...');
    console.log(`      前端路径: ${FRONTEND_PATH}`);
    console.log(`      数据路径: ${USER_DATA_PATH}`);
    console.log('      环境配置完成 ✓');
    console.log('');
    
    // 3. 启动后端
    console.log('[3/4] 启动后端服务...');
    
    // 动态导入后端应用（Windows 需要 file:// URL）
    const backendPath = path.join(__dirname, 'backend', 'dist', 'app.js');
    const backendURL = pathToFileURL(backendPath).href;
    await import(backendURL);
    
    console.log('      后端服务已启动 ✓');
    console.log('');
    
    // 4. 等待服务就绪并打开浏览器
    console.log('[4/4] 等待服务就绪...');
    await waitForServer(URL);
    
    console.log('      服务就绪 ✓');
    console.log('');
    console.log('启动成功！');
    console.log('');
    console.log(`  访问地址: ${URL}`);
    console.log('  数据目录: userdata/');
    console.log('');
    console.log('  关闭此窗口将停止服务');
    console.log('');
    
    openBrowser(URL);
    
  } catch (error) {
    console.error('');
    console.error('启动失败:', error.message);
    console.error('');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// 优雅退出
process.on('SIGINT', () => {
  console.log('');
  console.log('正在关闭服务...');
  
  // 删除 PID 文件
  try {
    fs.unlinkSync(PID_FILE);
  } catch (err) {
    // 忽略错误
  }
  
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('');
  console.log('正在关闭服务...');
  
  // 删除 PID 文件
  try {
    fs.unlinkSync(PID_FILE);
  } catch (err) {
    // 忽略错误
  }
  
  process.exit(0);
});

// 启动
main();

