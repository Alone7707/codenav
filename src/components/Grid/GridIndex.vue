<script setup lang="ts">
import type { Nav } from '@/interfaces/api'
import { Picture } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'

const isDark = useDark()
defineProps<{
  data: Array<Array<Nav>>
}>()
const handleClick = (command: string) => {
  window.open(command, '_blank')
}
</script>

<template>
  <div class="grid-index" :class="isDark ? '' : 'dark'">
    <el-row v-for="(row, index) in data" :key="index">
      <el-col v-for="col in row" :key="col.id" :span="6" class="grid-item">
        <a v-if="!col.children" :href="col.url" target="_blank">
          <el-image :src="col.icon" fit="fill" class="icon">
            <template #error>
              <el-icon color="#ccc" style="height: 20px; width: 20px; padding: 6px">
                <Picture />
              </el-icon>
            </template>
          </el-image>
          <div class="name">{{ col.name }}</div>
        </a>
        <el-dropdown v-else @command="handleClick">
          <a :target="col.children.length === 0 ? '_blank' : ''">
            <el-image :src="col.icon" fit="fill" class="icon">
              <template #error>
                <el-icon color="#ccc" style="height: 20px; width: 20px; padding: 6px">
                  <Picture />
                </el-icon>
              </template>
            </el-image>
            <div class="name">{{ col.name }}</div>
          </a>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="child in col.children" :key="child.id" :command="child.url">
                <div style="width: 100px; text-align: center">{{ child.name }}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.grid-index {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;

  * {
    user-select: none;
  }

  .grid-item {
    height: 120px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    @media screen and (max-width: 768px) {
      height: 100px;
    }

    a {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--el-color-white);

      .icon {
        border-radius: 2px;

        @media screen and (max-width: 768px) {
          height: 50px;
        }

        @media screen and (min-width: 768px) and (max-width: 1440px) {
          height: 32px;
        }

        @media screen and (min-width: 1440px) {
          height: 40px;
        }
      }

      .name {
        font-size: 14px;

        @media screen and (max-width: 768px) {
          display: none;
        }
      }
    }

    .el-dropdown {
      width: 100%;
      height: 100%;

      .el-dropdown-menu__item {
        text-decoration: none;
      }
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      box-shadow:
        0 1px 2px -2px rgba(0, 0, 0, 0.16),
        0 3px 6px 0 rgba(0, 0, 0, 0.12),
        0 5px 12px 4px rgba(0, 0, 0, 0.09) !important;
    }
  }
}

.dark {
  background-color: #fff;

  .grid-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  * {
    color: #333;
  }
}

.col-link {
  text-decoration: none;
}

.el-dropdown,
.el-dropdown * {
  outline: none;
}
</style>
