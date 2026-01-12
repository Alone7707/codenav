<script setup lang="ts">
import { computed, ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import type { UploadProps, UploadRawFile } from 'element-plus';
import useStore from '@/stores';
const userStore = useStore();
const props = defineProps<{
  modelValue: boolean,
  categoryId: number
}>()
const emit = defineEmits(['update:modelValue', 'success'])
const loading = ref<boolean>(false)
const visible = ref(computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  },
}))

const headers = computed(() => {
  return {
    Authorization: `Bearer ${userStore.token}`
  };
});

const uploadUrl = computed(() => {
  return `${import.meta.env.VITE_BASE_API}/api/oss/nav/upload?type=${props.categoryId}`
})

const handleBeforeClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  if (!rawFile.type.includes("image")) {
    ElMessage.error("请选择图片上传");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片最大暂时只支持 5MB!");
    return false;
  }
  loading.value = true;
  return true;
};

const onSuccess = (event: { code: number; message: string; data?: UploadRawFile }) => {
  if (event.code === 200) {
    ElMessage.success(event.message);
  } else {
    ElMessage.error(event.message);
  }
  loading.value = false;
  emit('success')
  visible.value = false;
};
</script>

<template>
  <div v-loading="loading" class="add-category">
    <el-dialog v-model="visible" title="添加背景图" width="500" :before-close="handleBeforeClose">
      <el-upload class="upload-demo" drag :action="uploadUrl" multiple :headers="headers" :before-upload="beforeUpload"
        :on-success="onSuccess">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传文件</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            <!-- jpg/png files with a size less than 500kb -->
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
