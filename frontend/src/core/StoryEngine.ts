/**
 * 故事引擎（向后兼容层）
 * 职责：为旧代码提供兼容接口
 * 
 * 注意：新代码应使用 CoreEngine
 */

import { CoreEngine } from './CoreEngine.js';
import type { Story } from '../types/index.js';

class StoryEngine extends CoreEngine {
  constructor(storyData: Story) {
    super(storyData);
  }
}

export default StoryEngine;
