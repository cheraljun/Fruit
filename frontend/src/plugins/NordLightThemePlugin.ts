/**
 * Nord 亮色主题插件
 * 职责：提供Nord的亮色配色方案（Snow Storm背景 + Polar Night文字）
 */

import { ThemePlugin, type ThemeDefinition } from './ThemePlugin';
import type { PluginMetadata } from '../../../shared/plugin/types';

export class NordLightThemePlugin extends ThemePlugin {
  metadata: PluginMetadata = {
    id: 'theme.nord.light',
    name: 'Nord 亮色',
    version: '1.0.0',
    description: '北极雪亮色主题，冷色调清晰设计',
    author: 'Nord Theme',
    category: 'theme',
    tags: ['亮色', '北极', '雪色', 'Nord'],
    conflicts: ['theme.light', 'theme.dark', 'theme.nord', 'theme.catppuccin.latte', 'theme.catppuccin.frappe', 'theme.catppuccin.macchiato', 'theme.catppuccin.mocha']
  };

  config = {
    enabled: false,
    settings: {}
  };

  getThemeDefinition(): ThemeDefinition {
    return {
      id: 'nord-light',
      name: 'Nord 亮色',
      description: '北极雪亮色主题',
      isDark: false,
      colors: {
        backgroundPrimary: '#eceff4',     // nord6 - Snow Storm brightest
        backgroundSecondary: '#e5e9f0',   // nord5 - Snow Storm middle
        backgroundGradient: 'linear-gradient(180deg, #eceff4 0%, #e5e9f0 100%)',
        
        textPrimary: '#2e3440',           // nord0 - Polar Night base
        textSecondary: '#3b4252',         // nord1 - Polar Night lighter
        textMuted: '#4c566a',             // nord3 - Polar Night lightest
        
        brandPrimary: '#5e81ac',          // nord10 - Frost blue
        brandSecondary: '#81a1c1',        // nord9 - Frost
        brandGradient: 'linear-gradient(135deg, #5e81ac 0%, #88c0d0 100%)',
        
        success: '#a3be8c',               // nord14 - Aurora green
        warning: '#ebcb8b',               // nord13 - Aurora yellow
        danger: '#bf616a',                // nord11 - Aurora red
        info: '#5e81ac',                  // nord10 - Frost blue
        
        border: '#d8dee9',                // nord4 - Snow Storm base
        borderLight: '#e5e9f0',           // nord5 - Snow Storm middle
        borderFocus: '#5e81ac',           // nord10 - Frost blue
        
        hover: 'rgba(94, 129, 172, 0.08)',
        active: 'rgba(94, 129, 172, 0.12)',
        selected: 'rgba(94, 129, 172, 0.15)',
        
        shadow: 'rgba(46, 52, 64, 0.1)',
        shadowLight: 'rgba(46, 52, 64, 0.05)',
        shadowHeavy: 'rgba(46, 52, 64, 0.15)'
      },
      customCSS: `
        /* ===== Nord 亮色主题 ===== */
        .theme-light {
          color-scheme: light;
        }
        
        /* === 全局样式 === */
        .theme-light body {
          background: linear-gradient(180deg, #eceff4 0%, #e5e9f0 100%);
          color: #2e3440;
        }
        
        /* === 按钮样式 === */
        .theme-light .btn-primary {
          background: linear-gradient(135deg, #5e81ac 0%, #88c0d0 100%);
          box-shadow: 0 2px 8px rgba(94, 129, 172, 0.25);
          color: #eceff4;
        }
        
        .theme-light .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #81a1c1 0%, #8fbcbb 100%);
          box-shadow: 0 4px 12px rgba(94, 129, 172, 0.35);
        }
        
        .theme-light .btn-success {
          background: linear-gradient(135deg, #5e81ac 0%, #88c0d0 100%);
          color: #eceff4;
          box-shadow: 0 2px 8px rgba(94, 129, 172, 0.25);
        }
        
        .theme-light .btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #81a1c1 0%, #8fbcbb 100%);
          box-shadow: 0 4px 12px rgba(94, 129, 172, 0.35);
        }
        
        .theme-light .btn-secondary {
          background: #e5e9f0;
          color: #2e3440;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .btn-secondary:hover:not(:disabled) {
          background: #d8dee9;
          border-color: #4c566a;
        }
        
        .theme-light .btn-danger {
          background: linear-gradient(135deg, #bf616a 0%, #d08770 100%);
          color: #eceff4;
        }
        
        .theme-light .btn-danger-confirm {
          background: linear-gradient(135deg, #d08770 0%, #bf616a 100%);
          color: #eceff4;
          animation: pulse-danger 1s infinite;
        }
        
        /* === 表单组件 === */
        .theme-light .form-group input,
        .theme-light .form-group textarea,
        .theme-light .form-group select {
          background: #eceff4;
          color: #2e3440;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .form-group input::placeholder,
        .theme-light .form-group textarea::placeholder {
          color: #4c566a;
        }
        
        .theme-light .form-group input:focus,
        .theme-light .form-group textarea:focus,
        .theme-light .form-group select:focus {
          border-color: #5e81ac;
          box-shadow: 0 0 0 3px rgba(94, 129, 172, 0.12);
          background: #e5e9f0;
        }
        
        .theme-light .form-group label {
          color: #3b4252;
        }
        
        .theme-light select option {
          background: #eceff4;
          color: #2e3440;
        }
        
        .theme-light select option:hover,
        .theme-light select option:checked {
          background: #e5e9f0;
          color: #5e81ac;
        }
        
        /* === 卡片和面板 === */
        .theme-light .section,
        .theme-light .story-card,
        .theme-light .plugin-card,
        .theme-light .description-card,
        .theme-light .login-card {
          background: #e5e9f0;
          border: 2px solid #d8dee9;
          box-shadow: 0 2px 8px rgba(46, 52, 64, 0.08);
        }
        
        .theme-light .section:hover,
        .theme-light .story-card:hover,
        .theme-light .plugin-card:hover {
          border-color: #5e81ac;
          box-shadow: 0 8px 24px rgba(94, 129, 172, 0.12);
        }
        
        /* === Dashboard 页面 === */
        .theme-light .dashboard {
          background: #eceff4;
        }
        
        .theme-light .dashboard-header h1,
        .theme-light .hero-title,
        .theme-light .hero-title-inline,
        .theme-light .community-title {
          color: #2e3440 !important;
          background: linear-gradient(135deg, #5e81ac 0%, #88c0d0 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        
        .theme-light .subtitle,
        .theme-light .hero-subtitle,
        .theme-light .hero-description {
          color: #3b4252;
        }
        
        .theme-light .dashboard-user,
        .theme-light .user-name,
        .theme-light .user-email {
          color: #4c566a;
        }
        
        .theme-light .dashboard-user button:hover {
          color: #5e81ac;
        }
        
        .theme-light .story-card h3 {
          color: #5e81ac;
        }
        
        .theme-light .story-description,
        .theme-light .story-desc,
        .theme-light .story-meta {
          color: #3b4252;
        }
        
        .theme-light .story-stats {
          color: #4c566a;
          border-top: 1px solid #d8dee9;
        }
        
        .theme-light .empty-state {
          color: #4c566a;
        }
        
        /* === 编辑器样式 === */
        .theme-light .editor-container {
          background: #eceff4;
        }
        
        .theme-light .editor-sidebar {
          background: linear-gradient(180deg, #e5e9f0 0%, #d8dee9 100%);
          border-right: 2px solid #d8dee9;
        }
        
        .theme-light .sidebar-title {
          background: linear-gradient(135deg, #5e81ac 0%, #81a1c1 50%, #88c0d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .theme-light .section h3 {
          color: #2e3440;
        }
        
        .theme-light .btn-back {
          background: #e5e9f0;
          border: 1px solid #d8dee9;
          color: #3b4252;
        }
        
        .theme-light .btn-back:hover {
          background: #d8dee9;
          border-color: #5e81ac;
        }
        
        /* === 故事节点 === */
        .theme-light .story-node {
          background: #ffffff;
          border: 2px solid #d8dee9;
          color: #2e3440;
          box-shadow: 0 4px 12px rgba(46, 52, 64, 0.1);
        }
        
        .theme-light .story-node:hover {
          box-shadow: 0 6px 16px rgba(46, 52, 64, 0.15);
          border-color: #5e81ac;
        }
        
        .theme-light .react-flow__node.selected .story-node {
          border-color: #5e81ac;
          box-shadow: 0 0 0 8px rgba(94, 129, 172, 0.12);
        }
        
        .theme-light .node-header {
          border-bottom: 1px solid #e5e9f0;
        }
        
        .theme-light .node-title {
          color: #2e3440;
        }
        
        .theme-light .node-content {
          color: #3b4252;
        }
        
        .theme-light .choice-item {
          background: rgba(236, 239, 244, 0.9);
          border: 1px solid #d8dee9;
          color: #2e3440;
        }
        
        .theme-light .choice-item:hover {
          background: rgba(229, 233, 240, 0.95);
          border-color: #4c566a;
        }
        
        .theme-light .choice-text {
          color: #2e3440;
        }
        
        /* === React Flow === */
        .theme-light .react-flow__edge-path {
          stroke: #4c566a !important;
        }
        
        .theme-light .react-flow__edge:hover .react-flow__edge-path,
        .theme-light .react-flow__edge.selected .react-flow__edge-path {
          stroke: #5e81ac !important;
        }
        
        .theme-light .react-flow__edge markerEnd,
        .theme-light .react-flow__edge marker {
          fill: #4c566a !important;
        }
        
        .theme-light .react-flow__edge:hover markerEnd,
        .theme-light .react-flow__edge:hover marker,
        .theme-light .react-flow__edge.selected markerEnd,
        .theme-light .react-flow__edge.selected marker {
          fill: #5e81ac !important;
        }
        
        /* === 编辑面板 === */
        .theme-light .edit-panel {
          background: #e5e9f0;
          box-shadow: 0 10px 40px rgba(46, 52, 64, 0.12);
        }
        
        .theme-light .panel-header {
          border-bottom: 1px solid #d8dee9;
        }
        
        .theme-light .panel-header h2 {
          color: #2e3440;
        }
        
        .theme-light .close-btn {
          color: #4c566a;
        }
        
        .theme-light .close-btn:hover {
          background: rgba(191, 97, 106, 0.12);
          color: #bf616a;
        }
        
        /* === 模态框 === */
        .theme-light .modal-overlay {
          background: rgba(46, 52, 64, 0.4);
        }
        
        .theme-light .modal-content {
          background: #e5e9f0;
          box-shadow: 0 20 60px rgba(46, 52, 64, 0.15);
        }
        
        .theme-light .modal-header {
          border-bottom: 1px solid #d8dee9;
        }
        
        .theme-light .modal-header h2 {
          color: #2e3440;
        }
        
        .theme-light .modal-close {
          color: #4c566a;
        }
        
        .theme-light .modal-close:hover {
          color: #3b4252;
        }
        
        .theme-light .modal-description,
        .theme-light .description-text {
          color: #3b4252;
        }
        
        .theme-light .modal-hint,
        .theme-light .form-hint {
          color: #4c566a;
        }
        
        /* === 节点分析和标签 === */
        .theme-light .node-count-badge {
          background: #e5e9f0;
          color: #3b4252;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .stat-item {
          background: #e5e9f0;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .stat-label {
          color: #4c566a;
        }
        
        .theme-light .stat-value {
          color: #2e3440;
        }
        
        .theme-light .analysis-detail {
          border-top: 1px solid #d8dee9;
        }
        
        .theme-light .analysis-detail h4 {
          color: #2e3440;
        }
        
        .theme-light .analysis-hint,
        .theme-light .layout-hint {
          color: #4c566a;
        }
        
        .theme-light .node-search-input {
          background: #e5e9f0;
          color: #2e3440;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .node-search-input::placeholder {
          color: #4c566a;
        }
        
        .theme-light .search-stats {
          background: #e5e9f0;
          color: #3b4252;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .no-results {
          color: #4c566a;
        }
        
        .theme-light .toggle-list-btn {
          background: #e5e9f0;
          color: #2e3440;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .toggle-list-btn:hover {
          background: #d8dee9;
          border-color: #5e81ac;
        }
        
        .theme-light .all-nodes-list {
          background: #e5e9f0;
          border: 1px solid #d8dee9;
        }
        
        /* === 节点标签颜色 === */
        .theme-light .node-tag-decision {
          background: #f4e4e6;
          color: #bf616a;
          border-color: #d08770;
        }
        
        .theme-light .node-tag-decision:hover {
          background: #ead2d5;
          border-color: #bf616a;
        }
        
        .theme-light .node-tag-loop {
          background: #e3eaf2;
          color: #5e81ac;
          border-color: #81a1c1;
        }
        
        .theme-light .node-tag-loop:hover {
          background: #d0dde9;
          border-color: #5e81ac;
        }
        
        .theme-light .node-tag-start {
          background: #e6f0e3;
          color: #a3be8c;
          border-color: #8fbcbb;
        }
        
        .theme-light .node-tag-start:hover {
          background: #d4e5cf;
          border-color: #a3be8c;
        }
        
        .theme-light .node-tag-ending {
          background: #f7f2e3;
          color: #d08770;
          border-color: #ebcb8b;
        }
        
        .theme-light .node-tag-ending:hover {
          background: #f0e8d0;
          border-color: #d08770;
        }
        
        .theme-light .node-tag-normal {
          background: #e5e9f0;
          color: #3b4252;
          border-color: #d8dee9;
        }
        
        .theme-light .node-tag-normal:hover {
          background: #d8dee9;
          border-color: #4c566a;
        }
        
        /* === 验证结果 === */
        .theme-light .validation-result {
          background: #e5e9f0;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .validation-result.valid {
          border-color: rgba(163, 190, 140, 0.4);
          background: rgba(163, 190, 140, 0.08);
        }
        
        .theme-light .validation-result.invalid {
          border-color: rgba(191, 97, 106, 0.4);
          background: rgba(191, 97, 106, 0.08);
        }
        
        .theme-light .help ul li,
        .theme-light .help div {
          color: #4c566a;
        }
        
        .theme-light .help ul li::before {
          color: #5e81ac;
        }
        
        /* === 滚动条 === */
        .theme-light ::-webkit-scrollbar-track {
          background: #e5e9f0;
        }
        
        .theme-light ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d8dee9 0%, #4c566a 100%);
        }
        
        .theme-light ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4c566a 0%, #434c5e 100%);
        }
        
        /* === 插件商店 === */
        .theme-light .plugin-store-container {
          background: #eceff4;
        }
        
        .theme-light .plugin-store-header h1 {
          background: linear-gradient(135deg, #5e81ac 0%, #81a1c1 50%, #88c0d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .theme-light .plugin-store-header .subtitle {
          color: #3b4252;
        }
        
        .theme-light .plugin-filter-bar {
          background: #e5e9f0;
          border: 2px solid #d8dee9;
        }
        
        .theme-light .filter-btn {
          background: #eceff4;
          color: #2e3440;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .filter-btn.search-input {
          background: #eceff4;
          color: #2e3440;
        }
        
        .theme-light .filter-btn.search-input::placeholder {
          color: #4c566a;
        }
        
        .theme-light .filter-btn:hover {
          background: #e5e9f0;
          border-color: #5e81ac;
        }
        
        .theme-light .filter-btn.active {
          background: linear-gradient(135deg, #5e81ac 0%, #88c0d0 100%);
          color: #eceff4;
          border-color: transparent;
        }
        
        .theme-light .filter-divider {
          background: #d8dee9;
        }
        
        .theme-light .plugin-category {
          margin-bottom: 40px;
        }
        
        .theme-light .category-title {
          color: #2e3440;
        }
        
        .theme-light .category-badge {
          background: linear-gradient(135deg, #5e81ac 0%, #88c0d0 100%);
          color: #eceff4;
        }
        
        .theme-light .plugin-card {
          background: #e5e9f0;
          border: 2px solid #d8dee9;
          box-shadow: 0 2px 8px rgba(46, 52, 64, 0.08);
        }
        
        .theme-light .plugin-card:hover {
          border-color: #5e81ac;
          box-shadow: 0 8px 24px rgba(94, 129, 172, 0.12);
        }
        
        .theme-light .plugin-card.enabled {
          border-color: #a3be8c;
          background: #e5e9f0;
        }
        
        .theme-light .plugin-card.disabled {
          opacity: 0.6;
        }
        
        .theme-light .plugin-icon {
          background: linear-gradient(135deg, #5e81ac 0%, #88c0d0 100%);
          color: #eceff4;
          box-shadow: 0 2px 4px rgba(94, 129, 172, 0.2);
        }
        
        .theme-light .theme-icon {
          background: linear-gradient(135deg, #81a1c1 0%, #8fbcbb 100%);
        }
        
        .theme-light .plugin-name {
          color: #2e3440;
        }
        
        .theme-light .plugin-version {
          color: #4c566a;
        }
        
        .theme-light .toggle-slider {
          background-color: #d8dee9;
        }
        
        .theme-light .toggle-slider:before {
          background-color: #eceff4;
        }
        
        .theme-light .toggle-switch input:checked + .toggle-slider {
          background: linear-gradient(135deg, #5e81ac 0%, #88c0d0 100%);
        }
        
        .theme-light .plugin-description {
          color: #3b4252;
        }
        
        .theme-light .plugin-meta {
          color: #4c566a;
        }
        
        .theme-light .plugin-author {
          color: #4c566a;
        }
        
        .theme-light .plugin-tag {
          background: #eceff4;
          color: #5e81ac;
          border: 1px solid #d8dee9;
        }
        
        .theme-light .plugin-requires {
          background: rgba(235, 203, 139, 0.15);
          border: 1px solid rgba(235, 203, 139, 0.4);
          color: #d08770;
        }
        
        .theme-light .theme-notice {
          color: #d08770;
        }
        
        .theme-light .empty-state {
          color: #4c566a;
        }
        
        .theme-light .btn-icon {
          background: #eceff4;
          border: 1px solid #d8dee9;
          color: #3b4252;
        }
        
        .theme-light .btn-icon:hover {
          background: #e5e9f0;
          border-color: #5e81ac;
        }
        
        .theme-light .btn-icon.btn-danger {
          background: rgba(191, 97, 106, 0.08);
          border-color: rgba(191, 97, 106, 0.25);
          color: #bf616a;
        }
        
        .theme-light .btn-icon.btn-danger:hover {
          background: rgba(191, 97, 106, 0.15);
          border-color: #bf616a;
        }
        
        .theme-light .btn-delete-small {
          background: rgba(191, 97, 106, 0.08);
          color: #bf616a;
        }
        
        .theme-light .btn-delete-small:hover {
          background: rgba(191, 97, 106, 0.15);
        }
        
        /* === Landing 页面 === */
        .theme-light .landing {
          background-color: #eceff4;
        }
        
        .theme-light .qr-container {
          background: #e5e9f0;
          border: 2px solid #d8dee9;
        }
        
        /* === 登录标签页 === */
        .theme-light .login-tabs {
          border-bottom: 1px solid #d8dee9;
        }
        
        .theme-light .login-tab {
          color: #4c566a;
        }
        
        .theme-light .login-tab.active {
          color: #5e81ac;
          border-bottom: 2px solid #5e81ac;
        }
        
        .theme-light .login-hint {
          color: #3b4252;
          background: rgba(94, 129, 172, 0.08);
        }
        
        .theme-light .login-divider::before,
        .theme-light .login-divider::after {
          background: #d8dee9;
        }
        
        .theme-light .login-divider span,
        .theme-light .login-note,
        .theme-light .guest-note {
          color: #4c566a;
        }
        
        /* === 自动保存提示 === */
        .theme-light .auto-save-hint {
          color: #4c566a;
          background: #e5e9f0;
        }

        /* === 移动端适配 === */
        @media (max-width: 768px) {
          .theme-light .mobile-menu-btn {
            background: #e5e9f0;
            border: 2px solid #d8dee9;
            color: #5e81ac;
          }
          
          .theme-light .mobile-menu-btn:hover {
            background: #d8dee9;
            border-color: #5e81ac;
          }
          
          .theme-light .mobile-close-btn {
            background: #eceff4;
            border: 1px solid #d8dee9;
            color: #5e81ac;
          }
          
          .theme-light .mobile-close-btn:hover {
            background: #e5e9f0;
          }
        }
      `
    };
  }
}

