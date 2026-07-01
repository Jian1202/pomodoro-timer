<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimer } from './composables/useTimer.js'
import { useSettings } from './composables/useSettings.js'
import { useTheme } from './composables/useTheme.js'
import SessionInfo from './components/SessionInfo.vue'
import TimerDisplay from './components/TimerDisplay.vue'
import TimerControls from './components/TimerControls.vue'
import SettingsPanel from './components/SettingsPanel.vue'

const settings = useSettings()
const workSeconds = computed(() => settings.workDuration.value * 60)
const breakSeconds = computed(() => settings.breakDuration.value * 60)

const theme = useTheme()

const {
  timeLeft,
  isRunning,
  sessionType,
  completedCount,
  formattedTime,
  progress,
  isPristine,
  start,
  pause,
  reset
} = useTimer(workSeconds, breakSeconds)

const showSettings = ref(false)

function onKeydown(e) {
  const tag = document.activeElement?.tagName
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
  if (e.code === 'Space') { e.preventDefault(); isRunning.value ? pause() : start() }
  if (e.code === 'KeyR') { e.preventDefault(); reset() }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="app-container">
    <div class="top-bar">
      <span class="top-left"></span>
      <span class="app-title">🍅 番茄钟</span>
      <span class="top-actions">
        <button class="icon-btn" @click="theme.nextTheme()" title="切换主题">
          {{ theme.currentMeta.value.icon }}
        </button>
        <button class="icon-btn" @click="showSettings = true" title="设置">
          ⚙
        </button>
      </span>
    </div>

    <SessionInfo :session-type="sessionType" :completed-count="completedCount" />

    <TimerDisplay
      :formatted-time="formattedTime"
      :progress="progress"
      :session-type="sessionType"
      :is-running="isRunning"
    />

    <TimerControls
      :is-running="isRunning"
      :is-pristine="isPristine"
      @start="start"
      @pause="pause"
      @reset="reset"
    />

    <SettingsPanel
      v-if="showSettings"
      :work-duration="settings.workDuration.value"
      :break-duration="settings.breakDuration.value"
      :current-theme="theme.currentTheme.value"
      @update-work="settings.updateWork"
      @update-break="settings.updateBreak"
      @apply-preset="settings.applyPreset"
      @next-theme="theme.nextTheme"
      @set-theme="theme.setTheme"
      @close="showSettings = false"
    />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px 24px 40px;
  user-select: none;
  -webkit-app-region: drag;
}

.top-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  -webkit-app-region: drag;
}

.app-title {
  font-size: 17px; font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 2px;
}

.top-actions {
  display: flex; gap: 6px;
  -webkit-app-region: no-drag;
}

.icon-btn {
  width: 36px; height: 36px;
  border: none; border-radius: 50%;
  background: var(--btn-secondary-bg);
  color: var(--text-secondary);
  font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s;
}
.icon-btn:hover {
  background: var(--btn-hover-bg);
  color: var(--text-primary);
  transform: scale(1.08);
}

button { -webkit-app-region: no-drag; }
.top-left { width: 80px; -webkit-app-region: drag; }
</style>
