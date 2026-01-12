<script setup lang="ts">
import { addCategory } from '@/api/nav';
import type { FormInstance } from 'element-plus';
import { computed, ref } from 'vue';

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'success'])
const loading = ref(false)
const formRef = ref<FormInstance>()
const ruleForm = ref<{ name: string }>({
  name: ''
})

const rules = ref({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
  ],
})

const visible = ref(computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  },
}))

const handleBeforeClose = (done: () => void) => {
  formRef.value?.resetFields()
  done()
}

const submit = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      addCategory(ruleForm.value).then(res => {
        const { code } = res
        if (code === 200) {
          ElMessage.success('添加成功')
          emit('success')
          handleClose()
        }
      }).finally(() => {
        loading.value = false
      })
    } else {
      console.log('表单校验失败');

    }
  })
}

const handleClose = () => {
  formRef.value?.resetFields()
  visible.value = false
}
</script>

<template>
  <div class="add-category">
    <el-dialog v-model="visible" title="添加分类" width="500" :before-close="handleBeforeClose">
      <el-form ref="formRef" :model="ruleForm" :rules="rules" style="margin-top: 24px;" @submit.prevent="submit">
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
