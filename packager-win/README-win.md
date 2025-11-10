# mo 桌面版打包工具

将 mo 打包成 Windows 桌面应用（便携版）。

## 快速开始

### 1. 安装依赖

```bash
cd packager-win
npm install
```

### 2. 执行打包

```bash
npm run build
```

打包过程需要 5-10 分钟，自动完成：
- 构建所有模块（backend, frontend, player-standalone）
- 下载 Node.js v18 便携版（约 50 MB）
- 复制应用文件
- 安装生产依赖
- 生成启动器
- 打包成 ZIP

### 3. 获取产物

打包完成后，在 `packager-win/output/` 目录下会生成：

```
mo-Desktop-{timestamp}.zip
```

## 产物结构

```
mo-Desktop/
├── nodejs/                    # Node.js 便携版 (~50 MB)
├── app/                       # 应用程序
│   ├── backend/
│   ├── frontend/
│   ├── player-standalone/
│   └── launcher.js
├── userdata/                  # 用户数据目录
├── 双击启动.cmd
├── wechat-qr.png              # 微信交流群
├── wechat-person.png          # 作者微信
└── 使用说明.txt
```

**大小：** 约 70 MB（解压后），压缩后约 35-40 MB

## 用户使用方法

1. 解压 ZIP 文件到任意位置
2. 双击 `双击启动.cmd`
3. 浏览器会自动打开 `http://localhost:3001`
4. 开始使用编辑器
5. 关闭命令行窗口即可停止服务

## 配置选项

### 修改 Node.js 版本

编辑 `build-portable.js` 中的配置：

```javascript
const CONFIG = {
  nodeVersion: '18.20.4', // 修改为其他版本
  // ...
};
```

### 修改下载源

默认使用国内镜像 `https://npmmirror.com/mirrors/node`

可以改为官方源：

```javascript
const CONFIG = {
  nodeDistUrl: 'https://nodejs.org/dist',
  // ...
};
```

## 技术细节

### 启动流程

```
用户双击启动脚本
    ↓
双击启动.cmd
    ↓
执行: nodejs\node.exe app\launcher.js
    ↓
launcher.js:
  1. 检测端口 3001
  2. 设置环境变量
  3. 启动 Express 后端
  4. 等待服务就绪
  5. 打开浏览器
```

### 环境变量

launcher.js 会自动设置：

```javascript
process.env.NODE_ENV = 'production';
process.env.PORT = '3001';
process.env.DESKTOP_MODE = 'true';
process.env.CORS_ORIGIN = 'http://localhost:3001';
process.env.FRONTEND_PATH = '...';
process.env.USER_DATA_PATH = '...';
```

### 停止服务

用户可以通过以下方式停止：
- 关闭命令行窗口
- 按 Ctrl+C

## 常见问题

**Q: 打包失败，提示找不到 dist 目录？**

A: 打包脚本会自动检查并构建所有模块，无需手动构建。如果依然失败，检查网络连接和 npm 是否正常。

**Q: 下载 Node.js 很慢？**

A: 脚本已使用国内镜像。如果仍然很慢，可以手动下载 Node.js 便携版，解压到 `packager-win/temp/nodejs/`，重新运行打包脚本（会跳过下载）。

**Q: 如何自定义压缩包名称？**

A: 编辑 `build-portable.js` 中的 `createZip()` 函数：

```javascript
const zipName = `mo-Desktop-v1.0.0.zip`; // 自定义名称
```

**Q: 如何减小体积？**

A: 可以尝试使用更小的 Node.js 版本。压缩级别已设为最高（9）。

## 开发调试

### 测试启动器

无需完整打包，直接测试启动脚本：

```bash
cd packager-win/temp
双击 ../templates/双击启动-win.cmd
```

### 清理临时文件

```bash
rm -rf packager-win/temp
rm -rf packager-win/output
```

## 许可证

MIT License
