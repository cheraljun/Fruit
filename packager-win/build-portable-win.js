/**
 * mo 桌面版打包脚本
 * 
 * 功能：
 * 1. 构建所有模块（backend, frontend, player-standalone）
 * 2. 下载 Node.js 便携版
 * 3. 复制文件并安装生产依赖
 * 4. 生成启动器
 * 5. 打包成 ZIP
 */

import { exec, execSync } from 'child_process';
import fs, { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import archiver from 'archiver';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  nodeVersion: '18.20.4', // LTS 版本
  nodeDistUrl: 'https://npmmirror.com/mirrors/node', // 使用国内镜像
  outputDir: path.join(__dirname, 'output'),
  tempDir: path.join(__dirname, 'temp'),
  projectRoot: path.join(__dirname, '..'),
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, total, message) {
  log(`\n[${ step}/${total}] ${message}`, colors.bright + colors.blue);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

/**
 * 确保目录存在
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 删除目录
 */
function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * 复制目录
 */
function copyDir(src, dest, filter = null) {
  ensureDir(dest);
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // 应用过滤器
    if (filter && !filter(srcPath, entry)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, filter);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 复制文件
 */
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

/**
 * 执行命令（带日志）
 */
async function runCommand(command, cwd = null, description = '') {
  if (description) {
    log(`  ${description}...`);
  }
  
  try {
    const options = cwd ? { cwd, maxBuffer: 10 * 1024 * 1024 } : { maxBuffer: 10 * 1024 * 1024 };
    const { stdout, stderr } = await execAsync(command, options);
    
    if (stderr && !stderr.includes('npm warn') && !stderr.includes('npm WARN')) {
      logWarning('标准错误输出:');
      console.error(stderr);
    }
    
    return stdout;
  } catch (error) {
    logError(`命令执行失败: ${command}`);
    logError(`工作目录: ${cwd || process.cwd()}`);
    logError(`错误信息: ${error.message}`);
    
    // 显示完整的输出
    if (error.stdout) {
      log('\n标准输出:', colors.yellow);
      console.log(error.stdout);
    }
    if (error.stderr) {
      log('\n标准错误:', colors.red);
      console.error(error.stderr);
    }
    
    throw error;
  }
}

/**
 * Step 1: 构建所有模块
 */
async function buildModules() {
  logStep(1, 6, '构建所有模块');
  
  const modules = [
    {
      name: 'player-standalone',
      dir: path.join(CONFIG.projectRoot, 'player-standalone'),
      build: 'node build.js',
    },
    {
      name: 'backend',
      dir: path.join(CONFIG.projectRoot, 'backend'),
      build: 'npm run build',
    },
    {
      name: 'frontend',
      dir: path.join(CONFIG.projectRoot, 'frontend'),
      build: 'npm run build',
    },
  ];
  
  for (const module of modules) {
    log(`  构建 ${module.name}... ${module.note || ''}`);
    
    // 检查是否需要安装依赖
    const nodeModulesPath = path.join(module.dir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      log(`  安装 ${module.name} 依赖...`);
      await runCommand('npm install', module.dir);
      logSuccess(`  ${module.name} 依赖安装完成`);
    } else {
      log(`  ${module.name} 依赖已存在，跳过安装`);
    }
    
    // 执行构建
    log(`  开始编译 ${module.name}...`);
    await runCommand(module.build, module.dir);
    logSuccess(`${module.name} 构建完成`);
  }
  
  logSuccess('所有模块构建完成');
}

/**
 * Step 2: 下载 Node.js 便携版
 */
async function downloadNodeJS() {
  logStep(2, 6, '下载 Node.js 便携版');
  
  const nodeDir = path.join(CONFIG.tempDir, 'nodejs');
  
  // 如果已存在，跳过下载
  if (fs.existsSync(nodeDir) && fs.existsSync(path.join(nodeDir, 'node.exe'))) {
    logWarning('Node.js 已存在，跳过下载');
    return nodeDir;
  }
  
  const version = CONFIG.nodeVersion;
  const platform = 'win-x64';
  const filename = `node-v${version}-${platform}.zip`;
  const url = `${CONFIG.nodeDistUrl}/v${version}/${filename}`;
  const zipPath = path.join(CONFIG.tempDir, filename);
  
  log(`  下载 Node.js v${version} (${platform})`);
  log(`  URL: ${url}`);
  
  // 下载文件
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载失败: ${response.statusText}`);
  }
  
  const fileStream = fs.createWriteStream(zipPath);
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
  
  logSuccess('下载完成');
  
  // 解压
  log('  解压中...');
  
  // 使用 PowerShell 解压（Windows 原生支持）
  const extractDir = path.join(CONFIG.tempDir, 'node-extract');
  ensureDir(extractDir);
  
  const psCommand = `Expand-Archive -Path "${zipPath}" -DestinationPath "${extractDir}" -Force`;
  execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
  
  // 移动到目标目录
  const extractedDir = path.join(extractDir, `node-v${version}-${platform}`);
  if (fs.existsSync(nodeDir)) {
    removeDir(nodeDir);
  }
  fs.renameSync(extractedDir, nodeDir);
  
  // 清理
  fs.unlinkSync(zipPath);
  removeDir(extractDir);
  
  logSuccess('Node.js 准备完成');
  
  return nodeDir;
}

/**
 * Step 3: 复制应用文件
 */
async function copyAppFiles() {
  logStep(3, 6, '复制应用文件');
  
  const appDir = path.join(CONFIG.tempDir, 'app');
  ensureDir(appDir);
  
  // 复制 backend
  log('  复制 backend...');
  const backendSrc = path.join(CONFIG.projectRoot, 'backend');
  const backendDest = path.join(appDir, 'backend');
  
  copyDir(backendSrc, backendDest, (srcPath, entry) => {
    const name = entry.name;
    const relativePath = path.relative(backendSrc, srcPath);
    
    // 跳过 node_modules
    if (name === 'node_modules') return false;
    
    // 只跳过顶层的 src 目录（TypeScript 源码），保留 dist/backend/src（编译后的 JS）
    if (name === 'src' && entry.isDirectory() && relativePath === 'src') return false;
    
    // 跳过 .ts 文件（但保留 .d.ts）
    if (name.endsWith('.ts') && !name.endsWith('.d.ts')) return false;
    
    return true;
  });
  
  logSuccess('backend 复制完成');
  
  // 复制 frontend
  log('  复制 frontend/dist...');
  const frontendSrc = path.join(CONFIG.projectRoot, 'frontend', 'dist');
  const frontendDest = path.join(appDir, 'frontend', 'dist');
  
  if (!fs.existsSync(frontendSrc)) {
    throw new Error('frontend/dist 不存在，请先构建前端');
  }
  
  copyDir(frontendSrc, frontendDest);
  logSuccess('frontend 复制完成');
  
  // 复制 player-standalone（检查是否存在）
  const vnPlayerSrc = path.join(CONFIG.projectRoot, 'player-standalone', 'visual-novel', 'dist');
  
  if (fs.existsSync(vnPlayerSrc)) {
    log('  复制 player-standalone...');
    const playerDest = path.join(appDir, 'player-standalone');
    
    copyDir(vnPlayerSrc, path.join(playerDest, 'visual-novel', 'dist'));
    logSuccess('  - visual-novel 播放器复制完成');
  } else {
    logWarning('player-standalone 未构建，跳过');
  }
  
  logSuccess('应用文件复制完成');
  
  return appDir;
}

/**
 * Step 4: 安装生产依赖
 */
async function installProductionDeps() {
  logStep(4, 6, '安装生产依赖');
  
  const backendDir = path.join(CONFIG.tempDir, 'app', 'backend');
  
  log('  安装 backend 依赖...');
  
  const lockFile = path.join(backendDir, 'package-lock.json');
  const hasLockFile = existsSync(lockFile);
  
  if (hasLockFile) {
    log('    使用 npm ci（有 lock 文件）');
    await runCommand('npm ci --omit=dev --no-audit --no-fund', backendDir);
  } else {
    log('    使用 npm install（无 lock 文件）');
    await runCommand('npm install --omit=dev --no-audit --no-fund', backendDir);
  }
  
  logSuccess('backend 依赖安装完成');
  logSuccess('生产依赖安装完成');
}

/**
 * Step 5: 生成启动器和文档
 */
async function generateLauncher() {
  logStep(5, 6, '生成启动器和文档');
  
  const templatesDir = path.join(__dirname, 'templates');
  const outputRoot = CONFIG.tempDir;
  const appDir = path.join(outputRoot, 'app');
  
  // 创建 app/package.json（标记为 ES Module）
  log('  生成 app/package.json...');
  const appPackageJson = {
    name: 'mo-desktop-app',
    version: '1.0.0',
    type: 'module',
    description: 'mo 互动小说编辑器 - 桌面版',
  };
  fs.writeFileSync(
    path.join(appDir, 'package.json'),
    JSON.stringify(appPackageJson, null, 2)
  );
  logSuccess('app/package.json 已生成');
  
  // 复制 launcher.js
  log('  生成 launcher.js...');
  copyFile(
    path.join(templatesDir, 'launcher-win.js'),
    path.join(appDir, 'launcher.js')
  );
  logSuccess('launcher.js 已生成');
  
  // 复制启动脚本
  log('  生成启动脚本...');
  copyFile(
    path.join(templatesDir, '双击启动-win.cmd'),
    path.join(outputRoot, '双击启动.cmd')
  );
  logSuccess('双击启动.cmd 已生成');
  
  // 复制使用说明
  log('  生成使用说明...');
  copyFile(
    path.join(templatesDir, '使用说明-win.txt'),
    path.join(outputRoot, '使用说明.txt')
  );
  logSuccess('使用说明.txt 已生成');
  
  // 创建 userdata 目录
  log('  创建 userdata 目录...');
  ensureDir(path.join(outputRoot, 'userdata'));
  logSuccess('userdata 目录已创建');
  
  // 复制微信二维码
  log('  复制微信二维码...');
  const assetsDir = path.join(CONFIG.projectRoot, 'frontend', 'src', 'assets');
  const qrFiles = ['wechat-qr.png', 'wechat-person.png'];
  
  for (const qrFile of qrFiles) {
    const srcPath = path.join(assetsDir, qrFile);
    if (existsSync(srcPath)) {
      copyFile(srcPath, path.join(outputRoot, qrFile));
      logSuccess(`  ${qrFile} 已复制`);
    }
  }
  
  logSuccess('启动器和文档生成完成');
}

/**
 * Step 6: 打包成 ZIP
 */
async function createZip() {
  logStep(6, 6, '打包成 ZIP');
  
  ensureDir(CONFIG.outputDir);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const zipName = `mo-Desktop-${timestamp}.zip`;
  const zipPath = path.join(CONFIG.outputDir, zipName);
  
  log(`  创建压缩包: ${zipName}`);
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // 最高压缩率
    });
    
    output.on('close', () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      logSuccess(`压缩包已创建: ${zipName} (${sizeMB} MB)`);
      resolve(zipPath);
    });
    
    archive.on('error', (err) => {
      logError('压缩失败');
      reject(err);
    });
    
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        logWarning(err);
      } else {
        reject(err);
      }
    });
    
    // 显示进度
    let lastProgress = 0;
    archive.on('progress', (progress) => {
      const percent = Math.floor((progress.entries.processed / progress.entries.total) * 100);
      if (percent > lastProgress + 10) {
        log(`  压缩进度: ${percent}%`);
        lastProgress = percent;
      }
    });
    
    archive.pipe(output);
    
    // 添加所有文件
    archive.directory(CONFIG.tempDir, 'mo-Desktop');
    
    archive.finalize();
  });
}

/**
 * 主流程
 */
async function main() {
  const startTime = Date.now();
  
  log('='.repeat(60), colors.bright);
  log('  mo 桌面版打包工具', colors.bright);
  log('='.repeat(60), colors.bright);
  log('');
  
  try {
    // 清理临时目录
    log('清理临时文件...');
    removeDir(CONFIG.tempDir);
    ensureDir(CONFIG.tempDir);
    logSuccess('临时目录已准备');
    
    // 执行打包步骤
    await buildModules();
    await downloadNodeJS();
    await copyAppFiles();
    await installProductionDeps();
    await generateLauncher();
    const zipPath = await createZip();
    
    // 完成
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log('');
    log('='.repeat(60), colors.bright + colors.green);
    log('  ✓ 打包完成！', colors.bright + colors.green);
    log('='.repeat(60), colors.bright + colors.green);
    log('');
    log(`  输出文件: ${zipPath}`, colors.green);
    log(`  耗时: ${elapsed} 秒`, colors.green);
    log('');
    log('  使用方法:', colors.bright);
    log('    1. 解压 ZIP 文件');
    log('    2. 双击"启动mo.cmd"');
    log('    3. 浏览器会自动打开编辑器');
    log('');
    log('='.repeat(60), colors.bright + colors.green);
    
    // 清理临时文件（可选）
    log('');
    log('清理临时文件...');
    removeDir(CONFIG.tempDir);
    logSuccess('清理完成');
    
  } catch (error) {
    log('');
    logError('打包失败！');
    logError(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// 运行
main();

