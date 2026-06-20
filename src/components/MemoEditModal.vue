<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useToast } from '../composables/useToast.js'

const props = defineProps({
  visible: { type: Boolean, required: true },
  memo: { type: Object, default: null }
})
const emit = defineEmits(['update:visible', 'update-memo'])

const { showToast } = useToast()

const editData = ref({ title: '', content: '', tags: [] })

// 当 modal 打开时，填充编辑数据
watch(() => props.visible, (isVisible) => {
  if (isVisible && props.memo) {
    editData.value = { ...props.memo, tags: [...(props.memo.tags || [])] }
  }
})

// 使用 computed 双向绑定标签字符串（替代之前的 ref+watch）
const tagsStr = computed({
  get: () => {
    return Array.isArray(editData.value.tags) ? editData.value.tags.join(', ') : ''
  },
  set: (val) => {
    // 不直接修改，在 save 时解析
  }
})

// 存储标签输入的原始字符串
const tagsInput = ref('')
watch(() => tagsStr.value, (val) => {
  tagsInput.value = val
}, { immediate: true })

const save = () => {
  if (!editData.value.title.trim()) {
    showToast('标题不能为空', 'error')
    return
  }
  const tags = tagsInput.value
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  emit('update-memo', { ...editData.value, tags })
  emit('update:visible', false)
  showToast('笔记已更新', 'success')
}

const close = () => emit('update:visible', false)

// ==== 键盘快捷键 ====
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    save()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @keydown="handleKeydown" @click.self="close">
        <!-- 将键盘焦点给到弹窗以接收 keydown -->
        <div class="modal-box" tabindex="-1" ref="modalBox">
          <h2><i class="fa-solid fa-pen"></i> 编辑笔记</h2>
          <input v-model="editData.title" placeholder="标题" @keydown.stop />
          <textarea v-model="editData.content" placeholder="正文" @keydown.stop></textarea>
          <input v-model="tagsInput" placeholder="标签，用逗号分隔" @keydown.stop />
          <div class="modal-actions">
            <button @click="close">取消</button>
            <button @click="save" class="save-btn">保存修改</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(2px);
}
.modal-box {
  background: white;
  padding: 32px;
  border-radius: var(--radius-lg);
  width: 480px;
  max-width: 92%;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  outline: none;
}
.modal-box h2 {
  margin-top: 0;
  margin-bottom: 20px;
}
.modal-box input,
.modal-box textarea {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.15s;
}
.modal-box input:focus,
.modal-box textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
}
.modal-box textarea {
  min-height: 80px;
  resize: vertical;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
.modal-actions button {
  padding: 8px 24px;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}
.modal-actions button:first-child {
  background: var(--color-bg-button);
  color: var(--color-text-secondary);
}
.modal-actions button:first-child:hover {
  background: var(--color-border);
}
.modal-actions .save-btn {
  background: var(--color-heading);
  color: white;
}
.modal-actions .save-btn:hover {
  background: #1e293b;
}

/* Transition */
.modal-enter-active {
  transition: all 0.2s ease-out;
}
.modal-leave-active {
  transition: all 0.15s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.95);
}
</style>
