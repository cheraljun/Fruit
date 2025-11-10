/**
 * 输入验证中间件
 * 职责：验证请求数据的基本格式（不验证业务完整性）
 * 
 * 设计原则：
 * - 只验证数据格式是否正确
 * - 不验证故事是否完整（允许保存不完整的故事）
 * - 业务完整性验证由前端用户主动触发
 */

import type { Request, Response, NextFunction } from 'express';
import type { StoryMeta, StoryNode, StoryEdge } from '../types/index.js';

interface StoryRequestBody {
  meta?: StoryMeta;
  nodes?: StoryNode[];
  edges?: StoryEdge[];
}

/**
 * 验证故事创建/更新数据
 */
export function validateStoryData(req: Request<{}, {}, StoryRequestBody>, res: Response, next: NextFunction): void {
  const { meta, nodes, edges } = req.body;

  // 基础验证
  if (!meta || !meta.title) {
    res.status(400).json({ 
      error: '缺少必要字段：meta.title' 
    });
    return;
  }

  if (!Array.isArray(nodes)) {
    res.status(400).json({ 
      error: 'nodes必须是数组' 
    });
    return;
  }

  if (!Array.isArray(edges)) {
    res.status(400).json({ 
      error: 'edges必须是数组' 
    });
    return;
  }

  // 节点数据验证
  for (const node of nodes) {
    if (!node.id || !node.data) {
      res.status(400).json({ 
        error: '节点数据不完整' 
      });
      return;
    }

    // 文本节点验证
    const textData = node.data as any;
    if (!textData.text) {
      res.status(400).json({ 
        error: `节点 ${node.id} 缺少文本内容` 
      });
      return;
    }

    if (!Array.isArray(textData.choices)) {
      res.status(400).json({ 
        error: `节点 ${node.id} 的choices必须是数组` 
      });
      return;
    }

    // 如果节点有图片，验证图片数据
    if (textData.image) {
      if (!textData.image.imagePath || !textData.image.fileName || !textData.image.hash) {
        res.status(400).json({ 
          error: `节点 ${node.id} 的图片数据不完整` 
        });
        return;
      }
    }
  }

  // 通过：只要数据格式正确，就允许保存
  // 注意：不验证故事完整性，允许保存不完整的故事
  // 完整性验证由前端用户主动触发（点击"验证"按钮）
  next();
}

/**
 * 验证ID参数
 */
export function validateId(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    res.status(400).json({ 
      error: '无效的ID参数' 
    });
    return;
  }

  next();
}

/**
 * 同步验证Story数据（用于Service层）
 * @returns 错误信息，如果验证通过则返回null
 */
export function validateStoryDataSync(story: any): string | null {
  const { meta, nodes, edges } = story;

  // 基础验证
  if (!meta || !meta.title) {
    return '缺少必要字段：meta.title';
  }

  if (!Array.isArray(nodes)) {
    return 'nodes必须是数组';
  }

  if (!Array.isArray(edges)) {
    return 'edges必须是数组';
  }

  // 节点数据验证
  for (const node of nodes) {
    if (!node.id || !node.data) {
      return '节点数据不完整';
    }

    const textData = node.data as any;
    if (!textData.text) {
      return `节点 ${node.id} 缺少文本内容`;
    }

    if (!Array.isArray(textData.choices)) {
      return `节点 ${node.id} 的choices必须是数组`;
    }

    // 标签验证
    if (textData.tags) {
      if (!Array.isArray(textData.tags)) {
        return `节点 ${node.id} 的tags必须是数组`;
      }
      // 限制标签数量和长度
      if (textData.tags.length > 10) {
        return `节点 ${node.id} 标签数量不能超过10个`;
      }
      textData.tags = textData.tags
        .filter((tag: any) => typeof tag === 'string' && tag.trim().length > 0)
        .map((tag: string) => tag.trim().substring(0, 20));
    }

    // 图片验证
    if (textData.image) {
      if (!textData.image.imagePath || !textData.image.fileName || !textData.image.hash) {
        return `节点 ${node.id} 的图片数据不完整`;
      }
    }
  }

  return null; // 验证通过
}

