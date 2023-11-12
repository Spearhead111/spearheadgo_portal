<template>
  <div class="flex flex-column flex" v-loading="loading">
    <iframe
      src="https://spearhead-cdn-1314941949.cos.ap-chengdu.myqcloud.com/writeHeadBanner/tortoise.html"
      frameborder="0"
      class="width-100 write-banner-iframe"
      scrolling="no"
    ></iframe>
    <v-container class="write-blog-wrapper">
      <v-form ref="form">
        <v-text-field
          class="pb-5"
          v-model="blogTitle"
          placeholder="请输入文章标题（最多15个字符）"
          hint="请输入文章标题（最多15个字符）"
          :counter="15"
          :rules="rules.blogTitle"
          variant="outlined"
          clearable
          label="文章标题"
        ></v-text-field>
        <v-text-field
          class="pb-5"
          v-model="blogSubtitle"
          placeholder="请输入文章副标题（最多20个字符）"
          hint="请输入文章副标题（最多20个字符）"
          :counter="20"
          :rules="rules.blogSubtitle"
          variant="outlined"
          clearable
          label="文章副标题"
        ></v-text-field>
        <v-textarea
          class="pb-5"
          v-model="blogDesc"
          placeholder="请输入文章描述（最多100个字符）"
          hint="请输入文章描述（最多100个字符）"
          :counter="100"
          :rules="rules.blogDesc"
          variant="outlined"
          clearable
          label="文章描述"
        ></v-textarea>
        <v-file-input
          class="pb-5"
          accept="image/*"
          label="文章封面"
          hint="请选择文章封面图片(仅支持最大1M)"
          prepend-icon=""
          append-inner-icon="mdi-image"
          v-model="blogBanner"
          :rules="rules.blogBanner"
          show-size
          counter
          chips
          variant="outlined"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="fileName in fileNames" :key="fileName">
              <v-chip size="small" label color="primary" class="me-2">
                {{ fileName }}
              </v-chip>
            </template>
          </template></v-file-input
        >
        <v-img
          class="mb-4"
          height="200"
          v-if="blogBanner.length || oldBlogInfo?.banner"
          :src="bannerImg as any"
        ></v-img>
        <v-select
          class="pb-5"
          label="文章标签"
          v-model="blogTags"
          :items="tagList"
          :counter="3"
          :rules="rules.blogTags"
          placeholder="最多选择3个标签"
          item-title="label"
          item-value="code"
          multiple
          chips
          clearable
          variant="outlined"
        >
          <!-- 选中的tag(chip)在select框中的插槽设置 -->
          <template #chip="{ item }">
            <v-chip :color="item.raw.color" variant="elevated"
              ><v-icon start :color="item.raw.iconColor" :icon="item.raw.icon"></v-icon
              ><span class="tag-label">{{ item.raw.label }}</span></v-chip
            >
          </template>

          <!-- 选中的tag(chip)在select下拉框中的插槽设置 -->
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <div class="flex justify-space-between">
                <v-chip class="rounded-lg" size="small" :color="item.raw.color" variant="elevated">
                  <v-icon start :color="item.raw.iconColor" :icon="item.raw.icon"> </v-icon>
                  <span class="tag-label">{{ item.raw.label }}</span>
                </v-chip>
                <v-icon
                  v-if="blogTags.includes(item.raw.code)"
                  color="info"
                  icon="mdi-check-circle"
                ></v-icon>
              </div>
            </v-list-item>
          </template>
        </v-select>
        <div class="flex align-center justify-space-between mb-2">
          <span style="font-size: 20px">文章内容</span>
          <v-tooltip text="预览">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-eye-outline"
                color="deep-purple-accent-4"
                size="x-small"
                @click="debouncePreviewBlog"
              >
              </v-btn>
            </template>
          </v-tooltip>
          <v-dialog
            v-model="previewBlogDialogVisible"
            :scrim="false"
            class="blog-preview-dialog pa-0 ma-0"
          >
            <Blog
              :type="BLOG_VISIBLE_TYPE.PREVIEW"
              :blogInfo="blogInfo"
              v-model:previewVisible="previewBlogDialogVisible"
            />
          </v-dialog>
        </div>
        <!-- MavonEditor富文本编辑器 -->
        <mavon-editor
          ref="mavonEditorRef"
          :class="['mb-8', 'mavon-editor', fullScreen ? 'fullScreen' : '']"
          v-model="blogContent"
          :ishljs="true"
          @imgAdd="imgAdd"
          @imgDel="imgDel"
          @fullScreen="fullScreen = !fullScreen"
        />
      </v-form>
      <div class="flex align-center justify-center">
        <v-btn prepend-icon="mdi-upload" color="deep-purple-accent-4" @click="debounceSubmitBlog">
          {{ `${isCreate ? '发布' : '更新'}文章` }}
        </v-btn>
        <v-dialog v-model="publishLoading" persistent width="auto">
          <v-card color="primary">
            <v-card-text>
              {{ `${isCreate ? '发布' : '更新'}中，请稍后` }}
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import './style.scss'
import { debounce, throttle } from 'lodash'
import Blog from '@/views/Blog/Blog.vue'
import { onMounted } from 'vue'
import { BLOG_VISIBLE_TYPE } from '@/constants/common'
import { ElMessage } from 'element-plus'
import { fileToURL } from '@/utils/common'
import useArticleStore from '@/stores/modules/article'
import useUserStore from '@/stores/modules/user'
import { type Tag, type TagSelect } from '../Home/Home.vue'
import { readonly } from 'vue'
import router from '@/router'
import { errorCodeMap } from '@/utils'

const { getUserId } = useUserStore()
const articleStore = useArticleStore()
const route = useRoute()
const isCreate = computed(() => route.query.type === 'create')
const articleId = computed(() => route.query.articleId)
const form = ref()
const mavonEditorRef = ref()
const blogTitle = ref('') // 文章标题
const blogSubtitle = ref('') // 文章副标题
const blogDesc = ref('') // 文章描述
const blogContent = ref<any>() // 文章内容
const blogBanner = ref<any[]>([]) // 上传文件的banner图片
const blogTags = ref<string[]>([]) // 文章标签
const fullScreen = ref(false) // 编辑器是否全屏

export interface BlogInfo {
  author: {
    id: string
    nickname: string
    username: string
  }
  id: number
  title: string
  subtitle: string
  content: string
  banner: string | File
  desc: string
  tags: Tag[]
  commentCount: number
  isActivated: number
  likeCount: number
  updateTime: number
  createTime: number
}

const oldBlogInfo = ref<BlogInfo>() // 修改文章时，文章的原来的数据
// 计算一下当前的文章信息
const blogInfo = computed<BlogInfo>(() => {
  const info = {
    ...(oldBlogInfo.value as BlogInfo),
    title: blogTitle.value.trim(),
    subtitle: blogSubtitle.value.trim(),
    content: blogContent.value,
    banner: blogBanner.value[0] || oldBlogInfo.value?.banner,
    desc: blogDesc.value.trim(),
    tags: tagList.value.filter((tag) => blogTags.value.includes(tag.code))
  }
  return info
})

const loading = ref(false) // 页面是否loading
const tagList = ref<Tag[]>([]) // 文章类型标签
const publishLoading = ref(false) // 发布文章loading
const previewBlogDialogVisible = ref(false) // 预览文章dialog显示
const rules = ref<any>({
  blogTitle: [
    (v: string) => !!v || '请输入文章标题',
    (v: string) => (v && v.length <= 15) || '文章标题长度不能超过15个字符'
  ],
  blogSubtitle: [
    (v: string) => !!v || '请输入文章副标题',
    (v: string) => (v && v.length <= 25) || '文章副标题长度不能超过25个字符'
  ],
  blogDesc: [
    (v: string) => !!v || '请输入文章描述',
    (v: string) => (v && v.length <= 100) || '文章副标题长度不能超过50个字符'
  ],
  blogTags: [
    (v: any[]) => v.length > 0 || '请至少选择一个文章标签',
    (v: any[]) => (v.length > 0 && v.length <= 3) || '文章最多选择3个标签'
  ],
  blogBanner: [
    (v: any) => {
      return !isCreate.value || !!v.length || '请选择文章封面图片'
    },
    (v: any) => {
      return !v || !v.length || v[0].size < 1000000 || '上传的文章封面图片不能超过1M'
    }
  ]
})

watch(blogBanner, (newVal, oldVal) => {
  if (newVal.length) {
  }
})

/** 分情况决定banner预览图片 */
const bannerImg = computed(() => {
  if (isCreate.value) {
    return fileToURL(blogBanner.value[0])
  } else {
    if (blogBanner.value.length) {
      // 如果在编辑状态下选择了一张新的banner图片
      return fileToURL(blogBanner.value[0])
    } else {
      return oldBlogInfo.value?.banner
    }
  }
})

onMounted(async () => {
  loading.value = true
  // 获取taglist
  await getArticleTagList()
  if (isCreate.value) {
    // 新建文章
  } else {
    // 编辑文章
    await getBlogDetail()
  }
  loading.value = false
})

/** 获取文章标签 */
const getArticleTagList = async () => {
  const res = await articleStore.getArticleTagList()
  if (res && res.result_code === 'success') {
    const { list, total } = res.data as { list: Tag[]; total: number }
    if (!list.length) {
      return
    }
    tagList.value = list
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** 编辑文章时，获取文章的详情 */
const getBlogDetail = async () => {
  const res = await articleStore.getArticleDetail(Number(articleId.value))
  if (res && res.result_code === 'success') {
    const data = res.data as any
    // 冻结一下原始文章数据
    oldBlogInfo.value = Object.freeze({
      ...data,
      tags: data.categories,
      createTime: new Date(data.createTime).getTime(),
      updateTime: new Date(data.updateTime).getTime()
    })
    blogTitle.value = data.title
    blogSubtitle.value = data.subtitle
    blogDesc.value = data.desc
    blogContent.value = data.content
    blogTags.value = data.categories.map((tag: Tag) => tag.code)
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** 预览文章 */
const previewBlog = async () => {
  const { valid } = await form.value.validate()
  // if (!valid) {
  //   ElMessage.error('请填写完整文章信息')
  //   return
  // }
  previewBlogDialogVisible.value = true
}

/** 防抖预览文章 */
const debouncePreviewBlog = debounce(previewBlog, 300)

/** 添加图片 */
const imgAdd = async (pos: string, file: File) => {
  if (file.size > 1024 * 1024 * 1) {
    return ElMessage.error('图片大小不能超过1M')
  }
  const fileNameArr = file.name.split('.')

  // 拼接一下图片的名字
  const params = {
    key: new Date().getTime() + '_' + getUserId + '.' + fileNameArr[fileNameArr.length - 1],
    size: file.size
  }
  const res = await articleStore.uploadArticleImgPermission(params)
  if (res && res.result_code === 'success') {
    const data: { imgUrl: string; uploadUrl: string } = res.data as any
    if (!data.imgUrl || !data.uploadUrl) {
      return ElMessage.error('上传图片失败')
    }
    const signedUrl = data.uploadUrl as string
    // 创建一个 FormData 对象，用于包含文件
    const formData = new FormData()
    formData.append('file', file)
    // 创建一个 HTTP PUT 请求，将文件上传到预签名 URL
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type // 设置文件的 Content-Type
      }
    })
    if (response.status === 200) {
      mavonEditorRef.value.$img2Url(pos, data.imgUrl)
    }
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

const imgDel = async (pos: string, file: File) => {}

/** 发布/更新文章 */
const submitBlog = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return ElMessage.error('请检查填写信息')
  }
  publishLoading.value = true

  const formData = new FormData()
  formData.append('title', blogInfo.value.title)
  formData.append('subtitle', blogInfo.value.subtitle)
  formData.append('content', blogInfo.value.content)
  // 判断有没有选择封面图片文件，新建文件必须要选择，更新可以不选择(就是不更改，还是之前的imgUrl)
  if (typeof blogInfo.value.banner !== 'string') {
    const fileType = (blogInfo.value.banner as File).name.split('.').pop() as string
    formData.append('banner', new Blob([blogInfo.value.banner as File]))
    formData.append('fileType', fileType)
  } else {
    formData.append('banner', blogInfo.value.banner)
  }
  formData.append('tags', JSON.stringify(blogInfo.value.tags))
  formData.append('desc', blogInfo.value.desc)
  if (isCreate.value) {
    // 发布新文章
    const res = await articleStore.createArticle(formData)
    if (res && res.result_code === 'success') {
      ElMessage.success('发布文章成功')
      // 更新文章成功跳转到文章详情页面
      nextTick(() => routeToArticleDetail(String((res.data as any).articleId)))
    } else {
      ElMessage(errorCodeMap(res.result_code, res.message))
    }
  } else {
    // 更新文章
    const res = await articleStore.updateArticle({ articleId: articleId.value, body: formData })
    if (res && res.result_code === 'success') {
      ElMessage.success('更新文章成功')
      // 更新文章成功跳转到文章详情页面
      nextTick(() => routeToArticleDetail(String(articleId.value)))
    } else {
      ElMessage(errorCodeMap(res.result_code, res.message))
    }
  }
  publishLoading.value = false
}

/**
 * 跳转到文章详情的路由
 * @param articleId 文章ID
 */
const routeToArticleDetail = (articleId: string | number) => {
  router.push({ name: 'ArticleDetail', query: { articleId } })
}

/** 防抖发布文章 */
const debounceSubmitBlog = debounce(submitBlog, 300)
</script>
