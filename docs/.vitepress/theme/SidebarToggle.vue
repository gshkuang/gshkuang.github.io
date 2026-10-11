<script setup lang="ts">
import { onMounted, ref } from 'vue'

const KEY = 'docs.sidebar.hidden'
const hidden = ref(false)

function apply (v: boolean) {
  document.documentElement.classList.toggle('hide-sidebar', v)
}

onMounted(() => {
  // 用 try 兜住隐私模式下 localStorage 抛错的情况
  try {
    const v = localStorage.getItem(KEY) === '1'
    hidden.value = v
    apply(v)
  } catch (e) {
    hidden.value = false
  }
})

function toggle () {
  hidden.value = !hidden.value
  apply(hidden.value)
  try {
    localStorage.setItem(KEY, hidden.value ? '1' : '0')
  } catch (e) { /* 忽略 */ }
}
</script>

<template>
  <button
    class="SidebarToggle"
    type="button"
    :title="hidden ? '显示侧边导航' : '隐藏侧边导航'"
    :aria-expanded="!hidden"
    @click="toggle"
  >
    <svg class="icon" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="2.2" width="14" height="1.5" rx=".75" />
      <rect x="1" y="7.25" width="14" height="1.5" rx=".75" />
      <rect x="1" y="12.3" width="14" height="1.5" rx=".75" />
    </svg>
  </button>
</template>

<style scoped>
.SidebarToggle {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -4px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color .25s, background-color .25s;
}

.SidebarToggle:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
}

.SidebarToggle .icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* 移动端侧边栏本来就是抽屉，不需要这个按钮 */
@media (max-width: 959px) {
  .SidebarToggle {
    display: none;
  }
}
</style>
