/**
 * 时间系统变量注入器
 * 职责：将时间系统模组的变量注入到变量列表
 */

import type { VariableDefinition } from '../../../../../shared/types/index.js';
import { TIME_SYSTEM_VARIABLES } from '../../../../../shared/plugins/gamemods/time-system/index.js';

export function injectTimeSystemVariables(
  variables: VariableDefinition[],
  onVariablesChange: (vars: VariableDefinition[]) => void
): void {
  const newVars = [...variables];
  let addedCount = 0;
  
  TIME_SYSTEM_VARIABLES.forEach(varDef => {
    const exists = variables.some(v => v.id === varDef.id);
    if (!exists) {
      newVars.push(varDef);
      addedCount++;
    }
  });
  
  if (addedCount > 0) {
    onVariablesChange(newVars);
    console.log(`[ScriptHelper] Injected ${addedCount} Time System variables`);
  } else {
    console.log('[ScriptHelper] All Time System variables already exist');
  }
}

