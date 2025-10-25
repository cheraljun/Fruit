/**
 * 游戏模组插件导出
 * 职责：统一导出所有游戏模组插件
 */

export * from './types.js';
export { TimeSystemPlugin } from './TimeSystemPlugin.js';

import { TimeSystemPlugin } from './TimeSystemPlugin.js';

/**
 * 创建所有游戏模组插件实例
 */
export function createGameModPlugins() {
  return [
    new TimeSystemPlugin()
  ];
}
