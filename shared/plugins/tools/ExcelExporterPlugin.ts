/**
 * Excel导入/导出插件
 * 职责：将Story JSON与Excel格式互相转换
 * 
 * 设计原则：
 * - JSON是唯一存储格式
 * - Excel只是交换格式（导入/导出时转换）
 * - 无损转换（所有Story数据完整保留）
 */

import { PluginBase } from '../../plugin/PluginBase.js';
import type { PluginMetadata } from '../../plugin/types.js';
import type { Story, StoryNode, StoryEdge, VariableDefinition } from '../../types/index.js';

declare const XLSX: any;

// 浏览器API类型声明（兼容Node.js环境编译）
declare const FileReader: any;
declare const File: any;

export class ExcelExporterPlugin extends PluginBase {
  metadata: PluginMetadata = {
    id: 'tool.excel-exporter',
    name: 'Excel导入/导出',
    version: '1.0.0',
    author: '墨水官方',
    description: '将Story转换为Excel格式，支持批量编辑和协作',
    category: 'tool',
    tags: ['工具', '导入', '导出', 'Excel']
  };

  /**
   * 导出Story为Excel文件
   */
  exportToExcel(story: Story): void {
    if (typeof XLSX === 'undefined') {
      throw new Error('XLSX库未加载，请检查依赖');
    }

    const wb = XLSX.utils.book_new();

    // Sheet1: 元数据
    const metaData = [
      ['key', 'value'],
      ['id', story.id],
      ['title', story.meta.title],
      ['author', story.meta.author],
      ['description', story.meta.description],
      ['start_node', story.meta.start_node],
      ['displayMode', story.meta.displayMode || 'visual-novel'],
      ['stylePluginId', story.meta.stylePluginId || ''],
      ['createdAt', story.createdAt],
      ['updatedAt', story.updatedAt]
    ];
    const metaSheet = XLSX.utils.aoa_to_sheet(metaData);
    XLSX.utils.book_append_sheet(wb, metaSheet, 'Meta');

    // Sheet2: 节点内容
    const nodesData: any[][] = [
      ['id', 'nodeId', 'text', 'nodeType', 'position_x', 'position_y', 'tags', 'typewriterSpeed', 'image_path', 'image_fileName', 'pluginData']
    ];
    story.nodes.forEach(node => {
      nodesData.push([
        node.id,
        node.data.nodeId,
        node.data.text,
        node.data.nodeType,
        node.position.x,
        node.position.y,
        node.data.tags?.join(',') || '',
        node.data.typewriterSpeed || 0,
        node.data.image?.imagePath || '',
        node.data.image?.fileName || '',
        node.data.pluginData ? JSON.stringify(node.data.pluginData) : ''
      ]);
    });
    const nodesSheet = XLSX.utils.aoa_to_sheet(nodesData);
    XLSX.utils.book_append_sheet(wb, nodesSheet, 'Nodes');

    // Sheet3: 连接关系
    const edgesData: any[][] = [
      ['id', 'source', 'target', 'sourceHandle', 'targetHandle', 'animated', 'style_stroke', 'style_strokeWidth']
    ];
    story.edges.forEach(edge => {
      edgesData.push([
        edge.id,
        edge.source,
        edge.target,
        edge.sourceHandle || '',
        edge.targetHandle || '',
        edge.animated ? 'TRUE' : 'FALSE',
        edge.style?.stroke || '',
        edge.style?.strokeWidth || ''
      ]);
    });
    const edgesSheet = XLSX.utils.aoa_to_sheet(edgesData);
    XLSX.utils.book_append_sheet(wb, edgesSheet, 'Edges');

    // Sheet4: 选项明细
    const choicesData: any[][] = [
      ['node_id', 'choice_id', 'choice_text', 'target_node_id', 'pluginData']
    ];
    story.nodes.forEach(node => {
      node.data.choices.forEach(choice => {
        const edge = story.edges.find(e => 
          e.source === node.id && e.sourceHandle === choice.id
        );
        const targetNode = edge ? story.nodes.find(n => n.id === edge.target) : null;
        
        choicesData.push([
          node.data.nodeId,
          choice.id,
          choice.text,
          targetNode?.data.nodeId || '',
          choice.pluginData ? JSON.stringify(choice.pluginData) : ''
        ]);
      });
    });
    const choicesSheet = XLSX.utils.aoa_to_sheet(choicesData);
    XLSX.utils.book_append_sheet(wb, choicesSheet, 'Choices');

    // Sheet5: 变量定义
    if (story.variables && story.variables.length > 0) {
      const variablesData: any[][] = [
        ['id', 'label', 'type', 'defaultValue', 'description', 'source', 'pluginId']
      ];
      story.variables.forEach(v => {
        variablesData.push([
          v.id,
          v.label,
          v.type,
          String(v.defaultValue),
          v.description || '',
          v.source || '',
          v.pluginId || ''
        ]);
      });
      const variablesSheet = XLSX.utils.aoa_to_sheet(variablesData);
      XLSX.utils.book_append_sheet(wb, variablesSheet, 'Variables');
    }

    // 触发下载
    const fileName = `${story.meta.title}.xlsx`;
    XLSX.writeFile(wb, fileName);

    this.notify(`已导出为Excel: ${fileName}`, 'success');
  }

  /**
   * 从Excel导入Story
   * 注意：仅浏览器环境可用
   */
  async importFromExcel(file: File): Promise<Story> {
    if (typeof XLSX === 'undefined') {
      throw new Error('XLSX库未加载，请检查依赖');
    }

    if (typeof FileReader === 'undefined') {
      throw new Error('FileReader不可用，此功能仅支持浏览器环境');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: 'array' });

          // 验证必需的Sheet
          if (!wb.Sheets['Meta'] || !wb.Sheets['Nodes'] || !wb.Sheets['Edges'] || !wb.Sheets['Choices']) {
            throw new Error('Excel格式错误：缺少必需的Sheet（Meta, Nodes, Edges, Choices）');
          }

          // 解析元数据
          const metaSheet = XLSX.utils.sheet_to_json(wb.Sheets['Meta'], { header: 1 }) as any[][];
          const metaMap: Record<string, any> = {};
          metaSheet.slice(1).forEach(row => {
            if (row[0]) metaMap[row[0]] = row[1];
          });

          // 解析节点
          const nodesSheet = XLSX.utils.sheet_to_json(wb.Sheets['Nodes']) as any[];
          const nodes: StoryNode[] = nodesSheet.map(row => ({
            id: String(row.id),
            type: 'storyNode' as const,
            position: {
              x: Number(row.position_x) || 0,
              y: Number(row.position_y) || 0
            },
            data: {
              nodeId: Number(row.nodeId),
              text: String(row.text || ''),
              nodeType: row.nodeType || 'normal',
              choices: [], // 稍后从Choices表填充
              tags: row.tags ? String(row.tags).split(',').filter(t => t.trim()) : [],
              typewriterSpeed: Number(row.typewriterSpeed) || 0,
              image: row.image_path ? {
                imagePath: String(row.image_path),
                fileName: String(row.image_fileName || ''),
                fileSize: 0,
                originalFormat: '',
                hash: '',
                width: 0,
                height: 0
              } : undefined,
              pluginData: row.pluginData ? this.parseJSON(row.pluginData) : undefined
            }
          }));

          // 解析选项
          const choicesSheet = XLSX.utils.sheet_to_json(wb.Sheets['Choices']) as any[];
          const choicesMap = new Map<number, any[]>();
          choicesSheet.forEach(row => {
            const nodeId = Number(row.node_id);
            if (!choicesMap.has(nodeId)) {
              choicesMap.set(nodeId, []);
            }
            choicesMap.get(nodeId)!.push({
              id: String(row.choice_id),
              text: String(row.choice_text),
              targetNodeId: row.target_node_id ? Number(row.target_node_id) : null,
              pluginData: row.pluginData ? this.parseJSON(row.pluginData) : undefined
            });
          });

          // 填充节点的choices
          nodes.forEach(node => {
            const choices = choicesMap.get(node.data.nodeId) || [];
            node.data.choices = choices.map(c => ({
              id: c.id,
              text: c.text,
              pluginData: c.pluginData
            }));
          });

          // 解析边（需要建立nodeId到id的映射）
          const nodeIdToId = new Map<number, string>();
          nodes.forEach(n => nodeIdToId.set(n.data.nodeId, n.id));

          const edgesSheet = XLSX.utils.sheet_to_json(wb.Sheets['Edges']) as any[];
          const edges: StoryEdge[] = edgesSheet.map(row => ({
            id: String(row.id),
            source: String(row.source),
            target: String(row.target),
            sourceHandle: row.sourceHandle || null,
            targetHandle: row.targetHandle || null,
            animated: row.animated === 'TRUE' || row.animated === true,
            style: row.style_stroke ? {
              stroke: String(row.style_stroke),
              strokeWidth: Number(row.style_strokeWidth) || 2
            } : undefined
          }));

          // 解析变量（可选）
          let variables: VariableDefinition[] | undefined;
          if (wb.Sheets['Variables']) {
            const variablesSheet = XLSX.utils.sheet_to_json(wb.Sheets['Variables']) as any[];
            variables = variablesSheet.map(row => ({
              id: String(row.id),
              label: String(row.label),
              type: row.type as 'number' | 'string' | 'boolean',
              defaultValue: this.parseValue(row.defaultValue, row.type),
              description: row.description || '',
              source: row.source as 'user' | 'plugin' | undefined,
              pluginId: row.pluginId || undefined
            }));
          }

          // 构建Story对象
          const story: Story = {
            id: metaMap.id || `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            meta: {
              title: metaMap.title || '未命名故事',
              author: metaMap.author || '未知作者',
              description: metaMap.description || '',
              start_node: Number(metaMap.start_node) || 1,
              displayMode: metaMap.displayMode || 'visual-novel',
              stylePluginId: metaMap.stylePluginId || undefined
            },
            nodes,
            edges,
            variables,
            createdAt: metaMap.createdAt || new Date().toISOString(),
            updatedAt: metaMap.updatedAt || new Date().toISOString()
          };

          resolve(story);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 安全解析JSON字符串
   */
  private parseJSON(str: string): any {
    try {
      return JSON.parse(str);
    } catch {
      return undefined;
    }
  }

  /**
   * 解析变量值
   */
  private parseValue(value: any, type: string): number | string | boolean {
    if (type === 'number') {
      return Number(value) || 0;
    } else if (type === 'boolean') {
      return value === 'true' || value === 'TRUE' || value === true;
    } else {
      return String(value);
    }
  }

  protected async onInstall(): Promise<void> {
    console.log('[ExcelExporterPlugin] Installed');
  }
}

