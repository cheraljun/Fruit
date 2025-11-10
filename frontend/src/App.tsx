/**
 * 应用主入口
 * 职责：路由配置、插件系统初始化
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PluginProvider } from './contexts/PluginContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import LandingPage from './pages/LandingPage.tsx'
import StatementPage from './pages/StatementPage.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Editor from './pages/Editor.tsx'
import PlayerRouter from './pages/PlayerRouter.tsx'
import PluginStore from './pages/PluginStore.tsx'

function App(): JSX.Element {
  return (
    <PluginProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/statement" element={<StatementPage />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/play/:id" element={<PlayerRouter />} />
            <Route path="/play/published/:username/:gameId" element={<PlayerRouter />} />
            <Route path="/plugins" element={<PluginStore />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PluginProvider>
  )
}

export default App

