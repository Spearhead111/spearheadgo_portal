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
          v-if="blogBanner.length || blogBannerUrl"
          :src="bannerImg"
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
        <mavon-editor class="mb-8 mavon-editor" v-model="blogContent" :ishljs="true" />
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import './style.scss'
import { debounce, throttle } from 'lodash'
import Blog from '@/views/Blog/Blog.vue'
import { onMounted } from 'vue'
import { BLOG_VISIBLE_TYPE } from '@/constants/common'
import { ElMessage } from 'element-plus'
import { fileToURL } from '@/utils/common'

const route = useRoute()
const isCreate = computed(() => route.query.type === 'create')
const articleId = computed(() => route.query.articleId)
const form = ref()
const blogTitle = ref('') // 文章标题
const blogSubtitle = ref('') // 文章副标题
const blogDesc = ref('') // 文章描述
const blogContent = ref<any>() // 文章内容
const blogBanner = ref<any[]>([]) // 上传文件的banner图片
const blogBannerUrl = ref('') // 编辑文章时返回的banner url
const blogTags = ref<string[]>([]) // 文章标签
const blogInfo = computed(() => {
  const info = {
    title: blogTitle.value.trim(),
    subtitle: blogSubtitle.value.trim(),
    content: blogContent.value,
    banner: blogBanner.value[0] || blogBannerUrl.value,
    desc: blogDesc.value.trim(),
    tags: tagList.value.filter((tag) => blogTags.value.includes(tag.code))
  }
  return info
})
const loading = ref(false) // 页面是否loading
const tagList = ref<any[]>([]) // 文章类型标签
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

/** 分情况决定banner预览图片 */
const bannerImg = computed(() => {
  if (isCreate.value) {
    return fileToURL(blogBanner.value[0])
  } else {
    if (blogBanner.value.length) {
      // 如果在编辑状态下选择了一张新的banner图片
      return fileToURL(blogBanner.value[0])
    } else {
      return blogBannerUrl.value
    }
  }
})

onMounted(async () => {
  loading.value = true
  // 获取taglist
  await getTaglist()
  if (isCreate.value) {
    // 新建文章
  } else {
    console.log(articleId.value)
    // 编辑文章
    await getBlogDetail()
  }
  loading.value = false
})

/** 获取文章可选标签类型 */
const getTaglist = async () => {
  for (let i = 0; i < 10; i++) {
    tagList.value.push({
      label: 'label' + i,
      code: 'code' + i,
      icon: 'mdi-github',
      iconColor: 'white',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      selected: false
    })
  }
}

/** 编辑文章时，获取文章的详情 */
const getBlogDetail = async () => {
  const res = {
    title: '接口返回标题',
    subtitle: '接口返回副标题',
    desc: '接口返回描述',
    content:
      '**阿松大**\n阿松大\n## 萨达\n++萨达++\n> 阿松大\n```js\nconst a = 23\n```\nad\nad\nad\nad\nad\nad\nad\nad\nad\nad\nad\nad\nad\nad\n',
    bannerUrl: 'https://spearhead-cdn-1314941949.cos.ap-chengdu.myqcloud.com//53.jpg',
    tags: [
      {
        label: 'label' + 1,
        code: 'code' + 1,
        icon: 'mdi-magnify',
        iconColor: 'white',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      },
      {
        label: 'label' + 2,
        code: 'code' + 2,
        icon: 'mdi-label',
        iconColor: 'white',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      },
      {
        label: 'label' + 3,
        code: 'code' + 3,
        icon: 'mdi-label',
        iconColor: 'white',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      }
    ]
  }
  blogTitle.value = res.title
  blogSubtitle.value = res.subtitle
  blogDesc.value = res.desc
  blogContent.value = res.content
  blogBannerUrl.value = res.bannerUrl
  blogTags.value = res.tags.map((tag) => tag.code)
}

/** 预览文章 */
const previewBlog = async () => {
  const { valid } = await form.value.validate()
  // if (!valid) {
  //   ElMessage.error('请填写完整文章信息')
  //   return
  // }
  // const params = {
  //   blogTitle: blogTitle.value,
  //   blogSubtitle: blogSubtitle.value,
  //   blogContent: blogContent.value,
  //   blogBanner: blogBanner.value,
  //   blogTags: blogTags.value
  // }
  // console.log(params, '预览文章！！！')
  previewBlogDialogVisible.value = true
}

/** 防抖预览文章 */
const debouncePreviewBlog = debounce(previewBlog, 300)

/** 发布/更新文章 */
const submitBlog = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  const params = {
    blogTitle: blogTitle.value,
    blogSubtitle: blogSubtitle.value,
    blogContent: blogContent.value,
    blogBanner: blogBanner.value,
    blogTags: blogTags.value
  }
  publishLoading.value = true
  setTimeout(() => {
    console.log(params, '发布文章！！！')
    publishLoading.value = false
    ElMessage.success(`${isCreate.value ? '发布' : '更新'}成功`)
  }, 1000)
}

/** 防抖发布文章 */
const debounceSubmitBlog = debounce(submitBlog, 300)
</script>
