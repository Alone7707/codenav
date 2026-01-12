<script setup lang="ts">
import { delNav, getNavList } from '@/api/nav';
import type { Nav } from '@/interfaces/api';
import { Back, Plus } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AddOrEditNavDialog from '@/components/Dialog/AddOrEditNavDialog.vue';

const router = useRouter()
const loading = ref<boolean>(false)
const navContainerRef = ref<HTMLDivElement>()
const cardHeight = ref<number>()
const navList = ref<Nav[][]>([])
const navTotal = ref<number>(0)
const dialogParams = reactive<{ visible: boolean, id?: number, type: 'add' | 'edit' }>({
  visible: false,
  type: 'add',
})

const goBack = () => {
  router.replace('/')
}

const getNavData = () => {
  loading.value = true
  getNavList()
    .then((res) => {
      const { code, data } = res
      if (code === 200) {
        navTotal.value = data.length
        const tempArr: Nav[][] = []
        data.forEach((item) => {
          if (tempArr.length === 0) {
            tempArr.push([item])
          } else {
            const lastArr = tempArr[tempArr.length - 1]
            if (lastArr.length < 4) {
              lastArr.push(item)
            } else {
              tempArr.push([item])
            }
          }
        })
        navList.value = tempArr
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const addNav = (parentId?: number) => {
  dialogParams.type = 'add'
  dialogParams.id = parentId ? parentId : undefined
  dialogParams.visible = true
}

const deleteNav = (id: number) => {
  ElMessageBox.confirm('确认删除该导航吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delNav({ id }).then((res) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('删除成功')
        getNavData()
      }
    })
  })
}

const editNav = (id: number) => {
  dialogParams.type = 'edit'
  dialogParams.id = id
  dialogParams.visible = true
}

onMounted(() => {
  const handleResize = () => {
    const containerHeight = navContainerRef.value?.clientHeight
    if (containerHeight) {
      cardHeight.value = (containerHeight - 55) / 4
    }
  }

  handleResize()
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
})
getNavData()
</script>

<template>
  <div v-loading="loading" class="nav-config-view">
    <div class="nav-header">
      <div class="nav-header-back" @click="goBack">
        <el-icon size="30">
          <Back />
        </el-icon>
      </div>
      <div class="nav-header-title">
        导航配置
      </div>
      <div v-if="navTotal < 16" class="nav-header-back" @click="addNav()">
        <el-icon size="30">
          <Plus />
        </el-icon>
      </div>
      <div v-else class="nav-header-back" style="cursor: auto;"></div>
    </div>
    <div ref="navContainerRef" class="nav-container">
      <el-row v-for="(item, index) in navList" :key="index">
        <el-col v-for="nav in item" :key="nav.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="responsive-card" :style="{ height: cardHeight + 'px' }">
            <template #header>
              <div class="card-header">
                <div class="card-header-title">
                  <span>{{ nav.name }}</span>
                </div>
                <el-button-group class="action-buttons" size="small">
                  <el-button type="success" @click="addNav(nav.id)">添加</el-button>
                  <el-button type="primary" @click="editNav(nav.id)">修改</el-button>
                  <el-button type="danger" @click="deleteNav(nav.id)">删除</el-button>
                </el-button-group>
              </div>
            </template>
            <div class="card-content">
              <template v-if="nav.children">
                <div class="card-content-item" v-for="(item, index) in nav.children" :key="index">
                  <div class="card-content-item-title">
                    <el-dropdown placement="bottom-start" trigger="click">
                      <span>{{ item.name }}</span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="editNav(item.id)">编辑</el-dropdown-item>
                          <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                  <div class="card-content-item-url">
                    <el-link :href="item.url" target="_blank">{{ item.url }}</el-link>
                  </div>
                </div>
              </template>
              <el-empty v-else style="width: 100%;height: 100px;" :image-size="50" description="一级导航" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <AddOrEditNavDialog v-model="dialogParams.visible" :type="dialogParams.type" :id="dialogParams.id"
      @success="getNavData" />
  </div>
</template>

<style lang="scss" scoped>
.nav-config-view {
  height: 100vh;
  width: 100%;

  .nav-header {
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid var(--el-border-color);
    padding: 0 8px;

    .nav-header-back {
      flex-shrink: 0;
      width: 40px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .nav-header-title {
      flex: 1;
      text-align: center;
      font-size: 14px;
      padding: 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .nav-container {
    height: calc(100% - 51px);
    padding: 8px;
    overflow-y: auto;
    box-sizing: border-box;

    .el-col {
      padding: 4px;
      position: relative;

      :deep(.el-empty) {
        height: 100%;
        width: 100%;
        padding: 0;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .responsive-card {
      width: 100%;
      overflow: hidden;

      :deep(.el-card__header) {
        padding: 8px 12px;
        height: auto;
      }

      :deep(.el-card__body) {
        height: calc(100% - 40px);
        padding: 8px 0;
        box-sizing: border-box;
        overflow: hidden;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;

      .card-header-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }

      .action-buttons {
        flex-shrink: 0;

        .el-button {
          padding: 5px 8px;
        }
      }
    }

    .card-content {
      height: 100%;
      overflow-y: auto;

      .card-content-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 12px;
        font-size: 12px;

        &:not(:last-child) {
          border-bottom: 1px solid var(--el-border-color-light);
        }

        .card-content-item-title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          span {
            cursor: pointer;

            &:hover {
              color: var(--el-color-primary);
            }
          }
        }

        .card-content-item-url {
          flex-shrink: 0;
          margin-left: 8px;
          max-width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .el-link {
            font-size: 12px;
          }
        }
      }

      .el-empty {
        :deep(.el-empty__description) {
          font-size: 12px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .nav-header {
      height: 44px;

      .nav-header-back {
        width: 36px;

        .el-icon {
          font-size: 24px;
        }
      }

      .nav-header-title {
        font-size: 13px;
      }
    }

    .nav-container {
      padding: 4px;
      box-sizing: border-box;

      .responsive-card {
        height: auto !important;
        min-height: 160px;

        .card-header {
          flex-direction: column;
          align-items: flex-start;

          .action-buttons {
            width: 100%;
            justify-content: flex-end;
            margin-top: 4px;
          }
        }

        .card-content-item {
          flex-direction: column;
          align-items: flex-start;
          padding: 8px 12px;

          .card-content-item-url {
            margin-left: 0;
            margin-top: 4px;
            max-width: 100%;
            width: 100%;
            text-align: left;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .nav-container {
      .action-buttons {
        flex-wrap: wrap;
        gap: 4px;

        .el-button {
          flex: 1;
          min-width: 60px;
        }
      }
    }

    .card-header {
      display: flex !important;
      align-items: center !important;
      flex-direction: row !important;
      justify-content: space-between;

      .card-header-title {
        overflow: unset !important;
      }

      .el-button-group {
        width: auto !important;
      }
    }

    .card-content {
      height: 200px !important;
      position: relative;
    }
  }
}
</style>
