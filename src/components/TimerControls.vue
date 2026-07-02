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
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.25s ease,
              background 0.25s ease;
  outline: none;
  letter-spacing: 1.5px;
}

.btn:active { transform: scale(0.92) !important; }

.btn-primary {
  background: var(--color-work);
  color: #fff;
  box-shadow: var(--btn-primary-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.15);
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
  margin-top: 18px;
  font-size: 11px;
  color: var(--text-secondary);
  opacity: 0.6;
  letter-spacing: 1px;
  background: var(--btn-secondary-bg);
  padding: 4px 14px;
  border-radius: 10px;
}
</style>
