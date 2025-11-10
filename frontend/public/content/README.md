# 内容管理说明 / Content Management Guide

这个文件夹包含所有用于首页和声明页面的 Markdown 文档。

*This folder contains all Markdown documents used for the homepage and statement pages.*

## 文件说明 / File Descriptions

- `home.md` - 首页主要介绍文字
- `statement.md` - 重要声明和使用说明的完整内容
- `version.md` - 版本信息

*File descriptions:*
- `home.md` - Main introduction text for the homepage
- `statement.md` - Complete content of important notices and usage instructions
- `version.md` - Version information

## 如何编辑 / How to Edit

直接编辑对应的 `.md` 文件即可，页面会自动加载并渲染 Markdown 内容。

*Simply edit the corresponding `.md` file directly, and the page will automatically load and render the Markdown content.*

支持标准的 Markdown 语法：
- 标题（# ## ###）
- 粗体（**文字**）
- 斜体（*文字*）
- 列表
- 链接
- 代码块

*Supports standard Markdown syntax:*
- Headings (# ## ###)
- Bold (**text**)
- Italic (*text*)
- Lists
- Links
- Code blocks

## 注意事项 / Notes

- 修改后需要刷新浏览器才能看到更新
- 保持 Markdown 语法正确，否则可能渲染异常
- 如果需要添加新的内容页面，可以新建 `.md` 文件并在相应的 React 组件中引用

*Important notes:*
- You need to refresh the browser to see updates after modifications
- Keep Markdown syntax correct, otherwise rendering may be abnormal
- If you need to add new content pages, you can create new `.md` files and reference them in the corresponding React components
