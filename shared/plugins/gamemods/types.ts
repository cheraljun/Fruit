/**
 * 游戏模组文档类型定义
 */

export interface GameModFunction {
  name: string;
  params: string;
  returns: string;
  description: string;
  example: string;
}

export interface GameModDocs {
  name: string;
  description: string;
  variables: {
    name: string;
    description: string;
    example: string;
  }[];
  functions: GameModFunction[];
}

