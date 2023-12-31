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
        <v-container class="left-column pt-5">
          <v-sheet :elevation="8" :height="400" :width="300" rounded="lg" class="profile">
            <div class="avatar-content">
              <StarSky :width="300" :height="150" />
              <v-avatar class="my-avatar" :image="LOGO_PIC" size="100" @click=""></v-avatar>
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
                <span style="font-weight: bold">
                  <v-icon color="#6bb67e" start icon="mdi-checkbox-marked-circle"></v-icon
                  >已复制Spearhead的微信号，期待你的来电😘</span
                >
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
                <span style="font-weight: bold">
                  <v-icon color="#6bb67e" start icon="mdi-checkbox-marked-circle"></v-icon>
                  已复制Spearhead的QQ号，期待你的来电😘</span
                >
              </v-snackbar>
            </div>
          </v-sheet>
          <LatestArticleTree class="mt-15 width-100"></LatestArticleTree>
        </v-container>
        <!-- 右边栏 -->
        <v-container class="right-column pt-5">
          <iframe
            src="https://spearhead-cdn-1314941949.cos.ap-chengdu.myqcloud.com/writeHeadBanner/crocodile.html"
            frameborder="0"
            class="width-100 write-banner-iframe"
            style="border-radius: 15px"
            scrolling="no"
          ></iframe>
          <!-- 文章类型tab -->
          <v-card class="tag-tabs mt-4">
            <v-tabs bg-color="deep-yellow-darken-4" show-arrows multiple center-active>
              <v-chip
                class="ma-2 tag-tab-item rounded-lg"
                :color="tagItem.color"
                @click="clickTag(tagItem)"
                :variant="tagItem.selected ? 'elevated' : 'outlined'"
                size="large"
                v-for="(tagItem, index) in tagList"
              >
                <v-icon start :color="tagItem.iconColor" :icon="tagItem.icon"></v-icon
                ><span>{{ tagItem.label }}</span>
              </v-chip>
            </v-tabs>
          </v-card>
          <!-- 搜索框 -->
          <div class="search-input">
            <v-form ref="form" @submit.prevent>
              <v-text-field
                v-model="searchKey"
                :loading="searchArticleLoading"
                prepend-inner-icon="mdi-magnify"
                :counter="15"
                :rules="searchKeyRules"
                clearable
                label="搜索文章"
                @click:clear="clearSearchKey"
                @click:prepend-inner="debounceSearchArticle"
                @keyup.enter.naive="debounceSearchArticle"
              >
                <v-chip
                  v-for="(tagItem, i) in tagListSelected"
                  :key="tagItem.code"
                  @click:close="removeSelectedTag(tagItem.code)"
                  :color="tagItem.color"
                  :model-value="tagItem.selected"
                  variant="elevated"
                  closable
                  style="margin-right: 5px; margin-bottom: 5px"
                  ><v-icon start :color="tagItem.iconColor" :icon="tagItem.icon"></v-icon
                  ><span>{{ tagItem.label }}</span></v-chip
                >
              </v-text-field>
            </v-form>
          </div>
          <!-- <v-divider :thickness="2" class="border-opacity-50 ma-5" style="width: 100%"></v-divider> -->
          <!-- 博客文章 -->
          <div class="blogs-content-wrapper">
            <div
              v-for="articleProfile in articleProfileData"
              :key="articleProfile.articleId"
              v-animate="'animate__zoomIn'"
            >
              <BlogProfile
                :articleProfile="articleProfile"
                :highlightKey="highlightKey"
                @refresh="refresh"
              />
            </div>
          </div>
          <div class="more-btn" @click="findMoreArticles" v-if="articleProfileTotal">
            <div class="mask"></div>
            <span>{{ hasNext ? 'find more' : '暂时没有了' }}</span>
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
import BlogProfile from '@/components/BlogProfile/BlogProfile.vue'
import {
  LOGO_PIC,
  HOME_PAGE_BANNER,
  BANNER_WAVE1,
  BANNER_WAVE2,
  weChatImg,
  QQImg
} from '@/constants'
import { debounce, throttle } from 'lodash'
import { onMounted } from 'vue'
import useArticleStore from '@/stores/modules/article'
import { errorCodeMap } from '@/utils'
import { ElMessage } from 'element-plus'
import LatestArticleTree from '@/components/LatestArticleTree/LatestArticleTree.vue'

const articleStore = useArticleStore()
const MY_GITHUB_URL = 'https://github.com/Spearhead111'
const WECHAT_ACCOUNT = 'Spearhead_2024'
const QQ_ACCOUNT = '1744734603'

export interface Tag {
  /** 标签code */
  code: string
  /** 标签颜色 */
  color: string
  /** 标签图标 */
  icon: string
  /** 标签图标颜色 */
  iconColor: string
  /** 标签id */
  id: number
  /** 标签名称 */
  label: string
}

export interface TagSelect extends Tag {
  /** 标签是否被选中 */
  selected: boolean
}

export interface ArticleProfile {
  /** 文章id */
  articleId: number
  /** 文章标题 */
  title: string
  /** 文章次标题 */
  subtitle: string
  /** 文章封面图片 */
  banner: string
  /** 文章创建时间 */
  createTime: number
  /** 文章更新时间 */
  updateTime: number
  /** 文章描述 */
  desc: string
  /** 文章标签 */
  tags: Tag[]
  /** 文章浏览量 */
  view: number
  /** 文章“总”评论数，包含文章评论和评论的回复 */
  comments: number
  /** 文章点赞量 */
  like: number
  /** 文章作者昵称 */
  auth: string
  /** 文章作者id */
  authId: string
}

const tagList = ref<TagSelect[]>([]) // 文章类型tag列表
const searchKey = ref('') // 搜索关键字
const tagListSelected = ref<TagSelect[]>([]) // 选中的文章类型tag列表
const searchArticleLoading = ref(false) // 搜索文章loading
const articleProfileData = ref<ArticleProfile[]>([])
const articleProfileTotal = ref(0) // 文章总数
const highlightKey = ref('') // 高亮关键字，用于高亮搜索的关键字
const form = ref()
const searchKeyRules = [(v: string | any[]) => v.length <= 15 || '最多支持搜索15个字符']
const pageNo = ref(1)
const pageSize = ref(6)
const hasNext = ref(true) // 获取文章接口是否被截断(后面是否还有文章)

onMounted(async () => {
  await getArticleTagList()
  await getArticleList()
})

/** 获取文章标签 */
const getArticleTagList = async () => {
  const res = await articleStore.getArticleTagList()
  if (res && res.result_code === 'success') {
    const { list, total } = res.data as any
    if (!list.length) {
      return
    }
    tagList.value = (list as Tag[]).map((tag) => {
      return {
        ...tag,
        selected: false
      }
    })
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/**
 * 获取文章列表
 * @param type 判断是搜索还是查询更多文章
 */
const getArticleList = async (type = 'search') => {
  searchArticleLoading.value = true
  const params = {
    search: searchKey.value.trim(),
    tagIdListStr: tagListSelected.value.map((tag) => tag.id).join(','),
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  highlightKey.value = params.search
  const res = await articleStore.getArticleList(params)
  if (res && res.result_code === 'success') {
    const { list, total, has_next } = res.data as any
    // 判断是搜索还是查询更多
    hasNext.value = has_next
    articleProfileTotal.value = total
    type === 'search' && (articleProfileData.value = [])
    ;(list as any[]).forEach((item: any) => {
      articleProfileData.value.push({
        articleId: item.article_id,
        title: item.article_title,
        subtitle: item.article_subtitle,
        banner: item.article_banner,
        createTime: new Date(item.article_create_time).getTime(),
        updateTime: new Date(item.article_update_time).getTime(),
        desc: item.article_description,
        tags: item.categories,
        view: item.article_view,
        comments: item.comments,
        like: item.likes,
        auth: item.author_nickname,
        authId: item.auth_id
      })
    })
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
  searchArticleLoading.value = false
}

/** 删除完文章更新一下文章列表 */
const refresh = () => {
  getArticleList()
}

/** 跳转到我的GitHub首页 */
const navigateToMyGithub = () => {
  window.open(MY_GITHUB_URL, '_blank')
}

/** 复制文本 */
const copy = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {})
}

/** 点击文章类型tag */
const clickTag = (tag: TagSelect) => {
  tag.selected = !tag.selected
  if (tag.selected) {
    const newTag = {
      ...tag,
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
const searchArticle = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  pageNo.value = 1
  pageSize.value = 6
  await getArticleList()
}

/** 更多文章 */
const findMoreArticles = () => {
  // 判断还有没有更多文章
  if (!hasNext.value) {
    return
  }
  pageNo.value += 1
  // 获取更多文章
  getArticleList('more')
}

/** 防抖搜索文章 */
const debounceSearchArticle = debounce(searchArticle, 300)
</script>
