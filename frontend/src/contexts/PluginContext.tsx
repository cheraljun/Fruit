/**
 * 插件系统上下文
 * 职责：为整个应用提供插件系统访问
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PluginSystem } from '../plugin/PluginSystem';
import { createBuiltinPlugins } from '../plugins/index';
import { createFrontendPlugins, ThemeManager } from '../plugins/index';

const PluginContext = createContext<PluginSystem | null>(null);

export function PluginProvider({ children }: { children: React.ReactNode }) {
  const [pluginSystem] = useState(() => {
    const system = new PluginSystem();
    return system;
  });

  const [themeManager] = useState(() => {
    return new ThemeManager(pluginSystem);
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initPlugins = async () => {
      // 合并后端兼容插件和前端专用插件
      const backendPlugins = createBuiltinPlugins();
      const frontendPlugins = createFrontendPlugins();
      const allPlugins = [...backendPlugins, ...frontendPlugins];
      
      // 顺序注册所有插件
      // 注意：register现在是原子操作，会同时注册plugin实例和actions manifest
      // 这确保了manifest在任何hooks执行前就已经存在，避免竞争条件
      for (const plugin of allPlugins) {
        try {
          if (!pluginSystem.hasPlugin(plugin.metadata.id)) {
            await pluginSystem.register(plugin);
            console.log(`[PluginSystem] Registered: ${plugin.metadata.id}`);
          }
        } catch (error) {
          console.error(`Failed to register plugin ${plugin.metadata.id}:`, error);
        }
      }

      // 导入保存的配置（enable/disable操作）
      // 现在是安全的：enable会重新注册manifest，disable会清理manifest
      const savedConfig = localStorage.getItem('plugin_config');
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          await pluginSystem.importConfig(config);
        } catch (error) {
          console.error('Failed to load plugin config:', error);
        }
      }

      // 初始化主题系统
      await themeManager.initialize();

      setInitialized(true);
    };

    if (!initialized) {
      initPlugins();
    }
  }, [pluginSystem, initialized]);

  useEffect(() => {
    if (!initialized) return;

    const saveConfig = () => {
      const config = pluginSystem.exportConfig();
      localStorage.setItem('plugin_config', JSON.stringify(config));
    };

    const interval = setInterval(saveConfig, 5000);
    window.addEventListener('beforeunload', saveConfig);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', saveConfig);
      saveConfig();
    };
  }, [initialized, pluginSystem]);

  if (!initialized) {
    return <div>Loading plugins...</div>;
  }

  return (
    <PluginContext.Provider value={pluginSystem}>
      {children}
    </PluginContext.Provider>
  );
}

export function usePluginSystem(): PluginSystem {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginSystem must be used within PluginProvider');
  }
  return context;
}

