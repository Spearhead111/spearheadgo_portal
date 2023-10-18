<template>
  <div class="home-page-wrapper">
    <div class="home-page-background">
      <img :src="myImg" alt="" />
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
        </div>
        <!-- 右边栏 -->
        <v-container class="right-column" style="padding: 0">
          <v-sheet :elevation="1" rounded="lg" height="100"> </v-sheet>
          <!-- 文章类型tab -->
          <v-card class="tag-tabs">
            <v-tabs bg-color="deep-yellow-darken-4" show-arrows multiple center-active>
              <v-chip
                class="ma-2 tag-tab-item"
                :color="tagItem.selected ? tagItem.color : tagItem.color + '30'"
                @click="clickTag(tagItem)"
                label
                v-for="tagItem in tagList"
              >
                <v-icon start icon="mdi-label"></v-icon>{{ tagItem.label }}
              </v-chip>
            </v-tabs>
          </v-card>
          <div class="search-input">
            <v-text-field v-model="searchKey" hide-details label="搜索文章">
              <v-chip v-for="tagItem in tagList" v-model="tagItem.selected" closable label
                ><v-icon start icon="mdi-label"></v-icon
              ></v-chip>
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

onMounted(() => {
  for (let i = 0; i < 100; i++) {
    tagList.value.push({
      label: 'label' + i,
      color: '#ffaa34',
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
const clickTag = (tag: any) => {
  tag.selected = !tag.selected
  if (tag.selected && !searchKey.value) {
    searchKey.value = ' '
  }
  console.log(tag)
}
</script>
