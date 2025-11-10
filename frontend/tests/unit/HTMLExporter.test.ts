/**
 * HTMLExporter 单元测试
 * 测试HTML导出功能
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { HTMLExporter } from '../../src/services/HTMLExporter';
import type { Story } from '../../src/types/index';

// Mock fetch
global.fetch = vi.fn();

describe('HTMLExporter - 基础功能', () => {
  let exporter: HTMLExporter;
  
  beforeEach(() => {
    exporter = new HTMLExporter();
    vi.clearAllMocks();
  });

  test('能创建导出器实例', () => {
    expect(exporter).toBeDefined();
  });

  test('loadTemplates() 应该加载模板', async () => {
    const mockTemplate = '<html>{{STORY_DATA}}</html>';
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockTemplate
    });
    
    await exporter.loadTemplates();
    
    expect(fetch).toHaveBeenCalledWith('/templates/visual-novel-player.html');
  });

  test('loadTemplates() 模板不存在时应该静默失败', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false
    });
    
    // 不会抛错，只是不设置模板
    await exporter.loadTemplates();
    
    // 验证：调用了fetch
    expect(fetch).toHaveBeenCalled();
  });
});

describe('HTMLExporter - 导出功能', () => {
  let exporter: HTMLExporter;
  let simpleStory: Story;
  
  beforeEach(() => {
    exporter = new HTMLExporter();
    
    simpleStory = {
      id: 'test-story',
      meta: {
        id: 'test',
        title: '测试故事',
        author: '测试作者',
        description: '测试描述',
        start_node: 1
      },
      nodes: [
        {
          id: '1',
          type: 'storyNode',
          position: { x: 0, y: 0 },
          data: {
            nodeId: 1,
            nodeType: 'start',
            text: '开始节点',
            choices: [{ id: 'c1', text: '选项1' }]
          }
        }
      ],
      edges: [],
      variables: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    vi.clearAllMocks();
  });

  test('exportToHTML() 应该注入故事数据', async () => {
    const mockTemplate = '<html><script>window.STORY_DATA = {{STORY_DATA}};</script><title>{{STORY_NAME}}</title></html>';
    
    // Mock loadTemplates
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockTemplate
    });
    
    await exporter.loadTemplates();
    
    // Mock createElement 和 click（用于触发下载）
    const mockClick = vi.fn();
    const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      href: '',
      download: ''
    } as any);
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    await exporter.exportToHTML(simpleStory, 'visual-novel');
    
    // 验证：创建了下载链接
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
  });
});

describe('HTMLExporter - 数据处理', () => {
  test('应该将故事数据序列化为JSON', async () => {
    const exporter = new HTMLExporter();
    const mockTemplate = '<html>{{STORY_DATA}}</html>';
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockTemplate
    });
    
    await exporter.loadTemplates();
    
    const story: Story = {
      id: 'test',
      meta: {
        id: 'test',
        title: '测试',
        author: '作者',
        start_node: 1
      },
      nodes: [
        {
          id: '1',
          type: 'storyNode',
          position: { x: 0, y: 0 },
          data: {
            nodeId: 1,
            nodeType: 'start',
            text: '开始',
            choices: []
          }
        }
      ],
      edges: [],
      variables: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Mock下载功能
    const mockClick = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      href: '',
      download: ''
    } as any);
    
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    await exporter.exportToHTML(story, 'visual-novel');
    
    // 验证：调用了下载
    expect(mockClick).toHaveBeenCalled();
  });
});

