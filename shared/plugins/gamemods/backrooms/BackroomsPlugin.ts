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
import type { VariableDefinition } from '../../../types/index.js';
import { getBackroomsDocs } from './docs.js';
import { BACKROOMS_VARIABLES } from './variables.js';

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
    
    // 核心通用函数
    this.runtimePlugin.registerFunction('modifyAttribute', this.modifyAttribute.bind(this));
    this.runtimePlugin.registerFunction('modifyItem', this.modifyItem.bind(this));
    this.runtimePlugin.registerFunction('checkAttribute', this.checkAttribute.bind(this));
    this.runtimePlugin.registerFunction('checkItem', this.checkItem.bind(this));
    
    console.log('[BackroomsPlugin] Registered 4 core functions');
  }

  // ========== 4个核心通用函数 ==========

  /**
   * 修改属性值（理智/生命/体力）
   * @param attribute - 属性名称 ('sanity' | 'health' | 'stamina')
   * @param value - 变化值（正数增加，负数减少）
   */
  private modifyAttribute(attribute: 'sanity' | 'health' | 'stamina', value: number): void {
    if (!this.runtimePlugin) return;
    
    const vars = this.runtimePlugin.vars;
    
    // 获取当前值
    const current = vars[attribute] || (attribute === 'sanity' || attribute === 'health' || attribute === 'stamina' ? 100 : 0);
    
    // 修改值并限制在0-100范围
    vars[attribute] = Math.max(0, Math.min(100, current + value));
    
    console.log(`[BackroomsPlugin] ${attribute}: ${current} -> ${vars[attribute]} (${value >= 0 ? '+' : ''}${value})`);
  }

  /**
   * 修改物品数量
   * @param item - 物品变量名
   * @param value - 变化值（正数增加，负数减少）
   */
  private modifyItem(item: string, value: number): void {
    if (!this.runtimePlugin) return;
    
    const vars = this.runtimePlugin.vars;
    
    const current = vars[item] || 0;
    vars[item] = Math.max(0, current + value);
    
    console.log(`[BackroomsPlugin] ${item}: ${current} -> ${vars[item]} (${value >= 0 ? '+' : ''}${value})`);
  }

  /**
   * 检查属性值
   * @param attribute - 属性名称
   * @returns 当前属性值
   */
  private checkAttribute(attribute: string): number {
    if (!this.runtimePlugin) return 0;
    
    const vars = this.runtimePlugin.vars;
    return vars[attribute] || 0;
  }

  /**
   * 检查物品数量
   * @param item - 物品变量名
   * @returns 当前物品数量
   */
  private checkItem(item: string): number {
    if (!this.runtimePlugin) return 0;
    
    const vars = this.runtimePlugin.vars;
    return vars[item] || 0;
  }

  // ========== Blockly积木块注册 ==========

  /**
   * 钩子：注册 Blockly 积木块和工具箱类别
   */
  hooks = {
    'blockly:register-blocks': (blocks: any[]) => {
      console.log('[BackroomsPlugin] Registering Backrooms blocks...');
      
      const backroomsBlocks = [
        // 修改属性
        {
          type: 'backrooms_modify_attribute',
          message0: '修改属性 %1 %2 %3',
          args0: [
            {
              type: 'field_dropdown',
              name: 'ATTRIBUTE',
              options: [
                ['理智', 'sanity'],
                ['生命', 'health'],
                ['体力', 'stamina']
              ]
            },
            {
              type: 'field_dropdown',
              name: 'OPERATION',
              options: [
                ['增加', 'add'],
                ['减少', 'sub']
              ]
            },
            {
              type: 'input_value',
              name: 'VALUE',
              check: 'Number'
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 65,
          tooltip: '修改玩家属性（理智/生命/体力），自动限制在0-100范围',
          helpUrl: ''
        },
        
        // 修改物品
        {
          type: 'backrooms_modify_item',
          message0: '修改物品 %1 %2 %3',
          args0: [
            {
              type: 'input_value',
              name: 'ITEM',
              check: 'String'
            },
            {
              type: 'field_dropdown',
              name: 'OPERATION',
              options: [
                ['增加', 'add'],
                ['减少', 'sub']
              ]
            },
            {
              type: 'input_value',
              name: 'VALUE',
              check: 'Number'
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 65,
          tooltip: '修改物品数量，自动限制最小为0',
          helpUrl: ''
        },
        
        // 检查属性
        {
          type: 'backrooms_check_attribute',
          message0: '属性 %1',
          args0: [
            {
              type: 'field_dropdown',
              name: 'ATTRIBUTE',
              options: [
                ['理智', 'sanity'],
                ['生命', 'health'],
                ['体力', 'stamina']
              ]
            }
          ],
          output: 'Number',
          colour: 65,
          tooltip: '获取当前属性值',
          helpUrl: ''
        },
        
        // 检查物品
        {
          type: 'backrooms_check_item',
          message0: '物品 %1',
          args0: [
            {
              type: 'input_value',
              name: 'ITEM',
              check: 'String'
            }
          ],
          output: 'Number',
          colour: 65,
          tooltip: '获取当前物品数量',
          helpUrl: ''
        }
      ];
      
      console.log(`[BackroomsPlugin] Providing ${backroomsBlocks.length} blocks`);
      return [...blocks, ...backroomsBlocks];
    },
    
    'blockly:register-generators': (generators: Record<string, any>) => {
      console.log('[BackroomsPlugin] Registering Backrooms code generators...');
      
      const backroomsGenerators = {
        // 修改属性
        backrooms_modify_attribute: function(block: any, generator: any) {
          const attribute = block.getFieldValue('ATTRIBUTE');
          const operation = block.getFieldValue('OPERATION');
          const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || '0';
          const actualValue = operation === 'sub' ? `-(${value})` : value;
          return `fns.modifyAttribute('${attribute}', ${actualValue});\n`;
        },
        
        // 修改物品
        backrooms_modify_item: function(block: any, generator: any) {
          const item = generator.valueToCode(block, 'ITEM', generator.ORDER_NONE) || '""';
          const operation = block.getFieldValue('OPERATION');
          const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || '0';
          const actualValue = operation === 'sub' ? `-(${value})` : value;
          return `fns.modifyItem(${item}, ${actualValue});\n`;
        },
        
        // 检查属性
        backrooms_check_attribute: function(block: any, generator: any) {
          const attribute = block.getFieldValue('ATTRIBUTE');
          return [`fns.checkAttribute('${attribute}')`, generator.ORDER_ATOMIC];
        },
        
        // 检查物品
        backrooms_check_item: function(block: any, generator: any) {
          const item = generator.valueToCode(block, 'ITEM', generator.ORDER_NONE) || '""';
          return [`fns.checkItem(${item})`, generator.ORDER_ATOMIC];
        }
      };
      
      console.log(`[BackroomsPlugin] Providing ${Object.keys(backroomsGenerators).length} generators`);
      return { ...generators, ...backroomsGenerators };
    },
    
    'blockly:register-toolbox-categories': (categories: any[]) => {
      console.log('[BackroomsPlugin] Registering toolbox category via hook...');
      
      const backroomsCategory = {
        kind: 'category',
        name: 'Backrooms',
        colour: 65,
        contents: [
          { kind: 'block', type: 'backrooms_modify_attribute' },
          { kind: 'block', type: 'backrooms_modify_item' },
          { kind: 'block', type: 'backrooms_check_attribute' },
          { kind: 'block', type: 'backrooms_check_item' }
        ]
      };
      
      return [...categories, backroomsCategory];
    },
    
    'plugin:get-variables': (variables: VariableDefinition[]) => {
      console.log('[BackroomsPlugin] Providing variables via hook...');
      return [...variables, ...BACKROOMS_VARIABLES];
    },
    
    'plugin:get-docs': (docs: Record<string, GameModDocs>) => {
      console.log('[BackroomsPlugin] Providing docs via hook...');
      return { ...docs, [this.metadata.id]: getBackroomsDocs() };
    }
  };

  /**
   * 获取模组使用文档（静态方法，向后兼容）
   */
  static getDocs(): GameModDocs {
    return getBackroomsDocs();
  }
}

