/**
 * Backrooms变量注入器
 * 职责：将Backrooms模组的变量注入到变量列表
 */

import type { VariableDefinition } from '../../../../../shared/types/index.js';
import { BACKROOMS_VARIABLES } from '../../../../../shared/plugins/gamemods/backrooms/index.js';

export function injectBackroomsVariables(
  variables: VariableDefinition[],
  onVariablesChange: (vars: VariableDefinition[]) => void
): void {
  const newVars = [...variables];
  let addedCount = 0;
  
  BACKROOMS_VARIABLES.forEach(varDef => {
    const exists = variables.some(v => v.id === varDef.id);
    if (!exists) {
      newVars.push(varDef);
      addedCount++;
    }
  });
  
  if (addedCount > 0) {
    onVariablesChange(newVars);
    console.log(`[ScriptHelper] Injected ${addedCount} Backrooms variables`);
  } else {
    console.log('[ScriptHelper] All Backrooms variables already exist');
  }
}

