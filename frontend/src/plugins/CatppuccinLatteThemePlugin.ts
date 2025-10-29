/**
 * Catppuccin Latte 主题插件
 * 职责：提供Catppuccin的浅色Latte配色方案
 */

import { ThemePlugin, type ThemeDefinition } from './ThemePlugin';
import type { PluginMetadata } from '../../../shared/plugin/types';

export class CatppuccinLatteThemePlugin extends ThemePlugin {
  metadata: PluginMetadata = {
    id: 'theme.catppuccin.latte',
    name: 'Catppuccin Latte',
    version: '1.0.0',
    description: '温暖柔和的浅色主题，适合明亮环境',
    author: 'Catppuccin Community',
    category: 'theme',
    tags: ['浅色', '柔和', 'Catppuccin'],
    conflicts: ['theme.light', 'theme.dark', 'theme.catppuccin.frappe', 'theme.catppuccin.macchiato', 'theme.catppuccin.mocha']
  };

  config = {
    enabled: false,
    settings: {}
  };

  getThemeDefinition(): ThemeDefinition {
    return {
      id: 'catppuccin-latte',
      name: 'Catppuccin Latte',
      description: '温暖柔和的浅色主题',
      isDark: false,
      colors: {
        backgroundPrimary: '#eff1f5',     // base
        backgroundSecondary: '#e6e9ef',   // mantle
        backgroundGradient: 'linear-gradient(180deg, #eff1f5 0%, #e6e9ef 100%)',
        
        textPrimary: '#4c4f69',           // text
        textSecondary: '#5c5f77',         // subtext1
        textMuted: '#6c6f85',             // subtext0
        
        brandPrimary: '#ea76cb',          // pink
        brandSecondary: '#8839ef',        // mauve
        brandGradient: 'linear-gradient(135deg, #ea76cb 0%, #8839ef 100%)',
        
        success: '#40a02b',               // green
        warning: '#df8e1d',               // yellow
        danger: '#d20f39',                // red
        info: '#1e66f5',                  // blue
        
        border: '#acb0be',                // surface2
        borderLight: '#ccd0da',           // surface0
        borderFocus: '#ea76cb',           // pink
        
        hover: 'rgba(234, 118, 203, 0.08)',
        active: 'rgba(234, 118, 203, 0.12)',
        selected: 'rgba(234, 118, 203, 0.15)',
        
        shadow: 'rgba(76, 79, 105, 0.12)',
        shadowLight: 'rgba(76, 79, 105, 0.08)',
        shadowHeavy: 'rgba(76, 79, 105, 0.18)'
      },
      customCSS: `
        /* ===== Catppuccin Latte 主题 ===== */
        .theme-light {
          color-scheme: light;
        }
        
        /* === 全局样式 === */
        .theme-light body {
          background: linear-gradient(180deg, #eff1f5 0%, #e6e9ef 100%);
          color: #4c4f69;
        }
        
        /* === 按钮样式 === */
        .theme-light .btn-primary {
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 100%);
          box-shadow: 0 2px 8px rgba(234, 118, 203, 0.3);
          color: #eff1f5;
        }
        
        .theme-light .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #d764b9 0%, #7829d6 100%);
          box-shadow: 0 4px 12px rgba(234, 118, 203, 0.4);
        }
        
        .theme-light .btn-success {
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 100%);
          color: #eff1f5;
          box-shadow: 0 2px 8px rgba(234, 118, 203, 0.3);
        }
        
        .theme-light .btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #d764b9 0%, #7829d6 100%);
          box-shadow: 0 4px 12px rgba(234, 118, 203, 0.4);
        }
        
        .theme-light .btn-secondary {
          background: #dce0e8;
          color: #4c4f69;
          border: 1px solid #acb0be;
        }
        
        .theme-light .btn-secondary:hover:not(:disabled) {
          background: #ccd0da;
          border-color: #9ca0b0;
        }
        
        .theme-light .btn-danger {
          background: linear-gradient(135deg, #d20f39 0%, #e64553 100%);
          color: #eff1f5;
        }
        
        .theme-light .btn-danger-confirm {
          background: linear-gradient(135deg, #e64553 0%, #dd7878 100%);
          color: white;
          animation: pulse-danger 1s infinite;
        }
        
        /* === 表单组件 === */
        .theme-light .form-group input,
        .theme-light .form-group textarea,
        .theme-light .form-group select {
          background: #eff1f5;
          color: #4c4f69;
          border: 1px solid #acb0be;
        }
        
        .theme-light .form-group input::placeholder,
        .theme-light .form-group textarea::placeholder {
          color: #6c6f85;
        }
        
        .theme-light .form-group input:focus,
        .theme-light .form-group textarea:focus,
        .theme-light .form-group select:focus {
          border-color: #ea76cb;
          box-shadow: 0 0 0 3px rgba(234, 118, 203, 0.15);
          background: #e6e9ef;
        }
        
        .theme-light .form-group label {
          color: #5c5f77;
        }
        
        .theme-light select option {
          background: #eff1f5;
          color: #4c4f69;
        }
        
        .theme-light select option:hover,
        .theme-light select option:checked {
          background: #e6e9ef;
          color: #ea76cb;
        }
        
        /* === 卡片和面板 === */
        .theme-light .section,
        .theme-light .story-card,
        .theme-light .plugin-card,
        .theme-light .description-card,
        .theme-light .login-card {
          background: #e6e9ef;
          border: 2px solid #ccd0da;
          box-shadow: 0 2px 8px rgba(76, 79, 105, 0.1);
        }
        
        .theme-light .section:hover,
        .theme-light .story-card:hover,
        .theme-light .plugin-card:hover {
          border-color: #ea76cb;
          box-shadow: 0 8px 24px rgba(234, 118, 203, 0.15);
        }
        
        /* === Dashboard 页面 === */
        .theme-light .dashboard {
          background: #eff1f5;
        }
        
        .theme-light .dashboard-header h1,
        .theme-light .hero-title,
        .theme-light .hero-title-inline,
        .theme-light .community-title {
          color: #4c4f69 !important;
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        
        .theme-light .subtitle,
        .theme-light .hero-subtitle,
        .theme-light .hero-description {
          color: #5c5f77;
        }
        
        .theme-light .dashboard-user,
        .theme-light .user-name,
        .theme-light .user-email {
          color: #6c6f85;
        }
        
        .theme-light .dashboard-user button:hover {
          color: #ea76cb;
        }
        
        .theme-light .story-card h3 {
          color: #ea76cb;
        }
        
        .theme-light .story-description,
        .theme-light .story-desc,
        .theme-light .story-meta {
          color: #5c5f77;
        }
        
        .theme-light .story-stats {
          color: #6c6f85;
          border-top: 1px solid #ccd0da;
        }
        
        .theme-light .empty-state {
          color: #6c6f85;
        }
        
        /* === 编辑器样式 === */
        .theme-light .editor-container {
          background: #eff1f5;
        }
        
        .theme-light .editor-sidebar {
          background: linear-gradient(180deg, #e6e9ef 0%, #dce0e8 100%);
          border-right: 2px solid #ccd0da;
        }
        
        .theme-light .sidebar-title {
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 50%, #1e66f5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .theme-light .section h3 {
          color: #4c4f69;
        }
        
        .theme-light .btn-back {
          background: #dce0e8;
          border: 1px solid #acb0be;
          color: #5c5f77;
        }
        
        .theme-light .btn-back:hover {
          background: #ccd0da;
          border-color: #ea76cb;
        }
        
        /* === 故事节点 === */
        .theme-light .story-node {
          background: #ffffff;
          border: 2px solid #acb0be;
          color: #4c4f69;
          box-shadow: 0 4px 12px rgba(76, 79, 105, 0.12);
        }
        
        .theme-light .story-node:hover {
          box-shadow: 0 6px 16px rgba(76, 79, 105, 0.18);
          border-color: #1e66f5;
        }
        
        .theme-light .react-flow__node.selected .story-node {
          border-color: #1e66f5;
          box-shadow: 0 0 0 8px rgba(30, 102, 245, 0.15);
        }
        
        .theme-light .node-header {
          border-bottom: 1px solid #e6e9ef;
        }
        
        .theme-light .node-title {
          color: #4c4f69;
        }
        
        .theme-light .node-content {
          color: #5c5f77;
        }
        
        .theme-light .choice-item {
          background: rgba(239, 241, 245, 0.9);
          border: 1px solid #ccd0da;
          color: #4c4f69;
        }
        
        .theme-light .choice-item:hover {
          background: rgba(230, 233, 239, 0.95);
          border-color: #acb0be;
        }
        
        .theme-light .choice-text {
          color: #4c4f69;
        }
        
        /* === React Flow === */
        .theme-light .react-flow__edge-path {
          stroke: #9ca0b0 !important;
        }
        
        .theme-light .react-flow__edge:hover .react-flow__edge-path,
        .theme-light .react-flow__edge.selected .react-flow__edge-path {
          stroke: #1e66f5 !important;
        }
        
        .theme-light .react-flow__edge markerEnd,
        .theme-light .react-flow__edge marker {
          fill: #9ca0b0 !important;
        }
        
        .theme-light .react-flow__edge:hover markerEnd,
        .theme-light .react-flow__edge:hover marker,
        .theme-light .react-flow__edge.selected markerEnd,
        .theme-light .react-flow__edge.selected marker {
          fill: #1e66f5 !important;
        }
        
        /* === 编辑面板 === */
        .theme-light .edit-panel {
          background: #e6e9ef;
          box-shadow: 0 10px 40px rgba(76, 79, 105, 0.15);
        }
        
        .theme-light .panel-header {
          border-bottom: 1px solid #ccd0da;
        }
        
        .theme-light .panel-header h2 {
          color: #4c4f69;
        }
        
        .theme-light .close-btn {
          color: #6c6f85;
        }
        
        .theme-light .close-btn:hover {
          background: rgba(210, 15, 57, 0.15);
          color: #d20f39;
        }
        
        /* === 模态框 === */
        .theme-light .modal-overlay {
          background: rgba(76, 79, 105, 0.5);
        }
        
        .theme-light .modal-content {
          background: #e6e9ef;
          box-shadow: 0 20px 60px rgba(76, 79, 105, 0.2);
        }
        
        .theme-light .modal-header {
          border-bottom: 1px solid #ccd0da;
        }
        
        .theme-light .modal-header h2 {
          color: #4c4f69;
        }
        
        .theme-light .modal-close {
          color: #6c6f85;
        }
        
        .theme-light .modal-close:hover {
          color: #5c5f77;
        }
        
        .theme-light .modal-description,
        .theme-light .description-text {
          color: #5c5f77;
        }
        
        .theme-light .modal-hint,
        .theme-light .form-hint {
          color: #6c6f85;
        }
        
        /* === 节点分析和标签 === */
        .theme-light .node-count-badge {
          background: #dce0e8;
          color: #5c5f77;
          border: 1px solid #acb0be;
        }
        
        .theme-light .stat-item {
          background: #dce0e8;
          border: 1px solid #acb0be;
        }
        
        .theme-light .stat-label {
          color: #6c6f85;
        }
        
        .theme-light .stat-value {
          color: #4c4f69;
        }
        
        .theme-light .analysis-detail {
          border-top: 1px solid #ccd0da;
        }
        
        .theme-light .analysis-detail h4 {
          color: #4c4f69;
        }
        
        .theme-light .analysis-hint,
        .theme-light .layout-hint {
          color: #6c6f85;
        }
        
        .theme-light .node-search-input {
          background: #dce0e8;
          color: #4c4f69;
          border: 1px solid #acb0be;
        }
        
        .theme-light .node-search-input::placeholder {
          color: #6c6f85;
        }
        
        .theme-light .search-stats {
          background: #dce0e8;
          color: #5c5f77;
          border: 1px solid #acb0be;
        }
        
        .theme-light .no-results {
          color: #6c6f85;
        }
        
        .theme-light .toggle-list-btn {
          background: #dce0e8;
          color: #4c4f69;
          border: 1px solid #acb0be;
        }
        
        .theme-light .toggle-list-btn:hover {
          background: #ccd0da;
          border-color: #ea76cb;
        }
        
        .theme-light .all-nodes-list {
          background: #dce0e8;
          border: 1px solid #acb0be;
        }
        
        /* === 节点标签颜色 === */
        .theme-light .node-tag-decision {
          background: #fce9f1;
          color: #d20f39;
          border-color: #dd7878;
        }
        
        .theme-light .node-tag-decision:hover {
          background: #f9d2e2;
          border-color: #d20f39;
        }
        
        .theme-light .node-tag-loop {
          background: #e8effc;
          color: #1e66f5;
          border-color: #7287fd;
        }
        
        .theme-light .node-tag-loop:hover {
          background: #d1dff7;
          border-color: #1e66f5;
        }
        
        .theme-light .node-tag-start {
          background: #e5f3e2;
          color: #40a02b;
          border-color: #40a02b;
        }
        
        .theme-light .node-tag-start:hover {
          background: #cee8c9;
          border-color: #2d7320;
        }
        
        .theme-light .node-tag-ending {
          background: #fef5e7;
          color: #df8e1d;
          border-color: #df8e1d;
        }
        
        .theme-light .node-tag-ending:hover {
          background: #fcecc4;
          border-color: #b37214;
        }
        
        .theme-light .node-tag-normal {
          background: #e6e9ef;
          color: #5c5f77;
          border-color: #acb0be;
        }
        
        .theme-light .node-tag-normal:hover {
          background: #ccd0da;
          border-color: #6c6f85;
        }
        
        /* === 验证结果 === */
        .theme-light .validation-result {
          background: #e6e9ef;
          border: 1px solid #ccd0da;
        }
        
        .theme-light .validation-result.valid {
          border-color: rgba(64, 160, 43, 0.5);
          background: rgba(64, 160, 43, 0.08);
        }
        
        .theme-light .validation-result.invalid {
          border-color: rgba(210, 15, 57, 0.5);
          background: rgba(210, 15, 57, 0.08);
        }
        
        .theme-light .help ul li,
        .theme-light .help div {
          color: #6c6f85;
        }
        
        .theme-light .help ul li::before {
          color: #ea76cb;
        }
        
        /* === 滚动条 === */
        .theme-light ::-webkit-scrollbar-track {
          background: #dce0e8;
        }
        
        .theme-light ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #acb0be 0%, #9ca0b0 100%);
        }
        
        .theme-light ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9ca0b0 0%, #8c8fa1 100%);
        }
        
        /* === 插件商店 === */
        .theme-light .plugin-store-container {
          background: #eff1f5;
        }
        
        .theme-light .plugin-store-header h1 {
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 50%, #1e66f5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .theme-light .plugin-store-header .subtitle {
          color: #5c5f77;
        }
        
        .theme-light .plugin-filter-bar {
          background: #e6e9ef;
          border: 2px solid #ccd0da;
        }
        
        .theme-light .filter-btn {
          background: #dce0e8;
          color: #4c4f69;
          border: 1px solid #acb0be;
        }
        
        .theme-light .filter-btn.search-input {
          background: #dce0e8;
          color: #4c4f69;
        }
        
        .theme-light .filter-btn.search-input::placeholder {
          color: #6c6f85;
        }
        
        .theme-light .filter-btn:hover {
          background: #ccd0da;
          border-color: #ea76cb;
        }
        
        .theme-light .filter-btn.active {
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 100%);
          color: #eff1f5;
          border-color: transparent;
        }
        
        .theme-light .filter-divider {
          background: #ccd0da;
        }
        
        .theme-light .plugin-category {
          margin-bottom: 40px;
        }
        
        .theme-light .category-title {
          color: #4c4f69;
        }
        
        .theme-light .category-badge {
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 100%);
          color: #eff1f5;
        }
        
        .theme-light .plugin-card {
          background: #e6e9ef;
          border: 2px solid #ccd0da;
          box-shadow: 0 2px 8px rgba(76, 79, 105, 0.1);
        }
        
        .theme-light .plugin-card:hover {
          border-color: #ea76cb;
          box-shadow: 0 8px 24px rgba(234, 118, 203, 0.15);
        }
        
        .theme-light .plugin-card.enabled {
          border-color: #40a02b;
          background: #e6e9ef;
        }
        
        .theme-light .plugin-card.disabled {
          opacity: 0.6;
        }
        
        .theme-light .plugin-icon {
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 100%);
          color: #eff1f5;
          box-shadow: 0 2px 4px rgba(234, 118, 203, 0.2);
        }
        
        .theme-light .theme-icon {
          background: linear-gradient(135deg, #f5bde6 0%, #ea76cb 100%);
        }
        
        .theme-light .plugin-name {
          color: #4c4f69;
        }
        
        .theme-light .plugin-version {
          color: #6c6f85;
        }
        
        .theme-light .toggle-slider {
          background-color: #acb0be;
        }
        
        .theme-light .toggle-slider:before {
          background-color: #eff1f5;
        }
        
        .theme-light .toggle-switch input:checked + .toggle-slider {
          background: linear-gradient(135deg, #ea76cb 0%, #8839ef 100%);
        }
        
        .theme-light .plugin-description {
          color: #5c5f77;
        }
        
        .theme-light .plugin-meta {
          color: #6c6f85;
        }
        
        .theme-light .plugin-author {
          color: #6c6f85;
        }
        
        .theme-light .plugin-tag {
          background: #dce0e8;
          color: #ea76cb;
          border: 1px solid #acb0be;
        }
        
        .theme-light .plugin-requires {
          background: rgba(223, 142, 29, 0.1);
          border: 1px solid rgba(223, 142, 29, 0.3);
          color: #df8e1d;
        }
        
        .theme-light .theme-notice {
          color: #df8e1d;
        }
        
        .theme-light .empty-state {
          color: #6c6f85;
        }
        
        .theme-light .btn-icon {
          background: #dce0e8;
          border: 1px solid #acb0be;
          color: #5c5f77;
        }
        
        .theme-light .btn-icon:hover {
          background: #ccd0da;
          border-color: #ea76cb;
        }
        
        .theme-light .btn-icon.btn-danger {
          background: rgba(210, 15, 57, 0.1);
          border-color: rgba(210, 15, 57, 0.3);
          color: #d20f39;
        }
        
        .theme-light .btn-icon.btn-danger:hover {
          background: rgba(210, 15, 57, 0.2);
          border-color: #d20f39;
        }
        
        .theme-light .btn-delete-small {
          background: rgba(210, 15, 57, 0.1);
          color: #d20f39;
        }
        
        .theme-light .btn-delete-small:hover {
          background: rgba(210, 15, 57, 0.2);
        }
        
        /* === Landing 页面 === */
        .theme-light .landing {
          background-color: #eff1f5;
        }
        
        .theme-light .qr-container {
          background: #e6e9ef;
          border: 2px solid #ccd0da;
        }
        
        /* === 登录标签页 === */
        .theme-light .login-tabs {
          border-bottom: 1px solid #ccd0da;
        }
        
        .theme-light .login-tab {
          color: #6c6f85;
        }
        
        .theme-light .login-tab.active {
          color: #ea76cb;
          border-bottom: 2px solid #ea76cb;
        }
        
        .theme-light .login-hint {
          color: #5c5f77;
          background: rgba(234, 118, 203, 0.08);
        }
        
        .theme-light .login-divider::before,
        .theme-light .login-divider::after {
          background: #ccd0da;
        }
        
        .theme-light .login-divider span,
        .theme-light .login-note,
        .theme-light .guest-note {
          color: #6c6f85;
        }
        
        /* === 自动保存提示 === */
        .theme-light .auto-save-hint {
          color: #6c6f85;
          background: #dce0e8;
        }

        /* === 移动端适配 === */
        @media (max-width: 768px) {
          .theme-light .mobile-menu-btn {
            background: #e6e9ef;
            border: 2px solid #ccd0da;
            color: #ea76cb;
          }
          
          .theme-light .mobile-menu-btn:hover {
            background: #dce0e8;
            border-color: #ea76cb;
          }
          
          .theme-light .mobile-close-btn {
            background: #dce0e8;
            border: 1px solid #acb0be;
            color: #ea76cb;
          }
          
          .theme-light .mobile-close-btn:hover {
            background: #ccd0da;
          }
        }
      `
    };
  }
}

