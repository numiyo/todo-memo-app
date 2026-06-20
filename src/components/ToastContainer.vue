<script setup>
import { useToast } from '../composables/useToast.js'

const { toasts } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast-item"
          :class="'toast-' + t.type"
        >
          <i
            class="fa-solid"
            :class="{
              'fa-circle-check': t.type === 'success',
              'fa-circle-exclamation': t.type === 'error',
              'fa-circle-info': t.type === 'info'
            }"
          ></i>
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.toast-stack {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  max-width: 360px;
}

.toast-success { background: var(--color-success); }
.toast-error   { background: var(--color-error); }
.toast-info    { background: var(--color-info); }

.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
