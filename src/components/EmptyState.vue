<script setup>
defineProps({
  message: { type: String, default: '暂无内容' }
})
</script>

<template>
  <div class="empty-state">
    <div class="icon">
      <i class="fa-regular fa-note-sticky"></i>
    </div>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: var(--color-muted);
}
.icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.empty-state p {
  font-size: 15px;
}
</style>
