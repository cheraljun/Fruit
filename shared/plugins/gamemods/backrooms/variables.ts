/**
 * Backrooms游戏模组 - 变量定义（极简版）
 * 
 * 设计理念：
 * - 只提供核心生存属性和常用物品示例
 * - 游戏作者可根据需要自行添加更多变量
 * - 通过4个通用积木块灵活操作任意变量
 */

import type { VariableDefinition } from '../../../types/index.js';

export const BACKROOMS_VARIABLES: VariableDefinition[] = [
  // 核心生存属性（3个）- 通过积木块操作
  { id: 'sanity', label: '理智值', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'health', label: '生命值', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'stamina', label: '体力值', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  
  // 常用物品示例（6个）- 作者可自行添加更多
  { id: 'almond_water', label: '杏仁水', type: 'number', defaultValue: 3, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'supplies', label: '物资包', type: 'number', defaultValue: 2, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'bandages', label: '绷带', type: 'number', defaultValue: 3, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'food', label: '食物', type: 'number', defaultValue: 5, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'water', label: '水', type: 'number', defaultValue: 3, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'flashlight_battery', label: '手电筒电量', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  
  // 游戏进度示例（1个）
  { id: 'current_level', label: '当前Level', type: 'string', defaultValue: 'level_0', source: 'plugin', pluginId: 'gamemod.backrooms' }
];

export const BACKROOMS_VARIABLE_COUNT = BACKROOMS_VARIABLES.length;

