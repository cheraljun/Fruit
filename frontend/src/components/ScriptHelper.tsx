/**
 * 脚本助手组件
 * 职责：展示已启用游戏模组的使用文档
 */

import { useState } from 'react';
import { usePluginSystem } from '../contexts/PluginContext.tsx';
import type { GameModDocs } from '../../../shared/plugins/gamemods/types.js';
import type { VariableDefinition } from '../../../shared/types/index.js';
import { TimeSystemPlugin } from '../../../shared/plugins/gamemods/TimeSystemPlugin.js';

interface ScriptHelperProps {
  variables: VariableDefinition[];
  onVariablesChange: (variables: VariableDefinition[]) => void;
}

function ScriptHelper({ variables, onVariablesChange }: ScriptHelperProps): JSX.Element {
  const pluginSystem = usePluginSystem();
  const [expanded, setExpanded] = useState(false);
  const [expandedMods, setExpandedMods] = useState<Record<string, boolean>>({});

  // 获取所有已启用的游戏模组插件
  const enabledGameMods = pluginSystem.getEnabledPlugins()
    .filter(p => p.plugin.metadata.category === 'gamemod')
    .map(p => p.plugin.metadata.id);
  
  // 游戏模组文档
  const gameModDocs: Record<string, GameModDocs> = {
    'gamemod.time-system': TimeSystemPlugin.getDocs()
  };

  const toggleModExpanded = (modId: string) => {
    setExpandedMods(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const injectTimeVariables = () => {
    const requiredVars: VariableDefinition[] = [
      { id: 'minute', label: '分钟', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.time-system' },
      { id: 'hour', label: '小时', type: 'number', defaultValue: 0, source: 'plugin', pluginId: 'gamemod.time-system' },
      { id: 'day', label: '天', type: 'number', defaultValue: 1, source: 'plugin', pluginId: 'gamemod.time-system' },
      { id: 'month', label: '月', type: 'number', defaultValue: 1, source: 'plugin', pluginId: 'gamemod.time-system' }
    ];
    
    const newVars = [...variables];
    let addedCount = 0;
    
    requiredVars.forEach(varDef => {
      const exists = variables.some(v => v.id === varDef.id);
      if (!exists) {
        newVars.push(varDef);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      onVariablesChange(newVars);
      console.log(`[ScriptHelper] Injected ${addedCount} time variables`);
    } else {
      console.log('[ScriptHelper] All time variables already exist');
    }
  };

  if (enabledGameMods.length === 0) {
    return (
      <div className="section">
        <h3>游戏模组</h3>
        <div style={{ 
          padding: '12px', 
          background: '#f9fafb', 
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          未启用游戏模组。前往插件商店启用游戏模组。
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <button 
        className="toggle-list-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '▼' : '▶'} 游戏模组 ({enabledGameMods.length}个)
      </button>

      {expanded && (
        <div style={{ marginTop: '12px' }}>
          {enabledGameMods.map(modId => {
            const plugin = pluginSystem.getPlugin(modId);
            if (!plugin) return null;
            
            const docs = gameModDocs[modId];
            const isModExpanded = expandedMods[modId];

            return (
              <div 
                key={modId}
                style={{
                  marginBottom: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleModExpanded(modId)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#f9fafb',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  <span>{docs.name}</span>
                  <span>{isModExpanded ? '▼' : '▶'}</span>
                </button>

                {isModExpanded && docs && (
                  <div style={{ 
                    padding: '12px', 
                    fontSize: '0.8rem', 
                    background: '#ffffff',
                    color: '#374151',
                    lineHeight: '1.6'
                  }}>
                    <p style={{ 
                      margin: '0 0 12px 0', 
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {docs.description}
                    </p>
                    
                    {modId === 'gamemod.time-system' && (
                      <button
                        onClick={injectTimeVariables}
                        style={{
                          padding: '8px 12px',
                          marginBottom: '12px',
                          background: 'var(--theme-brand-primary)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        注入变量
                      </button>
                    )}
                    
                    {docs.usage?.setup && docs.usage.setup.map((line, idx) => (
                      <div key={idx} style={{ 
                        marginBottom: '4px',
                        textAlign: 'left',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: '#4b5563'
                      }}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ScriptHelper;

