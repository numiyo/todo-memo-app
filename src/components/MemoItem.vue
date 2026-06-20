<script setup>
import { ref } from 'vue'
import MemoEditModal from './MemoEditModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
const props = defineProps({
  memo: { type: Object, required: true }
})
const emit = defineEmits(['delete-memo', 'update-memo'])
// 编辑弹窗
const showEditModal = ref(false)
// 只读详情弹窗
const showDetailModal = ref(false)
const showConfirm = ref(false)

const handleDelete = () => {
  emit('delete-memo', props.memo.id)
  showConfirm.value = false
}
// 点击卡片打开详情，排除编辑/删除按钮区域
const openDetail = (e) => {
  const target = e.target
  if (target.closest('.actions')) return
  showDetailModal.value = true
}
</script>
<template>
  <div class="memo-card" @click="openDetail">
    <div class="card-header">
      <h3>{{ memo.title }}</h3>
      <div class="actions">
        <button class="edit-btn" @click.stop="showEditModal = true" title="编辑笔记">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="delete-btn" @click.stop="showConfirm = true" title="删除笔记">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </div>
    <p class="content">{{ memo.content || '（无正文）' }}</p>
    <div class="tags" v-if="memo.tags && memo.tags.length">
      <span v-for="tag in memo.tags" :key="tag" class="tag">#{{ tag }}</span>
    </div>
    <div class="footer">
      <span class="time">{{ memo.time }}</span>
    </div>

    <!-- 编辑弹窗（可修改） -->
    <MemoEditModal
      v-model:visible="showEditModal"
      :memo="memo"
      mode="edit"
      @update-memo="emit('update-memo', $event)"
    />
    <!-- 详情弹窗（只读预览长内容） -->
    <MemoEditModal
      v-model:visible="showDetailModal"
      :memo="memo"
      mode="view"
    />
    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-model:visible="showConfirm"
      title="删除笔记"
      :message="`确定要删除「${memo.title}」吗？此操作不可撤销。`"
      confirm-text="删除"
      :danger="true"
      @confirm="handleDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>
<style scoped>
.memo-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 22px 24px 18px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border-light);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.memo-card:hover {
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-border);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--color-heading);
}
.actions {
  display: flex;
  gap: 2px;
}
.actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 6px;
  border-radius: 8px;
  transition: background 0.1s;
  color: var(--color-muted);
}
.actions button:hover {
  background: var(--color-bg-button);
  color: var(--color-text-secondary);
}
.actions .delete-btn:hover {
  color: #ef4444;
}
.content {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 12px 0 16px;
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}
.tag {
  background: var(--color-tag-bg);
  color: var(--color-primary);
  font-size: 12px;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
}
.footer {
  display: flex;
  justify-content: flex-end;
  font-size: 11px;
  color: var(--color-muted);
}
</style>