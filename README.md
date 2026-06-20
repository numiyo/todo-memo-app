# 轻笔记 📝

轻量级笔记应用，基于 **Vue 3 + Vite** 构建。

## 功能

- ✏️ 创建 / 编辑 / 删除笔记
- 🏷 标签分类管理（侧边栏筛选）
- 🔍 实时搜索（标题 + 正文，带防抖）
- 💾 自动保存到浏览器本地存储
- 📤 导出 JSON / Markdown
- 📥 导入 JSON 笔记
- 📱 响应式设计（移动端适配）
- ⌨ 键盘快捷键（Ctrl+Enter 提交，Escape 关闭弹窗）
- 🔔 Toast 通知反馈
- 🛡 删除前确认对话框
- 📦 PWA 支持（可安装到桌面）

## 技术栈

- **Vue 3** — Composition API（`<script setup>`）
- **Vite** — 极速开发体验
- **Font Awesome 7** — 图标库
- **vite-plugin-pwa** — PWA 离线支持

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── App.vue                  # 应用根组件
├── main.js                  # 入口文件
├── style.css                # 全局样式 + CSS 设计令牌
├── composables/
│   ├── useMemos.js          # 笔记数据层（CRUD、持久化、导出导入）
│   └── useToast.js          # Toast 通知系统
└── components/
    ├── MemoModule.vue       # 笔记模块容器
    ├── MemoForm.vue         # 新建笔记表单
    ├── MemoList.vue         # 笔记列表（含过滤逻辑）
    ├── MemoItem.vue         # 笔记卡片
    ├── MemoEditModal.vue    # 编辑笔记弹窗
    ├── TagSidebar.vue       # 标签侧边栏
    ├── EmptyState.vue       # 空状态提示
    ├── ConfirmDialog.vue    # 确认对话框
    └── ToastContainer.vue   # Toast 通知容器
```

## License

MIT
