<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import LoginDialog from './LoginDialog.vue'
import useStore from '@/stores'
import { onMounted, ref } from 'vue'
import type { UserInfo } from '@/interfaces/api'
import { useRouter } from 'vue-router'

const emit = defineEmits(['success'])
const store = useStore()
const router = useRouter()
const [loginVisible, loginToggle] = useToggle()
const userInfo = ref<null | UserInfo>()
const handleClick = (command: string) => {
  switch (command) {
    case 'userInfo':
      console.log('个人信息')
      break
    case 'navConfig':
      router.push('/navConfig')
      break
    case 'logout':
      ElMessageBox.confirm('是否确认退出登录？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          store.resetToken()
          ElMessage({
            type: 'success',
            message: '退出成功!',
          })
          emit('success')
        })
        .catch(() => { })
      break
  }
}
const handleSuccess = () => {
  userInfo.value = store.userInfo as UserInfo
  emit('success')
}
onMounted(() => {
  if (store.token) {
    userInfo.value = store.userInfo as UserInfo
  }
})
</script>

<template>
  <div class="account-control">
    <el-button v-if="!store.token" type="primary" @click="loginToggle(true)">登录</el-button>
    <template v-else>
      <div class="username">{{ userInfo?.username }}</div>
      <el-dropdown @command="handleClick">
        <el-image style="width: 36px; height: 36px; border-radius: 50%" :src="userInfo?.avatar" fit="cover" />
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item command="userInfo">个人信息</el-dropdown-item> -->
            <el-dropdown-item command="navConfig">导航配置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <login-dialog v-model="loginVisible" @success="handleSuccess"></login-dialog>
  </div>
</template>

<style lang="scss" scoped>
.account-control {
  position: fixed;
  top: 0;
  right: 0;
  padding: 12px 12px 12px 24px;
  border-bottom-left-radius: 12px;
  background-color: rgb(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  user-select: none;
  height: 60px;
  box-sizing: border-box;

  // &::before {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: -59px;
  //   border-bottom: 30px solid transparent;
  //   border-left: 30px solid transparent;
  //   border-top: 30px solid rgb(255, 255, 255, 0.3);
  //   border-right: 30px solid rgb(255, 255, 255, 0.3);
  // }

  .username {
    color: #fff;
  }
}

.explain-list {
  line-height: 40px;

  .explain-item {
    display: flex;
    align-items: center;
  }
}
</style>
