<template>
  <div style="overflow: auto" v-loading="loading">
    <v-btn
      v-if="props.type === BLOG_VISIBLE_TYPE.PREVIEW"
      @click="emit('update:previewVisible', false)"
      class="close-prview-blog-btn"
      color="deep-purple-accent-4"
      icon="mdi-close"
    >
    </v-btn>
    <div class="width-100 blog-header-banner">
      <img style="object-fit: cover; height: 100%; width: 100%" :src="blogInfoDetail.banner" />
      <div class="blog-title-container">
        <span class="blog-tittle">{{ blogInfoDetail.title }}</span>
        <div class="blog-info-content">
          <div>
            <people theme="two-tone" size="20" :fill="['#383838', '#f66002']" :strokeWidth="2" />
            {{ blogInfoDetail.auth || '' }}
          </div>
          <div>
            <calendar-dot
              class="mr-1"
              theme="multi-color"
              size="20"
              :fill="['#333', '#4a90e2', '#ffffff', '#ffffff']"
              :strokeWidth="2"
            />
            {{ formatDate(blogInfoDetail.createTime) }}
          </div>
          <div>
            <endocrine
              theme="multi-color"
              size="20"
              :fill="['#333', '#ec2941', '#f5a623', '#f5a623']"
              :strokeWidth="2"
            />
            <span>{{ blogInfoDetail.view }} 浏览</span>
          </div>
          <div>
            <comments
              theme="multi-color"
              size="20"
              :fill="['#333', '#f88e3f', '#FFF', '#5d92a5']"
              :strokeWidth="2"
            />
            <span>{{ blogInfoDetail.comments }} 评论</span>
          </div>
          <div>
            <Like
              theme="two-tone"
              size="20"
              :fill="['#8f8f8f', '#f8664e']"
              :strokeWidth="2"
              strokeLinecap="butt"
            />
            <span>{{ blogInfoDetail.like }} 点赞</span>
          </div>
        </div>
      </div>
    </div>
    <v-container class="blog-content-wrapper">
      <div>
        <star-one theme="filled" size="24" fill="#fcd53f" :strokeWidth="2" />
        <star-one theme="filled" size="24" fill="#fcd53f" :strokeWidth="2" />
        <star-one theme="filled" size="24" fill="#fcd53f" :strokeWidth="2" />
      </div>
      <h2 class="blog-subtitle">
        {{ blogInfoDetail.subtitle }}
      </h2>
      <v-divider :thickness="3" class="border-opacity-50 my-3" color="warning"></v-divider>
      <div class="mb-10">
        <v-chip
          class="mr-4"
          v-for="tag in blogInfoDetail.tags"
          :color="tag.color"
          variant="elevated"
          size="small"
          label
        >
          <v-icon start :color="tag.iconColor" :icon="tag.icon"></v-icon
          ><span class="tag-label">{{ tag.label }}</span>
        </v-chip>
      </div>
      <!-- ishljs:是否显示高亮 default-open="preview":只做预览展示 :editable="false":是否可编辑 -->
      <!-- subfield: true表示双栏，false表示单栏  :toolbarsFlag="false":是否显示编辑栏 -->
      <mavon-editor
        class="mavon-editor-show"
        v-model="blogInfoDetail.content"
        :ishljs="false"
        default-open="preview"
        :editable="false"
        :subfield="false"
        :toolbarsFlag="false"
        :boxShadow="false"
      />
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import { BLOG_VISIBLE_TYPE } from '@/constants/common'
import { ElMessage } from 'element-plus'
import { highlightCode } from '@/utils'
import { debounce, throttle } from 'lodash'
import { addCodeBtn } from '@/utils/mavon.js'
import {
  StarOne,
  People,
  Like,
  Comments,
  Endocrine,
  CalendarDot,
  Loading
} from '@icon-park/vue-next'
import { formatDate } from '@/utils'
import { type ArticleProfile } from '../Home/Home.vue'
import useArticleStore from '@/stores/modules/article'
import { useRoute, useRouter } from 'vue-router'

interface Tag {
  label: string
  color: string
  icon: string
  iconColor: string
  code: string
}

interface BlogInfoProp {
  title: string
  subtitle: string
  content: any
  banner: File | string
  desc: string
  tags: Tag[]
}

interface BlogInfoDetail extends ArticleProfile {
  content: string
}

interface Props {
  type?: string
  previewVisible?: boolean
  blogInfo?: BlogInfoProp
}
/** 设置默认值 */
const props = withDefaults(defineProps<Props>(), {
  type: BLOG_VISIBLE_TYPE.DETAIL,
  blogInfo: {
    title: '',
    subtitle: '',
    content: '',
    banner: '',
    desc: '',
    tags: []
  },
  previewVisible: false
})

const emit = defineEmits(['update:previewVisible'])

const route = useRoute()
const articleStore = useArticleStore()

const articleId = computed(() => route.query.articleId)
const blogInfoDetail = ref<BlogInfoDetail | BlogInfoProp>({
  title: '',
  subtitle: '',
  content: '',
  banner: '',
  desc: '',
  tags: [],
  auth: '',
  authId: '',
  articleId: '',
  createTime: 0,
  updateTime: 0,
  view: 0,
  comments: 0,
  like: 0
})
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  if (props.type === BLOG_VISIBLE_TYPE.DETAIL) {
    // 查看详情 接口获取数据
    const res = await articleStore.getArticleDetail(Number(articleId.value))
    if (res && res.result_code === 'success') {
      const data = res.data as any
      blogInfoDetail.value = {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        banner: data.banner,
        desc: data.description,
        tags: [],
        articleId: data.id,
        createTime: new Date(data.create_time).getTime(),
        updateTime: new Date(data.update_time).getTime(),
        view: data.view,
        comments: data.comments,
        like: data.like,
        auth: data.author,
        authId: data.authorId
      } as BlogInfoDetail
    } else {
    }
    // blogInfoDetail.value = { ...res, banner: res.bannerUrl }
  } else if (props.type === BLOG_VISIBLE_TYPE.PREVIEW) {
    blogInfoDetail.value = { ...props.blogInfo }
    // 判断传入的banner是string还是File，如果是file需要转换成url
    blogInfoDetail.value.banner =
      typeof props.blogInfo.banner === 'string'
        ? props.blogInfo.banner
        : window.URL.createObjectURL(props.blogInfo.banner)
  }
  loading.value = false
  /** 页面元素挂载渲染完毕后，高亮一次代码块 */
  nextTick(() => {
    highlightCode()
    addCodeBtn()
  })
})
</script>
