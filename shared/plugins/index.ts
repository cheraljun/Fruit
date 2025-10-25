/**
 * 内置插件导出
 * 职责：统一导出所有内置插件
 */

import { RuntimePlugin, BlocklyPlugin } from './basicmod/index.js';
import { MarkdownPlugin, ValidatorPlugin, AnalyzerPlugin, HierarchicalLayoutPlugin, RadialLayoutPlugin, ChoiceEmbeddingPlugin } from './tools/index.js';
import { TimeSystemPlugin } from './gamemods/index.js';

export { 
  RuntimePlugin,
  BlocklyPlugin,
  MarkdownPlugin,
  ValidatorPlugin,
  AnalyzerPlugin,
  HierarchicalLayoutPlugin,
  RadialLayoutPlugin,
  ChoiceEmbeddingPlugin,
  TimeSystemPlugin
};

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
 * - 游戏模组：TimeSystemPlugin（时间系统）
 * - 主题：在前端目录（frontend/src/plugins）
 * 
 * 注意：
 * - 运行时系统必须最先加载
 * - BlocklyPlugin 依赖运行时系统
 * - 游戏模组依赖运行时系统
 */
export function createBuiltinPlugins() {
  return [
    new RuntimePlugin(),
    new BlocklyPlugin(),
    new MarkdownPlugin(),
    new ValidatorPlugin(),
    new AnalyzerPlugin(),
    new HierarchicalLayoutPlugin(),
    new RadialLayoutPlugin(),
    new ChoiceEmbeddingPlugin(),
    new TimeSystemPlugin()
  ];
}

