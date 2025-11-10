/**
 * 测试 launcher.js 的路径解析
 * 用于调试打包后的启动流程
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('测试 launcher.js 路径解析');
console.log('='.repeat(60));
console.log('');

// 模拟打包后的目录结构
const simulatedAppDir = path.join(__dirname, 'temp', 'app');

console.log('假设的 app 目录:', simulatedAppDir);
console.log('');

// 测试各个路径
const paths = {
  'launcher.js': path.join(simulatedAppDir, 'launcher.js'),
  'backend/dist': path.join(simulatedAppDir, 'backend', 'dist'),
  'backend/dist/app.js': path.join(simulatedAppDir, 'backend', 'dist', 'app.js'),
  'frontend/dist': path.join(simulatedAppDir, 'frontend', 'dist'),
  'player-standalone/visual-novel/dist': path.join(simulatedAppDir, 'player-standalone', 'visual-novel', 'dist'),
};

console.log('预期的文件路径：');
console.log('');

for (const [name, fullPath] of Object.entries(paths)) {
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✓ 存在' : '✗ 不存在';
  const color = exists ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m  ${name}`);
  console.log(`       ${fullPath}`);
  console.log('');
}

console.log('='.repeat(60));
console.log('');
console.log('如果所有路径都存在，说明打包结构正确');
console.log('');

