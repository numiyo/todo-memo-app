<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import { marked } from 'marked'
import { useToast } from '../composables/useToast.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  memo: { type: Object, required: true },
  // mode: edit 编辑模式 / view 只读预览模式
  mode: { type: String, default: 'edit' }
})
const emit = defineEmits(['update:visible', 'update-memo'])
const { showToast } = useToast()

const form = ref({ title: '', content: '', tags: '' })
const modalBoxRef = ref(null)

// 弹窗开关同步
watch(() => props.visible, (val) => {
  if (val) {
    // 打开弹窗时回填数据，标签转逗号字符串
    form.value.title = props.memo.title
    form.value.content = props.memo.content || ''
    form.value.tags = Array.isArray(props.memo.tags) ? props.memo.tags.join(', ') : ''
    // 自动聚焦弹窗以接收键盘事件
    setTimeout(() => modalBoxRef.value?.focus(), 50)
  }
}, { immediate: true })

// 关闭弹窗
const closeModal = () => {
  emit('update:visible', false)
}

// 仅编辑模式执行保存
const saveEdit = () => {
  const title = form.value.title.trim()
  if (!title) {
    showToast('标题不能为空', 'error')
    return
  }
  // 标签去空格、过滤空值
  const tagList = form.value.tags
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  // 携带原ID，后端自动更新修改时间
  emit('update-memo', {
    id: props.memo.id,
    title,
    content: form.value.content.trim(),
    tags: tagList
  })
  closeModal()
  showToast('笔记修改成功', 'success')
}

// ==== 全局键盘快捷键（弹窗打开时生效）====
const handleGlobalKeydown = (e) => {
  if (!props.visible) return

  if (e.key === 'Escape') {
    e.preventDefault()
    closeModal()
  } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !isViewMode.value) {
    e.preventDefault()
    saveEdit()
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    window.addEventListener('keydown', handleGlobalKeydown)
  } else {
    window.removeEventListener('keydown', handleGlobalKeydown)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const isViewMode = computed(() => props.mode === 'view')

// Markdown 渲染为 HTML（仅 view 模式使用）
const renderedHtml = computed(() => {
  const raw = form.value.content || ''
  return raw ? marked.parse(raw) : ''
})
</script>

<template>
  <div v-if="visible" class="modal-mask" @click="closeModal">
    <!-- 阻止冒泡，点击弹窗内部不关闭 -->
    <div class="modal-box" ref="modalBoxRef" tabindex="-1" @click.stop>
      <div class="modal-head">
        <h2>{{ isViewMode ? '笔记详情' : '编辑笔记' }}</h2>
        <button class="close-btn" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="modal-body">
        <!-- 标题输入/展示 -->
        <div class="form-item">
          <label>笔记标题</label>
          <input
            v-if="!isViewMode"
            v-model="form.title"
            class="form-input"
            placeholder="请输入标题"
          />
          <div v-else class="view-text">{{ form.title }}</div>
        </div>

        <!-- 标签输入/展示 -->
        <div class="form-item">
          <label>{{ isViewMode ? '标签' : '标签（逗号分隔）' }}</label>
          <input
            v-if="!isViewMode"
            v-model="form.tags"
            class="form-input"
            placeholder="工作, 生活, 灵感"
          />
          <div v-else class="view-tags">
            <span v-for="t in form.tags.split(',').map(s=>s.trim()).filter(s=>s)" :key="t" class="tag">#{{ t }}</span>
            <span v-if="!form.tags.trim()" class="empty-tag">无标签</span>
          </div>
        </div>

        <!-- 内容输入/展示（长文本滚动区域） -->
        <div class="form-item">
          <label>{{ isViewMode ? '笔记内容' : '笔记内容（支持Markdown）' }}</label>
          <textarea
            v-if="!isViewMode"
            v-model="form.content"
            class="form-textarea"
            rows="12"
            placeholder="在这里写笔记内容..."
          ></textarea>
          <div v-else class="view-content" v-html="renderedHtml"></div>
        </div>

        <!-- 创建&修改时间（仅展示） -->
        <div class="form-item time-row">
          <div class="time-text">创建时间：{{ memo.time }}</div>
          <div class="time-text" v-if="memo.updateTime">最后修改：{{ memo.updateTime }}</div>
        </div>
      </div>

      <!-- 底部按钮：预览模式无保存按钮 -->
      <div class="modal-foot" v-if="!isViewMode">
        <button class="btn-cancel" @click="closeModal">取消</button>
        <button class="btn-save" @click="saveEdit">保存修改</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: 20px;
}
.modal-box {
  width: min(90%, 860px);
  max-height: 88vh;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid var(--color-border-light);
}
.modal-head h2 {
  font-size: 20px;
  color: var(--color-heading);
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-muted);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover {
  background: var(--color-bg-button);
  color: var(--color-text);
}

.modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
}
.form-item {
  margin-bottom: 20px;
}
.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--color-heading);
}
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  background: var(--color-surface);
}
.form-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
}
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  resize: vertical;
  line-height: 1.6;
}
.form-textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
}

/* 只读预览样式 */
.view-text {
  padding: 12px 16px;
  background: var(--color-bg-sidebar);
  border-radius: var(--radius-sm);
  min-height: 48px;
  font-size: 15px;
}
.view-tags {
  padding: 12px 16px;
  background: var(--color-bg-sidebar);
  border-radius: var(--radius-sm);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.view-tags .tag {
  background: var(--color-tag-bg);
  color: var(--color-primary);
  font-size: 13px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}
.empty-tag {
  color: var(--color-muted);
  font-size: 14px;
}
.view-content {
  padding: 16px;
  background: var(--color-bg-sidebar);
  border-radius: var(--radius-sm);
  min-height: 220px;
  max-height: 400px;
  overflow-y: auto;
  line-height: 1.7;
  font-size: 14px;
  color: var(--color-text-secondary);
  word-break: break-word;
}
.view-content :deep(h1) { font-size: 1.6em; margin: 16px 0 8px; color: var(--color-heading); }
.view-content :deep(h2) { font-size: 1.35em; margin: 14px 0 6px; color: var(--color-heading); border-bottom: 1px solid var(--color-border-light); padding-bottom: 4px; }
.view-content :deep(h3) { font-size: 1.15em; margin: 12px 0 4px; color: var(--color-heading); }
.view-content :deep(p) { margin: 8px 0; }
.view-content :deep(ul), .view-content :deep(ol) { padding-left: 24px; margin: 8px 0; }
.view-content :deep(li) { margin: 4px 0; }
.view-content :deep(code) {
  background: var(--color-bg-button);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Consolas', 'Monaco', monospace;
}
.view-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  margin: 12px 0;
}
.view-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 13px;
}
.view-content :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  padding: 4px 14px;
  margin: 12px 0;
  color: var(--color-muted);
  background: rgba(79,70,229,0.04);
  border-radius: 0 8px 8px 0;
}
.view-content :deep(a) { color: var(--color-primary); }
.view-content :deep(hr) { border: none; border-top: 1px solid var(--color-border); margin: 16px 0; }
.view-content :deep(strong) { font-weight: 600; color: var(--color-heading); }
.view-content :deep(img) { max-width: 100%; border-radius: 8px; margin: 8px 0; }

.time-row {
  display: flex;
  gap: 24px;
  padding-top: 8px;
  border-top: 1px dashed var(--color-border-light);
}
.time-text {
  font-size: 13px;
  color: var(--color-muted);
}

.modal-foot {
  padding: 18px 28px;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}
.btn-cancel {
  padding: 10px 24px;
  border: 1px solid var(--color-border);
  background: transparent;
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-size: 14px;
}
.btn-save {
  padding: 10px 28px;
  background: var(--color-heading);
  color: white;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-size: 14px;
}
.btn-save:hover {
  opacity: 0.9;
}
</style>