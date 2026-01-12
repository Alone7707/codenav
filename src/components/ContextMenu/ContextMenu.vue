<template>
  <div
    v-if="visible"
    class="context-menu"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
  >
    <ul>
      <li v-for="(item, index) in menuItems" :key="index" @click="handleClick(item)">
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface MenuItem {
  label: string
  action: () => void
}

defineProps<{
  menuItems: MenuItem[]
}>()

const visible = ref(false)
const position = ref({ x: 0, y: 0 })

const showMenu = (event: MouseEvent) => {
  event.preventDefault()
  visible.value = true
  position.value = { x: event.clientX, y: event.clientY }
}

const hideMenu = () => {
  visible.value = false
}

const handleClick = (item: MenuItem) => {
  item.action()
  hideMenu()
}

// 监听全局点击事件，点击外部时隐藏菜单
onMounted(() => {
  document.addEventListener('click', hideMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', hideMenu)
})

// 暴露 showMenu 方法，供父组件调用
defineExpose({
  showMenu,
})
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 8px 0;
  min-width: 150px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      color: var(--el-input-text-color);

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
