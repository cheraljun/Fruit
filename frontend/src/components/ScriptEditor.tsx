/**
 * 脚本编辑器组件
 * 职责：封装Monaco Editor，提供JavaScript代码编辑功能
 */

import { Editor } from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { useRef, useEffect } from 'react';

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

function ScriptEditor({ 
  value, 
  onChange, 
  height = '120px',
  readOnly = false
}: ScriptEditorProps): JSX.Element {

  const { currentTheme } = useTheme();
  const monacoRef = useRef<any>(null);
  
  const isDarkMode = currentTheme === 'theme.dark';
  const monacoTheme = isDarkMode ? 'vs-dark' : 'light-cyan';

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [monacoTheme]);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    monacoRef.current = monaco;
    
    monaco.editor.defineTheme('light-cyan', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a9955' },
        { token: 'keyword', foreground: '0000ff', fontStyle: 'bold' },
        { token: 'string', foreground: 'a31515' },
        { token: 'number', foreground: '098658' },
        { token: 'variable', foreground: '001080' },
        { token: 'type', foreground: '267f99' },
        { token: 'function', foreground: '795e26' },
        { token: 'operator', foreground: '000000' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1e293b',
        'editorLineNumber.foreground': '#0284c7',
        'editorLineNumber.activeForeground': '#0369a1',
        'editor.lineHighlightBackground': '#f0f9ff',
        'editor.selectionBackground': '#bae6fd',
        'editor.inactiveSelectionBackground': '#e0f2fe',
        'editorCursor.foreground': '#0284c7',
        'editor.findMatchBackground': '#fde047',
        'editor.findMatchHighlightBackground': '#fef9c3',
        'editorWidget.background': '#ffffff',
        'editorWidget.border': '#7dd3fc',
        'editorSuggestWidget.background': '#ffffff',
        'editorSuggestWidget.border': '#7dd3fc',
        'editorSuggestWidget.selectedBackground': '#e0f2fe',
        'list.hoverBackground': '#f0f9ff',
        'scrollbarSlider.background': '#7dd3fc80',
        'scrollbarSlider.hoverBackground': '#7dd3fccc'
      }
    });
    
    monaco.editor.setTheme(monacoTheme);
  };

  const borderColor = isDarkMode ? '#334155' : '#d1d5db';
  const backgroundColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const loadingColor = isDarkMode ? '#9ca3af' : '#64748b';

  return (
    <div style={{ 
      border: `1px solid ${borderColor}`, 
      borderRadius: '6px', 
      overflow: 'hidden',
      background: backgroundColor
    }}>
      <Editor
        height={height}
        defaultLanguage="javascript"
        value={value || ''}
        onChange={handleEditorChange}
        theme={monacoTheme}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          readOnly: readOnly,
          folding: false,
          lineDecorationsWidth: 5,
          lineNumbersMinChars: 5,
          glyphMargin: false,
          renderLineHighlight: 'all',
          padding: {
            top: 8,
            bottom: 8
          },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          },
          suggest: {
            snippetsPreventQuickSuggestions: false
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true
          }
        }}
        loading={<div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: loadingColor,
          background: backgroundColor
        }}>加载编辑器...</div>}
      />
    </div>
  );
}

export default ScriptEditor;

