# 轻笔记

一个基于 Vue 3 + Vite 的轻量级笔记应用，数据存储在浏览器本地。

## 功能

- 创建、编辑、删除笔记，支持 Markdown 格式内容
- 标签分类管理，侧边栏按标签筛选
- 关键词搜索，支持标题和正文匹配，300ms 防抖
- 笔记列表按标签和关键词组合过滤
- JSON / Markdown 格式导出
- JSON 文件导入（批量）
- 数据自动持久化到 localStorage
- 编辑和详情双弹窗：点击卡片查看渲染后的 Markdown 内容，编辑按钮进入修改
- 键盘快捷键：Ctrl+Enter 提交，Escape 关闭弹窗
- 删除前确认对话框
- Toast 通知反馈（操作成功/失败提示）
- PWA 支持，可安装到桌面离线使用
- 响应式布局，适配移动端

## 技术栈

| 依赖 | 用途 |
|------|------|
| Vue 3.5 | 前端框架，Composition API + `<script setup>` |
| Vite 8 | 开发与构建工具 |
| Font Awesome 7 | 图标 |
| marked | Markdown 转 HTML 渲染 |
| vite-plugin-pwa | PWA 离线支持与 Service Worker |

## 快速开始

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## 项目结构

```
src/
├── main.js                    入口
├── App.vue                    根组件，整体布局
├── style.css                  全局样式与 CSS 自定义属性
├── composables/
│   ├── useMemos.js            笔记数据层：CRUD、持久化、导出导入
│   └── useToast.js            Toast 通知状态管理
└── components/
    ├── MemoModule.vue         笔记模块（表单 + 列表）
    ├── MemoForm.vue           新建笔记表单
    ├── MemoList.vue           笔记列表，含过滤与搜索防抖
    ├── MemoItem.vue           单条笔记卡片
    ├── MemoEditModal.vue      编辑/详情弹窗（双模式）
    ├── TagSidebar.vue         标签侧边栏
    ├── ConfirmDialog.vue      通用确认对话框
    ├── ToastContainer.vue     Toast 通知容器
    └── EmptyState.vue         空状态占位
```

## 数据格式

笔记对象结构：

```json
{
  "id": 1700000000000,
  "title": "笔记标题",
  "content": "Markdown 正文",
  "tags": ["工作", "灵感"],
  "time": "2024/1/1 12:00:00",
  "updateTime": "2024/1/2 08:30:00"
}
```

## 浏览器兼容

支持所有现代浏览器。需要 `localStorage` 可用。

## License

MIT
