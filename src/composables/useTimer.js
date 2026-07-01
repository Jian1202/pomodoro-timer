import { ref, computed, watch, onUnmounted } from 'vue'

export function useTimer(workSeconds, breakSeconds) {
  const timeLeft = ref(workSeconds.value)
  const isRunning = ref(false)
  const sessionType = ref('work')
  const completedCount = ref(0)

  let intervalId = null

  const sessionDuration = computed(() =>
    sessionType.value === 'work' ? workSeconds.value : breakSeconds.value
  )

  const isPristine = computed(() =>
    !isRunning.value && timeLeft.value === sessionDuration.value
  )

  const formattedTime = computed(() => {
    const mins = Math.floor(timeLeft.value / 60)
    const secs = timeLeft.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  const progress = computed(() => timeLeft.value / sessionDuration.value)

  function notify(title, body) {
    if (window.electronAPI) {
      window.electronAPI.sendNotification(title, body)
    }
  }

  // 停止计时（单一入口）
  function stopTimer() {
    clearInterval(intervalId)
    intervalId = null
    isRunning.value = false
  }

  function handleSessionEnd() {
    stopTimer()
    if (sessionType.value === 'work') {
      completedCount.value++
      sessionType.value = 'break'
      timeLeft.value = breakSeconds.value
      notify('🍅 工作时间结束', '休息一下吧！')
    } else {
      sessionType.value = 'work'
      timeLeft.value = workSeconds.value
      notify('🔔 休息时间结束', '继续开始工作吧！')
    }
  }

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    intervalId = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) handleSessionEnd()
    }, 1000)
  }

  function pause() {
    if (!isRunning.value) return
    stopTimer()
  }

  function reset() {
    stopTimer()
    timeLeft.value = sessionDuration.value
  }

  watch([workSeconds, breakSeconds], () => {
    stopTimer()
    timeLeft.value = workSeconds.value
    sessionType.value = 'work'
  })

  onUnmounted(() => clearInterval(intervalId))

  return {
    timeLeft,
    isRunning,
    sessionType,
    completedCount,
    formattedTime,
    progress,
    sessionDuration,
    isPristine,
    start,
    pause,
    reset
  }
}
