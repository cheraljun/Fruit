# 墨水 - 互动叙事游戏编辑器

> 为空间叙事游戏而生

[![React](https://img.shields.io/badge/React-18.2.0-00D8FF?style=plastic&logo=react&logoColor=00D8FF&labelColor=282c34)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=plastic&logo=typescript&logoColor=white&labelColor=0F1419)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-11.10.4-FF6B6B?style=plastic&logoColor=white&labelColor=2D2D2D)](https://reactflow.dev/)
[![Blockly](https://img.shields.io/badge/Blockly-11.1.1-4AB8FF?style=plastic&logoColor=white&labelColor=1A1A1A)](https://developers.google.com/blockly)
[![Express](https://img.shields.io/badge/Express-4.18.2-FFFFFF?style=plastic&logo=express&logoColor=white&labelColor=000000)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-68A063?style=plastic&logo=node.js&logoColor=white&labelColor=1F1F1F)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-FFA000?style=plastic&logo=jsonwebtokens&logoColor=FFA000&labelColor=1C1C1C)](https://jwt.io/)
![License](https://img.shields.io/badge/License-开源免费-00C853?style=plastic&logoColor=white&labelColor=1B5E20)
![Version](https://img.shields.io/badge/Version-2.0.0-2196F3?style=plastic&logoColor=white&labelColor=0D47A1)

[English](./README.en.md) | [简体中文](./README.zh.md)

---

## 这是什么

墨水是一个互动叙事游戏编辑器。创作简单的游戏不需要编写任何代码，拖拽节点、连接选项，故事的分支结构会像地图一样展现在你眼前。

## 核心特性

**节点流编辑** - 拖拽节点，连接选项，看清整个故事结构

**热区交互** - 用图片热区实现空间探索，点击不同区域跳转到对应场景

**世界地图** - 自动记录访问过的场景，可快速导航

**变量系统** - 记录玩家的选择轨迹，用状态积累驱动多结局

**条件分支** - 用Blockly可视化编程设置条件判断，无需写代码

**视觉小说播放器** - 背景图+角色立绘+对话框的沉浸式阅读体验

**单文件导出** - 生成独立的HTML文件，无需服务器，双击即玩

## 适合创作什么

如果你想做的游戏核心是：
- 探索未知空间
- 在压力下做艰难选择
- 用文字和氛围制造情感

那么墨水就是为你准备的。

**适合的游戏类型**：
- 探索类游戏（Backrooms、SCP收容失效）
- 生存选择游戏（核避难所、废土生存）
- 解谜推理游戏（侦探调查、真相拼图）
- 多结局分支叙事（时间线分裂、钻石型叙事）

**不适合**：即时战斗、复杂的数值养成、实时竞技

## 技术架构

```
frontend/           编辑器和在线播放器（React + Vite + 引擎 + 插件系统）
backend/            用户认证和数据持久化（Express + JWT）
player-standalone/  独立播放器构建器（visual-novel）
packager-win/       Windows桌面版打包工具（Node.js便携版 + 启动器）
```

## 快速开始

### 开发模式

```bash
# 前端开发
dev-start-frontend.cmd

# 后端开发
dev-start-backend.cmd
```

### 生产部署

```bash
# 在线部署
production-start.cmd

# Windows桌面打包
cd packager-win
npm run build
```

**技术文档**：`docs/` 文件夹包含核心设计文档（保存逻辑、游戏模组设计、变量系统等）

**桌面打包**：详见 `packager-win/README-win.md`

## 第一个故事

1. 创建开始节点，写下"你站在岔路口"
2. 添加两个选项："向左"和"向右"
3. 创建两个新节点，连接选项
4. 点击预览，体验你的第一个分支故事

故事就这样开始了。

## 许可证

完全开源免费，包括用于商业用途。

