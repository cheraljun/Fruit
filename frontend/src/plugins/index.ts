/**
 * 前端专用插件导出
 * 职责：导出依赖浏览器环境的插件（如主题插件）
 */

export { ThemePlugin, ThemeManager } from './ThemePlugin';
export { LightThemePlugin } from './LightThemePlugin';
export { DarkThemePlugin } from './DarkThemePlugin';
export { CatppuccinLatteThemePlugin } from './CatppuccinLatteThemePlugin';
export { CatppuccinFrappeThemePlugin } from './CatppuccinFrappeThemePlugin';
export { CatppuccinMacchiatoThemePlugin } from './CatppuccinMacchiatoThemePlugin';
export { CatppuccinMochaThemePlugin } from './CatppuccinMochaThemePlugin';
export { NordDarkThemePlugin } from './NordDarkThemePlugin';
export { NordLightThemePlugin } from './NordLightThemePlugin';
export { DarkTerminalStylePlugin } from './DarkTerminalStylePlugin';
export { LightCleanStylePlugin } from './LightCleanStylePlugin';
export { VNClassicStylePlugin } from './VNClassicStylePlugin';
export { VNModernStylePlugin } from './VNModernStylePlugin';
export { VNPixelStylePlugin } from './VNPixelStylePlugin';

import { LightThemePlugin } from './LightThemePlugin';
import { DarkThemePlugin } from './DarkThemePlugin';
import { CatppuccinLatteThemePlugin } from './CatppuccinLatteThemePlugin';
import { CatppuccinFrappeThemePlugin } from './CatppuccinFrappeThemePlugin';
import { CatppuccinMacchiatoThemePlugin } from './CatppuccinMacchiatoThemePlugin';
import { CatppuccinMochaThemePlugin } from './CatppuccinMochaThemePlugin';
import { NordDarkThemePlugin } from './NordDarkThemePlugin';
import { NordLightThemePlugin } from './NordLightThemePlugin';
import { DarkTerminalStylePlugin } from './DarkTerminalStylePlugin';
import { LightCleanStylePlugin } from './LightCleanStylePlugin';
import { VNClassicStylePlugin } from './VNClassicStylePlugin';
import { VNModernStylePlugin } from './VNModernStylePlugin';
import { VNPixelStylePlugin } from './VNPixelStylePlugin';

/**
 * 创建前端插件实例
 */
export function createFrontendPlugins() {
  return [
    // 编辑器主题插件
    new LightThemePlugin(),
    new DarkThemePlugin(),
    // Catppuccin 主题系列
    new CatppuccinLatteThemePlugin(),
    new CatppuccinFrappeThemePlugin(),
    new CatppuccinMacchiatoThemePlugin(),
    new CatppuccinMochaThemePlugin(),
    // Nord 主题系列
    new NordDarkThemePlugin(),
    new NordLightThemePlugin(),
    // 终端播放器样式插件
    new DarkTerminalStylePlugin(),
    new LightCleanStylePlugin(),
    // 视觉小说播放器样式插件
    new VNClassicStylePlugin(),
    new VNModernStylePlugin(),
    new VNPixelStylePlugin()
  ];
}
