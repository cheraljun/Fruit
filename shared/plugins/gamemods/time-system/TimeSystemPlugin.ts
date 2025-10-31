/**
 * 时间系统插件
 * 职责：提供时间流逝、进位计算、时间显示功能
 * 
 * 设计理念：
 * - 通过 Blockly 积木块可视化操作
 * - 自动处理 分→时→天→月 的进位
 * - 用户只需定义变量：分钟、小时、天、月
 */

import { PluginBase } from '../../../plugin/PluginBase.js';
import type { PluginMetadata } from '../../../plugin/types.js';
import type { RuntimePlugin } from '../../basicmod/RuntimePlugin.js';
import type { GameModDocs } from '../types.js';
import type { VariableDefinition } from '../../../types/index.js';
import { getTimeSystemDocs } from './docs.js';
import { TIME_SYSTEM_VARIABLES } from './variables.js';

export class TimeSystemPlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'gamemod.time-system',
    name: '时间',
    version: '1.0.0',
    author: '系统',
    description: '提供时间流逝和显示功能，自动处理进位规则',
    icon: 'TIME',
    category: 'gamemod',
    tags: ['游戏模组', '时间', 'time', 'calendar'],
    requires: ['basicmod.runtime']
  };

  private runtimePlugin: RuntimePlugin | null = null;

  protected async onInstall(): Promise<void> {
    console.log('[TimeSystemPlugin] Installing time system...');
    
    this.runtimePlugin = this.context.getPlugin<RuntimePlugin>('basicmod.runtime');
    
    if (!this.runtimePlugin) {
      throw new Error('[TimeSystemPlugin] RuntimePlugin not found! TimeSystem requires RuntimePlugin.');
    }
    
    this.registerTimeFunctions();
    
    console.log('[TimeSystemPlugin] Time system installed');
  }

  /**
   * 注册时间系统函数到 RuntimePlugin
   */
  private registerTimeFunctions(): void {
    if (!this.runtimePlugin) return;
    
    console.log('[TimeSystemPlugin] Registering time functions...');
    
    this.runtimePlugin.registerFunction('addTime', (minutes: number) => {
      this.addTime(minutes);
    });
    
    this.runtimePlugin.registerFunction('formatTime', () => {
      return this.formatTime();
    });
    
    console.log('[TimeSystemPlugin] Registered: addTime(), formatTime()');
  }

  /**
   * 增加时间并自动进位
   * @param minutes - 要增加的分钟数
   */
  private addTime(minutes: number): void {
    if (!this.runtimePlugin) return;
    
    const vars = this.runtimePlugin.vars;
    
    if (vars['minute'] === undefined) vars['minute'] = 0;
    if (vars['hour'] === undefined) vars['hour'] = 0;
    if (vars['day'] === undefined) vars['day'] = 1;
    if (vars['month'] === undefined) vars['month'] = 1;
    
    vars['minute'] = (vars['minute'] || 0) + minutes;
    
    if (vars['minute'] >= 60) {
      const addHours = Math.floor(vars['minute'] / 60);
      vars['hour'] = (vars['hour'] || 0) + addHours;
      vars['minute'] = vars['minute'] % 60;
    }
    
    if (vars['hour'] >= 24) {
      const addDays = Math.floor(vars['hour'] / 24);
      vars['day'] = (vars['day'] || 1) + addDays;
      vars['hour'] = vars['hour'] % 24;
    }
    
    if (vars['day'] > 30) {
      const addMonths = Math.floor((vars['day'] - 1) / 30);
      vars['month'] = (vars['month'] || 1) + addMonths;
      vars['day'] = ((vars['day'] - 1) % 30) + 1;
    }
    
    console.log(`[TimeSystemPlugin] Time advanced by ${minutes} minutes. Current: ${this.formatTime()}`);
  }

  /**
   * 格式化时间显示
   * @returns 格式化的时间字符串，例如："第3月 第15天 14:30"
   */
  private formatTime(): string {
    if (!this.runtimePlugin) return '';
    
    const vars = this.runtimePlugin.vars;
    
    const month = vars['month'] || 1;
    const day = vars['day'] || 1;
    const hour = vars['hour'] || 0;
    const minute = vars['minute'] || 0;
    
    const hourStr = String(hour).padStart(2, '0');
    const minuteStr = String(minute).padStart(2, '0');
    
    return `第${month}月 第${day}天 ${hourStr}:${minuteStr}`;
  }

  /**
   * 钩子：注册 Blockly 积木块和工具箱类别
   */
  hooks = {
    'blockly:register-blocks': (blocks: any[]) => {
      console.log('[TimeSystemPlugin] Registering time system blocks...');
      
      const timeBlocks = [
        {
          type: 'time_add',
          message0: '时间流逝 %1 分钟',
          args0: [
            {
              type: 'input_value',
              name: 'MINUTES',
              check: 'Number'
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 45,
          tooltip: '增加游戏时间，自动处理进位（60分→1时，24时→1天，30天→1月）',
          helpUrl: ''
        },
        
        {
          type: 'time_format',
          message0: '当前时间',
          output: 'String',
          colour: 45,
          tooltip: '返回格式化的时间字符串，例如："第3月 第15天 14:30"',
          helpUrl: ''
        }
      ];
      
      console.log(`[TimeSystemPlugin] Providing ${timeBlocks.length} blocks`);
      return [...blocks, ...timeBlocks];
    },
    
    'blockly:register-generators': (generators: Record<string, any>) => {
      console.log('[TimeSystemPlugin] Registering time system code generators...');
      
      const timeGenerators = {
        time_add: function(block: any, generator: any) {
          const minutes = generator.valueToCode(block, 'MINUTES', generator.ORDER_NONE) || '0';
          return `fns.addTime(${minutes});\n`;
        },
        
        time_format: function(_block: any, generator: any) {
          return [`fns.formatTime()`, generator.ORDER_ATOMIC];
        }
      };
      
      console.log(`[TimeSystemPlugin] Providing ${Object.keys(timeGenerators).length} generators`);
      return { ...generators, ...timeGenerators };
    },
    
    'blockly:register-toolbox-categories': (categories: any[]) => {
      console.log('[TimeSystemPlugin] Registering toolbox category via hook...');
      
      const timeCategory = {
        kind: 'category',
        name: '时间',
        colour: 45,
        contents: [
          { kind: 'block', type: 'time_add' },
          { kind: 'block', type: 'time_format' }
        ]
      };
      
      return [...categories, timeCategory];
    },
    
    'plugin:get-variables': (variables: VariableDefinition[]) => {
      console.log('[TimeSystemPlugin] Providing variables via hook...');
      return [...variables, ...TIME_SYSTEM_VARIABLES];
    },
    
    'plugin:get-docs': (docs: Record<string, GameModDocs>) => {
      console.log('[TimeSystemPlugin] Providing docs via hook...');
      return { ...docs, [this.metadata.id]: getTimeSystemDocs() };
    }
  };

  /**
   * 获取模组使用文档（静态方法，向后兼容）
   */
  static getDocs(): GameModDocs {
    return getTimeSystemDocs();
  }
}

