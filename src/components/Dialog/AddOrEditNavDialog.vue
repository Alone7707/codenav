<script setup lang="ts">
import { addNav, editNav, getNavDetail } from '@/api/nav';
import { validateUrl } from '@/utils/validate';
import type { FormInstance } from 'element-plus';
import { computed, reactive, ref } from 'vue';

const props = defineProps<{
  modelValue: boolean
  id?: number
  type: 'add' | 'edit'
}>()
const emit = defineEmits(['update:modelValue', 'success'])
const loading = ref<boolean>(false)
const visible = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    ruleFormRef.value?.resetFields()
    emit('update:modelValue', newValue)
  }
})

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<{ id?: number, name: string, url: string, icon: string, parentId?: number }>({
  name: '',
  url: '',
  icon: '',
})
const validate = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请输入链接地址'))
  } else if (!validateUrl(value)) {
    callback(new Error("请输入正确的链接地址"))
  } else {
    callback()
  }
}
const rules = reactive({
  name: [
    { required: true, message: '请输入导航名称', trigger: 'blur' },
    { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' },
  ],
  url: [{ required: true, validator: validate, trigger: 'blur' }],
  icon: [
    { required: true, message: '请输入图标地址', trigger: 'blur' },
  ],
})

const handleOpen = () => {
  if (props.type === 'add') {
    ruleForm.parentId = props.id
  } else {
    ruleForm.id = props.id
    getDetail()
  }
}

const handleClose = () => {
  visible.value = false
}

const getDetail = () => {
  if (!props.id) return
  loading.value = true
  // 发起请求
  getNavDetail({ id: props.id }).then(res => {
    const { code, data } = res
    if (code === 200) {
      ruleForm.name = data.name
      ruleForm.url = data.url
      ruleForm.icon = data.icon || ''
      ruleForm.parentId = data.parent_id
    }
  }).finally(() => {
    loading.value = false
  })
}

const title = computed(() => {
  const navText = ruleForm.parentId ? '子导航' : '导航'
  return props.type === 'add' ? `新增${navText}` : `编辑${navText}`
})

const handleSubmit = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      // 发起请求
      if (props.type === 'add') {
        // 新增
        addNav(ruleForm).then(res => {
          const { code } = res
          if (code === 200) {
            emit('success')
            visible.value = false
            ElMessage.success('新增成功')
          }
        })
      } else {
        // 修改
        editNav(ruleForm).then(res => {
          const { code } = res
          if (code === 200) {
            emit('success')
            visible.value = false
            ElMessage.success('修改成功')
          }
        })
      }
    } else {
      console.log('error submit!!');
    }
  })
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="90%" style="max-width: 500px" @close="handleClose"
    @open="handleOpen">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" style="max-width: 420px;"
      class="demo-ruleForm" status-icon>
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="ruleForm.url" />
      </el-form-item>
      <el-form-item v-if="!ruleForm.parentId" label="图标" prop="icon">
        <el-input v-model="ruleForm.icon" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确认</el-button>
        <el-button type="danger" @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.demo-ruleForm {}

.dialog-footer {}
</style>
