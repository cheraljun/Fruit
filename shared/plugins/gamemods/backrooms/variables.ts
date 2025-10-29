/**
 * Backrooms游戏模组 - 变量定义
 * 单一数据源：所有Backrooms变量的定义
 */

import type { VariableDefinition } from '../../../types/index.js';

export const BACKROOMS_VARIABLES: VariableDefinition[] = [
  // 核心生存状态（8个）
  { id: 'sanity', label: '理智值', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'health', label: '生命值', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'stamina', label: '体力值', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'hunger', label: '饥饿度', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'thirst', label: '口渴度', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'temperature', label: '体温', type: 'number', defaultValue: 37, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'radiation', label: '辐射值', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'infection', label: '感染程度', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  
  // 物资消耗品（10个）
  { id: 'almond_water', label: '杏仁水', type: 'number', defaultValue: 3, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'food', label: '食物', type: 'number', defaultValue: 5, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'water', label: '水', type: 'number', defaultValue: 3, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'supplies', label: '物资包', type: 'number', defaultValue: 2, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'medicine', label: '药品', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'bandages', label: '绷带', type: 'number', defaultValue: 3, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'batteries', label: '电池', type: 'number', defaultValue: 2, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'fuel', label: '燃料', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'rope', label: '绳索', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'meat', label: '肉类', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  
  // 装备道具（8个）
  { id: 'flashlight_battery', label: '手电筒电量', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'flashlight_on', label: '手电筒开启', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'weapon_durability', label: '武器耐久', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'armor_durability', label: '护甲耐久', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'radio_signal', label: '无线电信号', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'has_map', label: '持有地图', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'has_compass', label: '持有指南针', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'has_gas_mask', label: '持有防毒面具', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  
  // 进度追踪（8个）
  { id: 'current_level', label: '当前Level', type: 'string', defaultValue: 'level_0', source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'previous_level', label: '上个Level', type: 'string', defaultValue: '', source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'levels_visited', label: '访问Level数', type: 'number', defaultValue: 1, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'entities_encountered', label: '遭遇实体次数', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'noclips_used', label: 'Noclip次数', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'deaths', label: '死亡次数', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'items_found', label: '找到物品数', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'distance_traveled', label: '旅行距离', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  
  // 特殊状态标记（12个）
  { id: 'shadow_intact', label: '影子完整', type: 'boolean', defaultValue: true, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'noclip_sense', label: 'Noclip敏感度', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'jerry_follower', label: 'Jerry信徒', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'partygoer_infected', label: 'Partygoer感染', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'disease_infected', label: '疾病感染', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'beast_aware', label: 'Beast察觉', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'faceling_ally', label: 'Faceling盟友', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'blub_cat_pet', label: 'Blub Cat宠物', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'marked_by_smiler', label: '被Smiler标记', type: 'boolean', defaultValue: false, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'wretch_transformation', label: 'Wretch转化', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'immunity_level', label: '免疫等级', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'sanity_resistance', label: '理智抗性', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.backrooms' },
  
  // 环境因素（6个）
  { id: 'light_level', label: '光照等级', type: 'number', defaultValue: 50, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'noise_level', label: '噪音等级', type: 'number', defaultValue: 30, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'temperature_ambient', label: '环境温度', type: 'number', defaultValue: 20, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'humidity', label: '湿度', type: 'number', defaultValue: 60, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'air_quality', label: '空气质量', type: 'number', defaultValue: 100, source: 'plugin', pluginId: 'gamemod.backrooms' },
  { id: 'danger_level', label: '危险等级', type: 'number', defaultValue: 3, source: 'plugin', pluginId: 'gamemod.backrooms' }
];

export const BACKROOMS_VARIABLE_COUNT = BACKROOMS_VARIABLES.length;

