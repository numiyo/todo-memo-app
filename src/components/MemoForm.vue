<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast.js'
const emit = defineEmits(['add-memo'])
const { showToast } = useToast()
const newMemo = ref({ title: '', content: '', tags: '' })
const submit = () => {
  const title = newMemo.value.title.trim()
  if (!title) {
    showToast('请填写笔记标题', 'error')
    return
  }
  const tags = newMemo.value.tags
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  emit('add-memo', {
    title,
    content: newMemo.value.content.trim(),
    tags
  })
  newMemo.value = { title: '', content: '', tags: '' }
  showToast('笔记已添加', 'success')
}
// 键盘快捷键：Ctrl+Enter 提交
const handleKeydown = (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    submit()
  }
}
</script>
<template>
  <div class="memo-form" @keydown="handleKeydown">
    <div class="form-row">
      <input
        v-model="newMemo.title"
        placeholder="笔记标题（必填）"
        class="title-input"
        autofocus
      />
      <input
        v-model="newMemo.tags"
        placeholder="标签，用逗号分隔（如：工作, 灵感）"
        class="tag-input"
      />
    </div>
    <textarea
      v-model="newMemo.content"
      placeholder="写点什么……（支持 Markdown 风格）"
      rows="3"
    ></textarea>
    <button @click="submit">
      <i class="fa-solid fa-plus"></i> 添加笔记
    </button>
    <span class="shortcut-hint">Ctrl + Enter 快速提交</span>
  </div>
</template>
<style scoped>
.memo-form {
  background: var(--color-bg-form);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 32px;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}
.title-input { flex: 2; min-width: 120px; }
.tag-input { flex: 1; min-width: 100px; }
.memo-form input,
.memo-form textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  background: var(--color-surface);
  transition: border-color 0.15s;
  font-family: inherit;
  color: var(--color-text);
}
.memo-form input:focus,
.memo-form textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
}
.memo-form textarea {
  resize: vertical;
  min-height: 70px;
}
.memo-form button {
  margin-top: 16px;
  padding: 12px 32px;
  background: var(--color-heading);
  color: white;
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.memo-form button:hover {
  background: #1e293b;
}

.shortcut-hint {
  display: inline-block;
  margin-left: 12px;
  font-size: 12px;
  color: var(--color-muted);
}
</style>