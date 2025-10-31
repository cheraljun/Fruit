/**
 * 内置插件导出
 * 职责：统一导出所有内置插件
 */

import { createBasicModPlugins } from './basicmod/index.js';
import { createToolPlugins } from './tools/index.js';
import { createGameModPlugins } from './gamemods/index.js';

export * from './basicmod/index.js';
export * from './tools/index.js';
export * from './gamemods/index.js';

/**
 * 创建内置插件实例
 * 
 * v3.0 Blockly重构说明：
 * - 移除 Action 系统，改用 Blockly 可视化编程
 * - RuntimePlugin 简化为变量存储和模板替换
 * - BlocklyPlugin 提供可视化编程积木块
 * 
 * 插件分类：
 * - 核心：运行时系统（RuntimePlugin - 变量和模板）
 * - 基础模组：BlocklyPlugin（Blockly 可视化编程）
 * - 工具：Markdown渲染、验证器、分析器、布局、导出
 * - 游戏模组：TimeSystemPlugin（时间系统）、BackroomsPlugin（后室模组）
 * - 主题：在前端目录（frontend/src/plugins）
 * 
 * 注意：
 * - 运行时系统必须最先加载
 * - BlocklyPlugin 依赖运行时系统
 * - 游戏模组依赖运行时系统
 * 
 * 新增插件步骤：
 * 1. 在对应分类目录（basicmod/tools/gamemods）创建插件类
 * 2. 在该分类的 index.ts 的 create*Plugins() 中添加实例化
 * 3. 完成（无需修改此文件）
 */
export function createBuiltinPlugins() {
  return [
    ...createBasicModPlugins(),
    ...createToolPlugins(),
    ...createGameModPlugins()
  ];
}

