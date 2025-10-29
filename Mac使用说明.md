# MoScript 互动小说编辑器 - Mac版使用说明

## 这是什么？

MoScript 是一个功能强大的互动小说编辑器，支持可视化编辑、
Blockly 图形化编程和导出独立播放器。

本桌面版无需安装，解压即用。

### 本文档由小乙老师编写

## 系统要求

- macOS 10.12 或更高版本
- Node.js 14.0 或更高版本（如果系统未安装，脚本会提示安装）

> 注意：本项目内置的是Windows版Node.js，Mac用户需要使用系统安装的Node.js。
> 可以通过访问 https://nodejs.org 下载安装最新版本的Node.js。

## 如何使用？

### 方法一：双击启动（推荐）
1. 双击"启动MoScript.command"启动服务
2. 终端会显示启动进度
3. 浏览器会自动打开编辑器界面
4. 开始创作你的互动小说
5. 关闭终端窗口即可停止服务

### 方法二：终端启动
1. 打开终端，进入项目目录
2. 运行 `./启动MoScript.command`
3. 后续步骤同上

## 文件说明

- `nodejs/`              - Node.js 运行环境（内置，无需安装）
- `app/`                 - 应用程序文件
- `userdata/`            - 用户数据目录（你的作品保存在这里）
- `启动MoScript.command` - Mac版启动脚本
- `双击启动.cmd`         - Windows版启动脚本
- `wechat-qr.png`        - 微信交流群二维码
- `wechat-person.png`    - 作者微信二维码

## 数据存储

所有创作的故事和图片都保存在 userdata/ 目录下：
  - userdata/stories/    - 故事文件
  - userdata/images/     - 图片资源

备份这个文件夹，你的作品就安全了。

## 常见问题

**Q: 双击启动没反应？**
A: 右键点击"启动MoScript.command"，选择"打开方式" > "终端"

**Q: 提示端口被占用？**
A: 说明 MoScript 已经在运行，直接访问 http://localhost:3001
   或关闭之前的终端窗口

**Q: 浏览器没有自动打开？**
A: 手动在浏览器访问 http://localhost:3001

**Q: 如何关闭？**
A: 关闭终端窗口即可，或在终端按 Ctrl+C

**Q: 数据如何备份？**
A: 复制整个 userdata/ 文件夹即可

## 技术支持

- 项目主页: https://github.com/cheraljun/MoScript
- 微信交流: 查看 wechat-qr.png 和 wechat-person.png
- 欢迎提交问题和建议

## 开源协议

本软件采用 MIT 协议开源
可自由使用、修改和分发

祝你创作愉快！