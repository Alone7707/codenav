<script setup lang="ts">
import { getNavList, getSEList } from '@/api/nav'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import ControlIndex from '@/components/Control/ControlIndex.vue'
import GridIndex from '@/components/Grid/GridIndex.vue'
import type { Nav, SE } from '@/interfaces/api'
import { Search } from '@element-plus/icons-vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Toast from '@/components/Toast/toast'
import { getKeyword } from '@/api/search'
import { type ElAutocomplete } from 'element-plus'
import AccountControl from '@/components/Account/AccountControl.vue'
import { useThemeStore } from '@/stores/theme'
defineOptions({
  name: 'HomeView',
})

const themeStore = useThemeStore()
const loading = ref<boolean>(false)
const keyword = ref<string>('')
const SE = ref<number>(1)
const SEList = ref<SE[]>([{
  "id": 1,
  "label": "百度",
  "path": "https://www.baidu.com/",
  "search_path": "https://www.baidu.com/s?wd=",
  "logo": "data:image/png;base64,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"
}])
const navList = ref<Nav[][]>()
const searchResult = ref<{ value: string }[]>()
const autocompleteRef = ref<typeof ElAutocomplete>()

const backgroundImg = ref<string>(`url(${themeStore.bgcImg})`)

let _cb: (arg: unknown) => void = () => { }

const getSEData = () => {
  loading.value = true
  getSEList()
    .then((res) => {
      const { code, data } = res
      if (code === 200) {
        SEList.value = data
        if (data.length) {
          SE.value = data[0].id
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}
const getNavData = () => {
  loading.value = true
  getNavList()
    .then((res) => {
      const { code, data } = res
      if (code === 200) {
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

const SEImage = computed(() => {
  if (SE.value) {
    return SEList.value?.find((item) => item.id === SE.value)?.logo
  } else {
    return ''
  }
})

const handleLogo = () => {
  if (SE.value) {
    const url = SEList.value?.find((item) => item.id === SE.value)?.path
    window.open(url)
  }
}

const handleSearch = async () => {
  if (keyword.value) {
    const index = autocompleteRef.value?.highlightedIndex
    if (index >= 0 && searchResult.value?.length) {
      keyword.value = searchResult.value[index].value
    }
    const url = `${SEList.value?.find((item) => item.id === SE.value)?.search_path}${encodeURIComponent(keyword.value)}`
    window.open(url)
  } else {
    // 失去焦点
    autocompleteRef.value?.blur()
    Toast.show({
      message: '请输入搜索内容',
      type: 'error',
    })
    setTimeout(() => {
      autocompleteRef.value?.focus()
    }, 3000);
  }
}
const handleFetch = (value: string, cb: (arg: unknown) => void) => {
  if (!_cb && cb) _cb = cb
  if (!value.trim()) {
    return cb([])
  }
  getKeyword(value).then((res) => {
    const { code, data } = res
    if (code === 200) {
      searchResult.value = data.map((v) => ({ value: v }))
      cb(searchResult.value)
    }
  })
}

const handleInput = (value: string) => {
  if (value.trim()) {
    _cb([])
  }
}

const handleSelect = (event: { value: string }) => {
  keyword.value = event.value
  const url = `${SEList.value?.find((item) => item.id === SE.value)?.search_path}${encodeURIComponent(keyword.value)}`
  window.open(url)
}

watch(() => themeStore.bgcImg, (val) => {
  backgroundImg.value = `url(${val})`
})

getSEData()
getNavData()

onBeforeUnmount(() => {
  // 1. 清除回调引用
  _cb = () => { }

  // 2. 清除自动完成组件引用
  if (autocompleteRef.value) {
    autocompleteRef.value = undefined
  }
})
</script>

<template>
  <div v-loading="loading" class="home-view">
    <div class="search-container">
      <el-image :src="SEImage" class="search-image" @click="handleLogo">
        <template #error>
          <div class="image-slot">
            <el-icon><icon-picture /></el-icon>
          </div>
        </template>
      </el-image>
      <el-autocomplete ref="autocompleteRef" v-model="keyword" size="large" autofocus @input="handleInput"
        @keydown.enter="handleSearch" :fetch-suggestions="handleFetch" @select="handleSelect">
        <template #prepend>
          <el-select v-model="SE" size="large" placeholder="Select" style="width: 115px">
            <el-option v-for="item in SEList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
        <template #append>
          <el-button size="large" :icon="Search" @click="handleSearch" />
        </template>
      </el-autocomplete>
    </div>
    <div class="grid-container">
      <grid-index v-if="navList" :data="navList"></grid-index>
    </div>
    <control-index class="control"></control-index>
    <account-control @success="getNavData"></account-control>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  height: 100%;
  width: 100%;
  position: fixed;
  inset: 0;
  background-image: v-bind(backgroundImg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  overflow: hidden;
  padding-bottom: 5%;

  // @media screen and (max-width: 768px) {
  // }

  // @media screen and (min-width: 768px) and (max-width: 1440px) {
  //   padding-bottom: 5%;
  // }

  // @media screen and (min-width: 1440px) {
  //   padding-bottom: 5%;
  // }

  .search-container {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    .search-image {
      height: 124px;
      max-width: 270px;
      cursor: pointer;
      padding: 24px;
      border-radius: 12px;
      box-sizing: border-box;
      user-select: none;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      @media screen and (max-width: 768px) {
        width: 90%;
      }

      .image-slot {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    :deep(.el-autocomplete) {
      max-width: 600px;

      @media screen and (max-width: 768px) {
        width: 90%;
      }
    }
  }

  .grid-container {
    @media screen and (max-width: 768px) {
      width: 90%;
    }

    @media screen and (min-width: 768px) and (max-width: 1440px) {
      width: 65%;
    }

    @media screen and (min-width: 1440px) {
      width: 55%;
    }
  }

  .control {
    position: absolute;
    bottom: 12px;
    right: 12px;
  }
}
</style>
