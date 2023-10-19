<template>
  <div class="home-page-wrapper">
    <div class="home-page-background">
      <v-img class="home-page-img" cover :src="myImg" alt="" />
      <div class="banner-wave1"></div>
      <div class="banner-wave2"></div>
    </div>
    <div class="home-page-content">
      <v-container class="page-content bg-background-variant" style="padding: 0">
        <!-- 左边栏 -->
        <div class="left-column">
          <v-sheet :elevation="8" :height="400" :width="300" rounded="lg" class="profile">
            <div class="avatar-content">
              <StarSky :width="300" :height="150" />
              <v-avatar class="my-avatar" :image="myImg" size="100" @click=""></v-avatar>
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
                      <v-img aspect-ratio="1/1" cover :src="qqImg"></v-img>
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
        </div>
        <!-- 右边栏 -->
        <v-container class="right-column" style="padding: 0">
          <v-sheet :elevation="1" rounded="lg" height="100"> </v-sheet>
          <!-- 文章类型tab -->
          <v-card class="tag-tabs">
            <v-tabs bg-color="deep-yellow-darken-4" show-arrows multiple center-active>
              <v-chip
                class="ma-2 tag-tab-item"
                :color="tagItem.color"
                @click="clickTag(tagItem, index)"
                :variant="tagItem.selected ? 'elevated' : 'outlined'"
                label
                v-for="(tagItem, index) in tagList"
              >
                <v-icon start icon="mdi-label"></v-icon>{{ tagItem.label }}
              </v-chip>
            </v-tabs>
          </v-card>
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
              @click:prepend-inner="searchArticle"
              @keyup.enter="searchArticle"
            >
              <v-chip
                v-for="(tagItem, i) in tagListSelected"
                @click:close="removeTag(i)"
                :color="tagItem.color"
                variant="elevated"
                closable
                label
                style="margin-right: 5px; margin-bottom: 5px"
                ><v-icon start icon="mdi-label"></v-icon>{{ tagItem.label }}</v-chip
              >
            </v-text-field>
          </div>
        </v-container>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { ref } from 'vue'
import StarSky from '@/components/StarSky/StarSky.vue'
import myImg from '@/assets/53.jpg'
import weChatImg from '@/assets/wechat.jpg'
import qqImg from '@/assets/qq.jpg'
import { onMounted } from 'vue'

const MY_GITHUB_URL = 'https://github.com/Spearhead111'
const WECHAT_ACCOUNT = 'Spearhead_2024'
const QQ_ACCOUNT = '1744734603'

const tagList = ref<any[]>([]) // 文章类型tag列表
const searchKey = ref('') // 搜索关键字
const tagListSelected = ref<any[]>([]) // 选中的文章类型tag列表
const searchArticleLoading = ref(false) // 搜索文章loading

onMounted(() => {
  for (let i = 0; i < 100; i++) {
    tagList.value.push({
      label: 'label' + i,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      selected: false
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
const clickTag = (tag: any, idx: number) => {
  tag.selected = !tag.selected
  if (tag.selected) {
    // 选中的tag添加idx属性，用于记录在原数组中的位置，方便后续直接拿索引
    tagListSelected.value.push({ ...tag, idx })
    // 给搜索内容加一个空格，将input撑起来(页面展示优化)
    !searchKey.value && (searchKey.value = ' ')
  } else {
    // 删除选中的tag
    removeTag(tagListSelected.value.findIndex((item) => item.idx === idx))
  }
}

/** 删除选中的tag */
const removeTag = (i: number) => {
  // 删除选中的tag
  const deleteTag = tagListSelected.value.splice(i, 1)[0]
  // 将tab中的tag选中状态重置
  tagList.value[deleteTag.idx].selected = false
}

/** 清除搜索内容 */
const clearSearchKey = () => {
  // 清除选择的tag
  tagListSelected.value = []
  // 清楚tag的选中态
  tagList.value.forEach((item) => (item.selected = false))
  searchKey.value = ''
}

/** 搜索文章 */
const searchArticle = () => {
  searchArticleLoading.value = true
  setTimeout(() => {
    searchArticleLoading.value = false
  }, 1000)
}

/** 搜索文章 */
const searchArticleHandler = () => {
  searchArticle()
}

/** 搜索文章 */
const searchArticleKeyupHandler = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    searchArticle()
  }
}

/** 搜索文章 */
</script>
