/**
 * Nord 暗色主题插件
 * 职责：提供Nord的暗色配色方案（Polar Night背景 + Snow Storm文字）
 */

import { ThemePlugin, type ThemeDefinition } from './ThemePlugin';
import type { PluginMetadata } from '../../../shared/plugin/types';

export class NordDarkThemePlugin extends ThemePlugin {
  metadata: PluginMetadata = {
    id: 'theme.nord',
    name: 'Nord 暗色',
    version: '1.0.0',
    description: '北极蓝暗色主题，冷色调护眼设计',
    author: 'Nord Theme',
    category: 'theme',
    tags: ['暗色', '北极', '蓝色调', 'Nord'],
    conflicts: ['theme.light', 'theme.dark', 'theme.nord.light', 'theme.catppuccin.latte', 'theme.catppuccin.frappe', 'theme.catppuccin.macchiato', 'theme.catppuccin.mocha']
  };

  config = {
    enabled: false,
    settings: {}
  };

  getThemeDefinition(): ThemeDefinition {
    return {
      id: 'nord',
      name: 'Nord 暗色',
      description: '北极蓝暗色主题',
      isDark: true,
      colors: {
        backgroundPrimary: '#2e3440',     // nord0 - Polar Night base
        backgroundSecondary: '#3b4252',   // nord1 - Polar Night lighter
        backgroundGradient: 'linear-gradient(180deg, #2e3440 0%, #3b4252 100%)',
        
        textPrimary: '#eceff4',           // nord6 - Snow Storm brightest
        textSecondary: '#e5e9f0',         // nord5 - Snow Storm middle
        textMuted: '#d8dee9',             // nord4 - Snow Storm base
        
        brandPrimary: '#88c0d0',          // nord8 - Frost accent
        brandSecondary: '#81a1c1',        // nord9 - Frost
        brandGradient: 'linear-gradient(135deg, #88c0d0 0%, #5e81ac 100%)',
        
        success: '#a3be8c',               // nord14 - Aurora green
        warning: '#ebcb8b',               // nord13 - Aurora yellow
        danger: '#bf616a',                // nord11 - Aurora red
        info: '#5e81ac',                  // nord10 - Frost blue
        
        border: '#4c566a',                // nord3 - Polar Night lightest
        borderLight: '#434c5e',           // nord2 - Polar Night
        borderFocus: '#88c0d0',           // nord8 - Frost accent
        
        hover: 'rgba(136, 192, 208, 0.12)',
        active: 'rgba(136, 192, 208, 0.18)',
        selected: 'rgba(136, 192, 208, 0.22)',
        
        shadow: 'rgba(0, 0, 0, 0.3)',
        shadowLight: 'rgba(0, 0, 0, 0.15)',
        shadowHeavy: 'rgba(0, 0, 0, 0.45)'
      },
      customCSS: `
        /* ===== Nord 暗色主题 ===== */
        .theme-dark {
          color-scheme: dark;
        }
        
        /* === 全局样式 === */
        .theme-dark body {
          background: linear-gradient(180deg, #2e3440 0%, #3b4252 100%);
          color: #eceff4;
        }
        
        /* === 按钮样式 === */
        .theme-dark .btn-primary {
          background: linear-gradient(135deg, #88c0d0 0%, #5e81ac 100%);
          box-shadow: 0 2px 8px rgba(136, 192, 208, 0.3);
          color: #2e3440;
        }
        
        .theme-dark .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #8fbcbb 0%, #81a1c1 100%);
          box-shadow: 0 4px 12px rgba(136, 192, 208, 0.45);
        }
        
        .theme-dark .btn-success {
          background: linear-gradient(135deg, #88c0d0 0%, #5e81ac 100%);
          color: #2e3440;
          box-shadow: 0 2px 8px rgba(136, 192, 208, 0.3);
        }
        
        .theme-dark .btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #8fbcbb 0%, #81a1c1 100%);
          box-shadow: 0 4px 12px rgba(136, 192, 208, 0.45);
        }
        
        .theme-dark .btn-secondary {
          background: #3b4252;
          color: #e5e9f0;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .btn-secondary:hover:not(:disabled) {
          background: #434c5e;
          border-color: #4c566a;
        }
        
        .theme-dark .btn-danger {
          background: linear-gradient(135deg, #bf616a 0%, #d08770 100%);
          color: #eceff4;
        }
        
        .theme-dark .btn-danger-confirm {
          background: linear-gradient(135deg, #d08770 0%, #bf616a 100%);
          color: #eceff4;
          animation: pulse-danger 1s infinite;
        }
        
        /* === 表单组件 === */
        .theme-dark .form-group input,
        .theme-dark .form-group textarea,
        .theme-dark .form-group select {
          background: #3b4252;
          color: #eceff4;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .form-group input::placeholder,
        .theme-dark .form-group textarea::placeholder {
          color: #d8dee9;
        }
        
        .theme-dark .form-group input:focus,
        .theme-dark .form-group textarea:focus,
        .theme-dark .form-group select:focus {
          border-color: #88c0d0;
          box-shadow: 0 0 0 3px rgba(136, 192, 208, 0.15);
          background: #434c5e;
        }
        
        .theme-dark .form-group label {
          color: #e5e9f0;
        }
        
        .theme-dark select option {
          background: #3b4252;
          color: #eceff4;
        }
        
        .theme-dark select option:hover,
        .theme-dark select option:checked {
          background: #434c5e;
          color: #88c0d0;
        }
        
        /* === 卡片和面板 === */
        .theme-dark .section,
        .theme-dark .story-card,
        .theme-dark .plugin-card,
        .theme-dark .description-card,
        .theme-dark .login-card {
          background: #3b4252;
          border: 2px solid #4c566a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          color: #eceff4;
        }
        
        .theme-dark .section:hover,
        .theme-dark .story-card:hover,
        .theme-dark .plugin-card:hover {
          border-color: #88c0d0;
          box-shadow: 0 8px 24px rgba(136, 192, 208, 0.15);
        }
        
        /* === Dashboard 页面 === */
        .theme-dark .dashboard {
          background: #2e3440;
        }
        
        .theme-dark .dashboard-header h1,
        .theme-dark .hero-title,
        .theme-dark .hero-title-inline,
        .theme-dark .community-title {
          color: #eceff4 !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: #eceff4 !important;
          background-clip: unset !important;
        }
        
        .theme-dark .subtitle,
        .theme-dark .hero-subtitle,
        .theme-dark .hero-description {
          color: #e5e9f0;
        }
        
        .theme-dark .dashboard-user,
        .theme-dark .user-name,
        .theme-dark .user-email {
          color: #d8dee9;
        }
        
        .theme-dark .dashboard-user button:hover {
          color: #88c0d0;
        }
        
        .theme-dark .story-card h3 {
          color: #88c0d0;
        }
        
        .theme-dark .story-description,
        .theme-dark .story-desc,
        .theme-dark .story-meta {
          color: #e5e9f0;
        }
        
        .theme-dark .story-stats {
          color: #d8dee9;
          border-top: 1px solid #4c566a;
        }
        
        .theme-dark .empty-state {
          color: #d8dee9;
        }
        
        /* === 编辑器样式 === */
        .theme-dark .editor-container {
          background: #2e3440;
        }
        
        .theme-dark .editor-sidebar {
          background: linear-gradient(180deg, #3b4252 0%, #2e3440 100%);
          border-right: 2px solid #4c566a;
        }
        
        .theme-dark .sidebar-title {
          background: linear-gradient(135deg, #88c0d0 0%, #81a1c1 50%, #5e81ac 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .theme-dark .section h3 {
          color: #eceff4;
        }
        
        .theme-dark .btn-back {
          background: #3b4252;
          border: 1px solid #4c566a;
          color: #e5e9f0;
        }
        
        .theme-dark .btn-back:hover {
          background: #434c5e;
          border-color: #88c0d0;
        }
        
        /* === 故事节点 === */
        .theme-dark .story-node {
          background: #ffffff;
          border: 2px solid #4c566a;
          color: #2e3440;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
        }
        
        .theme-dark .story-node:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
          border-color: #5e81ac;
        }
        
        .theme-dark .react-flow__node.selected .story-node {
          border-color: #5e81ac;
          box-shadow: 0 0 0 8px rgba(94, 129, 172, 0.2);
        }
        
        .theme-dark .node-header {
          border-bottom: 1px solid #e5e9f0;
        }
        
        .theme-dark .node-title {
          color: #2e3440;
        }
        
        .theme-dark .node-content {
          color: #3b4252;
        }
        
        .theme-dark .choice-item {
          background: rgba(236, 239, 244, 0.9);
          border: 1px solid #d8dee9;
          color: #2e3440;
        }
        
        .theme-dark .choice-item:hover {
          background: rgba(229, 233, 240, 0.95);
          border-color: #4c566a;
        }
        
        .theme-dark .choice-text {
          color: #2e3440;
        }
        
        /* === React Flow === */
        .theme-dark .react-flow__edge-path {
          stroke: #4c566a !important;
        }
        
        .theme-dark .react-flow__edge:hover .react-flow__edge-path,
        .theme-dark .react-flow__edge.selected .react-flow__edge-path {
          stroke: #5e81ac !important;
        }
        
        .theme-dark .react-flow__edge markerEnd,
        .theme-dark .react-flow__edge marker {
          fill: #4c566a !important;
        }
        
        .theme-dark .react-flow__edge:hover markerEnd,
        .theme-dark .react-flow__edge:hover marker,
        .theme-dark .react-flow__edge.selected markerEnd,
        .theme-dark .react-flow__edge.selected marker {
          fill: #5e81ac !important;
        }
        
        /* === 编辑面板 === */
        .theme-dark .edit-panel {
          background: #3b4252;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
        }
        
        .theme-dark .panel-header {
          border-bottom: 1px solid #4c566a;
        }
        
        .theme-dark .panel-header h2 {
          color: #eceff4;
        }
        
        .theme-dark .close-btn {
          color: #d8dee9;
        }
        
        .theme-dark .close-btn:hover {
          background: rgba(191, 97, 106, 0.15);
          color: #bf616a;
        }
        
        /* === 模态框 === */
        .theme-dark .modal-overlay {
          background: rgba(46, 52, 64, 0.75);
        }
        
        .theme-dark .modal-content {
          background: #3b4252;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        }
        
        .theme-dark .modal-header {
          border-bottom: 1px solid #4c566a;
        }
        
        .theme-dark .modal-header h2 {
          color: #eceff4;
        }
        
        .theme-dark .modal-close {
          color: #d8dee9;
        }
        
        .theme-dark .modal-close:hover {
          color: #e5e9f0;
        }
        
        .theme-dark .modal-description,
        .theme-dark .description-text {
          color: #e5e9f0;
        }
        
        .theme-dark .modal-hint,
        .theme-dark .form-hint {
          color: #d8dee9;
        }
        
        /* === 节点分析和标签 === */
        .theme-dark .node-count-badge {
          background: #3b4252;
          color: #e5e9f0;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .stat-item {
          background: #3b4252;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .stat-label {
          color: #d8dee9;
        }
        
        .theme-dark .stat-value {
          color: #eceff4;
        }
        
        .theme-dark .analysis-detail {
          border-top: 1px solid #4c566a;
        }
        
        .theme-dark .analysis-detail h4 {
          color: #eceff4;
        }
        
        .theme-dark .analysis-hint,
        .theme-dark .layout-hint {
          color: #d8dee9;
        }
        
        .theme-dark .node-search-input {
          background: #3b4252;
          color: #eceff4;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .node-search-input::placeholder {
          color: #d8dee9;
        }
        
        .theme-dark .search-stats {
          background: #3b4252;
          color: #e5e9f0;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .no-results {
          color: #d8dee9;
        }
        
        .theme-dark .toggle-list-btn {
          background: #3b4252;
          color: #eceff4;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .toggle-list-btn:hover {
          background: #434c5e;
          border-color: #88c0d0;
        }
        
        .theme-dark .all-nodes-list {
          background: #3b4252;
          border: 1px solid #4c566a;
        }
        
        /* === 节点标签颜色 === */
        .theme-dark .node-tag-decision {
          background: #51202a;
          color: #bf616a;
          border-color: #bf616a;
        }
        
        .theme-dark .node-tag-decision:hover {
          background: #5c2530;
          border-color: #d08770;
        }
        
        .theme-dark .node-tag-loop {
          background: #1e2d3d;
          color: #81a1c1;
          border-color: #5e81ac;
        }
        
        .theme-dark .node-tag-loop:hover {
          background: #25334a;
          border-color: #88c0d0;
        }
        
        .theme-dark .node-tag-start {
          background: #2d3a2f;
          color: #a3be8c;
          border-color: #8fbcbb;
        }
        
        .theme-dark .node-tag-start:hover {
          background: #354238;
          border-color: #a3be8c;
        }
        
        .theme-dark .node-tag-ending {
          background: #4a3f2a;
          color: #ebcb8b;
          border-color: #d08770;
        }
        
        .theme-dark .node-tag-ending:hover {
          background: #564a32;
          border-color: #ebcb8b;
        }
        
        .theme-dark .node-tag-normal {
          background: #4c566a;
          color: #e5e9f0;
          border-color: #d8dee9;
        }
        
        .theme-dark .node-tag-normal:hover {
          background: #434c5e;
          border-color: #eceff4;
        }
        
        /* === 验证结果 === */
        .theme-dark .validation-result {
          background: #3b4252;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .validation-result.valid {
          border-color: rgba(163, 190, 140, 0.4);
          background: rgba(163, 190, 140, 0.1);
        }
        
        .theme-dark .validation-result.invalid {
          border-color: rgba(191, 97, 106, 0.4);
          background: rgba(191, 97, 106, 0.1);
        }
        
        .theme-dark .help ul li,
        .theme-dark .help div {
          color: #d8dee9;
        }
        
        .theme-dark .help ul li::before {
          color: #88c0d0;
        }
        
        /* === 滚动条 === */
        .theme-dark ::-webkit-scrollbar-track {
          background: #2e3440;
        }
        
        .theme-dark ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #4c566a 0%, #434c5e 100%);
        }
        
        .theme-dark ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #434c5e 0%, #4c566a 100%);
        }
        
        /* === 插件商店 === */
        .theme-dark .plugin-store-container {
          background: #2e3440;
        }
        
        .theme-dark .plugin-store-header h1 {
          background: linear-gradient(135deg, #88c0d0 0%, #81a1c1 50%, #5e81ac 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .theme-dark .plugin-store-header .subtitle {
          color: #e5e9f0;
        }
        
        .theme-dark .plugin-filter-bar {
          background: #3b4252;
          border: 2px solid #4c566a;
        }
        
        .theme-dark .filter-btn {
          background: #2e3440;
          color: #eceff4;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .filter-btn.search-input {
          background: #2e3440;
          color: #eceff4;
        }
        
        .theme-dark .filter-btn.search-input::placeholder {
          color: #d8dee9;
        }
        
        .theme-dark .filter-btn:hover {
          background: #3b4252;
          border-color: #88c0d0;
        }
        
        .theme-dark .filter-btn.active {
          background: linear-gradient(135deg, #88c0d0 0%, #5e81ac 100%);
          color: #2e3440;
          border-color: transparent;
        }
        
        .theme-dark .filter-divider {
          background: #4c566a;
        }
        
        .theme-dark .plugin-category {
          margin-bottom: 40px;
        }
        
        .theme-dark .category-title {
          color: #eceff4;
        }
        
        .theme-dark .category-badge {
          background: linear-gradient(135deg, #88c0d0 0%, #5e81ac 100%);
          color: #2e3440;
        }
        
        .theme-dark .plugin-card {
          background: #3b4252;
          border: 2px solid #4c566a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .theme-dark .plugin-card:hover {
          border-color: #88c0d0;
          box-shadow: 0 8px 24px rgba(136, 192, 208, 0.15);
        }
        
        .theme-dark .plugin-card.enabled {
          border-color: #a3be8c;
          background: #3b4252;
        }
        
        .theme-dark .plugin-card.disabled {
          opacity: 0.6;
        }
        
        .theme-dark .plugin-icon {
          background: linear-gradient(135deg, #88c0d0 0%, #5e81ac 100%);
          color: #2e3440;
          box-shadow: 0 2px 4px rgba(136, 192, 208, 0.25);
        }
        
        .theme-dark .theme-icon {
          background: linear-gradient(135deg, #8fbcbb 0%, #88c0d0 100%);
        }
        
        .theme-dark .plugin-name {
          color: #eceff4;
        }
        
        .theme-dark .plugin-version {
          color: #d8dee9;
        }
        
        .theme-dark .toggle-slider {
          background-color: #4c566a;
        }
        
        .theme-dark .toggle-slider:before {
          background-color: #eceff4;
        }
        
        .theme-dark .toggle-switch input:checked + .toggle-slider {
          background: linear-gradient(135deg, #88c0d0 0%, #5e81ac 100%);
        }
        
        .theme-dark .plugin-description {
          color: #e5e9f0;
        }
        
        .theme-dark .plugin-meta {
          color: #d8dee9;
        }
        
        .theme-dark .plugin-author {
          color: #d8dee9;
        }
        
        .theme-dark .plugin-tag {
          background: #2e3440;
          color: #88c0d0;
          border: 1px solid #4c566a;
        }
        
        .theme-dark .plugin-requires {
          background: rgba(235, 203, 139, 0.1);
          border: 1px solid rgba(235, 203, 139, 0.3);
          color: #ebcb8b;
        }
        
        .theme-dark .theme-notice {
          color: #ebcb8b;
        }
        
        .theme-dark .empty-state {
          color: #d8dee9;
        }
        
        .theme-dark .btn-icon {
          background: #2e3440;
          border: 1px solid #4c566a;
          color: #e5e9f0;
        }
        
        .theme-dark .btn-icon:hover {
          background: #3b4252;
          border-color: #88c0d0;
        }
        
        .theme-dark .btn-icon.btn-danger {
          background: rgba(191, 97, 106, 0.1);
          border-color: rgba(191, 97, 106, 0.3);
          color: #bf616a;
        }
        
        .theme-dark .btn-icon.btn-danger:hover {
          background: rgba(191, 97, 106, 0.2);
          border-color: #bf616a;
        }
        
        .theme-dark .btn-delete-small {
          background: rgba(191, 97, 106, 0.1);
          color: #bf616a;
        }
        
        .theme-dark .btn-delete-small:hover {
          background: rgba(191, 97, 106, 0.2);
        }
        
        /* === Landing 页面 === */
        .theme-dark .landing {
          background-color: #2e3440;
        }
        
        .theme-dark .qr-container {
          background: #3b4252;
          border: 2px solid #4c566a;
        }
        
        /* === 登录标签页 === */
        .theme-dark .login-tabs {
          border-bottom: 1px solid #4c566a;
        }
        
        .theme-dark .login-tab {
          color: #d8dee9;
        }
        
        .theme-dark .login-tab.active {
          color: #88c0d0;
          border-bottom: 2px solid #88c0d0;
        }
        
        .theme-dark .login-hint {
          color: #e5e9f0;
          background: rgba(136, 192, 208, 0.1);
        }
        
        .theme-dark .login-divider::before,
        .theme-dark .login-divider::after {
          background: #4c566a;
        }
        
        .theme-dark .login-divider span,
        .theme-dark .login-note,
        .theme-dark .guest-note {
          color: #d8dee9;
        }
        
        /* === 自动保存提示 === */
        .theme-dark .auto-save-hint {
          color: #d8dee9;
          background: #2e3440;
        }

        /* === 移动端适配 === */
        @media (max-width: 768px) {
          .theme-dark .mobile-menu-btn {
            background: #3b4252;
            border: 2px solid #4c566a;
            color: #88c0d0;
          }
          
          .theme-dark .mobile-menu-btn:hover {
            background: #2e3440;
            border-color: #88c0d0;
          }
          
          .theme-dark .mobile-close-btn {
            background: #2e3440;
            border: 1px solid #4c566a;
            color: #88c0d0;
          }
          
          .theme-dark .mobile-close-btn:hover {
            background: #3b4252;
          }
        }
      `
    };
  }
}

