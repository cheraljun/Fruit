#!/usr/bin/env node
/**
 * 自动化构建独立播放器模板
 * 职责：构建Visual Novel播放器，生成HTML模板
 * 
 * 用法：node player-standalone/build.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('    mo 独立播放器构建脚本');

const players = [
  { name: 'Visual Novel', dir: 'visual-novel' }
];

let success = true;

for (const player of players) {
  const playerDir = path.join(__dirname, player.dir);
  
  console.log(`\n[${player.name}] 开始构建...`);
  
  try {
    // 检查是否已安装依赖
    const nodeModulesPath = path.join(playerDir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`[${player.name}] 安装依赖...`);
      execSync('npm install', {
        cwd: playerDir,
        stdio: 'inherit'
      });
    }
    
    // 构建
    console.log(`[${player.name}] 打包中...`);
    execSync('npm run build', {
      cwd: playerDir,
      stdio: 'inherit'
    });
    
    console.log(`[${player.name}] ✓ 构建成功`);
    
  } catch (error) {
    console.error(`[${player.name}] ✗ 构建失败`);
    console.error(error.message);
    success = false;
  }
}

if (success) {
  console.log('✓ 播放器构建完成！');
  console.log('\n模板文件位置：');
  console.log('  - frontend/public/templates/visual-novel-player.html');
} else {
  console.log('✗ 播放器构建失败，请检查错误信息');
  process.exit(1);
}

