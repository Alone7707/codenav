<script setup lang="ts">
import { delCategory, getBgcList, getCatList } from '@/api/nav';
import { type ReqBackground, type Background, type Category } from '@/interfaces/api';
import { Back, Plus } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import useStore from '@/stores';
import { storage } from '@/utils/storage';
import { useThemeStore } from '@/stores/theme';
import { setBackground } from '@/api/login';
import AddCategory from '@/components/Background/AddCategory.vue';
import UploadBackground from '@/components/Background/UploadBackground.vue';
const store = useStore()
const themeStore = useThemeStore()
const router = useRouter()
const loading = ref<boolean>(false)
const addCategoryShow = ref<boolean>(false)
const uploadShow = ref<boolean>(false)
const backgroundParams = reactive<ReqBackground>({
  type: 1,
  pageNum: 1,
  pageSize: 20
})
const categoryList = ref<Category[]>()
const backgroundList = ref<Background[]>()
const getCategory = () => {
  loading.value = true
  getCatList().then((res) => {
    const { data, code } = res
    if (code === 200) {
      categoryList.value = data
      if (data.length) {
        backgroundParams.type = data[0].id
        getBackground()
      }
    }
  })
    .finally(() => {
      loading.value = false
    })
}

const getBackground = () => {
  loading.value = true
  getBgcList(backgroundParams).then(res => {
    const { data, code } = res
    if (code === 200) {
      backgroundList.value = data.record
    }
  }).finally(() => {
    loading.value = false
  })
}

const goBack = () => {
  router.replace('/')
}

const handleClick = (tab: TabsPaneContext) => {
  const id = tab.props.name as number
  if (backgroundParams.type === id) return
  backgroundParams.type = id
  getBackground()
}

const applyBgc = (img: Background) => {
  if (store.token) {
    // 登录状态，接口保存到个人信息
    const id = img.id
    setBackground({ id }).then(async res => {
      const { code } = res
      if (code === 200) {
        themeStore.setBgcImg(img.url)
        storage.removeItem('userInfo')
        storage.setItem('background', img)
        await store.setUserInfo()
        callback()
      }
    })
  } else {
    // 走localStorage缓存
    storage.setItem('background', img)
    themeStore.setBgcImg(img.url)
    callback()
  }
}
const callback = () => {
  ElMessageBox.confirm(
    '应用成功，是否返回主页查看效果？',
    '操作提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      goBack()
    })
}

const handleAdd = () => {
  addCategoryShow.value = true
}

const handleRemove = (event: number) => {
  ElMessageBox.confirm(
    '确认删除该分类？',
    '操作提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    delCategory({
      id: event
    }).then(res => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('删除成功')
        getCategory()
      }
    })
  })
}

const handleUpload = () => {
  uploadShow.value = true
}

getCategory()
</script>

<template>
  <div class="nav-config-view">
    <div class="nav-header">
      <div class="nav-header-back" @click="goBack">
        <el-icon size="30">
          <Back />
        </el-icon>
      </div>
      <div class="nav-header-title">
        背景图配置
      </div>
      <div class="nav-header-back">
      </div>
    </div>
    <div v-loading="loading" class="nav-container">
      <el-tabs :model-value="backgroundParams.type" type="card" class="demo-tabs" tab-position="bottom" addable
        @tab-add="handleAdd" @tab-remove="handleRemove" @tab-click="handleClick">
        <el-tab-pane v-for="item in categoryList" :key="item.id" :label="item.name" :name="item.id"
          :closable="item.custom">
          <div class="nav-background-list">
            <div v-for="img in backgroundList" :key="img.id" class="polaroid">
              <img :src="img.url" :alt="item.name">
              <div class="caption">
                <div style="width: 70%;flex-shrink: 0;overflow: hidden;">{{ img.name.includes('/') ?
                  img.name.split('/')[img.name.split('/').length -
                  1] : img.name
                }}</div>
                <el-button type="primary" @click="applyBgc(img)">应用</el-button>
              </div>
            </div>
            <div v-if="item.custom" class="polaroid">
              <div class="add" @click="handleUpload">
                <el-icon color="var(--el-color-primary)" size="40">
                  <Plus />
                </el-icon>
              </div>
              <div class="caption">
                <span>添加背景图</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <add-category v-model="addCategoryShow" @success="getCategory"></add-category>
    <upload-background v-model="uploadShow" :categoryId="backgroundParams.type"
      @success="getBackground"></upload-background>
  </div>
</template>

<style lang="scss" scoped>
.nav-config-view {
  height: 100%;
  width: 100%;

  .nav-header {
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid var(--el-border-color);
    box-sizing: border-box;

    .nav-header-back {
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .nav-header-title {
      width: calc(100% - 50px);
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .nav-container {
    height: calc(100% - 50px);
    padding: 12px;
    box-sizing: border-box;

    .demo-tabs {
      height: 100%;

      .el-tab-pane {
        height: 100%;
      }

      .nav-background-list {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        gap: 24px;
        align-content: flex-start;
        flex-wrap: wrap;
        justify-content: start;

        .polaroid {
          width: 200px;
          flex-shrink: 0;
          height: 250px;
          background: #fff;
          padding: 15px 15px 60px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19);
          position: relative;
          transition: 0.3s all;

          &:hover {
            transform: scale(1.02);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border: 1px solid #eee;
          }

          .add {
            width: 100%;
            height: 100%;
            border: 1px solid #eee;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            &:hover {
              background-color: #eee;
            }

            &:active {
              background-color: #ddd;
            }
          }

          .caption {
            padding: 0 24px;
            position: absolute;
            bottom: 15px;
            left: 0;
            right: 0;
            text-align: center;
            font-family: 'PangMenZhengDao', cursive;
            color: #666;
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
