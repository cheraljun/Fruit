/**
 * 脚本助手组件
 * 职责：展示已启用游戏模组的使用文档
 */

import { useState } from 'react';
import { usePluginSystem } from '../contexts/PluginContext.tsx';
import type { GameModDocs } from '../../../shared/plugins/gamemods/types.js';

function ScriptHelper(): JSX.Element {
  const pluginSystem = usePluginSystem();
  const [expanded, setExpanded] = useState(false);
  const [expandedMods, setExpandedMods] = useState<Record<string, boolean>>({});

  const gameModDocs: Record<string, GameModDocs> = {};

  const enabledGameMods = Object.keys(gameModDocs).filter(modId => 
    pluginSystem.isPluginEnabled(modId)
  );

  const groupedMods = enabledGameMods.reduce((acc, modId) => {
    const category = modId.includes('base') ? '基础模组' : 
                     modId.includes('survival') ? '荒野生存模组' : '其他';
    if (!acc[category]) acc[category] = [];
    acc[category].push(modId);
    return acc;
  }, {} as Record<string, string[]>);

  const toggleModExpanded = (modId: string) => {
    setExpandedMods(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  if (enabledGameMods.length === 0) {
    return (
      <div className="section">
        <h3>模组</h3>
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
        {expanded ? '▼' : '▶'} 模组 ({enabledGameMods.length}个)
      </button>

      {expanded && (
        <div style={{ marginTop: '12px' }}>
          {Object.entries(groupedMods).map(([category, modIds]) => (
            <div key={category} style={{ marginBottom: '16px' }}>
              <h4 style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: '#6b7280'
              }}>
                {category}
              </h4>
              {modIds.map(modId => {
                const docs = gameModDocs[modId];
                const isExpanded = expandedMods[modId];

            return (
              <div 
                key={modId}
                style={{
                  marginBottom: '12px',
                  border: '1px solid #e5e7eb',
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
                  <span>{isExpanded ? '▼' : '▶'}</span>
                </button>

                {isExpanded && (
                  <div style={{ padding: '12px', fontSize: '0.85rem' }}>
                    <p style={{ 
                      margin: '0 0 12px 0', 
                      color: '#6b7280',
                      fontSize: '0.825rem'
                    }}>
                      {docs.description}
                    </p>

                    {docs.variables.length > 0 && (
                      <>
                        <h4 style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: '600',
                          margin: '12px 0 8px 0',
                          color: '#374151'
                        }}>
                          变量
                        </h4>
                        {docs.variables.map((v, idx) => (
                          <div 
                            key={idx}
                            style={{
                              marginBottom: '8px',
                              padding: '8px',
                              background: '#f9fafb',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <code style={{ 
                              color: '#7c3aed',
                              fontWeight: '600'
                            }}>
                              {v.name}
                            </code>
                            <div style={{ 
                              margin: '4px 0 2px 0', 
                              color: '#6b7280' 
                            }}>
                              {v.description}
                            </div>
                            <code style={{ 
                              display: 'block',
                              marginTop: '4px',
                              padding: '4px',
                              background: '#ffffff',
                              borderRadius: '2px',
                              fontSize: '0.75rem',
                              color: '#059669'
                            }}>
                              {v.example}
                            </code>
                          </div>
                        ))}
                      </>
                    )}

                    {docs.functions.length > 0 && (
                      <>
                        <h4 style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: '600',
                          margin: '12px 0 8px 0',
                          color: '#374151'
                        }}>
                          函数
                        </h4>
                        {docs.functions.map((fn, idx) => (
                          <div 
                            key={idx}
                            style={{
                              marginBottom: '8px',
                              padding: '8px',
                              background: '#f9fafb',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <div>
                              <code style={{ 
                                color: '#2563eb',
                                fontWeight: '600'
                              }}>
                                {fn.name}
                              </code>
                              <code style={{ 
                                color: '#6b7280',
                                marginLeft: '2px'
                              }}>
                                {fn.params}
                              </code>
                            </div>
                            <div style={{ 
                              margin: '4px 0', 
                              color: '#6b7280' 
                            }}>
                              {fn.description}
                            </div>
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#9ca3af',
                              marginBottom: '4px'
                            }}>
                              返回: {fn.returns}
                            </div>
                            <code style={{ 
                              display: 'block',
                              padding: '4px',
                              background: '#ffffff',
                              borderRadius: '2px',
                              fontSize: '0.75rem',
                              color: '#059669'
                            }}>
                              {fn.example}
                            </code>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScriptHelper;

