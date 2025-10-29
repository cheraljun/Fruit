/**
 * 后室游戏模组插件
 * 职责：提供后室恐怖探索游戏的核心机制
 * 
 * 设计理念：
 * - 通过 Blockly 积木块可视化操作
 * - 管理理智值、生命值、物资等核心状态
 * - 提供遭遇系统、伤害计算、物资使用等游戏机制
 */

import { PluginBase } from '../../../plugin/PluginBase.js';
import type { PluginMetadata } from '../../../plugin/types.js';
import type { RuntimePlugin } from '../../basicmod/RuntimePlugin.js';
import type { GameModDocs } from '../types.js';
import { getBackroomsDocs } from './docs.js';

export class BackroomsPlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'gamemod.backrooms',
    name: '后室',
    version: '1.0.0',
    author: 'backrooms',
    description: '后室恐怖探索游戏的核心机制，包含理智系统、遭遇系统、物资管理',
    icon: 'BKRM',
    category: 'gamemod',
    tags: ['游戏模组', '恐怖', 'backrooms', 'survival', 'horror'],
    requires: ['basicmod.runtime', 'gamemod.time-system']
  };

  private runtimePlugin: RuntimePlugin | null = null;

  protected async onInstall(): Promise<void> {
    console.log('[BackroomsPlugin] Installing Backrooms game systems...');
    
    this.runtimePlugin = this.context.getPlugin<RuntimePlugin>('basicmod.runtime');
    
    if (!this.runtimePlugin) {
      throw new Error('[BackroomsPlugin] RuntimePlugin not found! BackroomsPlugin requires RuntimePlugin.');
    }
    
    this.registerBackroomsFunctions();
    
    console.log('[BackroomsPlugin] Backrooms systems installed successfully');
  }

  /**
   * 注册后室游戏函数到 RuntimePlugin
   */
  private registerBackroomsFunctions(): void {
    if (!this.runtimePlugin) return;
    
    console.log('[BackroomsPlugin] Registering Backrooms functions...');
    
    // 物资使用
    this.runtimePlugin.registerFunction('useAlmondWater', this.useAlmondWater.bind(this));
    this.runtimePlugin.registerFunction('useSupplies', this.useSupplies.bind(this));
    
    // 遭遇系统
    this.runtimePlugin.registerFunction('rollEncounter', this.rollEncounter.bind(this));
    this.runtimePlugin.registerFunction('encounterEntity', this.encounterEntity.bind(this));
    
    // Level机制
    this.runtimePlugin.registerFunction('enterLevel', this.enterLevel.bind(this));
    this.runtimePlugin.registerFunction('drainSanity', this.drainSanity.bind(this));
    
    // 战斗/逃脱
    this.runtimePlugin.registerFunction('tryEscape', this.tryEscape.bind(this));
    this.runtimePlugin.registerFunction('takeDamage', this.takeDamage.bind(this));
    
    // 工具函数
    this.runtimePlugin.registerFunction('checkStatus', this.checkStatus.bind(this));
    this.runtimePlugin.registerFunction('searchArea', this.searchArea.bind(this));
    
    console.log('[BackroomsPlugin] Registered 10 core functions');
  }

  // ========== 物资使用函数 ==========

  /**
   * 使用杏仁水
   * 效果：理智+20，生命+5
   */
  private useAlmondWater(): string {
    if (!this.runtimePlugin) return '';
    
    const vars = this.runtimePlugin.vars;
    
    if (vars['almond_water'] > 0) {
      vars['almond_water'] -= 1;
      vars['sanity'] = Math.min(100, vars['sanity'] + 20);
      vars['health'] = Math.min(100, vars['health'] + 5);
      
      console.log('[BackroomsPlugin] Used Almond Water. Sanity +20, Health +5');
      return '你喝下杏仁水。甜甜的味道让你平静下来，感觉好多了。';
    } else {
      return '你没有杏仁水了。';
    }
  }

  /**
   * 使用物资包
   * 效果：生命+15，体力+25
   */
  private useSupplies(): string {
    if (!this.runtimePlugin) return '';
    
    const vars = this.runtimePlugin.vars;
    
    if (vars['supplies'] > 0) {
      vars['supplies'] -= 1;
      vars['health'] = Math.min(100, vars['health'] + 15);
      vars['stamina'] = Math.min(100, vars['stamina'] + 25);
      
      console.log('[BackroomsPlugin] Used Supplies. Health +15, Stamina +25');
      return '你使用了物资。绷带包扎伤口，食物恢复了体力。';
    } else {
      return '你没有物资了。';
    }
  }

  // ========== 遭遇系统 ==========

  /**
   * 随机遭遇检定
   * @param levelId - 当前Level ID
   * @returns 是否遭遇实体
   */
  private rollEncounter(levelId: string): boolean {
    if (!this.runtimePlugin) return false;
    
    const vars = this.runtimePlugin.vars;
    
    // 根据Level危险等级调整遭遇概率
    const encounterChances: Record<string, number> = {
      'level_0': 30,
      'level_1': 20,
      'level_2': 50,
      'level_3': 40,
      'level_4': 5,  // 安全区
      'level_5': 80,
      'level_6': 60,
      'level_7': 45,
      'level_8': 35,
      'level_9': 25,
      'level_10': 15,
      'level_11': 10, // 安全区
      'level_fun': 100 // Partygoer必定出现
    };
    
    const chance = encounterChances[levelId] || 25;
    const roll = this.random(1, 100);
    
    if (roll <= chance) {
      vars['entities_encountered'] = (vars['entities_encountered'] || 0) + 1;
      console.log(`[BackroomsPlugin] Encounter rolled! ${roll} <= ${chance}`);
      return true;
    }
    
    console.log(`[BackroomsPlugin] No encounter. ${roll} > ${chance}`);
    return false;
  }

  /**
   * 遭遇特定实体
   * @param entityId - 实体ID
   * @returns 实体数据对象
   */
  private encounterEntity(entityId: string): any {
    if (!this.runtimePlugin) return { success: false };
    
    const entityData: Record<string, any> = {
      'smiler_lesser': {
        name: '微笑者',
        sanity_damage: 20,
        health_damage: 0,
        avoidable_with: 'flashlight',
        text: '阴影中，一排发光的牙齿正对着你咧嘴笑...'
      },
      'hound': {
        name: '猎犬',
        sanity_damage: 10,
        health_damage: 30,
        avoidable_with: 'stamina',
        text: '低吼声越来越近。一个人形生物四肢着地朝你扑来！'
      },
      'partygoer': {
        name: '派对常客',
        sanity_damage: 30,
        health_damage: 50,
        fatal: true,
        text: '"一起来玩吧！ =)" 它的手臂不自然地伸向你...'
      },
      'bone_thief': {
        name: '窃骨者',
        sanity_damage: 25,
        health_damage: 40,
        text: '黄色的墙壁突然动了起来——那不是墙壁！'
      },
      'burster': {
        name: '爆裂者',
        sanity_damage: 15,
        health_damage: 35,
        weakness: 'almond_water',
        text: '膨胀的人形生物注意到了你，它的身体开始颤动...'
      },
      'beast': {
        name: '野兽',
        sanity_damage: 50,
        health_damage: 80,
        fatal: true,
        text: '心理上的恐惧具象化了。它一直在追踪你...'
      }
    };
    
    const entity = entityData[entityId];
    if (!entity) {
      console.error(`[BackroomsPlugin] Unknown entity: ${entityId}`);
      return { success: false };
    }
    
    console.log(`[BackroomsPlugin] Encountered: ${entity.name}`);
    return {
      success: true,
      id: entityId,
      name: entity.name,
      text: entity.text,
      sanity_damage: entity.sanity_damage,
      health_damage: entity.health_damage,
      avoidable_with: entity.avoidable_with,
      weakness: entity.weakness,
      fatal: entity.fatal || false
    };
  }

  // ========== Level机制 ==========

  /**
   * 进入Level
   * @param levelId - Level ID
   */
  private enterLevel(levelId: string): void {
    if (!this.runtimePlugin) return;
    
    const vars = this.runtimePlugin.vars;
    
    const previousLevel = vars['current_level'];
    vars['current_level'] = levelId;
    
    // 首次访问此Level时增加计数
    if (previousLevel !== levelId) {
      vars['levels_visited'] = (vars['levels_visited'] || 1) + 1;
    }
    
    // 自动理智衰减（基于Level）
    const sanityDrain: Record<string, number> = {
      'level_0': 5,
      'level_1': 3,
      'level_2': 8,
      'level_3': 6,
      'level_4': 1,  // 安全区
      'level_5': 15,
      'level_6': 20,
      'level_7': 10,
      'level_8': 7,
      'level_9': 4,
      'level_10': 2,
      'level_11': 0, // 安全区
      'level_fun': 25
    };
    
    const drain = sanityDrain[levelId] || 5;
    if (drain > 0) {
      this.drainSanity(drain);
    }
    
    console.log(`[BackroomsPlugin] Entered ${levelId}. Sanity drain: ${drain}`);
  }

  /**
   * 理智值衰减
   * @param amount - 衰减量
   */
  private drainSanity(amount: number): void {
    if (!this.runtimePlugin) return;
    
    const vars = this.runtimePlugin.vars;
    
    vars['sanity'] = Math.max(0, (vars['sanity'] || 100) - amount);
    
    console.log(`[BackroomsPlugin] Sanity drained by ${amount}. Current: ${vars['sanity']}`);
    
    // 理智过低的副作用处理
    if (vars['sanity'] === 0) {
      console.log('[BackroomsPlugin] WARNING: Sanity depleted! Mental breakdown imminent.');
    } else if (vars['sanity'] < 30) {
      console.log('[BackroomsPlugin] WARNING: Low sanity. Experiencing mental instability.');
    }
  }

  // ========== 战斗/逃脱系统 ==========

  /**
   * 尝试逃脱
   * @returns 是否成功逃脱
   */
  private tryEscape(): boolean {
    if (!this.runtimePlugin) return false;
    
    const vars = this.runtimePlugin.vars;
    
    const stamina = vars['stamina'] || 100;
    const roll = this.random(1, 100);
    const success = roll <= stamina;
    
    if (success) {
      vars['stamina'] = Math.max(0, stamina - 20);
      console.log(`[BackroomsPlugin] Escape successful! Roll: ${roll}, Stamina: ${stamina}`);
      return true;
    } else {
      vars['stamina'] = Math.max(0, stamina - 10);
      console.log(`[BackroomsPlugin] Escape failed. Roll: ${roll}, Stamina: ${stamina}`);
      return false;
    }
  }

  /**
   * 受到伤害
   * @param healthDamage - 生命伤害
   * @param sanityDamage - 理智伤害
   */
  private takeDamage(healthDamage: number = 0, sanityDamage: number = 0): void {
    if (!this.runtimePlugin) return;
    
    const vars = this.runtimePlugin.vars;
    
    if (healthDamage > 0) {
      // 检查影子是否完整（Yellow Hounds攻击后无法治疗）
      const canHeal = vars['shadow_intact'] !== false;
      if (!canHeal) {
        healthDamage = Math.floor(healthDamage * 1.5); // 无影子时伤害加重
      }
      
      vars['health'] = Math.max(0, (vars['health'] || 100) - healthDamage);
      console.log(`[BackroomsPlugin] Took ${healthDamage} health damage. Current: ${vars['health']}`);
    }
    
    if (sanityDamage > 0) {
      vars['sanity'] = Math.max(0, (vars['sanity'] || 100) - sanityDamage);
      console.log(`[BackroomsPlugin] Took ${sanityDamage} sanity damage. Current: ${vars['sanity']}`);
    }
    
    if (vars['health'] === 0) {
      console.log('[BackroomsPlugin] FATAL: Health depleted!');
    }
  }

  // ========== 工具函数 ==========

  /**
   * 检查玩家状态
   * @returns 状态文本
   */
  private checkStatus(): string {
    if (!this.runtimePlugin) return '';
    
    const vars = this.runtimePlugin.vars;
    
    const health = vars['health'] || 100;
    const sanity = vars['sanity'] || 100;
    const stamina = vars['stamina'] || 100;
    
    const healthStatus = health < 30 ? '虚弱' : health < 70 ? '疲惫' : '良好';
    const sanityStatus = sanity < 30 ? '精神不稳' : sanity < 70 ? '有些紧张' : '平静';
    const staminaStatus = stamina < 30 ? '精疲力尽' : stamina < 70 ? '有些累' : '充沛';
    
    return `生命: ${health}/100 (${healthStatus})\n理智: ${sanity}/100 (${sanityStatus})\n体力: ${stamina}/100 (${staminaStatus})`;
  }

  /**
   * 搜索区域寻找物资
   * @returns 搜索结果文本
   */
  private searchArea(): string {
    if (!this.runtimePlugin) return '';
    
    const vars = this.runtimePlugin.vars;
    const roll = this.random(1, 100);
    
    // 30%成功率
    if (roll <= 30) {
      const itemRoll = this.random(1, 3);
      
      if (itemRoll === 1) {
        vars['almond_water'] = Math.min(99, (vars['almond_water'] || 0) + 1);
        return '你在角落发现了一瓶杏仁水。';
      } else if (itemRoll === 2) {
        vars['supplies'] = Math.min(99, (vars['supplies'] || 0) + 1);
        return '你找到了一些补给品。';
      } else {
        vars['flashlight_battery'] = Math.min(100, (vars['flashlight_battery'] || 0) + 25);
        return '你找到了备用电池。';
      }
    }
    
    return '你仔细搜索了周围，但没有找到任何有用的东西。';
  }

  /**
   * 随机数生成器
   */
  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ========== Blockly积木块注册 ==========

  /**
   * 钩子：注册 Blockly 积木块
   */
  hooks = {
    'blockly:register-blocks': (blocks: any[]) => {
      console.log('[BackroomsPlugin] Registering Backrooms blocks...');
      
      const backroomsBlocks = [
        // 使用杏仁水
        {
          type: 'backrooms_use_almond_water',
          message0: '使用杏仁水',
          previousStatement: null,
          nextStatement: null,
          colour: 65,
          tooltip: '消耗1瓶杏仁水，恢复理智+20、生命+5',
          helpUrl: ''
        },
        
        // 使用物资
        {
          type: 'backrooms_use_supplies',
          message0: '使用物资',
          previousStatement: null,
          nextStatement: null,
          colour: 65,
          tooltip: '消耗1份物资，恢复生命+15、体力+25',
          helpUrl: ''
        },
        
        // 遭遇检定
        {
          type: 'backrooms_roll_encounter',
          message0: '随机遭遇检定 Level %1',
          args0: [
            {
              type: 'input_value',
              name: 'LEVEL',
              check: 'String'
            }
          ],
          output: 'Boolean',
          colour: 65,
          tooltip: '基于Level危险等级检定是否遭遇实体，返回true/false',
          helpUrl: ''
        },
        
        // 进入Level
        {
          type: 'backrooms_enter_level',
          message0: '进入Level %1',
          args0: [
            {
              type: 'input_value',
              name: 'LEVEL',
              check: 'String'
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 65,
          tooltip: '进入指定Level，触发理智衰减并更新追踪变量',
          helpUrl: ''
        },
        
        // 理智衰减
        {
          type: 'backrooms_drain_sanity',
          message0: '理智衰减 %1',
          args0: [
            {
              type: 'input_value',
              name: 'AMOUNT',
              check: 'Number'
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 65,
          tooltip: '降低理智值',
          helpUrl: ''
        },
        
        // 受到伤害
        {
          type: 'backrooms_take_damage',
          message0: '受到伤害 生命 %1 理智 %2',
          args0: [
            {
              type: 'input_value',
              name: 'HEALTH',
              check: 'Number'
            },
            {
              type: 'input_value',
              name: 'SANITY',
              check: 'Number'
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 65,
          tooltip: '同时降低生命值和理智值',
          helpUrl: ''
        },
        
        // 尝试逃脱
        {
          type: 'backrooms_try_escape',
          message0: '尝试逃脱',
          output: 'Boolean',
          colour: 65,
          tooltip: '基于体力值判定逃脱，成功率=体力%，返回true/false',
          helpUrl: ''
        },
        
        // 搜索物资
        {
          type: 'backrooms_search_area',
          message0: '搜索物资',
          output: 'String',
          colour: 65,
          tooltip: '搜索当前区域，30%概率找到物资，返回搜索结果文本',
          helpUrl: ''
        },
        
        // 检查状态
        {
          type: 'backrooms_check_status',
          message0: '检查玩家状态',
          output: 'String',
          colour: 65,
          tooltip: '返回生命、理智、体力的状态摘要文本',
          helpUrl: ''
        },
        
        // 遭遇实体
        {
          type: 'backrooms_encounter_entity',
          message0: '遭遇实体 %1',
          args0: [
            {
              type: 'field_dropdown',
              name: 'ENTITY',
              options: [
                ['微笑者', 'smiler_lesser'],
                ['猎犬', 'hound'],
                ['派对常客', 'partygoer'],
                ['窃骨者', 'bone_thief'],
                ['爆裂者', 'burster'],
                ['野兽', 'beast']
              ]
            }
          ],
          output: null,
          colour: 65,
          tooltip: '触发特定实体遭遇，返回实体数据对象',
          helpUrl: ''
        }
      ];
      
      console.log(`[BackroomsPlugin] Providing ${backroomsBlocks.length} blocks`);
      return [...blocks, ...backroomsBlocks];
    },
    
    'blockly:register-generators': (generators: Record<string, any>) => {
      console.log('[BackroomsPlugin] Registering Backrooms code generators...');
      
      const backroomsGenerators = {
        // 使用杏仁水
        backrooms_use_almond_water: function(_block: any, _generator: any) {
          return `fns.useAlmondWater();\n`;
        },
        
        // 使用物资
        backrooms_use_supplies: function(_block: any, _generator: any) {
          return `fns.useSupplies();\n`;
        },
        
        // 遭遇检定
        backrooms_roll_encounter: function(block: any, generator: any) {
          const level = generator.valueToCode(block, 'LEVEL', generator.ORDER_NONE) || '"level_0"';
          return [`fns.rollEncounter(${level})`, generator.ORDER_ATOMIC];
        },
        
        // 进入Level
        backrooms_enter_level: function(block: any, generator: any) {
          const level = generator.valueToCode(block, 'LEVEL', generator.ORDER_NONE) || '"level_0"';
          return `fns.enterLevel(${level});\n`;
        },
        
        // 理智衰减
        backrooms_drain_sanity: function(block: any, generator: any) {
          const amount = generator.valueToCode(block, 'AMOUNT', generator.ORDER_NONE) || '0';
          return `fns.drainSanity(${amount});\n`;
        },
        
        // 受到伤害
        backrooms_take_damage: function(block: any, generator: any) {
          const health = generator.valueToCode(block, 'HEALTH', generator.ORDER_NONE) || '0';
          const sanity = generator.valueToCode(block, 'SANITY', generator.ORDER_NONE) || '0';
          return `fns.takeDamage(${health}, ${sanity});\n`;
        },
        
        // 尝试逃脱
        backrooms_try_escape: function(_block: any, generator: any) {
          return [`fns.tryEscape()`, generator.ORDER_ATOMIC];
        },
        
        // 搜索物资
        backrooms_search_area: function(_block: any, generator: any) {
          return [`fns.searchArea()`, generator.ORDER_ATOMIC];
        },
        
        // 检查状态
        backrooms_check_status: function(_block: any, generator: any) {
          return [`fns.checkStatus()`, generator.ORDER_ATOMIC];
        },
        
        // 遭遇实体
        backrooms_encounter_entity: function(block: any, generator: any) {
          const entity = block.getFieldValue('ENTITY');
          return [`fns.encounterEntity('${entity}')`, generator.ORDER_ATOMIC];
        }
      };
      
      console.log(`[BackroomsPlugin] Providing ${Object.keys(backroomsGenerators).length} generators`);
      return { ...generators, ...backroomsGenerators };
    }
  };

  /**
   * 获取模组使用文档
   */
  static getDocs(): GameModDocs {
    return getBackroomsDocs();
  }
}

