<script setup>
defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: '确认操作' },
  message: { type: String, default: '确定要执行此操作吗？' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  danger: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="visible" class="dialog-overlay" @click.self="emit('cancel')">
        <div class="dialog-box" role="alertdialog" aria-modal="true">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="dialog-actions">
            <button class="cancel-btn" @click="emit('cancel')">{{ cancelText }}</button>
            <button
              class="confirm-btn"
              :class="{ danger }"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.dialog-box {
  background: white;
  padding: 28px 32px;
  border-radius: 20px;
  width: 400px;
  max-width: 92%;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
}

.dialog-box h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #0f172a;
}

.dialog-box p {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-actions button {
  padding: 8px 24px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.cancel-btn {
  background: #f1f5f9;
  color: #334155;
}
.cancel-btn:hover {
  background: #e2e8f0;
}

.confirm-btn {
  background: #0f172a;
  color: white;
}
.confirm-btn:hover {
  background: #1e293b;
}
.confirm-btn.danger {
  background: #ef4444;
}
.confirm-btn.danger:hover {
  background: #dc2626;
}

/* Transition */
.dialog-enter-active {
  transition: all 0.2s ease-out;
}
.dialog-leave-active {
  transition: all 0.15s ease-in;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-from .dialog-box,
.dialog-leave-to .dialog-box {
  transform: scale(0.95);
}
</style>
