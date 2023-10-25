<template>
  <v-card rounded="lg" variant="elevated" :elevation="5" class="blog-profile-wrapper">
    <div class="profile-btn-wrapper">
      <!-- 编辑 -->
      <v-tooltip text="编辑">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-circle-edit-outline"
            color="orange-darken-1"
            size="x-small"
            @click="edit"
          >
          </v-btn>
        </template>
      </v-tooltip>
      <!-- 删除 -->
      <v-tooltip text="删除">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-delete-outline" color="red-accent-4" size="x-small">
            <v-icon class="mdi-delete-outline"></v-icon>
            <!-- 删除文章的二次确认框 -->
            <v-dialog v-model="deleteDialog" activator="parent" width="auto">
              <v-card>
                <v-card-text>
                  <tips theme="filled" size="18" fill="#fcd53f" :strokeWidth="2" />
                  确认删除此片文章吗？
                </v-card-text>
                <v-card-actions>
                  <div class="flex">
                    <v-btn size="small" variant="tonal" block @click="deleteDialog = false"
                      >取消</v-btn
                    >
                    <v-btn size="small" variant="tonal" block @click="deleteArticle">确认</v-btn>
                  </div>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
    <v-img class="align-end text-white profile-img" height="200" :src="articleProfile.banner" cover>
      <v-card-title v-html="highLightWord(articleProfile.title, highlightKey)"></v-card-title>
    </v-img>
    <v-card-subtitle class="pt-2"> {{ articleProfile.subtitle }} </v-card-subtitle>
    <v-card-subtitle class="pt-1" style="display: flex; align-items: center">
      <calendar-dot
        class="mr-1"
        theme="multi-color"
        size="17.5"
        :fill="['#333', '#4a90e2', '#ffffff', '#ffffff']"
        :strokeWidth="2"
      />
      发布于{{ formatDate(articleProfile.createTime) }}
    </v-card-subtitle>
    <v-card-text height="200" class="pt-1">
      <div
        class="blog-profile-text"
        v-html="highLightWord(articleProfile.desc, highlightKey)"
      ></div>
    </v-card-text>
    <div class="blog-profile-tag-wrapper">
      <v-chip
        v-for="tag in articleProfile.tags"
        :color="tag.color"
        variant="elevated"
        size="small"
        label
      >
        <v-icon start :color="tag.iconColor" :icon="tag.icon"></v-icon
        ><span class="tag-label">{{ tag.label }}</span>
      </v-chip>
    </div>
    <v-card-actions style="justify-content: space-between">
      <div class="blog-profile-icon-wrapper">
        <div>
          <endocrine
            theme="multi-color"
            size="17.5"
            :fill="['#333', '#ec2941', '#f5a623', '#f5a623']"
            :strokeWidth="2"
          />
          <span>{{ articleProfile.view }} 浏览</span>
        </div>
        <div>
          <comments
            theme="multi-color"
            size="17.5"
            :fill="['#333', '#f88e3f', '#FFF', '#5d92a5']"
            :strokeWidth="2"
          />
          <span>{{ articleProfile.comments }} 评论</span>
        </div>
        <div>
          <Like
            theme="two-tone"
            size="17.5"
            :fill="['#8f8f8f', '#f8664e']"
            :strokeWidth="2"
            strokeLinecap="butt"
          />
          <span>{{ articleProfile.like }} 点赞</span>
        </div>
      </div>
      <v-btn
        border
        variant="text"
        class="text-none"
        append-icon="mdi-chevron-right"
        color="teal-lighten-1"
        @click="showMore"
      >
        了解详细
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Tips, Like, Comments, Endocrine, CalendarDot, Edit } from '@icon-park/vue-next'
import { formatDate, highLightWord } from '@/utils'
import { debounce, throttle } from 'lodash'
import './style.scss'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface Tag {
  label: string
  color: string
  icon: string
  iconColor: string
  code: string
}

interface ArticleProfile {
  articleId: string
  title: string
  subtitle: string
  banner: string
  createTime: number
  desc: string
  tags: Tag[]
  view: number
  comments: number
  like: number
}

const { articleProfile, highlightKey } = defineProps<{
  articleProfile: ArticleProfile
  highlightKey: string // 搜索的高亮关键字
}>()

const router = useRouter()
const deleteDialog = ref(false) // 删除文章的二次确认dialog

/** 跳转到编辑界面 */
const edit = () => {
  router.push({
    name: 'Write',
    query: {
      type: 'edit',
      articleId: articleProfile.articleId
    }
  })
}

/** 删除文章 */
const deleteArticle = () => {
  console.log(`删除这篇文章${articleProfile.articleId}`)
  deleteDialog.value = false
  ElMessage.success('删除成功')
}

/** 查看文章详情 */
const showMore = () => {
  router.push({
    name: 'ArticleDetail',
    query: {
      articleId: articleProfile.articleId
    }
  })
}
</script>
