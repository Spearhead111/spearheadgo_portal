<template>
  <div class="article-bottombar-wrapper">
    <div>
      <v-icon
        ref="tableOfContentIconRef"
        :size="24"
        icon="mdi-table-of-contents"
        @click="openTableOfContent"
      >
      </v-icon>
      <v-overlay
        scroll-strategy="none"
        content-class="table-of-content-overlay"
        v-model="showTableOfContents"
      >
        <v-sheet ref="tableOfContentRef" class="table-of-content__sheet">
          <div class="table-of-content__sheet-header d-flex align-center justify-space-between">
            <span>导航目录</span>
            <v-icon
              class="table-of-content__close-icon"
              icon="mdi-window-close"
              @click="showTableOfContents = false"
            ></v-icon>
          </div>
          <div class="d-flex align-center justify-center">
            <span> —— 暂时没有了 ——</span>
          </div>
        </v-sheet>
      </v-overlay>
    </div>
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
import { nextTick, ref } from 'vue'
import { type BlogInfoDetail, type UserArticleInfo } from '../Blog.vue'
import { onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    blogInfoDetail: BlogInfoDetail
    userArticleInfo: UserArticleInfo
    /** 当前滚动的位置是否是在评论区 */
    isAtComment: boolean
    /** 导航目录元素 */
    navigationElement: HTMLElement | null
  }>(),
  {
    isAtComment: false
  }
)
const emit = defineEmits(['likeArticle', 'jumpToComment'])

const tableOfContentIconRef = ref() // 打开目录的触发icon
const tableOfContentRef = ref() // 目录父节点dom
const showTableOfContents = ref(false) // 是否展示手机端的目录

onMounted(() => {})

/** 打开目录 */
const openTableOfContent = () => {
  showTableOfContents.value = true
  nextTick(() => {
    if (!props.navigationElement) {
      return
    }
    const parentElement = tableOfContentRef.value?.$el as HTMLElement
    // 将目录元素挂在到容器中
    parentElement.insertBefore(props.navigationElement, parentElement.lastChild)
  })
}

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
  height: 50px;
  z-index: 100;
  background: #fff;
  transition: all 0.3s;

  .count-icon-text {
    margin-left: 5px;
    color: #999;
  }
}
.table-of-content-overlay {
  position: fixed;
  bottom: 0;
  width: 100%;
  .table-of-content__sheet {
    padding: 10px;
    min-height: 200px;
    max-height: 500px;
    overflow-y: auto;
    .table-of-content__sheet-header {
      > span {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  .table-of-content__sheet .v-note-navigation-wrapper {
    overflow-y: auto;
    .v-note-navigation-title {
      display: none;
      font-weight: bold;
      font-size: 18px;
      .v-note-navigation-close {
        display: none;
      }
    }
    .v-note-navigation-content {
      $basePadding: 15px;
      // 循环生成样式
      @for $i from 1 through 6 {
        h#{$i} {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-left: $basePadding * $i;
          font-size: 17px;
          color: rgb(var(--v-theme-primary)) !important;
          line-height: 1.5 !important;
          padding-right: 12px;
          margin: 2px 0;

          > a {
            font-family: 'SimHei', 'Microsoft YaHei', sans-serif !important;
            text-decoration: none !important; // 去除a标签下划线
            outline: none !important; // 去掉a标签默认轮廓
            &:hover {
              background: none !important;
            }
          }
          &:hover {
            color: #4e97e0 !important;
            text-decoration: none !important; // 去除a标签下划线
          }
        }
      }
    }
  }
}
</style>
