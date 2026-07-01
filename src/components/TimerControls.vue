<script setup>
import { computed } from 'vue'

const props = defineProps({
  isRunning: { type: Boolean, default: false },
  isPristine: { type: Boolean, default: true }
})

const emit = defineEmits(['start', 'pause', 'reset'])

const primaryLabel = computed(() => {
  if (props.isRunning) return '⏸  暂停'
  if (props.isPristine) return '▶  开始'
  return '▶  继续'
})

const primaryAction = computed(() => props.isRunning ? 'pause' : 'start')

function handlePrimary() {
  emit(primaryAction.value)
}
</script>

<template>
  <div class="controls">
    <button class="btn btn-primary" @click="handlePrimary">
      {{ primaryLabel }}
    </button>
    <button
      class="btn btn-secondary"
      @click="emit('reset')"
      :disabled="isPristine && !isRunning"
    >
      ↻  重置
    </button>
  </div>
  <div class="hint-text">Space 开始/暂停 · R 重置</div>
</template>

<style scoped>
.controls {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 14px 40px;
  border: none;
  border-radius: 30px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  letter-spacing: 1.5px;
}

.btn:active { transform: scale(0.95); }

.btn-primary {
  background: var(--color-work);
  color: #fff;
  box-shadow: var(--btn-primary-shadow);
}

.btn-primary:hover {
  box-shadow: var(--btn-primary-shadow-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--text-secondary);
  border: 1px solid var(--btn-secondary-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--btn-hover-bg);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.hint-text {
  margin-top: 14px;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.5;
  letter-spacing: 1px;
}
</style>
