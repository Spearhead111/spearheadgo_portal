<template>
  <div class="article-bottombar-wrapper">
    <div>
      <v-badge
        color="purple-lighten-5"
        :content="blogInfoDetail.like"
        floating
        max="999"
        :offset-y="5"
      >
        <v-icon
          variant="tonal"
          :size="24"
          icon="mdi-thumb-up"
          :color="userArticleInfo.isLiked ? 'red-lighten-1' : 'blue-lighten-2'"
          @click="likeArticle"
        ></v-icon>
      </v-badge>
    </div>
    <div>
      <v-badge
        v-if="!isAtComment"
        color="blue-lighten-5"
        :content="blogInfoDetail.comments"
        floating
        max="999"
        :offset-y="5"
      >
        <v-icon
          :size="24"
          variant="tonal"
          icon="mdi-comment-processing-outline"
          color="blue-lighten-2"
          @click="jumpToComment"
        >
        </v-icon>
      </v-badge>
      <v-icon v-else icon="mdi-backup-restore" @click="jumpToComment"></v-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { type BlogInfoDetail, type UserArticleInfo } from '../Blog.vue'

const props = withDefaults(
  defineProps<{
    blogInfoDetail: BlogInfoDetail
    userArticleInfo: UserArticleInfo
    /** 当前滚动的位置是否是在评论区 */
    isAtComment: boolean
  }>(),
  {
    isAtComment: false
  }
)
const emit = defineEmits(['likeArticle', 'jumpToComment'])

/** 点赞文章 */
const likeArticle = () => {
  emit('likeArticle')
}

/** 跳转到评论区 */
const jumpToComment = () => {
  emit('jumpToComment')
}
</script>

<style lang="scss">
.article-bottombar-wrapper {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 40px;
  z-index: 100;
  background: #fff;
  transition: all 0.3s;

  .count-icon-text {
    margin-left: 5px;
    color: #999;
  }
}
</style>
