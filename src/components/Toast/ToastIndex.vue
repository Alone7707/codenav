<template>
  <transition>
    <div v-show="visible" class="win10-error-dialog">
      <transition name="bounce">
        <div v-if="visible" class="dialog-content">
          <div class="dialog-header">
            <span class="dialog-icon">{{ type === 'error' ? '⚠️' : '✅' }}</span>
            <span class="dialog-title">CodeNav.exe - {{ type }}</span>
          </div>
          <div class="dialog-body">
            <p>{{ message }}</p>
          </div>
          <div class="dialog-footer">
            <button @click="closeToast">确定</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 3000,
  },
  type: {
    type: String,
    default: 'error',
  }
})

const visible = ref(false)
const timer = ref<number | undefined>()

const show = () => {
  visible.value = true
  timer.value = setTimeout(() => {
    closeToast()
  }, props.duration)
}

const closeToast = () => {
  visible.value = false
  clearTimeout(timer.value)
}

onMounted(() => {
  show()
})

onUnmounted(() => {
  clearTimeout(timer.value)
})

// 暴露方法
defineExpose({ show, closeToast })
</script>

<style scoped>
.win10-error-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  padding: 10px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}

.dialog-icon {
  font-size: 20px;
  margin-right: 10px;
}

.dialog-title {
  font-weight: bold;
  color: #333333;
}

.dialog-body {
  padding: 20px;
  color: #333333;
}

.dialog-footer {
  padding: 10px;
  text-align: right;
  border-top: 1px solid #ccc;
}

button {
  padding: 5px 10px;
  background-color: #0078d7;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #005bb5;
}

.bounce-enter-active {
  animation: bounce-in 0.75s;
}

.bounce-leave-active {
  animation: bounce-in 0.75s reverse;
}

@keyframes bounce-in {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }

  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
</style>
