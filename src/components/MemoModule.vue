<script setup>
import MemoForm from './MemoForm.vue'
import MemoList from './MemoList.vue'
defineProps({
  memos: { type: Array, required: true },
  currentTag: { type: String, default: null },
  searchQuery: { type: String, default: '' }
})
const emit = defineEmits(['add-memo', 'delete-memo', 'update-memo'])
</script>
<template>
  <main class="main-content">
    <MemoForm @add-memo="emit('add-memo', $event)" />
    <MemoList
      :memos="memos"
      :current-tag="currentTag"
      :search-query="searchQuery"
      @delete-memo="emit('delete-memo', $event)"
      @update-memo="emit('update-memo', $event)"
    />
  </main>
</template>
<style scoped>
.main-content {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
  max-height: 85vh;
}
</style>