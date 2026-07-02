<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { themeMeta, THEMES } from '../composables/useTheme.js'

const props = defineProps({
  workDuration: { type: Number, required: true },
  breakDuration: { type: Number, required: true },
  currentTheme: { type: String, default: 'crimson' }
})

const emit = defineEmits(['updateWork', 'updateBreak', 'applyPreset', 'close', 'nextTheme', 'setTheme'])

const isOpen = ref(false)

// 从 themeMeta 派生主题列表（单一数据源）
const themes = THEMES.map(id => ({
  id,
  name: themeMeta[id].name,
  color: themeMeta[id].work,
  bg: themeMeta[id].bg
}))

onMounted(() => {
  requestAnimationFrame(() => { isOpen.value = true })
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

function close() {
  isOpen.value = false
  setTimeout(() => emit('close'), 300)
}
</script>

<template>
  <div class="overlay" :class="{ open: isOpen }" @click.self="close">
    <div class="drawer" :class="{ open: isOpen }">
      <div class="drawer-header">
        <h2>⚙ 设置</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- 时长设置 -->
      <div class="section">
        <h3>⏱ 时长设置</h3>

        <div class="setting-row">
          <label>工作时间</label>
          <div class="stepper">
            <button @click="emit('updateWork', workDuration - 5)" :disabled="workDuration <= 5">−</button>
            <span class="stepper-value">{{ workDuration }} 分钟</span>
            <button @click="emit('updateWork', workDuration + 5)" :disabled="workDuration >= 60">+</button>
          </div>
          <input type="range" :value="workDuration" min="5" max="60" step="5"
            @change="emit('updateWork', Number($event.target.value))" class="slider" />
        </div>

        <div class="setting-row">
          <label>休息时间</label>
          <div class="stepper">
            <button @click="emit('updateBreak', breakDuration - 1)" :disabled="breakDuration <= 1">−</button>
            <span class="stepper-value">{{ breakDuration }} 分钟</span>
            <button @click="emit('updateBreak', breakDuration + 1)" :disabled="breakDuration >= 30">+</button>
          </div>
          <input type="range" :value="breakDuration" min="1" max="30" step="1"
            @change="emit('updateBreak', Number($event.target.value))" class="slider" />
        </div>
      </div>

      <!-- 预设 -->
      <div class="section">
        <h3>📦 快捷预设</h3>
        <div class="presets">
          <button class="preset-btn" @click="emit('applyPreset', 'classic')">
            🍅 经典<br><small>25 / 5</small>
          </button>
          <button class="preset-btn" @click="emit('applyPreset', 'sprint')">
            ⚡ 冲刺<br><small>45 / 10</small>
          </button>
          <button class="preset-btn" @click="emit('applyPreset', 'deep')">
            🧠 长耕<br><small>50 / 15</small>
          </button>
        </div>
      </div>

      <!-- 主题切换 -->
      <div class="section">
        <h3>🎨 主题切换</h3>
        <div class="theme-grid">
          <div
            v-for="t in themes"
            :key="t.id"
            class="theme-card"
            :class="{ active: currentTheme === t.id }"
            :style="{ '--dot-color': t.color, '--dot-bg': t.bg }"
            @click="emit('setTheme', t.id)"
            :title="t.name"
          >
            <span class="theme-dot"></span>
            <span class="theme-label">{{ t.name }}</span>
          </div>
        </div>
        <p class="hint">点 🎨 按钮快速切换</p>
      </div>

      <!-- 快捷键 -->
      <div class="section">
        <h3>⌨ 快捷键</h3>
        <div class="shortcut-list">
          <div class="shortcut"><kbd>Space</kbd> 开始 / 暂停</div>
          <div class="shortcut"><kbd>R</kbd> 重置计时</div>
          <div class="shortcut"><kbd>Esc</kbd> 关闭设置</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: var(--overlay-bg);
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.overlay.open { opacity: 1; }

.drawer {
  position: fixed;
  top: 0; right: 0;
  width: 300px; height: 100vh;
  background: var(--panel-bg);
  backdrop-filter: blur(20px);
  border-left: 1px solid var(--btn-secondary-border);
  box-shadow: -4px 0 40px rgba(0, 0, 0, 0.3);
  padding: 28px 24px;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 101;
}
.drawer.open { transform: translateX(0); }

.drawer-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 28px;
}
.drawer-header h2 { font-size: 18px; font-weight: 600; color: var(--text-primary); }
.close-btn {
  width: 32px; height: 32px;
  border: none; border-radius: 50%;
  background: var(--btn-secondary-bg);
  color: var(--text-secondary);
  font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover { background: var(--btn-hover-bg); color: var(--text-primary); }

.section { margin-bottom: 24px; }
.section h3 {
  font-size: 13px; font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 1px;
  margin-bottom: 14px;
}

.setting-row { margin-bottom: 18px; }
.setting-row label {
  display: block; font-size: 14px; font-weight: 500;
  color: var(--text-primary); margin-bottom: 8px;
}

.stepper { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.stepper button {
  width: 32px; height: 32px;
  border: 1px solid var(--btn-secondary-border);
  border-radius: 8px;
  background: var(--btn-secondary-bg);
  color: var(--text-primary);
  font-size: 18px; cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.stepper button:hover:not(:disabled) { background: var(--btn-hover-bg); }
.stepper button:disabled { opacity: 0.3; cursor: not-allowed; }
.stepper-value {
  font-size: 16px; font-weight: 600;
  font-variant-numeric: tabular-nums;
  min-width: 80px; text-align: center;
  color: var(--text-primary);
}

.slider {
  width: 100%; height: 4px;
  -webkit-appearance: none; appearance: none;
  border-radius: 2px; background: var(--ring-bg);
  outline: none; cursor: pointer;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--color-work);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.presets { display: flex; gap: 8px; }
.preset-btn {
  flex: 1; padding: 10px 6px;
  border: 1px solid var(--btn-secondary-border);
  border-radius: 10px;
  background: var(--btn-secondary-bg);
  color: var(--text-primary);
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.preset-btn:hover {
  background: var(--btn-hover-bg);
  border-color: var(--color-work);
  transform: translateY(-1px);
}
.preset-btn:active {
  transform: scale(0.95);
}
.preset-btn small { color: var(--text-secondary); font-size: 11px; }

.theme-grid { display: flex; gap: 10px; flex-wrap: wrap; }
.theme-card {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer; padding: 6px 4px; border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 50px;
}
.theme-card:hover {
  background: var(--btn-hover-bg);
  transform: translateY(-2px);
}
.theme-card:active {
  transform: scale(0.95);
}
.theme-card.active .theme-label { color: var(--text-primary); font-weight: 600; }
.theme-dot {
  display: block; width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--dot-color);
  box-shadow: 0 0 0 3px var(--dot-bg), inset 0 0 0 1px rgba(255,255,255,0.15);
  transition: all 0.25s;
}
.theme-card.active .theme-dot {
  box-shadow: 0 0 0 2px var(--dot-bg), 0 0 0 4px var(--dot-color);
  transform: scale(1.1);
}
.theme-label { font-size: 11px; color: var(--text-secondary); white-space: nowrap; transition: color 0.25s; }

.hint { margin-top: 8px; font-size: 12px; color: var(--text-secondary); opacity: 0.7; }

.shortcut-list { display: flex; flex-direction: column; gap: 8px; }
.shortcut { font-size: 13px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
kbd {
  padding: 2px 8px; border-radius: 4px;
  background: var(--btn-secondary-bg);
  border: 1px solid var(--btn-secondary-border);
  font-size: 11px; font-family: inherit;
  color: var(--text-primary);
  min-width: 48px; text-align: center;
}
</style>
