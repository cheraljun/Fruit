/**
 * 故事结构分析器（框架无关，前后端共享）
 * 职责：分析互动小说的拓扑结构，提取叙事语义
 * 
 * 设计原则：
 * - 纯逻辑：不依赖DOM、React、Node.js特定API
 * - 图算法：使用graphAlgorithms的高质量实现
 * - 单一职责：只分析结构，不负责布局
 * 
 * 重构说明：
 * - 使用graphAlgorithms.ts提供的SCC检测
 * - 正确处理循环结构
 * - 删除有bug的路径估算
 */

import { NODE_TYPES } from '../../constants/defaults.js';
import type { StoryNode, StoryEdge } from '../../types/index.js';
import {
  buildGraph,
  findStronglyConnectedComponents,
  hasCycle,
  findCycles,
  type StronglyConnectedComponent,
  type Cycle
} from './graphAlgorithms.js';

/**
 * 单个节点的分析结果
 */
export interface NodeAnalysis {
  nodeId: string;
  depth: number;              // 从开始节点到此节点的最短距离（考虑了SCC）
  sccId: number | null;       // 所属的强连通分量ID
  isInLoop: boolean;          // 是否在循环中
  maxDepthToEnd: number;      // 从此节点到任意结局的最长距离
  outDegree: number;          // 出度（有几个后续节点）
  inDegree: number;           // 入度（有几个前置节点）
  choiceCount: number;        // 选项数量
  isKeyDecision: boolean;     // 是否为关键决策点（3+选项）
  reachableEndings: string[]; // 可到达的结局节点ID列表
}

/**
 * 整体故事的分析结果
 */
export interface StoryAnalysis {
  nodes: Map<string, NodeAnalysis>;
  maxDepth: number;                           // 故事最大深度
  startNodeId: string | null;                 // 开始节点ID
  endingNodeIds: string[];                    // 所有结局节点ID
  hasCycles: boolean;                         // 是否包含循环
  sccs: StronglyConnectedComponent[];         // 所有强连通分量
  cycles: Cycle[];                            // 检测到的循环（最多10个）
}

/**
 * 故事结构分析器
 */
class StoryAnalyzer {
  private nodes: StoryNode[];
  private edges: StoryEdge[];
  private adjacencyList: Map<string, string[]>;         // 邻接表：nodeId -> [targetIds]
  private reverseAdjacencyList: Map<string, string[]>;  // 反向邻接表

  constructor(nodes: StoryNode[], edges: StoryEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.adjacencyList = new Map();
    this.reverseAdjacencyList = new Map();
    this.buildAdjacencyLists();
  }

  /**
   * 构建邻接表（图的基础数据结构）
   */
  private buildAdjacencyLists(): void {
    // 初始化
    this.nodes.forEach(node => {
      this.adjacencyList.set(node.id, []);
      this.reverseAdjacencyList.set(node.id, []);
    });

    // 填充
    this.edges.forEach(edge => {
      const sources = this.adjacencyList.get(edge.source) || [];
      sources.push(edge.target);
      this.adjacencyList.set(edge.source, sources);

      const targets = this.reverseAdjacencyList.get(edge.target) || [];
      targets.push(edge.source);
      this.reverseAdjacencyList.set(edge.target, targets);
    });
  }

  /**
   * 执行完整分析
   */
  analyze(): StoryAnalysis {
    const startNode = this.nodes.find(n => n.data.nodeType === NODE_TYPES.START);
    if (!startNode) {
      return this.emptyAnalysis();
    }

    const endingNodes = this.nodes.filter(n => n.data.nodeType === NODE_TYPES.ENDING);
    
    // 构建图结构用于算法分析
    const graph = buildGraph(
      this.nodes.map(n => n.id),
      this.edges.map(e => ({ source: e.source, target: e.target }))
    );

    // 检测强连通分量和循环
    const sccs = findStronglyConnectedComponents(graph);
    const hasCyclesFlag = hasCycle(graph);
    const cycles = hasCyclesFlag ? findCycles(graph) : [];

    // 建立节点到SCC的映射
    const nodeToSCC = this.buildNodeToSCCMap(sccs);

    // 计算深度（考虑SCC）
    const depths = this.calculateDepthsWithSCC(startNode.id, nodeToSCC);
    
    // 计算到结局的最大深度
    const maxDepthsToEnd = this.calculateMaxDepthsToEnd(endingNodes.map(n => n.id));
    
    // 计算可达结局
    const reachableEndings = this.calculateReachableEndings(endingNodes.map(n => n.id));

    // 构建节点分析结果
    const analysisMap = new Map<string, NodeAnalysis>();
    let maxDepth = 0;

    this.nodes.forEach(node => {
      const depth = depths.get(node.id) ?? Infinity;
      const sccId = nodeToSCC.get(node.id) ?? null;
      const scc = sccId !== null ? sccs.find(s => s.id === sccId) : null;
      const isInLoop = scc ? scc.isLoop : false;
      const maxDepthToEnd = maxDepthsToEnd.get(node.id) ?? 0;
      const outDegree = this.adjacencyList.get(node.id)?.length ?? 0;
      const inDegree = this.reverseAdjacencyList.get(node.id)?.length ?? 0;
      const choiceCount = (node.data as any).choices.length;
      const isKeyDecision = choiceCount >= 3;
      const endings = reachableEndings.get(node.id) ?? [];

      if (depth !== Infinity && depth > maxDepth) {
        maxDepth = depth;
      }

      analysisMap.set(node.id, {
        nodeId: node.id,
        depth,
        sccId,
        isInLoop,
        maxDepthToEnd,
        outDegree,
        inDegree,
        choiceCount,
        isKeyDecision,
        reachableEndings: endings
      });
    });

    return {
      nodes: analysisMap,
      maxDepth,
      startNodeId: startNode.id,
      endingNodeIds: endingNodes.map(n => n.id),
      hasCycles: hasCyclesFlag,
      sccs,
      cycles
    };
  }

  /**
   * 建立节点到SCC的映射
   */
  private buildNodeToSCCMap(sccs: StronglyConnectedComponent[]): Map<string, number> {
    const map = new Map<string, number>();
    sccs.forEach(scc => {
      scc.nodes.forEach(nodeId => {
        map.set(nodeId, scc.id);
      });
    });
    return map;
  }

  /**
   * 计算深度（考虑SCC）
   * 
   * 算法改进：
   * - 对于在同一SCC内的节点，赋予相同的深度
   * - 这样循环节点会在同一层显示，而不是错位
   */
  private calculateDepthsWithSCC(
    startNodeId: string,
    nodeToSCC: Map<string, number>
  ): Map<string, number> {
    const depths = new Map<string, number>();
    const sccDepths = new Map<number, number>();
    const queue: Array<{ id: string; depth: number }> = [{ id: startNodeId, depth: 0 }];
    
    // 初始化起始节点的SCC深度
    const startSCC = nodeToSCC.get(startNodeId);
    if (startSCC !== undefined) {
      sccDepths.set(startSCC, 0);
    }

    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current.id)) continue;
      
      visited.add(current.id);
      const currentSCC = nodeToSCC.get(current.id);

      // 同一SCC内的所有节点使用相同深度
      if (currentSCC !== undefined) {
        const sccDepth = sccDepths.get(currentSCC);
        if (sccDepth !== undefined) {
          depths.set(current.id, sccDepth);
        } else {
          depths.set(current.id, current.depth);
          sccDepths.set(currentSCC, current.depth);
        }
      } else {
        depths.set(current.id, current.depth);
      }

      const neighbors = this.adjacencyList.get(current.id) || [];
      neighbors.forEach(neighborId => {
        if (!visited.has(neighborId)) {
          const neighborSCC = nodeToSCC.get(neighborId);
          
          // 如果邻居在同一SCC内，深度不变
          if (currentSCC !== undefined && neighborSCC === currentSCC) {
            queue.push({ id: neighborId, depth: depths.get(current.id)! });
          } else {
            // 跨SCC的边，深度+1
            queue.push({ id: neighborId, depth: depths.get(current.id)! + 1 });
          }
        }
      });
    }

    return depths;
  }

  /**
   * DFS计算从每个节点到结局的最长距离（反向思考）
   */
  private calculateMaxDepthsToEnd(endingNodeIds: string[]): Map<string, number> {
    const maxDepths = new Map<string, number>();
    const visited = new Set<string>();

    // 从每个结局节点反向DFS
    const dfs = (nodeId: string, visitedInPath: Set<string>): number => {
      // 防止循环导致的无限递归
      if (visitedInPath.has(nodeId)) {
        return maxDepths.get(nodeId) ?? 0;
      }

      if (visited.has(nodeId)) {
        return maxDepths.get(nodeId) ?? 0;
      }
      
      visited.add(nodeId);
      const newVisitedInPath = new Set(visitedInPath);
      newVisitedInPath.add(nodeId);

      // 如果是结局节点，距离为0
      if (endingNodeIds.includes(nodeId)) {
        maxDepths.set(nodeId, 0);
        return 0;
      }

      // 找所有后继节点的最大距离
      const successors = this.adjacencyList.get(nodeId) || [];
      if (successors.length === 0) {
        maxDepths.set(nodeId, 0);
        return 0;
      }

      const maxChildDepth = Math.max(...successors.map(succId => dfs(succId, newVisitedInPath)));
      const depth = maxChildDepth + 1;
      maxDepths.set(nodeId, depth);
      return depth;
    };

    this.nodes.forEach(node => dfs(node.id, new Set()));
    return maxDepths;
  }

  /**
   * 计算每个节点可到达的结局列表
   */
  private calculateReachableEndings(
    endingNodeIds: string[]
  ): Map<string, string[]> {
    const reachable = new Map<string, string[]>();

    // 对每个节点，DFS找到所有可达的结局
    const findReachableEndings = (nodeId: string, visited: Set<string>): string[] => {
      if (visited.has(nodeId)) return [];
      visited.add(nodeId);

      if (endingNodeIds.includes(nodeId)) {
        return [nodeId];
      }

      const successors = this.adjacencyList.get(nodeId) || [];
      const endings = new Set<string>();
      
      successors.forEach(succId => {
        const succEndings = findReachableEndings(succId, new Set(visited));
        succEndings.forEach(e => endings.add(e));
      });

      return Array.from(endings);
    };

    this.nodes.forEach(node => {
      const endings = findReachableEndings(node.id, new Set());
      reachable.set(node.id, endings);
    });

    return reachable;
  }

  /**
   * 返回空分析结果
   */
  private emptyAnalysis(): StoryAnalysis {
    return {
      nodes: new Map(),
      maxDepth: 0,
      startNodeId: null,
      endingNodeIds: [],
      hasCycles: false,
      sccs: [],
      cycles: []
    };
  }
}

export default StoryAnalyzer;
