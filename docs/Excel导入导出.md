# Excel导入/导出

## 数据流

```
JSON（唯一存储） ←→ Excel（交换格式）

导出：Story JSON → 5个Array[][] → XLSX Sheet → .xlsx文件
导入：.xlsx文件 → XLSX Sheet → Array[][] → Story JSON
```

Excel只在导入/导出时存在，不与JSON同时维护

## Excel结构

```
Meta Sheet       - 故事元数据（ID、标题、作者）
Nodes Sheet      - 节点内容（文本、位置、图片路径）
Edges Sheet      - 连接关系（source、target、handles）
Choices Sheet    - 选项明细（文本、目标节点）
Variables Sheet  - 变量定义（类型、默认值）
```

## 使用方式

**导出**：Dashboard → Story卡片 → 点击"Excel"按钮  
**导入**：Dashboard → 点击"导入Excel"按钮 → 选择.xlsx文件

**批量编辑流程**：导出Excel → 批量修改文本 → 导入Excel → 编辑器调整连接

## 技术实现

**插件**：`shared/plugins/tools/ExcelExporterPlugin.ts`  
**依赖**：XLSX库（CDN加载，全局变量）  
**原因**：shared代码需跨环境运行（浏览器+Node.js），CDN避免打包问题
