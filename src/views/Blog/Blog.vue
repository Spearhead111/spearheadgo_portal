<template>
  <div ref="blogEleRef" v-loading="loading" style="overflow: auto">
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
            {{ blogInfoDetail.auth || userInfo.nickname }}
          </div>
          <div>
            <calendar-dot
              class="mr-1"
              theme="multi-color"
              size="20"
              :fill="['#333', '#4a90e2', '#ffffff', '#ffffff']"
              :strokeWidth="2"
            />
            {{ formatTime(blogInfoDetail.createTime || new Date(), 'YYYY-MM-DD HH:MM') }}
          </div>
          <div class="hidden-xs">
            <endocrine
              theme="multi-color"
              size="20"
              :fill="['#333', '#ec2941', '#f5a623', '#f5a623']"
              :strokeWidth="2"
            />
            <span>{{ blogInfoDetail.view || 0 }} 浏览</span>
          </div>
          <div class="hidden-xs">
            <comments
              theme="multi-color"
              size="20"
              :fill="['#333', '#f88e3f', '#FFF', '#5d92a5']"
              :strokeWidth="2"
            />
            <span>{{ blogInfoDetail.comments || 0 }} 评论</span>
          </div>
          <div class="hidden-xs">
            <Like
              theme="two-tone"
              size="20"
              :fill="['#8f8f8f', '#f8664e']"
              :strokeWidth="2"
              strokeLinecap="butt"
            />
            <span>{{ blogInfoDetail.like || 0 }} 点赞</span>
          </div>
        </div>
      </div>
    </div>
    <ArticleSidebar
      class="hidden-xs"
      v-if="props.type === BLOG_VISIBLE_TYPE.DETAIL"
      :blogInfoDetail="blogInfoDetail"
      :userArticleInfo="userArticleInfo"
      @likeArticle="likeArticle"
      @openComments="openComments"
    ></ArticleSidebar>
    <v-container class="blog-content-wrapper">
      <!-- <div>
        <star-one theme="filled" size="24" fill="#fcd53f" :strokeWidth="2" />
        <star-one theme="filled" size="24" fill="#fcd53f" :strokeWidth="2" />
        <star-one theme="filled" size="24" fill="#fcd53f" :strokeWidth="2" />
      </div> -->
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
        class="mavon-editor-show mb-12"
        ref="mavonEditorRef"
        v-model="blogInfoDetail.content"
        :ishljs="false"
        default-open="preview"
        :editable="false"
        :subfield="false"
        :toolbarsFlag="false"
        :boxShadow="false"
        :navigation="true"
      />
      <div class="d-flex align-center justify-center mb-5">
        <span style="color: #90a4ae">{{
          `—— 更新于 ${formatTime(
            (blogInfoDetail as BlogInfoDetail).updateTime,
            'YYYY-MM-DD HH:MM'
          )} ——`
        }}</span>
      </div>
      <v-divider class="hidden-xs" :thickness="10"></v-divider>
      <ArticleComments
        v-if="type === BLOG_VISIBLE_TYPE.DETAIL"
        class="hidden-xs"
        :articleId="(blogInfoDetail as BlogInfoDetail).articleId"
        :article-author-id="(blogInfoDetail as BlogInfoDetail).authId"
        :article-comments="(blogInfoDetail as BlogInfoDetail).commentsList"
        :article-comments-count="(blogInfoDetail as BlogInfoDetail).commentsCount"
        :has-more-comments="(blogInfoDetail as BlogInfoDetail).commentsHasMore"
      />
    </v-container>
    <!-- 这个专门给手机端适配的 -->
    <v-divider class="d-flex d-sm-none" :thickness="10"></v-divider>
    <div class="d-sm-none" ref="phoneArticleCommentsRef">
      <ArticleComments
        class="d-sm-none"
        v-if="type === BLOG_VISIBLE_TYPE.DETAIL"
        :articleId="(blogInfoDetail as BlogInfoDetail).articleId"
        :article-author-id="(blogInfoDetail as BlogInfoDetail).authId"
        :article-comments="(blogInfoDetail as BlogInfoDetail).commentsList"
        :article-comments-count="(blogInfoDetail as BlogInfoDetail).commentsCount"
        :has-more-comments="(blogInfoDetail as BlogInfoDetail).commentsHasMore"
      />
    </div>

    <!-- 手机端的底部bar -->
    <template v-if="type === BLOG_VISIBLE_TYPE.DETAIL">
      <BottomActionBar
        v-show="showBottomBar"
        ref="bottomActionBarRef"
        class="d-sm-none animate__animated animate__fadeInUp"
        :blogInfoDetail="blogInfoDetail"
        :userArticleInfo="userArticleInfo"
        :isAtComment="isAtComment"
        @likeArticle="likeArticle"
        @jumpToComment="jumpToComment"
      ></BottomActionBar>
    </template>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { ref, nextTick, onMounted, onUnmounted, computed, provide, createApp, h } from 'vue'
import { BLOG_VISIBLE_TYPE } from '@/constants/common'
import { ElImage, ElMessage } from 'element-plus'
import { errorCodeMap, highlightCode, formatTime } from '@/utils'
import { debounce, throttle } from 'lodash'
//@ts-ignore
import { addCodeBtn } from '@/utils/mavon.js'
import { People, Like, Comments, Endocrine, CalendarDot } from '@icon-park/vue-next'
import { type ArticleProfile } from '../Home/Home.vue'
import useArticleStore from '@/stores/modules/article'
import { useRoute, useRouter } from 'vue-router'
import { type Tag } from '../Home/Home.vue'
import useUserStore from '@/stores/modules/user'
import { storeToRefs } from 'pinia'
import { type BlogInfo } from '../Write/Write.vue'
import ArticleComments from './Article-Comments/ArticleComments.vue'
import ArticleSidebar from './Article-Sidebar/ArticleSidebar.vue'
import BottomActionBar from './Bottom-Action-Bar/BottomActionBar.vue'

export interface BlogInfoDetail extends ArticleProfile {
  /** 文章内容 */
  content: string
  /** 文章的一级评论数 */
  commentsCount: number
  /** 文章评论(非全量，按分页的形式获取) */
  commentsList: any[]
  /** 除了当前commentsList的评论外，是否还有评论 */
  commentsHasMore: boolean
}

interface Props {
  type?: string
  previewVisible?: boolean
  blogInfo?: BlogInfo
}

export interface UserArticleInfo {
  isLiked: boolean
}
/** 设置默认值 */
const props = withDefaults(defineProps<Props>(), {
  type: BLOG_VISIBLE_TYPE.DETAIL,
  previewVisible: false
})

const emit = defineEmits(['update:previewVisible'])
const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const userStore = useUserStore()
const { userInfo, getUserId } = storeToRefs(userStore)
const commentPageNo = ref(1)
const commentPageSize = ref(10)
const blogEleRef = ref<HTMLElement | null>(null)
const phoneArticleCommentsRef = ref<HTMLElement | null>(null) // 手机端的评论
const bottomActionBarRef = ref<HTMLElement | null>(null) // 手机端底部bottomBar
const bodyTextPos = ref(0) // 跳转到评论区之前的正文位置
const commentPos = ref(0) // 从评论区跳转回正文之前所在的位置
const isAtComment = ref(false) // 当前滚动距离是否在评论区
const lastScrollPosition = ref(0) // 上一次的滚动距离
const showBottomBar = ref(true) // 手机端的bottomBar是否展示
/** 导航目录 */
const navigationElement = ref<HTMLElement | null>(null)
const mavonEditorRef = ref(null)
const articleId = computed(() => route.query.articleId)
/** 文章详情 */
const blogInfoDetail = ref<BlogInfoDetail | any>({
  title: '',
  subtitle: '',
  content: '',
  banner: '',
  desc: '',
  tags: [],
  auth: '',
  authId: '',
  articleId: -1,
  createTime: 0,
  updateTime: 0,
  view: 0,
  comments: 0,
  like: 0
})
/** 当前用户与文章的关联信息 */
const userArticleInfo = ref<UserArticleInfo>({
  isLiked: false
})
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  if (props.type === BLOG_VISIBLE_TYPE.DETAIL) {
    await Promise.all([getArticleDetail(), getArticleComment(), getArticleUserInfo()])
    window.addEventListener('scroll', bottomBarScrollFunc)
  } else if (props.type === BLOG_VISIBLE_TYPE.PREVIEW) {
    blogInfoDetail.value = { ...props.blogInfo }
    // 判断传入的banner是string还是File，如果是file需要转换成url
    blogInfoDetail.value.banner =
      typeof props.blogInfo?.banner === 'string'
        ? props.blogInfo.banner
        : window.URL.createObjectURL(props.blogInfo?.banner || new Blob())
    initAfterBlogDone()
  }
  loading.value = false
})

onUnmounted(() => {
  ;(props.type === BLOG_VISIBLE_TYPE.DETAIL ? window : blogEleRef.value)?.removeEventListener(
    'scroll',
    navigationScroll
  )
  window.removeEventListener('scroll', bottomBarScrollFunc)
})

/** 手机端底部的操作bar向上滚动展示事件，在这里顺便处理一下评论和正文来回跳转位置的判断逻辑 */
const bottomBarScrollFunc = () => {
  if (!bottomActionBarRef.value) {
    return
  }
  const currentScrollPosition = window.scrollY
  // 判断一下当前的滚动距离的位置是否在评论区内
  const phoneArticleCommentsTop = phoneArticleCommentsRef.value!.getBoundingClientRect().top
  // phoneArticleCommentsTop 为评论区域距离当前视口的top的距离
  isAtComment.value = phoneArticleCommentsTop < window.innerHeight
  // if (!isAtComment.value) {
  //   bodyTextPos.value = window.scrollY
  // }

  // 用最后一次的滚动位置和当前的滚动位置进行比较
  if (currentScrollPosition > lastScrollPosition.value) {
    showBottomBar.value = false
  } else {
    showBottomBar.value = true
  }
  lastScrollPosition.value = currentScrollPosition
}

/** 文章内容渲染完毕后：高亮代码，导航目录添加href跳转 */
const initAfterBlogDone = async () => {
  /** 页面元素挂载渲染完毕后，高亮一次代码块 */
  await nextTick(() => {
    highlightCode()
    addCodeBtn()
    addImgClickFunc()
  })
  // 导航目录添加href跳转, 这里因为nexttick后不在目录渲染完毕的时机，所以延迟500ms执行
  setTimeout(() => {
    addNavigationUrl()
    navigationElement.value = (
      props.type === BLOG_VISIBLE_TYPE.DETAIL ? document : blogEleRef.value
    )?.querySelector('.v-note-navigation-wrapper') as HTMLElement
    // 添加滚动事件，确保导航目录的位置
    ;(props.type === BLOG_VISIBLE_TYPE.DETAIL ? window : blogEleRef.value)?.addEventListener(
      'scroll',
      navigationScroll
    )
  }, 500)
}

/** 获取文章详情 */
const getArticleDetail = async () => {
  // 查看详情 接口获取数据
  const res = await articleStore.getArticleDetail(Number(articleId.value))
  if (res && res.result_code === 'success') {
    const data = res.data as any
    // 这里接口的定义很混乱，但是暂时不想改前后端了😂 以后心情好了调整一下
    blogInfoDetail.value = {
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
      banner: data.banner,
      desc: data.desc,
      tags: data.categories,
      articleId: data.id,
      createTime: new Date(data.createTime).getTime(),
      updateTime: new Date(data.updateTime).getTime(),
      view: data.view,
      comments: data.commentCount,
      like: data.likeCount,
      auth: data.author.nickname,
      authId: data.author.id
    } as BlogInfoDetail
    initAfterBlogDone()
  } else {
    return ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/**
 * 获取文章评论
 * @param moreComments 用于判断是否为加载更多评论，false刷新整个屏幕
 */
const getArticleComment = async (moreComments = false) => {
  if (moreComments) {
    commentPageNo.value++
  }
  const params = {
    articleId: articleId.value,
    pageNo: commentPageNo.value,
    pageSize: commentPageSize.value
  }
  const res = await articleStore.getArticleComment(params)
  if (res && res.result_code === 'success') {
    const data = res.data as any
    blogInfoDetail.value.commentsCount = data.total
    // 判断是否为加载更多评论，如果是加载更多评论则直接拼接新获取的评论
    blogInfoDetail.value.commentsList = moreComments
      ? blogInfoDetail.value.commentsList.concat(data.list)
      : data.list
    blogInfoDetail.value.commentsHasMore = data.has_next
  } else {
    return ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

const getArticleUserInfo = async () => {
  if (!getUserId.value) {
    return
  }
  const params = {
    articleId: articleId.value
  }
  const res = await articleStore.getArticleUserInfo(params)
  if (res && res.result_code === 'success') {
    userArticleInfo.value = res.data as any
  } else {
    return ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** 打开侧边栏的评论 */
const openComments = () => {}

/** 点赞文章 */
const likeArticle = async () => {
  if (!getUserId.value) {
    return ElMessage.warning('请先登录')
  }
  const params = {
    articleId: articleId.value
  }
  const res = await articleStore.likeArticle(params)
  if (res && res.result_code === 'success') {
    // 判断当前用户之前是否点赞
    ;(blogInfoDetail.value as BlogInfoDetail).like += userArticleInfo.value.isLiked ? -1 : 1
    userArticleInfo.value.isLiked = !userArticleInfo.value.isLiked
  } else {
    return ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** 给导航目录添加一个滚动监听 */
const navigationScroll = () => {
  if (!navigationElement.value) {
    return
  }
  // 页面滚动值
  const scrollTop = (
    props.type === BLOG_VISIBLE_TYPE.DETAIL ? document.documentElement : blogEleRef.value
  )?.scrollTop as number
  if (scrollTop > window.innerHeight) {
    navigationElement.value.setAttribute(
      'style',
      'position: fixed !important; top: 0 !important; width: 16% !important; top: 80px !important; right: 2% !important; z-index:1503 !important;'
    )
  } else if (scrollTop < window.innerHeight * 0.4) {
    navigationElement.value.removeAttribute('style')
  }
}

/** 给mavon-editor的导航添加href，实现能通过导航目录跳转 */
const addNavigationUrl = () => {
  let _aList = document.querySelectorAll('.v-note-navigation-content a')
  for (let i = 0; i < _aList.length; i++) {
    // 获取一下a标签的父元素，因为要获取到目录text
    let aParent = _aList[i].parentNode as HTMLElement
    let a = aParent.firstChild as HTMLAnchorElement
    if (!a.id) continue // 过滤不属于导航中的a标签去掉
    let text = aParent.innerText
    a.innerText = text
    // mavon-editor原来的导航目录里的a标签内无text内容，详细结构见网页中初始的导航目录html
    // 这里将文字放入a标签中
    aParent.innerHTML = ''
    aParent.appendChild(a)
    aParent.onclick = (event) => {
      event.preventDefault()
      // 添加跳转回调
      scrollToAnchor(a.id)
    }
  }
}

/** 跳转到锚点 */
const scrollToAnchor = (anchor: string) => {
  // 这里也有预览和详情之分，预览比较特殊，预览是渲染在弹窗内的，得用根节点blogEleRef来进行处理
  const targetElement = BLOG_VISIBLE_TYPE.DETAIL
    ? document.getElementById(anchor)
    : (blogEleRef.value?.querySelector(getEleId(anchor)) as HTMLElement)
  if (targetElement) {
    // 判断是预览还是详情，因为预览状态的blog是在write页面中以一个弹窗出现的，不能使用window来实现滚动
    // 两种状态下的滚动距离也不一样
    ;(props.type === BLOG_VISIBLE_TYPE.DETAIL ? window : blogEleRef.value)?.scrollTo({
      top: targetElement.offsetTop + (props.type === BLOG_VISIBLE_TYPE.DETAIL ? 400 : 200),
      behavior: 'smooth'
    })
  }
  // 借助animate.css实现动画效果来高亮跳转的锚点
  targetElement?.parentElement?.setAttribute('class', 'animate__animated animate__flash')
  // 为了使同一锚点能再次触发，再remove原来的动画类名
  setTimeout(() => {
    targetElement?.parentElement?.setAttribute('class', '')
  }, 1000)
}

/** 这里的次级标题a锚点的id可能带有两个'_'，这被css选择器看作是无效的，需要做一下转义 */
const getEleId = (id: string) => {
  return id.replace('__', '\\__')
}

/** 给文章中的图片添加点击事件 */
const addImgClickFunc = () => {
  const imgs = document.querySelectorAll('.v-show-content img') as NodeListOf<HTMLImageElement>
  imgs.forEach((img: HTMLImageElement) => {
    const parentEle = img.parentElement as HTMLElement
    // 创建一个 elementImg 并挂载到 parentEle 上，这个 mount(parentEle) 会替换 parentEle 上的所有元素
    const width = img.getAttribute('width')
    const height = img.getAttribute('height')
    const elImg = createApp({
      render() {
        return h(ElImage, {
          src: img.src,
          alt: img.alt,
          zIndex: 9000,
          hideOnClickModal: true,
          // fit: 'cover',
          style: { width, height },
          previewSrcList: [img.src],
          onClose: () => {
            // 按下esc关闭时恢复html的overflow样式
            document.documentElement.removeAttribute('style')
            // 关闭蒙层重置外层祖先元素的z-index
            ;(mavonEditorRef.value as any)?.$el.removeAttribute('style')
          },
          onShow: () => {
            // 先看下面的逻辑再看这一行
            // 下面改变z-index后，蒙层下的页面因为z-index的改变导致header或被遮挡
            // 我的header有个逻辑是向下滚动的时候隐藏，这里把他向下滚动1px隐藏掉
            window.scrollBy(0, 1)
            // 在打开放大图片时设置html的 'overflow: hidden;' 放大图片不能滚动页面
            document.documentElement.setAttribute('style', 'overflow: hidden;')
            // 这里踩了一个坑：类似于下面的层级结构
            /*
            <div style="position: 'fixed';z-index: 5;">A</div>
            <div class="box">
                <div style="position: 'fixed';z-index: 6;">B</div>
            </div>
            .box {
                position: relative;
            } */
            // 解决方案：
            // 1.设置box的层级大于A的
            // 2.box不要设置position属性（或者为static）
            // 一般原则：
            // 1.遵循dom规则，同级后者居上
            // 2.有定位的高于无定位的元素
            // 3.都有定位的同级元素，z-index大者居上
            // 4.非同级元素且祖先元素设置了非static的position值时，则会忽略本身的z-index，取与对比元素同级的祖先元素的z-index属性，大者居上。
            // 所以这里我在放大图片出现蒙层的时候给外侧元素添加一个大的z-index，再关闭蒙层的时候再重置回去
            ;(mavonEditorRef.value as any)?.$el.setAttribute('style', 'z-index: 1500 !important;')
          }
        })
      }
    }).mount(parentEle).$el as HTMLElement
    elImg.onclick = (event) => {
      // 阻止事件冒泡 阻止默认的放大图片
      event.stopPropagation()
      handleImageClick()
    }
  })
}

/** 用于手机端的bottomBar, 跳转到评论区或者跳回正文 */
const jumpToComment = () => {
  console.log(bodyTextPos.value, commentPos.value)
  if (isAtComment.value) {
    // 当前已经是在评论区，需要跳转回正文
    // 记录一下当前所在的评论区位置，下次跳转到评论区能够继续浏览
    commentPos.value = window.scrollY
    window.scrollTo({
      top: bodyTextPos.value,
      behavior: 'smooth'
    })
  } else {
    const bottomActionTop = phoneArticleCommentsRef.value?.getBoundingClientRect().top as number
    // 当前在正文，需要跳转到评论区
    // 记录一下当前的正文位置
    bodyTextPos.value = window.scrollY
    window.scrollTo({
      top: commentPos.value || bottomActionTop + window.scrollY,
      behavior: 'smooth'
    })
  }
  isAtComment.value = !isAtComment.value
}

/** 文章中的图片的点击事件 */
const handleImageClick = () => {}

provide('blogProvide', { getArticleComment })
</script>
