<script setup>
import { computed } from 'vue'

const props = defineProps({
  sessionType: { type: String, required: true },
  completedCount: { type: Number, default: 0 }
})

const MAX_DOTS = 8

const filledDots = computed(() => {
  const mod = props.completedCount % MAX_DOTS
  return mod === 0 && props.completedCount > 0 ? MAX_DOTS : mod
})
</script>

<template>
  <div class="session-card">
    <div class="session-badge" :class="sessionType">
      {{ sessionType === 'work' ? '🔴 专注工作中' : '🟢 休息时间' }}
    </div>

    <div class="dot-row" v-if="completedCount > 0">
      <span
        v-for="i in MAX_DOTS"
        :key="i"
        class="dot"
        :class="{ filled: i <= filledDots }"
        :style="i <= filledDots ? { opacity: 0.25 + (i - 1) * 0.107 } : {}"
      ></span>
    </div>
    <div class="completed-info">
      今日已完成 <strong>{{ completedCount }}</strong> 个番茄
    </div>
  </div>
</template>

<style scoped>
.session-card {
  background: var(--btn-secondary-bg);
  border: 1px solid var(--btn-secondary-border);
  border-radius: 16px;
  padding: 16px 28px 12px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.session-card:hover {
  box-shadow: var(--card-shadow), 0 4px 24px rgba(0, 0, 0, 0.15);
}

.session-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 22px;
  border-radius: 22px;
  margin-bottom: 12px;
  transition: all 0.4s ease;
}

.session-badge.work {
  background: var(--badge-work-bg);
  color: var(--color-work);
}

.session-badge.break {
  background: var(--badge-break-bg);
  color: var(--color-break);
}

.dot-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--dot-empty);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dot.filled {
  background: var(--color-work);
}

.dot.filled:hover {
  transform: scale(1.4);
}

.completed-info {
  font-size: 13px;
  color: var(--text-secondary);
}

.completed-info strong {
  color: var(--text-primary);
  font-size: 15px;
}
</style>
