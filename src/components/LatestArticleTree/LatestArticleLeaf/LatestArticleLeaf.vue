<template>
  <div
    class="latest-article-leaf-wrapper"
    :style="{
      position: 'relative',
      [isLeft ? 'borderRight' : 'borderLeft']: '2px solid #926be780'
    }"
  >
    <div
      :class="['top-content', isLeft ? '' : 'flex-row-reverse', 'mb-1']"
      :style="{
        [isLeft ? 'padding-right' : 'padding-left']: '4px'
      }"
    >
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-avatar v-bind="props" size="small" color="brown">
            <v-img cover :src="articleInfo.authorAvatar" alt="John"></v-img>
            <!-- <span class="text-h5" style="cursor: default">{{ 'S' }}</span> -->
          </v-avatar>
        </template>
        <div class="flex align-center">
          <v-icon
            :color="USER_ROLE_ICON_MAP[articleInfo.authorRole].iconColor"
            :icon="USER_ROLE_ICON_MAP[articleInfo.authorRole].icon"
          />
          <!-- 文章作者 -->
          <span>{{ articleInfo.author }}</span>
        </div>
      </v-tooltip>
      <!-- 文章更新时间 -->
      <div class="font-bold">{{ getCreateTimeFromNow(articleInfo.createTime) }}</div>
    </div>
    <v-divider :thickness="1" class="border-opacity-100 width-100" color="#926be780"></v-divider>
    <div
      class="bot-content mt-1"
      :style="{
        [isLeft ? 'padding-right' : 'padding-left']: '4px'
      }"
    >
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <v-chip class="px-2" size="small" @click="toArticleDetail" label>
            <!-- 文章标题 -->
            <div class="article-title" v-bind="props">{{ articleInfo.title }}</div>
          </v-chip>
        </template>
        <div class="flex align-center flex-column">
          <span>{{ articleInfo.title }}</span>
        </div>
      </v-tooltip>
      <div :style="{ textAlign: isLeft ? 'start' : 'end' }">
        <v-chip
          v-for="tag in articleInfo.tags"
          :color="tag.color"
          variant="elevated"
          size="x-small"
          label
        >
          <v-icon start :color="tag.iconColor" :icon="tag.icon"></v-icon
          ><span class="tag-label">{{ tag.label }}</span>
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { USER_ROLE_ICON_MAP } from '@/constants'
import { type LatestArticle } from '../LatestArticleTree.vue'
import { relTime } from '@/utils'
import router from '@/router'

const props = withDefaults(
  defineProps<{
    isLeft: boolean
    articleInfo: LatestArticle
  }>(),
  {}
)

/** 获取文章的更新时间(距离当前时间) */
const getCreateTimeFromNow = (createTime: number) => {
  // 获取距离当前时间的相对时间
  const relativeTime = relTime(createTime)
  return relativeTime
}

/** 跳转到文章详情 */
const toArticleDetail = () => {
  router.push({
    name: 'ArticleDetail',
    query: {
      articleId: props.articleInfo.articleId
    }
  })
}
</script>
