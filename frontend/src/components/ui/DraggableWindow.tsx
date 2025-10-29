/**
 * 可拖动窗口组件
 * 使用 react-draggable 库
 */

import { ReactNode } from 'react';
import Draggable from 'react-draggable';

interface DraggableWindowProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  maxHeight?: string;
  title: string;
  onClose: () => void;
  defaultPosition?: { x: number; y: number };
  zIndex?: number;
}

export function DraggableWindow({
  children,
  width = 400,
  height = 'auto',
  maxHeight = '80vh',
  title,
  onClose,
  defaultPosition = { x: 0, y: 0 },
  zIndex = 1000
}: DraggableWindowProps) {
  return (
    <Draggable
      handle=".draggable-window-header"
      defaultPosition={defaultPosition}
      bounds="parent"
    >
      <div
        style={{
          position: 'fixed',
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          maxHeight,
          background: 'var(--theme-background-primary)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px var(--theme-shadow)',
          display: 'flex',
          flexDirection: 'column',
          zIndex
        }}
      >
        {/* 可拖动的标题栏 */}
        <div
          className="draggable-window-header"
          style={{
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'move',
            userSelect: 'none',
            background: 'var(--theme-background-secondary)',
            borderRadius: '16px 16px 0 0',
            flexShrink: 0
          }}
        >
          <h3 style={{ 
            margin: 0, 
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--theme-text-primary)'
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--theme-text-secondary)',
              padding: '0 8px',
              lineHeight: 1,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text-secondary)'}
            title="关闭"
          >
            ×
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          minHeight: 0
        }}>
          {children}
        </div>
      </div>
    </Draggable>
  );
}

export default DraggableWindow;

