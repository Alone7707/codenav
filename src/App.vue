<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import useStore from './stores';
const store = useStore()
const keepAliveList = ref(store.keepAliveList)
const include = computed(() => {
  return keepAliveList.value.toString()
})
</script>

<template>
  <div id="app-root">
    <transition name="fade" mode="out-in">
      <router-view v-slot="{ Component }">
        <KeepAlive :include="include">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
