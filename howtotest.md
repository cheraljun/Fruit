# 测试指南

## ⚡ 快速开始（熟悉的用户）

```bash
# 1. 单元测试（最快，推荐日常使用）
cd frontend && npm run test

# 2. E2E测试（需要启动服务）
# 终端1：启动后端
cd backend && npm run dev

# 终端2：启动前端
cd frontend && npm run dev

# 终端3：运行E2E测试
cd frontend && npm run test:e2e:ui
```

---

## 📁 测试相关文件位置

```
mo/
├── frontend/
│   ├── tests/                     ← 所有测试文件在这里
│   │   ├── unit/                  ← 单元测试 ⭐
│   │   │   ├── CoreEngine.test.ts       ← 核心引擎测试
│   │   │   ├── PluginSystem.test.ts     ← 插件系统测试
│   │   │   ├── StoryAnalyzer.test.ts    ← 结构分析测试
│   │   │   ├── PlayerCore.test.ts       ← 播放器核心测试
│   │   │   ├── RuntimePlugin.test.ts    ← 变量系统测试
│   │   │   ├── ValidatorPlugin.test.ts  ← 验证器测试
│   │   │   ├── HTMLExporter.test.ts     ← 导出功能测试
│   │   │   └── README.md                ← 单元测试说明
│   │   │
│   │   └── e2e/                   ← E2E 测试（End-to-End 端到端测试）
│   │       ├── save.spec.ts             ← 保存功能测试
│   │       ├── performance.spec.ts      ← 性能压力测试
│   │       ├── player.spec.ts           ← 播放器测试
│   │       ├── export.spec.ts           ← 导出测试
│   │       └── editor-tools.spec.ts     ← 编辑器工具测试
│   │
│   ├── vitest.config.ts           ← Vitest 配置文件
│   ├── playwright.config.ts       ← Playwright 配置文件
│   ├── playwright-report/         ← 测试报告（运行后生成，可删除）
│   └── test-results/              ← 测试结果截图/录屏（运行后生成，可删除）
│
├── backend/
│   └── userdata/
│       └── test_user_*/           ← 测试产生的用户数据（可删除）
│
├── 测试图片.jpg                   ← 测试用图片（必需）
├── rm.cmd                         ← 清理脚本（清理测试文件 + 构建产物）
└── howtotest.md                   ← 本文档
```

---

## 🎯 目前的测试

### 1. 前端单元测试（`frontend/tests/unit/`）⭐ 

#### CoreEngine.test.ts - 核心引擎测试（25个测试）
- ✅ 创建引擎实例
- ✅ start() 找到开始节点
- ✅ makeChoice() 正确跳转
- ✅ goBack() 回退功能
- ✅ jumpToNode() 直接跳转
- ✅ save/load 存档功能
- ✅ 事件系统触发

#### PluginSystem.test.ts - 插件系统测试（17个测试）
- ✅ 注册/卸载插件
- ✅ 依赖管理
- ✅ 冲突检测
- ✅ 互斥规则（theme/enhance）
- ✅ 钩子系统
- ✅ 启用/禁用插件

#### StoryAnalyzer.test.ts - 结构分析测试（13个测试）
- ✅ 计算节点深度
- ✅ 识别关键决策点
- ✅ 计算入度/出度
- ✅ 检测循环
- ✅ 可达性分析
- ✅ 识别结局节点

#### PlayerCore.test.ts - 播放器核心测试（17个测试）
- ✅ 初始化游戏
- ✅ 做出选择
- ✅ 消息历史
- ✅ 回调函数
- ✅ 存档功能（3个槽位）
- ✅ 加载/重启

#### RuntimePlugin.test.ts - 变量系统测试（23个测试）
- ✅ 变量存储（set/get）
- ✅ 嵌套路径访问
- ✅ 模板替换（{{$vars.xxx}}）
- ✅ 三元运算符
- ✅ 辅助函数（random, clamp, max, min）
- ✅ 数据持久化（save/load钩子）
- ✅ 表达式计算
- ✅ 边界情况处理

#### ValidatorPlugin.test.ts - 验证器测试（9个测试）
- ✅ 完整故事验证
- ✅ 检测缺少开始节点
- ✅ 检测孤立节点
- ✅ 检测未连接选项
- ✅ 检测缺少结局
- ✅ 多结局故事验证
- ✅ 循环故事验证

#### HTMLExporter.test.ts - 导出测试（4个测试）
- ✅ 加载模板
- ✅ 导出HTML
- ✅ 注入故事数据
- ✅ 错误处理

**前端单元测试总计：108个测试**

---

### 2. 前端 E2E 测试（`frontend/tests/e2e/`）

#### save.spec.ts - 保存功能测试（7个场景）
- **场景1**：编辑节点文本 → 点保存 → 刷新 → 数据还在 ✅
- **场景2**：编辑节点 → 关闭面板 → 内存同步 → 刷新 → 数据丢失 ✅
- **场景3**：编辑节点 → 不保存直接刷新 → 数据丢失 ✅
- **场景4**：编辑节点 → 关闭面板 → 点保存 → 刷新 → 数据还在 ✅
- **场景5**：面板打开 → 点保存 → 刷新 → 数据还在 ✅
- **场景6**：上传图片 → 点保存 → 刷新 → 图片还在 ✅
- **场景7**：编辑故事标题 → 等待2秒 → 自动保存 → 刷新验证 ✅

#### performance.spec.ts - 性能压力测试（3个测试）
- **测试1-1**：100 个节点 - 快速创建 → 保存 → 加载 ⚡
- **测试1-2**：1000 个节点 - 大规模测试 → 保存 → 加载 🔥 **(默认跳过)**
- **测试2**：同一节点上传5次图片 → 保存 → 验证 📸

#### export.spec.ts - 导出测试（2个场景）⭐ NEW!
- **场景1**：导出HTML文件 ✅
- **场景2**：验证导出数据完整性 ✅

#### editor-tools.spec.ts - 编辑器工具测试（3个场景）⭐ NEW!
- **场景1**：验证器检测未连接选项 ✅
- **场景2**：自动布局功能 ✅
- **场景3**：撤销/重做功能（仅删除节点支持） ✅

**E2E测试总计：15个测试**

---

## 📊 测试覆盖统计

| 类型 | 数量 | 耗时 | 覆盖模块 |
|------|------|------|---------|
| **前端单元测试** | 108个 | 1-2秒 | 核心引擎、插件系统、变量系统、播放器核心、验证器、导出 |
| **E2E测试** | 15个 | 3-5分钟 | 编辑器保存、性能、导出、工具 |
| **总计** | **123个测试** | **<10分钟** | **核心功能全覆盖** |

**说明**：后端只是简单的文件读写API，核心逻辑都在前端，因此不需要后端测试。

---

## 🚀 从零开始运行测试

### 第一步：安装依赖（只需做一次）

**重要**：以下命令必须在对应目录里运行！

```bash
# 1. 进入项目根目录
cd C:\Users\Administrator\Desktop\mo

# 2. 安装后端依赖
cd backend
npm install

# 3. 安装前端依赖（回到根目录再进入 frontend）
cd ..
cd frontend
npm install

# 4. 安装 Playwright 浏览器（必须在 frontend 目录里，用于E2E测试）
npx playwright install
```

**注意**：
- `npx playwright install` 必须在 `frontend/` 目录执行，不能在根目录！
- 根目录需要有 `测试图片.jpg`（用于E2E图片上传测试）
- 单元测试不需要额外安装，`npm install` 就会自动安装 Vitest

---

### 第二步：启动服务（每次测试前）

打开**两个终端**：

**终端1 - 启动后端**
```bash
cd backend
npm run dev
```

**终端2 - 启动前端**
```bash
cd frontend
npm run dev
```

等待两个服务都启动完成（前端显示 `http://localhost:5173`）

---

### 第三步：运行测试

#### A. 单元测试（不需要启动服务，最快）⭐

```bash
cd frontend

# 方式1：交互模式（推荐，自动监听文件变化）
npm run test

# 方式2：UI模式（可视化界面，最直观）
npm run test:ui

# 方式3：运行一次（CI/CD用）
npm run test:run
```

**特点**：
- ⚡ 超快：71个测试在1-2秒内完成
- 🔄 自动监听：修改代码自动重新测试
- 🎨 可视化：`npm run test:ui` 打开浏览器界面

---

#### B. E2E测试（需要启动前后端服务）

打开**三个终端**：

**终端1 - 启动后端**
```bash
cd backend
npm run dev
```

**终端2 - 启动前端**
```bash
cd frontend
npm run dev
```

**终端3 - 运行E2E测试**

```bash
cd frontend

# 方式1：UI 模式（推荐，可视化调试）
npm run test:e2e:ui

# 方式2：命令行模式（快速验证）
npm run test:e2e

# 方式3：调试模式（单步执行）
npm run test:e2e:debug
```

---

## 🧹 清理测试产生的文件

### 方式1：一键清理（推荐）

双击根目录的 `rm.cmd`，会自动清理：
- ✅ 测试报告（`playwright-report/`）
- ✅ 测试结果（`test-results/`）
- ✅ 测试用户数据（`backend/userdata/test_user_*`）
- ✅ Playwright 缓存
- ✅ 构建产物和 node_modules（通过 `rm.py`）

### 方式2：只清理测试文件（不删构建产物）

```bash
# 手动删除测试产生的文件
rmdir /s /q frontend\playwright-report
rmdir /s /q frontend\test-results
for /d %D in (backend\userdata\test_user_*) do rmdir /s /q "%D"
```

---

## 📝 测试说明

### 为什么要点两次保存？

由于 React 状态更新是异步的，第一次保存时可能保存的是旧数据，**点两次保存**确保数据正确同步。这是已知的设计特性，不是 bug。

### 测试用户账号

- 用户名：`2222`
- 密码：`2222`

测试会自动登录这个账号，每次测试都会创建新作品，测试完不会影响真实数据。

---

## 🔧 常见问题

### Q1：测试卡住不动？
**A**：检查后端是否运行（`cd backend && npm run dev`）

### Q2：测试失败怎么办？
**A**：
1. 查看 `frontend/test-results/` 里的截图/录屏
2. 用 `npm run test:e2e:ui` 可视化调试
3. 用 `npm run test:e2e:debug` 单步执行

### Q3：如何只运行某一个测试？
**A**：
```bash
cd frontend
npm run test:e2e:ui save.spec.ts            # 功能测试（快，推荐日常使用）
npm run test:e2e:ui performance.spec.ts     # 性能测试（中等速度）
npm run test:e2e -- -g "场景1"              # 只运行包含"场景1"的测试
```

### Q4：各种测试要跑多久？
**A**：

**前端单元测试**：⭐ **推荐日常使用**
- 108个测试，总共约 **1-2秒** ⚡⚡⚡
- 包含：CoreEngine(25), PluginSystem(17), StoryAnalyzer(13), PlayerCore(17), RuntimePlugin(23), ValidatorPlugin(9), HTMLExporter(4)

**E2E测试**：
- save.spec.ts: 7个场景（1-2分钟）
- performance.spec.ts: 3个测试（30秒-5分钟）
- export.spec.ts: 2个场景（30秒）
- editor-tools.spec.ts: 3个场景（1-2分钟）
- **总计：15个E2E测试，约3-5分钟**

### Q5：我应该运行哪个测试？
**A**：

**日常开发（修改代码后）**：
```bash
cd frontend && npm run test        # 108个单元测试（1-2秒）⭐ 最快
```

**功能验证（修改UI后）**：
```bash
cd frontend && npm run test:e2e:ui # 22个E2E测试（3-5分钟）
```

**发布前完整验证**：
```bash
cd frontend && npm run test:run    # 单元测试（1-2秒）
cd frontend && npm run test:e2e    # E2E测试（3-5分钟）

# 总共：123个测试，约 5分钟
```

---

## 📚 测试类型说明

### 单元测试 vs E2E测试

| 特性 | 单元测试 | E2E测试 |
|------|---------|---------|
| **速度** | ⚡⚡⚡ 1-2秒 | 🐢 2-5分钟 |
| **工具** | Vitest | Playwright |
| **测试内容** | 单个函数/类 | 完整用户流程 |
| **是否需要浏览器** | ❌ 不需要 | ✅ 需要真实浏览器 |
| **是否需要启动服务** | ❌ 不需要 | ✅ 需要前后端 |
| **日常使用** | ✅ 推荐 | ⚠️ 发布前 |
| **文件位置** | `tests/unit/` | `tests/e2e/` |

**建议**：
- 日常开发用单元测试（快速反馈）
- 发布前跑E2E测试（完整验证）

---

## 📚 扩展阅读

- **Vitest 官方文档** - https://vitest.dev/
- **Playwright 官方文档** - https://playwright.dev/
- **`frontend/tests/unit/`** - 单元测试示例
- **`frontend/tests/e2e/`** - E2E测试示例

---

**✅ 108个单元测试 + 15个E2E测试 = 123个测试全面覆盖！** 🎉

---

## 🎯 测试命令速查

```bash
cd frontend

# 单元测试（108个，1-2秒）⭐ 日常使用
npm run test           # 交互模式，自动监听
npm run test:ui        # 可视化界面（推荐）
npm run test:run       # 运行一次

# E2E测试（22个，3-5分钟）
npm run test:e2e       # 命令行模式
npm run test:e2e:ui    # 可视化界面（推荐）
```

**说明**：所有核心逻辑都在前端，后端只是简单的文件读写API，不需要单独测试。

