<div align="center">

<img src="https://em-content.zobj.net/source/apple/391/tomato_1f345.png" width="80" alt="🍅" />

# 🍅 Pomodoro Timer

### 番茄钟 · 桌面应用

*Built with ❤️ as my first Claude Code experiment*

---

[![Made with Claude Code](https://img.shields.io/badge/Made%20with-Claude%20Code-8A2BE2?style=for-the-badge&logo=anthropic)](https://claude.ai/code)
[![Vue 3](https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## ✨ 这是什么？

这是一个**用 Claude Code 从零构建的番茄钟桌面应用**——全程由 AI 协作完成，没有手写一行代码。

> 🧪 **实验意图**：通过实战项目熟悉 Vue 3 + Electron 开发流程，为后续 Vue 前端项目做准备；同时体验 AI 驱动开发（Claude Code）的效率与边界。

---

## 🎯 功能一览

<table>
<tr>
<td width="50%">

### ⏱️ 核心功能
- 🍅 **25 分钟专注** / 🌿 **5 分钟休息** 自动循环
- ▶️ 开始 / ⏸️ 暂停 / 🔄 重置
- ⌨️ **快捷键**：`Space` 开始暂停、`R` 重置
- 🔔 阶段结束时**桌面系统通知**
- 🌈 完成点阵可视化

</td>
<td width="50%">

### 🎨 体验增强
- 🖼️ **SVG 发光进度环**：60 条刻度线 + 尾迹跟随环 + 双层发光滤镜
- ⏰ **紧迫模式**：工作最后 10% 进度环变红警告，动画加速
- 🌈 **主题色完成点阵**：透明度渐变，与当前主题完全协调
- 🎨 **5 套精调主题**：暗夜红 · 深海蓝 · 森林绿 · 落日橙 · 暖阳
- ⚙️ **自定义时长**：滑块 + 步进器 + 快捷预设
- 💾 设置自动持久化到 **localStorage**
- 🖥️ 窗口可自由缩放
- ✨ 弹性微交互：按钮回弹、tooltip 提示、卡片 hover 动画

</td>
</tr>
</table>

### 🎨 五套主题

| 暗夜红 | 深海蓝 | 森林绿 | 落日橙 | 暖阳 |
|:---:|:---:|:---:|:---:|:---:|
| `#e94560` | `#00d2ff` | `#00b894` | `#f39c12` | `#C65A4A` |
| 经典沉稳 | 冷静深邃 | 自然清新 | 温暖活力 | 柔和极简 |
| 🌙 | 🌊 | 🌿 | 🌅 | 🌤️ |

---

## 🛠️ 技术栈

```
 Vue 3 (Composition API)  ───  响应式 UI，SFC <script setup>
 Electron 43               ───  桌面窗口 + 系统通知
 Vite 8                    ───  极速 HMR 开发体验
 vite-plugin-electron      ───  Vite ↔ Electron 无缝集成
```

**架构亮点：**
- 🧩 **Composable 模式**：`useTimer` / `useSettings` / `useTheme` 将逻辑与 UI 彻底分离
- 🎨 **CSS 变量主题系统**：`data-theme` 属性切换，5 套主题零 JS 开销
- 💾 **localStorage 持久化**：设置与主题自动保存，刷新不丢
- 📦 **单一数据源**：主题元数据在 `useTheme.js` 统一定义，组件消费

---

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/Jian1202/pomodoro-timer.git
cd pomodoro-timer

# 2. 安装依赖
npm install

# 3. 启动开发模式
npm run dev
```

> ⚠️ 首次启动会自动下载 Electron 二进制文件（约 100MB），请耐心等待。

---

## 📁 项目结构

```
pomodoro/
├── electron/
│   ├── main.js            # Electron 主进程：窗口 & 通知
│   └── preload.js         # IPC 安全桥接
├── src/
│   ├── main.js            # Vue 入口
│   ├── App.vue            # 根组件：布局 + 键盘快捷键
│   ├── components/
│   │   ├── TimerDisplay.vue    # SVG 发光进度环
│   │   ├── TimerControls.vue   # 控制按钮
│   │   ├── SessionInfo.vue     # 阶段标签 + 完成点阵
│   │   └── SettingsPanel.vue   # 侧滑设置抽屉
│   ├── composables/
│   │   ├── useTimer.js         # 计时核心逻辑
│   │   ├── useSettings.js      # 时长设置 + 持久化
│   │   └── useTheme.js         # 主题管理 + 持久化
│   └── styles/
│       └── main.css            # 全局样式 + 5 套主题 CSS 变量
├── index.html
├── vite.config.js
└── package.json
```

---

## 🧪 实验心得

这是我和 Claude Code 协作完成的**第一个完整项目**。过程中的一些观察：

| ✅ 做得好的 | 🤔 待探索的 |
|---|---|
| 项目结构一次性规划清晰 | Electron 打包分发（`electron-builder` 配置） |
| Vue Composition API 零上手成本 | 自动化测试覆盖 |
| 主题系统 CSS 变量方案简洁优雅 | CI/CD 构建流水线 |
| 4 个 agent 并行 code review 质量高 | 更复杂的跨窗口状态同步 |
| UI 渐进式优化：刻度环、紧迫模式、弹性动效 | 番茄历史统计图表 |

---

<div align="center">

### 🏷️ *"This is just an experiment — a tiny Pomodoro timer built entirely with Claude Code as my first trial run. Flashy? Maybe. Fun? Absolutely."*

<br>

Made with 🍅 and ☕ · Jian1202 © 2026

</div>
