import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'pomodoro-theme'

const themeMeta = {
  crimson: { name: '暗夜红', icon: '🌙', work: '#e94560', break: '#2ed573', bg: '#1a1a2e' },
  ocean:   { name: '深海蓝', icon: '🌊', work: '#00d2ff', break: '#3a7bd5', bg: '#0f2027' },
  forest:  { name: '森林绿', icon: '🌿', work: '#00b894', break: '#a3cb38', bg: '#1a2e1a' },
  sunset:  { name: '落日橙', icon: '🌅', work: '#f39c12', break: '#8e44ad', bg: '#2c1810' },
  light:   { name: '暖阳',   icon: '🌤️', work: '#4A5FC6', break: '#6AAD8E', bg: '#F7F2EC' },
}

const THEMES = Object.keys(themeMeta)

export { themeMeta, THEMES }

export function useTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  const currentTheme = ref(THEMES.includes(saved) ? saved : 'crimson')

  const currentMeta = computed(() => themeMeta[currentTheme.value])

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme
  }

  applyTheme(currentTheme.value)

  watch(currentTheme, (theme) => {
    localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme)
  })

  function nextTheme() {
    const idx = THEMES.indexOf(currentTheme.value)
    currentTheme.value = THEMES[(idx + 1) % THEMES.length]
  }

  function setTheme(theme) {
    if (THEMES.includes(theme)) {
      currentTheme.value = theme
    }
  }

  return { currentTheme, currentMeta, nextTheme, setTheme }
}
