/**
 * Blockly 基础插件
 * 职责：定义互动小说专用的自定义积木块
 */

import { PluginBase } from '../../plugin/PluginBase.js';
import type { PluginMetadata } from '../../plugin/types.js';

export class BlocklyPlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'basicmod.blockly',
    name: 'Blockly基础积木',
    version: '1.0.0',
    author: '系统',
    description: '提供互动小说专用的 Blockly 积木块定义',
    icon: 'BLOCKLY',
    category: 'basicmod',
    tags: ['基础模组', 'blockly', 'visual-programming'],
    requires: ['basicmod.runtime']
  };

  protected async onInstall(): Promise<void> {
    // 在前端环境注册自定义积木块
    if (typeof (globalThis as any).window !== 'undefined') {
      this.registerCustomBlocks();
    }
  }

  /**
   * 注册自定义积木块
   * 注意：这些积木块在前端运行时动态注册
   */
  private registerCustomBlocks(): void {
    // 由于 Blockly 是前端库，这里只是占位
    // 实际的积木块定义会在前端组件中完成
    console.log('[BlocklyPlugin] Custom blocks will be registered in frontend');
  }

  /**
   * 获取自定义积木块定义（供前端使用）
   */
  static getCustomBlockDefinitions() {
    return {
      // 互动小说专用积木
      story: [
        {
          type: 'story_show_text',
          message0: '显示文本 %1',
          args0: [
            {
              type: 'input_value',
              name: 'TEXT',
              check: 'String'
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 270,
          tooltip: '在节点中显示文本（调试用）',
          helpUrl: ''
        },
        {
          type: 'story_random',
          message0: '随机数 从 %1 到 %2',
          args0: [
            {
              type: 'input_value',
              name: 'FROM',
              check: 'Number'
            },
            {
              type: 'input_value',
              name: 'TO',
              check: 'Number'
            }
          ],
          output: 'Number',
          colour: 90,
          tooltip: '生成指定范围内的随机整数',
          helpUrl: ''
        }
      ]
    };
  }

  /**
   * 获取代码生成器（供前端使用）
   */
  static getCodeGenerators() {
    return {
      story_show_text: function(block: any, generator: any) {
        const text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '""';
        return `console.log(${text});\n`;
      },
      
      story_random: function(block: any, generator: any) {
        const from = generator.valueToCode(block, 'FROM', generator.ORDER_NONE) || '1';
        const to = generator.valueToCode(block, 'TO', generator.ORDER_NONE) || '10';
        return [`Math.floor(Math.random() * ((${to}) - (${from}) + 1)) + (${from})`, 99];
      }
    };
  }
}

