<script setup>
import { ref } from 'vue'
import { useMemos } from './composables/useMemos.js'
import { useToast } from './composables/useToast.js'
import TagSidebar from './components/TagSidebar.vue'
import MemoModule from './components/MemoModule.vue'

const {
  memos,
  allTags,
  currentTag,
  searchQuery,
  selectTag,
  clearTagFilter,
  addMemo,
  deleteMemo,
  updateMemo,
  exportData,
  importData
} = useMemos()

const { showToast } = useToast()

// 导入中状态
const importing = ref(false)

const handleImport = async () => {
  importing.value = true
  try {
    const count = await importData()
    showToast(`成功导入 ${count} 条笔记`, 'success')
  } catch (e) {
    if (e.message !== '取消选择') {
      showToast(e.message || '导入失败', 'error')
    }
  } finally {
    importing.value = false
  }
}
</script>

<template>
  <div class="app-container">
    <!-- 头部：标题 + 导出/导入按钮 -->
    <div class="app-header">
      <h1><i class="fa-solid fa-pen-to-square"></i> 轻笔记</h1>
      <div class="header-actions">
        <button
          @click="handleImport"
          class="export-btn"
          :disabled="importing"
        >
          <i class="fa-solid fa-file-import"></i>
          {{ importing ? '导入中...' : '导入JSON' }}
        </button>
        <button @click="exportData('json')" class="export-btn">
          <i class="fa-solid fa-file-export"></i> 导出JSON
        </button>
        <button @click="exportData('markdown')" class="export-btn">
          <i class="fa-solid fa-file-lines"></i> 导出MD
        </button>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-bar">
      <i class="fa-solid fa-search"></i>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜索笔记标题或内容..."
        class="search-input"
      />
      <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>

    <!-- 主内容：侧边栏 + 笔记模块 -->
    <div class="main-layout">
      <TagSidebar
        :tags="allTags"
        :current-tag="currentTag"
        @select-tag="selectTag"
        @clear-filter="clearTagFilter"
      />
      <MemoModule
        :memos="memos"
        :current-tag="currentTag"
        :search-query="searchQuery"
        @add-memo="addMemo"
        @delete-memo="deleteMemo"
        @update-memo="updateMemo"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 28px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 8px;
}
.app-header h1 {
  margin: 0;
  font-size: 24px;
  color: var(--color-heading);
  padding: 6px 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.export-btn {
  background: var(--color-bg-button);
  border: none;
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  color: var(--color-text);
}
.export-btn:hover:not(:disabled) {
  background: var(--color-border);
}
.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--color-bg-input);
  border-radius: var(--radius-pill);
  padding: 0 20px;
  margin-bottom: 28px;
  border: 1px solid transparent;
  transition: border-color 0.2s, background 0.2s;
}
.search-bar:focus-within {
  border-color: var(--color-border-focus);
  background: var(--color-surface);
}
.search-bar i {
  color: var(--color-muted);
  font-size: 14px;
}
.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 14px 14px;
  font-size: 14px;
  outline: none;
  color: var(--color-text);
}
.clear-search {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-muted);
  font-size: 16px;
  padding: 6px;
}
.clear-search:hover {
  color: var(--color-text-secondary);
}

.main-layout {
  display: flex;
  flex: 1;
  min-height: 500px;
  width: 100%;
  gap: 20px;
}
</style>