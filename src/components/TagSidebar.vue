<script setup>
defineProps({
  tags: { type: Array, required: true },
  currentTag: { type: String, default: null }
})
const emit = defineEmits(['select-tag', 'clear-filter'])
</script>
<template>
  <aside class="sidebar">
    <nav>
      <div
        class="tag-item"
        :class="{ active: currentTag === null }"
        @click="emit('clear-filter')"
      >
        <i class="fa-solid fa-folder-open"></i> 全部笔记
      </div>
      <div
        v-for="tag in tags"
        :key="tag"
        class="tag-item"
        :class="{ active: currentTag === tag }"
        @click="emit('select-tag', tag)"
      >
        <i class="fa-solid fa-tag"></i> {{ tag }}
      </div>
    </nav>
    <div class="footer">
      <small>{{ tags.length }} 个标签</small>
    </div>
  </aside>
</template>
<style scoped>
.sidebar {
  width: 220px;
  min-width: 180px;
  background: var(--color-bg-sidebar);
  padding: 28px 20px;
  border-right: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 80vh;
}
.logo {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo i {
  font-size: 22px;
}
nav {
  flex: 1;
  overflow-y: auto;
}
.tag-item {
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.15s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}
.tag-item i {
  width: 20px;
  text-align: center;
}
.tag-item:hover {
  background: var(--color-bg-button);
}
.tag-item.active {
  background: var(--color-border);
  font-weight: 500;
  color: var(--color-heading);
}
.footer {
  margin-top: 28px;
  color: var(--color-muted);
  font-size: 12px;
  border-top: 1px solid var(--color-border-light);
  padding-top: 16px;
}
</style>