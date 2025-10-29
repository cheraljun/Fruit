/**
 * 共享类型定义
 * 职责：定义前后端通用的数据结构
 */

// ============= Blockly 类型 =============

export * from './blockly.js';

// ============= 基础类型 =============

export interface Position {
  x: number;
  y: number;
}

export interface Choice {
  id: string;
  text: string;
  // 插件扩展数据（各插件可在此存储自己的数据）
  pluginData?: Record<string, any>;
}

// ============= 节点类型 =============

export type NodeType = 'start' | 'normal' | 'ending';

export interface NodeImage {
  imagePath: string;     // 相对路径（如 "pictures/abc123.webp"）
  fileName: string;      // 原始文件名
  fileSize: number;      // 文件大小（字节）
  originalFormat: string; // 原始格式 (png, jpg, gif等)
  hash: string;          // 图片内容哈希（用于去重）
  width: number;         // 图片宽度
  height: number;        // 图片高度
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 
            'top left' | 'top right' | 'bottom left' | 'bottom right'; // 背景图位置
  sceneName?: string;    // 场景名称（热点图片模式下显示在世界地图中）
  scale?: number;        // 缩放比例（0.1-3.0，默认1.0）
}

export interface CharacterImages {
  left?: NodeImage;
  center?: NodeImage;
  right?: NodeImage;
}

export interface TextNodeData {
  nodeId: number;
  text: string;
  choices: Choice[];
  nodeType: 'start' | 'normal' | 'ending';
  image?: NodeImage;
  characterImages?: CharacterImages;
  tags?: string[];
  typewriterSpeed?: number; // 打字机速度（毫秒/字符），0=关闭，默认0
  // 插件扩展数据（各插件可在此存储自己的数据）
  pluginData?: Record<string, any>;
}

export type NodeData = TextNodeData;

export interface StoryNode {
  id: string;
  type: 'storyNode';
  position: Position;
  data: NodeData;
}

// ============= 边类型 =============

export interface StoryEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  animated?: boolean;
  markerEnd?: {
    type: any; // 兼容ReactFlow的MarkerType
    width?: number;
    height?: number;
    color?: string;
  };
  style?: {
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
}

// ============= 故事元数据 =============

export interface StoryMeta {
  id?: string;
  title: string;
  author: string;
  description: string;
  start_node: number;
  displayMode?: 'terminal' | 'visual-novel';  // 播放器显示模式
  stylePluginId?: string;  // 当前使用的样式插件ID
}

// ============= 变量定义类型 =============

export interface VariableDefinition {
  id: string;
  label: string;
  type: 'number' | 'string' | 'boolean';
  defaultValue: number | string | boolean;
  description?: string;
  source?: 'user' | 'plugin';
  pluginId?: string;
}

// ============= 完整故事结构 =============

export interface Story {
  id: string;
  meta: StoryMeta;
  nodes: StoryNode[];
  edges: StoryEdge[];
  variables?: VariableDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface StoryListItem {
  id: string;
  title: string;
  author: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ============= 故事引擎类型 =============

export interface CurrentNode {
  id: string;
  nodeId: number;
  text: string;
  type: NodeType;
  choices: ChoiceWithTarget[];
  image?: NodeImage;     // 节点可选的背景图
  characterImages?: CharacterImages;  // 角色立绘
  renderedHTML?: string; // 经过插件渲染后的HTML内容
}

export interface ChoiceWithTarget extends Choice {
  targetNodeId: string | null;
  index: number;
}

export interface SaveState {
  currentNodeId: string;
  history: string[];
}

// ============= 验证相关类型 =============

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

