import { ref, watch } from 'vue'

const STORAGE_KEY = 'pomodoro-settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return null
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

const PRESETS = {
  classic: [25, 5],
  sprint:  [45, 10],
  deep:    [50, 15],
}

export function useSettings() {
  const saved = loadSettings()

  const workDuration = ref(saved?.workDuration ?? 25)
  const breakDuration = ref(saved?.breakDuration ?? 5)

  watch([workDuration, breakDuration], () => {
    saveSettings({
      workDuration: workDuration.value,
      breakDuration: breakDuration.value
    })
  })

  function updateWork(minutes) {
    workDuration.value = Math.max(5, Math.min(60, minutes))
  }

  function updateBreak(minutes) {
    breakDuration.value = Math.max(1, Math.min(30, minutes))
  }

  function applyPreset(name) {
    const p = PRESETS[name]
    if (p) {
      [workDuration.value, breakDuration.value] = p
    }
  }

  return { workDuration, breakDuration, updateWork, updateBreak, applyPreset, PRESETS }
}
