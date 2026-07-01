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
  <div class="session-badge" :class="sessionType">
    {{ sessionType === 'work' ? '🔴 专注工作中' : '🟢 休息时间' }}
  </div>

  <div class="dot-row" v-if="completedCount > 0">
    <span
      v-for="i in MAX_DOTS"
      :key="i"
      class="dot"
      :class="{ filled: i <= filledDots }"
    ></span>
  </div>
  <div class="completed-info">
    今日已完成 <strong>{{ completedCount }}</strong> 个番茄
  </div>
</template>

<style scoped>
.session-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 22px;
  border-radius: 22px;
  margin-bottom: 10px;
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
  margin-bottom: 6px;
}

.dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--dot-empty);
  transition: all 0.4s ease;
}

.dot.filled:nth-child(1) { background: #e94560; }
.dot.filled:nth-child(2) { background: #f0932b; }
.dot.filled:nth-child(3) { background: #f6e58d; }
.dot.filled:nth-child(4) { background: #a3cb38; }
.dot.filled:nth-child(5) { background: #00b894; }
.dot.filled:nth-child(6) { background: #00d2ff; }
.dot.filled:nth-child(7) { background: #3a7bd5; }
.dot.filled:nth-child(8) { background: #8e44ad; }

.completed-info {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}
.completed-info strong {
  color: var(--text-primary);
  font-size: 15px;
}
</style>
