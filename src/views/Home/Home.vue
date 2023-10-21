<template>
  <div class="home-page-wrapper">
    <div class="home-page-background">
      <v-img class="home-page-img" cover :src="HOME_PAGE_BANNER" alt="" />
      <div class="banner-wave1" :style="{ backgroundImage: `url(${BANNER_WAVE1})` }"></div>
      <div class="banner-wave2" :style="{ backgroundImage: `url(${BANNER_WAVE2})` }"></div>
    </div>
    <div class="home-page-content">
      <v-container class="page-content bg-background-variant pa-0">
        <!-- 左边栏 -->
        <v-container class="left-column pa-0">
          <v-sheet :elevation="8" :height="400" :width="300" rounded="lg" class="profile">
            <div class="avatar-content">
              <StarSky :width="300" :height="150" />
              <v-avatar class="my-avatar" :image="HOME_PAGE_BANNER" size="100" @click=""></v-avatar>
            </div>
            <h2>SPEARHEAD</h2>
            <div class="contact-type-wrapper">
              <v-snackbar :timeout="1500">
                <template v-slot:activator="{ props }">
                  <div class="contact-type-item" @click="copy(WECHAT_ACCOUNT)" v-bind="props">
                    <v-icon icon="mdi-wechat" size="large" color="#24db5a" />Wechat
                    <div class="contact-type-item__content" style="left: -5px">
                      <v-img aspect-ratio="1/1" cover :src="weChatImg"></v-img>
                    </div>
                  </div>
                </template>
                <span style="font-weight: bold">已复制Spearhead的微信号，期待你的来电😘</span>
              </v-snackbar>
              <v-divider :thickness="2" vertical inset />
              <div class="contact-type-item" @click="navigateToMyGithub">
                <v-icon icon="mdi-github" size="large" />Github
              </div>
              <v-divider :thickness="2" vertical inset />
              <v-snackbar :timeout="1500">
                <template v-slot:activator="{ props }">
                  <div class="contact-type-item" @click="copy(QQ_ACCOUNT)" v-bind="props">
                    <v-icon icon="mdi-qqchat" size="large" color="#7bd4ef" />QQ
                    <div class="contact-type-item__content" style="right: -5px">
                      <v-img aspect-ratio="1/1" cover :src="QQImg"></v-img>
                    </div>
                  </div>
                </template>
                <span style="font-weight: bold">已复制Spearhead的QQ号，期待你的来电😘</span>
              </v-snackbar>
            </div>
          </v-sheet>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
        </v-container>
        <!-- 右边栏 -->
        <v-container class="right-column pa-0">
          <v-sheet class="width-100" :elevation="1" rounded="lg" style="height: 10vh"> </v-sheet>
          <!-- 文章类型tab -->
          <v-card class="tag-tabs">
            <v-tabs bg-color="deep-yellow-darken-4" show-arrows multiple center-active>
              <v-chip
                class="ma-2 tag-tab-item"
                :color="tagItem.color"
                @click="clickTag(tagItem)"
                :variant="tagItem.selected ? 'elevated' : 'outlined'"
                size="large"
                v-for="(tagItem, index) in tagList"
              >
                <v-icon start icon="mdi-label"></v-icon><span>{{ tagItem.label }}</span>
              </v-chip>
            </v-tabs>
          </v-card>
          <!-- 搜索框 -->
          <div class="search-input">
            <v-text-field
              v-model="searchKey"
              :loading="searchArticleLoading"
              prepend-inner-icon="mdi-magnify"
              variant="solo"
              hide-details
              clearable
              label="搜索文章"
              @click:clear="clearSearchKey"
              @click:prepend-inner="debounceSearchArticle"
              @keyup.enter="debounceSearchArticle"
            >
              <v-chip
                v-for="(tagItem, i) in tagListSelected"
                :key="tagItem.code"
                @click:close="removeSelectedTag(tagItem.code)"
                :color="tagItem.color"
                :model-value="tagItem.selected"
                closable
                style="margin-right: 5px; margin-bottom: 5px"
                ><v-icon start icon="mdi-label"></v-icon><span>{{ tagItem.label }}</span></v-chip
              >
            </v-text-field>
          </div>
          <v-divider :thickness="2" class="border-opacity-50 ma-5" style="width: 100%"></v-divider>
          <!-- 博客文章 -->
          <div class="blogs-content-wrapper">
            <BlogProfile
              :articleProfile="articleProfile"
              :highlightKey="highlightKey"
              v-for="articleProfile in articleProfileData"
            />
          </div>
          <mavon-editor v-model="content" style="height: 200px; width: 200px" />
        </v-container>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { ref } from 'vue'
import StarSky from '@/components/StarSky/StarSky.vue'
import BlogProfile from '@/components/BlogProfile/BlogProfile.vue'
import { HOME_PAGE_BANNER, BANNER_WAVE1, BANNER_WAVE2, weChatImg, QQImg } from '@/constants'
import { debounce, throttle } from 'lodash'
import { onMounted } from 'vue'

const MY_GITHUB_URL = 'https://github.com/Spearhead111'
const WECHAT_ACCOUNT = 'Spearhead_2024'
const QQ_ACCOUNT = '1744734603'

const tagList = ref<any[]>([]) // 文章类型tag列表
const searchKey = ref('') // 搜索关键字
const tagListSelected = ref<any[]>([]) // 选中的文章类型tag列表
const searchArticleLoading = ref(false) // 搜索文章loading
const articleProfileData = ref<any[]>([])
const highlightKey = ref('') // 高亮关键字，用于高亮搜索的关键字
const content = ref('')

onMounted(() => {
  for (let i = 0; i < 100; i++) {
    tagList.value.push({
      label: 'label' + i,
      code: 'code' + i,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      selected: false
    })
  }
  for (let i = 0; i < 7; i++) {
    articleProfileData.value.push({
      title: 'article' + i
    })
  }
})

/** 跳转到我的GitHub首页 */
const navigateToMyGithub = () => {
  window.open(MY_GITHUB_URL, '_blank')
}

/** 复制文本 */
const copy = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {})
}

/** 点击文章类型tag */
const clickTag = (tag: any) => {
  tag.selected = !tag.selected
  if (tag.selected) {
    const newTag = {
      label: tag.label,
      code: tag.code,
      color: tag.color,
      selected: true
    }
    tagListSelected.value.push(newTag)
    // 给搜索内容加一个空格，将input撑起来(页面展示优化)
    !searchKey.value && (searchKey.value = ' ')
    // debounceSearchArticle()
  } else {
    // 删除选中的tag
    removeSelectedTag(tag.code)
  }
}

/** 删除选中的tag */
const removeSelectedTag = (tagCode: string) => {
  tagList.value.some((item) => {
    if (item.code === tagCode) {
      item.selected = false
      return true
    }
    return false
  })
  tagListSelected.value = tagListSelected.value.filter((item) => item.code !== tagCode)
  // debounceSearchArticle()
}

/** 清除搜索内容 */
const clearSearchKey = () => {
  // 清除选择的tag
  tagListSelected.value = []
  // 清楚tag的选中态
  tagList.value.forEach((item) => (item.selected = false))
  searchKey.value = ''
  debounceSearchArticle()
}

/** 搜索文章 */
const searchArticle = () => {
  console.log('search')
  searchArticleLoading.value = true
  setTimeout(() => {
    highlightKey.value = searchKey.value.trim()
    articleProfileData.value = [...articleProfileData.value]
    searchArticleLoading.value = false
  }, 1000)
}

/** 防抖搜索文章 */
const debounceSearchArticle = debounce(searchArticle, 300)
</script>
