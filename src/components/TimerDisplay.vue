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

// 12 条钟面刻度（模拟时钟），内圈 r=130
const tickRadius = 130
const tickCircumference = 2 * Math.PI * tickRadius
const TICK_COUNT = 12

const dashOffset = computed(() => circumference * (1 - props.progress))

const ringColor = computed(() =>
  props.sessionType === 'work' ? 'var(--color-work)' : 'var(--color-break)'
)

// 紧迫模式：工作时段最后 10%
const isUrgent = computed(() =>
  props.sessionType === 'work' && props.isRunning && props.progress < 0.1
)

const currentRingColor = computed(() =>
  isUrgent.value ? 'var(--ring-urgency-color)' : ringColor.value
)
</script>

<template>
  <div
    class="timer-display"
    :class="{ running: isRunning, urgent: isUrgent }"
  >
    <svg class="progress-ring" viewBox="0 0 320 320">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- 背景轨道 -->
      <circle class="ring-bg"
        cx="160" cy="160" :r="radius"
        fill="none"
        stroke="var(--ring-bg)"
        stroke-width="10"
      />

      <!-- 12 条钟面刻度 -->
      <circle class="ring-ticks"
        cx="160" cy="160" :r="tickRadius"
        fill="none"
        stroke="var(--ring-tick-color)"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="`3 ${tickCircumference / TICK_COUNT - 3}`"
        transform="rotate(-90 160 160)"
      />

      <!-- 进度环 -->
      <circle class="ring-progress"
        cx="160" cy="160" :r="radius"
        fill="none"
        :stroke="currentRingColor"
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
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ring-bg {
  opacity: 0.1;
}

.ring-ticks {
  opacity: 0.25;
}

.ring-progress {
  transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
}

/* 运行时：仅进度环呼吸，不动文字 */
.timer-display.running .ring-progress {
  animation: ringPulse 2s ease-in-out infinite;
}

/* 紧迫模式：环 + 文字同步加速 */
.timer-display.urgent .ring-progress {
  animation: urgentPulse 0.8s ease-in-out infinite;
}

.timer-display.urgent .time-text {
  color: var(--ring-urgency-color);
}

.time-text {
  font-size: 62px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  letter-spacing: 0.08em;
  color: var(--text-primary);
  transition: color 0.4s ease;
  z-index: 1;
}

.time-text.paused {
  opacity: 0.6;
}
</style>
