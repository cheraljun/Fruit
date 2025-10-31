/**
 * 工具插件导出
 * 职责：统一导出所有工具插件
 */

import { MarkdownPlugin } from './MarkdownPlugin.js';
import { ValidatorPlugin } from './ValidatorPlugin.js';
import { AnalyzerPlugin } from './AnalyzerPlugin.js';
import { HierarchicalLayoutPlugin } from './layouts/HierarchicalLayoutPlugin.js';
import { RadialLayoutPlugin } from './layouts/RadialLayoutPlugin.js';
import { ChoiceEmbeddingPlugin } from './ChoiceEmbeddingPlugin.js';
import { ExcelExporterPlugin } from './ExcelExporterPlugin.js';

export {
  MarkdownPlugin,
  ValidatorPlugin,
  AnalyzerPlugin,
  HierarchicalLayoutPlugin,
  RadialLayoutPlugin,
  ChoiceEmbeddingPlugin,
  ExcelExporterPlugin
};

export * from './layouts/index.js';

/**
 * 创建所有工具插件实例
 */
export function createToolPlugins() {
  return [
    new MarkdownPlugin(),
    new ValidatorPlugin(),
    new AnalyzerPlugin(),
    new HierarchicalLayoutPlugin(),
    new RadialLayoutPlugin(),
    new ChoiceEmbeddingPlugin(),
    new ExcelExporterPlugin()
  ];
}

