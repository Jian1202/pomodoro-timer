# CLAUDE.md

此文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 命令

```
npm run dev       # 启动 Vite 开发服务器 + Electron 窗口（支持 HMR）
npm run build     # 生产构建 → dist/ + dist-electron/
npm run preview   # 本地预览生产构建
```

没有配置测试、代码检查、格式化或类型检查脚本。

## 架构

这是一个番茄钟桌面应用：**Vue 3（组合式 API）+ Electron + Vite**。全部源码约 1300 行纯 JavaScript——没有 TypeScript、没有路由、没有状态管理库、没有 CSS 框架。

### 进程模型

- **Electron 主进程**（`electron/main.js`）：创建 BrowserWindow（520×720），处理生命周期，注册桌面通知的 IPC 处理器。
- **预加载脚本**（`electron/preload.js`）：通过 `contextBridge` 暴露 `window.electronAPI.sendNotification(title, body)`。已启用 `contextIsolation: true`、`nodeIntegration: false`。
- **渲染进程**（`src/`）：标准 Vue 3 单页应用。开发时 Vite 在 `localhost:5173` 提供服务，Electron 加载该 URL；生产环境中 Electron 加载 `dist/index.html`。

### 状态管理（组合式函数）

所有有状态逻辑位于 `src/composables/` 下的三个组合式函数中，每个返回响应式 ref + 方法：

| 组合式函数 | 职责 | 持久化 |
|---|---|---|
| `useTimer(workSeconds, breakSeconds)` | 倒计时、开始/暂停/重置、自动切换工作↔休息、会话结束时发送桌面通知 | 无（临时的） |
| `useSettings()` | 工作/休息时长（5-60 / 1-30 分钟），三种预设（经典 25/5、冲刺 45/10、深度 50/15） | `localStorage` 键名 `pomodoro-settings` |
| `useTheme()` | 五种主题（crimson/ocean/forest/sunset/light），`nextTheme()` 循环切换 | `localStorage` 键名 `pomodoro-theme` |

`App.vue` 实例化所有三个组合式函数，持有全部状态。子组件通过 props 接收数据、通过 emit 上报事件——不存在跨组件的直接修改。

### 主题系统

主题在 `src/styles/main.css` 中通过 `data-theme` 属性选择器定义为 CSS 自定义属性块。切换主题只需设置 `document.documentElement.dataset.theme`——无需 JS 操作 DOM 样式。每个主题定义了约 15 个变量（背景渐变、文字颜色、工作/休息颜色、环形/发光、面板/按钮/遮罩/徽章/圆点颜色）。

### 组件树

```
App.vue
├── TimerDisplay.vue    # SVG 进度环（r=140，stroke-dashoffset 动画，运行时有发光滤镜）
├── TimerControls.vue   # 开始/暂停/继续 + 重置按钮，键盘快捷键提示文字
├── SessionInfo.vue     # 工作/休息徽章 + 完成圆点矩阵（最多 8 个点）
└── SettingsPanel.vue   # 滑出式抽屉（300px）：时长调节器、预设、主题选择器、快捷键参考
```

### 关键模式

- **组合式函数是工厂函数**：`useTimer(workSeconds, breakSeconds)` 接收计算属性 ref，以便响应设置变更。内部的侦听器会在时长变化时重置计时器。
- **计时器使用 `setInterval` 每秒 tick**；在 `onUnmounted` 中清理。`handleSessionEnd()` 自动在工作/休息之间切换并递增完成计数。
- **键盘快捷键**：空格键切换开始/暂停，R 键重置。当焦点位于 input/textarea/select 上时忽略（在 App.vue 的 `@keydown` 处理器中判断）。
- **SettingsPanel 动画**：使用 CSS 过渡 + `requestAnimationFrame` 实现滑入/滑出。Esc 键关闭。

### 构建管线

`vite.config.js` 配置了三个插件：`vue()` 处理 SFC 编译，`electron([{entry, vite}])` 构建主进程/预加载脚本（输出到 `dist-electron/`），`renderer()` 使浏览器上下文中可以访问 Electron API。
