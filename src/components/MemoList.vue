<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import MemoItem from './MemoItem.vue'
import EmptyState from './EmptyState.vue'
const props = defineProps({
  memos: { type: Array, required: true },
  currentTag: { type: String, default: null },
  searchQuery: { type: String, default: '' }
})
const emit = defineEmits(['delete-memo', 'update-memo'])
// 防抖搜索关键词（300ms 延迟）
const debouncedQuery = ref(props.searchQuery || '')
let debounceTimer = null
watch(() => props.searchQuery, (newVal) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = (newVal || '').trim().toLowerCase()
  }, 300)
}, { immediate: true })
onUnmounted(() => {
  clearTimeout(debounceTimer)
})
// 合并过滤：标签 + 防抖后的搜索关键词
const filteredMemos = computed(() => {
  let result = props.memos || []
  // 按标签筛选
  if (props.currentTag) {
    result = result.filter(m =>
      m.tags && Array.isArray(m.tags) && m.tags.includes(props.currentTag)
    )
  }
  // 按搜索关键词筛选（标题或内容）
  if (debouncedQuery.value) {
    const q = debouncedQuery.value
    result = result.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.content && m.content.toLowerCase().includes(q))
    )
  }
  return result
})
</script>
<template>
  <div>
    <div v-if="filteredMemos.length === 0" class="empty-wrapper">
      <EmptyState :message="currentTag ? `没有「${currentTag}」标签的笔记` : '还没有笔记，添加一条吧！'" />
    </div>
    <div v-else class="memo-grid">
      <MemoItem
        v-for="memo in filteredMemos"
        :key="memo.id"
        :memo="memo"
        @delete-memo="emit('delete-memo', $event)"
        @update-memo="emit('update-memo', $event)"
      />
    </div>
  </div>
</template>
<style scoped>
.memo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}
.empty-wrapper {
  padding: 60px 0;
}
</style>