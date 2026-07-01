<script setup>
import { computed } from 'vue'

const props = defineProps({
  formattedTime: { type: String, required: true },
  progress: { type: Number, required: true },
  sessionType: { type: String, required: true },
  isRunning: { type: Boolean, default: false }
})

const radius = 140
const circumference = 2 * Math.PI * radius

const dashOffset = computed(() => circumference * (1 - props.progress))

const ringColor = computed(() =>
  props.sessionType === 'work' ? 'var(--color-work)' : 'var(--color-break)'
)
</script>

<template>
  <div class="timer-display">
    <svg class="progress-ring" viewBox="0 0 320 320">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle class="ring-bg"
        cx="160" cy="160" :r="radius"
        fill="none"
        stroke="var(--ring-bg)"
        stroke-width="10"
      />
      <circle class="ring-progress"
        cx="160" cy="160" :r="radius"
        fill="none"
        :stroke="ringColor"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :filter="isRunning ? 'url(#glow)' : 'none'"
        transform="rotate(-90 160 160)"
      />
    </svg>
    <div class="time-text" :class="{ paused: !isRunning }">
      {{ formattedTime }}
    </div>
  </div>
</template>

<style scoped>
.timer-display {
  position: relative;
  width: 320px; height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.progress-ring {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}

.ring-bg { opacity: 0.15; }

.ring-progress {
  transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
}

.time-text {
  font-size: 62px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 5px;
  color: var(--text-primary);
  transition: color 0.4s ease;
  z-index: 1;
}

.time-text.paused {
  opacity: 0.75;
}
</style>
