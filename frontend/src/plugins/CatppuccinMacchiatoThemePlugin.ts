/**
 * Catppuccin Macchiato 主题插件
 * 职责：提供Catppuccin的中度暗色Macchiato配色方案
 */

import { ThemePlugin, type ThemeDefinition } from './ThemePlugin';
import type { PluginMetadata } from '../../../shared/plugin/types';

export class CatppuccinMacchiatoThemePlugin extends ThemePlugin {
  metadata: PluginMetadata = {
    id: 'theme.catppuccin.macchiato',
    name: 'Catppuccin Macchiato',
    version: '1.0.0',
    description: '平衡的中度暗色主题，兼顾可读性与护眼',
    author: 'Catppuccin Community',
    category: 'theme',
    tags: ['暗色', '平衡', 'Catppuccin'],
    conflicts: ['theme.light', 'theme.dark', 'theme.catppuccin.latte', 'theme.catppuccin.frappe', 'theme.catppuccin.mocha']
  };

  config = {
    enabled: false,
    settings: {}
  };

  getThemeDefinition(): ThemeDefinition {
    return {
      id: 'catppuccin-macchiato',
      name: 'Catppuccin Macchiato',
      description: '平衡的中度暗色主题',
      isDark: true,
      colors: {
        backgroundPrimary: '#24273a',     // base
        backgroundSecondary: '#1e2030',   // mantle
        backgroundGradient: 'linear-gradient(180deg, #24273a 0%, #181926 100%)',
        
        textPrimary: '#cad3f5',           // text
        textSecondary: '#b8c0e0',         // subtext1
        textMuted: '#a5adcb',             // subtext0
        
        brandPrimary: '#f5bde6',          // pink
        brandSecondary: '#c6a0f6',        // mauve
        brandGradient: 'linear-gradient(135deg, #f5bde6 0%, #c6a0f6 100%)',
        
        success: '#a6da95',               // green
        warning: '#eed49f',               // yellow
        danger: '#ed8796',                // red
        info: '#8aadf4',                  // blue
        
        border: '#5b6078',                // surface2
        borderLight: '#494d64',           // surface1
        borderFocus: '#f5bde6',           // pink
        
        hover: 'rgba(245, 189, 230, 0.12)',
        active: 'rgba(245, 189, 230, 0.18)',
        selected: 'rgba(245, 189, 230, 0.22)',
        
        shadow: 'rgba(0, 0, 0, 0.4)',
        shadowLight: 'rgba(0, 0, 0, 0.2)',
        shadowHeavy: 'rgba(0, 0, 0, 0.55)'
      },
      customCSS: `
        /* ===== Catppuccin Macchiato 主题 ===== */
        .theme-dark {
          color-scheme: dark;
        }
        
        /* === 全局样式 === */
        .theme-dark body {
          background: linear-gradient(180deg, #24273a 0%, #181926 100%);
          color: #cad3f5;
        }
        
        /* === 按钮样式 === */
        .theme-dark .btn-primary {
          background: linear-gradient(135deg, #f5bde6 0%, #c6a0f6 100%);
          box-shadow: 0 2px 8px rgba(245, 189, 230, 0.4);
          color: #24273a;
        }
        
        .theme-dark .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #e9abd9 0%, #b88eec 100%);
          box-shadow: 0 4px 12px rgba(245, 189, 230, 0.55);
        }
        
        .theme-dark .btn-success {
          background: linear-gradient(135deg, #f5bde6 0%, #c6a0f6 100%);
          color: #24273a;
          box-shadow: 0 2px 8px rgba(245, 189, 230, 0.4);
        }
        
        .theme-dark .btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #e9abd9 0%, #b88eec 100%);
          box-shadow: 0 4px 12px rgba(245, 189, 230, 0.55);
        }
        
        .theme-dark .btn-secondary {
          background: #181926;
          color: #b8c0e0;
          border: 1px solid #494d64;
        }
        
        .theme-dark .btn-secondary:hover:not(:disabled) {
          background: #1e2030;
          border-color: #5b6078;
        }
        
        .theme-dark .btn-danger {
          background: linear-gradient(135deg, #c56c7a 0%, #ed8796 100%);
          color: #24273a;
        }
        
        .theme-dark .btn-danger-confirm {
          background: linear-gradient(135deg, #ed8796 0%, #ee99a0 100%);
          color: #24273a;
          animation: pulse-danger 1s infinite;
        }
        
        /* === 表单组件 === */
        .theme-dark .form-group input,
        .theme-dark .form-group textarea,
        .theme-dark .form-group select {
          background: #181926;
          color: #cad3f5;
          border: 1px solid #494d64;
        }
        
        .theme-dark .form-group input::placeholder,
        .theme-dark .form-group textarea::placeholder {
          color: #a5adcb;
        }
        
        .theme-dark .form-group input:focus,
        .theme-dark .form-group textarea:focus,
        .theme-dark .form-group select:focus {
          border-color: #f5bde6;
          box-shadow: 0 0 0 3px rgba(245, 189, 230, 0.15);
          background: #1e2030;
        }
        
        .theme-dark .form-group label {
          color: #b8c0e0;
        }
        
        .theme-dark select option {
          background: #181926;
          color: #cad3f5;
        }
        
        .theme-dark select option:hover,
        .theme-dark select option:checked {
          background: #1e2030;
          color: #f5bde6;
        }
        
        /* === 卡片和面板 === */
        .theme-dark .section,
        .theme-dark .story-card,
        .theme-dark .plugin-card,
        .theme-dark .description-card,
        .theme-dark .login-card {
          background: #1e2030;
          border: 2px solid #363a4f;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          color: #cad3f5;
        }
        
        .theme-dark .section:hover,
        .theme-dark .story-card:hover,
        .theme-dark .plugin-card:hover {
          border-color: #f5bde6;
          box-shadow: 0 8px 24px rgba(245, 189, 230, 0.18);
        }
        
        /* === Dashboard 页面 === */
        .theme-dark .dashboard {
          background: #24273a;
        }
        
        .theme-dark .dashboard-header h1,
        .theme-dark .hero-title,
        .theme-dark .community-title {
          color: #cad3f5 !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: #cad3f5 !important;
          background-clip: unset !important;
        }
        
        .theme-dark .hero-title-inline {
          color: #fae3e3 !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: #fae3e3 !important;
          background-clip: unset !important;
        }
        
        .theme-dark .subtitle,
        .theme-dark .hero-subtitle,
        .theme-dark .hero-description {
          color: #b8c0e0;
        }
        
        .theme-dark .dashboard-user,
        .theme-dark .user-name,
        .theme-dark .user-email {
          color: #a5adcb;
        }
        
        .theme-dark .dashboard-user button:hover {
          color: #f5bde6;
        }
        
        .theme-dark .story-card h3 {
          color: #f5bde6;
        }
        
        .theme-dark .story-description,
        .theme-dark .story-desc,
        .theme-dark .story-meta {
          color: #b8c0e0;
        }
        
        .theme-dark .story-stats {
          color: #a5adcb;
          border-top: 1px solid #363a4f;
        }
        
        .theme-dark .empty-state {
          color: #a5adcb;
        }
        
        /* === 编辑器样式 === */
        .theme-dark .editor-container {
          background: #24273a;
        }
        
        .theme-dark .editor-sidebar {
          background: linear-gradient(180deg, #1e2030 0%, #181926 100%);
          border-right: 2px solid #363a4f;
        }
        
        .theme-dark .sidebar-title {
          background: linear-gradient(135deg, #f5bde6 0%, #c6a0f6 50%, #b7bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .theme-dark .section h3 {
          color: #cad3f5;
        }
        
        .theme-dark .btn-back {
          background: #181926;
          border: 1px solid #494d64;
          color: #b8c0e0;
        }
        
        .theme-dark .btn-back:hover {
          background: #1e2030;
          border-color: #f5bde6;
        }
        
        /* === 故事节点 === */
        .theme-dark .story-node {
          background: #ffffff;
          border: 2px solid #5b6078;
          color: #4c4f69;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.55);
        }
        
        .theme-dark .story-node:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.7);
          border-color: #8aadf4;
        }
        
        .theme-dark .react-flow__node.selected .story-node {
          border-color: #8aadf4;
          box-shadow: 0 0 0 8px rgba(138, 173, 244, 0.22);
        }
        
        .theme-dark .node-header {
          border-bottom: 1px solid #e6e9ef;
        }
        
        .theme-dark .node-title {
          color: #4c4f69;
        }
        
        .theme-dark .node-content {
          color: #5c5f77;
        }
        
        .theme-dark .choice-item {
          background: rgba(248, 250, 252, 0.9);
          border: 1px solid #e2e8f0;
          color: #4c4f69;
        }
        
        .theme-dark .choice-item:hover {
          background: rgba(241, 245, 249, 0.95);
          border-color: #cbd5e1;
        }
        
        .theme-dark .choice-text {
          color: #4c4f69;
        }
        
        /* === React Flow === */
        .theme-dark .react-flow__edge-path {
          stroke: #6e738d !important;
        }
        
        .theme-dark .react-flow__edge:hover .react-flow__edge-path,
        .theme-dark .react-flow__edge.selected .react-flow__edge-path {
          stroke: #8aadf4 !important;
        }
        
        .theme-dark .react-flow__edge markerEnd,
        .theme-dark .react-flow__edge marker {
          fill: #6e738d !important;
        }
        
        .theme-dark .react-flow__edge:hover markerEnd,
        .theme-dark .react-flow__edge:hover marker,
        .theme-dark .react-flow__edge.selected markerEnd,
        .theme-dark .react-flow__edge.selected marker {
          fill: #8aadf4 !important;
        }
        
        /* === 编辑面板 === */
        .theme-dark .edit-panel {
          background: #1e2030;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.55);
        }
        
        .theme-dark .panel-header {
          border-bottom: 1px solid #363a4f;
        }
        
        .theme-dark .panel-header h2 {
          color: #cad3f5;
        }
        
        .theme-dark .close-btn {
          color: #a5adcb;
        }
        
        .theme-dark .close-btn:hover {
          background: rgba(237, 135, 150, 0.18);
          color: #ed8796;
        }
        
        /* === 模态框 === */
        .theme-dark .modal-overlay {
          background: rgba(0, 0, 0, 0.75);
        }
        
        .theme-dark .modal-content {
          background: #1e2030;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        }
        
        .theme-dark .modal-header {
          border-bottom: 1px solid #363a4f;
        }
        
        .theme-dark .modal-header h2 {
          color: #cad3f5;
        }
        
        .theme-dark .modal-close {
          color: #a5adcb;
        }
        
        .theme-dark .modal-close:hover {
          color: #b8c0e0;
        }
        
        .theme-dark .modal-description,
        .theme-dark .description-text {
          color: #b8c0e0;
        }
        
        .theme-dark .modal-hint,
        .theme-dark .form-hint {
          color: #a5adcb;
        }
        
        /* === 节点分析和标签 === */
        .theme-dark .node-count-badge {
          background: #181926;
          color: #b8c0e0;
          border: 1px solid #494d64;
        }
        
        .theme-dark .stat-item {
          background: #181926;
          border: 1px solid #494d64;
        }
        
        .theme-dark .stat-label {
          color: #a5adcb;
        }
        
        .theme-dark .stat-value {
          color: #cad3f5;
        }
        
        .theme-dark .analysis-detail {
          border-top: 1px solid #363a4f;
        }
        
        .theme-dark .analysis-detail h4 {
          color: #cad3f5;
        }
        
        .theme-dark .analysis-hint,
        .theme-dark .layout-hint {
          color: #a5adcb;
        }
        
        .theme-dark .node-search-input {
          background: #181926;
          color: #cad3f5;
          border: 1px solid #494d64;
        }
        
        .theme-dark .node-search-input::placeholder {
          color: #a5adcb;
        }
        
        .theme-dark .search-stats {
          background: #181926;
          color: #b8c0e0;
          border: 1px solid #494d64;
        }
        
        .theme-dark .no-results {
          color: #a5adcb;
        }
        
        .theme-dark .toggle-list-btn {
          background: #181926;
          color: #cad3f5;
          border: 1px solid #494d64;
        }
        
        .theme-dark .toggle-list-btn:hover {
          background: #1e2030;
          border-color: #f5bde6;
        }
        
        .theme-dark .all-nodes-list {
          background: #181926;
          border: 1px solid #494d64;
        }
        
        /* === 节点标签颜色 === */
        .theme-dark .node-tag-decision {
          background: #4a2a2f;
          color: #f0c6c6;
          border-color: #ed8796;
        }
        
        .theme-dark .node-tag-decision:hover {
          background: #5a353a;
          border-color: #ee99a0;
        }
        
        .theme-dark .node-tag-loop {
          background: #2a3549;
          color: #b7bdf8;
          border-color: #8aadf4;
        }
        
        .theme-dark .node-tag-loop:hover {
          background: #354055;
          border-color: #91d7e3;
        }
        
        .theme-dark .node-tag-start {
          background: #2d4034;
          color: #a6da95;
          border-color: #8bd5ca;
        }
        
        .theme-dark .node-tag-start:hover {
          background: #374d3f;
          border-color: #a6da95;
        }
        
        .theme-dark .node-tag-ending {
          background: #4a422b;
          color: #eed49f;
          border-color: #f5a97f;
        }
        
        .theme-dark .node-tag-ending:hover {
          background: #5a4f36;
          border-color: #eed49f;
        }
        
        .theme-dark .node-tag-normal {
          background: #363a4f;
          color: #b8c0e0;
          border-color: #5b6078;
        }
        
        .theme-dark .node-tag-normal:hover {
          background: #494d64;
          border-color: #6e738d;
        }
        
        /* === 验证结果 === */
        .theme-dark .validation-result {
          background: #1e2030;
          border: 1px solid #363a4f;
        }
        
        .theme-dark .validation-result.valid {
          border-color: rgba(166, 218, 149, 0.4);
          background: rgba(166, 218, 149, 0.12);
        }
        
        .theme-dark .validation-result.invalid {
          border-color: rgba(237, 135, 150, 0.4);
          background: rgba(237, 135, 150, 0.12);
        }
        
        .theme-dark .help ul li,
        .theme-dark .help div {
          color: #a5adcb;
        }
        
        .theme-dark .help ul li::before {
          color: #f5bde6;
        }
        
        /* === 滚动条 === */
        .theme-dark ::-webkit-scrollbar-track {
          background: #181926;
        }
        
        .theme-dark ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #494d64 0%, #5b6078 100%);
        }
        
        .theme-dark ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #5b6078 0%, #6e738d 100%);
        }
        
        /* === 插件商店 === */
        .theme-dark .plugin-store-container {
          background: #24273a;
        }
        
        .theme-dark .plugin-store-header h1 {
          background: linear-gradient(135deg, #f5bde6 0%, #c6a0f6 50%, #b7bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .theme-dark .plugin-store-header .subtitle {
          color: #b8c0e0;
        }
        
        .theme-dark .plugin-filter-bar {
          background: #1e2030;
          border: 2px solid #363a4f;
        }
        
        .theme-dark .filter-btn {
          background: #181926;
          color: #cad3f5;
          border: 1px solid #494d64;
        }
        
        .theme-dark .filter-btn.search-input {
          background: #181926;
          color: #cad3f5;
        }
        
        .theme-dark .filter-btn.search-input::placeholder {
          color: #a5adcb;
        }
        
        .theme-dark .filter-btn:hover {
          background: #1e2030;
          border-color: #f5bde6;
        }
        
        .theme-dark .filter-btn.active {
          background: linear-gradient(135deg, #f5bde6 0%, #c6a0f6 100%);
          color: #24273a;
          border-color: transparent;
        }
        
        .theme-dark .filter-divider {
          background: #363a4f;
        }
        
        .theme-dark .plugin-category {
          margin-bottom: 40px;
        }
        
        .theme-dark .category-title {
          color: #cad3f5;
        }
        
        .theme-dark .category-badge {
          background: linear-gradient(135deg, #f5bde6 0%, #c6a0f6 100%);
          color: #24273a;
        }
        
        .theme-dark .plugin-card {
          background: #1e2030;
          border: 2px solid #363a4f;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        
        .theme-dark .plugin-card:hover {
          border-color: #f5bde6;
          box-shadow: 0 8px 24px rgba(245, 189, 230, 0.18);
        }
        
        .theme-dark .plugin-card.enabled {
          border-color: #a6da95;
          background: #1e2030;
        }
        
        .theme-dark .plugin-card.disabled {
          opacity: 0.6;
        }
        
        .theme-dark .plugin-icon {
          background: linear-gradient(135deg, #f5bde6 0%, #c6a0f6 100%);
          color: #24273a;
          box-shadow: 0 2px 4px rgba(245, 189, 230, 0.3);
        }
        
        .theme-dark .theme-icon {
          background: linear-gradient(135deg, #f0c6c6 0%, #f5bde6 100%);
        }
        
        .theme-dark .plugin-name {
          color: #cad3f5;
        }
        
        .theme-dark .plugin-version {
          color: #a5adcb;
        }
        
        .theme-dark .toggle-slider {
          background-color: #5b6078;
        }
        
        .theme-dark .toggle-slider:before {
          background-color: #cad3f5;
        }
        
        .theme-dark .toggle-switch input:checked + .toggle-slider {
          background: linear-gradient(135deg, #f5bde6 0%, #c6a0f6 100%);
        }
        
        .theme-dark .plugin-description {
          color: #b8c0e0;
        }
        
        .theme-dark .plugin-meta {
          color: #a5adcb;
        }
        
        .theme-dark .plugin-author {
          color: #a5adcb;
        }
        
        .theme-dark .plugin-tag {
          background: #181926;
          color: #f5bde6;
          border: 1px solid #494d64;
        }
        
        .theme-dark .plugin-requires {
          background: rgba(238, 212, 159, 0.12);
          border: 1px solid rgba(238, 212, 159, 0.3);
          color: #eed49f;
        }
        
        .theme-dark .theme-notice {
          color: #eed49f;
        }
        
        .theme-dark .empty-state {
          color: #a5adcb;
        }
        
        .theme-dark .btn-icon {
          background: #181926;
          border: 1px solid #494d64;
          color: #b8c0e0;
        }
        
        .theme-dark .btn-icon:hover {
          background: #1e2030;
          border-color: #f5bde6;
        }
        
        .theme-dark .btn-icon.btn-danger {
          background: rgba(237, 135, 150, 0.12);
          border-color: rgba(237, 135, 150, 0.35);
          color: #f0c6c6;
        }
        
        .theme-dark .btn-icon.btn-danger:hover {
          background: rgba(237, 135, 150, 0.22);
          border-color: #ed8796;
        }
        
        .theme-dark .btn-delete-small {
          background: rgba(237, 135, 150, 0.12);
          color: #f0c6c6;
        }
        
        .theme-dark .btn-delete-small:hover {
          background: rgba(237, 135, 150, 0.22);
        }
        
        /* === Landing 页面 === */
        .theme-dark .landing {
          background-color: #24273a;
        }
        
        .theme-dark .qr-container {
          background: #1e2030;
          border: 2px solid #363a4f;
        }
        
        /* === 登录标签页 === */
        .theme-dark .login-tabs {
          border-bottom: 1px solid #363a4f;
        }
        
        .theme-dark .login-tab {
          color: #a5adcb;
        }
        
        .theme-dark .login-tab.active {
          color: #f5bde6;
          border-bottom: 2px solid #f5bde6;
        }
        
        .theme-dark .login-hint {
          color: #b8c0e0;
          background: rgba(245, 189, 230, 0.12);
        }
        
        .theme-dark .login-divider::before,
        .theme-dark .login-divider::after {
          background: #363a4f;
        }
        
        .theme-dark .login-divider span,
        .theme-dark .login-note,
        .theme-dark .guest-note {
          color: #a5adcb;
        }
        
        /* === 自动保存提示 === */
        .theme-dark .auto-save-hint {
          color: #a5adcb;
          background: #181926;
        }

        /* === 移动端适配 === */
        @media (max-width: 768px) {
          .theme-dark .mobile-menu-btn {
            background: #1e2030;
            border: 2px solid #363a4f;
            color: #f5bde6;
          }
          
          .theme-dark .mobile-menu-btn:hover {
            background: #24273a;
            border-color: #f5bde6;
          }
          
          .theme-dark .mobile-close-btn {
            background: #181926;
            border: 1px solid #494d64;
            color: #f5bde6;
          }
          
          .theme-dark .mobile-close-btn:hover {
            background: #1e2030;
          }
        }
      `
    };
  }
}

