<script setup lang="ts">
import { validateEmail } from '@/utils/validate'
import { type FormInstance, type FormRules } from 'element-plus'
import { ref, computed, reactive, onUnmounted } from 'vue'
import Toast from '@/components/Toast/toast'
import { login, getCode, register } from '@/api/login'
import { encryptionPwd } from '@/utils/encryption'
import useStore from '@/stores/index'
interface LoginForm {
  username: string
  password: string
  passwordAgain: string
  email: string
  code: string
}

const props = defineProps<{
  modelValue: boolean
}>()
const store = useStore()
const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    formRef.value?.resetFields()
    emit('update:modelValue', newValue)
  },
})
const loading = ref<boolean>(false)
const formType = ref<'login' | 'register'>('login')
const formRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  passwordAgain: '',
  email: '',
  code: '',
})

const loginRule = ref<FormRules<LoginForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  passwordAgain: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: (rule, value) => value === loginForm.password, message: '两次输入密码不一致', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度为6位', trigger: 'blur' },
  ],
})

// 倒计时相关状态
const countdown = ref(0)
const countdownTimer = ref<number | null>(null)
/**
 * 发送验证码
 */
const sendCode = () => {
  console.log(1);

  if (countdown.value > 0) return

  // 这里可以添加邮箱格式验证
  if (!validateEmail(loginForm.email)) {
    return Toast.show({
      message: '请输入正确的邮箱地址',
      type: 'error',
    })
  }

  getCode({
    email: loginForm.email,
    type: 1
  }).then(res => {
    const { code } = res
    if (code === 200) {
      Toast.show({
        message: '验证码已发送，请查收',
        type: 'success',
      })
      countdown.value = 60
      countdownTimer.value = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0 && countdownTimer.value) {
          clearInterval(countdownTimer.value)
          countdownTimer.value = null
        }
      }, 1000)
    }
  })
  // 模拟发送验证码请求
  // 实际项目中这里应该调用发送验证码的API
  console.log(`向 ${loginForm.email} 发送验证码`)

  // 开始倒计时
}

const handleTabType = () => {
  formType.value = formType.value === 'login' ? 'register' : 'login'
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null // 添加这行确保清理
  }
})

/**
 * 登录
 */
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      if (formType.value === 'register') {
        register({ ...loginForm, password: encryptionPwd(loginForm.password) }).then(res => {
          const { code } = res
          if (code === 200) {
            ElMessage.success('注册成功！')
            formType.value = 'login'
          }
        }).finally(() => {
          loading.value = false
        })
      } else {
        login({
          username: loginForm.username,
          password: encryptionPwd(loginForm.password),
        })
          .then(async (res) => {
            const { code, data } = res
            if (code === 200) {
              store.setToken(data)
              ElMessage.success('登录成功')
              await store.setUserInfo()
              emit('success')
              visible.value = false
            }
          })
          .finally(() => {
            loading.value = false
          })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 关闭
 */
const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" :title="formType === 'login' ? '欢迎回来！' : '注册账号'" width="90%" style="max-width: 500px "
    class="custom-dialog" :before-close="() => (visible = false)">
    <div class="dialog-content">
      <div class="dialog-header">
        <h2>{{ formType }}</h2>
      </div>
      <el-form ref="formRef" :rules="loginRule" :model="loginForm" label-width="80">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入您的用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入您的密码" />
        </el-form-item>
        <template v-if="formType === 'register'">
          <el-form-item label="确认密码" prop="passwordAgain">
            <el-input v-model="loginForm.passwordAgain" type="password" placeholder="请输入您的密码" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入您的邮箱">
              <template #append>
                <el-button type="primary" :disabled="countdown > 0" @click="sendCode">
                  {{ countdown > 0 ? `${countdown}s后重试` : '发送验证码' }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="loginForm.code" placeholder="请输入验证码" />
          </el-form-item>
        </template>
      </el-form>
      <div class="form-tab" @click="handleTabType">{{ formType === 'login' ? '没有账号？点击注册' : '已有账号，前往登录' }}</div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="loading" round size="large" type="primary" class="confirm-btn"
          @click="handleSubmit(formRef)">
          {{ formType === 'login' ? '登录' : '注册' }}
        </el-button>
        <el-button class="cancel-btn" size="large" type="info" round @click="handleClose(formRef)">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.custom-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  .el-dialog__header {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    color: white;
    padding: 20px;
    margin: 0;

    .el-dialog__title {
      font-size: 24px;
      font-weight: bold;
    }
  }

  .el-dialog__body {
    padding: 20px;
  }

  .dialog-content {
    .dialog-header {
      text-align: center;
      margin-bottom: 20px;

      h2 {
        font-size: 22px;
        font-weight: bold;
        margin: 0;

        &::first-letter {
          font-size: 28px;
          text-transform: uppercase;
        }
      }

      p {
        font-size: 14px;
        color: #666;
        margin: 5px 0 0;
      }
    }

    .el-form-item {
      margin-bottom: 20px;

      .el-input {
        width: 100%;
      }
    }
  }

  .form-tab {
    float: right;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .dialog-footer {
    padding: 0 24px;
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    gap: 10%;

    .cancel-btn {
      width: 45%;
      border: none;
    }

    .confirm-btn {
      width: 45%;
      border: none;
    }
  }
}
</style>
