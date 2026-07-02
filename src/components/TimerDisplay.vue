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

const tickRadius = 130
const tickCircumference = 2 * Math.PI * tickRadius

const trailRadius = 150
const trailCircumference = 2 * Math.PI * trailRadius

const dashOffset = computed(() => circumference * (1 - props.progress))

const trailDashOffset = computed(() => {
  const trailProgress = Math.min(props.progress + 0.03, 1)
  return trailCircumference * (1 - trailProgress)
})

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

const textGlowVar = computed(() =>
  props.sessionType === 'work' ? 'var(--text-glow-work)' : 'var(--text-glow-break)'
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

      <!-- 刻度线：60 条短线 -->
      <circle class="ring-ticks"
        cx="160" cy="160" :r="tickRadius"
        fill="none"
        stroke="var(--ring-tick-color)"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="`2 ${tickCircumference / 60 - 2}`"
        transform="rotate(-90 160 160)"
      />

      <!-- 尾迹环（外圈跟随） -->
      <circle class="ring-trail"
        cx="160" cy="160" :r="trailRadius"
        fill="none"
        stroke="var(--ring-trail-bg)"
        stroke-width="3"
        stroke-linecap="round"
        :stroke-dasharray="trailCircumference"
        :stroke-dashoffset="trailDashOffset"
        :filter="isRunning ? 'url(#glow)' : 'none'"
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

    <div
      class="time-text"
      :class="{ paused: !isRunning }"
      :style="isRunning ? { '--text-glow': textGlowVar } : {}"
    >
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
  transition: transform 0.3s ease;
}

.timer-display:hover {
  transform: scale(1.02);
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ring-bg {
  opacity: 0.12;
}

.ring-ticks {
  opacity: 0.3;
}

.ring-trail {
  opacity: 0.4;
  transition: stroke-dashoffset 1.2s linear;
}

.ring-progress {
  transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
}

/* 运行时脉冲 */
.timer-display.running .ring-progress {
  animation: ringPulse 2s ease-in-out infinite;
}

/* 运行时文字发光呼吸 */
.timer-display.running .time-text {
  animation: textGlow 2s ease-in-out infinite;
}

/* 紧迫模式 */
.timer-display.urgent .ring-progress {
  animation: urgentPulse 0.8s ease-in-out infinite;
}

.timer-display.urgent .time-text {
  color: var(--ring-urgency-color);
  animation: urgentPulse 0.8s ease-in-out infinite;
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
