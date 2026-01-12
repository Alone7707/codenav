<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';
import { Tickets, Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const themeStore = useThemeStore();
// 跳转到博客
const goBlog = () => {
  window.open('https://blog.a3-507.top/')
}
// 切换背景图
const goBgc = () => {
  router.push('/bgcConfig')
}
</script>

<template>
  <div class="control-index">
    <!-- 博客按钮 -->
    <el-tooltip class="box-item" content="Alone博客" placement="top">
      <el-button :icon="Tickets" circle @click="goBlog" />
    </el-tooltip>

    <!-- 切换背景图按钮 -->
    <el-tooltip class="box-item" content="切换背景" placement="top">
      <el-button :icon="Picture" circle @click="goBgc" />
    </el-tooltip>

    <!-- 主题切换开关 -->
    <el-switch v-model="themeStore.isDark" size="large"
      style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #ffac1c" active-text="🌙" inactive-text="☀️" />
  </div>
</template>

<style lang="scss" scoped>
.control-index {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
