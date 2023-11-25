<template>
  <v-card elevation="8" rounded="0" style="color: rgb(var(--v-theme-primary))">
    <v-card-item>
      <v-card-title class="text-center">
        <div v-if="isRightDrawer" class="flex justify-space-between">
          <span>{{ `评论 (${allArticleCommentsCount})` }}</span>
          <v-icon icon="mdi-window-close" @click="closeDrawer"></v-icon>
        </div>
        <v-icon icon="mdi-comment-text-multiple-outline"></v-icon> Comments
      </v-card-title>
      <v-card-subtitle> 欢迎交流 </v-card-subtitle>
      <v-form ref="formRef" class="mb-4" style="text-align: end">
        <v-textarea
          v-if="getUserId"
          v-model="content"
          :rules="rules.content"
          variant="outlined"
          rows="2"
          density="compact"
          counter="255"
          placeholder="一起交流一下吧..."
        ></v-textarea>
        <div v-else class="comment-login-tips">
          <span>您需要先<span class="login-span" @click="jumpToLogin">登录</span>才能发布评论</span>
        </div>
        <v-btn color="deep-orange-accent-4" rounded @click="sendComment('comment')">评论</v-btn>
      </v-form>
      <div class="comment-list-box">
        <div class="comment-list-item" v-for="(comment, index) in articleComments">
          <div class="flex py-4">
            <v-avatar size="32">
              <v-img cover :src="comment.commentByAvatar"></v-img>
            </v-avatar>
            <div class="primary-comment-wrapper">
              <div class="comment-header">
                <div class="flex flex-row flex-1-1 justify-space-between mr-2">
                  <div class="commenter-info">
                    <span class="name">{{ comment.commentBy }}</span>
                    <span v-if="articleAuthorId === comment.commentById" class="commenter-role"
                      >作者</span
                    >
                    <span>{{ formatTime(comment.createTime, 'YYYY.MM.DD') }}</span>
                  </div>
                  <div class="comment-actions">
                    <!-- 更多操作按钮 -->
                    <v-menu
                      attach="comment-actions"
                      :offset-x="-100"
                      open-on-hover
                      open-delay="0"
                      close-delay="0"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon
                          v-if="hasAuth(comment.commentById)"
                          v-bind="props"
                          icon="mdi-dots-horizontal"
                          style="cursor: pointer"
                        ></v-icon>
                      </template>

                      <v-list style="padding: 0">
                        <v-list-item style="padding: 0">
                          <v-btn
                            variant="text"
                            v-if="hasAuth(comment.commentById)"
                            @click="deleteComment(comment.id, 'article')"
                          >
                            删除
                          </v-btn>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <!-- 回复按钮 -->
                    <div style="cursor: pointer" @click="showReplyContent(comment.id)">
                      <v-icon size="20" class="ma-0 mr-1" icon="mdi-comment-outline"></v-icon
                      >{{ replyContentShowMap.get(String(comment.id)) ? '收起' : '回复' }}
                    </div>
                  </div>
                </div>
                <!-- 点赞 -->
                <span>
                  <span
                    v-if="comment.commentLikes"
                    :style="{ color: comment.isLiked ? '#EF5350' : '#fff' }"
                    >{{ comment.commentLikes }}</span
                  >
                  <v-icon
                    class="like-icon"
                    :color="comment.isLiked ? 'red-lighten-1' : 'grey-darken-4'"
                    :icon="comment.isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
                    @click="likeComment(comment, 'article')"
                  />
                </span>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <v-form
                v-if="replyContentShowMap.get(String(comment.id))"
                ref="replyFormRef"
                class="pb-3"
                style="text-align: end"
              >
                <v-textarea
                  v-if="getUserId"
                  v-model="replyContent"
                  :rules="rules.content"
                  variant="outlined"
                  rows="2"
                  density="compact"
                  counter="255"
                  :placeholder="`回复： ${comment.commentBy}`"
                ></v-textarea>
                <div v-else class="comment-login-tips">
                  <span
                    >您需要先<span class="login-span" @click="jumpToLogin">登录</span
                    >才能发布评论</span
                  >
                </div>
                <v-btn
                  color="deep-orange-accent-4"
                  rounded
                  size="small"
                  @click="sendComment('reply', comment.id, comment.id, true)"
                  >评论</v-btn
                >
              </v-form>
            </div>
          </div>
          <ul class="comment-reply-wrapper">
            <template v-for="(replyComment, idx) in comment.replyComment">
              <li class="comment-reply-item" v-if="comment.showAll || idx === 0">
                <v-avatar size="24">
                  <v-img cover :src="replyComment.commentByAvatar"></v-img>
                </v-avatar>
                <div class="primary-comment-wrapper secondly-comment-wrapper">
                  <div class="comment-header">
                    <div class="flex flex-row flex-1-1 justify-space-between mr-2">
                      <div class="commenter-info">
                        <span class="name">{{ replyComment.commentBy }}</span>
                        <span
                          v-if="articleAuthorId === replyComment.commentById"
                          class="commenter-role"
                          >{{ '作者' }}</span
                        >
                        <template v-if="!replyComment.isReplyToTop">
                          <span>回复</span>
                          <span class="name">{{ replyComment.replyTo }}</span>
                        </template>
                        <span>{{ formatTime(replyComment.createTime, 'YYYY.MM.DD') }}</span>
                      </div>
                      <div class="comment-actions">
                        <!-- 更多操作按钮 -->
                        <v-menu
                          attach="comment-actions"
                          :offset-x="-100"
                          open-on-hover
                          open-delay="0"
                          close-delay="0"
                        >
                          <template v-slot:activator="{ props }">
                            <v-icon
                              v-if="hasAuth(replyComment.commentById)"
                              v-bind="props"
                              icon="mdi-dots-horizontal"
                              style="cursor: pointer"
                            ></v-icon>
                          </template>

                          <v-list style="padding: 0">
                            <v-list-item style="padding: 0">
                              <v-btn
                                variant="text"
                                v-if="hasAuth(replyComment.commentById)"
                                @click="deleteComment(replyComment.id, 'reply')"
                              >
                                删除
                              </v-btn>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <!-- 回复按钮 -->
                        <div style="cursor: pointer" @click="showReplyContent(replyComment.id)">
                          <v-icon size="20" class="ma-0 mr-1" icon="mdi-comment-outline"></v-icon
                          >{{ replyContentShowMap.get(String(replyComment.id)) ? '收起' : '回复' }}
                        </div>
                      </div>
                    </div>
                    <!-- 点赞 -->
                    <span>
                      <span
                        v-if="replyComment.commentLikes"
                        :style="{ color: replyComment.isLiked ? '#EF5350' : '#fff' }"
                        >{{ replyComment.commentLikes }}</span
                      >
                      <v-icon
                        class="like-icon"
                        :color="replyComment.isLiked ? 'red-lighten-1' : 'grey-darken-4'"
                        :icon="replyComment.isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
                        @click="likeComment(replyComment, 'reply')"
                      />
                    </span>
                  </div>
                  <div class="comment-content-text">{{ replyComment.content }}</div>
                  <v-form
                    v-if="replyContentShowMap.get(String(replyComment.id))"
                    ref="replyFormRef"
                    class="pb-3"
                    style="text-align: end"
                  >
                    <v-textarea
                      v-if="getUserId"
                      v-model="replyContent"
                      :rules="rules.content"
                      variant="outlined"
                      rows="2"
                      density="compact"
                      counter="255"
                      :placeholder="`回复： ${comment.commentBy}`"
                    ></v-textarea>
                    <div v-else class="comment-login-tips">
                      <span
                        >您需要先<span class="login-span" @click="jumpToLogin">登录</span
                        >才能发布评论</span
                      >
                    </div>
                    <v-btn
                      color="deep-orange-accent-4"
                      rounded
                      size="small"
                      @click="sendComment('reply', comment.id, replyComment.id, false)"
                      >评论</v-btn
                    >
                  </v-form>
                </div>
              </li>
            </template>
            <v-chip
              class="ml-6 mt-1"
              size="small"
              v-if="!comment.showAll && comment.replyComment.length > 1"
              @click="comment.showAll = true"
            >
              查看全部 {{ comment.replyComment.length }} 条回复
              <v-icon end icon="mdi-chevron-down"></v-icon>
            </v-chip>
          </ul>
        </div>
        <v-chip v-if="hasMoreComments" class="more-comments-btn" @click="showMoreComments"
          >查看更多评论
          <v-icon end icon="mdi-chevron-down"></v-icon>
        </v-chip>
        <v-chip v-else class="ml-6 mt-1 more-comments-btn" size="small">暂无更多评论</v-chip>
      </div>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, nextTick } from 'vue'
import './style.scss'
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/modules/user'
import { ElMessage } from 'element-plus'
import { errorCodeMap, formatTime } from '@/utils'
import useArticleStore from '@/stores/modules/article'
import { USER_ROLE_MAP } from '@/constants'
import { useRoute, useRouter } from 'vue-router'

export interface ReplyComment {
  id: number
  content: string
  commentBy: string
  commentById: string
  createTime: number
  commentByAvatar: string
  commentLikes: number
  replyTo: string
  isLiked: boolean // 当前用户是否点赞
  isReplyToTop: boolean // 是否是回复的文章顶级评论
}

export interface ArticleComments {
  id: number // 文章评论
  content: string // 评论内容
  commentBy: string // 评论者
  commentById: string // 评论者id
  createTime: number // 评论时间
  commentByAvatar: string // 评论人头像
  commentLikes: number // 评论点赞数
  replyComment: ReplyComment[] // 评论的回复
  showAll: boolean
  isLiked: boolean // 当前用户是否点赞
}

const props = withDefaults(
  defineProps<{
    articleId?: number
    articleAuthorId?: string
    articleComments?: ArticleComments[]
    articleCommentsCount?: number
    hasMoreComments?: boolean
    allArticleCommentsCount?: number
    isRightDrawer?: boolean
  }>(),
  {
    isRightDrawer: false
  }
)
const emit = defineEmits(['closeDrawer'])
const route = useRoute()
const router = useRouter()
/** 博客组件的provide */
const blogProvide = inject<Record<string, any>>('blogProvide')
const articleStore = useArticleStore()
const { getUserId, getRole } = storeToRefs(useUserStore())
const content = ref('') // 评论内容
const replyContent = ref('') // 回复评论内容
const formRef = ref() // 评论的内容form
const replyFormRef = ref() // 回复评论的内容form
const replyContentShowMap = ref<Map<string, boolean>>(new Map<string, boolean>()) // 用于存储评论回复框是否展开
const rules = ref<any>({
  content: [
    (v: string) => {
      if (v && v.length > 255) {
        return '评论内容不能超过255个字符'
      }
    }
  ]
})

onMounted(() => {})

/**
 * 发送评论
 * @param type 评论类型 评论文章/回复评论
 * @param belongCommentId 属于哪个评论底下
 * @param replyToCommentId 回复的评论
 * @param isReplyToTop 回复的是不是一级评论
 */
const sendComment = async (
  type: string,
  belongCommentId?: string | number,
  replyToCommentId?: string | number,
  isReplyToTop?: boolean
) => {
  const comment = type === 'comment' ? content.value.trim() : replyContent.value.trim()
  if (!comment) {
    // 判断评论是否是空
    return
  } else if (!getUserId.value) {
    // 判断是否登录，评论功能需要登录才能使用
    return ElMessage.warning('请先登录')
  } else if (comment.length > 255) {
    return
  }

  let res: any
  if (type === 'comment') {
    // 直接评论文章
    const params = {
      content: comment,
      articleId: props.articleId
    }
    res = await articleStore.sendArticleComment(params)
  } else {
    // 对文章的评论进行评论
    const params = {
      content: comment,
      articleId: props.articleId,
      belongCommentId: belongCommentId,
      replyToCommentId: replyToCommentId,
      isReplyToTop: isReplyToTop ? 1 : 0
    }
    res = await articleStore.sendArticleCommentReply(params)
  }

  if (res && res.result_code === 'success') {
    ElMessage.success('评论成功')
    // 评论成功，重置表单
    content.value = ''
    replyContent.value = ''
    replyContentShowMap.value = new Map<string, boolean>()
    // 刷新评论
    // 由于评论有两个位置，一个在blog下，一个在左侧article-sidebar中通过评论按钮点出
    // 两个评论组件一个是blog的子组件，一个是孙组件 不用直接传参了，用依赖注入
    // emit('refreshComment')
    blogProvide?.getArticleComment()
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message || '评论失败'))
  }
}

/** 展开和关闭当前的评论回复框 */
const showReplyContent = (id: string | number) => {
  id = String(id)
  replyContent.value = ''
  if (replyContentShowMap.value.has(id)) {
    // 如果有记录，说明之前是展开的(之前就是操作的这一个)。现在将其关闭
    const val = replyContentShowMap.value.get(id)
    replyContentShowMap.value.set(id, !val)
  } else {
    // 如果没记录，说明之前操作的是别的评论，将map重置然后记录一个打开的
    replyContentShowMap.value = new Map<string, boolean>()
    replyContentShowMap.value.set(id, true)
  }
}

/** 查看更多评论 */
const showMoreComments = () => {
  blogProvide?.getArticleComment(true)
}

/**
 * 删除评论
 * @param commentId 评论的id
 * @param type 评论的类型 article:文章评论  reply:评论的回复
 */
const deleteComment = async (commentId: number | string, type: 'article' | 'reply') => {
  const params = {
    articleId: props.articleId,
    commentId: String(commentId),
    type: type === 'article' ? 0 : 1
  }
  const res = await articleStore.deleteArticleComment(params)
  if (res && res.result_code === 'success') {
    ElMessage.success('删除成功')
    blogProvide?.getArticleComment()
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message || '删除失败'))
  }
}

/**
 * 点赞评论
 * @param commentId 评论的id
 * @param type 评论的类型 article:文章评论  reply:评论的回复
 */
const likeComment = async (comment: ReplyComment | ArticleComments, type: 'article' | 'reply') => {
  const params = {
    articleId: props.articleId,
    commentId: comment.id,
    type: type === 'article' ? 0 : 1
  }
  const res = await articleStore.likeArticleComment(params)
  if (res && res.result_code === 'success') {
    if (comment.isLiked) {
      comment.commentLikes -= 1
      comment.isLiked = false
    } else {
      comment.commentLikes += 1
      comment.isLiked = true
    }
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message || '点赞失败'))
  }
}

/** 当前用户是否有权限删除评论 */
const hasAuth = (commentById: string) => {
  // 只有ROOT用户或者文章作者或者评论者本人能删除评论
  return (
    getRole.value === USER_ROLE_MAP.ROOT ||
    getUserId.value === props.articleAuthorId ||
    getUserId.value === commentById
  )
}

/** 关闭评论drawer */
const closeDrawer = () => {
  emit('closeDrawer')
}

/** 跳转到登录页面 */
const jumpToLogin = () => {
  localStorage.setItem('scrollTop', window.scrollY + '')
  router.push({
    path: 'login',
    query: {
      from: route.fullPath
    }
  })
}
</script>
