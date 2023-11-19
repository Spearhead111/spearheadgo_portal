<template>
  <ul class="icon-list">
    <li>
      <v-badge :content="blogInfoDetail.like" color="grey-lighten-1">
        <v-btn
          class="ma-2"
          variant="tonal"
          icon="mdi-thumb-up"
          :color="userArticleInfo.isLiked ? 'red-lighten-1' : 'blue-lighten-2'"
          @click="likeArticle"
        ></v-btn>
      </v-badge>
    </li>
    <li>
      <v-badge :content="blogInfoDetail.comments" color="grey-lighten-1">
        <v-btn
          ref="commentsBtn"
          class="ma-2"
          variant="tonal"
          icon="mdi-comment-processing-outline"
          color="blue-lighten-2"
        ></v-btn>
      </v-badge>
    </li>
  </ul>
  <v-overlay
    :activator="commentsBtn"
    scroll-strategy="none"
    content-class="article-comments-drawer"
    style="z-index: 10000"
    v-model="showCommentsDrawer"
  >
    <ArticleComments
      class="article-comments"
      :articleId="blogInfoDetail.articleId"
      :article-author-id="(blogInfoDetail as BlogInfoDetail).authId"
      :article-comments="(blogInfoDetail as BlogInfoDetail).commentsList"
      :article-comments-count="(blogInfoDetail as BlogInfoDetail).commentsCount"
      :has-more-comments="(blogInfoDetail as BlogInfoDetail).commentsHasMore"
      :all-article-comments-count="(blogInfoDetail as BlogInfoDetail).comments"
      is-right-drawer
      @closeDrawer="showCommentsDrawer = false"
    >
    </ArticleComments>
  </v-overlay>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { type BlogInfoDetail, type UserArticleInfo } from '../Blog.vue'
import ArticleComments from '../Article-Comments/ArticleComments.vue'

const props = withDefaults(
  defineProps<{
    blogInfoDetail: BlogInfoDetail
    userArticleInfo: UserArticleInfo
  }>(),
  {}
)
const emit = defineEmits(['likeArticle', 'openComments'])

const commentsBtn = ref()
const showCommentsDrawer = ref(false)
/** 点赞文章 */
const likeArticle = () => {
  emit('likeArticle')
}
</script>

<style lang="scss">
.icon-list {
  position: fixed;
  top: 45%;
  left: calc(10% - 80px);
  display: flex;
  flex-direction: column;
  width: 48px;
  > li {
    margin-bottom: 20px;
    .v-btn {
      margin: 0 !important;
    }
    .v-badge__badge {
      color: #fff !important;
    }
  }
}
.article-comments-drawer {
  position: fixed;
  width: 500px;
  height: 100vh !important;
  overflow: auto;
  right: 0;
  .article-comments {
    height: 100%;
  }
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
