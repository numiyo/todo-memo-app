<script setup>
import { ref } from 'vue'
import MemoEditModal from './MemoEditModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
const props = defineProps({
  memo: { type: Object, required: true }
})
const emit = defineEmits(['delete-memo', 'update-memo'])
const showModal = ref(false)
const showConfirm = ref(false)
const handleDelete = () => {
  emit('delete-memo', props.memo.id)
  showConfirm.value = false
}
</script>
<template>
  <div class="memo-card">
    <div class="card-header">
      <h3>{{ memo.title }}</h3>
      <div class="actions">
        <button class="edit-btn" @click="showModal = true" title="编辑">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="delete-btn" @click="showConfirm = true" title="删除">
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
    <MemoEditModal
      v-model:visible="showModal"
      :memo="memo"
      @update-memo="emit('update-memo', $event)"
    />
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