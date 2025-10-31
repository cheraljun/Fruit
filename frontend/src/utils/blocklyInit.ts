/**
 * Blockly 完整初始化工具
 * 职责：注册 Blockly 所有内置积木块 + 自定义积木块
 */

import * as Blockly from 'blockly';

// 导入 Blockly 所有内置 blocks（会自动注册到 Blockly.Blocks）
import 'blockly/blocks';

// 导入所有 JavaScript 代码生成器（会自动注册到 javascriptGenerator）
import { javascriptGenerator } from 'blockly/javascript';

// 导入中文语言包
import * as ZhHans from 'blockly/msg/zh-hans';

import { BlocklyExecutor } from '../../../shared/core/BlocklyExecutor';
import type { BlocklyWorkspaceState } from '../../../shared/types/blockly';
import type { PluginSystem } from '../../../shared/plugin/PluginSystem';

let isInitialized = false;

/**
 * 初始化 Blockly - 包含所有内置功能 + 自定义积木块
 * 只需要调用一次
 * 
 * @param pluginSystem - 插件系统实例（必须）。通过钩子收集所有插件的积木定义
 */
export function initializeBlockly(pluginSystem: PluginSystem): void {
  if (isInitialized) {
    console.log('[Blockly] Already initialized, skipping');
    return;
  }
  
  console.log('[Blockly] Starting initialization with PluginSystem...');

  // ============= 0. 设置中文语言 =============
  Blockly.setLocale(ZhHans as any);

  // ============= 1. 注册 Blockly 所有内置 blocks =============
  // 这些 blocks 已经在 NPM 包中，直接引用即可
  // 包括：logic, loops, math, text, lists, variables, procedures 等
  
  // Blockly.Blocks 会自动包含所有内置块定义
  // 我们只需要确保导入了 blocks 模块
  console.log('[Blockly] Loading all built-in blocks (中文)...');
  
  // 验证内置块是否加载
  const builtinBlockTypes = [
    // Logic blocks
    'controls_if', 'controls_ifelse', 'logic_compare', 'logic_operation', 
    'logic_negate', 'logic_boolean', 'logic_null', 'logic_ternary',
    
    // Loop blocks
    'controls_repeat_ext', 'controls_repeat', 'controls_whileUntil',
    'controls_for', 'controls_forEach', 'controls_flow_statements',
    
    // Math blocks
    'math_number', 'math_arithmetic', 'math_single', 'math_trig',
    'math_constant', 'math_number_property', 'math_round',
    'math_on_list', 'math_modulo', 'math_constrain', 'math_random_int',
    'math_random_float',
    
    // Text blocks
    'text', 'text_multiline', 'text_join', 'text_append', 'text_length',
    'text_isEmpty', 'text_indexOf', 'text_charAt', 'text_getSubstring',
    'text_changeCase', 'text_trim', 'text_count', 'text_replace',
    'text_reverse',
    
    // List blocks
    'lists_create_empty', 'lists_create_with', 'lists_repeat',
    'lists_length', 'lists_isEmpty', 'lists_indexOf', 'lists_getIndex',
    'lists_setIndex', 'lists_getSublist', 'lists_split', 'lists_sort',
    'lists_reverse',
    
    // Variable blocks
    'variables_get', 'variables_set',
    
    // Procedure blocks (函数定义)
    'procedures_defnoreturn', 'procedures_defreturn',
    'procedures_callnoreturn', 'procedures_callreturn',
    'procedures_ifreturn'
  ];

  console.log(`[Blockly] Built-in blocks available: ${builtinBlockTypes.length} types`);

  // ============= 2. 注册自定义积木块（互动小说专用 + 游戏模组）=============
  console.log('[Blockly] Step 2: Collecting custom blocks from plugins...');
  
  // 通过钩子收集所有插件的积木块定义
  const allCustomBlocks: any[] = pluginSystem.trigger('blockly:register-blocks', []);
  console.log(`[Blockly] Collected ${allCustomBlocks.length} custom blocks`);
  
  // 通过钩子收集所有插件的代码生成器
  const allCustomGenerators: Record<string, any> = pluginSystem.trigger('blockly:register-generators', {});
  console.log(`[Blockly] Collected ${Object.keys(allCustomGenerators).length} code generators`);
  
  // 批量注册积木块
  console.log('[Blockly] Registering blocks to Blockly.Blocks...');
  allCustomBlocks.forEach((blockDef: any) => {
    Blockly.Blocks[blockDef.type] = {
      init: function() {
        this.jsonInit(blockDef);
      }
    };
    console.log(`[Blockly]   Registered block: ${blockDef.type}`);
  });

  // ============= 3. 注册代码生成器 =============
  console.log('[Blockly] Step 3: Registering code generators...');
  Object.entries(allCustomGenerators).forEach(([blockType, generator]) => {
    (javascriptGenerator as any).forBlock[blockType] = generator;
    console.log(`[Blockly]   Registered generator: ${blockType}`);
  });

  // ============= 通信层：连接 Blockly 和 RuntimePlugin =============
  // 目的：让 Blockly 的内置变量块生成访问 RuntimePlugin.vars 对象的代码
  // 
  // 设计原则：
  // - 不破坏 Blockly：使用官方的代码生成器扩展接口
  // - 不破坏 RuntimePlugin：继续用 vars 对象存储变量
  // - 只在这里做"翻译"：Blockly变量 → vars['变量名']
  
  (javascriptGenerator as any).forBlock['variables_set'] = function(block: any, generator: any) {
    const varId = block.getFieldValue('VAR');  // 直接获取变量 ID（在我们的设计中，id = name）
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ASSIGNMENT) || '0';
    return `vars['${varId}'] = ${value};\n`;
  };

  (javascriptGenerator as any).forBlock['variables_get'] = function(block: any, generator: any) {
    const varId = block.getFieldValue('VAR');  // 直接获取变量 ID
    return [`vars['${varId}']`, generator.ORDER_ATOMIC];
  };

  (javascriptGenerator as any).forBlock['math_change'] = function(block: any, generator: any) {
    const varId = block.getFieldValue('VAR');  // 直接获取变量 ID
    const delta = generator.valueToCode(block, 'DELTA', generator.ORDER_ADDITION) || '1';
    return `vars['${varId}'] = (typeof vars['${varId}'] == 'number' ? vars['${varId}'] : 0) + (${delta});\n`;
  };

  // 重写 text_append 块（向变量追加文本）
  (javascriptGenerator as any).forBlock['text_append'] = function(block: any, generator: any) {
    const varId = block.getFieldValue('VAR');  // 直接获取变量 ID
    const text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '\'\'';
    return `vars['${varId}'] = (vars['${varId}'] || '') + String(${text});\n`;
  };

  // 重写 controls_for 块（for 循环，会创建循环变量）
  (javascriptGenerator as any).forBlock['controls_for'] = function(block: any, generator: any) {
    const varId = block.getFieldValue('VAR');  // 直接获取变量 ID
    const from = generator.valueToCode(block, 'FROM', generator.ORDER_ASSIGNMENT) || '0';
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ASSIGNMENT) || '0';
    const by = generator.valueToCode(block, 'BY', generator.ORDER_ASSIGNMENT) || '1';
    const branch = generator.statementToCode(block, 'DO');
    
    let code = '';
    code += `for (vars['${varId}'] = ${from}; `;
    code += `vars['${varId}'] <= ${to}; `;
    code += `vars['${varId}'] += ${by}) {\n`;
    code += branch;
    code += '}\n';
    return code;
  };

  // 重写 controls_forEach 块（forEach 循环，会创建循环项变量）
  (javascriptGenerator as any).forBlock['controls_forEach'] = function(block: any, generator: any) {
    const varId = block.getFieldValue('VAR');  // 直接获取变量 ID
    const list = generator.valueToCode(block, 'LIST', generator.ORDER_ASSIGNMENT) || '[]';
    const branch = generator.statementToCode(block, 'DO');
    
    // 使用简单的计数器，避免依赖 nameDB_
    const tempVarName = 'temp_list_' + Math.random().toString(36).substr(2, 9);
    let code = '';
    code += `var ${tempVarName} = ${list};\n`;
    code += `for (var ${tempVarName}_index in ${tempVarName}) {\n`;
    code += `  vars['${varId}'] = ${tempVarName}[${tempVarName}_index];\n`;
    code += branch;
    code += '}\n';
    return code;
  };

  // ============= 4. 注入代码生成器到 BlocklyExecutor =============
  BlocklyExecutor.setCodeGenerator((state: BlocklyWorkspaceState) => {
    const tempDiv = document.createElement('div');
    const workspace = Blockly.inject(tempDiv, { readOnly: true });

    try {
      Blockly.serialization.workspaces.load(state, workspace);
      
      // 使用 workspaceToCode 生成代码
      let code = javascriptGenerator.workspaceToCode(workspace);
      
      // 移除 Blockly 自动生成的变量声明（我们不需要，变量都在 vars 对象里）
      // 匹配多种格式：
      // - var xxx;
      // - var xxx, yyy;
      // - var xxx, yyy, zzz;
      // 包括后面可能的空行
      code = code.replace(/^var\s+[^;]+;[\s\n]*/gm, '');
      
      // 检查是否是单个表达式（需要返回值）
      // 例如条件判断：money >= 10 应该生成 return vars['money'] >= 10;
      const topBlocks = workspace.getTopBlocks(false);
      if (topBlocks.length === 1 && topBlocks[0].outputConnection !== null) {
        // 这是一个值块（表达式），需要添加 return
        const trimmedCode = code.trim();
        if (trimmedCode && !trimmedCode.startsWith('return')) {
          const statement = trimmedCode.endsWith(';') ? trimmedCode.slice(0, -1) : trimmedCode;
          code = `return ${statement};`;
        }
      }
      
      return code;
    } catch (error) {
      console.error('[Blockly] Failed to generate code:', error);
      
      // 检查是否是数据结构错误
      if (error instanceof Error && error.message.includes('shadow')) {
        console.error('[Blockly] 提示：Blockly 工作区数据结构有问题。');
        console.error('[Blockly] 建议：在编辑器中重新创建此脚本，不要手写 JSON。');
      }
      
      return '';
    } finally {
      workspace.dispose();
      tempDiv.remove();
    }
  });

  isInitialized = true;
  console.log('[Blockly] Initialization complete!');
  console.log(`[Blockly] Total custom blocks: ${allCustomBlocks.length}`);
  console.log(`[Blockly] Total custom generators: ${Object.keys(allCustomGenerators).length}`);
  console.log('[Blockly] Ready to use!');
}

/**
 * 创建完整的工具箱配置
 * 包含 Blockly 所有内置类别 + 插件动态注册的类别
 * 
 * @param pluginSystem - 插件系统实例，用于收集插件提供的工具箱类别
 */
export function createCustomToolbox(pluginSystem: PluginSystem) {
  // 通过钩子收集所有插件提供的工具箱类别
  const pluginCategories = pluginSystem.trigger('blockly:register-toolbox-categories', []);
  console.log(`[Blockly] Collected ${pluginCategories.length} plugin toolbox categories`);
  
  return {
    kind: 'categoryToolbox',
    contents: [
      // ==================== 插件类别（动态收集）====================
      ...pluginCategories,

      // ==================== Blockly 内置类别 ====================
      
      // 逻辑类别
      {
        kind: 'category',
        name: '逻辑',
        colour: 210,
        contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'controls_ifelse' },
          { kind: 'block', type: 'logic_compare' },
          { kind: 'block', type: 'logic_operation' },
          { kind: 'block', type: 'logic_negate' },
          { kind: 'block', type: 'logic_boolean' },
          { kind: 'block', type: 'logic_null' },
          { kind: 'block', type: 'logic_ternary' }
        ]
      },

      // 循环类别
      {
        kind: 'category',
        name: '循环',
        colour: 120,
        contents: [
          { kind: 'block', type: 'controls_repeat_ext' },
          { kind: 'block', type: 'controls_whileUntil' },
          { kind: 'block', type: 'controls_for' },
          { kind: 'block', type: 'controls_forEach' },
          { kind: 'block', type: 'controls_flow_statements' }
        ]
      },

      // 数学类别
      {
        kind: 'category',
        name: '数学',
        colour: 230,
        contents: [
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'math_single' },
          { kind: 'block', type: 'math_trig' },
          { kind: 'block', type: 'math_constant' },
          { kind: 'block', type: 'math_number_property' },
          { kind: 'block', type: 'math_round' },
          { kind: 'block', type: 'math_on_list' },
          { kind: 'block', type: 'math_modulo' },
          { kind: 'block', type: 'math_constrain' },
          { kind: 'block', type: 'math_random_int' },
          { kind: 'block', type: 'math_random_float' }
        ]
      },

      // 文本类别
      {
        kind: 'category',
        name: '文本',
        colour: 160,
        contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_multiline' },
          { kind: 'block', type: 'text_join' },
          { kind: 'block', type: 'text_append' },
          { kind: 'block', type: 'text_length' },
          { kind: 'block', type: 'text_isEmpty' },
          { kind: 'block', type: 'text_indexOf' },
          { kind: 'block', type: 'text_charAt' },
          { kind: 'block', type: 'text_getSubstring' },
          { kind: 'block', type: 'text_changeCase' },
          { kind: 'block', type: 'text_trim' },
          { kind: 'block', type: 'text_count' },
          { kind: 'block', type: 'text_replace' },
          { kind: 'block', type: 'text_reverse' }
        ]
      },

      // 列表类别
      {
        kind: 'category',
        name: '列表',
        colour: 260,
        contents: [
          { kind: 'block', type: 'lists_create_empty' },
          { kind: 'block', type: 'lists_create_with' },
          { kind: 'block', type: 'lists_repeat' },
          { kind: 'block', type: 'lists_length' },
          { kind: 'block', type: 'lists_isEmpty' },
          { kind: 'block', type: 'lists_indexOf' },
          { kind: 'block', type: 'lists_getIndex' },
          { kind: 'block', type: 'lists_setIndex' },
          { kind: 'block', type: 'lists_getSublist' },
          { kind: 'block', type: 'lists_split' },
          { kind: 'block', type: 'lists_sort' },
          { kind: 'block', type: 'lists_reverse' }
        ]
      },

      // 变量类别（仅使用左侧栏管理的全局变量）
      // 禁用 Blockly 内置的变量管理 UI（创建/重命名/删除）
      // 用户只能使用侧边栏预定义的变量，确保单向数据流
      {
        kind: 'category',
        name: '故事变量',
        colour: 330,
        contents: [
          { kind: 'block', type: 'variables_set' },
          { kind: 'block', type: 'variables_get' },
          { kind: 'block', type: 'math_change' }
        ]
      },

      // 函数类别（Procedures - 重要功能！）
      {
        kind: 'category',
        name: '函数',
        colour: 290,
        custom: 'PROCEDURE'
      }
    ]
  };
}
